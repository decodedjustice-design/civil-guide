-- Create intake_packets table to store generated packets
CREATE TABLE public.intake_packets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  attorney_id TEXT,
  attorney_name TEXT,
  attorney_firm TEXT,
  
  -- Case Overview
  case_name TEXT NOT NULL,
  county TEXT NOT NULL,
  incident_month_year TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  opposing_party TEXT NOT NULL,
  case_status TEXT NOT NULL,
  
  -- Narrative
  narrative TEXT NOT NULL,
  
  -- Issues checklist (array of selected civil rights categories)
  issues_checklist TEXT[] DEFAULT '{}',
  
  -- Evidence snapshot (list of evidence items, no files)
  evidence_snapshot JSONB DEFAULT '[]',
  
  -- Deadlines
  incident_date DATE,
  statute_of_limitations_info TEXT,
  
  -- Contact information
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  contact_preferred_method TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attorney_contacts table to track attorney outreach
CREATE TABLE public.attorney_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  attorney_id TEXT NOT NULL,
  attorney_name TEXT NOT NULL,
  attorney_firm TEXT,
  intake_packet_id UUID REFERENCES public.intake_packets(id) ON DELETE SET NULL,
  contact_method TEXT,
  contact_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'sent',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.intake_packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_contacts ENABLE ROW LEVEL SECURITY;

-- RLS policies for intake_packets
CREATE POLICY "Users can view their own intake packets"
  ON public.intake_packets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own intake packets"
  ON public.intake_packets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intake packets"
  ON public.intake_packets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own intake packets"
  ON public.intake_packets FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for attorney_contacts
CREATE POLICY "Users can view their own attorney contacts"
  ON public.attorney_contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attorney contacts"
  ON public.attorney_contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attorney contacts"
  ON public.attorney_contacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attorney contacts"
  ON public.attorney_contacts FOR DELETE
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_intake_packets_updated_at
  BEFORE UPDATE ON public.intake_packets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attorney_contacts_updated_at
  BEFORE UPDATE ON public.attorney_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();