-- Fix 1: Remove overly permissive blog_posts SELECT policy and add proper admin/editor access
DROP POLICY IF EXISTS "Authenticated users can read all posts" ON public.blog_posts;

-- Add policy for admins/editors to read ALL posts (including drafts)
CREATE POLICY "Admins and editors can read all posts"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)
);

-- Fix 2: Restrict storage policies to admin/editor roles only
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Create role-based storage policies
CREATE POLICY "Admins and editors can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role))
);

CREATE POLICY "Admins and editors can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role))
);

CREATE POLICY "Admins and editors can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role))
);