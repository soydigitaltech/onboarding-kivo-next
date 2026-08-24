import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface KivoSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function KivoSection({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: KivoSectionProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-white",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-5 border-b border-border px-6 py-5">
        <div>
          <h2 className="font-bold text-ink">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-sm leading-6 text-muted">
              {description}
            </p>
          ) : null}
        </div>

        {action ? (
          <div className="shrink-0">
            {action}
          </div>
        ) : null}
      </header>

      <div
        className={cn(
          "p-6",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
