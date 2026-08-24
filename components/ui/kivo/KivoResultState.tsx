import type { ReactNode } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Info,
} from "lucide-react";

import { cn } from "@/lib/cn";

export type KivoResultVariant =
  | "success"
  | "error"
  | "pending"
  | "info";

export interface KivoResultStateProps {
  variant?: KivoResultVariant;
  title: string;
  description?: string;
  action?: ReactNode;
}

const config = {
  success: {
    icon: CheckCircle2,
    container:
      "bg-success/10 text-success",
  },
  error: {
    icon: AlertCircle,
    container:
      "bg-error/10 text-error",
  },
  pending: {
    icon: Clock3,
    container:
      "bg-warning-bg text-warning",
  },
  info: {
    icon: Info,
    container:
      "bg-surface-blue text-primary-dark",
  },
};

export function KivoResultState({
  variant = "success",
  title,
  description,
  action,
}: KivoResultStateProps) {
  const Icon =
    config[variant].icon;

  return (
    <div className="rounded-2xl border border-border bg-white px-6 py-12 text-center">
      <div
        className={cn(
          "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
          config[variant].container,
        )}
      >
        <Icon size={26} />
      </div>

      <h2 className="mt-5 text-xl font-bold tracking-[-0.02em] text-ink">
        {title}
      </h2>

      {description ? (
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-body">
          {description}
        </p>
      ) : null}

      {action ? (
        <div className="mt-6 flex justify-center">
          {action}
        </div>
      ) : null}
    </div>
  );
}
