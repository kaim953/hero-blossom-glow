-- Harden get_user_roles to only return roles for the authenticated user
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS TABLE(role app_role)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT ur.role 
  FROM public.user_roles ur 
  WHERE ur.user_id = _user_id
    AND (_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
$$;

-- Harden bootstrap_first_admin to only allow authenticated users to bootstrap themselves
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Security check: only allow users to bootstrap themselves
  IF auth.uid() IS NULL THEN
    RETURN 'not_authenticated';
  END IF;
  
  IF _user_id != auth.uid() THEN
    RETURN 'unauthorized';
  END IF;

  -- Check if user already has a role
  IF EXISTS (SELECT 1 FROM user_roles WHERE user_id = _user_id) THEN
    RETURN 'already_has_role';
  END IF;

  -- If no VALID admins exist, make this user admin
  -- (handles stale data from remixed projects)
  IF NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.role = 'admin'
    AND EXISTS (SELECT 1 FROM auth.users au WHERE au.id = ur.user_id)
  ) THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN 'bootstrapped_as_admin';
  END IF;

  RETURN 'no_role_assigned';
END;
$$;