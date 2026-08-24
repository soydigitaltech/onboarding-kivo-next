import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface KivoEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function KivoEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: KivoEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-blue text-primary-dark">
          {icon}
        </div>
      ) : null}

      <h3 className="mt-4 font-bold text-ink">
        {title}
      </h3>

      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
          {description}
        </p>
      ) : null}

      {action ? (
        <div className="mt-5">
          {action}
        </div>
      ) : null}
    </div>
  );
}
