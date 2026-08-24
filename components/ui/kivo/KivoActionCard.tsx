import type {
  ReactNode,
} from "react";

import {
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/cn";

export interface KivoActionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  meta?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function KivoActionCard({
  title,
  description,
  icon,
  meta,
  selected = false,
  disabled = false,
  onClick,
  className,
}: KivoActionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border p-5 text-left",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        selected
          ? "border-primary bg-surface-blue"
          : "border-border bg-white hover:border-primary",
        disabled &&
          "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {icon ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-blue text-primary-dark">
          {icon}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="font-bold text-ink">
          {title}
        </div>

        {description ? (
          <div className="mt-1 text-sm leading-6 text-body">
            {description}
          </div>
        ) : null}

        {meta ? (
          <div className="mt-2">
            {meta}
          </div>
        ) : null}
      </div>

      <ArrowRight
        size={18}
        className="shrink-0 text-placeholder transition-transform group-hover:translate-x-1 group-hover:text-primary-dark"
      />
    </button>
  );
}
