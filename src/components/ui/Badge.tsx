import type { ReactNode } from "react";

export type BadgeTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "dark"
  | "neutral";

const TONE_STYLES: Record<BadgeTone, string> = {
  primary:
    "border-brand-primary/25 bg-brand-primary-soft text-brand-primary",
  success:
    "border-semantic-success/25 bg-semantic-success-soft text-semantic-success",
  warning:
    "border-brand-accent/35 bg-brand-accent-soft text-brand-accent-text",
  danger:
    "border-semantic-danger/30 bg-semantic-danger-soft text-semantic-danger",
  dark: "border-[#26333D] bg-[#151E24] text-[#2DD4BF]",
  neutral: "border-border-default bg-subtle text-text-secondary",
};

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  mono?: boolean;
  className?: string;
};

export function Badge({
  children,
  tone = "primary",
  mono = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold leading-none tracking-wide",
        mono ? "font-mono tabular-nums" : "",
        TONE_STYLES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
