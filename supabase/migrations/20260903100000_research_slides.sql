-- A document of kind slides is a deck: every h2 a slide (RESEARCH.md
-- section 16, shared/research-write.ts slidesOf). The CHECK on
-- research_documents.kind was unnamed in 20260902220000, so it
-- carries Postgres's own name; DOCUMENT_KINDS in
-- shared/research-write.ts is the same list and check-research.ts
-- compares the two.

alter table public.research_documents
  drop constraint if exists research_documents_kind_check;
alter table public.research_documents
  add constraint research_documents_kind_check
  check (kind in ('chapter','paper','proposal','abstract','letter','other','slides'));
