"use client";

import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from "react";

import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/cn";

export interface KivoTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  error?: string;

  /**
   * Convierte el contenido ingresado a MAYÚSCULAS.
   * Por defecto está activo.
   */
  uppercase?: boolean;
}

export const KivoTextarea = forwardRef<
  HTMLTextAreaElement,
  KivoTextareaProps
>(function KivoTextarea(
  {
    id,
    label,
    helper,
    error,
    required,
    className,
    uppercase = true,
    onChange,
    autoCapitalize,
    placeholder,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;

  const placeholderNormalizado =
    uppercase &&
    typeof placeholder === "string"
      ? placeholder.toLocaleUpperCase("es-BO")
      : placeholder;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={textareaId}
          className="mb-2 block text-sm font-semibold text-ink"
        >
          {label}

          {required ? (
            <span
              className="ml-1 text-error"
              aria-hidden="true"
            >
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={textareaId}
        placeholder={placeholderNormalizado}
        required={required}
        autoCapitalize={
          uppercase
            ? "characters"
            : autoCapitalize
        }
        onChange={(event) => {
          if (uppercase) {
            event.currentTarget.value =
              event.currentTarget.value.toLocaleUpperCase(
                "es-BO",
              );
          }

          onChange?.(event);
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? errorId
            : helper
              ? helperId
              : undefined
        }
        className={cn(
          "min-h-28 w-full resize-y rounded-xl border bg-white px-4 py-3",
          "text-sm text-ink outline-none transition-colors",
          "placeholder:text-placeholder",
          "focus:border-primary focus:ring-2 focus:ring-primary/10",
          "disabled:cursor-not-allowed disabled:bg-surface",
          error
            ? "border-error focus:border-error focus:ring-error/10"
            : "border-border",
          className,
        )}
        {...props}
      />

      {error ? (
        <div
          id={errorId}
          className="mt-2 flex items-start gap-1.5 text-xs font-medium text-error"
        >
          <AlertCircle
            size={14}
            className="mt-0.5 shrink-0"
          />
          {error}
        </div>
      ) : helper ? (
        <div
          id={helperId}
          className="mt-2 text-xs leading-5 text-muted"
        >
          {helper}
        </div>
      ) : null}
    </div>
  );
});
