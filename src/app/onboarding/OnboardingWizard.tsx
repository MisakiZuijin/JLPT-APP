"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ThemeToggleCompact } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconAward,
  IconBook,
  IconCalendar,
  IconCheck,
  IconClock,
  IconCompass,
  IconLogOut,
  IconShieldCheck,
} from "@/components/ui/Icons";
import {
  estimateWeeksToCompleteStage,
  evaluatePlacementAnswers,
  getDailyNewLimitForMinutes,
  getQuestionsByBlock,
  getSelectableStagesUpTo,
  getUpcomingExamPeriods,
  LEARNING_GOAL_OPTIONS,
  PLACEMENT_BLOCKS,
  shouldEarlyStopAfterBlock,
  STAGE_METADATA,
  STUDY_PACE_OPTIONS,
  type PlacementBlockId,
  type PlacementEvaluation,
} from "@/lib/japanese/placement-test";
import type {
  CurriculumStage,
  LearningGoal,
  Profile,
  StudyMinutesDaily,
} from "@/lib/types";
import { completeOnboarding } from "./actions";

type OnboardingWizardProps = {
  displayName: string;
  initialProfile: Profile | null;
  isRetake: boolean;
  isAdmin: boolean;
  logoutAction: () => Promise<void>;
};

type StepNumber = 1 | 2 | 3 | 4;
type ExperienceChoice = "zero" | "experienced";

const STEP_LABELS: { num: StepNumber; title: string; subtitle: string }[] = [
  { num: 1, title: "Tujuan Belajar", subtitle: "Pilih fokus utama" },
  { num: 2, title: "Pengalaman Awal", subtitle: "Pemula nol atau pernah belajar" },
  { num: 3, title: "Tes Penempatan", subtitle: "Maks. 15 soal adaptif" },
  { num: 4, title: "Jadwal Belajar", subtitle: "Ritme harian & target ujian" },
];

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export function OnboardingWizard({
  displayName,
  initialProfile,
  isRetake,
  isAdmin,
  logoutAction,
}: OnboardingWizardProps) {
  const [step, setStep] = useState<StepNumber>(1);
  const [learningGoal, setLearningGoal] = useState<LearningGoal>(
    initialProfile?.learning_goal ?? "jlpt",
  );
  const [experience, setExperience] = useState<ExperienceChoice | null>(null);

  // State khusus Langkah 3 (Tes Penempatan Adaptif)
  const [blockIndex, setBlockIndex] = useState(0);
  const [questionInBlockIndex, setQuestionInBlockIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [placementEval, setPlacementEval] = useState<PlacementEvaluation | null>(
    null,
  );

  // State Langkah 4 (Kontrak & Target Belajar)
  const [selectedStage, setSelectedStage] = useState<CurriculumStage>(
    initialProfile?.current_stage ?? "PRE_N5",
  );
  const [studyMinutes, setStudyMinutes] = useState<StudyMinutesDaily>(
    initialProfile?.study_minutes_daily ?? 30,
  );
  const [examTargetPeriod, setExamTargetPeriod] = useState<string>(
    initialProfile?.exam_target_period ?? "",
  );

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const examPeriods = useMemo(() => getUpcomingExamPeriods(), []);

  const currentBlock = PLACEMENT_BLOCKS[blockIndex]!;
  const currentBlockQuestions = useMemo(
    () => getQuestionsByBlock(currentBlock.id),
    [currentBlock.id],
  );
  const currentQuestion = currentBlockQuestions[questionInBlockIndex]!;

  // Nomor soal global (1..15) untuk progress bar yang jelas
  const globalQuestionNumber = useMemo(() => {
    let offset = 0;
    for (let i = 0; i < blockIndex; i++) {
      offset += PLACEMENT_BLOCKS[i]!.questionCount;
    }
    return offset + questionInBlockIndex + 1;
  }, [blockIndex, questionInBlockIndex]);

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const stageMeta = STAGE_METADATA[selectedStage];
  const dailyNewLimit = getDailyNewLimitForMinutes(studyMinutes);
  const estimatedWeeks = estimateWeeksToCompleteStage(selectedStage, studyMinutes);
  const selectableStages = useMemo(() => {
    if (!placementEval) return [STAGE_METADATA.PRE_N5];
    return getSelectableStagesUpTo(placementEval.recommendedStage);
  }, [placementEval]);

  const activeUnitCode =
    placementEval && placementEval.recommendedStage === selectedStage
      ? placementEval.recommendedUnitCode
      : stageMeta.defaultUnitCode;

  const progressPct =
    step === 1
      ? 25
      : step === 2
        ? 50
        : step === 3
          ? placementEval
            ? 85
            : 50 + Math.round((globalQuestionNumber / 15) * 32)
          : 100;

  function handleContinueFromStep2() {
    if (!experience) return;
    if (experience === "zero") {
      // Pemula nol -> langsung Tahap 0 Pra-N5, lompat ke Langkah 4
      setPlacementEval(null);
      setSelectedStage("PRE_N5");
      setStep(4);
    } else {
      // Reset tes penempatan & masuk Langkah 3
      setBlockIndex(0);
      setQuestionInBlockIndex(0);
      setAnswers({});
      setPlacementEval(null);
      setStep(3);
    }
  }

  function handleSelectOption(optionIdx: number) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIdx }));
  }

  function handleNextPlacementQuestion() {
    if (!currentQuestion || typeof currentAnswer !== "number") return;

    const isLastInBlock =
      questionInBlockIndex === currentBlockQuestions.length - 1;

    if (!isLastInBlock) {
      setQuestionInBlockIndex((i) => i + 1);
      return;
    }

    // Selesai 1 blok -> cek aturan berhenti cepat (early-stop)
    const isLastBlock = blockIndex === PLACEMENT_BLOCKS.length - 1;
    const earlyStop =
      !isLastBlock && shouldEarlyStopAfterBlock(currentBlock.id, answers);

    if (isLastBlock || earlyStop) {
      const evaluation = evaluatePlacementAnswers(
        answers,
        earlyStop ? (currentBlock.id as PlacementBlockId) : null,
      );
      setPlacementEval(evaluation);
      setSelectedStage(evaluation.recommendedStage);
      return;
    }

    // Lanjut ke blok berikutnya
    setBlockIndex((b) => b + 1);
    setQuestionInBlockIndex(0);
  }

  function handlePrevPlacementQuestion() {
    if (questionInBlockIndex > 0) {
      setQuestionInBlockIndex((i) => i - 1);
      return;
    }
    if (blockIndex > 0) {
      const prevBlock = PLACEMENT_BLOCKS[blockIndex - 1]!;
      const prevBlockQs = getQuestionsByBlock(prevBlock.id);
      setBlockIndex((b) => b - 1);
      setQuestionInBlockIndex(prevBlockQs.length - 1);
      return;
    }
    setStep(2);
  }

  function handleRetakePlacementInsideWizard() {
    setBlockIndex(0);
    setQuestionInBlockIndex(0);
    setAnswers({});
    setPlacementEval(null);
  }

  function handleFinalSubmit() {
    setSubmitError(null);
    startTransition(async () => {
      const res = await completeOnboarding({
        learningGoal,
        selectedStage,
        recommendedUnitCode: activeUnitCode,
        studyMinutesDaily: studyMinutes,
        examTargetPeriod: examTargetPeriod || null,
        placementScore: placementEval?.placementScore ?? {
          total: 0,
          correct: 0,
          recommended_stage: "PRE_N5",
          taken_at: new Date().toISOString(),
        },
      });
      if (res?.error) {
        setSubmitError(res.error);
      }
    });
  }

  const activeGoalMeta =
    LEARNING_GOAL_OPTIONS.find((g) => g.id === learningGoal) ??
    LEARNING_GOAL_OPTIONS[0]!;

  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      {/* =================================================================
          MOBILE COMPACT TOP PROGRESS BAR (< lg)
         ================================================================= */}
      <header className="sticky top-0 z-20 border-b border-border-default bg-surface/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary font-jp text-sm font-bold text-brand-primary-fg">
              道
            </span>
            <div>
              <p className="font-heading text-xs font-bold leading-none text-text-primary">
                Langkah {step} dari 4
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-text-secondary">
                {STEP_LABELS[step - 1]!.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggleCompact />
            {isRetake ? (
              <Link
                href="/dashboard"
                className="inline-flex min-h-8 items-center rounded-lg border border-border-default bg-subtle px-2.5 text-[11px] font-bold text-text-primary"
              >
                Batal
              </Link>
            ) : (
              <form action={logoutAction}>
                <button
                  type="submit"
                  aria-label="Keluar akun"
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border-default bg-subtle text-text-primary"
                >
                  <IconLogOut className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="h-1 w-full bg-subtle">
          <div
            className="h-full bg-brand-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* =================================================================
          MAIN LAYOUT: DESKTOP 2-COL STUDIO vs MOBILE SINGLE-FOCUS
         ================================================================= */}
      <main className="mx-auto max-w-6xl px-4 pt-5 pb-28 sm:px-6 lg:grid lg:min-h-screen lg:grid-cols-12 lg:items-start lg:gap-8 lg:px-8 lg:py-10">
        {/* DESKTOP LEFT STEPPER SIDEBAR (hidden on Mobile) */}
        <aside className="hidden lg:sticky lg:top-10 lg:col-span-4 lg:flex lg:flex-col lg:justify-between lg:gap-6 lg:rounded-3xl lg:border lg:border-border-default lg:bg-surface lg:p-6 lg:shadow-xs">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary font-jp text-lg font-bold text-brand-primary-fg">
                  道
                </span>
                <div>
                  <p className="font-heading text-base font-bold leading-none text-text-primary">
                    JLPT App
                  </p>
                  <p className="mt-1 text-xs font-medium text-brand-primary">
                    Persiapan Rencana Belajar
                  </p>
                </div>
              </div>
              <ThemeToggleCompact />
            </div>

            <div className="rounded-2xl bg-canvas p-4">
              <p className="text-xs font-semibold text-text-secondary">
                Halo, <span className="font-bold text-text-primary">{displayName}</span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                {isRetake
                  ? "Kamu sedang mengatur ulang level awal dan jadwal belajarmu."
                  : "Luangkan 2–4 menit agar jalur belajar dan materi harian langsung pas dengan kemampuanmu."}
              </p>
            </div>

            {/* Vertical 4-Step Stepper */}
            <ol className="space-y-2.5" aria-label="Tahapan persiapan belajar">
              {STEP_LABELS.map((item) => {
                const isSkipped = item.num === 3 && experience === "zero" && step === 4;
                const isDone = item.num < step && !isSkipped;
                const isCurrent = item.num === step;
                return (
                  <li
                    key={item.num}
                    className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition ${
                      isCurrent
                        ? "border-brand-primary bg-brand-primary-soft"
                        : isDone
                          ? "border-border-default bg-canvas"
                          : "border-transparent bg-transparent opacity-70"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                        isCurrent
                          ? "bg-brand-primary text-brand-primary-fg"
                          : isDone
                            ? "bg-semantic-success text-white dark:text-[#0E1418]"
                            : "bg-subtle text-text-secondary"
                      }`}
                    >
                      {isDone ? <IconCheck className="h-3.5 w-3.5" /> : item.num}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold ${
                          isCurrent ? "text-brand-primary" : "text-text-primary"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="truncate text-[11px] text-text-secondary">
                        {isSkipped ? "Dilewati (Mulai dari Nol)" : item.subtitle}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Ringkasan Pilihan Aktif */}
            <div className="space-y-2 rounded-2xl border border-border-default bg-canvas p-4 text-xs">
              <p className="font-mono text-[10px] font-bold tracking-wider text-text-secondary uppercase">
                RINGKASAN PILIHANMU
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-secondary">Tujuan</span>
                <span className="truncate font-bold text-text-primary">
                  {activeGoalMeta.title.split(" ")[0]}{" "}
                  {activeGoalMeta.title.split(" ")[1]}
                </span>
              </div>
              {step >= 4 && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-secondary">Tahap Awal</span>
                    <span className="font-mono font-bold text-brand-primary">
                      {stageMeta.shortLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-secondary">Ritme Harian</span>
                    <span className="font-mono font-bold text-text-primary">
                      {studyMinutes} mnt · {dailyNewLimit} kartu
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-default pt-4">
            {isRetake ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary"
              >
                <IconArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali ke Beranda</span>
              </Link>
            ) : isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
              >
                <IconArrowLeft className="h-3.5 w-3.5" />
                <span>Panel Admin</span>
              </Link>
            ) : (
              <span className="text-[11px] text-text-secondary">
                Progres otomatis tersimpan
              </span>
            )}

            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-text-secondary transition hover:bg-subtle hover:text-text-primary"
              >
                <IconLogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </form>
          </div>
        </aside>

        {/* MAIN STEP CONTENT CARD */}
        <section className="mx-auto w-full max-w-2xl lg:col-span-8 lg:max-w-none">
          {/* ==================== LANGKAH 1: TUJUAN BELAJAR ==================== */}
          {step === 1 && (
            <div className="space-y-6 rounded-3xl border border-border-default bg-surface p-5 shadow-xs sm:p-8">
              <div className="space-y-2">
                <Badge tone="primary" mono>
                  LANGKAH 1 / 4 · 学習目的
                </Badge>
                <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                  Apa tujuan utamamu belajar bahasa Jepang?
                </h1>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Kami akan menyesuaikan porsi latihan percakapan, bacaan, dan kosakata sesuai
                  jalur yang kamu pilih.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {LEARNING_GOAL_OPTIONS.map((opt) => {
                  const selected = learningGoal === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLearningGoal(opt.id)}
                      aria-pressed={selected}
                      className={`flex min-h-[116px] cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-brand-primary bg-brand-primary-soft ring-1 ring-brand-primary"
                          : "border-border-default bg-canvas hover:border-brand-primary/50"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-heading text-sm font-bold text-text-primary sm:text-base">
                            {opt.title}
                          </h2>
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-brand-primary bg-brand-primary text-brand-primary-fg"
                                : "border-border-default bg-surface"
                            }`}
                          >
                            {selected && <IconCheck className="h-3 w-3" />}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-text-secondary">
                          {opt.subtitle}
                        </p>
                      </div>
                      <p className="mt-3 text-[11px] font-bold text-brand-primary">
                        {opt.highlight}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="hidden items-center justify-end border-t border-border-default pt-5 lg:flex">
                <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                  <span>Lanjut ke Pengalaman Awal</span>
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ==================== LANGKAH 2: SKRINING AWAL ==================== */}
          {step === 2 && (
            <div className="space-y-6 rounded-3xl border border-border-default bg-surface p-5 shadow-xs sm:p-8">
              <div className="space-y-2">
                <Badge tone="primary" mono>
                  LANGKAH 2 / 4 · 自己評価
                </Badge>
                <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                  Bagaimana kemampuan bahasa Jepangmu saat ini?
                </h1>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Pilih kondisi yang paling jujur agar kamu tidak kewalahan atau justru mengulang
                  materi yang sudah dikuasai.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setExperience("zero")}
                  aria-pressed={experience === "zero"}
                  className={`flex min-h-[160px] cursor-pointer flex-col justify-between rounded-2xl border p-5 text-left transition ${
                    experience === "zero"
                      ? "border-brand-primary bg-brand-primary-soft ring-1 ring-brand-primary"
                      : "border-border-default bg-canvas hover:border-brand-primary/50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary">
                        <IconBook className="h-5 w-5" />
                      </span>
                      <Badge tone="success">Rekomendasi Pemula</Badge>
                    </div>
                    <h2 className="font-heading pt-1 text-base font-bold text-text-primary">
                      Baru Mulai dari Nol
                    </h2>
                    <p className="text-xs leading-relaxed text-text-secondary">
                      Belum mengenal atau belum lancar membaca huruf Hiragana dan Katakana.
                    </p>
                  </div>
                  <p className="mt-4 text-xs font-bold text-brand-primary">
                    Langsung mulai di Tahap 0 · Pra-N5 (tanpa tes) →
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setExperience("experienced")}
                  aria-pressed={experience === "experienced"}
                  className={`flex min-h-[160px] cursor-pointer flex-col justify-between rounded-2xl border p-5 text-left transition ${
                    experience === "experienced"
                      ? "border-brand-primary bg-brand-primary-soft ring-1 ring-brand-primary"
                      : "border-border-default bg-canvas hover:border-brand-primary/50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/15 text-brand-accent-text">
                        <IconCompass className="h-5 w-5" />
                      </span>
                      <Badge tone="warning">± 3 Menit</Badge>
                    </div>
                    <h2 className="font-heading pt-1 text-base font-bold text-text-primary">
                      Sudah Pernah Belajar
                    </h2>
                    <p className="text-xs leading-relaxed text-text-secondary">
                      Sudah bisa membaca Hiragana/Katakana atau memiliki dasar N5 sampai N3.
                    </p>
                  </div>
                  <p className="mt-4 text-xs font-bold text-brand-accent-text">
                    Ikuti Tes Penempatan Singkat (maks. 15 soal) →
                  </p>
                </button>
              </div>

              <div className="hidden items-center justify-between border-t border-border-default pt-5 lg:flex">
                <Button variant="outline" size="md" onClick={() => setStep(1)}>
                  <IconArrowLeft className="h-4 w-4" />
                  <span>Kembali</span>
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={!experience}
                  onClick={handleContinueFromStep2}
                >
                  <span>
                    {experience === "experienced"
                      ? "Mulai Tes Penempatan"
                      : "Lanjut Atur Jadwal Belajar"}
                  </span>
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ==================== LANGKAH 3A: TES PENEMPATAN ADAPTIF ==================== */}
          {step === 3 && !placementEval && currentQuestion && (
            <div className="space-y-5 rounded-3xl border border-border-default bg-surface p-5 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge tone="primary" mono>
                  {currentQuestion.blockLabel}
                </Badge>
                <span className="font-mono text-xs font-bold text-text-secondary tabular-nums">
                  Soal {globalQuestionNumber} dari 15 · Level {currentQuestion.levelTag}
                </span>
              </div>

              {/* Progress bar per soal */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-subtle">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all duration-300"
                  style={{ width: `${Math.round((globalQuestionNumber / 15) * 100)}%` }}
                />
              </div>

              {/* Kotak Soal */}
              <div className="rounded-2xl border border-border-default bg-canvas px-5 py-6 text-center sm:px-8 sm:py-8">
                <p className="text-xs font-semibold text-text-secondary sm:text-sm">
                  {currentQuestion.instructionId}
                </p>
                <p className="font-jp mt-4 text-2xl font-bold leading-relaxed tracking-wide text-text-primary sm:text-3xl">
                  {currentQuestion.promptJa}
                </p>
              </div>

              {/* 4 Pilihan Jawaban Besar & Ergonomis */}
              <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isPicked = currentAnswer === idx;
                  return (
                    <button
                      key={`${currentQuestion.id}-${idx}`}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      aria-pressed={isPicked}
                      className={`flex min-h-[54px] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        isPicked
                          ? "border-brand-primary bg-brand-primary-soft ring-1 ring-brand-primary"
                          : "border-border-default bg-surface hover:border-brand-primary/50 hover:bg-canvas"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                          isPicked
                            ? "bg-brand-primary text-brand-primary-fg"
                            : "bg-subtle text-text-secondary"
                        }`}
                      >
                        {OPTION_LETTERS[idx]}
                      </span>
                      <span className="font-jp text-sm font-semibold text-text-primary sm:text-base">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-[11px] text-text-secondary">
                Tes bersifat adaptif dan akan berhenti otomatis begitu level awalmu terdeteksi.
              </p>

              <div className="hidden items-center justify-between border-t border-border-default pt-4 lg:flex">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handlePrevPlacementQuestion}
                >
                  <IconArrowLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={typeof currentAnswer !== "number"}
                  onClick={handleNextPlacementQuestion}
                >
                  <span>
                    {blockIndex === PLACEMENT_BLOCKS.length - 1 &&
                    questionInBlockIndex === currentBlockQuestions.length - 1
                      ? "Lihat Hasil Penempatan"
                      : "Lanjut Soal"}
                  </span>
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ==================== LANGKAH 3B: HASIL PENEMPATAN & OPT-DOWN ==================== */}
          {step === 3 && placementEval && (
            <div className="space-y-6 rounded-3xl border border-border-default bg-surface p-5 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge tone="success">HASIL TES PENEMPATAN</Badge>
                <Badge tone="neutral" mono>
                  Benar {placementEval.totalCorrect} / {placementEval.totalAnswered} soal
                </Badge>
              </div>

              {/* Kartu Rekomendasi Utama */}
              <div className="rounded-2xl border border-brand-primary/35 bg-brand-primary-soft p-5 sm:p-6">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-brand-primary-fg">
                    <IconAward className="h-6 w-6" />
                  </span>
                  <div className="space-y-1">
                    <p className="font-mono text-xs font-bold text-brand-primary uppercase">
                      REKOMENDASI LEVEL AWALMU
                    </p>
                    <h1 className="font-heading text-xl font-bold text-text-primary sm:text-2xl">
                      {STAGE_METADATA[placementEval.recommendedStage].shortLabel} —{" "}
                      {STAGE_METADATA[placementEval.recommendedStage].title}
                    </h1>
                    <p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
                      {placementEval.summaryMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rincian Skor per Bagian yang Dikerjakan */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {PLACEMENT_BLOCKS.map((blk) => {
                  const stat = placementEval.breakdown[blk.id];
                  const taken = stat.total > 0;
                  return (
                    <div
                      key={blk.id}
                      className={`rounded-2xl border p-3 ${
                        taken
                          ? "border-border-default bg-canvas"
                          : "border-dashed border-border-default/70 bg-subtle/40 opacity-65"
                      }`}
                    >
                      <p className="truncate text-[10px] font-bold text-text-secondary uppercase">
                        {blk.title.split("·")[1]?.trim() ?? blk.title}
                      </p>
                      <p className="mt-1 font-mono text-base font-bold text-text-primary tabular-nums">
                        {taken ? `${stat.correct} / ${stat.total}` : "—"}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        {taken ? "Selesai" : "Tidak diperlukan"}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Opsi Turun Tingkat (Opt-Down) */}
              {selectableStages.length > 1 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-text-primary">
                    Ingin mengulang fondasi dari tingkat yang lebih dasar? (Opsional)
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectableStages.map((st) => {
                      const active = selectedStage === st.stage;
                      const isRecommended =
                        st.stage === placementEval.recommendedStage;
                      return (
                        <button
                          key={st.stage}
                          type="button"
                          onClick={() => setSelectedStage(st.stage)}
                          className={`flex min-h-12 cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition ${
                            active
                              ? "border-brand-primary bg-brand-primary-soft ring-1 ring-brand-primary"
                              : "border-border-default bg-canvas hover:border-brand-primary/40"
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-text-primary">
                              {st.shortLabel}
                            </p>
                            <p className="truncate text-[11px] text-text-secondary">
                              {st.title}
                            </p>
                          </div>
                          {isRecommended && <Badge tone="success">Saran</Badge>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="hidden items-center justify-between border-t border-border-default pt-5 lg:flex">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleRetakePlacementInsideWizard}
                >
                  <span>Ulangi Tes Penempatan</span>
                </Button>
                <Button variant="primary" size="lg" onClick={() => setStep(4)}>
                  <span>Lanjut Atur Jadwal Belajar</span>
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ==================== LANGKAH 4: KONTRAK & JADWAL BELAJAR ==================== */}
          {step === 4 && (
            <div className="space-y-6 rounded-3xl border border-border-default bg-surface p-5 shadow-xs sm:p-8">
              <div className="space-y-2">
                <Badge tone="primary" mono>
                  LANGKAH 4 / 4 · 学習計画
                </Badge>
                <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                  Atur ritme harian dan target belajarmu
                </h1>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Konsistensi lebih penting daripada belajar maraton. Pilih durasi yang paling
                  realistis kamu jalani setiap hari.
                </p>
              </div>

              {/* Pilihan Ritme Harian */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-bold text-text-primary">
                  <IconClock className="h-4 w-4 text-brand-primary" />
                  <span>Durasi Belajar Harian</span>
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {STUDY_PACE_OPTIONS.map((pace) => {
                    const active = studyMinutes === pace.minutes;
                    return (
                      <button
                        key={pace.minutes}
                        type="button"
                        onClick={() => setStudyMinutes(pace.minutes)}
                        aria-pressed={active}
                        className={`flex min-h-[112px] cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-brand-primary bg-brand-primary-soft ring-1 ring-brand-primary"
                            : "border-border-default bg-canvas hover:border-brand-primary/50"
                        }`}
                      >
                        <div>
                          <p className="font-heading text-base font-bold text-text-primary">
                            {pace.title}
                          </p>
                          <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                            {pace.subtitle}
                          </p>
                        </div>
                        <p className="mt-3 font-mono text-[11px] font-bold text-brand-primary">
                          {pace.badge}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pilihan Periode Target Ujian */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-bold text-text-primary">
                  <IconCalendar className="h-4 w-4 text-brand-primary" />
                  <span>Target Gelombang Ujian (Opsional)</span>
                </label>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {examPeriods.map((period) => {
                    const active = examTargetPeriod === period.value;
                    return (
                      <button
                        key={period.value || "relaxed"}
                        type="button"
                        onClick={() => setExamTargetPeriod(period.value)}
                        aria-pressed={active}
                        className={`flex min-h-[54px] cursor-pointer items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition ${
                          active
                            ? "border-brand-primary bg-brand-primary-soft ring-1 ring-brand-primary"
                            : "border-border-default bg-canvas hover:border-brand-primary/40"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-text-primary">
                            {period.label}
                          </p>
                          <p className="text-[11px] text-text-secondary">{period.hint}</p>
                        </div>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            active
                              ? "border-brand-primary bg-brand-primary text-brand-primary-fg"
                              : "border-border-default bg-surface"
                          }`}
                        >
                          {active && <IconCheck className="h-3 w-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kartu Ringkasan Kontrak Belajar */}
              <div className="rounded-2xl border border-brand-primary/30 bg-canvas p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[11px] font-bold tracking-wider text-brand-primary uppercase">
                    RINGKASAN RENCANA BELAJARMU
                  </p>
                  <Badge tone="primary" mono>
                    Bab Awal {activeUnitCode}
                  </Badge>
                </div>

                <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border-default bg-surface p-3">
                    <p className="text-[11px] text-text-secondary">Tahap Awal</p>
                    <p className="mt-0.5 font-heading text-sm font-bold text-text-primary">
                      {stageMeta.shortLabel}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border-default bg-surface p-3">
                    <p className="text-[11px] text-text-secondary">Bantuan Bacaan</p>
                    <p className="mt-0.5 font-heading text-sm font-bold text-brand-primary">
                      {stageMeta.romajiEnabled
                        ? "Romaji Aktif (Bertahap)"
                        : stageMeta.furiganaMode === "smart"
                          ? "Tanpa Romaji · Furigana Pintar"
                          : "Tanpa Romaji · Furigana Aktif"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border-default bg-surface p-3">
                    <p className="text-[11px] text-text-secondary">Estimasi Tahap Ini</p>
                    <p className="mt-0.5 font-mono text-sm font-bold text-text-primary tabular-nums">
                      ± {estimatedWeeks} minggu
                    </p>
                  </div>
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-text-secondary">
                  <IconShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
                  <span>
                    Target level, durasi harian, dan bantuan bacaan selalu bisa disesuaikan ulang di
                    halaman Pengaturan.
                  </span>
                </p>
              </div>

              {submitError && (
                <p className="rounded-xl border border-semantic-danger/30 bg-semantic-danger-soft px-4 py-3 text-xs font-semibold text-semantic-danger">
                  {submitError}
                </p>
              )}

              <div className="hidden items-center justify-between border-t border-border-default pt-5 lg:flex">
                <Button
                  variant="outline"
                  size="md"
                  disabled={isPending}
                  onClick={() => setStep(experience === "experienced" ? 3 : 2)}
                >
                  <IconArrowLeft className="h-4 w-4" />
                  <span>Kembali</span>
                </Button>
                <Button
                  variant="cta"
                  size="lg"
                  disabled={isPending}
                  onClick={handleFinalSubmit}
                >
                  <IconCheck className="h-4 w-4" />
                  <span>
                    {isPending
                      ? "Menyimpan Rencana Belajarmu..."
                      : "Simpan & Mulai Belajar Sekarang"}
                  </span>
                  {!isPending && <IconArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* =================================================================
          MOBILE STICKY BOTTOM THUMB CTA BAR (< lg)
         ================================================================= */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border-default bg-surface/95 px-4 pt-3 pb-[calc(0.85rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-2.5">
          {step === 1 && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setStep(2)}
            >
              <span>Lanjut</span>
              <IconArrowRight className="h-4 w-4" />
            </Button>
          )}

          {step === 2 && (
            <>
              <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                <IconArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={!experience}
                onClick={handleContinueFromStep2}
              >
                <span>
                  {experience === "experienced"
                    ? "Mulai Tes Penempatan"
                    : "Lanjut Atur Jadwal"}
                </span>
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === 3 && !placementEval && (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevPlacementQuestion}
              >
                <IconArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={typeof currentAnswer !== "number"}
                onClick={handleNextPlacementQuestion}
              >
                <span>
                  {blockIndex === PLACEMENT_BLOCKS.length - 1 &&
                  questionInBlockIndex === currentBlockQuestions.length - 1
                    ? "Lihat Hasil"
                    : "Lanjut Soal"}
                </span>
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === 3 && placementEval && (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={handleRetakePlacementInsideWizard}
              >
                <span>Ulangi</span>
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setStep(4)}
              >
                <span>Lanjut Atur Jadwal</span>
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === 4 && (
            <>
              <Button
                variant="outline"
                size="lg"
                disabled={isPending}
                onClick={() => setStep(experience === "experienced" ? 3 : 2)}
              >
                <IconArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="cta"
                size="lg"
                fullWidth
                disabled={isPending}
                onClick={handleFinalSubmit}
              >
                <span>
                  {isPending ? "Menyimpan..." : "Simpan & Mulai Belajar"}
                </span>
                {!isPending && <IconArrowRight className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
