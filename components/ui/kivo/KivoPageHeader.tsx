import type { ReactNode } from "react";

export interface KivoPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function KivoPageHeader({
  eyebrow,
  title,
  description,
  action,
}: KivoPageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-primary-dark">
            {eyebrow}
          </div>
        ) : null}

        <h1 className="text-3xl font-bold tracking-[-0.035em] text-ink md:text-4xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 text-sm leading-7 text-body md:text-base">
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
  );
}
