-- Drop and recreate the view with SECURITY INVOKER (default, safe)
DROP VIEW IF EXISTS public.blog_posts_public;

CREATE VIEW public.blog_posts_public 
WITH (security_invoker = true) AS
SELECT 
  bp.id,
  bp.title,
  bp.slug,
  bp.brief_intro,
  bp.content,
  bp.thumbnail_url,
  bp.logo_url,
  bp.published_date,
  bp.read_time,
  bp.gallery,
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

-- Grant SELECT access on the view
GRANT SELECT ON public.blog_posts_public TO anon;
GRANT SELECT ON public.blog_posts_public TO authenticated;