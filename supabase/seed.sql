-- =========================================================
-- Seed awal: Hiragana dasar + kosakata N5 contoh
-- Jalankan SETELAH migrations/0001_init.sql
-- =========================================================

-- Hiragana (46 dasar)
insert into public.items (type, jlpt_level, term, reading, meaning, sort_order)
select 'kana', 'N5', k.term, k.romaji, 'Hiragana: ' || k.romaji, k.ord
from (values
  ('あ','a',1),('い','i',2),('う','u',3),('え','e',4),('お','o',5),
  ('か','ka',6),('き','ki',7),('く','ku',8),('け','ke',9),('こ','ko',10),
  ('さ','sa',11),('し','shi',12),('す','su',13),('せ','se',14),('そ','so',15),
  ('た','ta',16),('ち','chi',17),('つ','tsu',18),('て','te',19),('と','to',20),
  ('な','na',21),('に','ni',22),('ぬ','nu',23),('ね','ne',24),('の','no',25),
  ('は','ha',26),('ひ','hi',27),('ふ','fu',28),('へ','he',29),('ほ','ho',30),
  ('ま','ma',31),('み','mi',32),('む','mu',33),('め','me',34),('も','mo',35),
  ('や','ya',36),('ゆ','yu',37),('よ','yo',38),
  ('ら','ra',39),('り','ri',40),('る','ru',41),('れ','re',42),('ろ','ro',43),
  ('わ','wa',44),('を','wo',45),('ん','n',46)
) as k(term, romaji, ord)
on conflict do nothing;

-- Kosakata N5 contoh (arti Bahasa Indonesia)
insert into public.items (type, jlpt_level, term, reading, meaning, example_ja, example_id, sort_order)
values
  ('vocab','N5','私','わたし','saya','私は学生です。','Saya adalah pelajar.',100),
  ('vocab','N5','学生','がくせい','pelajar, mahasiswa','彼は学生です。','Dia adalah pelajar.',101),
  ('vocab','N5','先生','せんせい','guru','先生はやさしいです。','Gurunya baik hati.',102),
  ('vocab','N5','水','みず','air','水を飲みます。','Saya minum air.',103),
  ('vocab','N5','食べる','たべる','makan','ご飯を食べる。','Makan nasi.',104),
  ('vocab','N5','飲む','のむ','minum','お茶を飲む。','Minum teh.',105),
  ('vocab','N5','行く','いく','pergi','学校へ行く。','Pergi ke sekolah.',106),
  ('vocab','N5','来る','くる','datang','友達が来る。','Teman datang.',107),
  ('vocab','N5','見る','みる','melihat','テレビを見る。','Menonton TV.',108),
  ('vocab','N5','本','ほん','buku','本を読みます。','Saya membaca buku.',109),
  ('vocab','N5','読む','よむ','membaca','新聞を読む。','Membaca koran.',110),
  ('vocab','N5','書く','かく','menulis','名前を書く。','Menulis nama.',111),
  ('vocab','N5','話す','はなす','berbicara','日本語を話す。','Berbicara bahasa Jepang.',112),
  ('vocab','N5','聞く','きく','mendengar, bertanya','音楽を聞く。','Mendengarkan musik.',113),
  ('vocab','N5','大きい','おおきい','besar','大きい家です。','Rumah yang besar.',114),
  ('vocab','N5','小さい','ちいさい','kecil','小さい猫がいます。','Ada kucing kecil.',115),
  ('vocab','N5','今日','きょう','hari ini','今日は暑いです。','Hari ini panas.',116),
  ('vocab','N5','明日','あした','besok','明日学校に行きます。','Besok saya ke sekolah.',117),
  ('vocab','N5','昨日','きのう','kemarin','昨日雨が降りました。','Kemarin hujan.',118),
  ('vocab','N5','友達','ともだち','teman','友達と遊びます。','Bermain dengan teman.',119),
  ('vocab','N5','日本語','にほんご','bahasa Jepang','日本語を勉強します。','Saya belajar bahasa Jepang.',120),
  ('vocab','N5','勉強','べんきょう','belajar','毎日勉強します。','Belajar setiap hari.',121),
  ('vocab','N5','電車','でんしゃ','kereta listrik','電車で行きます。','Pergi naik kereta.',122),
  ('vocab','N5','駅','えき','stasiun','駅はどこですか。','Stasiun di mana?',123),
  ('vocab','N5','高い','たかい','mahal, tinggi','この本は高いです。','Buku ini mahal.',124)
on conflict do nothing;

-- Kanji N5 contoh
insert into public.items (type, jlpt_level, term, reading, meaning, extra, sort_order)
values
  ('kanji','N5','日','にち・ひ','hari, matahari','{"onyomi":["ニチ","ジツ"],"kunyomi":["ひ","か"],"strokes":4}',200),
  ('kanji','N5','月','げつ・つき','bulan','{"onyomi":["ゲツ","ガツ"],"kunyomi":["つき"],"strokes":4}',201),
  ('kanji','N5','火','か・ひ','api','{"onyomi":["カ"],"kunyomi":["ひ"],"strokes":4}',202),
  ('kanji','N5','水','すい・みず','air','{"onyomi":["スイ"],"kunyomi":["みず"],"strokes":4}',203),
  ('kanji','N5','木','もく・き','pohon','{"onyomi":["モク","ボク"],"kunyomi":["き"],"strokes":4}',204),
  ('kanji','N5','人','じん・ひと','orang','{"onyomi":["ジン","ニン"],"kunyomi":["ひと"],"strokes":2}',205),
  ('kanji','N5','山','さん・やま','gunung','{"onyomi":["サン"],"kunyomi":["やま"],"strokes":3}',206),
  ('kanji','N5','口','こう・くち','mulut','{"onyomi":["コウ","ク"],"kunyomi":["くち"],"strokes":3}',207)
on conflict do nothing;
