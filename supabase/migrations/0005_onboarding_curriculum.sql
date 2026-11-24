-- =========================================================
-- JLPT App - Migrasi 0005: Onboarding, Kurikulum Formal & Misi Harian
-- Jalankan di Supabase Dashboard > SQL Editor (aman dijalankan ulang / idempoten)
-- Ref: docs/LEARNING_FLOW_AND_CURRICULUM.md (Bagian 7)
-- =========================================================

-- ---------- 1. PERLUASAN TABEL PROFILES ----------
alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists learning_goal text not null default 'jlpt',
  add column if not exists current_stage text not null default 'PRE_N5',
  add column if not exists study_minutes_daily smallint not null default 30,
  add column if not exists exam_target_period text,
  add column if not exists placement_score jsonb not null default '{}'::jsonb,
  add column if not exists romaji_enabled boolean not null default true,
  add column if not exists furigana_mode text not null default 'all';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_learning_goal_check'
  ) then
    alter table public.profiles
      add constraint profiles_learning_goal_check
      check (learning_goal in ('jlpt', 'work_ssw', 'study_jp', 'general'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_current_stage_check'
  ) then
    alter table public.profiles
      add constraint profiles_current_stage_check
      check (current_stage in ('PRE_N5', 'N5', 'N4', 'N3', 'N2', 'N1'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_study_minutes_daily_check'
  ) then
    alter table public.profiles
      add constraint profiles_study_minutes_daily_check
      check (study_minutes_daily in (15, 30, 60));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'profiles_furigana_mode_check'
  ) then
    alter table public.profiles
      add constraint profiles_furigana_mode_check
      check (furigana_mode in ('all', 'smart', 'off'));
  end if;
end $$;

-- Pastikan user dapat membuat baris profil sendiri jika belum terbuat oleh trigger
drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

-- Perbarui trigger pendaftaran akun baru agar membaca display_name / full_name
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 2. PENGIKAT UNIT PADA TABEL ITEMS ----------
alter table public.items
  add column if not exists unit_code text;

create index if not exists items_unit_code_idx
  on public.items (jlpt_level, unit_code, sort_order);

-- Pemetaan awal item eksisting yang belum memiliki unit_code
update public.items
set unit_code = case
  when type = 'kana' and sort_order < 100 then '0.1'
  when type = 'kana' then '0.3'
  when jlpt_level = 'N5' and type = 'kanji' then '1.1'
  when jlpt_level = 'N5' and type = 'vocab' then '1.1'
  when jlpt_level = 'N5' and type = 'grammar' then '1.1'
  else unit_code
end
where unit_code is null;

-- ---------- 3. TABEL DEFINISI UNIT KURIKULUM FORMAL ----------
create table if not exists public.curriculum_units (
  id bigint generated always as identity primary key,
  stage text not null check (stage in ('PRE_N5', 'N5', 'N4', 'N3', 'N2', 'N1')),
  unit_code text not null unique,
  title_ja text not null,
  title_id text not null,
  can_do_id text not null,
  lesson_summary_md text not null default '',
  romaji_default boolean not null default false,
  sort_order int not null default 0,
  required_accuracy smallint not null default 70 check (required_accuracy between 50 and 100),
  created_at timestamptz not null default now()
);

create index if not exists curriculum_units_stage_idx
  on public.curriculum_units (stage, sort_order);

alter table public.curriculum_units enable row level security;

drop policy if exists "curriculum_units: readable by authenticated" on public.curriculum_units;
create policy "curriculum_units: readable by authenticated" on public.curriculum_units
  for select to authenticated using (true);

-- ---------- 4. PROGRES PELAJAR PER UNIT KURIKULUM ----------
create table if not exists public.user_unit_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  unit_code text not null references public.curriculum_units(unit_code) on delete cascade,
  lesson_read boolean not null default false,
  status text not null default 'locked' check (status in ('locked', 'active', 'completed')),
  accuracy numeric(5, 2) not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, unit_code)
);

create index if not exists user_unit_progress_user_idx
  on public.user_unit_progress (user_id, status);

alter table public.user_unit_progress enable row level security;

drop policy if exists "user_unit_progress: own all" on public.user_unit_progress;
create policy "user_unit_progress: own all" on public.user_unit_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- 5. LOG MISI HARIAN 4 LANGKAH ----------
create table if not exists public.daily_mission_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_date date not null default current_date,
  step_review_done boolean not null default false,
  step_input_done boolean not null default false,
  step_skill_done boolean not null default false,
  step_test_done boolean not null default false,
  skill_mode text not null default 'reading' check (skill_mode in ('reading', 'speaking')),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, mission_date)
);

create index if not exists daily_mission_logs_user_date_idx
  on public.daily_mission_logs (user_id, mission_date desc);

alter table public.daily_mission_logs enable row level security;

drop policy if exists "daily_mission_logs: own all" on public.daily_mission_logs;
create policy "daily_mission_logs: own all" on public.daily_mission_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- 6. SEED DEFINISI 30 UNIT KURIKULUM FORMAL (TAHAP 0 - TAHAP 5) ----------
insert into public.curriculum_units
  (stage, unit_code, title_ja, title_id, can_do_id, lesson_summary_md, romaji_default, sort_order, required_accuracy)
values
  -- Tahap 0 · Pra-N5
  ('PRE_N5', '0.1', 'ひらがな基礎', 'Hiragana Dasar', 'Membaca dan menulis 46 Hiragana dasar, angka 0–10, dan salam dasar.', 'Fokus pada bunyi vokal bersih a-i-u-e-o, 46 huruf dasar Hiragana, serta pengecualian baca partikel は (wa) dan を (o).', true, 1, 85),
  ('PRE_N5', '0.2', '濁音・拗音・発音', 'Modifikasi Bunyi & Pelafalan', 'Membedakan Dakuon, Handakuon, Youon, konsonan ganda (っ), dan vokal panjang.', 'Pelajari perbedaan bunyi penting seperti きって vs きて dan おばあさん vs おばさん agar tidak berubah arti.', true, 2, 85),
  ('PRE_N5', '0.3', 'カタカナ・入門テスト', 'Katakana & Gerbang Pra-N5', 'Membaca 46 Katakana + kata serapan tanpa romaji dan lulus gerbang Tahap 0.', 'Kuasai Katakana untuk nama negara dan kata serapan kerja. Lulus kuis gerbang >= 85% untuk mematikan romaji default.', false, 3, 85),

  -- Tahap 1 · JLPT N5 (8 Unit)
  ('N5', '1.1', '自己紹介', 'Identitas, Negara & Bilangan Dasar', 'Memperkenalkan nama, negara, profesi, usia, dan angka dasar secara sopan.', 'Pola inti N1 は N2 です / じゃありません, kalimat tanya 〜か, partikel の & も, serta 14 Kanji angka.', false, 11, 70),
  ('N5', '1.2', '買い物・時間', 'Benda, Harga, Jam & Tanggal', 'Menanyakan harga, jam buka toko, hari, dan tanggal saat berbelanja.', 'Pola これ・それ・あれ, ここ・そこ・あそこ, partikel waktu に, rentang から〜まで, serta bacaan menit & tanggal.', false, 12, 70),
  ('N5', '1.3', '毎日の生活', 'Aktivitas Harian & Kata Kerja Sopan', 'Menceritakan rutinitas harian, transportasi, dan mengajak rekan beraktivitas.', 'Konjugasi ます / ません / ました / ませんでした, partikel で (lokasi aksi & alat), を (objek), へ (arah), dan 〜ましょう.', false, 13, 70),
  ('N5', '1.4', '家族・形容詞', 'Keluarga, Kata Sifat & Perbandingan', 'Mendeskripsikan anggota keluarga, sifat benda, dan pengalaman sederhana.', 'Perubahan kata sifat -い vs -な (positif, negatif, lampau), kata tanya どんな・どう, serta etika menyebut keluarga.', false, 14, 70),
  ('N5', '1.5', '存在・場所・数', 'Keberadaan, Arah & Kata Bantu Bilangan', 'Menyebutkan letak benda/orang dan menghitung objek dengan satuan hitung tepat.', 'Perbedaan あります vs います, pola lokasi [Tempat] に [Benda] が あります, serta drill kata bantu bilangan (〜つ, 〜人, 〜枚, 〜本).', false, 15, 70),
  ('N5', '1.6', 'て形・依頼と規則', 'Bentuk て, Permohonan & Aturan', 'Meminta tolong, meminta izin, dan memahami larangan/tata tertib dasar.', 'Klasifikasi kata kerja Golongan 1, 2, 3 menuju bentuk て: 〜てください, 〜ています, 〜てもいいですか, 〜てはいけません.', false, 16, 70),
  ('N5', '1.7', 'ない・辞書・た形', 'Larangan, Kemampuan & Pengalaman', 'Menyatakan larangan, kewajiban, kemampuan, pengalaman, dan ragam kasual dasar.', 'Konjugasi ない形, 辞書形, た形, dan 普通形 untuk pola 〜ないでください, 〜なければなりません, 〜ことができます, 〜たことがあります.', false, 17, 70),
  ('N5', '1.8', 'N5総復習・模擬試験', 'Integrasi & Simulasi Ujian JLPT N5', 'Menyelesaikan simulasi penuh JLPT N5 dengan skor lulus total & per bagian.', 'Review seluruh partikel N5, anak kalimat pewatas kata benda, pembersihan catatan salah, dan simulasi /exam/n5.', false, 18, 75),

  -- Tahap 2 · JLPT N4 (6 Unit)
  ('N4', '2.1', '理由・可能', 'Alasan, Kemampuan & Situasi', 'Menjelaskan latar belakang kendala dan menyatakan kemampuan dalam konteks harian/kerja.', 'Pola 〜んです / 〜んですが, Bentuk Potensial (可能形), 〜しか〜ません, 〜ながら, dan 〜てみます.', false, 21, 70),
  ('N4', '2.2', '計画・準備', 'Kehendak, Persiapan & Kondisi Hasil', 'Menyampaikan rencana kerja, persiapan sebelumnya, dan status hasil tindakan.', 'Bentuk Kehendak (意向形), 〜つもりです, 〜ておきます (persiapan), 〜てあります (kondisi hasil), dan 〜てしまいます.', false, 22, 70),
  ('N4', '2.3', '比較・条件', '4 Bentuk Syarat & Prediksi', 'Memilih pola pengandaian yang alami saat membaca manual atau instruksi kerja.', 'Perbandingan 4 bentuk syarat (と・ば・たら・なら), 〜ようにする / 〜ようになる, 〜かもしれません, dan 〜はずです.', false, 23, 70),
  ('N4', '2.4', '授受・親切', 'Memberi & Menerima Bantuan', 'Memohon bantuan dan berterima kasih dengan arah penerima yang tepat.', 'Pola benda & jasa あげる・もらう・くれる, 〜てあげる・〜てもらう・〜てくれる, serta 〜ていただけませんか.', false, 24, 70),
  ('N4', '2.5', '受身・使役', 'Kalimat Pasif, Kausatif & Izin Formal', 'Memahami instruksi keselamatan kerja, kalimat pasif, dan kalimat suruhan/izin.', 'Bentuk Pasif (受身形), Kausatif (使役形), Kausatif-Pasif (使役受身), 〜てほしい, dan 〜のに.', false, 25, 70),
  ('N4', '2.6', '敬語・N4模擬試験', 'Keigo Dasar, Hou-Ren-Sou & Ujian N4', 'Menggunakan Sonkeigo/Kenjougo dasar dalam wawancara kerja & lulus simulasi N4.', 'Kata kerja spesial Sonkeigo & Kenjougo, pola お〜になる vs お〜する, etika Hou-Ren-Sou, dan simulasi /exam/n4.', false, 26, 75),

  -- Tahap 3 · JLPT N3 (5 Unit)
  ('N3', '3.1', '話し言葉・縮約', 'Bahasa Lisan Kasual & Singkatan', 'Memahami bentuk lisan alami Jepang dalam percakapan rekan kerja/teman.', 'Singkatan lisan 〜ちゃう・〜てる・〜なきゃ serta perbedaan ragam kasual vs formal.', false, 31, 70),
  ('N3', '3.2', '原因・目的', 'Sebab-Akibat & Tujuan', 'Menyampaikan alasan positif/negatif dan tujuan secara terstruktur.', 'Kontras makna ために, せいで, おかげで, dan ekspresi sebab-akibat menengah.', false, 32, 70),
  ('N3', '3.3', '推量・引用・視点', 'Dugaan, Kutipan & Perspektif', 'Menangkap nuansa perkiraan dan sudut pandang pembicara pada berita/dialog.', 'Perbedaan らしい・ようだ・っぽい serta pola perspektif について・にとって.', false, 33, 70),
  ('N3', '3.4', 'ニュース・意見読解', 'Wacana Berita Pendek & Opini', 'Menemukan gagasan utama dan inferensi dalam artikel menengah N3.', 'Strategi membaca cepat wacana menengah & Listening Tipe 4 (概要理解).', false, 34, 70),
  ('N3', '3.5', 'N3総復習・模擬試験', 'Review & Simulasi JLPT N3', 'Menyelesaikan simulasi JLPT N3 memenuhi skor total >= 95 & tiap bagian >= 19.', 'Evaluasi terpadu Moji-Goi, Bunpou-Dokkai, dan Choukai pada /exam/n3.', false, 35, 75),

  -- Tahap 4 · JLPT N2 (4 Unit)
  ('N2', '4.1', '書き言葉・報告', 'Ekspresi Tulis & Laporan Formal', 'Memahami dan menyusun kalimat laporan resmi & pengumuman perusahaan.', 'Pola formal 〜にあたって, 〜をめぐって, 〜に伴って dalam dokumen resmi.', false, 41, 70),
  ('N2', '4.2', '話者の心情・制限', 'Nuansa Penutur & Pembatasan', 'Menangkap sikap batin, keharusan moral, dan pengecualian dalam argumen.', 'Pola nuansa 〜わけにはいかない, 〜ざるを得ない, dan 〜ものの.', false, 42, 70),
  ('N2', '4.3', '長文読解・ビジネス敬語', 'Bacaan Opini Panjang & Keigo Bisnis', 'Melakukan skimming/scanning teks panjang, surat bisnis, dan iklan.', 'Teknik baca cepat komparatif & komunikasi telepon/email bisnis Jepang.', false, 43, 70),
  ('N2', '4.4', 'N2総復習・模擬試験', 'Review & Simulasi JLPT N2', 'Menyelesaikan simulasi penuh JLPT N2 dengan manajemen waktu ketat.', 'Evaluasi penuh /exam/n2 (total >= 90 & setiap bagian >= 19).', false, 44, 75),

  -- Tahap 5 · JLPT N1 (4 Unit)
  ('N1', '5.1', '学術・文語表現', 'Tata Bahasa Akademis & Sastra', 'Memahami ungkapan tulis tingkat tinggi pada makalah, tajuk rencana, dan buku.', 'Pola lanjut 〜といえども, 〜を禁じ得ない, 〜極まる dalam wacana formal.', false, 51, 70),
  ('N1', '5.2', '論理構造・二重否定', 'Hubungan Argumen Kompleks & Negasi Ganda', 'Menganalisis struktur logika berlapis dan maksud implisit penulis.', 'Pembacaan kritis relasi kontras, konsesi, dan negasi ganda.', false, 52, 70),
  ('N1', '5.3', '抽象評論・統合理解', 'Esai Abstrak & Bacaan Komparatif', 'Membandingkan dua sudut pandang berbeda secara akurat di bawah batas waktu.', 'Latihan 統合理解 (pemahaman terpadu dua teks) dan主張 (klaim tersirat).', false, 53, 70),
  ('N1', '5.4', 'N1総復習・模擬試験', 'Review & Simulasi JLPT N1', 'Menyelesaikan simulasi penuh JLPT N1 memenuhi ambang kelulusan resmi.', 'Evaluasi penuh /exam/n1 (total >= 100 & setiap bagian >= 19).', false, 54, 75)
on conflict (unit_code) do update set
  stage = excluded.stage,
  title_ja = excluded.title_ja,
  title_id = excluded.title_id,
  can_do_id = excluded.can_do_id,
  lesson_summary_md = excluded.lesson_summary_md,
  romaji_default = excluded.romaji_default,
  sort_order = excluded.sort_order,
  required_accuracy = excluded.required_accuracy;
