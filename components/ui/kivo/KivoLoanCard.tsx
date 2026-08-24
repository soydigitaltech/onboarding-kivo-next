import type { ReactNode } from "react";

import {
  KivoBadge,
  type KivoBadgeVariant,
} from "./KivoBadge";

export interface KivoLoanCardProps {
  amount: string;
  installment?: string;
  term?: string;
  status?: string;
  statusVariant?: KivoBadgeVariant;
  action?: ReactNode;
}

export function KivoLoanCard({
  amount,
  installment,
  term,
  status,
  statusVariant = "neutral",
  action,
}: KivoLoanCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-muted">
            Monto
          </div>

          <div className="mt-1 text-3xl font-bold tracking-[-0.03em] tabular-nums text-ink">
            {amount}
          </div>
        </div>

        {status ? (
          <KivoBadge
            variant={statusVariant}
          >
            {status}
          </KivoBadge>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5">
        {installment ? (
          <div>
            <div className="text-xs font-semibold text-muted">
              Cuota
            </div>

            <div className="mt-1 font-bold tabular-nums">
              {installment}
            </div>
          </div>
        ) : null}

        {term ? (
          <div>
            <div className="text-xs font-semibold text-muted">
              Plazo
            </div>

            <div className="mt-1 font-bold">
              {term}
            </div>
          </div>
        ) : null}
      </div>

      {action ? (
        <div className="mt-6">
          {action}
        </div>
      ) : null}
    </article>
  );
}
