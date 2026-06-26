-- Delete any existing 'user' roles
DELETE FROM public.user_roles WHERE role = 'user';

-- Drop all dependent policies first
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins and editors can insert posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins and editors can update posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins and editors can delete posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins and editors can read all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins and editors can insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins and editors can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins and editors can delete team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins and editors can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can delete blog images" ON storage.objects;

-- Drop the function that depends on the enum
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Recreate the enum without 'user'
ALTER TYPE public.app_role RENAME TO app_role_old;
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');
ALTER TABLE public.user_roles 
  ALTER COLUMN role TYPE public.app_role 
  USING role::text::public.app_role;
DROP TYPE public.app_role_old;

-- Recreate the has_role function with new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Recreate user_roles policies
CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Recreate blog_posts policies
CREATE POLICY "Admins and editors can insert posts" ON public.blog_posts
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can update posts" ON public.blog_posts
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can delete posts" ON public.blog_posts
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can read all posts" ON public.blog_posts
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Recreate team_members policies
CREATE POLICY "Admins and editors can insert team members" ON public.team_members
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can update team members" ON public.team_members
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can delete team members" ON public.team_members
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Recreate storage policies
CREATE POLICY "Admins and editors can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Admins and editors can update blog images" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Admins and editors can delete blog images" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

-- Update the trigger function to default to 'admin'
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$function$;