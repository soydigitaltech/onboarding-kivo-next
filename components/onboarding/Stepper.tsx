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
  "datos-financieros": "Tus finanzas",
  simulacion: "Elige tu préstamo",
  "informacion-complementaria": "Más sobre ti",
  "carga-documentos": "Tus documentos",
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

  const currentLabel = STEP_LABELS[currentStep];

  return (
    <nav
      aria-label="Progreso de tu solicitud"
      className="w-full"
    >
      {/* MOBILE */}
      <div className="px-4 sm:hidden">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-primary">
              Paso {currentIndex + 1} de {STEP_ORDER.length}
            </p>

            <p className="mt-1 text-base font-extrabold text-ink">
              {currentLabel}
            </p>
          </div>

          <span className="shrink-0 text-xs font-bold text-muted">
            {Math.round(
              ((currentIndex + 1) / STEP_ORDER.length) * 100,
            )}
            %
          </span>
        </div>

        <ol className="relative grid grid-cols-6 items-center">
          <div
            aria-hidden="true"
            className="absolute left-[8.33%] right-[8.33%] top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-border"
          />

          <motion.div
            aria-hidden="true"
            className="absolute left-[8.33%] top-1/2 h-[2px] w-[83.34%] origin-left -translate-y-1/2 rounded-full bg-sky"
            initial={false}
            animate={{ scaleX: progress }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 26,
            }}
          />

          {STEP_ORDER.map((id, index) => {
            const status = getStepStatus(
              id,
              currentStep,
              completed,
            );

            const clickable =
              status === "done" && Boolean(onStepClick);

            return (
              <li
                key={id}
                className="relative z-10 flex justify-center"
                aria-current={
                  status === "active" ? "step" : undefined
                }
              >
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => onStepClick?.(id)}
                    aria-label={`Volver a ${STEP_LABELS[id]}`}
                    className="cursor-pointer rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                  >
                    <MobileStepDot
                      status={status}
                      number={index + 1}
                    />
                  </button>
                ) : (
                  <MobileStepDot
                    status={status}
                    number={index + 1}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-4 rounded-[16px] bg-surface-blue px-4 py-3">
          <p className="text-xs leading-5 text-body">
            Estás en{" "}
            <strong className="font-extrabold text-ink">
              {currentLabel}
            </strong>
          </p>
        </div>
      </div>

      {/* DESKTOP / TABLET */}
      <div className="hidden px-4 sm:block">
        <ol className="relative mx-auto grid w-full max-w-[720px] grid-cols-6 items-start">
          <div
            aria-hidden="true"
            className="absolute left-[8.33%] right-[8.33%] top-[19px] h-[3px] rounded-full bg-border"
          />

          <motion.div
            aria-hidden="true"
            className="absolute left-[8.33%] top-[19px] h-[3px] w-[83.34%] origin-left rounded-full bg-sky"
            initial={false}
            animate={{ scaleX: progress }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 26,
            }}
          />

          {STEP_ORDER.map((id, index) => {
            const status = getStepStatus(
              id,
              currentStep,
              completed,
            );

            const clickable =
              status === "done" && Boolean(onStepClick);

            return (
              <li
                key={id}
                className="relative z-10 flex flex-col items-center gap-2"
                aria-current={
                  status === "active" ? "step" : undefined
                }
              >
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => onStepClick?.(id)}
                    aria-label={`Volver a ${STEP_LABELS[id]}`}
                    className="cursor-pointer rounded-full transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                  >
                    <StepDot
                      status={status}
                      number={index + 1}
                    />
                  </button>
                ) : (
                  <StepDot
                    status={status}
                    number={index + 1}
                  />
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
      </div>
    </nav>
  );
}

function MobileStepDot({
  status,
  number,
}: {
  status: StepStatus;
  number: number;
}) {
  if (status === "done") {
    return (
      <motion.span
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky bg-ink text-white"
      >
        <Check className="h-4 w-4" strokeWidth={2.7} />
      </motion.span>
    );
  }

  if (status === "active") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky bg-ink text-xs font-extrabold text-white">
        {number}
      </span>
    );
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-white text-xs font-bold text-placeholder">
      {number}
    </span>
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
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky bg-ink text-white"
      >
        <Check className="h-5 w-5" strokeWidth={2.5} />
      </motion.span>
    );
  }

  if (status === "active") {
    return (
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky bg-ink text-sm font-bold text-white">
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
