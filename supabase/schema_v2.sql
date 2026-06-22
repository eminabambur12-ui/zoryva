-- ─────────────────────────────────────────────────────────────
-- ZORYVA SCHEMA V2 — Run AFTER schema.sql
-- Supabase Dashboard → SQL Editor → New query → paste → Run
-- ─────────────────────────────────────────────────────────────

-- Extend profiles with onboarding fields
alter table public.profiles
  add column if not exists onboarding_complete boolean default false,
  add column if not exists income_type text default 'other',
  add column if not exists wealth_score integer default 0,
  add column if not exists wealth_score_updated_at timestamptz;

-- 5. USER GOALS (multi-select, one row per goal)
create table if not exists public.user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  goal text not null,
  priority integer default 0,
  created_at timestamptz default now(),
  unique(user_id, goal)
);

create index if not exists user_goals_user_id_idx on public.user_goals(user_id);

-- 6. CONNECTED ACCOUNTS (which integrations are linked)
create table if not exists public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  provider text not null,        -- 'plaid', 'stripe', 'shopify', etc.
  provider_account_id text,      -- external account id
  account_name text,             -- e.g. "Chase Checking"
  account_type text,             -- 'checking', 'savings', 'credit', 'business'
  access_token text,             -- encrypted in production
  metadata jsonb default '{}',
  is_active boolean default true,
  last_synced_at timestamptz,
  connected_at timestamptz default now()
);

create index if not exists connected_accounts_user_id_idx on public.connected_accounts(user_id);
create unique index if not exists connected_accounts_user_provider_idx
  on public.connected_accounts(user_id, provider, provider_account_id);

-- 7. WEALTH SCORES (score history over time)
create table if not exists public.wealth_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer not null check (score >= 0 and score <= 100),
  -- component scores
  savings_rate_score integer default 0,
  investing_score integer default 0,
  income_growth_score integer default 0,
  business_score integer default 0,
  tax_efficiency_score integer default 0,
  emergency_fund_score integer default 0,
  -- context
  notes text,
  calculated_at timestamptz default now()
);

create index if not exists wealth_scores_user_id_idx on public.wealth_scores(user_id);
create index if not exists wealth_scores_calculated_at_idx on public.wealth_scores(calculated_at desc);

-- 8. ZARA ANALYSES (cached daily analysis results)
create table if not exists public.zara_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  analysis_date date not null default current_date,
  -- Zara's greeting and headline
  greeting text,
  headline text,
  -- opportunities as JSON array
  opportunities jsonb default '[]',
  -- daily briefing as JSON object
  daily_briefing jsonb default '{}',
  -- total annual impact identified
  total_annual_impact numeric(12, 2) default 0,
  created_at timestamptz default now(),
  unique(user_id, analysis_date)
);

create index if not exists zara_analyses_user_id_idx on public.zara_analyses(user_id);

-- 9. SIMULATOR SESSIONS (saved Future Me simulations)
create table if not exists public.simulator_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  decision_type text not null,   -- 'buy_car', 'buy_home', 'hire', etc.
  input_params jsonb default '{}',
  result jsonb default '{}',
  zara_recommendation text,
  created_at timestamptz default now()
);

create index if not exists simulator_sessions_user_id_idx on public.simulator_sessions(user_id);

-- 10. NEXT 10K REPORTS (cached Find My Next $10K results)
create table if not exists public.next_10k_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  report_date date not null default current_date,
  opportunities jsonb default '[]',
  total_identified numeric(12, 2) default 0,
  created_at timestamptz default now(),
  unique(user_id, report_date)
);

create index if not exists next_10k_reports_user_id_idx on public.next_10k_reports(user_id);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY for new tables
-- ─────────────────────────────────────────────────────────────

alter table public.user_goals enable row level security;
alter table public.connected_accounts enable row level security;
alter table public.wealth_scores enable row level security;
alter table public.zara_analyses enable row level security;
alter table public.simulator_sessions enable row level security;
alter table public.next_10k_reports enable row level security;

-- user_goals
create policy "Users manage own goals" on public.user_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- connected_accounts
create policy "Users manage own accounts" on public.connected_accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- wealth_scores
create policy "Users view own scores" on public.wealth_scores
  for select using (auth.uid() = user_id);
create policy "Service role inserts scores" on public.wealth_scores
  for insert with check (auth.uid() = user_id);

-- zara_analyses
create policy "Users view own analyses" on public.zara_analyses
  for select using (auth.uid() = user_id);
create policy "Users insert own analyses" on public.zara_analyses
  for insert with check (auth.uid() = user_id);
create policy "Users update own analyses" on public.zara_analyses
  for update using (auth.uid() = user_id);

-- simulator_sessions
create policy "Users manage own simulations" on public.simulator_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- next_10k_reports
create policy "Users manage own reports" on public.next_10k_reports
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
