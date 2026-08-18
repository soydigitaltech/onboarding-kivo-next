"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";

import { useOnboardingStore } from "@/store/onboarding";
import { CrearCuentaForm } from "@/components/onboarding/steps/CrearCuentaForm";

export default function RegistroPage() {
 const router = useRouter();
 const cuenta = useOnboardingStore((s) => s.cuenta);
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 // eslint-disable-next-line react-hooks/set-state-in-effect
 setMounted(true);
 }, []);

 useEffect(() => {
 if (mounted && cuenta) {
 router.replace("/onboarding");
 }
 }, [mounted, cuenta, router]);

 return (
 <main className="flex min-h-dvh w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src="/kivo.svg" alt="Kivo" className="h-16 w-auto" />

 <motion.div
 initial={{ opacity: 0, y: 14 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
 className="mt-7 w-full max-w-md rounded-[28px] bg-white p-6 sm:p-8"
 >
 {mounted && !cuenta ? (
 <>
 <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
 Bienvenido a Kivo
 </p>

 <h1 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
 Crea tu cuenta para continuar
 </h1>

 <div className="mt-6">
 <CrearCuentaForm />
 </div>
 </>
 ) : (
 <div className="h-[280px]" aria-hidden="true" />
 )}
 </motion.div>

 <div className="mt-6 flex items-center gap-2 text-xs text-muted">
 <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-cerulean" />
 <span>Tu correo solo se usa para verificar tu identidad.</span>
 </div>
 </main>
 );
}
