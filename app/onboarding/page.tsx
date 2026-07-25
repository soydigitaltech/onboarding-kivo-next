"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";

import { getStepStatus, useOnboardingStore } from "@/store/onboarding";
import { Stepper } from "@/components/onboarding/Stepper";
import { AccordionSection } from "@/components/onboarding/AccordionSection";
import { DatosPersonalesForm } from "@/components/onboarding/steps/DatosPersonalesForm";
import { DatosPersonalesResumen } from "@/components/onboarding/steps/DatosPersonalesResumen";
import { DatosFinancierosForm } from "@/components/onboarding/steps/DatosFinancierosForm";
import { DatosFinancierosResumen } from "@/components/onboarding/steps/DatosFinancierosResumen";

export default function OnboardingPage() {
  // Evita el desajuste de hidratación con el store persistido:
  // las secciones se montan recién en cliente.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentStep = useOnboardingStore((s) => s.currentStep);
  const completed = useOnboardingStore((s) => s.completed);
  const datosPersonales = useOnboardingStore((s) => s.datosPersonales);
  const datosFinancieros = useOnboardingStore((s) => s.datosFinancieros);
  const editStep = useOnboardingStore((s) => s.editStep);

  return (
    <main className="flex min-h-dvh w-full flex-col items-center px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
      {/* Cabecera: logo + stepper */}
      <header className="flex w-full flex-col items-center gap-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kivo.svg" alt="Kivo" className="h-9 w-auto" />

        {mounted ? (
          <Stepper currentStep={currentStep} completed={completed} />
        ) : (
          <div className="h-[62px] w-full max-w-md" aria-hidden="true" />
        )}
      </header>

      {/* Secciones del flujo */}
      {mounted ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
          className="mt-9 flex w-full max-w-3xl flex-col gap-4"
        >
          <AccordionSection
            title="Datos personales"
            status={getStepStatus("datos-personales", currentStep, completed)}
            onEdit={() => editStep("datos-personales")}
            summary={
              datosPersonales ? (
                <DatosPersonalesResumen datos={datosPersonales} />
              ) : null
            }
          >
            <DatosPersonalesForm />
          </AccordionSection>

          <AccordionSection
            title="Datos financieros"
            status={getStepStatus("datos-financieros", currentStep, completed)}
            onEdit={() => editStep("datos-financieros")}
            summary={
              datosFinancieros ? (
                <DatosFinancierosResumen datos={datosFinancieros} />
              ) : null
            }
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
        </motion.div>
      ) : null}

      {/* Footer legal */}
      <footer className="mt-auto flex items-center gap-2 pt-12 text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        <span>Tus datos están protegidos y solo se usan para tu solicitud.</span>
      </footer>
    </main>
  );
}
