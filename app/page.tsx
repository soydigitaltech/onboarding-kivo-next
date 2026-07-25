"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";

import { getStepStatus, useOnboardingStore } from "@/store/onboarding";
import { Stepper } from "@/components/onboarding/Stepper";
import { AccordionSection } from "@/components/onboarding/AccordionSection";
import { DatosPersonalesForm } from "@/components/onboarding/steps/DatosPersonalesForm";
import { DatosFinancierosForm } from "@/components/onboarding/steps/DatosFinancierosForm";

export default function OnboardingPage() {
  // Evita el desajuste de hidratación con el store persistido:
  // las secciones se montan recién en cliente.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentStep = useOnboardingStore((s) => s.currentStep);
  const completed = useOnboardingStore((s) => s.completed);
  const editStep = useOnboardingStore((s) => s.editStep);

  return (
    <main className="flex min-h-dvh w-full flex-col items-center px-4 pb-14 pt-8 sm:px-6 sm:pt-10">
      {/* Logo sobre el fondo de página */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/kivo.svg" alt="Kivo" className="h-10 w-auto" />

      {/* Panel único: stepper + secciones como una sola hoja */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
        className="mt-7 w-full max-w-3xl rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(11,23,57,0.16)] sm:p-8"
      >
        {mounted ? (
          <>
            <Stepper currentStep={currentStep} completed={completed} />

            <div className="mt-8 flex flex-col gap-3.5">
              <AccordionSection
                title="Datos personales"
                status={getStepStatus(
                  "datos-personales",
                  currentStep,
                  completed,
                )}
                onEdit={() => editStep("datos-personales")}
              >
                <DatosPersonalesForm />
              </AccordionSection>

              <AccordionSection
                title="Datos financieros"
                status={getStepStatus(
                  "datos-financieros",
                  currentStep,
                  completed,
                )}
                onEdit={() => editStep("datos-financieros")}
              >
                <DatosFinancierosForm />
              </AccordionSection>

              <AccordionSection
                title="Simula tu préstamo"
                status={getStepStatus("simulacion", currentStep, completed)}
              >
                {/* Siguiente iteración: el simulador con cuota animada. */}
                <p className="text-sm leading-6 text-body">
                  Elegirás el monto y el plazo, y verás tu cuota estimada al
                  instante.
                </p>
              </AccordionSection>
            </div>

            {/* Nota de confianza dentro del panel */}
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-border-soft pt-5 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-cerulean" />
              <span>
                Tus datos están protegidos y solo se usan para tu solicitud.
              </span>
            </div>
          </>
        ) : (
          <div className="h-[420px]" aria-hidden="true" />
        )}
      </motion.div>
    </main>
  );
}