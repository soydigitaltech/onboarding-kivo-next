"use client";

import type {
  ChangeEvent,
  ReactNode,
} from "react";

import {
  Upload,
} from "lucide-react";

import {
  cn,
} from "@/lib/cn";

export interface KivoDocumentUploaderProps {
  title: string;
  description?: string;
  accept?: string;
  disabled?: boolean;
  icon?: ReactNode;
  onFileSelect?: (
    file: File,
  ) => void;
  className?: string;
}

export function KivoDocumentUploader({
  title,
  description,
  accept = ".pdf,.jpg,.jpeg,.png",
  disabled,
  icon,
  onFileSelect,
  className,
}: KivoDocumentUploaderProps) {
  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (file) {
      onFileSelect?.(file);
    }
  }

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center",
        "transition-colors",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-primary hover:bg-surface-blue",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-blue text-primary-dark">
        {icon ?? (
          <Upload size={22} />
        )}
      </div>

      <strong className="mt-4 text-ink">
        {title}
      </strong>

      {description ? (
        <span className="mt-1 max-w-sm text-sm leading-6 text-muted">
          {description}
        </span>
      ) : null}

      <input
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />
    </label>
  );
}
