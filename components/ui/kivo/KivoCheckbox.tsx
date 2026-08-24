"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

export interface KivoCheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  label: string;
  description?: string;
  error?: string;
}

export const KivoCheckbox = forwardRef<
  HTMLInputElement,
  KivoCheckboxProps
>(function KivoCheckbox(
  {
    id,
    label,
    description,
    error,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div>
      <label
        htmlFor={checkboxId}
        className="flex cursor-pointer items-start gap-3"
      >
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={cn(
            "mt-1 h-4 w-4 shrink-0 accent-primary",
            className,
          )}
          {...props}
        />

        <span>
          <span className="block text-sm font-semibold text-ink">
            {label}
          </span>

          {description ? (
            <span className="mt-1 block text-sm leading-6 text-body">
              {description}
            </span>
          ) : null}
        </span>
      </label>

      {error ? (
        <div className="ml-7 mt-2 text-xs font-medium text-error">
          {error}
        </div>
      ) : null}
    </div>
  );
});
