-- Update handle_new_user_role trigger to check for VALID admins only
-- (user_id must exist in auth.users - handles stale data from remixed projects)
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- First user bootstrap: assign admin if no VALID admins exist
  -- (user_id must exist in auth.users - handles stale data from remixed projects)
  IF NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.role = 'admin'
    AND EXISTS (SELECT 1 FROM auth.users au WHERE au.id = ur.user_id)
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Subsequent users: assign editor as default
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'editor')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- Update bootstrap_first_admin function with same logic for consistency
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
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
$function$;