
-- Canonical case-workspace extensions for Decoded Justice Milestone 1B.
-- Additive only: preserves the existing canonical case-intelligence tables.

ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS document_date date,
  ADD COLUMN IF NOT EXISTS received_at timestamptz,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS original_preserved boolean,
  ADD COLUMN IF NOT EXISTS metadata_preserved boolean,
  ADD COLUMN IF NOT EXISTS chain_of_custody text,
  ADD COLUMN IF NOT EXISTS preservation_notes text,
  ADD COLUMN IF NOT EXISTS classification text DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'needs_review',
  ADD COLUMN IF NOT EXISTS include_in_export boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS sensitive boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS system_involved text,
  ADD COLUMN IF NOT EXISTS people_involved text,
  ADD COLUMN IF NOT EXISTS relevance_notes text,
  ADD COLUMN IF NOT EXISTS exhibit_number integer;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS importance text,
  ADD COLUMN IF NOT EXISTS reviewed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS disputed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS source_locator_id uuid REFERENCES public.evidence_locators(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_type text,
  ADD COLUMN IF NOT EXISTS reason text;

ALTER TABLE public.issues
  ADD COLUMN IF NOT EXISTS classification text DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS who_made_allegation text,
  ADD COLUMN IF NOT EXISTS allegation_date date,
  ADD COLUMN IF NOT EXISTS notice_provided boolean,
  ADD COLUMN IF NOT EXISTS opportunity_to_respond boolean,
  ADD COLUMN IF NOT EXISTS response_notes text,
  ADD COLUMN IF NOT EXISTS source_locator_id uuid REFERENCES public.evidence_locators(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_type text,
  ADD COLUMN IF NOT EXISTS supporting_notes text,
  ADD COLUMN IF NOT EXISTS contradicting_notes text,
  ADD COLUMN IF NOT EXISTS missing_records text,
  ADD COLUMN IF NOT EXISTS requested_remedy text,
  ADD COLUMN IF NOT EXISTS next_action text,
  ADD COLUMN IF NOT EXISTS origin text,
  ADD COLUMN IF NOT EXISTS source text;

ALTER TABLE public.people
  ADD COLUMN IF NOT EXISTS involvement text,
  ADD COLUMN IF NOT EXISTS contact text,
  ADD COLUMN IF NOT EXISTS organization text,
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.claims
  ADD COLUMN IF NOT EXISTS who_made text,
  ADD COLUMN IF NOT EXISTS first_stated_at date,
  ADD COLUMN IF NOT EXISTS source_locator_id uuid REFERENCES public.evidence_locators(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS task_type text DEFAULT 'task',
  ADD COLUMN IF NOT EXISTS record_holder text,
  ADD COLUMN IF NOT EXISTS related_issue_id uuid REFERENCES public.issues(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS related_request_id uuid,
  ADD COLUMN IF NOT EXISTS identified_at date,
  ADD COLUMN IF NOT EXISTS requested_at date,
  ADD COLUMN IF NOT EXISTS received_at date,
  ADD COLUMN IF NOT EXISTS notes text;

CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  name text NOT NULL,
  org_type text,
  contact text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  occurred_at timestamptz,
  person_id uuid REFERENCES public.people(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  method text,
  subject text,
  summary text,
  follow_up_required boolean DEFAULT false,
  related_issue_id uuid REFERENCES public.issues(id) ON DELETE SET NULL,
  related_request_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.record_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  record_holder text,
  status text NOT NULL DEFAULT 'open',
  requested_at date,
  due_at timestamptz,
  received_at date,
  request_number text,
  notes text,
  related_issue_id uuid REFERENCES public.issues(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks
  DROP CONSTRAINT IF EXISTS tasks_related_request_id_fkey;
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_related_request_id_fkey
  FOREIGN KEY (related_request_id) REFERENCES public.record_requests(id) ON DELETE SET NULL;

ALTER TABLE public.communications
  DROP CONSTRAINT IF EXISTS communications_related_request_id_fkey;
ALTER TABLE public.communications
  ADD CONSTRAINT communications_related_request_id_fkey
  FOREIGN KEY (related_request_id) REFERENCES public.record_requests(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.case_packets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  purpose text,
  requested_action text,
  packet_type text NOT NULL DEFAULT 'case_summary',
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.case_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  from_type text NOT NULL,
  from_id uuid NOT NULL,
  to_type text NOT NULL,
  to_id uuid NOT NULL,
  relation text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_case_exhibit_idx ON public.documents(case_id, exhibit_number);
CREATE INDEX IF NOT EXISTS events_case_occurred_idx ON public.events(case_id, occurred_at);
CREATE INDEX IF NOT EXISTS issues_case_status_idx ON public.issues(case_id, status);
CREATE INDEX IF NOT EXISTS people_case_name_idx ON public.people(case_id, display_name);
CREATE INDEX IF NOT EXISTS organizations_case_name_idx ON public.organizations(case_id, name);
CREATE INDEX IF NOT EXISTS communications_case_occurred_idx ON public.communications(case_id, occurred_at);
CREATE INDEX IF NOT EXISTS record_requests_case_due_idx ON public.record_requests(case_id, due_at);
CREATE INDEX IF NOT EXISTS tasks_case_type_idx ON public.tasks(case_id, task_type);
CREATE INDEX IF NOT EXISTS case_packets_case_updated_idx ON public.case_packets(case_id, updated_at);
CREATE INDEX IF NOT EXISTS case_relationships_case_idx ON public.case_relationships(case_id);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.record_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_relationships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organizations_owner_access ON public.organizations;
CREATE POLICY organizations_owner_access ON public.organizations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = organizations.case_id AND c.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = organizations.case_id AND c.owner_user_id = auth.uid()));

DROP POLICY IF EXISTS communications_owner_access ON public.communications;
CREATE POLICY communications_owner_access ON public.communications
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = communications.case_id AND c.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = communications.case_id AND c.owner_user_id = auth.uid()));

DROP POLICY IF EXISTS record_requests_owner_access ON public.record_requests;
CREATE POLICY record_requests_owner_access ON public.record_requests
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = record_requests.case_id AND c.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = record_requests.case_id AND c.owner_user_id = auth.uid()));

DROP POLICY IF EXISTS case_packets_owner_access ON public.case_packets;
CREATE POLICY case_packets_owner_access ON public.case_packets
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_packets.case_id AND c.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_packets.case_id AND c.owner_user_id = auth.uid()));

DROP POLICY IF EXISTS case_relationships_owner_access ON public.case_relationships;
CREATE POLICY case_relationships_owner_access ON public.case_relationships
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_relationships.case_id AND c.owner_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_relationships.case_id AND c.owner_user_id = auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.communications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.record_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_packets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_relationships TO authenticated;
GRANT ALL ON public.organizations TO service_role;
GRANT ALL ON public.communications TO service_role;
GRANT ALL ON public.record_requests TO service_role;
GRANT ALL ON public.case_packets TO service_role;
GRANT ALL ON public.case_relationships TO service_role;
