
-- Create clarion_entries table for narrative journal entries
CREATE TABLE public.clarion_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clarion_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own clarion entries"
ON public.clarion_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clarion entries"
ON public.clarion_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clarion entries"
ON public.clarion_entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clarion entries"
ON public.clarion_entries FOR DELETE
USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE TRIGGER update_clarion_entries_updated_at
BEFORE UPDATE ON public.clarion_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
