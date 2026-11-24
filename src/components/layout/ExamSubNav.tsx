"use client";

import Link from "next/link";
import { IconAlert, IconCalendar, IconExam, IconPuzzle } from "@/components/ui/Icons";

type ExamTab = "daily" | "exam" | "bunpou" | "mistakes";

const LINKS: { key: ExamTab; href: string; label: string; Icon: typeof IconExam }[] = [
  { key: "daily", href: "/daily-test", label: "Tes Harian (20)", Icon: IconCalendar },
  { key: "exam", href: "/exam", label: "Simulasi JLPT", Icon: IconExam },
  { key: "bunpou", href: "/bunpou", label: "Bunpou & Drill", Icon: IconPuzzle },
  { key: "mistakes", href: "/mistakes", label: "Catatan Salah", Icon: IconAlert },
];

export function ExamSubNav({ active }: { active: ExamTab }) {
  return (
    <nav
      aria-label="Submenu tes harian dan ujian"
      className="grid grid-cols-2 gap-1.5 rounded-2xl border border-border-default bg-surface p-1.5 sm:inline-grid sm:w-auto sm:grid-cols-4"
    >
      {LINKS.map(({ key, href, label, Icon }) => {
        const isCurrent = active === key;
        return (
          <Link
            key={key}
            href={href}
            className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition sm:px-4 ${
              isCurrent
                ? "bg-brand-primary text-brand-primary-fg"
                : "text-text-secondary hover:bg-subtle hover:text-text-primary"
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
