-- Fix the handle_new_user trigger with a valid regex pattern
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  safe_display_name TEXT;
BEGIN
  -- Sanitize display_name: limit length and remove potentially dangerous characters
  -- Keep alphanumeric, spaces, and hyphens only (simpler, valid pattern)
  safe_display_name := SUBSTRING(
    REGEXP_REPLACE(
      COALESCE(new.raw_user_meta_data ->> 'display_name', ''),
      '[^a-zA-Z0-9 -]', '', 'g'
    ),
    1, 100
  );
  
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, NULLIF(TRIM(safe_display_name), ''));
  
  RETURN new;
END;
$function$;