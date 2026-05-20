create extension if not exists "pgcrypto";

create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  created_at timestamptz not null default now(),
  team_size integer not null check (team_size > 0),
  primary_use_case text not null check (primary_use_case in ('coding', 'writing', 'data', 'research', 'mixed')),
  tools jsonb not null,
  result jsonb not null,
  ai_summary text not null,
  public_payload jsonb not null
);

create index if not exists audits_public_id_idx on public.audits (public_id);
create index if not exists audits_created_at_idx on public.audits (created_at desc);
create index if not exists audits_monthly_savings_idx on public.audits (((result->>'totalMonthlySavings')::numeric));

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  public_id text not null references public.audits(public_id) on delete cascade,
  email text not null,
  company_name text,
  role text,
  team_size integer,
  monthly_savings numeric not null default 0,
  annual_savings numeric not null default 0,
  ip_hash text,
  user_agent text
);

create index if not exists leads_public_id_idx on public.leads (public_id);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_monthly_savings_idx on public.leads (monthly_savings desc);

alter table public.audits enable row level security;
alter table public.leads enable row level security;

drop policy if exists "Service role can manage audits" on public.audits;
create policy "Service role can manage audits"
on public.audits
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage leads" on public.leads;
create policy "Service role can manage leads"
on public.leads
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
