import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link, { type LinkProps } from "next/link";

export type ButtonVariant = "primary" | "cta" | "soft" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-brand-primary-fg hover:bg-brand-primary-hover shadow-xs",
  cta: "bg-brand-cta text-brand-cta-fg hover:bg-brand-cta-hover shadow-xs",
  soft: "bg-brand-primary-soft text-brand-primary hover:brightness-95 dark:hover:brightness-110",
  outline:
    "border border-border-default bg-surface text-text-primary hover:bg-subtle",
  danger:
    "bg-semantic-danger text-white hover:opacity-90 dark:text-[#0E1418]",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "min-h-9 rounded-xl px-3.5 py-2 text-xs font-bold gap-1.5",
  md: "min-h-11 rounded-xl px-5 py-2.5 text-sm font-bold gap-2",
  lg: "min-h-12 rounded-2xl px-6 py-3.5 text-sm font-bold gap-2",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return [
    "inline-flex cursor-pointer items-center justify-center whitespace-nowrap transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-55",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}

type ButtonLinkProps = LinkProps & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
