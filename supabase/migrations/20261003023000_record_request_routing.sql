-- Record-request routing metadata. This stores verified routing information without assuming a recipient.
ALTER TABLE public.record_requests
  ADD COLUMN IF NOT EXISTS contact_name text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS submission_method text,
  ADD COLUMN IF NOT EXISTS submission_url text,
  ADD COLUMN IF NOT EXISTS mailing_address text,
  ADD COLUMN IF NOT EXISTS routing_source text,
  ADD COLUMN IF NOT EXISTS routing_verified_at date;

COMMENT ON COLUMN public.record_requests.routing_source IS 'Source used to verify the routing information, such as the official agency records page.';
COMMENT ON COLUMN public.record_requests.routing_verified_at IS 'Date the routing information was last verified.';
