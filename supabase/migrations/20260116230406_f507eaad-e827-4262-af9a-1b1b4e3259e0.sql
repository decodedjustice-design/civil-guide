-- Add input validation to the handle_new_user function
-- This sanitizes display_name from user metadata to prevent injection attacks

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  safe_display_name TEXT;
BEGIN
  -- Sanitize display_name: limit length and remove potentially dangerous characters
  -- Keep alphanumeric, spaces, hyphens, and common Unicode letters
  safe_display_name := SUBSTRING(
    REGEXP_REPLACE(
      COALESCE(new.raw_user_meta_data ->> 'display_name', ''),
      '[^\w\s\-\p{L}]', '', 'g'
    ),
    1, 100
  );
  
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, NULLIF(TRIM(safe_display_name), ''));
  
  RETURN new;
END;
$$;