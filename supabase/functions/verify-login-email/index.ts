import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 attempts per minute per IP
const ipAttempts = new Map<string, { count: number; resetAt: number }>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const now = Date.now();
    const attempts = ipAttempts.get(clientIP);
    
    if (attempts && attempts.resetAt > now) {
      if (attempts.count >= RATE_LIMIT_MAX_REQUESTS) {
        console.log(`Rate limit exceeded for IP: ${clientIP}`);
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      attempts.count++;
    } else {
      ipAttempts.set(clientIP, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }
    
    // Cleanup old entries periodically (1% chance per request)
    if (Math.random() < 0.01) {
      for (const [ip, data] of ipAttempts.entries()) {
        if (data.resetAt < now) ipAttempts.delete(ip);
      }
    }

    const { email } = await req.json();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check if user exists
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error listing users:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to verify email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const registered = users.some(u => u.email?.toLowerCase() === email.toLowerCase());
    
    console.log(`Email check for ${email}: ${registered ? 'registered' : 'not registered'}`);

    return new Response(
      JSON.stringify({ registered }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
