import Link from "next/link";
import { IconArrowRight, IconCompass } from "./Icons";

type SoftGateBannerProps = {
  title?: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

export function SoftGateBanner({
  title = "Rekomendasi Urutan Belajar",
  description,
  actionHref,
  actionLabel,
  className = "",
}: SoftGateBannerProps) {
  return (
    <div
      role="status"
      className={`flex flex-col gap-3 rounded-2xl border border-brand-accent/40 bg-brand-accent-soft px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-accent/15 text-brand-accent-text">
          <IconCompass className="h-4 w-4" />
        </span>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-bold tracking-wide text-brand-accent-text uppercase">
            {title}
          </p>
          <p className="text-xs leading-relaxed text-brand-accent-text/90 sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-accent px-3.5 py-2 text-xs font-bold text-white transition hover:opacity-90 dark:text-[#0E1418]"
        >
          <span>{actionLabel}</span>
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
