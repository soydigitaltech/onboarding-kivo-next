import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface KivoOnboardingActionsProps {
  back?: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  className?: string;
}

export function KivoOnboardingActions({
  back,
  primary,
  secondary,
  className,
}: KivoOnboardingActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        {back}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {secondary}
        {primary}
      </div>
    </div>
  );
}
