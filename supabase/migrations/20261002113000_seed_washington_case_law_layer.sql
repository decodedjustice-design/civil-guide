-- Published Washington case-law authority layer.
-- Only published/precedential opinions are promoted to controlling authority.
-- Unpublished Court of Appeals opinions remain research leads and are not
-- inserted here as binding propositions.

insert into public.legal_sources
(source_type,authority_level,jurisdiction,court_or_agency,title,citation,official_url,
 status,binding_status,precedential_status,publication_date,version,last_verified_at,
 is_published,metadata)
values
('case',1,'WA','Washington Supreme Court',
 'Neighborhood Alliance of Spokane County v. County of Spokane',
 '172 Wn.2d 702, 261 P.3d 119 (2011)',
 'https://www.courts.wa.gov/opinions/index.cfm?fa=opinions.showOpinion&filename=841080Co1',
 'current','binding','published','2011-09-29','official-report',now(),true,
 '{"issue_codes":["WA_PUBLIC_RECORDS_ACT"],"ingestion":"official-opinion"}'::jsonb),
('case',1,'WA','Washington Supreme Court',
 'In re Dependency of L.C.S.',
 '200 Wn.2d 91, 514 P.3d 644 (2022)',
 'https://www.courts.wa.gov/opinions/pdf/997926.pdf',
 'current','binding','published','2022-08-11','official-report',now(),true,
 '{"issue_codes":["WA_DEPENDENCY_PROCEDURE"],"ingestion":"official-opinion"}'::jsonb),
('case',1,'WA','Washington Supreme Court',
 'Randy Reynolds & Associates, Inc. v. Harmon',
 '193 Wn.2d 143, 437 P.3d 677 (2019)',
 'https://www.courts.wa.gov/opinions/',
 'current','binding','published','2019-02-14','official-report',now(),true,
 '{"issue_codes":["WA_RESIDENTIAL_LANDLORD_TENANT"],"ingestion":"official-opinion"}'::jsonb)
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
 when 'Neighborhood Alliance of Spokane County v. County of Spokane'
 then 'A PRA agency search must be adequate; the inquiry focuses on the adequacy of the search rather than perfection.'
 when 'In re Dependency of L.C.S.'
 then 'Washington dependency law does not create an emergent-circumstances exception that excuses the Department from making reasonable efforts; the inquiry remains flexible and fact-specific.'
 when 'Randy Reynolds & Associates, Inc. v. Harmon'
 then 'Washington courts apply statutory construction principles to the Residential Landlord-Tenant Act and related statutory remedies.'
end,
'standard',
case s.title
 when 'Neighborhood Alliance of Spokane County v. County of Spokane' then '172 Wn.2d 702, 719-21 (2011)'
 when 'In re Dependency of L.C.S.' then '200 Wn.2d 91, 101-08 (2022)'
 when 'Randy Reynolds & Associates, Inc. v. Harmon' then '193 Wn.2d 143 (2019)'
end,
'WA','binding','verified_case','verified',true
from public.legal_sources s
where s.title in (
 'Neighborhood Alliance of Spokane County v. County of Spokane',
 'In re Dependency of L.C.S.',
 'Randy Reynolds & Associates, Inc. v. Harmon'
)
and not exists (
 select 1 from public.legal_propositions p where p.source_id=s.id
);

insert into public.issue_authorities
(issue_id,source_id,proposition_id,relationship,priority,jurisdiction,note)
select i.id,s.id,p.id,'controls',1,'WA',
'Published Washington Supreme Court authority matched to the substantive Analyzer issue.'
from public.legal_issues i
join public.legal_sources s on s.title =
case i.analyzer_issue_id
 when 'wa-public-records-act' then 'Neighborhood Alliance of Spokane County v. County of Spokane'
 when 'wa-dependency-procedure' then 'In re Dependency of L.C.S.'
 when 'wa-residential-landlord-tenant' then 'Randy Reynolds & Associates, Inc. v. Harmon'
end
join public.legal_propositions p on p.source_id=s.id
where i.analyzer_issue_id in (
 'wa-public-records-act',
 'wa-dependency-procedure',
 'wa-residential-landlord-tenant'
)
and not exists (
 select 1 from public.issue_authorities ia
 where ia.issue_id=i.id and ia.source_id=s.id
);
