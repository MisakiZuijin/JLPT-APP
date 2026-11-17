-- =========================================================
-- JLPT App - Skema awal (Fase 1)
-- Jalankan di Supabase Dashboard > SQL Editor
-- =========================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  target_level text not null default 'N5' check (target_level in ('N5','N4','N3','N2','N1')),
  daily_new_limit int not null default 10 check (daily_new_limit between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Buat profile otomatis saat user mendaftar
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- ITEMS (materi belajar) ----------
create table if not exists public.items (
  id bigint generated always as identity primary key,
  type text not null check (type in ('kana','vocab','kanji','grammar')),
  jlpt_level text not null check (jlpt_level in ('N5','N4','N3','N2','N1')),
  term text not null,            -- 食べる / あ / 〜ています
  reading text,                  -- たべる
  meaning text not null,         -- arti (Bahasa Indonesia)
  example_ja text,
  example_id text,
  extra jsonb not null default '{}'::jsonb,  -- stroke data, onyomi/kunyomi, dll
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (type, jlpt_level, term, reading)
);

create index if not exists items_level_type_idx on public.items (jlpt_level, type, sort_order);

alter table public.items enable row level security;
create policy "items: readable by logged-in users" on public.items
  for select to authenticated using (true);

-- ---------- USER CARDS (status FSRS per user per item) ----------
create table if not exists public.user_cards (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id bigint not null references public.items(id) on delete cascade,
  due timestamptz not null default now(),
  stability double precision not null default 0,
  difficulty double precision not null default 0,
  elapsed_days int not null default 0,
  scheduled_days int not null default 0,
  learning_steps int not null default 0,
  reps int not null default 0,
  lapses int not null default 0,
  state smallint not null default 0,   -- 0 New, 1 Learning, 2 Review, 3 Relearning
  last_review timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, item_id)
);

create index if not exists user_cards_due_idx on public.user_cards (user_id, due);

alter table public.user_cards enable row level security;
create policy "user_cards: own all" on public.user_cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- REVIEW LOGS ----------
create table if not exists public.review_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id bigint not null references public.items(id) on delete cascade,
  rating smallint not null check (rating between 1 and 4),
  state smallint not null,
  scheduled_days int not null,
  reviewed_at timestamptz not null default now()
);

create index if not exists review_logs_user_idx on public.review_logs (user_id, reviewed_at desc);

alter table public.review_logs enable row level security;
create policy "review_logs: own all" on public.review_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- (Disiapkan untuk Fase 3 & 4) ----------
create table if not exists public.pronunciation_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id bigint not null references public.items(id) on delete cascade,
  attempt_no smallint not null check (attempt_no between 1 and 5),
  transcript text,
  score numeric(5,2),
  passed boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.pronunciation_attempts enable row level security;
create policy "pron: own all" on public.pronunciation_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.daily_tests (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  test_date date not null default current_date,
  jlpt_level text not null,
  questions jsonb not null default '[]'::jsonb,
  answers jsonb,
  score numeric(5,2),
  completed_at timestamptz,
  unique (user_id, test_date)
);
alter table public.daily_tests enable row level security;
create policy "daily_tests: own all" on public.daily_tests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
