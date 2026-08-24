"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export interface KivoInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingAction?: ReactNode;
  requiredLabel?: boolean;
}

export const KivoInput = forwardRef<
  HTMLInputElement,
  KivoInputProps
>(function KivoInput(
  {
    id,
    label,
    helper,
    error,
    leadingIcon,
    trailingAction,
    required,
    requiredLabel,
    disabled,
    readOnly,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const describedBy = error
    ? errorId
    : helper
      ? helperId
      : undefined;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-bold text-ink"
        >
          {label}

          {(required || requiredLabel) ? (
            <span
              aria-hidden="true"
              className="ml-1 text-error"
            >
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="relative">
        {leadingIcon ? (
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute
              left-4 top-1/2
              flex -translate-y-1/2
              items-center text-muted
            "
          >
            {leadingIcon}
          </div>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            "h-12 w-full min-w-0 rounded-xl border-2 bg-white px-4",
            "text-[15px] font-medium text-ink",
            "outline-none transition",
            "placeholder:font-normal placeholder:text-placeholder",
            "focus:border-primary focus:ring-4 focus:ring-primary/15",
            "disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60",
            "read-only:bg-surface",
            error
              ? "border-error"
              : "border-border",
            Boolean(leadingIcon) && "pl-11",
            Boolean(trailingAction) && "pr-12",
            className,
          )}
          {...props}
        />

        {trailingAction ? (
          <div
            className="
              absolute right-3 top-1/2
              flex -translate-y-1/2
              items-center
            "
          >
            {trailingAction}
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="
            mt-1.5 flex items-start gap-1.5
            text-xs font-semibold text-error
          "
        >
          <AlertCircle
            size={14}
            aria-hidden="true"
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </p>
      ) : helper ? (
        <p
          id={helperId}
          className="mt-2 text-xs leading-5 text-muted"
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
});
