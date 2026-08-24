"use client";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import { cn } from "@/lib/cn";

export type KivoToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

export interface KivoToastProps {
  open: boolean;
  variant?: KivoToastVariant;
  title: string;
  description?: string;
  onClose?: () => void;
}

const config = {
  success: {
    icon: CheckCircle2,
    iconClass:
      "text-success",
  },
  error: {
    icon: AlertCircle,
    iconClass:
      "text-error",
  },
  warning: {
    icon: TriangleAlert,
    iconClass:
      "text-warning",
  },
  info: {
    icon: Info,
    iconClass:
      "text-primary-dark",
  },
};

export function KivoToast({
  open,
  variant = "success",
  title,
  description,
  onClose,
}: KivoToastProps) {
  if (!open) {
    return null;
  }

  const Icon =
    config[variant].icon;

  return (
    <div
      role={
        variant === "error"
          ? "alert"
          : "status"
      }
      className="fixed bottom-5 right-5 z-[300] w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-border bg-white p-4"
    >
      <div className="flex items-start gap-3">
        <Icon
          size={20}
          className={cn(
            "mt-0.5 shrink-0",
            config[variant].iconClass,
          )}
        />

        <div className="min-w-0 flex-1">
          <div className="font-bold text-ink">
            {title}
          </div>

          {description ? (
            <div className="mt-1 text-sm leading-6 text-body">
              {description}
            </div>
          ) : null}
        </div>

        {onClose ? (
          <button
            type="button"
            aria-label="Cerrar notificación"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
