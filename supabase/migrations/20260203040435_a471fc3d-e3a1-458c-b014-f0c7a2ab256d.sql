-- Add state field and unlock flags to justice_place_cases
-- Make county optional (already nullable in schema, but ensure it)
ALTER TABLE public.justice_place_cases 
ADD COLUMN IF NOT EXISTS state text DEFAULT 'WA',
ADD COLUMN IF NOT EXISTS unlock_flags jsonb DEFAULT '{}'::jsonb;

-- Update existing rows to have WA as state
UPDATE public.justice_place_cases SET state = 'WA' WHERE state IS NULL;

-- Make state required after populating
ALTER TABLE public.justice_place_cases ALTER COLUMN state SET NOT NULL;

-- Make case_name have a default empty string so it's truly optional
ALTER TABLE public.justice_place_cases ALTER COLUMN case_name SET DEFAULT '';

-- Make incident_month_year optional (can be filled later)
ALTER TABLE public.justice_place_cases ALTER COLUMN incident_month_year DROP NOT NULL;