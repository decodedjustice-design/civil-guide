-- Create case status enum (gentle, non-pressuring)
CREATE TYPE public.case_status AS ENUM (
  'getting_oriented',
  'gathering_information', 
  'preparing_outreach',
  'awaiting_responses',
  'reviewing_options',
  'taking_next_steps',
  'on_hold'
);

-- Create justice_place_cases table (main case profile for each user)
CREATE TABLE public.justice_place_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  case_name TEXT NOT NULL,
  county TEXT NOT NULL,
  incident_month_year TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  case_status public.case_status NOT NULL DEFAULT 'getting_oriented',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookmarks table for saved resources
CREATE TABLE public.justice_place_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resource_type TEXT NOT NULL, -- 'guide', 'template', 'court', 'attorney', 'other'
  resource_id TEXT NOT NULL,
  resource_title TEXT NOT NULL,
  resource_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_type, resource_id)
);

-- Enable RLS
ALTER TABLE public.justice_place_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.justice_place_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS policies for justice_place_cases
CREATE POLICY "Users can view their own case"
  ON public.justice_place_cases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own case"
  ON public.justice_place_cases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case"
  ON public.justice_place_cases FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own case"
  ON public.justice_place_cases FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for justice_place_bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON public.justice_place_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON public.justice_place_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON public.justice_place_bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.justice_place_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_justice_place_cases_updated_at
  BEFORE UPDATE ON public.justice_place_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();