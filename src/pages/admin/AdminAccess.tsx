import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AdminNavbar from "@/components/AdminNavbar";
import AdminLabel from "@/components/admin/AdminLabel";
import FilledButton from "@/components/FilledButton";
import OutlineButton from "@/components/OutlineButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  CircleNotch, 
  UserPlus, 
  Trash, 
  Shield, 
  PencilSimple,
  User as UserIcon,
} from "@phosphor-icons/react";
import emptyStateImage from "@/assets/Friendly_Cartoon_Circle.png";
import { format } from "date-fns";
import {
  AdminTableContainer,
  AdminTable,
  AdminTableHeader,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableActionButton,
  AdminTableLoading,
  AdminTableEmptyState,
} from "@/components/admin/AdminTable";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
}

const AdminAccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor">("admin");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pendingRoles, setPendingRoles] = useState<{ admin: boolean; editor: boolean }>({
    admin: false,
    editor: false,
  });
  const [isSavingRoles, setIsSavingRoles] = useState(false);

  // Initialize pending roles when editing user changes
  useEffect(() => {
    if (editingUser) {
      setPendingRoles({
        admin: editingUser.roles.includes("admin"),
        editor: editingUser.roles.includes("editor"),
      });
    }
  }, [editingUser]);

  // Fetch users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("admin-users", {
        method: "GET",
      });

      if (response.error) throw new Error(response.error.message);
      return response.data.users as User[];
    },
  });

  // Show error as toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Invite user mutation
  const inviteUser = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await supabase.functions.invoke("admin-users", {
        method: "POST",
        body: { email, role },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsInviteDialogOpen(false);
      setInviteEmail("");
      setInviteRole("admin");
      toast({
        title: "User created",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update role mutation
  const updateRole = useMutation({
    mutationFn: async ({ 
      userId, 
      role, 
      action 
    }: { 
      userId: string; 
      role: string; 
      action: "add" | "remove" 
    }) => {
      const response = await supabase.functions.invoke("admin-users", {
        method: "PATCH",
        body: { userId, role, action },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const response = await supabase.functions.invoke("admin-users", {
        method: "DELETE",
        body: {},
        headers: {},
      });

      // Use query params for DELETE
      const { data, error } = await supabase.functions.invoke(
        `admin-users?userId=${userId}`,
        { method: "DELETE" }
      );

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDeleteUserId(null);
      toast({ title: "User deleted" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteUser.mutate({ email: inviteEmail, role: inviteRole });
  };

  const handleSaveRoles = async () => {
    if (!editingUser) return;
    
    setIsSavingRoles(true);
    const currentRoles = editingUser.roles;
    const mutations: { userId: string; role: string; action: "add" | "remove" }[] = [];

    // Check admin role changes
    if (pendingRoles.admin && !currentRoles.includes("admin")) {
      mutations.push({ userId: editingUser.id, role: "admin", action: "add" });
    } else if (!pendingRoles.admin && currentRoles.includes("admin")) {
      mutations.push({ userId: editingUser.id, role: "admin", action: "remove" });
    }

    // Check editor role changes
    if (pendingRoles.editor && !currentRoles.includes("editor")) {
      mutations.push({ userId: editingUser.id, role: "editor", action: "add" });
    } else if (!pendingRoles.editor && currentRoles.includes("editor")) {
      mutations.push({ userId: editingUser.id, role: "editor", action: "remove" });
    }

    try {
      for (const mutation of mutations) {
        await updateRole.mutateAsync(mutation);
      }
      toast({ title: "Roles updated successfully" });
      setEditingUser(null);
    } catch (error) {
      // Error is already handled by mutation's onError
    } finally {
      setIsSavingRoles(false);
    }
  };

  const getRoleBadge = (roles: string[]) => {
    if (roles.includes("admin")) {
      return <AdminLabel icon={Shield}>Admin</AdminLabel>;
    }
    return <AdminLabel icon={PencilSimple}>Editor</AdminLabel>;
  };

  return (
    <div className="min-h-screen bg-neutral-01">
      <AdminNavbar />

      <main className="admin-page-header section">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-neutral-12 mb-4">Admin access</h2>
              <p className="text-body-large text-neutral-10">
                Invite and manage your team
              </p>
            </div>

            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <OutlineButton icon={<UserPlus size={16} />} className="hidden tablet:flex">
                    Add user
                  </OutlineButton>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleInvite} className="flex flex-col gap-10">
                    <DialogHeader>
                      <DialogTitle>Add new user</DialogTitle>
              <DialogDescription>
                Add a new user to the admin panel. They'll receive a login link to sign in.
              </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="user@example.com"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={inviteRole}
                          onValueChange={(v) => setInviteRole(v as "admin" | "editor")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <OutlineButton
                        type="button"
                        onClick={() => setIsInviteDialogOpen(false)}
                      >
                        Cancel
                      </OutlineButton>
                      <FilledButton
                        type="submit"
                        showArrow={false}
                        disabled={inviteUser.isPending}
                      >
                        {inviteUser.isPending ? (
                          <CircleNotch size={16} className="animate-spin" />
                        ) : (
                          "Create User"
                        )}
                      </FilledButton>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
          </div>

          {/* Floating action button for mobile */}
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <div className="fixed bottom-6 right-6 z-50 tablet:hidden">
                <OutlineButton icon={<UserPlus size={16} />}>
                  Add User
                </OutlineButton>
              </div>
            </DialogTrigger>
          </Dialog>

          {isLoading ? (
            <AdminTableLoading />
          ) : users && users.length > 0 ? (
            <AdminTableContainer>
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <AdminTableHead>Email</AdminTableHead>
                    <AdminTableHead>Role</AdminTableHead>
                    <AdminTableHead>Created</AdminTableHead>
                    <AdminTableHead>Last Sign In</AdminTableHead>
                    <AdminTableHead align="right">Actions</AdminTableHead>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {users.map((u) => (
                    <AdminTableRow key={u.id}>
                      <AdminTableCell>
                        <p className="text-body text-neutral-12">
                          {u.email}
                          {u.id === user?.id && (
                            <span className="ml-2 text-body-small text-neutral-08">
                              (you)
                            </span>
                          )}
                        </p>
                      </AdminTableCell>
                      <AdminTableCell>{getRoleBadge(u.roles)}</AdminTableCell>
                      <AdminTableCell>
                        <span className="text-body text-neutral-10">
                          {format(new Date(u.created_at), "MMM d, yyyy")}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <span className="text-body text-neutral-10">
                          {u.last_sign_in_at
                            ? format(new Date(u.last_sign_in_at), "MMM d, yyyy")
                            : "Never"}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell align="right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit roles dialog */}
                          <Dialog
                            open={editingUser?.id === u.id}
                            onOpenChange={(open) =>
                              setEditingUser(open ? u : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <AdminTableActionButton
                                disabled={u.id === user?.id}
                              >
                                <Shield size={16} />
                              </AdminTableActionButton>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manage roles</DialogTitle>
                                <DialogDescription>
                                  Update roles for {u.email}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col gap-6 mt-10">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-body font-medium text-neutral-12">
                                      Admin
                                    </p>
                                    <p className="text-body-small text-neutral-08">
                                      Full access to all features
                                    </p>
                                  </div>
                                  <Switch
                                    checked={pendingRoles.admin}
                                    onCheckedChange={(checked) =>
                                      setPendingRoles((prev) => ({ ...prev, admin: checked }))
                                    }
                                    disabled={isSavingRoles}
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-body font-medium text-neutral-12">
                                      Editor
                                    </p>
                                    <p className="text-body-small text-neutral-08">
                                      Can create and edit blog posts
                                    </p>
                                  </div>
                                  <Switch
                                    checked={pendingRoles.editor}
                                    onCheckedChange={(checked) =>
                                      setPendingRoles((prev) => ({ ...prev, editor: checked }))
                                    }
                                    disabled={isSavingRoles}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <FilledButton
                                  onClick={handleSaveRoles}
                                  showArrow={false}
                                  disabled={isSavingRoles}
                                >
                                  {isSavingRoles ? (
                                    <CircleNotch size={16} className="animate-spin" />
                                  ) : (
                                    "Save changes"
                                  )}
                                </FilledButton>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Delete user */}
                          <AlertDialog
                            open={deleteUserId === u.id}
                            onOpenChange={(open) =>
                              setDeleteUserId(open ? u.id : null)
                            }
                          >
                            <AlertDialogTrigger asChild>
                              <AdminTableActionButton
                                disabled={u.id === user?.id}
                              >
                                <Trash size={16} className="text-red-500" />
                              </AdminTableActionButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete user?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently
                                  delete the user "{u.email}" and all their data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <OutlineButton
                                  onClick={() => setDeleteUserId(null)}
                                >
                                  Cancel
                                </OutlineButton>
                                <FilledButton
                                  onClick={() => deleteUser.mutate(u.id)}
                                  showArrow={false}
                                  disabled={deleteUser.isPending}
                                >
                                  {deleteUser.isPending ? (
                                    <CircleNotch size={16} className="animate-spin" />
                                  ) : (
                                    "Delete"
                                  )}
                                </FilledButton>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            </AdminTableContainer>
          ) : (
            <AdminTableEmptyState
              image={emptyStateImage}
              imageAlt="No users illustration"
              message="No users found"
              actionLabel="Add your first user"
              actionIcon={<UserPlus size={16} />}
              onAction={() => setIsInviteDialogOpen(true)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAccess;
