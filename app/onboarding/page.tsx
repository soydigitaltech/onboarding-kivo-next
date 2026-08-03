"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, ShieldCheck } from "lucide-react";

import { useOnboardingStore, type StepId } from "@/store/onboarding";
import { Stepper } from "@/components/onboarding/Stepper";
import { DatosPersonalesForm } from "@/components/onboarding/steps/DatosPersonalesForm";
import { DatosFinancierosForm } from "@/components/onboarding/steps/DatosFinancierosForm";
import { SimulacionForm } from "@/components/onboarding/steps/SimulacionForm";
import { InformacionComplementariaForm } from "@/components/onboarding/steps/InformacionComplementariaForm";
import { DocumentosForm } from "@/components/onboarding/steps/DocumentosForm";
import { ResumenForm } from "@/components/onboarding/steps/ResumenForm";
import { ConfirmacionFinal } from "@/components/onboarding/steps/ConfirmacionFinal";

/** Título visible arriba del formulario del paso activo. */
const STEP_TITLES: Record<StepId, string> = {
  "datos-personales": "Datos personales",
  "datos-financieros": "Datos financieros",
  simulacion: "Simula tu cuota",
  "informacion-complementaria": "Información complementaria",
  "carga-documentos": "Carga tus documentos",
  resumen: "Resumen de tu solicitud",
};

export default function OnboardingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const router = useRouter();
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const completed = useOnboardingStore((s) => s.completed);
  const cuenta = useOnboardingStore((s) => s.cuenta);
  const datosPersonales = useOnboardingStore((s) => s.datosPersonales);
  const simulacion = useOnboardingStore((s) => s.simulacion);
  const solicitudEnviada = useOnboardingStore((s) => s.solicitudEnviada);
  const editStep = useOnboardingStore((s) => s.editStep);
  const reset = useOnboardingStore((s) => s.reset);

  // Puerta de acceso: sin cuenta verificada, no se puede entrar al
  // onboarding directamente — hay que registrarse/ingresar primero.
  useEffect(() => {
    if (mounted && !cuenta) {
      router.replace("/registro");
    }
  }, [mounted, cuenta, router]);

  const mostrarConfirmacion =
    currentStep === "resumen" &&
    completed.resumen &&
    solicitudEnviada &&
    datosPersonales &&
    simulacion;

  function renderPasoActivo() {
    if (mostrarConfirmacion) {
      return (
        <ConfirmacionFinal
          solicitud={solicitudEnviada!}
          datosPersonales={datosPersonales!}
          simulacion={simulacion!}
        />
      );
    }

    switch (currentStep) {
      case "datos-personales":
        return <DatosPersonalesForm />;
      case "datos-financieros":
        return <DatosFinancierosForm />;
      case "simulacion":
        return <SimulacionForm />;
      case "informacion-complementaria":
        return <InformacionComplementariaForm />;
      case "carga-documentos":
        return <DocumentosForm />;
      case "resumen":
        return <ResumenForm />;
    }
  }

  return (
    <main className="flex min-h-dvh w-full flex-col items-center px-4 pb-14 pt-8 sm:px-6 sm:pt-10">
      {/* Logo sobre el fondo de página */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/kivo.svg" alt="Kivo" className="h-24 w-auto" />

      {/* Panel único: stepper + solo el paso activo */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
        className="mt-7 w-full max-w-3xl rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(11,23,57,0.16)] sm:p-8"
      >
        {mounted ? (
          <>
            <Stepper
              currentStep={currentStep}
              completed={completed}
              onStepClick={editStep}
            />

            <div className="mt-9">
              {mostrarConfirmacion ? null : (
                <h2 className="mb-5 text-sm font-extrabold uppercase tracking-[0.08em] text-primary">
                  {STEP_TITLES[currentStep]}
                </h2>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={mostrarConfirmacion ? "confirmacion" : currentStep}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
                >
                  {renderPasoActivo()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nota de confianza + reinicio (útil para el demo) */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border-soft pt-5 text-xs text-muted">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-cerulean" />
                Tus datos están protegidos y solo se usan para tu solicitud.
              </span>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 font-semibold text-muted underline-offset-2 transition-colors hover:text-primary hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                Reiniciar demo
              </button>
            </div>
          </>
        ) : (
          <div className="h-[420px]" aria-hidden="true" />
        )}
      </motion.div>
    </main>
  );
}