"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export interface KivoRadioCardProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function KivoRadioCard({
  title,
  description,
  icon,
  className,
  checked,
  ...props
}: KivoRadioCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-4 rounded-2xl border p-5",
        "transition-colors",
        checked
          ? "border-primary bg-surface-blue"
          : "border-border bg-white hover:border-primary/60",
        className,
      )}
    >
      <input
        type="radio"
        checked={checked}
        className="mt-1 accent-primary"
        {...props}
      />

      {icon ? (
        <div className="shrink-0 text-primary-dark">
          {icon}
        </div>
      ) : null}

      <span className="block">
        <span className="block font-bold text-ink">
          {title}
        </span>

        {description ? (
          <span className="mt-1 block text-sm leading-6 text-body">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
