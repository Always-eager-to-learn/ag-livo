create table research_reports (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  report text not null,
  sources text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_research_reports_created_at on research_reports(created_at desc);
