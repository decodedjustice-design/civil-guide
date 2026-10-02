-- Washington primary-law registry for Decoded Justice.
insert into public.legal_sources
(source_type,authority_level,jurisdiction,court_or_agency,title,citation,official_url,status,binding_status,last_verified_at,is_published,metadata)
values
('statute',1,'WA','Washington State Legislature / Code Reviser','Revised Code of Washington — Current Code','RCW','https://apps.leg.wa.gov/rcw/','current','binding',now(),true,'{"registry":"washington-primary-law","update_frequency":"twice-yearly"}'),
('regulation',1,'WA','Washington State Legislature / Code Reviser','Washington Administrative Code — Current Code','WAC','https://apps.leg.wa.gov/WaC/default.aspx','current','binding',now(),true,'{"registry":"washington-primary-law","update_frequency":"twice-monthly"}'),
('case',1,'WA','Washington State Courts','Washington Supreme Court and Court of Appeals Opinions','Washington State appellate opinions','https://www.courts.wa.gov/opinions/','current','binding',now(),true,'{"registry":"washington-case-law","note":"published opinions are precedential; unpublished Court of Appeals opinions are not precedential"}'),
('court_rule',1,'WA','Washington State Courts','Washington Court Rules','GR / CR / CrR / JuCR / RAP / local rules','https://www.courts.wa.gov/court_rules/','current','binding',now(),true,'{"registry":"washington-court-rules"}')
on conflict(jurisdiction,citation,title) do update set official_url=excluded.official_url,status='current',last_verified_at=excluded.last_verified_at,is_published=true;

insert into public.legal_issues(issue_code,issue_name,legal_domain,description,jurisdiction,is_published)
values
('WA_STATUTORY_RESEARCH','Washington Statutory Research','Washington Law','Research current and historical Washington statutes, including version history and session-law changes.','WA',true),
('WA_ADMINISTRATIVE_RULE_RESEARCH','Washington Administrative Rule Research','Washington Law','Research current and historical Washington Administrative Code provisions and agency rule structure.','WA',true),
('WA_APPELLATE_AUTHORITY','Washington Appellate Authority','Washington Law','Locate and classify Washington Supreme Court and Court of Appeals decisions, including publication and precedential status.','WA',true)
on conflict(issue_code) do update set is_published=true;

insert into public.issue_authorities(issue_id,source_id,relationship,priority,jurisdiction)
select i.id,s.id,'controls',10,'WA'
from public.legal_issues i cross join public.legal_sources s
where
(i.issue_code='WA_STATUTORY_RESEARCH' and s.citation='RCW')
or (i.issue_code='WA_ADMINISTRATIVE_RULE_RESEARCH' and s.citation='WAC')
or (i.issue_code='WA_APPELLATE_AUTHORITY' and s.citation='Washington State appellate opinions')
on conflict(issue_id,source_id,proposition_id,relationship) do nothing;
