-- Add logo_url column to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN logo_url TEXT NULL;