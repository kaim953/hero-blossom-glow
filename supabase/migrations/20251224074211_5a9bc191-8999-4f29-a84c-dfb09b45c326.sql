-- Add display_order column to blog_posts table for ordering
ALTER TABLE public.blog_posts 
ADD COLUMN display_order integer NOT NULL DEFAULT 0;

-- Create index for efficient ordering
CREATE INDEX idx_blog_posts_display_order ON public.blog_posts(display_order);