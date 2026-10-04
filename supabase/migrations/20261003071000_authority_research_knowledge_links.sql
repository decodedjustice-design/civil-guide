-- Connect case-specific authorities to the existing legal knowledge layer.

alter table public.authorities
  add column if not exists legal_source_id uuid references public.legal_sources(id) on delete set null;

alter table public.authority_element_links
  add column if not exists proposition_id uuid references public.legal_propositions(id) on delete set null;

create index if not exists authorities_legal_source_id_idx
  on public.authorities(legal_source_id);

create index if not exists authority_element_links_proposition_id_idx
  on public.authority_element_links(proposition_id);
