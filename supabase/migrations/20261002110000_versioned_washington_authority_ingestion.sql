-- Versioned Washington primary-authority ingestion seed.
-- Sources are official Washington Legislature pages; exact text is intentionally
-- represented by source metadata + official URL until the controlled text
-- ingestion worker stores a verified section snapshot.

insert into public.legal_sources
(source_type, authority_level, jurisdiction, court_or_agency, title, citation,
 official_url, status, binding_status, precedential_status, version,
 last_verified_at, is_published, metadata)
values
('statute',1,'WA','Washington State Legislature',
 'Public Records — Agency disclosure and indexes','RCW 42.56.070',
 'https://app.leg.wa.gov/RCW/default.aspx?cite=42.56.070',
 'current','binding','not_applicable','2026-10-02',now(),true,
 '{"ingestion":"official-section","registry":"WA_PUBLIC_RECORDS_ACT"}'::jsonb),
('regulation',1,'WA','Washington State Legislature',
 'CPS involvement with juvenile court','WAC 110-30-0120',
 'https://app.leg.wa.gov/WAC/default.aspx?cite=110-30-0120',
 'current','binding','not_applicable','2026-10-02',now(),true,
 '{"ingestion":"official-section","registry":"WA_DEPENDENCY_PROCEDURE"}'::jsonb),
('regulation',1,'WA','Washington State Legislature',
 'Kinship homes — caregiver rights and licensing','WAC 110-149',
 'https://app.leg.wa.gov/WAC/default.aspx?cite=110-149',
 'current','binding','not_applicable','2026-10-02',now(),true,
 '{"ingestion":"official-chapter-index","registry":"WA_DEPENDENCY_PROCEDURE"}'::jsonb)
on conflict (jurisdiction,citation,title) do update
set official_url=excluded.official_url,
    status=excluded.status,
    binding_status=excluded.binding_status,
    version=excluded.version,
    last_verified_at=excluded.last_verified_at,
    is_published=excluded.is_published,
    metadata=excluded.metadata;

-- Document/chunk rows are created only when the controlled ingestion job
-- has a verified snapshot. This migration therefore records source authority
-- without fabricating statutory text.
