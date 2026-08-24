import type {
  ReactNode,
} from "react";

import {
  KivoBadge,
  type KivoBadgeVariant,
} from "./KivoBadge";

export interface KivoStatusCardProps {
  title: string;
  description?: string;
  status: string;
  statusVariant?: KivoBadgeVariant;
  icon?: ReactNode;
  action?: ReactNode;
}

export function KivoStatusCard({
  title,
  description,
  status,
  statusVariant = "neutral",
  icon,
  action,
}: KivoStatusCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-start gap-4">
        {icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-blue text-primary-dark">
            {icon}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-ink">
                {title}
              </h3>

              {description ? (
                <p className="mt-1 text-sm leading-6 text-body">
                  {description}
                </p>
              ) : null}
            </div>

            <KivoBadge
              variant={statusVariant}
            >
              {status}
            </KivoBadge>
          </div>

          {action ? (
            <div className="mt-5">
              {action}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
