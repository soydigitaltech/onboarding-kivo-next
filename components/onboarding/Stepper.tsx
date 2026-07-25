"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import {
  STEP_ORDER,
  getStepStatus,
  type StepId,
  type StepStatus,
} from "@/store/onboarding";

const STEP_LABELS: Record<StepId, string> = {
  "datos-personales": "Tus datos",
  "datos-financieros": "Finanzas",
  simulacion: "Simulación",
};

interface StepperProps {
  currentStep: StepId;
  completed: Record<StepId, boolean>;
}

export function Stepper({ currentStep, completed }: StepperProps) {
  const doneCount = STEP_ORDER.filter((id) => completed[id]).length;
  const progress =
    STEP_ORDER.length > 1 ? doneCount / (STEP_ORDER.length - 1) : 0;

  return (
    <nav aria-label="Progreso de tu solicitud" className="mx-auto w-full max-w-md">
      <ol className="relative flex items-start justify-between">
        {/* Línea base + línea de progreso animada */}
        <div
          aria-hidden="true"
          className="absolute left-5 right-5 top-[19px] h-[3px] rounded-full bg-border"
        />
        <motion.div
          aria-hidden="true"
          className="absolute left-5 top-[19px] h-[3px] origin-left rounded-full bg-primary"
          style={{ right: 20 }}
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ type: "spring", stiffness: 170, damping: 26 }}
        />

        {STEP_ORDER.map((id, index) => {
          const status = getStepStatus(id, currentStep, completed);

          return (
            <li
              key={id}
              className="relative z-10 flex w-20 flex-col items-center gap-2"
              aria-current={status === "active" ? "step" : undefined}
            >
              <StepDot status={status} number={index + 1} />
              <span
                className={`text-center text-xs font-bold leading-tight ${
                  status === "locked" ? "text-placeholder" : "text-ink-soft"
                }`}
              >
                {STEP_LABELS[id]}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepDot({ status, number }: { status: StepStatus; number: number }) {
  if (status === "done") {
    return (
      <motion.span
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-dark text-white shadow-[0_6px_16px_rgba(27,91,182,0.35)]"
      >
        <Check className="h-5 w-5" strokeWidth={3} />
      </motion.span>
    );
  }

  if (status === "active") {
    return (
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-primary bg-white text-sm font-extrabold text-primary shadow-[0_6px_16px_rgba(3,174,254,0.25)]">
        {number}
      </span>
    );
  }

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-border bg-white text-sm font-extrabold text-placeholder">
      {number}
    </span>
  );
}