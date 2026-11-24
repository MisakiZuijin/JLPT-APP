"use client";

import Link from "next/link";
import { IconBook, IconPen } from "@/components/ui/Icons";

type StudyTab = "kana" | "reading" | "writing";

const LINKS: { key: StudyTab; href: string; label: string; Icon: typeof IconBook }[] = [
  { key: "kana", href: "/kana", label: "Tabel Kana", Icon: IconBook },
  { key: "reading", href: "/reading", label: "Membaca", Icon: IconBook },
  { key: "writing", href: "/writing", label: "Menulis Goresan", Icon: IconPen },
];

export function StudySubNav({ active }: { active: StudyTab }) {
  return (
    <nav
      aria-label="Submenu modul belajar"
      className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border-default bg-surface p-1.5 sm:inline-grid sm:w-auto"
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
