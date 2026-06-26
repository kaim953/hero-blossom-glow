import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, PUT, PATCH, DELETE, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Entry-point logging for debugging
  console.log(`[admin-users] ${req.method} request received`);
  console.log(`[admin-users] Auth header present: ${!!req.headers.get("Authorization")}`);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create client with user's token to verify they're an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      console.error("Failed to get user:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user is admin
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (rolesError) {
      console.error("Failed to fetch roles:", rolesError);
      return new Response(JSON.stringify({ error: "Failed to verify permissions" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isAdmin = roles?.some((r) => r.role === "admin");
    if (!isAdmin) {
      console.error("User is not an admin:", user.id);
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Admin user verified:", user.email);

    // Handle different HTTP methods
    switch (req.method) {
      case "GET": {
        // List all users with their roles
        console.log("Fetching all users...");
        
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) {
          console.error("Failed to list users:", listError);
          return new Response(JSON.stringify({ error: "Failed to list users" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Get all roles
        const { data: allRoles, error: allRolesError } = await supabaseAdmin
          .from("user_roles")
          .select("user_id, role");

        if (allRolesError) {
          console.error("Failed to fetch all roles:", allRolesError);
        }

        // Combine users with their roles
        const usersWithRoles = users.map((u) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          roles: allRoles?.filter((r) => r.user_id === u.id).map((r) => r.role) || [],
        }));

        console.log(`Found ${usersWithRoles.length} users`);

        return new Response(JSON.stringify({ users: usersWithRoles }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "POST": {
        // Invite new user via magic link
        const body = await req.json();
        const email = body?.email;
        const role = body?.role || "admin";
        
        if (!email) {
          return new Response(JSON.stringify({ error: "Email is required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return new Response(JSON.stringify({ error: "Invalid email format" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Validate role
        const validRoles = ["admin", "editor"];
        if (!validRoles.includes(role)) {
          return new Response(JSON.stringify({ error: "Invalid role. Must be admin or editor" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        console.log("Inviting user:", email, "with role:", role);

        // Use inviteUserByEmail to send a magic link invitation
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

        if (inviteError) {
          console.error("Failed to invite user:", inviteError);
          return new Response(JSON.stringify({ error: inviteError.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Assign role to the new user
        const { error: roleError } = await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: inviteData.user.id, role });

        if (roleError) {
          console.error("Failed to assign role:", roleError);
        }

        console.log("User invited successfully:", inviteData.user.id);

        return new Response(
          JSON.stringify({ 
            user: { 
              id: inviteData.user.id, 
              email: inviteData.user.email,
              roles: [role],
            },
            message: "Invitation email sent! The user will receive a magic link to access their account." 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "PATCH": {
        // Update user role
        const body = await req.json();
        const userId = body?.userId;
        const role = body?.role;
        const action = body?.action;

        if (!userId || !role) {
          return new Response(JSON.stringify({ error: "userId and role are required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
          return new Response(JSON.stringify({ error: "Invalid userId format" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Validate role
        const validRoles = ["admin", "editor"];
        if (!validRoles.includes(role)) {
          return new Response(JSON.stringify({ error: "Invalid role. Must be admin or editor" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Validate action
        if (action !== "add" && action !== "remove") {
          return new Response(JSON.stringify({ error: "Invalid action. Must be 'add' or 'remove'" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        console.log("Updating role for user:", userId, "action:", action, "role:", role);

        if (action === "add") {
          // Add role
          const { error: addError } = await supabaseAdmin
            .from("user_roles")
            .upsert({ user_id: userId, role }, { onConflict: "user_id,role" });

          if (addError) {
            console.error("Failed to add role:", addError);
            return new Response(JSON.stringify({ error: "Failed to add role" }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        } else if (action === "remove") {
          // Remove role
          const { error: removeError } = await supabaseAdmin
            .from("user_roles")
            .delete()
            .eq("user_id", userId)
            .eq("role", role);

          if (removeError) {
            console.error("Failed to remove role:", removeError);
            return new Response(JSON.stringify({ error: "Failed to remove role" }), {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        console.log("Role updated successfully");

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "DELETE": {
        // Delete user
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        if (!userId) {
          return new Response(JSON.stringify({ error: "userId is required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
          return new Response(JSON.stringify({ error: "Invalid userId format" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Prevent self-deletion
        if (userId === user.id) {
          return new Response(JSON.stringify({ error: "Cannot delete your own account" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        console.log("Deleting user:", userId);

        // Delete from auth (this will cascade delete from user_roles due to FK)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
          console.error("Failed to delete user:", deleteError);
          return new Response(JSON.stringify({ error: "Failed to delete user" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        console.log("User deleted successfully");

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
