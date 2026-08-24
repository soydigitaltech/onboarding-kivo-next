import type {
  ReactNode,
} from "react";

import {
  Edit3,
} from "lucide-react";

import {
  KivoAvatar,
} from "./KivoAvatar";

export interface KivoProfileCardProps {
  name: string;
  subtitle?: string;
  initials?: string;
  image?: string;
  details?: ReactNode;
  onEdit?: () => void;
}

export function KivoProfileCard({
  name,
  subtitle,
  initials,
  image,
  details,
  onEdit,
}: KivoProfileCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-6">
      <div className="flex items-start gap-4">
        <KivoAvatar
          src={image}
          initials={initials}
          alt={name}
          size="lg"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink">
                {name}
              </h2>

              {subtitle ? (
                <p className="mt-1 text-sm text-muted">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-primary-dark transition hover:bg-surface-blue"
              >
                <Edit3 size={16} />
                Editar
              </button>
            ) : null}
          </div>

          {details ? (
            <div className="mt-5 border-t border-border pt-5">
              {details}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
