-- Case Binder Pro feature harvest: preservation, claim provenance, and record gaps
-- Additive only. No existing case records are deleted or reclassified.

ALTER TABLE public.evidence
  ADD COLUMN IF NOT EXISTS original_preserved boolean,
  ADD COLUMN IF NOT EXISTS metadata_preserved boolean,
  ADD COLUMN IF NOT EXISTS chain_of_custody text,
  ADD COLUMN IF NOT EXISTS preservation_notes text;

ALTER TABLE public.case_issues
  ADD COLUMN IF NOT EXISTS notice_provided boolean,
  ADD COLUMN IF NOT EXISTS opportunity_to_respond boolean,
  ADD COLUMN IF NOT EXISTS response_notes text,
  ADD COLUMN IF NOT EXISTS source_evidence_id uuid REFERENCES public.evidence(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_type text;

CREATE INDEX IF NOT EXISTS case_issues_source_evidence_idx
  ON public.case_issues(source_evidence_id);

CREATE TABLE IF NOT EXISTS public.case_record_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  reason text,
  record_holder text,
  related_issue_id uuid REFERENCES public.case_issues(id) ON DELETE SET NULL,
  related_request_id uuid REFERENCES public.case_records_requests(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'identified',
  date_identified date NOT NULL DEFAULT CURRENT_DATE,
  date_requested date,
  due_date date,
  received_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_record_gaps TO authenticated;
GRANT ALL ON public.case_record_gaps TO service_role;
ALTER TABLE public.case_record_gaps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own case record gaps" ON public.case_record_gaps;
CREATE POLICY "Users manage their own case record gaps"
  ON public.case_record_gaps FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS case_record_gaps_case_idx
  ON public.case_record_gaps(case_id, status, due_date);

CREATE INDEX IF NOT EXISTS case_record_gaps_issue_idx
  ON public.case_record_gaps(related_issue_id);

DROP TRIGGER IF EXISTS update_case_record_gaps_updated_at ON public.case_record_gaps;
CREATE TRIGGER update_case_record_gaps_updated_at
  BEFORE UPDATE ON public.case_record_gaps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
