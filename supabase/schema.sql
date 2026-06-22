-- ─────────────────────────────────────────────────────────────
-- ZORYVA DATABASE SCHEMA
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

-- 1. PROFILES (one row per user, extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text default 'free' check (subscription_status in ('free', 'active', 'canceled', 'past_due')),
  plan_type text default 'free' check (plan_type in ('free', 'pro', 'business')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. TRANSACTIONS
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('income', 'expense')),
  category text not null default 'Other',
  merchant text not null,
  amount numeric(10, 2) not null check (amount > 0),
  date date not null,
  source text not null default 'personal' check (source in ('personal', 'business')),
  notes text,
  created_at timestamptz default now()
);

create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_date_idx on public.transactions(date desc);
create index if not exists transactions_source_idx on public.transactions(source);

-- 3. BUDGETS
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  category text not null,
  amount numeric(10, 2) not null check (amount > 0),
  month date not null,  -- stored as first day of month: 2025-06-01
  created_at timestamptz default now(),
  unique(user_id, category, month)
);

create index if not exists budgets_user_id_idx on public.budgets(user_id);

-- 4. AI MESSAGES (conversation history)
create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists ai_messages_user_id_idx on public.ai_messages(user_id);
create index if not exists ai_messages_created_at_idx on public.ai_messages(created_at desc);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (users can only see their own data)
-- ─────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.ai_messages enable row level security;

-- Profiles: users can read/update only their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Transactions: full CRUD for own rows
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Budgets
create policy "Users can view own budgets"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert own budgets"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own budgets"
  on public.budgets for update
  using (auth.uid() = user_id);

create policy "Users can delete own budgets"
  on public.budgets for delete
  using (auth.uid() = user_id);

-- AI Messages
create policy "Users can view own ai_messages"
  on public.ai_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own ai_messages"
  on public.ai_messages for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- SAMPLE DATA (optional — delete if you don't want demo data)
-- Replace 'your-user-id-here' with your actual Supabase user ID
-- ─────────────────────────────────────────────────────────────

-- To insert sample data after signing up:
-- 1. Sign up at your app
-- 2. Go to Supabase → Table Editor → profiles → find your row → copy your ID
-- 3. Replace 'your-user-id-here' below and run

/*
insert into public.transactions (user_id, type, category, merchant, amount, date, source) values
  ('your-user-id-here', 'income',  'Business',    'Client Payment',      3200.00, current_date - 1,  'personal'),
  ('your-user-id-here', 'expense', 'Housing',      'Rent',               1850.00, current_date - 1,  'personal'),
  ('your-user-id-here', 'expense', 'Food & Dining','Nobu Restaurant',     186.00, current_date - 2,  'personal'),
  ('your-user-id-here', 'expense', 'Shopping',     'Sephora',              84.50, current_date,      'personal'),
  ('your-user-id-here', 'income',  'Business',    'Retainer — Nova',    2000.00, current_date - 3,  'business'),
  ('your-user-id-here', 'expense', 'Business',    'Adobe Creative Cloud', 59.99, current_date - 4,  'business'),
  ('your-user-id-here', 'expense', 'Business',    'Meta Ads',            800.00, current_date - 5,  'business'),
  ('your-user-id-here', 'income',  'Business',    'Brand Identity',     4500.00, current_date - 6,  'business');
*/
