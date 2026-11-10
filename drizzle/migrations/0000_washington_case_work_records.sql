CREATE TABLE public.case_work_records (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
 user_id uuid NOT NULL,
 kind text NOT NULL CHECK (kind IN ('agency','source','allegation','policy_review','complaint','document','task','research')),
 title text NOT NULL CHECK (length(title) BETWEEN 1 AND 300),
 status text NOT NULL DEFAULT 'unknown',
 data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(data) = 'object'),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_work_records TO authenticated;
GRANT ALL ON public.case_work_records TO service_role;
ALTER TABLE public.case_work_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own case work records" ON public.case_work_records FOR ALL TO authenticated
 USING (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.cases c WHERE c.id=case_id AND c.user_id=auth.uid()))
 WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.cases c WHERE c.id=case_id AND c.user_id=auth.uid()));
CREATE INDEX case_work_records_case_kind ON public.case_work_records(case_id,kind);
CREATE TABLE public.case_work_audit (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
 user_id uuid NOT NULL, record_id uuid NOT NULL, kind text NOT NULL, action text NOT NULL,
 before_record jsonb, after_record jsonb, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.case_work_audit TO authenticated;
GRANT ALL ON public.case_work_audit TO service_role;
ALTER TABLE public.case_work_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own case audit" ON public.case_work_audit FOR SELECT TO authenticated USING
 (user_id=auth.uid() AND EXISTS (SELECT 1 FROM public.cases c WHERE c.id=case_id AND c.user_id=auth.uid()));
CREATE OR REPLACE FUNCTION public.audit_case_work_record() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF TG_OP = 'UPDATE' THEN
   IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.case_id IS DISTINCT FROM OLD.case_id OR NEW.kind IS DISTINCT FROM OLD.kind THEN RAISE EXCEPTION 'Record ownership and kind cannot change'; END IF;
   NEW.updated_at=now();
 END IF;
 IF TG_OP = 'DELETE' THEN
 INSERT INTO public.case_work_audit(case_id,user_id,record_id,kind,action,before_record) VALUES(OLD.case_id,OLD.user_id,OLD.id,OLD.kind,TG_OP,to_jsonb(OLD));
 RETURN OLD;
 ELSE
 INSERT INTO public.case_work_audit(case_id,user_id,record_id,kind,action,before_record,after_record) VALUES(NEW.case_id,NEW.user_id,NEW.id,NEW.kind,TG_OP,CASE WHEN TG_OP='UPDATE' THEN to_jsonb(OLD) ELSE NULL END,to_jsonb(NEW));
 RETURN NEW;
 END IF;
END; $$;
REVOKE ALL ON FUNCTION public.audit_case_work_record() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER case_work_record_audit BEFORE INSERT OR UPDATE OR DELETE ON public.case_work_records FOR EACH ROW EXECUTE FUNCTION public.audit_case_work_record();
COMMENT ON TABLE public.case_work_records IS 'Private case-owned accountability, documents, tasks and reviewed research; JSON fields retain source references and uncertainty. No real case data seeded.';
COMMENT ON TABLE public.case_work_audit IS 'Append-only server-maintained case work revision history; authenticated users have read access only.';