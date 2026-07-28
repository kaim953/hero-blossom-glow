import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember, TeamMemberFormData, TeamMemberFormSchema } from "@/types/team";
import { useToast } from "@/hooks/use-toast";

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    },
  });
};

export const useTeamMemberById = (id: string) => {
  return useQuery({
    queryKey: ["team-member", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as TeamMember | null;
    },
    enabled: !!id,
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (member: TeamMemberFormData) => {
      const validationResult = TeamMemberFormSchema.safeParse(member);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        throw new Error(firstError.message);
      }

      // Get the max display_order to add new member at the end
      const { data: existingMembers } = await supabase
        .from("team_members")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1);

      const maxOrder = existingMembers?.[0]?.display_order ?? -1;

      const normalizedMember = {
        name: validationResult.data.name,
        photo_url: validationResult.data.photo_url || null,
        position: validationResult.data.position,
        social_link: validationResult.data.social_link || null,
        display_order: maxOrder + 1,
      };

      const { data, error } = await supabase
        .from("team_members")
        .insert([normalizedMember])
        .select()
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: "Team member created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating team member", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, member }: { id: string; member: Partial<TeamMemberFormData> }) => {
      const partialSchema = TeamMemberFormSchema.partial();
      const validationResult = partialSchema.safeParse(member);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        throw new Error(firstError.message);
      }

      const validatedData = validationResult.data;
      const normalizedMember: Record<string, unknown> = { ...validatedData };
      if (validatedData.photo_url !== undefined) {
        normalizedMember.photo_url = validatedData.photo_url || null;
      }
      if (validatedData.social_link !== undefined) {
        normalizedMember.social_link = validatedData.social_link || null;
      }

      const { data, error } = await supabase
        .from("team_members")
        .update(normalizedMember as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["team-member"] });
      toast({ title: "Team member updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating team member", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateTeamMemberSilent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, member }: { id: string; member: Partial<TeamMemberFormData> }) => {
      // No validation for auto-save - just normalize and save
      const normalizedMember: Record<string, unknown> = { ...member };
      if (member.photo_url !== undefined) {
        normalizedMember.photo_url = member.photo_url || null;
      }
      if (member.social_link !== undefined) {
        normalizedMember.social_link = member.social_link || null;
      }

      const { data, error } = await supabase
        .from("team_members")
        .update(normalizedMember as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["team-member"] });
    },
    onError: (error: Error) => {
      toast({ title: "Auto-save failed", description: error.message, variant: "destructive" });
    },
  });
};

export const useCreateTeamMemberSilent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (member: TeamMemberFormData) => {
      // Get the max display_order to add new member at the end
      const { data: existingMembers } = await supabase
        .from("team_members")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1);

      const maxOrder = existingMembers?.[0]?.display_order ?? -1;

      const normalizedMember = {
        name: member.name || "Untitled Draft",
        photo_url: member.photo_url || null,
        position: member.position || "Draft",
        social_link: member.social_link || null,
        display_order: maxOrder + 1,
      };

      const { data, error } = await supabase
        .from("team_members")
        .insert([normalizedMember])
        .select()
        .single();

      if (error) throw error;
      return data as TeamMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (error: Error) => {
      toast({ title: "Auto-save failed", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error("Invalid member ID");
      }

      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: "Team member deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting team member", description: error.message, variant: "destructive" });
    },
  });
};

export const useReorderTeamMembers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const updates = orderedIds.map((id, index) => 
        supabase
          .from("team_members")
          .update({ display_order: index })
          .eq("id", id)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw new Error("Failed to update order");
      }
    },
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: ["team-members"] });
      const previousMembers = queryClient.getQueryData<TeamMember[]>(["team-members"]);
      
      queryClient.setQueryData<TeamMember[]>(["team-members"], (old) => {
        if (!old) return old;
        return orderedIds
          .map((id) => old.find((m) => m.id === id))
          .filter((m): m is TeamMember => m !== undefined);
      });
      
      return { previousMembers };
    },
    onError: (error: Error, _orderedIds, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(["team-members"], context.previousMembers);
      }
      toast({ title: "Error reordering members", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};
