-- =========================================================
-- JLPT App - Skema Fase Admin: Bank Soal Batch Gemini AI
-- Jalankan di Supabase Dashboard > SQL Editor
-- =========================================================

create table if not exists public.question_bank (
  id bigint generated always as identity primary key,
  jlpt_level text not null check (jlpt_level in ('N5','N4','N3','N2','N1')),
  section text not null check (section in ('Kosakata & Kanji','Tata Bahasa & Bacaan','Mendengarkan Audio')),
  prompt_ja text not null,
  prompt_id text not null,
  audio_text text,
  options jsonb not null default '[]'::jsonb,
  answer_index smallint not null check (answer_index between 0 and 3),
  explanation_id text not null,
  source text not null default 'gemini-3-flash-preview',
  approved boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists question_bank_level_idx on public.question_bank (jlpt_level, approved, created_at desc);

alter table public.question_bank enable row level security;
create policy "question_bank: readable by logged-in users" on public.question_bank
  for select to authenticated using (approved = true);
