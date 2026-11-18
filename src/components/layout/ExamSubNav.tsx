"use client";

import Link from "next/link";
import { IconAlert, IconCalendar, IconExam, IconPuzzle } from "@/components/ui/Icons";

type ExamTab = "daily" | "exam" | "bunpou" | "mistakes";

const LINKS: { key: ExamTab; href: string; label: string; Icon: typeof IconExam }[] = [
  { key: "daily", href: "/daily-test", label: "Tes Harian (20)", Icon: IconCalendar },
  { key: "exam", href: "/exam", label: "Simulasi JLPT", Icon: IconExam },
  { key: "bunpou", href: "/bunpou", label: "Bunpou Builder", Icon: IconPuzzle },
  { key: "mistakes", href: "/mistakes", label: "Catatan Salah", Icon: IconAlert },
];

export function ExamSubNav({ active }: { active: ExamTab }) {
  return (
    <nav
      aria-label="Submenu tes harian dan ujian"
      className="grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-[#111827] sm:inline-grid sm:grid-cols-4 sm:w-auto"
    >
      {LINKS.map(({ key, href, label, Icon }) => {
        const isCurrent = active === key;
        return (
          <Link
            key={key}
            href={href}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:px-4 ${
              isCurrent
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-[#1E293B] dark:hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
