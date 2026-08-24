"use client";

import type {
  InputHTMLAttributes,
} from "react";

import {
  cn,
} from "@/lib/cn";

export interface KivoRadioPillProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  label: string;

  /**
   * Compatibilidad temporal con RadioPill legacy.
   * Para código nuevo pasar las props directamente.
   */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

export function KivoRadioPill({
  label,
  inputProps,
  className,
  ...directProps
}: KivoRadioPillProps) {
  const mergedProps = {
    ...inputProps,
    ...directProps,
  };

  return (
    <label
      className={cn(
        "flex min-h-12 cursor-pointer items-center justify-center",
        "rounded-xl border-2 border-border bg-white px-4",
        "text-sm font-bold text-ink-soft",
        "transition hover:border-primary/60",
        "has-[:checked]:border-primary",
        "has-[:checked]:bg-surface-blue",
        "has-[:checked]:text-primary",
        "has-[:focus-visible]:ring-4",
        "has-[:focus-visible]:ring-primary/20",
        className,
      )}
    >
      <input
        type="radio"
        className="sr-only"
        {...mergedProps}
      />

      {label}
    </label>
  );
}
