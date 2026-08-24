"use client";

import type {
  ReactNode,
} from "react";

import {
  X,
} from "lucide-react";

import {
  cn,
} from "@/lib/cn";

export interface KivoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function KivoModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: KivoModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kivo-modal-title"
        className={cn(
          "max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white",
          sizes[size],
        )}
      >
        <header className="flex items-start justify-between gap-5 border-b border-border px-6 py-5">
          <div>
            <h2
              id="kivo-modal-title"
              className="text-xl font-bold tracking-[-0.02em] text-ink"
            >
              {title}
            </h2>

            {description ? (
              <p className="mt-1 text-sm leading-6 text-body">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-ink"
          >
            <X size={18} />
          </button>
        </header>

        {children ? (
          <div className="p-6">
            {children}
          </div>
        ) : null}

        {footer ? (
          <footer className="flex flex-wrap justify-end gap-3 border-t border-border px-6 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
