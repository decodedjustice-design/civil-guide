-- Create storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence-files', 'evidence-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for evidence files
-- Users can only access their own files (stored in folder named after their user_id)
CREATE POLICY "Users can view their own evidence files"
ON storage.objects FOR SELECT
USING (bucket_id = 'evidence-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own evidence files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'evidence-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own evidence files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'evidence-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own evidence files"
ON storage.objects FOR DELETE
USING (bucket_id = 'evidence-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add metadata columns to evidence table for structured data
ALTER TABLE public.evidence
ADD COLUMN IF NOT EXISTS document_date date,
ADD COLUMN IF NOT EXISTS source text,
ADD COLUMN IF NOT EXISTS system_involved text,
ADD COLUMN IF NOT EXISTS people_involved text,
ADD COLUMN IF NOT EXISTS relevance_notes text;