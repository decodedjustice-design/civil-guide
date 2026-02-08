-- Add documentation about PII sensitivity to intake_packets table
COMMENT ON TABLE public.intake_packets IS 'Contains sensitive PII (contact_email, contact_phone, narrative). Maintain strict user_id-scoped RLS. Never create permissive SELECT policies.';
COMMENT ON COLUMN public.intake_packets.contact_email IS 'PII: User email address. Protected by user_id-scoped RLS.';
COMMENT ON COLUMN public.intake_packets.contact_phone IS 'PII: User phone number. Protected by user_id-scoped RLS.';
COMMENT ON COLUMN public.intake_packets.narrative IS 'Sensitive: Contains personal case narrative. Protected by user_id-scoped RLS.';