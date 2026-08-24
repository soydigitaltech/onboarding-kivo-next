import {
  Check,
} from "lucide-react";

import {
  cn,
} from "@/lib/cn";

export type KivoStepState =
  | "pending"
  | "current"
  | "completed"
  | "error";

export type KivoStep = {
  label: string;
  state?: KivoStepState;
};

export interface KivoStepperProps {
  steps: KivoStep[];
  className?: string;
}

export function KivoStepper({
  steps,
  className,
}: KivoStepperProps) {
  return (
    <ol
      className={cn(
        "grid gap-3",
        className,
      )}
    >
      {steps.map((step, index) => {
        const state =
          step.state ?? "pending";

        return (
          <li
            key={`${step.label}-${index}`}
            className="flex items-center gap-3"
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                state === "completed" &&
                  "bg-primary-dark text-white",
                state === "current" &&
                  "bg-primary text-white",
                state === "pending" &&
                  "bg-surface text-muted",
                state === "error" &&
                  "bg-error text-white",
              )}
            >
              {state === "completed" ? (
                <Check size={16} />
              ) : (
                index + 1
              )}
            </div>

            <span
              className={cn(
                "text-sm",
                state === "current"
                  ? "font-bold text-ink"
                  : "font-medium text-body",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
