-- Decoded Justice Knowledge Core
-- Matches remote migration 20261002091036_knowledge_core_issue_libraries.
create table if not exists public.legal_sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('constitution','statute','regulation','case','agency_guidance','court_rule','secondary','other')),
  authority_level integer not null check (authority_level between 1 and 5),
  jurisdiction text not null,
  court_or_agency text,
  title text not null,
  citation text not null default '',
  official_url text,
  repository_url text,
  publication_date date,
  effective_date date,
  expiration_date date,
  status text not null default 'current',
  binding_status text not null default 'binding',
  precedential_status text,
  version text,
  checksum text,
  last_verified_at timestamptz,
  is_published boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(jurisdiction,citation,title)
);
create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.legal_sources(id) on delete cascade,
  document_type text not null,
  title text not null,
  full_text text,
  html text,
  xml text,
  pdf_url text,
  text_hash text,
  source_version text,
  retrieved_at timestamptz not null default now(),
  effective_from date,
  effective_to date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.legal_issues (
  id uuid primary key default gen_random_uuid(),
  issue_code text not null unique,
  issue_name text not null,
  legal_domain text not null,
  description text,
  jurisdiction text,
  parent_issue_id uuid references public.legal_issues(id) on delete set null,
  active boolean not null default true,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.issue_elements (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.legal_issues(id) on delete cascade,
  element_code text not null,
  element_name text not null,
  element_description text,
  required boolean not null default true,
  sequence_no integer not null default 1,
  jurisdiction text,
  authority_note text,
  created_at timestamptz not null default now(),
  unique(issue_id,element_code)
);
create table if not exists public.legal_propositions (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.legal_sources(id) on delete cascade,
  document_id uuid references public.legal_documents(id) on delete set null,
  proposition text not null,
  proposition_type text not null,
  supporting_text text,
  locator text,
  jurisdiction text not null,
  binding_status text not null default 'binding',
  confidence_status text not null default 'verified_primary',
  review_status text not null default 'verified',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.issue_authorities (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.legal_issues(id) on delete cascade,
  source_id uuid not null references public.legal_sources(id) on delete cascade,
  proposition_id uuid references public.legal_propositions(id) on delete set null,
  relationship text not null,
  priority integer not null default 100,
  jurisdiction text,
  note text,
  created_at timestamptz not null default now(),
  unique(issue_id,source_id,proposition_id,relationship)
);
create table if not exists public.legal_citations (
  id uuid primary key default gen_random_uuid(),
  citing_source_id uuid not null references public.legal_sources(id) on delete cascade,
  cited_source_id uuid references public.legal_sources(id) on delete set null,
  citation_text text not null,
  citation_type text not null default 'case_citation',
  relationship text,
  verified boolean not null default false,
  verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(citing_source_id,citation_text)
);
create table if not exists public.decoded_explanations (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references public.legal_issues(id) on delete cascade,
  title text not null,
  plain_language text,
  what_it_means text,
  what_it_does_not_mean text,
  questions_to_ask text[],
  evidence_to_collect text[],
  common_misunderstandings text[],
  review_status text not null default 'needs_review',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(issue_id,title)
);
create table if not exists public.legal_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.legal_documents(id) on delete cascade,
  source_id uuid not null references public.legal_sources(id) on delete cascade,
  chunk_text text not null,
  citation text,
  section text,
  jurisdiction text,
  authority_level integer,
  binding_status text,
  issue_codes text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.legal_sources enable row level security;
alter table public.legal_documents enable row level security;
alter table public.legal_issues enable row level security;
alter table public.issue_elements enable row level security;
alter table public.legal_propositions enable row level security;
alter table public.issue_authorities enable row level security;
alter table public.legal_citations enable row level security;
alter table public.decoded_explanations enable row level security;
alter table public.legal_chunks enable row level security;

drop policy if exists "published legal sources are readable" on public.legal_sources;
create policy "published legal sources are readable" on public.legal_sources for select to anon,authenticated using (is_published=true);
drop policy if exists "published legal issues are readable" on public.legal_issues;
create policy "published legal issues are readable" on public.legal_issues for select to anon,authenticated using (is_published=true);
drop policy if exists "issue elements are readable for published issues" on public.issue_elements;
create policy "issue elements are readable for published issues" on public.issue_elements for select to anon,authenticated using (exists(select 1 from public.legal_issues i where i.id=issue_elements.issue_id and i.is_published=true));
drop policy if exists "published propositions are readable" on public.legal_propositions;
create policy "published propositions are readable" on public.legal_propositions for select to anon,authenticated using (is_published=true and review_status='verified');
drop policy if exists "published issue authorities are readable" on public.issue_authorities;
create policy "published issue authorities are readable" on public.issue_authorities for select to anon,authenticated using (exists(select 1 from public.legal_issues i where i.id=issue_authorities.issue_id and i.is_published=true));
drop policy if exists "verified citations are readable" on public.legal_citations;
create policy "verified citations are readable" on public.legal_citations for select to anon,authenticated using (verified=true);
drop policy if exists "published decoded explanations are readable" on public.decoded_explanations;
create policy "published decoded explanations are readable" on public.decoded_explanations for select to anon,authenticated using (is_published=true and review_status='verified');
drop policy if exists "published legal documents are readable" on public.legal_documents;
create policy "published legal documents are readable" on public.legal_documents for select to anon,authenticated using (exists(select 1 from public.legal_sources s where s.id=legal_documents.source_id and s.is_published=true));
drop policy if exists "published legal chunks are readable" on public.legal_chunks;
create policy "published legal chunks are readable" on public.legal_chunks for select to anon,authenticated using (exists(select 1 from public.legal_sources s where s.id=legal_chunks.source_id and s.is_published=true));

insert into public.legal_sources(source_type,authority_level,jurisdiction,court_or_agency,title,citation,official_url,status,binding_status,precedential_status,last_verified_at,is_published,metadata) values
('case',1,'US','U.S. Supreme Court','Nieves v. Bartlett','587 U.S. 391 (2019)','https://www.supremecourt.gov/search.aspx?Search=Nieves%20v.%20Bartlett','current','binding','precedential',now(),true,'{"docket":"17-1174"}'),
('case',1,'US','U.S. Supreme Court','Hartman v. Moore','547 U.S. 250 (2006)','https://www.supremecourt.gov/search.aspx?Search=Hartman%20v.%20Moore','current','binding','precedential',now(),true,'{}'),
('case',1,'US','U.S. Supreme Court','Mt. Healthy City School District Board of Education v. Doyle','429 U.S. 274 (1977)','https://www.supremecourt.gov/search.aspx?Search=Mt.%20Healthy%20v.%20Doyle','current','binding','precedential',now(),true,'{}'),
('case',1,'US','U.S. Supreme Court','Lozman v. Riviera Beach','585 U.S. 87 (2018)','https://www.supremecourt.gov/search.aspx?Search=Lozman%20v.%20Riviera%20Beach','current','binding','precedential',now(),true,'{"docket":"17-21"}'),
('case',1,'US','U.S. Supreme Court','Katz v. United States','389 U.S. 347 (1967)','https://www.supremecourt.gov/search.aspx?Search=Katz%20v.%20United%20States','current','binding','precedential',now(),true,'{}'),
('case',1,'US','U.S. Supreme Court','United States v. Jones','565 U.S. 400 (2012)','https://www.supremecourt.gov/search.aspx?Search=United%20States%20v.%20Jones','current','binding','precedential',now(),true,'{}'),
('case',1,'US','U.S. Supreme Court','Florida v. Jardines','569 U.S. 1 (2013)','https://www.supremecourt.gov/search.aspx?Search=Florida%20v.%20Jardines','current','binding','precedential',now(),true,'{"docket":"11-564"}'),
('statute',1,'US','U.S. Congress','Civil action for deprivation of rights','42 U.S.C. § 1983','https://www.govinfo.gov/app/details/USCODE-2023-title42/USCODE-2023-title42-chap21-subchapI-sec1983','current','binding',null,now(),true,'{"role":"civil-rights-remedy"}')
on conflict(jurisdiction,citation,title) do update set official_url=excluded.official_url,is_published=true,last_verified_at=excluded.last_verified_at;

insert into public.legal_issues(issue_code,issue_name,legal_domain,description,jurisdiction,is_published) values
('FIRST_AMENDMENT_RETALIATION','First Amendment Retaliation','Civil Rights','Potential retaliation by a government actor because of protected First Amendment activity. The Analyzer evaluates the governing doctrine for the specific type of adverse action and jurisdiction.','US',true),
('FOURTH_AMENDMENT_SEARCH','Fourth Amendment Search','Civil Rights','Whether government conduct constitutes a search under the Fourth Amendment and, if so, whether the search was reasonable or supported by a warrant or recognized exception.','US',true)
on conflict(issue_code) do update set description=excluded.description,is_published=true;

insert into public.issue_elements(issue_id,element_code,element_name,element_description,required,sequence_no,jurisdiction,authority_note)
select i.id,v.code,v.name,v.descr,v.req,v.seq,'US',v.note from public.legal_issues i cross join lateral(values
('FAR_PROTECTED_ACTIVITY','Protected First Amendment activity','Identify the speech, petition, association, or other conduct alleged to be constitutionally protected.',true,1,'Assess protected status under the applicable doctrine.'),
('FAR_ADVERSE_ACTION','Adverse government action','Identify the government action allegedly taken against the claimant.',true,2,'The required showing can vary with the type of adverse action.'),
('FAR_CAUSATION','Causal connection','Assess whether the protected activity was a legally sufficient cause of the adverse action.',true,3,'Causation standards vary by retaliation context.'),
('FAR_DEFENSES_LIMITATIONS','Defenses and context','Identify probable cause, independent reasons, objective evidence, or other doctrine-specific limitations.',false,4,'Nieves, Hartman, Mt. Healthy, Lozman and other authorities apply in different contexts.')
)v(code,name,descr,req,seq,note) where i.issue_code='FIRST_AMENDMENT_RETALIATION'
on conflict(issue_id,element_code) do nothing;

insert into public.issue_elements(issue_id,element_code,element_name,element_description,required,sequence_no,jurisdiction,authority_note)
select i.id,v.code,v.name,v.descr,v.req,v.seq,'US',v.note from public.legal_issues i cross join lateral(values
('FAS_GOVERNMENT_ACTION','Government conduct','Identify the government conduct alleged to be a search.',true,1,'The Fourth Amendment constrains government searches and seizures.'),
('FAS_PROTECTED_INTEREST','Protected privacy or property interest','Identify the privacy or property interest implicated by the conduct.',true,2,'Katz and the property-based line of cases both matter depending on the facts.'),
('FAS_SEARCH','Search occurred','Determine whether the challenged conduct qualifies as a search under the applicable Fourth Amendment framework.',true,3,'Katz, Jones, Jardines and later cases illustrate distinct routes to a search determination.'),
('FAS_REASONABLENESS','Reasonableness / warrant / exception','If a search occurred, identify warrant status, probable cause, consent, exigency, or another recognized doctrine.',true,4,'The reasonableness analysis is fact- and exception-specific.')
)v(code,name,descr,req,seq,note) where i.issue_code='FOURTH_AMENDMENT_SEARCH'
on conflict(issue_id,element_code) do nothing;

insert into public.legal_propositions(source_id,proposition,proposition_type,jurisdiction,binding_status,confidence_status,review_status,is_published)
select s.id,v.proposition,v.type,'US','binding','verified_primary','verified',true from public.legal_sources s cross join lateral(values
('The Supreme Court recognized a framework for First Amendment retaliation claims in the public-employment context under which protected activity and causation are evaluated, while the government may show it would have taken the same action regardless.','rule')
)v(proposition,type) where s.citation='429 U.S. 274 (1977)' and not exists(select 1 from public.legal_propositions p where p.source_id=s.id and p.proposition=v.proposition);
insert into public.legal_propositions(source_id,proposition,proposition_type,jurisdiction,binding_status,confidence_status,review_status,is_published)
select s.id,'In a retaliatory-prosecution context, the causal relationship between protected activity and the prosecutorial decision is a central part of the constitutional analysis.','rule','US','binding','verified_primary','verified',true from public.legal_sources s where s.citation='547 U.S. 250 (2006)' and not exists(select 1 from public.legal_propositions p where p.source_id=s.id);
insert into public.legal_propositions(source_id,proposition,proposition_type,jurisdiction,binding_status,confidence_status,review_status,is_published)
select s.id,'For retaliatory-arrest claims, the Supreme Court addressed the relationship between probable cause and the required showing of retaliatory motive, including an objective-evidence circumstance involving similarly situated people who were not arrested.','limitation','US','binding','verified_primary','verified',true from public.legal_sources s where s.citation='587 U.S. 391 (2019)' and not exists(select 1 from public.legal_propositions p where p.source_id=s.id);
insert into public.legal_propositions(source_id,proposition,proposition_type,jurisdiction,binding_status,confidence_status,review_status,is_published)
select s.id,'The Court addressed a retaliatory-arrest claim involving a city-council meeting and explained why the ordinary Mt. Healthy framework did not resolve that particular arrest context.','limitation','US','binding','verified_primary','verified',true from public.legal_sources s where s.citation='585 U.S. 87 (2018)' and not exists(select 1 from public.legal_propositions p where p.source_id=s.id);
insert into public.legal_propositions(source_id,proposition,proposition_type,jurisdiction,binding_status,confidence_status,review_status,is_published)
select s.id,'The Fourth Amendment search inquiry includes the privacy interests recognized in Katz; whether government conduct is a search depends on the applicable constitutional framework and the facts.','definition','US','binding','verified_primary','verified',true from public.legal_sources s where s.citation='389 U.S. 347 (1967)' and not exists(select 1 from public.legal_propositions p where p.source_id=s.id);
insert into public.legal_propositions(source_id,proposition,proposition_type,jurisdiction,binding_status,confidence_status,review_status,is_published)
select s.id,'A physical intrusion by government officers into a constitutionally protected area for the purpose of obtaining information can constitute a Fourth Amendment search under the property-based framework.','rule','US','binding','verified_primary','verified',true from public.legal_sources s where s.citation='565 U.S. 400 (2012)' and not exists(select 1 from public.legal_propositions p where p.source_id=s.id);
insert into public.legal_propositions(source_id,proposition,proposition_type,jurisdiction,binding_status,confidence_status,review_status,is_published)
select s.id,'Government use of a drug-sniffing dog at the front door of a home was analyzed as a search under a property-based trespassory framework.','rule','US','binding','verified_primary','verified',true from public.legal_sources s where s.citation='569 U.S. 1 (2013)' and not exists(select 1 from public.legal_propositions p where p.source_id=s.id);
insert into public.legal_propositions(source_id,proposition,proposition_type,jurisdiction,binding_status,confidence_status,review_status,is_published)
select s.id,'Section 1983 provides a federal civil remedy when a person acting under color of state law causes a deprivation of rights secured by the Constitution or federal law, subject to the statute and applicable doctrine.','rule','US','binding','verified_primary','verified',true from public.legal_sources s where s.citation='42 U.S.C. § 1983' and not exists(select 1 from public.legal_propositions p where p.source_id=s.id);

insert into public.issue_authorities(issue_id,source_id,proposition_id,relationship,priority,jurisdiction)
select i.id,s.id,p.id,case when s.citation='42 U.S.C. § 1983' then 'explains' else 'controls' end,case when s.citation='42 U.S.C. § 1983' then 5 else 10 end,'US'
from public.legal_issues i join public.legal_sources s on
(i.issue_code='FIRST_AMENDMENT_RETALIATION' and s.citation in('429 U.S. 274 (1977)','547 U.S. 250 (2006)','587 U.S. 391 (2019)','585 U.S. 87 (2018)','42 U.S.C. § 1983'))
or (i.issue_code='FOURTH_AMENDMENT_SEARCH' and s.citation in('389 U.S. 347 (1967)','565 U.S. 400 (2012)','569 U.S. 1 (2013)','42 U.S.C. § 1983'))
join public.legal_propositions p on p.source_id=s.id
on conflict(issue_id,source_id,proposition_id,relationship) do nothing;

insert into public.decoded_explanations(issue_id,title,plain_language,what_it_means,what_it_does_not_mean,questions_to_ask,evidence_to_collect,common_misunderstandings,review_status,is_published)
select id,'First Amendment Retaliation — Plain Language','This issue asks whether a government actor took an adverse action because of protected First Amendment activity.','Identify the protected activity, government action, applicable causation standard, and context-specific defenses or limitations.','It does not mean every unpleasant government action after speech is unconstitutional retaliation.','{"What exactly was the protected speech, petition, association, or activity?","What government action followed?","Who made the decision?","What evidence connects the activity to the action?","Was there an independent reason for the action?"}','{"Original communications","Orders or notices","Timeline of protected activity and adverse action","Decision-maker communications","Comparable treatment evidence","Official records showing stated reasons"}','{"Treating temporal sequence alone as conclusive causation","Applying the same retaliation test to every type of government action","Treating an allegation as an established fact"}','verified',true from public.legal_issues where issue_code='FIRST_AMENDMENT_RETALIATION'
on conflict(issue_id,title) do nothing;
insert into public.decoded_explanations(issue_id,title,plain_language,what_it_means,what_it_does_not_mean,questions_to_ask,evidence_to_collect,common_misunderstandings,review_status,is_published)
select id,'Fourth Amendment Search — Plain Language','This issue asks whether government conduct legally qualifies as a search and, if so, whether the search was reasonable.','Examine privacy-based and property/trespass-based theories, then evaluate warrant and exception issues when a search is found.','It does not mean every observation or government contact is a search.','{"What did the government physically do?","Where did it occur?","Whose person, home, device, papers, or effects were involved?","Was there a warrant?","Was there consent or another asserted exception?"}','{"Warrant and affidavit","Body-camera or surveillance records","Photographs/video","Search reports","Consent forms or recordings","Property/location records","Digital logs where relevant"}','{"Assuming a warrant is always required","Relying only on the Katz privacy formulation","Ignoring property-based search doctrine"}','verified',true from public.legal_issues where issue_code='FOURTH_AMENDMENT_SEARCH'
on conflict(issue_id,title) do nothing;
