-- Create a SECURITY DEFINER function to reliably fetch user roles
-- This bypasses RLS to ensure role checking works even during auth transitions
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS TABLE(role app_role)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id;
$$;