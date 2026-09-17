-- ============ canonical case model (additive) ============
CREATE TABLE IF NOT EXISTS public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Untitled case',
  description text,
  case_type text,
  status text NOT NULL DEFAULT 'active',
  county text,
  state text DEFAULT 'WA',
  legacy_justice_place_case_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cases TO authenticated;
GRANT ALL ON public.cases TO service_role;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own cases" ON public.cases;
CREATE POLICY "Users manage their own cases" ON public.cases FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS cases_user_idx ON public.cases(user_id, created_at DESC);
DROP TRIGGER IF EXISTS update_cases_updated_at ON public.cases;
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- people
CREATE TABLE IF NOT EXISTS public.case_people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  organization text,
  contact text,
  involvement text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_people TO authenticated;
GRANT ALL ON public.case_people TO service_role;
ALTER TABLE public.case_people ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own case people" ON public.case_people;
CREATE POLICY "Users manage their own case people" ON public.case_people FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS case_people_case_idx ON public.case_people(case_id);
DROP TRIGGER IF EXISTS update_case_people_updated_at ON public.case_people;
CREATE TRIGGER update_case_people_updated_at BEFORE UPDATE ON public.case_people
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- organizations
CREATE TABLE IF NOT EXISTS public.case_organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  name text NOT NULL,
  org_type text,
  contact text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_organizations TO authenticated;
GRANT ALL ON public.case_organizations TO service_role;
ALTER TABLE public.case_organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own case organizations" ON public.case_organizations;
CREATE POLICY "Users manage their own case organizations" ON public.case_organizations FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS case_organizations_case_idx ON public.case_organizations(case_id);
DROP TRIGGER IF EXISTS update_case_organizations_updated_at ON public.case_organizations;
CREATE TRIGGER update_case_organizations_updated_at BEFORE UPDATE ON public.case_organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- issues / claims
CREATE TABLE IF NOT EXISTS public.case_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text,
  summary text,
  who_made_allegation text,
  allegation_date date,
  classification text NOT NULL DEFAULT 'unknown',
  status text NOT NULL DEFAULT 'open',
  supporting_notes text,
  contradicting_notes text,
  missing_records text,
  requested_remedy text,
  next_action text,
  source text,
  origin text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_issues TO authenticated;
GRANT ALL ON public.case_issues TO service_role;
ALTER TABLE public.case_issues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own case issues" ON public.case_issues;
CREATE POLICY "Users manage their own case issues" ON public.case_issues FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS case_issues_case_idx ON public.case_issues(case_id);
DROP TRIGGER IF EXISTS update_case_issues_updated_at ON public.case_issues;
CREATE TRIGGER update_case_issues_updated_at BEFORE UPDATE ON public.case_issues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- communications
CREATE TABLE IF NOT EXISTS public.case_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  occurred_on date,
  occurred_time text,
  method text NOT NULL DEFAULT 'Other',
  person text,
  agency text,
  subject text,
  summary text,
  requested text,
  response text,
  promises_made text,
  follow_up_needed boolean NOT NULL DEFAULT false,
  follow_up_date date,
  classification text NOT NULL DEFAULT 'unknown',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_communications TO authenticated;
GRANT ALL ON public.case_communications TO service_role;
ALTER TABLE public.case_communications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own case communications" ON public.case_communications;
CREATE POLICY "Users manage their own case communications" ON public.case_communications FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS case_communications_case_idx ON public.case_communications(case_id, occurred_on DESC);
DROP TRIGGER IF EXISTS update_case_communications_updated_at ON public.case_communications;
CREATE TRIGGER update_case_communications_updated_at BEFORE UPDATE ON public.case_communications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- records requests & deadlines
CREATE TABLE IF NOT EXISTS public.case_records_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  agency text NOT NULL,
  request_title text,
  description text,
  request_method text,
  date_sent date,
  acknowledgement_date date,
  due_date date,
  status text NOT NULL DEFAULT 'draft',
  tracking_number text,
  outcome text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_records_requests TO authenticated;
GRANT ALL ON public.case_records_requests TO service_role;
ALTER TABLE public.case_records_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own records requests" ON public.case_records_requests;
CREATE POLICY "Users manage their own records requests" ON public.case_records_requests FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS case_records_requests_case_idx ON public.case_records_requests(case_id, due_date);
DROP TRIGGER IF EXISTS update_case_records_requests_updated_at ON public.case_records_requests;
CREATE TRIGGER update_case_records_requests_updated_at BEFORE UPDATE ON public.case_records_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- generic link layer
CREATE TABLE IF NOT EXISTS public.case_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  from_type text NOT NULL,
  from_id uuid NOT NULL,
  to_type text NOT NULL,
  to_id uuid NOT NULL,
  relation text NOT NULL DEFAULT 'related',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_links TO authenticated;
GRANT ALL ON public.case_links TO service_role;
ALTER TABLE public.case_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own case links" ON public.case_links;
CREATE POLICY "Users manage their own case links" ON public.case_links FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE UNIQUE INDEX IF NOT EXISTS case_links_unique_idx ON public.case_links(case_id, from_type, from_id, to_type, to_id, relation);
CREATE INDEX IF NOT EXISTS case_links_from_idx ON public.case_links(from_type, from_id);
CREATE INDEX IF NOT EXISTS case_links_to_idx ON public.case_links(to_type, to_id);

-- packets / exports
CREATE TABLE IF NOT EXISTS public.case_packets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Case packet',
  packet_type text NOT NULL DEFAULT 'full-binder',
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  options jsonb NOT NULL DEFAULT '{}'::jsonb,
  content jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_packets TO authenticated;
GRANT ALL ON public.case_packets TO service_role;
ALTER TABLE public.case_packets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage their own case packets" ON public.case_packets;
CREATE POLICY "Users manage their own case packets" ON public.case_packets FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS case_packets_case_idx ON public.case_packets(case_id, created_at DESC);
DROP TRIGGER IF EXISTS update_case_packets_updated_at ON public.case_packets;
CREATE TRIGGER update_case_packets_updated_at BEFORE UPDATE ON public.case_packets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ additive columns on existing tables ============
ALTER TABLE public.evidence
  ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS exhibit_number integer,
  ADD COLUMN IF NOT EXISTS classification text NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'needs_review',
  ADD COLUMN IF NOT EXISTS received_date date,
  ADD COLUMN IF NOT EXISTS sensitive boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS include_in_export boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'::text[];
CREATE INDEX IF NOT EXISTS evidence_case_idx ON public.evidence(case_id);
CREATE UNIQUE INDEX IF NOT EXISTS evidence_exhibit_unique_idx ON public.evidence(case_id, exhibit_number) WHERE case_id IS NOT NULL AND exhibit_number IS NOT NULL;

ALTER TABLE public.timeline_entries
  ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS classification text NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS importance text NOT NULL DEFAULT 'Medium',
  ADD COLUMN IF NOT EXISTS source_type text,
  ADD COLUMN IF NOT EXISTS source_evidence_id uuid REFERENCES public.evidence(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS disputed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reason text;
CREATE INDEX IF NOT EXISTS timeline_entries_case_idx ON public.timeline_entries(case_id, event_date);

ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS notes_case_idx ON public.notes(case_id);

-- ============ stable exhibit numbering ============
CREATE OR REPLACE FUNCTION public.assign_exhibit_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.case_id IS NOT NULL AND NEW.exhibit_number IS NULL THEN
    SELECT COALESCE(MAX(exhibit_number), 0) + 1 INTO NEW.exhibit_number
    FROM public.evidence WHERE case_id = NEW.case_id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.assign_exhibit_number() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS evidence_assign_exhibit_number ON public.evidence;
CREATE TRIGGER evidence_assign_exhibit_number BEFORE INSERT OR UPDATE OF case_id ON public.evidence
  FOR EACH ROW EXECUTE FUNCTION public.assign_exhibit_number();

-- ============ idempotent backfill ============
INSERT INTO public.cases (user_id, name, case_type, county, state, legacy_justice_place_case_id, created_at)
SELECT jpc.user_id,
       NULLIF(TRIM(jpc.case_name), ''),
       jpc.issue_type,
       jpc.county,
       COALESCE(jpc.state, 'WA'),
       jpc.id,
       jpc.created_at
FROM public.justice_place_cases jpc
WHERE NOT EXISTS (
  SELECT 1 FROM public.cases c WHERE c.legacy_justice_place_case_id = jpc.id
);

UPDATE public.cases SET name = 'Untitled case' WHERE name IS NULL;

WITH primary_case AS (
  SELECT DISTINCT ON (user_id) user_id, id FROM public.cases ORDER BY user_id, created_at ASC
)
UPDATE public.evidence e SET case_id = p.id
FROM primary_case p WHERE e.user_id = p.user_id AND e.case_id IS NULL;

WITH primary_case AS (
  SELECT DISTINCT ON (user_id) user_id, id FROM public.cases ORDER BY user_id, created_at ASC
)
UPDATE public.timeline_entries t SET case_id = p.id
FROM primary_case p WHERE t.user_id = p.user_id AND t.case_id IS NULL;

WITH primary_case AS (
  SELECT DISTINCT ON (user_id) user_id, id FROM public.cases ORDER BY user_id, created_at ASC
)
UPDATE public.notes n SET case_id = p.id
FROM primary_case p WHERE n.user_id = p.user_id AND n.case_id IS NULL;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY case_id ORDER BY created_at, id) AS rn
  FROM public.evidence WHERE case_id IS NOT NULL AND exhibit_number IS NULL
)
UPDATE public.evidence e SET exhibit_number = numbered.rn
FROM numbered WHERE e.id = numbered.id;