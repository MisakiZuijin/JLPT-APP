-- =========================================================
-- JLPT App - Skema Fase 2: Membaca, Menulis Goresan & Katakana SRS
-- Jalankan di Supabase Dashboard > SQL Editor
-- =========================================================

-- ---------- READING PASSAGES ----------
create table if not exists public.reading_passages (
  id bigint generated always as identity primary key,
  slug text not null unique,
  jlpt_level text not null check (jlpt_level in ('N5','N4','N3','N2','N1')),
  title_ja text not null,
  title_reading text,
  title_id text not null,
  estimated_minutes smallint not null default 5,
  tokens jsonb not null default '[]'::jsonb,
  translation_id text not null,
  questions jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.reading_passages enable row level security;
create policy "reading_passages: readable by logged-in users" on public.reading_passages
  for select to authenticated using (true);

-- ---------- READING PROGRESS ----------
create table if not exists public.reading_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  passage_slug text not null,
  score smallint not null default 0,
  total smallint not null default 0,
  completed_at timestamptz not null default now(),
  unique (user_id, passage_slug)
);

alter table public.reading_progress enable row level security;
create policy "reading_progress: own all" on public.reading_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- WRITING PROGRESS ----------
create table if not exists public.writing_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  character text not null,
  script_type text not null check (script_type in ('hiragana','katakana','kanji')),
  jlpt_level text not null default 'N5' check (jlpt_level in ('N5','N4','N3','N2','N1')),
  best_accuracy numeric(5,2) not null default 0,
  attempts int not null default 0,
  mastered boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, character)
);

alter table public.writing_progress enable row level security;
create policy "writing_progress: own all" on public.writing_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- KATAKANA MASUK KE SRS ----------
insert into public.items (type, jlpt_level, term, reading, meaning, sort_order)
select 'kana', 'N5', k.term, k.romaji, 'Katakana: ' || k.romaji, k.ord
from (values
  ('ア','a',501),('イ','i',502),('ウ','u',503),('エ','e',504),('オ','o',505),
  ('カ','ka',506),('キ','ki',507),('ク','ku',508),('ケ','ke',509),('コ','ko',510),
  ('サ','sa',511),('シ','shi',512),('ス','su',513),('セ','se',514),('ソ','so',515),
  ('タ','ta',516),('チ','chi',517),('ツ','tsu',518),('テ','te',519),('ト','to',520),
  ('ナ','na',521),('ニ','ni',522),('ヌ','nu',523),('ネ','ne',524),('ノ','no',525),
  ('ハ','ha',526),('ヒ','hi',527),('フ','fu',528),('ヘ','he',529),('ホ','ho',530),
  ('マ','ma',531),('ミ','mi',532),('ム','mu',533),('メ','me',534),('モ','mo',535),
  ('ヤ','ya',536),('ユ','yu',537),('ヨ','yo',538),
  ('ラ','ra',539),('リ','ri',540),('ル','ru',541),('レ','re',542),('ロ','ro',543),
  ('ワ','wa',544),('ヲ','wo',545),('ン','n',546)
) as k(term, romaji, ord)
on conflict do nothing;
