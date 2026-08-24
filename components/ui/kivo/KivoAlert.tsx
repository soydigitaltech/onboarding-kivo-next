import type { ReactNode } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/cn";

export type KivoAlertVariant =
  | "info"
  | "success"
  | "warning"
  | "error";

export interface KivoAlertProps {
  variant?: KivoAlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const styles: Record<
  KivoAlertVariant,
  {
    container: string;
    icon: string;
  }
> = {
  info: {
    container:
      "border-primary/30 bg-surface-blue",
    icon:
      "text-primary-dark",
  },

  success: {
    container:
      "border-success/30 bg-success/5",
    icon:
      "text-success",
  },

  warning: {
    container:
      "border-warning-border bg-warning-bg",
    icon:
      "text-warning",
  },

  error: {
    container:
      "border-error/30 bg-error/5",
    icon:
      "text-error",
  },
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
};

export function KivoAlert({
  variant = "info",
  title,
  children,
  className,
}: KivoAlertProps) {
  const Icon = icons[variant];

  return (
    <div
      role={
        variant === "error"
          ? "alert"
          : "status"
      }
      className={cn(
        "flex gap-3 rounded-2xl border p-5",
        styles[variant].container,
        className,
      )}
    >
      <Icon
        size={20}
        aria-hidden="true"
        className={cn(
          "mt-0.5 shrink-0",
          styles[variant].icon,
        )}
      />

      <div className="min-w-0">
        {title ? (
          <div className="font-bold text-ink">
            {title}
          </div>
        ) : null}

        <div
          className={cn(
            "text-sm leading-6 text-body",
            title && "mt-1",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
