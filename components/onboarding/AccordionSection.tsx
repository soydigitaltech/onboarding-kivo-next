"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { Check, Lock, Pencil } from "lucide-react";
import type { StepStatus } from "@/store/onboarding";

interface AccordionSectionProps {
  title: string;
  status: StepStatus;
  /** Permite reabrir una sección completada para editarla. */
  onEdit?: () => void;
  children: ReactNode;
}

const REVEAL_TRANSITION: Transition = {
  duration: 0.35,
  ease: [0.25, 0.8, 0.25, 1],
};

/**
 * Sección colapsable del onboarding con tres estados:
 * bloqueada (atenuada), activa (abierta) y completada (cerrada, con
 * check y botón Editar). Vive dentro del panel blanco, delimitada
 * por borde suave en lugar de sombra propia.
 */
export function AccordionSection({
  title,
  status,
  onEdit,
  children,
}: AccordionSectionProps) {
  const isLocked = status === "locked";

  return (
    <motion.section
      layout
      transition={REVEAL_TRANSITION}
      className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
        status === "active"
          ? "border-primary/45"
          : "border-border-soft"
      } ${isLocked ? "opacity-60" : ""}`}
    >
      <header className="flex items-center gap-3.5 px-5 py-4.5 sm:px-6">
        <StatusIcon status={status} />

        <h2
          className={`flex-1 text-[15px] font-extrabold uppercase tracking-[0.08em] sm:text-base ${
            status === "active"
              ? "text-primary"
              : status === "done"
                ? "text-ink"
                : "text-placeholder"
          }`}
        >
          {title}
        </h2>

        {status === "done" && onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-bold text-primary transition hover:bg-surface-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </button>
        ) : null}
      </header>

      <AnimatePresence initial={false}>
        {status === "active" ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL_TRANSITION}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 sm:px-6 sm:pb-7">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <motion.span
        initial={{ scale: 0.5, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 18 }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-dark text-white"
      >
        <Check className="h-4.5 w-4.5" strokeWidth={3} />
      </motion.span>
    );
  }

  if (status === "active") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
        <Check className="h-4.5 w-4.5" strokeWidth={3} />
      </span>
    );
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border text-white">
      <Lock className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}