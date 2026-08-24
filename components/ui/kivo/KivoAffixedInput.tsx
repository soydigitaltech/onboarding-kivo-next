import type {
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export interface KivoAffixedInputProps {
  prefix?: string;
  suffix?: string;
  children: ReactNode;
  error?: boolean;
  className?: string;
}

export function KivoAffixedInput({
  prefix,
  suffix,
  children,
  error = false,
  className,
}: KivoAffixedInputProps) {
  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-xl border-2 bg-white transition",
        "focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15",
        error
          ? "border-error"
          : "border-border",
        className,
      )}
    >
      {prefix ? (
        <span
          className="
            flex shrink-0 items-center
            border-r-2 border-border
            bg-surface px-3.5
            text-sm font-bold text-ink-soft
          "
        >
          {prefix}
        </span>
      ) : null}

      {children}

      {suffix ? (
        <span
          className="
            flex shrink-0 items-center
            border-l-2 border-border
            bg-surface px-3.5
            text-sm font-bold text-ink-soft
          "
        >
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export const kivoAffixedInputClassName = `
  h-12 w-full min-w-0
  bg-transparent px-4
  text-[15px] font-medium text-ink
  outline-none
  placeholder:font-normal
  placeholder:text-placeholder
`;
