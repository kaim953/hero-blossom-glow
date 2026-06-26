import { z } from 'zod';

// Zod validation schema for blog post form data
export const BlogPostFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  thumbnail_url: z.string().url("Invalid URL format").nullable().or(z.literal("")),
  logo_url: z.string().url("Invalid URL format").nullable().or(z.literal("")),
  brief_intro: z.string().max(500, "Brief intro must be less than 500 characters"),
  published_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  author_id: z.string().uuid("Invalid author ID").nullable(),
  read_time: z.number().int().min(1, "Read time must be at least 1 minute").max(999, "Read time must be less than 1000 minutes"),
  gallery: z.array(z.string().url("Invalid gallery URL")).max(20, "Gallery can have at most 20 images"),
  content: z.string().max(100000, "Content must be less than 100,000 characters"),
  related_posts: z.array(z.string().uuid("Invalid related post ID")).max(10, "Can have at most 10 related posts"),
  is_published: z.boolean(),
});

export type BlogPostFormData = z.infer<typeof BlogPostFormSchema>;

// Author type from joined team_members (used in admin queries)
export interface BlogPostAuthor {
  id: string;
  name: string;
  photo_url: string | null;
  position: string | null;
}

// Full blog post type (used in admin - includes author_id)
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  logo_url: string | null;
  brief_intro: string | null;
  published_date: string | null;
  author_id: string | null;
  author: BlogPostAuthor | null;
  read_time: number | null;
  gallery: string[];
  content: string | null;
  related_posts: string[];
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Public blog post type (from view - no author_id exposed)
export interface BlogPostPublic {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  logo_url: string | null;
  brief_intro: string | null;
  published_date: string | null;
  read_time: number | null;
  gallery: string[];
  content: string | null;
  related_posts: string[];
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Author info flattened (no UUID exposed)
  author_name: string | null;
  author_photo_url: string | null;
  author_position: string | null;
}
