"use client";

import Link from "next/link";
import { IconGlobe, IconMessage, IconMic } from "@/components/ui/Icons";

type SpeakTab = "pronunciation" | "kaiwa" | "culture";

const LINKS: { key: SpeakTab; href: string; label: string; Icon: typeof IconMic }[] = [
  { key: "pronunciation", href: "/pronunciation", label: "Studio Suara", Icon: IconMic },
  { key: "kaiwa", href: "/kaiwa", label: "Kaiwa Roleplay", Icon: IconMessage },
  { key: "culture", href: "/culture", label: "Budaya & Etika", Icon: IconGlobe },
];

export function SpeakSubNav({ active }: { active: SpeakTab }) {
  return (
    <nav
      aria-label="Submenu pengucapan dan budaya"
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
