"use client";

import { useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { Pencil, ShieldCheck } from "lucide-react";

import { useOnboardingStore } from "@/store/onboarding";
import { formatBs } from "@/lib/schemas/datos-financieros";
import {
 CIUDADES,
 calcularEdad,
} from "@/lib/schemas/datos-personales";
import {
 FAMILY_HOUSING_RELATIONSHIPS,
 HOUSING_TYPES,
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
 return opciones.find((opcion) => opcion.value === value)?.label ?? value ?? "—";
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

function Dato({
 label,
 valor,
}: {
 label: string;
 valor: ReactNode;
}) {
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
 const datosPersonales = useOnboardingStore((state) => {
 return state.datosPersonales;
 });

 const cuenta = useOnboardingStore((state) => {
 return state.cuenta;
 });

 const datosFinancieros = useOnboardingStore((state) => {
 return state.datosFinancieros;
 });

 const simulacion = useOnboardingStore((state) => {
 return state.simulacion;
 });

 const datosComplementarios = useOnboardingStore((state) => {
 return state.datosComplementarios;
 });

 const datosDocumentos = useOnboardingStore((state) => {
 return state.datosDocumentos;
 });

 const setSolicitudEnviada = useOnboardingStore((state) => {
 return state.setSolicitudEnviada;
 });

 const completeAndAdvance = useOnboardingStore((state) => {
 return state.completeAndAdvance;
 });

 const editStep = useOnboardingStore((state) => {
 return state.editStep;
 });

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
const ciudad = buscarLabel(CIUDADES, datosPersonales.ciudad);

 const vivienda = buscarLabel(
 HOUSING_TYPES,
 datosComplementarios.vivienda,
 );

 const parentescoVivienda = buscarLabel(
 FAMILY_HOUSING_RELATIONSHIPS,
 datosComplementarios.parentescoViviendaFamiliar,
 );

 const esAsalariado =
 datosFinancieros.perfilLaboral === "ASALARIADO";

 const requiereGarante =
 datosComplementarios.vivienda === "ALQUILER" ||
 datosComplementarios.vivienda === "ANTICRETICO";

 const edad = calcularEdad(datosPersonales.fechaNacimiento);

 const perfilLaboral =
 datosFinancieros.perfilLaboral === "ASALARIADO"
 ? "Asalariado"
 : "Independiente";

 const documentosLista = [
 {
 label: "Carnet (anverso)",
 meta: datosDocumentos.ciAnverso,
 },
 {
 label: "Carnet (reverso)",
 meta: datosDocumentos.ciReverso,
 },
 {
 label: "Fotografía / selfie",
 meta: datosDocumentos.selfie,
 },
 {
 label: "Autorización expresa",
 meta: datosDocumentos.autorizacionBic,
 },
 ];

 const onEnviar = () => {
 if (!confirmo) return;

 setSolicitudEnviada({
 numero: generarNumeroSolicitud(),
 enviadoEn: new Date().toISOString(),
 });

 completeAndAdvance("resumen");

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
 Revisa que toda la información esté correcta antes de enviar. Puedes
 editar cualquier sección si algún dato no coincide.
 </p>

 <div className="flex flex-col gap-4">
 <SummarySection
 titulo="Tus datos"
 onEdit={() => editStep("datos-personales")}
 >
 <Dato
 label="Primer nombre"
 valor={datosPersonales.primerNombre}
/>

<Dato
 label="Segundo nombre"
 valor={datosPersonales.segundoNombre || "—"}
/>

<Dato
 label="Primer apellido"
 valor={datosPersonales.primerApellido}
/>

<Dato
 label="Segundo apellido"
 valor={datosPersonales.segundoApellido || "—"}
/>

<Dato
 label="Sexo"
 valor={
 datosPersonales.sexo === "MUJER"
 ? "Mujer"
 : "Hombre"
 }
/>

{datosPersonales.sexo === "MUJER" ? (
 <>
  <Dato
   label="¿Está casada?"
   valor={
    datosPersonales.esCasada === "SI"
     ? "Sí"
     : "No"
   }
  />

  {datosPersonales.esCasada === "SI" ? (
   <Dato
    label="Apellido por matrimonio"
    valor={
     datosPersonales.apellidoMatrimonio ||
     "—"
    }
   />
  ) : null}
 </>
) : null}

<Dato
 label="Carnet"
 valor={datosPersonales.ci}
 />

 <Dato
 label="Edad"
 valor={`${edad} años`}
 />

 <Dato
 label="Celular"
 valor={`+591 ${datosPersonales.celular}`}
 />

 <Dato
 label="Correo"
 valor="usuario@correo.com"
 />

 <Dato
 label="Ciudad"
 valor={ciudad}
 />

 <Dato
 label="Dirección de domicilio"
 valor={datosPersonales.direccion}
 />

 <Dato
 label="Dependientes"
 valor={datosPersonales.numeroDependientes}
 />
 </SummarySection>

 <SummarySection
 titulo="Tus finanzas"
 onEdit={() => editStep("datos-financieros")}
 >
 <Dato
 label="Tipo de actividad"
 valor={perfilLaboral}
 />

 <Dato
 label="Ingresos mensuales"
 valor={formatBs(datosFinancieros.ingresoNeto)}
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
 label="Deudas atrasadas"
 valor={
 datosFinancieros.sinDeudaMoraOVencida
 ? "No"
 : "Sí"
 }
 />

 <Dato
 label="Extractos bancarios"
 valor={
 datosFinancieros.extractos === "SI"
 ? "Sí, cuenta con extractos"
 : "No cuenta con extractos"
 }
 />

 <Dato
  label="Endeudamiento (PDE)"
  valor={
 typeof simulacion.porcentajeEndeudamiento === "number"
 ? `${simulacion.porcentajeEndeudamiento.toFixed(2)}%`
 : "—"
}
/>
 </SummarySection>

 <SummarySection
 titulo="Elige tu préstamo"
 onEdit={() => editStep("simulacion")}
 >
 <Dato
 label="Monto"
 valor={formatBs(simulacion.monto)}
 />

 <Dato
 label="Plazo"
 valor={`${simulacion.plazoMeses} meses`}
 />

 <Dato
 label="Cuota mensual"
 valor={formatBs(simulacion.cuotaMensual)}
 />

 <Dato
 label="Total a pagar"
 valor={formatBs(simulacion.totalPagar)}
 />
 </SummarySection>

 <SummarySection
 titulo="Más sobre ti"
 onEdit={() =>
 editStep("informacion-complementaria")
 }
 >
 <Dato
 label={esAsalariado ? "Empresa" : "Negocio"}
 valor={datosComplementarios.nombreEmpresaNegocio}
 />

 <Dato
 label="Rubro"
 valor={datosComplementarios.rubro}
 />

 <Dato
 label={esAsalariado ? "Cargo" : "Ocupación"}
 valor={datosComplementarios.cargoActividad}
 />

 <Dato
 label={
 esAsalariado
 ? "Antigüedad laboral"
 : "Antigüedad en la actividad"
 }
 valor={`${datosComplementarios.antiguedadActividad} meses`}
 />

 <Dato
 label={
 esAsalariado
 ? "Dirección laboral"
 : "Dirección del negocio"
 }
 valor={datosComplementarios.direccionLaboral}
 />

 {!esAsalariado ? (
 <>
 <Dato
 label="NIT"
 valor={
 datosComplementarios.tieneNit === "SI"
 ? "Sí"
 : datosComplementarios.tieneNit === "NO"
 ? "No"
 : "—"
 }
 />

 <Dato
 label="Licencia de funcionamiento / patente"
 valor={
 datosComplementarios.tieneLicenciaFuncionamiento === "SI"
 ? "Sí"
 : datosComplementarios.tieneLicenciaFuncionamiento === "NO"
 ? "No"
 : "—"
 }
 />
 </>
 ) : null}

 {esAsalariado ? (
 <>
 <Dato
 label="AFP"
 valor={
 datosComplementarios.tieneAfp === "SI"
 ? "Sí"
 : "No"
 }
 />

 <Dato
 label="Boletas de pago"
 valor={
 datosComplementarios.tieneBoletasPago === "SI"
 ? "Sí"
 : "No"
 }
 />
 </>
 ) : null}

 <Dato
 label="Tipo de vivienda"
 valor={vivienda}
 />

 {datosComplementarios.vivienda === "FAMILIAR" ? (
 <Dato
 label="Vivienda familiar"
 valor={
 datosComplementarios.parentescoViviendaFamiliar === "OTROS"
 ? datosComplementarios.detalleParentescoViviendaFamiliar || parentescoVivienda
 : parentescoVivienda
 }
 />
 ) : null}

 {requiereGarante ? (
 <Dato
 label="Garante con vivienda propia"
 valor={
 datosComplementarios.tieneGarante === "SI"
 ? "Sí"
 : "No"
 }
 />
 ) : null}

 <Dato
 label="Destino del préstamo"
 valor={
 datosComplementarios.destinoPrestamo ===
 "CAPITAL_TRABAJO"
 ? "Capital de trabajo"
 : "Uso personal"
 }
 />

 <Dato
 label="¿Para qué necesitas el préstamo?"
 valor={datosComplementarios.detalleDestinoPrestamo}
 />
 </SummarySection>

 <SummarySection
 titulo="Documentos"
 onEdit={() => editStep("carga-documentos")}
 >
 {documentosLista.map((documento) => (
 <Dato
 key={documento.label}
 label={documento.label}
 valor={
 documento.meta ? (
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
 onChange={(event) => {
 setConfirmo(event.target.checked);
 }}
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
 className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
 >
 <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.5} />
 Enviar solicitud
 </button>
 </div>
 </div>
 );
}
