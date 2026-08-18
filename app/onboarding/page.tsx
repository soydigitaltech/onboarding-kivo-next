"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, ShieldCheck } from "lucide-react";

import { useOnboardingStore, type StepId } from "@/store/onboarding";
import { Stepper } from "@/components/onboarding/Stepper";
const PasoLoading = () => (
 <div className="grid min-h-[260px] place-items-center">
  <div className="flex flex-col items-center">
   <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
   <p className="mt-3 text-xs font-bold text-muted">
    Cargando…
   </p>
  </div>
 </div>
);

const DatosPersonalesForm = dynamic(
 () =>
  import("@/components/onboarding/steps/DatosPersonalesForm").then(
   (mod) => mod.DatosPersonalesForm,
  ),
 {
  ssr: false,
  loading: PasoLoading,
 },
);

const DatosFinancierosForm = dynamic(
 () =>
  import("@/components/onboarding/steps/DatosFinancierosForm").then(
   (mod) => mod.DatosFinancierosForm,
  ),
 {
  ssr: false,
  loading: PasoLoading,
 },
);

const SimulacionForm = dynamic(
 () =>
  import("@/components/onboarding/steps/SimulacionForm").then(
   (mod) => mod.SimulacionForm,
  ),
 {
  ssr: false,
  loading: PasoLoading,
 },
);

const InformacionComplementariaForm = dynamic(
 () =>
  import(
   "@/components/onboarding/steps/InformacionComplementariaForm"
  ).then((mod) => mod.InformacionComplementariaForm),
 {
  ssr: false,
  loading: PasoLoading,
 },
);

const DocumentosForm = dynamic(
 () =>
  import("@/components/onboarding/steps/DocumentosForm").then(
   (mod) => mod.DocumentosForm,
  ),
 {
  ssr: false,
  loading: PasoLoading,
 },
);

const ResumenForm = dynamic(
 () =>
  import("@/components/onboarding/steps/ResumenForm").then(
   (mod) => mod.ResumenForm,
  ),
 {
  ssr: false,
  loading: PasoLoading,
 },
);

const ConfirmacionFinal = dynamic(
 () =>
  import("@/components/onboarding/steps/ConfirmacionFinal").then(
   (mod) => mod.ConfirmacionFinal,
  ),
 {
  ssr: false,
  loading: PasoLoading,
 },
);

/** Título visible arriba del formulario del paso activo. */
const STEP_TITLES: Record<StepId, string> = {
 "datos-personales": "Tus datos",
 "datos-financieros": "Tus finanzas",
 simulacion: "Elige tu préstamo",
 "informacion-complementaria": "Más sobre ti",
 "carga-documentos": "Tus documentos",
 resumen: "Resumen",
};

export default function OnboardingPage() {
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 // eslint-disable-next-line react-hooks/set-state-in-effect
 setMounted(true);
 }, []);

 const currentStep = useOnboardingStore((s) => s.currentStep);
 const completed = useOnboardingStore((s) => s.completed);
 const datosPersonales = useOnboardingStore((s) => s.datosPersonales);
 const simulacion = useOnboardingStore((s) => s.simulacion);
 const solicitudEnviada = useOnboardingStore((s) => s.solicitudEnviada);
 const editStep = useOnboardingStore((s) => s.editStep);
 const reset = useOnboardingStore((s) => s.reset);

 // Acceso directo habilitado temporalmente para probar el onboarding.
 // Antes de producción se debe volver a exigir una cuenta verificada por OTP.

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
 className="mt-7 w-full max-w-3xl rounded-[28px] bg-white p-5 sm:p-8"
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

 {/* Nota de confianza + reinicio del formulario */}
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
 Reiniciar formulario
 </button>
 </div>
 </>
 ) : (
 <div className="grid min-h-[420px] place-items-center">
  <div className="flex flex-col items-center">
   <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
   <p className="mt-3 text-xs font-bold text-muted">
    Preparando tu solicitud…
   </p>
  </div>
 </div>
 )}
 </motion.div>
 </main>
 );
}