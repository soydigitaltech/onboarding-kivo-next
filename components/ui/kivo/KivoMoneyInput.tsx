"use client";

import {
  NumericFormat,
  type NumericFormatProps,
} from "react-number-format";

import { cn } from "@/lib/cn";

export interface KivoMoneyInputProps
  extends Omit<
    NumericFormatProps,
    "customInput"
  > {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
}

export function KivoMoneyInput({
  label,
  helper,
  error,
  required,
  className,
  ...props
}: KivoMoneyInputProps) {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-2 block text-sm font-semibold text-ink">
          {label}

          {required ? (
            <span
              aria-hidden="true"
              className="ml-1 text-error"
            >
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <NumericFormat
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        allowNegative={false}
        prefix="Bs "
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold tabular-nums text-ink",
          "outline-none transition-colors placeholder:text-placeholder",
          "focus:border-primary focus:ring-2 focus:ring-primary/10",
          error ? "border-error" : "border-border",
          className,
        )}
        {...props}
      />

      {error ? (
        <div className="mt-2 text-xs font-medium text-error">
          {error}
        </div>
      ) : helper ? (
        <div className="mt-2 text-xs leading-5 text-muted">
          {helper}
        </div>
      ) : null}
    </div>
  );
}
