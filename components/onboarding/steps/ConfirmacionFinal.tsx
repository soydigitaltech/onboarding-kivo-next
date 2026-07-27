"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PartyPopper } from "lucide-react";

import { formatBs } from "@/lib/schemas/datos-financieros";
import type {
  DatosPersonales,
  SimulacionConfirmada,
  SolicitudEnviada,
} from "@/store/onboarding";

// TODO: confirmar con Kivo la URL definitiva del sitio institucional.
const KIVOCASH_URL = "https://www.kivocash.com/";

interface ConfirmacionFinalProps {
  solicitud: SolicitudEnviada;
  datosPersonales: DatosPersonales;
  simulacion: SimulacionConfirmada;
}

export function ConfirmacionFinal({
  solicitud,
  datosPersonales,
  simulacion,
}: ConfirmacionFinalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      className="mt-4 rounded-2xl bg-sky p-6 text-center sm:p-8"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/60 text-ink">
        <PartyPopper className="h-7 w-7" />
      </span>

      <h2 className="mt-4 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        ¡Tu solicitud fue enviada!
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-soft/80">
        Hemos registrado toda tu información con éxito. Nuestro equipo
        realizará una pre evaluación de tu solicitud y te contactaremos
        pronto al <strong className="text-ink">+591 {datosPersonales.celular}</strong>.
      </p>

      <div className="mx-auto mt-5 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl bg-white/50 px-5 py-3.5 text-sm">
        <span className="text-ink-soft/70">
          N.º de solicitud{" "}
          <strong className="text-ink">{solicitud.numero}</strong>
        </span>
        <span className="text-ink-soft/70">
          Monto <strong className="text-ink">{formatBs(simulacion.monto)}</strong>
        </span>
        <span className="text-ink-soft/70">
          Cuota{" "}
          <strong className="text-ink">
            {formatBs(simulacion.cuotaMensual)}/mes
          </strong>
        </span>
      </div>

      {/* TODO: confirmar con Kivo el plazo real de respuesta. */}
      <p className="mt-4 text-xs text-ink-soft/60">
        Tiempo estimado de respuesta: 24 a 48 horas hábiles.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-8 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark"
        >
          Ingresar
        </Link>
        <a
          href={KIVOCASH_URL}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-8 text-[15px] font-bold text-white transition-colors hover:bg-ink/85"
        >
          Cerrar
        </a>
      </div>
    </motion.div>
  );
}