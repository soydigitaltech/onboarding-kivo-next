"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Lock, Pencil } from "lucide-react";

import type { StepStatus } from "@/store/onboarding";

interface AccordionSectionProps {
  /** Título visible de la sección (ej. "Datos personales"). */
  title: string;
  /** Estado derivado de getStepStatus(): locked | active | done. */
  status: StepStatus;
  /**
   * Se llama al presionar "Editar". Solo tiene sentido cuando la
   * sección ya está completa (status === "done"); si no se pasa,
   * simplemente no se muestra el botón.
   */
  onEdit?: () => void;
  /**
   * Resumen de lo ya ingresado, mostrado cuando status === "done".
   * Si es null (sección completa pero sin resumen todavía armado),
   * no se muestra nada debajo del encabezado.
   */
  summary?: ReactNode | null;
  /** El formulario del paso; solo se monta mientras está activo. */
  children: ReactNode;
}

const EXPAND_TRANSITION = {
  duration: 0.3,
  ease: [0.25, 0.8, 0.25, 1] as const,
};

export function AccordionSection({
  title,
  status,
  onEdit,
  summary,
  children,
}: AccordionSectionProps) {
  const isActive = status === "active";
  const isDone = status === "done";
  const isLocked = status === "locked";

  return (
    <section
      aria-current={isActive ? "step" : undefined}
      aria-disabled={isLocked || undefined}
      className={[
        "overflow-hidden rounded-2xl border bg-white transition-colors duration-300",
        isActive &&
          "border-[#075eeb] shadow-[0_8px_28px_rgba(7,94,235,0.10)]",
        isDone && "border-[#dce3ee]",
        isLocked && "border-[#e6e9ef] bg-[#fafbfc]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <StatusIcon status={status} />
          <h2
            className={[
              "truncate text-base font-bold sm:text-lg",
              isLocked ? "text-muted" : "text-[#0b1739]",
            ].join(" ")}
          >
            {title}
          </h2>
        </div>

        {isDone && onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-[#075eeb] transition hover:bg-[#eaf3ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#075eeb]/40"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Editar
          </button>
        ) : null}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {isActive ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={EXPAND_TRANSITION}
            className="overflow-hidden"
          >
            <div className="border-t border-[#eef1f6] px-5 pb-6 pt-5 sm:px-6">
              {children}
            </div>
          </motion.div>
        ) : isDone && summary ? (
          <motion.div
            key="summary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={EXPAND_TRANSITION}
            className="overflow-hidden"
          >
            <div className="border-t border-[#eef1f6] px-5 pb-5 pt-4 sm:px-6">
              {summary}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#16a34a]/10 text-[#16a34a]">
        <Check className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  }

  if (status === "locked") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef1f6] text-muted">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#075eeb]/10"
      aria-hidden="true"
    >
      <span className="h-2 w-2 rounded-full bg-[#075eeb]" />
    </span>
  );
}