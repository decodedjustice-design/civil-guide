-- Fix: Restrict known_patterns access to authenticated users only
-- This table contains sensitive civil rights data that should not be publicly accessible

-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view known patterns" ON public.known_patterns;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can view known patterns"
ON public.known_patterns FOR SELECT
USING (auth.role() = 'authenticated');