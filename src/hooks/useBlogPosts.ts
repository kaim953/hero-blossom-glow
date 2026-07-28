import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogPostPublic, BlogPostFormData, BlogPostFormSchema } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";

// Public blog posts query - uses secure view that doesn't expose author_id
export const useBlogPostsPublic = () => {
  return useQuery({
    queryKey: ["blog-posts-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts_public" as any)
        .select("*")
        .order("published_date", { ascending: false });

      if (error) throw error;
      return data as unknown as BlogPostPublic[];
    },
  });
};

// Admin blog posts query - includes author_id for editing
export const useBlogPostsAdmin = () => {
  return useQuery({
    queryKey: ["blog-posts-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, author:team_members(id, name, photo_url, position)")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

// Legacy hook for backward compatibility
export const useBlogPosts = (publishedOnly = true) => {
  return useQuery({
    queryKey: ["blog-posts", publishedOnly],
    queryFn: async () => {
      if (publishedOnly) {
        // Public: use secure view
        const { data, error } = await supabase
          .from("blog_posts_public" as any)
          .select("*")
          .order("published_date", { ascending: false });

        if (error) throw error;
        return data as unknown as BlogPostPublic[];
      } else {
        // Admin: use full table with author join
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*, author:team_members(id, name, photo_url, position)")
          .order("display_order", { ascending: true });

        if (error) throw error;
        return data as BlogPost[];
      }
    },
  });
};

// Public single post query - uses secure view
export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts_public" as any)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as BlogPostPublic | null;
    },
    enabled: !!slug,
  });
};

// Public related posts query - uses secure view
export const useRelatedPosts = (postIds: string[]) => {
  return useQuery({
    queryKey: ["related-posts", postIds],
    queryFn: async () => {
      if (postIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("blog_posts_public" as any)
        .select("*")
        .in("id", postIds);

      if (error) throw error;
      return data as unknown as BlogPostPublic[];
    },
    enabled: postIds.length > 0,
  });
};

export const useBlogPostById = (id: string) => {
  return useQuery({
    queryKey: ["blog-post-id", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, author:team_members(id, name, photo_url, position)")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!id,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (post: BlogPostFormData) => {
      // Validate input before submission
      const validationResult = BlogPostFormSchema.safeParse(post);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        throw new Error(firstError.message);
      }

      // Normalize empty thumbnail_url and logo_url to null
      const normalizedPost = {
        title: validationResult.data.title,
        slug: validationResult.data.slug,
        thumbnail_url: validationResult.data.thumbnail_url || null,
        logo_url: validationResult.data.logo_url || null,
        brief_intro: validationResult.data.brief_intro,
        published_date: validationResult.data.published_date,
        author_id: validationResult.data.author_id,
        read_time: validationResult.data.read_time,
        gallery: validationResult.data.gallery,
        content: validationResult.data.content,
        related_posts: validationResult.data.related_posts,
        is_published: validationResult.data.is_published,
      };

      const { data, error } = await supabase
        .from("blog_posts")
        .insert([normalizedPost])
        .select()
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({ title: "Post created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating post", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, post }: { id: string; post: Partial<BlogPostFormData> }) => {
      // Validate partial input - only validate fields that are present
      const partialSchema = BlogPostFormSchema.partial();
      const validationResult = partialSchema.safeParse(post);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        throw new Error(firstError.message);
      }

      // Normalize empty thumbnail_url and logo_url to null if present
      const validatedData = validationResult.data;
      const normalizedPost: Record<string, unknown> = { ...validatedData };
      if (validatedData.thumbnail_url !== undefined) {
        normalizedPost.thumbnail_url = validatedData.thumbnail_url || null;
      }
      if (validatedData.logo_url !== undefined) {
        normalizedPost.logo_url = validatedData.logo_url || null;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .update(normalizedPost as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post-id"] });
      toast({ title: "Post updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating post", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateBlogPostSilent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, post }: { id: string; post: Partial<BlogPostFormData> }) => {
      // No validation for auto-save - just normalize and save
      const normalizedPost: Record<string, unknown> = { ...post };
      if (post.thumbnail_url !== undefined) {
        normalizedPost.thumbnail_url = post.thumbnail_url || null;
      }
      if (post.logo_url !== undefined) {
        normalizedPost.logo_url = post.logo_url || null;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .update(normalizedPost as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post-id"] });
    },
    onError: (error: Error) => {
      toast({ title: "Auto-save failed", description: error.message, variant: "destructive" });
    },
  });
};

export const useCreateBlogPostSilent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (post: BlogPostFormData) => {
      // Normalize empty thumbnail_url and logo_url to null
      const normalizedPost = {
        title: post.title || "Untitled Draft",
        slug: post.slug || `draft-${Date.now()}`,
        thumbnail_url: post.thumbnail_url || null,
        logo_url: post.logo_url || null,
        brief_intro: post.brief_intro,
        published_date: post.published_date,
        author_id: post.author_id,
        read_time: post.read_time,
        gallery: post.gallery,
        content: post.content,
        related_posts: post.related_posts,
        is_published: false, // Always create as draft
      };

      const { data, error } = await supabase
        .from("blog_posts")
        .insert([normalizedPost])
        .select()
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
    onError: (error: Error) => {
      toast({ title: "Auto-save failed", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Validate ID is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new Error("Invalid post ID");
      }

      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({ title: "Post deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting post", description: error.message, variant: "destructive" });
    },
  });
};

export const useReorderBlogPosts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const updates = orderedIds.map((id, index) => 
        supabase
          .from("blog_posts")
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
      await queryClient.cancelQueries({ queryKey: ["blog-posts", false] });
      const previousPosts = queryClient.getQueryData<BlogPost[]>(["blog-posts", false]);
      
      queryClient.setQueryData<BlogPost[]>(["blog-posts", false], (old) => {
        if (!old) return old;
        return orderedIds
          .map((id) => old.find((p) => p.id === id))
          .filter((p): p is BlogPost => p !== undefined);
      });
      
      return { previousPosts };
    },
    onError: (error: Error, _orderedIds, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["blog-posts", false], context.previousPosts);
      }
      toast({ title: "Error reordering posts", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
};
