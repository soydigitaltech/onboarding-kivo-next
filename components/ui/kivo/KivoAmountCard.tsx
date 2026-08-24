import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface KivoAmountCardProps {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  selected?: boolean;
}

export function KivoAmountCard({
  label,
  value,
  helper,
  icon,
  selected = false,
}: KivoAmountCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        selected
          ? "border-primary bg-surface-blue"
          : "border-border bg-white",
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>

      <div className="mt-2 text-2xl font-bold tabular-nums text-ink">
        {value}
      </div>

      {helper ? (
        <div className="mt-2 text-xs leading-5 text-muted">
          {helper}
        </div>
      ) : null}
    </div>
  );
}
