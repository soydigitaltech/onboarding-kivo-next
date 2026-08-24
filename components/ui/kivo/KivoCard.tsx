import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export type KivoCardVariant =
  | "default"
  | "muted"
  | "selected"
  | "interactive";

export interface KivoCardProps
  extends HTMLAttributes<HTMLDivElement> {
  variant?: KivoCardVariant;
  children: ReactNode;
}

const variants: Record<KivoCardVariant, string> = {
  default:
    "border-border bg-white",

  muted:
    "border-border bg-surface",

  selected:
    "border-primary bg-surface-blue",

  interactive:
    "border-border bg-white transition-colors hover:border-primary",
};

export function KivoCard({
  variant = "default",
  className,
  children,
  ...props
}: KivoCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
