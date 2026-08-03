"use client";

import { useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { Pencil, ShieldCheck } from "lucide-react";

import { useOnboardingStore } from "@/store/onboarding";
import { calcularCapacidadPago } from "@/lib/simulacion";
import { formatBs } from "@/lib/schemas/datos-financieros";
import { CIUDADES } from "@/lib/schemas/datos-personales";
import {
  HOUSING_TYPES,
  MARITAL_STATUSES,
} from "@/lib/schemas/informacion-complementaria";

/** Genera un código de referencia legible tipo KV-2026-482913. */
function generarNumeroSolicitud(): string {
  const anio = new Date().getFullYear();
  const digitos = Math.floor(100000 + Math.random() * 900000);
  return `KV-${anio}-${digitos}`;
}

function buscarLabel(
  opciones: readonly { value: string; label: string }[],
  value: string | undefined,
): string {
  return opciones.find((o) => o.value === value)?.label ?? value ?? "—";
}

function SummarySection({
  titulo,
  onEdit,
  children,
}: {
  titulo: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">
          {titulo}
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <Pencil className="h-3 w-3" />
          Editar
        </button>
      </div>
      <dl className="mt-3 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
        {children}
      </dl>
    </div>
  );
}

function Dato({ label, valor }: { label: string; valor: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-bold text-ink-soft">{valor}</dd>
    </div>
  );
}

export function ResumenForm() {
  const datosPersonales = useOnboardingStore((s) => s.datosPersonales);
  const datosFinancieros = useOnboardingStore((s) => s.datosFinancieros);
  const simulacion = useOnboardingStore((s) => s.simulacion);
  const datosComplementarios = useOnboardingStore(
    (s) => s.datosComplementarios,
  );
  const datosDocumentos = useOnboardingStore((s) => s.datosDocumentos);
  const setSolicitudEnviada = useOnboardingStore((s) => s.setSolicitudEnviada);
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);
  const editStep = useOnboardingStore((s) => s.editStep);

  const [confirmo, setConfirmo] = useState(false);

  if (
    !datosPersonales ||
    !datosFinancieros ||
    !simulacion ||
    !datosComplementarios ||
    !datosDocumentos
  ) {
    return (
      <p className="text-sm leading-6 text-body">
        Completa los pasos anteriores para ver el resumen de tu solicitud.
      </p>
    );
  }

  const capacidad = calcularCapacidadPago({
    ingresoNeto: datosFinancieros.ingresoNeto,
    totalDeudas: datosFinancieros.totalCuotasMensuales,
  });

  const ciudad = buscarLabel(CIUDADES, datosPersonales.ciudad);
  const vivienda = buscarLabel(HOUSING_TYPES, datosComplementarios.vivienda);
  const estadoCivil = buscarLabel(
    MARITAL_STATUSES,
    datosComplementarios.estadoCivil,
  );

  const documentosLista = [
    { label: "Autorización BIC", meta: datosDocumentos.autorizacionBic },
    { label: "Carnet (anverso)", meta: datosDocumentos.ciAnverso },
    { label: "Carnet (reverso)", meta: datosDocumentos.ciReverso },
    { label: "Selfie", meta: datosDocumentos.selfie },
  ];

  const onEnviar = () => {
    if (!confirmo) return;

    setSolicitudEnviada({
      numero: generarNumeroSolicitud(),
      enviadoEn: new Date().toISOString(),
    });

    completeAndAdvance("resumen");

    // Celebración con los colores de marca Kivo.
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#03AEFE", "#FE9806", "#5FDAF8", "#1B5BB6"],
    });
  };

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Revisa que todo esté correcto antes de enviar. Puedes editar
        cualquier sección si algo no coincide.
      </p>

      <div className="flex flex-col gap-4">
        <SummarySection
          titulo="Datos personales"
          onEdit={() => editStep("datos-personales")}
        >
          <Dato
            label="Nombre completo"
            valor={datosPersonales.nombreCompleto}
          />
          <Dato label="Carnet" valor={datosPersonales.ci} />
          <Dato label="Celular" valor={`+591 ${datosPersonales.celular}`} />
          <Dato label="Ciudad" valor={ciudad} />
        </SummarySection>

        <SummarySection
          titulo="Datos financieros"
          onEdit={() => editStep("datos-financieros")}
        >
          <Dato
            label="Ingreso neto"
            valor={formatBs(datosFinancieros.ingresoNeto)}
          />
          <Dato
            label="Antigüedad"
            valor={`${datosFinancieros.antiguedadMeses} meses`}
          />
          <Dato
            label="Deudas activas"
            valor={
              datosFinancieros.numeroDeudas === 0
                ? "Ninguna"
                : `${datosFinancieros.numeroDeudas} · ${formatBs(
                    datosFinancieros.totalCuotasMensuales,
                  )}/mes`
            }
          />
          <Dato
            label="Capacidad de pago"
            valor={formatBs(Math.max(0, capacidad.cuotaMaxima))}
          />
        </SummarySection>

        <SummarySection
          titulo="Simulación de préstamo"
          onEdit={() => editStep("simulacion")}
        >
          <Dato label="Monto" valor={formatBs(simulacion.monto)} />
          <Dato label="Plazo" valor={`${simulacion.plazoMeses} meses`} />
          <Dato
            label="Cuota mensual"
            valor={formatBs(simulacion.cuotaMensual)}
          />
          <Dato label="Total a pagar" valor={formatBs(simulacion.totalPagar)} />
        </SummarySection>

        <SummarySection
          titulo="Información complementaria"
          onEdit={() => editStep("informacion-complementaria")}
        >
          <Dato
            label="Situación laboral"
            valor={
              datosComplementarios.perfilLaboral === "ASALARIADO"
                ? "Asalariado"
                : "Independiente"
            }
          />
          {datosComplementarios.perfilLaboral === "ASALARIADO" ? (
            <Dato
              label="Empresa / Cargo"
              valor={`${datosComplementarios.empresa} · ${datosComplementarios.cargo}`}
            />
          ) : (
            <Dato
              label="Actividad económica"
              valor={datosComplementarios.actividadEconomica ?? "—"}
            />
          )}
          <Dato label="Vivienda" valor={vivienda} />
          <Dato label="Estado civil" valor={estadoCivil} />
          <Dato label="Dirección" valor={datosComplementarios.direccion} />
          <Dato
            label="Destino del préstamo"
            valor={datosComplementarios.destinoPrestamo}
          />
        </SummarySection>

        <SummarySection
          titulo="Documentos"
          onEdit={() => editStep("carga-documentos")}
        >
          {documentosLista.map((doc) => (
            <Dato
              key={doc.label}
              label={doc.label}
              valor={
                doc.meta ? (
                  <span className="text-success">Cargado ✓</span>
                ) : (
                  "—"
                )
              }
            />
          ))}
        </SummarySection>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-surface p-4">
        <input
          type="checkbox"
          checked={confirmo}
          onChange={(e) => setConfirmo(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span className="text-sm leading-6 text-ink-soft">
          Confirmo que la información proporcionada es correcta y autorizo a
          Kivo a evaluarla para procesar mi solicitud.
        </span>
      </label>

      <div className="mt-6">
        <button
          type="button"
          onClick={onEnviar}
          disabled={!confirmo}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.5} />
          Enviar solicitud
        </button>
      </div>
    </div>
  );
}