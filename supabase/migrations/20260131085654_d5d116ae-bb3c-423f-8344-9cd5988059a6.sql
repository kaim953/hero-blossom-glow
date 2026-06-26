-- Drop and recreate the blog_posts_public view with security_barrier enabled
-- This prevents optimizer from bypassing the WHERE clause and leaking unpublished posts

DROP VIEW IF EXISTS public.blog_posts_public;

CREATE VIEW public.blog_posts_public 
WITH (security_invoker = true, security_barrier = true) AS
SELECT 
  bp.id,
  bp.title,
  bp.slug,
  bp.thumbnail_url,
  bp.logo_url,
  bp.brief_intro,
  bp.published_date,
  bp.read_time,
  bp.gallery,
  bp.content,
  bp.related_posts,
  bp.is_published,
  bp.display_order,
  bp.created_at,
  bp.updated_at,
  tm.name AS author_name,
  tm.photo_url AS author_photo_url,
  tm.position AS author_position
FROM public.blog_posts bp
LEFT JOIN public.team_members tm ON bp.author_id = tm.id
WHERE bp.is_published = true;

-- Grant SELECT to anon and authenticated roles
GRANT SELECT ON public.blog_posts_public TO anon, authenticated;

-- Add comment explaining security setup
COMMENT ON VIEW public.blog_posts_public IS 'Public view for blog posts. Uses security_barrier=true to prevent filter bypass attacks and security_invoker=true to respect underlying RLS policies.';