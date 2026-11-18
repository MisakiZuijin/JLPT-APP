-- =========================================================
-- JLPT App - Skema Fase 4: Simulasi Ujian JLPT & Catatan Kesalahan
-- Jalankan di Supabase Dashboard > SQL Editor
-- =========================================================

-- ---------- EXAM ATTEMPTS ----------
create table if not exists public.exam_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  jlpt_level text not null check (jlpt_level in ('N5','N4','N3','N2','N1')),
  section_scores jsonb not null default '[]'::jsonb,
  total_score int not null default 0,
  max_score int not null default 180,
  passed boolean not null default false,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists exam_attempts_user_idx on public.exam_attempts (user_id, created_at desc);

alter table public.exam_attempts enable row level security;
create policy "exam_attempts: own all" on public.exam_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- MISTAKES NOTEBOOK ----------
create table if not exists public.mistakes_notebook (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null default 'Kosakata & Kanji',
  prompt text not null,
  your_answer text,
  correct_answer text not null,
  explanation text,
  wrong_count int not null default 1,
  resolved boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, prompt)
);

create index if not exists mistakes_notebook_user_idx on public.mistakes_notebook (user_id, resolved, wrong_count desc);

alter table public.mistakes_notebook enable row level security;
create policy "mistakes_notebook: own all" on public.mistakes_notebook
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
