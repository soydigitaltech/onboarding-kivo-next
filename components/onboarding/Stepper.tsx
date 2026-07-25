"use client";

import { Check } from "lucide-react";

import {
  STEP_ORDER,
  getStepStatus,
  type StepId,
} from "@/store/onboarding";

interface StepperProps {
  currentStep: StepId;
  completed: Record<StepId, boolean>;
}

const STEP_LABELS: Record<StepId, string> = {
  "datos-personales": "Datos personales",
  "datos-financieros": "Datos financieros",
  simulacion: "Simulación",
};

export function Stepper({ currentStep, completed }: StepperProps) {
  return (
    <ol className="flex w-full max-w-md items-start">
      {STEP_ORDER.map((step, index) => {
        const status = getStepStatus(step, currentStep, completed);
        const isLast = index === STEP_ORDER.length - 1;

        return (
          <li
            key={step}
            className={["flex items-center", !isLast && "flex-1"]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={status === "active" ? "step" : undefined}
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300",
                  status === "done" &&
                    "bg-[#16a34a] text-white",
                  status === "active" &&
                    "bg-[#075eeb] text-white ring-4 ring-[#075eeb]/15",
                  status === "locked" &&
                    "bg-[#eef1f6] text-muted",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {status === "done" ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>

              <span
                className={[
                  "max-w-[5.5rem] text-center text-[11px] font-semibold leading-tight",
                  status === "locked" ? "text-muted" : "text-[#0b1739]",
                ].join(" ")}
              >
                {STEP_LABELS[step]}
              </span>
            </div>

            {!isLast ? (
              <span
                aria-hidden="true"
                className={[
                  "mx-2 mt-4 h-0.5 flex-1 rounded-full transition-colors duration-300",
                  completed[step] ? "bg-[#16a34a]" : "bg-[#e6e9ef]",
                ].join(" ")}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}