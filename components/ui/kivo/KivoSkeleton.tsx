import type {
  HTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

export function KivoSkeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-lg bg-border-soft",
        className,
      )}
      {...props}
    />
  );
}
