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
  simulacion: "Calcula tu cuota",
  "informacion-complementaria": "Información",
  "carga-documentos": "Documentos",
  resumen: "Resumen",
};

interface StepperProps {
  currentStep: StepId;
  completed: Record<StepId, boolean>;
  onStepClick?: (step: StepId) => void;
}

export function Stepper({
  currentStep,
  completed,
  onStepClick,
}: StepperProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const doneCount = STEP_ORDER.filter((id) => completed[id]).length;
  const pasosAlcanzados = Math.max(currentIndex, doneCount);

  const progress =
    STEP_ORDER.length > 1
      ? Math.min(1, pasosAlcanzados / (STEP_ORDER.length - 1))
      : 0;

  return (
    <nav aria-label="Progreso de tu solicitud" className="w-full px-4">
      <ol className="relative mx-auto grid w-full max-w-[720px] grid-cols-6 items-start">
        <div
          aria-hidden="true"
          className="absolute left-[8.33%] right-[8.33%] top-[19px] h-[3px] rounded-full bg-border"
        />

        <motion.div
          aria-hidden="true"
          className="absolute left-[8.33%] top-[19px] h-[3px] origin-left rounded-full bg-sky"
          style={{ width: "83.34%" }}
          initial={false}
          animate={{ scaleX: progress }}
          transition={{
            type: "spring",
            stiffness: 170,
            damping: 26,
          }}
        />

        {STEP_ORDER.map((id, index) => {
          const status = getStepStatus(id, currentStep, completed);
          const clickable = status === "done" && Boolean(onStepClick);

          return (
            <li
              key={id}
              className="relative z-10 flex flex-col items-center gap-2"
              aria-current={status === "active" ? "step" : undefined}
            >
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(id)}
                  aria-label={`Volver a ${STEP_LABELS[id]}`}
                  className="rounded-full transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                >
                  <StepDot status={status} number={index + 1} />
                </button>
              ) : (
                <StepDot status={status} number={index + 1} />
              )}

              <span
                className={`text-center text-[12px] font-bold leading-tight ${
                  status === "locked"
                    ? "text-placeholder"
                    : "text-ink-soft"
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

function StepDot({
  status,
  number,
}: {
  status: StepStatus;
  number: number;
}) {
  if (status === "done") {
    return (
      <motion.span
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky bg-ink text-white shadow-[0_6px_16px_rgba(95,218,248,0.35)]"
      >
        <Check className="h-5 w-5" strokeWidth={2.5} />
      </motion.span>
    );
  }

  if (status === "active") {
    return (
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky bg-ink text-sm font-bold text-white shadow-[0_6px_16px_rgba(95,218,248,0.35)]">
        {number}
      </span>
    );
  }

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-border bg-white text-sm font-bold text-placeholder">
      {number}
    </span>
  );
}
