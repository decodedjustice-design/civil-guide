-- Create enum for pattern strength levels
CREATE TYPE public.pattern_strength AS ENUM ('none', 'possible', 'strong', 'very_strong');

-- Create enum for civil rights systems
CREATE TYPE public.civil_rights_system AS ENUM ('police', 'housing', 'cps_dcyf', 'schools', 'healthcare', 'benefits', 'courts', 'other');

-- Case profiles generated from Analyzer results
CREATE TABLE public.case_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  system civil_rights_system NOT NULL,
  entity TEXT NOT NULL, -- agency, landlord, facility name
  entity_type TEXT, -- agency, landlord, facility, school_district
  claim_tags TEXT[] NOT NULL DEFAULT '{}',
  date_start DATE,
  date_end DATE,
  location_city TEXT,
  location_county TEXT,
  location_state TEXT DEFAULT 'WA',
  description TEXT,
  pattern_strength pattern_strength DEFAULT 'none',
  pattern_notes TEXT,
  is_seed_data BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Known entity patterns (seed data for problematic entities)
CREATE TABLE public.known_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  system civil_rights_system NOT NULL,
  entity TEXT NOT NULL,
  entity_type TEXT,
  pattern_type TEXT NOT NULL, -- 'actor', 'entity', 'facility', 'systemic'
  claim_tags TEXT[] NOT NULL DEFAULT '{}',
  case_count INTEGER DEFAULT 1,
  description TEXT,
  source TEXT, -- DOJ report, news, user reports
  source_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.case_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.known_patterns ENABLE ROW LEVEL SECURITY;

-- RLS policies for case_profiles (users see their own)
CREATE POLICY "Users can view their own case profiles"
ON public.case_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own case profiles"
ON public.case_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case profiles"
ON public.case_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own case profiles"
ON public.case_profiles FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for known_patterns (public read, no user writes)
CREATE POLICY "Anyone can view known patterns"
ON public.known_patterns FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_case_profiles_updated_at
BEFORE UPDATE ON public.case_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_known_patterns_updated_at
BEFORE UPDATE ON public.known_patterns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for known problematic entities in Washington
INSERT INTO public.known_patterns (system, entity, entity_type, pattern_type, claim_tags, case_count, description, source, is_verified) VALUES
-- Police patterns
('police', 'Seattle Police Department', 'agency', 'entity', ARRAY['excessive_force', 'discrimination', 'civil_rights'], 15, 'DOJ consent decree 2012-2024 for pattern of excessive force and discriminatory policing', 'DOJ Consent Decree', true),
('police', 'Tacoma Police Department', 'agency', 'entity', ARRAY['excessive_force', 'wrongful_death'], 8, 'Multiple excessive force complaints and wrongful death lawsuits', 'Public records', true),
('police', 'King County Sheriff', 'agency', 'entity', ARRAY['excessive_force', 'jail_conditions'], 5, 'Jail conditions complaints and use of force incidents', 'News reports', false),
-- CPS/DCYF patterns
('cps_dcyf', 'Washington DCYF', 'agency', 'systemic', ARRAY['unlawful_removal', 'due_process', 'discrimination'], 12, 'Systemic issues with child removals and due process violations', 'State Ombuds reports', true),
('cps_dcyf', 'King County DCYF', 'agency', 'entity', ARRAY['unlawful_removal', 'retaliation', 'failure_to_investigate'], 7, 'Pattern of removals without proper investigation', 'Legal Aid reports', false),
-- Housing patterns
('housing', 'Seattle Housing Authority', 'agency', 'entity', ARRAY['discrimination', 'retaliation', 'voucher_termination'], 6, 'Voucher termination and discrimination complaints', 'HUD complaints', true),
('housing', 'King County Housing Authority', 'agency', 'entity', ARRAY['due_process', 'voucher_termination'], 4, 'Due process violations in voucher proceedings', 'Legal Aid reports', false),
-- Healthcare patterns
('healthcare', 'Harborview Medical Center', 'facility', 'facility', ARRAY['medical_neglect', 'discrimination', 'psychiatric_hold'], 3, 'Involuntary psychiatric holds and treatment complaints', 'Patient advocacy', false),
-- Schools patterns
('schools', 'Seattle Public Schools', 'agency', 'entity', ARRAY['discrimination', 'special_education', 'discipline_disparity'], 5, 'Racial discipline disparities and special education denials', 'OCR complaints', true);

-- Create index for pattern matching queries
CREATE INDEX idx_case_profiles_system_entity ON public.case_profiles(system, entity);
CREATE INDEX idx_case_profiles_claim_tags ON public.case_profiles USING GIN(claim_tags);
CREATE INDEX idx_known_patterns_system_entity ON public.known_patterns(system, entity);
CREATE INDEX idx_known_patterns_claim_tags ON public.known_patterns USING GIN(claim_tags);