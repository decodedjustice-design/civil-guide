-- Create table for saving analyzer results
CREATE TABLE public.analyzer_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  system text NOT NULL,
  system_label text NOT NULL,
  pattern_strength text NOT NULL DEFAULT 'none',
  answers jsonb NOT NULL DEFAULT '{}',
  entity_name text,
  system_controls text,
  system_does_not_control text,
  decision_makers text,
  common_stuck_points text,
  what_usually_happens text[] DEFAULT '{}',
  what_people_misinterpret text[] DEFAULT '{}',
  linked_guide_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analyzer_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own analyzer results"
ON public.analyzer_results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyzer results"
ON public.analyzer_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyzer results"
ON public.analyzer_results
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyzer results"
ON public.analyzer_results
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_analyzer_results_updated_at
BEFORE UPDATE ON public.analyzer_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();