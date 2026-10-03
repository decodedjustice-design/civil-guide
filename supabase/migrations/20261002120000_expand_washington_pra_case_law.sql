-- Expand the Washington Public Records Act case-law layer.
-- These are published Washington Supreme Court authorities and are promoted
-- to controlling authority for the PRA Analyzer issue.

insert into public.legal_sources
(source_type,authority_level,jurisdiction,court_or_agency,title,citation,official_url,
 status,binding_status,precedential_status,publication_date,version,last_verified_at,
 is_published,metadata)
values
('case',1,'WA','Washington Supreme Court',
 'Nissen v. Pierce County',
 '183 Wn.2d 863, 357 P.3d 45 (2015)',
 'https://www.courts.wa.gov/opinions/?fa=opinions.disp&filename=908753MAJ',
 'current','binding','published','2015-08-27','official-report',now(),true,
 '{"issue_codes":["WA_PUBLIC_RECORDS_ACT"],"ingestion":"official-opinion"}'::jsonb),
('case',1,'WA','Washington Supreme Court',
 'Soter v. Cowles Publishing Co.',
 '162 Wn.2d 716, 174 P.3d 60 (2007)',
 'https://www.courts.wa.gov/opinions/?fa=opinions.disp&filename=785741MAJ',
 'current','binding','published','2007-12-27','official-report',now(),true,
 '{"issue_codes":["WA_PUBLIC_RECORDS_ACT"],"ingestion":"official-opinion"}'::jsonb)
on conflict (jurisdiction,citation,title) do update
set official_url=excluded.official_url,
    status=excluded.status,
    binding_status=excluded.binding_status,
    precedential_status=excluded.precedential_status,
    version=excluded.version,
    last_verified_at=excluded.last_verified_at,
    is_published=excluded.is_published,
    metadata=excluded.metadata;

insert into public.legal_propositions
(source_id,proposition,proposition_type,locator,jurisdiction,binding_status,
 confidence_status,review_status,is_published)
select s.id,
case s.title
 when 'Nissen v. Pierce County' then
 'Records an agency employee prepares, owns, uses, or retains on a private cell phone within the scope of employment can be public records; the agency must address responsive public records held by employees.'
 when 'Soter v. Cowles Publishing Co.' then
 'Public Records Act agency action is reviewed de novo, and PRA exemptions are construed narrowly in favor of disclosure.'
end,
case s.title when 'Nissen v. Pierce County' then 'definition' else 'standard' end,
case s.title when 'Nissen v. Pierce County' then '183 Wn.2d 863, 873-88 (2015)' else '162 Wn.2d 716, 730-31 (2007)' end,
'WA','binding','verified_case','verified',true
from public.legal_sources s
where s.title in ('Nissen v. Pierce County','Soter v. Cowles Publishing Co.')
and not exists (
 select 1 from public.legal_propositions p
 where p.source_id=s.id
   and p.proposition = case s.title
      when 'Nissen v. Pierce County' then 'Records an agency employee prepares, owns, uses, or retains on a private cell phone within the scope of employment can be public records; the agency must address responsive public records held by employees.'
      when 'Soter v. Cowles Publishing Co.' then 'Public Records Act agency action is reviewed de novo, and PRA exemptions are construed narrowly in favor of disclosure.'
   end
);

insert into public.issue_authorities
(issue_id,source_id,proposition_id,relationship,priority,jurisdiction,note)
select i.id,s.id,p.id,'controls',1,'WA',
'Published Washington Supreme Court PRA authority matched to the Analyzer issue.'
from public.legal_issues i
join public.legal_sources s on s.title in ('Nissen v. Pierce County','Soter v. Cowles Publishing Co.')
join public.legal_propositions p on p.source_id=s.id
where i.analyzer_issue_id='wa-public-records-act'
and not exists (
 select 1 from public.issue_authorities ia
 where ia.issue_id=i.id and ia.source_id=s.id and ia.proposition_id=p.id
);
