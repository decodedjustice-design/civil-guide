-- 1) Narrative provenance + review state on canonical case tables (additive, idempotent)
ALTER TABLE public.case_people ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'manual';
ALTER TABLE public.case_people ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'unreviewed';

ALTER TABLE public.case_organizations ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'manual';
ALTER TABLE public.case_organizations ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'unreviewed';

ALTER TABLE public.case_issues ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'unreviewed';

ALTER TABLE public.case_communications ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'manual';
ALTER TABLE public.case_communications ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'unreviewed';
ALTER TABLE public.case_communications ADD COLUMN IF NOT EXISTS related_issue_id uuid REFERENCES public.case_issues(id) ON DELETE SET NULL;

ALTER TABLE public.timeline_entries ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'unreviewed';

ALTER TABLE public.evidence ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'manual';
ALTER TABLE public.evidence ADD COLUMN IF NOT EXISTS related_issue_id uuid REFERENCES public.case_issues(id) ON DELETE SET NULL;

-- 2) Evidence the story says exists, but which has not been added as a document yet
CREATE TABLE IF NOT EXISTS public.case_evidence_mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  evidence_type text NOT NULL,
  description text,
  approximate_date text,
  priority text,
  status text DEFAULT 'mentioned',
  related_issue_id uuid REFERENCES public.case_issues(id) ON DELETE SET NULL,
  source_type text DEFAULT 'user_narrative',
  review_status text DEFAULT 'unreviewed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_evidence_mentions TO authenticated;
GRANT ALL ON public.case_evidence_mentions TO service_role;

ALTER TABLE public.case_evidence_mentions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "case_evidence_mentions_owner_all" ON public.case_evidence_mentions;
CREATE POLICY "case_evidence_mentions_owner_all" ON public.case_evidence_mentions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3) Records the case still needs
CREATE TABLE IF NOT EXISTS public.case_record_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  record_holder text,
  status text DEFAULT 'identified',
  related_issue_id uuid REFERENCES public.case_issues(id) ON DELETE SET NULL,
  related_request_id uuid REFERENCES public.case_records_requests(id) ON DELETE SET NULL,
  identified_at date,
  requested_at date,
  due_date date,
  received_date date,
  notes text,
  source_type text DEFAULT 'manual',
  review_status text DEFAULT 'unreviewed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_record_gaps TO authenticated;
GRANT ALL ON public.case_record_gaps TO service_role;

ALTER TABLE public.case_record_gaps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "case_record_gaps_owner_all" ON public.case_record_gaps;
CREATE POLICY "case_record_gaps_owner_all" ON public.case_record_gaps
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4) Keep updated_at current on the new tables
DROP TRIGGER IF EXISTS update_case_evidence_mentions_updated_at ON public.case_evidence_mentions;
CREATE TRIGGER update_case_evidence_mentions_updated_at BEFORE UPDATE ON public.case_evidence_mentions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_case_record_gaps_updated_at ON public.case_record_gaps;
CREATE TRIGGER update_case_record_gaps_updated_at BEFORE UPDATE ON public.case_record_gaps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();