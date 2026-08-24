import type {
  ReactNode,
} from "react";

import {
  FileText,
} from "lucide-react";

import {
  KivoBadge,
  type KivoBadgeVariant,
} from "./KivoBadge";

export interface KivoDocumentCardProps {
  title: string;
  filename?: string;
  status?: string;
  statusVariant?: KivoBadgeVariant;
  action?: ReactNode;
}

export function KivoDocumentCard({
  title,
  filename,
  status,
  statusVariant = "neutral",
  action,
}: KivoDocumentCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-blue text-primary-dark">
        <FileText size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-bold text-ink">
          {title}
        </div>

        {filename ? (
          <div className="mt-1 truncate text-sm text-muted">
            {filename}
          </div>
        ) : null}

        {status ? (
          <KivoBadge
            variant={statusVariant}
            className="mt-2"
          >
            {status}
          </KivoBadge>
        ) : null}
      </div>

      {action ? (
        <div className="shrink-0">
          {action}
        </div>
      ) : null}
    </article>
  );
}
