import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type KivoBadgeVariant =
  | "neutral"
  | "info"
  | "pending"
  | "approved"
  | "observed"
  | "rejected"
  | "processing";

export interface KivoBadgeProps {
  variant?: KivoBadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const variants: Record<KivoBadgeVariant, string> = {
  neutral:
    "bg-surface text-body",

  info:
    "bg-surface-blue text-primary-dark",

  pending:
    "bg-warning-bg text-warning",

  approved:
    "bg-success/10 text-success",

  observed:
    "bg-warning-bg text-warning",

  rejected:
    "bg-error/10 text-error",

  processing:
    "bg-surface-blue text-primary-dark",
};

export function KivoBadge({
  variant = "neutral",
  children,
  icon,
  className,
}: KivoBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
        "text-xs font-bold",
        variants[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
