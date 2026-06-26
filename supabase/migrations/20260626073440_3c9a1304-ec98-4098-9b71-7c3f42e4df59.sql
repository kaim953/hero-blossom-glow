
-- Revoke broad EXECUTE on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_roles(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin(uuid) FROM PUBLIC, anon;

-- Ensure required callers still work
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin(uuid) TO authenticated, service_role;

-- Drop broad SELECT policy that enables listing the public blog-images bucket.
-- Public file URLs continue to work via the storage public endpoint.
DROP POLICY IF EXISTS "Anyone can view blog images" ON storage.objects;
