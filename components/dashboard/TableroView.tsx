"use client";

import { useState } from "react";
import Link from "next/link";
import {
 ArrowRight,
 Bell,
 Check,
 QrCode,
 Upload,
 UploadCloud,
 X,
} from "lucide-react";


import {
 SOLICITUD,
 VISTAS_SOLICITUD,
 bs,
 type EstadoSolicitud,
  WHATSAPP_KIVO
} from "@/lib/kivo/datos";

const PLAN_PAGOS_MOCK = [
 {
 cuota: 1,
 mes: "Marzo 2026",
 vencimiento: "05 mar 2026",
 monto: 1842,
 estado: "pagado",
 },
 {
 cuota: 2,
 mes: "Abril 2026",
 vencimiento: "05 abr 2026",
 monto: 1842,
 estado: "pagado",
 },
 {
 cuota: 3,
 mes: "Mayo 2026",
 vencimiento: "05 may 2026",
 monto: 1842,
 estado: "pagado",
 },
 {
 cuota: 4,
 mes: "Junio 2026",
 vencimiento: "05 jun 2026",
 monto: 1842,
 estado: "pagado",
 },
 {
 cuota: 5,
 mes: "Julio 2026",
 vencimiento: "05 jul 2026",
 monto: 1888.5,
 estado: "mora",
 },
];

const PRESTAMO_ACTIVO_MOCK = {
 montoDesembolsado: 32500,
 saldoCapital: 30658,
 cuotaPendiente: 1842,
 capitalCuota: 1150,
 interesCuota: 642,
 otrosCargos: 50,
 cuotasPagadas: 1,
 fechaDesembolso: "15 ago 2026",
 proximoPago: "15 sep 2026",
};

type PasoDashboard =
 | "solicitud"
 | "asesor"
 | "evaluacion"
 | "firma"
 | "desembolso"
 | "entrega";

const PASOS: {
 id: PasoDashboard;
 titulo: string;
}[] = [
 {
 id: "solicitud",
 titulo: "Solicitud recibida",
 },
 {
 id: "asesor",
 titulo: "Asesor asignado",
 },
 {
 id: "evaluacion",
 titulo: "En evaluación",
 },
 {
 id: "firma",
 titulo: "Firma de contrato",
 },
 {
 id: "desembolso",
 titulo: "Desembolso",
 },
 {
 id: "entrega",
 titulo: "Entrega de contrato",
 },
];

export default function TableroView({
 estado,
 onCambiarEstado,
}: {
 estado: EstadoSolicitud;
 onCambiarEstado: (estado: EstadoSolicitud) => void;
}) {
 void onCambiarEstado;

 const vista = VISTAS_SOLICITUD[estado];

 const [novedadTab, setNovedadTab] = useState<
 "notificaciones" | "avisos" | "recordatorios"
 >("notificaciones");

 const pasosDashboardCompletados: PasoDashboard[] =
 estado === "aprobada"
 ? ["solicitud", "asesor", "evaluacion"]
 : ["solicitud", "asesor"];

 const pasoDashboardActual: PasoDashboard =
 estado === "aprobada" ? "firma" : "evaluacion";

 const [tipoUsuarioMock, setTipoUsuarioMock] = useState<
 "solicitado" | "activo"
 >("solicitado");

 const prestamoActivo = tipoUsuarioMock === "activo";


 const [pagoModalOpen, setPagoModalOpen] = useState(false);
 const [pagoRealizado, setPagoRealizado] = useState(false);

 const [requisitoModalOpen, setRequisitoModalOpen] = useState(true);
 const [cuotaVencidaModalOpen, setCuotaVencidaModalOpen] = useState(false);



 


 return (
 <>
 {/* SELECTOR MOCK DE USUARIO */}
 <div className="mb-5 flex flex-wrap items-center gap-2">
 <button
 type="button"
 onClick={() => {
 setTipoUsuarioMock("solicitado");
 setCuotaVencidaModalOpen(false);
 setRequisitoModalOpen(true);
}}
 className={`group inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-xs font-extrabold transition ${
 !prestamoActivo
 ? "bg-black text-white"
 : "bg-white text-black text-[#071A25] ring-1 ring-[#D7E3E9] hover:bg-black hover:text-white"
 }`}
 >
 <span
 className={`h-2 w-2 rounded-full ${
 !prestamoActivo
 ? "bg-white"
 : "bg-black group-hover:bg-white"
 }`}
 />
 Solicitado
 </button>

 <button
 type="button"
 onClick={() => {
 setTipoUsuarioMock("activo");
 setRequisitoModalOpen(false);
 setCuotaVencidaModalOpen(true);
}}
 className={`group inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-xs font-extrabold transition ${
 prestamoActivo
 ? "bg-[#FE9806] text-white"
 : "bg-white text-[#071A25] ring-1 ring-[#D7E3E9] hover:bg-[#FE9806] hover:text-white"
 }`}
 >
 <span
 className={`h-2 w-2 rounded-full ${
 prestamoActivo
 ? "bg-white"
 : "bg-[#FE9806] group-hover:bg-white"
 }`}
 />
 Préstamo activo
 </button>
 </div>
 {/* BLOQUE PRINCIPAL */}
 <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
 {/* PRÉSTAMO */}
 <section
 className={`relative min-h-[355px] overflow-hidden rounded-[30px] p-7 sm:p-8 ${
 prestamoActivo
 ? "bg-[#FE9806]"
 : "bg-black"
 }`}
 >
 <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20" />
 <div className="pointer-events-none absolute -bottom-40 right-20 h-80 w-80 rounded-full bg-white/10" />

 <div className="relative">
 {!prestamoActivo ? (
 <>
 <div className="flex flex-wrap items-start justify-between gap-5">
 <div>
 <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-white/65">
 Monto solicitado
 </p>

 <p className="mt-4 text-[46px] font-extrabold leading-none tracking-[-0.05em] text-white sm:text-[56px]">
 {bs(SOLICITUD.monto)}
 </p>

 <p className="mt-3 text-sm font-semibold text-white/65">
 Solicitud N.º {SOLICITUD.numero}
 </p>
 </div>

 <span className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-black">
 En revisión
 </span>
 </div>

 <div className="mt-8 grid max-w-[620px] grid-cols-2 gap-7 border-t border-white/15 pt-6 sm:grid-cols-3">
 <div>
 <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">
 Plazo
 </p>
 <p className="mt-1 text-[17px] font-extrabold text-white">
 {SOLICITUD.plazoMeses} meses
 </p>
 </div>

 <div>
 <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">
 Cuota estimada
 </p>
 <p className="mt-1 text-[17px] font-extrabold text-white">
 {bs(SOLICITUD.cuota)}
 </p>
 </div>

 <div>
 <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">
 Estado
 </p>
 <p className="mt-1 text-[17px] font-extrabold text-white">
 En revisión
 </p>
 </div>
 </div>

 <div className="mt-7">
 <Link
 href="/seguimiento"
 className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-white px-4 text-sm font-extrabold"
 style={{ color: "#000000" }}
 >
 <span style={{ color: "#000000" }}>
 Ver estado y seguimiento
 </span>
 <ArrowRight
 className="h-4 w-4"
 style={{ color: "#000000" }}
 />
 </Link>
 </div>
 </>
 ) : (
 <>
 <div className="flex flex-wrap items-start justify-between gap-5">
 <div>
 <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-white/65">
 Saldo capital
 </p>

 <p className="mt-4 text-[46px] font-extrabold leading-none tracking-[-0.05em] text-white sm:text-[56px]">
 {bs(PRESTAMO_ACTIVO_MOCK.saldoCapital)}
 </p>

 <p className="mt-3 text-sm font-semibold text-white/70">
 Préstamo activo · Solicitud N.º {SOLICITUD.numero}
 </p>
 </div>

 <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold text-white">
 Préstamo activo
 </span>
 </div>

 <div className="mt-8 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-2 xl:grid-cols-4">
 <div>
 <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">
 Monto desembolsado
 </p>
 <p className="mt-1 text-[17px] font-extrabold text-white">
 {bs(PRESTAMO_ACTIVO_MOCK.montoDesembolsado)}
 </p>
 </div>

 <div>
 <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">
 Fecha de desembolso
 </p>
 <p className="mt-1 text-[17px] font-extrabold text-white">
 {PRESTAMO_ACTIVO_MOCK.fechaDesembolso}
 </p>
 </div>

 <div>
 <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">
 Próximo vencimiento
 </p>
 <p className="mt-1 text-[17px] font-extrabold text-white">
 {PRESTAMO_ACTIVO_MOCK.proximoPago}
 </p>
 </div>

 <div>
 <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">
 Cuota pendiente
 </p>
 <p className="mt-1 text-[17px] font-extrabold text-white">
 {bs(PRESTAMO_ACTIVO_MOCK.cuotaPendiente)}
 </p>
 </div>
 </div>

 <div className="mt-7 flex flex-wrap items-center gap-5">
 <button
 type="button"
 onClick={() => {
 setPagoRealizado(false);
 setPagoModalOpen(true);
 }}
 className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-black"
 >
 Pagar ahora
 <ArrowRight className="h-4 w-4" />
 </button>

 <Link
 href="/cuotas"
 className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-extrabold text-white"
 >
 Plan de pagos
 <ArrowRight className="h-4 w-4" />
 </Link>
 </div>
 </>
 )}
 </div>
 </section>

 {/* CENTRO DE NOVEDADES */}
 <section className="flex min-h-[390px] flex-col overflow-hidden rounded-[30px] border border-[#E5EEF3] bg-white">

 <div className="border-b border-[#EDF2F5] px-6 pt-5">
 <div className="flex gap-6 overflow-x-auto">

 <button
 type="button"
 onClick={() => setNovedadTab("notificaciones")}
 className={`relative whitespace-nowrap pb-3 text-[12px] font-extrabold transition-colors ${
 novedadTab === "notificaciones"
 ? "text-black"
 : "text-[#8192A0] hover:text-black"
 }`}
 >
 Notificaciones
 {novedadTab === "notificaciones" ? (
 <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#03AEFE]" />
 ) : null}
 </button>

 <button
 type="button"
 onClick={() => setNovedadTab("avisos")}
 className={`relative whitespace-nowrap pb-3 text-[12px] font-extrabold transition-colors ${
 novedadTab === "avisos"
 ? "text-black"
 : "text-[#8192A0] hover:text-black"
 }`}
 >
 Avisos
 {novedadTab === "avisos" ? (
 <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#03AEFE]" />
 ) : null}
 </button>

 <button
 type="button"
 onClick={() => setNovedadTab("recordatorios")}
 className={`relative whitespace-nowrap pb-3 text-[12px] font-extrabold transition-colors ${
 novedadTab === "recordatorios"
 ? "text-black"
 : "text-[#8192A0] hover:text-black"
 }`}
 >
 Recordatorios
 {novedadTab === "recordatorios" ? (
 <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#03AEFE]" />
 ) : null}
 </button>

 </div>
 </div>

 {novedadTab === "notificaciones" ? (
 <div className="flex flex-1 flex-col p-6 sm:p-7">
 <div className="flex items-start justify-between gap-4">
 <div>
 <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#03AEFE]">
 Última notificación
 </p>

 <h2 className="mt-3 max-w-[330px] text-[25px] font-extrabold leading-[1.18] tracking-tight text-[#071A25]">
 Tu préstamo fue desembolsado
 </h2>
 </div>

 <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#E7F9FE] text-[#03AEFE]">
 <Bell className="h-5 w-5" />
 </span>
 </div>

 <p className="mt-4 max-w-[390px] text-sm leading-6 text-[#6B7484]">
 Ya tienes disponible{" "}
 <span className="font-extrabold text-[#071A25]">
 {bs(PRESTAMO_ACTIVO_MOCK.montoDesembolsado)}
 </span>
 . Revisa tu plan de pagos y la fecha de tu próxima cuota.
 </p>

 <div className="mt-auto flex flex-wrap items-center gap-4 pt-7">
 <Link
 href="/cuotas"
 className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[13px] bg-black px-5 text-sm font-extrabold text-white hover:bg-[#17181C]"
 >
 Ver mi préstamo
 <ArrowRight className="h-4 w-4" />
 </Link>

 <Link
 href="/notificaciones"
 className="inline-flex min-h-11 cursor-pointer items-center text-[12px] font-extrabold text-[#52697B]"
 >
 Ver todas
 </Link>
 </div>
 </div>
 ) : null}

 {novedadTab === "avisos" ? (
 <div className="relative flex flex-1 overflow-hidden p-6 sm:p-7">

 <div
 aria-hidden="true"
 className="pointer-events-none absolute -bottom-[50px] -right-[45px] hidden h-[270px] w-[270px] rounded-full bg-[#DDF6FD] sm:block"
 />

 <img
 src="/estado-kivo.png"
 alt=""
 className="pointer-events-none absolute bottom-0 right-0 hidden h-[230px] w-[250px] object-contain object-bottom sm:block"
 />

 <div className="relative z-10 flex max-w-[280px] flex-col">
 <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#FE9806]">
 Aviso Kivo
 </p>

 <h2 className="mt-3 text-[25px] font-extrabold leading-[1.18] tracking-tight text-[#071A25]">
 Mantén tus cuotas al día
 </h2>

 <p className="mt-4 text-sm leading-6 text-[#6B7484]">
 Consulta tus vencimientos y realiza tus pagos desde Kivo de forma rápida y segura.
 </p>

 <div className="mt-auto pt-7">
 <Link
 href="/cuotas"
 className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[13px] bg-black px-5 text-sm font-extrabold text-white hover:bg-[#17181C]"
 >
 Ver cuotas y pagos
 <ArrowRight className="h-4 w-4" />
 </Link>
 </div>
 </div>
 </div>
 ) : null}

 {novedadTab === "recordatorios" ? (
 <div className="flex flex-1 flex-col p-6 sm:p-7">

 <div className="flex items-start justify-between gap-4">
 <div>
 <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#FE9806]">
 Próximo pago
 </p>

 <h2 className="mt-3 text-[25px] font-extrabold leading-[1.18] tracking-tight text-[#071A25]">
 No olvides tu próxima cuota
 </h2>
 </div>

 <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#FFF3E5] text-[#FE9806]">
 <Bell className="h-5 w-5" />
 </span>
 </div>

 <div className="mt-5 rounded-[18px] bg-[#F7FAFC] px-4 py-4">
 <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8192A0]">
 Próximo vencimiento
 </p>

 <div className="mt-2 flex items-end justify-between gap-4">
 <div>
 <p className="text-[20px] font-extrabold text-[#071A25]">
 {PRESTAMO_ACTIVO_MOCK.proximoPago}
 </p>

 <p className="mt-1 text-[12px] font-medium text-[#6B7484]">
 Cuota pendiente
 </p>
 </div>

 <p className="text-[20px] font-extrabold text-[#071A25]">
 {bs(PRESTAMO_ACTIVO_MOCK.cuotaPendiente)}
 </p>
 </div>
 </div>

 <div className="mt-auto pt-6">
 <Link
 href="/cuotas"
 className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[13px] bg-black px-5 text-sm font-extrabold text-white hover:bg-[#17181C]"
 >
 Revisar mis cuotas
 <ArrowRight className="h-4 w-4" />
 </Link>
 </div>
 </div>
 ) : null}

 </section>
 </div>

 {/* CONTEXTO SEGÚN USUARIO */}
 {!prestamoActivo ? (
 <>
 <section className="mt-5 rounded-[30px] border border-[#E5EEF3] bg-white p-7 sm:p-8">
 <div className="flex flex-wrap items-start justify-between gap-5">
 <div className="max-w-[720px]">
 <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
 Estado y seguimiento
 </p>

 <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-ink">
 Tu solicitud está en evaluación
 </h2>

 <p className="mt-2 max-w-[660px] text-sm leading-6 text-muted">
 Estamos revisando tu información y documentación. Si necesitamos
 algo adicional, te lo notificaremos por aquí y por WhatsApp.
 </p>
 </div>

 <Link
 href="/seguimiento"
 className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-primary-dark"
 >
 Ver detalle
 <ArrowRight className="h-4 w-4" />
 </Link>
 </div>

 <div className="mt-9">
 <ol className="relative mx-auto grid w-full grid-cols-6 items-start">
 <div
 aria-hidden="true"
 className="absolute left-[8.33%] right-[8.33%] top-[19px] h-[3px] rounded-full bg-border"
 />

 <div
 aria-hidden="true"
 className="absolute left-[8.33%] top-[19px] h-[3px] w-[83.34%] origin-left rounded-full bg-sky"
 style={{
 transform: `scaleX(${
 PASOS.findIndex(
 (paso) => paso.id === pasoDashboardActual,
 ) /
 (PASOS.length - 1)
 })`,
 }}
 />

 {PASOS.map((paso, index) => {
 const completado =
 pasosDashboardCompletados.includes(paso.id);
 const actual = pasoDashboardActual === paso.id;

 return (
 <li
 key={paso.id}
 className="relative z-10 flex flex-col items-center gap-2"
 aria-current={actual ? "step" : undefined}
 >
 {completado ? (
 <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky bg-ink text-white">
 <Check
 className="h-5 w-5"
 strokeWidth={2.5}
 />
 </span>
 ) : actual ? (
 <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky bg-ink text-sm font-bold text-white">
 {index + 1}
 </span>
 ) : (
 <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-border bg-white text-sm font-bold text-placeholder">
 {index + 1}
 </span>
 )}

 <span
 className={`max-w-[120px] text-center text-[12px] font-bold leading-tight ${
 actual || completado
 ? "text-ink-soft"
 : "text-placeholder"
 }`}
 >
 {paso.titulo}
 </span>

 <span className="text-center text-[11px] text-muted">
 {completado
 ? "Completado"
 : actual
 ? "Actual"
 : "Pendiente"}
 </span>
 </li>
 );
 })}
 </ol>
 </div>



 </section>

 <div className="mt-4 flex justify-end">
 <a
 href={WHATSAPP_KIVO}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-black px-5 text-sm font-extrabold text-white"
 >
 Atención al cliente
 </a>
 </div>
 </>
 ) : (
 <section className="mt-5 rounded-[30px] border border-[#E5EEF3] bg-white p-7 sm:p-8">
 <div className="flex flex-col gap-6">
 {/* PLAN DE PAGOS */}
 <section className="overflow-hidden rounded-[28px] bg-white">
 <div className="flex flex-col gap-5 bg-[#FE9806] px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">
 Plan de pagos
 </p>

 <h3 className="mt-2 text-[24px] font-extrabold tracking-[-0.03em] text-white">
 Tus próximas cuotas
 </h3>

 <p className="mt-1 max-w-[480px] text-sm leading-6 text-white/80">
 Consulta tus vencimientos y realiza tus pagos desde Kivo.
 </p>
 </div>

 <Link
 href="/cuotas"
 className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[14px] bg-black px-5 text-sm font-extrabold text-white transition hover:bg-[#1A1A1A]"
 >
 Cuotas y pagos
 <ArrowRight className="h-4 w-4" />
 </Link>
 </div>

 <div className="px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
 <div className="divide-y divide-[#EDF2F5]">
 {PLAN_PAGOS_MOCK.map((pago) => {
 const pagado = pago.estado === "pagado";
 const proximo = pago.estado === "proximo";
 const mora = pago.estado === "mora";
 const destacado = proximo || mora;

 return (
 <div
 key={pago.cuota}
 className={`flex flex-col gap-4 py-4 sm:flex-row sm:items-center ${
 destacado
 ? "my-2 rounded-[20px] bg-[#FE9806] px-4 text-white"
 : ""
 }`}
 >
 <div className="flex min-w-0 flex-1 items-center gap-4">
 <span
 className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
 destacado
 ? "bg-white text-[#FE9806]"
 : pagado
 ? "bg-[#DDF6FD] text-[#075578]"
 : "bg-[#F2F5F7] text-[#64808D]"
 }`}
 >
 {pagado ? (
 <Check
 className="h-4 w-4"
 strokeWidth={3}
 />
 ) : (
 pago.cuota
 )}
 </span>

 <div className="min-w-0">
 <p
 className={`truncate text-sm font-extrabold ${
 destacado
 ? "text-white"
 : "text-[#071A25]"
 }`}
 >
 {pago.mes}
 </p>

 <p
 className={`mt-0.5 text-xs ${
 destacado
 ? "text-white/75"
 : "text-[#7A8B96]"
 }`}
 >
 Vence {pago.vencimiento}
 </p>
 </div>
 </div>

 <div className="flex flex-wrap items-center justify-between gap-3 sm:min-w-[330px] sm:justify-end">
 <p
 className={`text-sm font-extrabold ${
 destacado
 ? "text-white"
 : "text-[#071A25]"
 }`}
 >
 {mora ? "Bs 1.888,50" : bs(pago.monto)}
 </p>

 {pagado ? (
 <span className="rounded-full bg-[#DDF6FD] px-3 py-1.5 text-[10px] font-extrabold text-[#075578]">
 Pagado
 </span>
 ) : mora ? (
 <>
 <span className="rounded-full bg-white/20 px-3 py-1.5 text-[10px] font-extrabold text-white">
 En mora
 </span>

 <button
 type="button"
 onClick={() => {
 setPagoRealizado(false);
 setPagoModalOpen(true);
 }}
 className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-black px-4 text-xs font-extrabold text-white"
 >
 <QrCode className="h-4 w-4" />
 Pagar mi cuota con QR
 </button>
 </>
 ) : proximo ? (
 <>
 <span className="rounded-full bg-white/20 px-3 py-1.5 text-[10px] font-extrabold text-white">
 Próximo pago
 </span>

 <button
 type="button"
 onClick={() => {
 setPagoRealizado(false);
 setPagoModalOpen(true);
 }}
 className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-black px-4 text-xs font-extrabold text-white"
 >
 <QrCode className="h-4 w-4" />
 Pagar mi cuota con QR
 </button>
 </>
 ) : (
 <span className="rounded-full bg-[#F2F5F7] px-3 py-1.5 text-[10px] font-extrabold text-[#64808D]">
 Pendiente
 </span>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </section>

 {/* ASESOR Y CONTACTO */}
 <div className="flex flex-col gap-4 border-t border-[#EDF2F5] pt-6 sm:flex-row sm:items-center sm:justify-between">
 <div className="flex items-center gap-4">
 <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#DDF6FD] text-sm font-extrabold text-[#0B5F83]">
 MF
 </div>

 <div>
 <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#64808D]">
 Asesor asignado
 </p>

 <p className="mt-1 text-sm font-extrabold text-[#071A25]">
 María Fernández
 </p>

 <p className="mt-0.5 text-xs text-[#6B7484]">
 Asesora de préstamos
 </p>
 </div>
 </div>

 <div className="flex flex-wrap items-center gap-3">
 <a
 href={WHATSAPP_KIVO}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-black px-4 text-sm font-extrabold text-white"
 >
 Mensaje a mi asesor
 <ArrowRight className="h-4 w-4" />
 </a>

 <a
 href={WHATSAPP_KIVO}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#C8E7F1] bg-white px-4 text-sm font-extrabold text-[#071A25]"
 >
 Atención al cliente
 </a>
 </div>
 </div>
 </div>
 </section>
 )}

 {/* CUOTA VENCIDA - MOCK */}
 {cuotaVencidaModalOpen && prestamoActivo && (
 <div
 className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
 role="dialog"
 aria-modal="true"
 aria-labelledby="cuota-vencida-title"
 >
 <div className="w-full max-w-[560px] overflow-hidden rounded-[30px] bg-white">

 {/* CABECERA */}
 <div className="relative bg-[#FFF8EF] px-7 pb-6 pt-8 sm:px-8">
 {/* SOLO PARA EL MOCK */}
 <button
 type="button"
 onClick={() => setCuotaVencidaModalOpen(false)}
 className="absolute right-5 top-5 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white text-[#071A25] transition hover:bg-black hover:text-white"
 aria-label="Cerrar popup de prueba"
 >
 <X className="h-4 w-4" />
 </button>

 <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-[#FE9806] text-white">
 <Bell className="h-5 w-5" />
 </div>

 <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#E08600]">
 Atención
 </p>

 <h2
 id="cuota-vencida-title"
 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#071A25]"
 >
 Tienes una cuota vencida
 </h2>

 <p className="mt-3 text-sm leading-6 text-[#5F7180]">
 Tu cuota tiene <strong className="text-[#071A25]">8 días de atraso</strong>.
 Si realizas el pago hasta el{" "}
 <strong className="text-[#071A25]">23/05/2026</strong>,
 no se aplicará recargo ni mora.
 </p>

 <p className="mt-2 text-sm leading-6 text-[#5F7180]">
 Actualmente, el monto incluye únicamente los intereses
 corrientes generados durante los días de atraso.
 </p>
 </div>

 <div className="px-7 pb-7 pt-5 sm:px-8">

 {/* INFORMACIÓN IMPORTANTE */}
 <div className="flex items-start gap-3 rounded-[18px] bg-[#FFF4DB] px-4 py-4">
 <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FE9806] text-xs font-extrabold text-white">
 i
 </div>

 <p className="text-xs leading-5 text-[#66522F]">
 En tu siguiente pago pagarás menos, porque en esta cuota
 ya se incluyen los intereses corrientes correspondientes
 a estos 8 días.
 </p>
 </div>

 {/* DETALLE */}
 <div className="mt-6">
 <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#E08600]">
 Detalle de la cuota vencida
 </p>

 <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
 <div>
 <p className="text-xs font-semibold text-[#7A8B96]">
 Cuota vencida
 </p>
 <p className="mt-1 text-sm font-extrabold text-[#071A25]">
 5 de 24
 </p>
 </div>

 <div>
 <p className="text-xs font-semibold text-[#7A8B96]">
 Días de atraso
 </p>
 <p className="mt-1 text-sm font-extrabold text-[#071A25]">
 8 días
 </p>
 </div>

 <div>
 <p className="text-xs font-semibold text-[#7A8B96]">
 Fecha de vencimiento
 </p>
 <p className="mt-1 text-sm font-extrabold text-[#071A25]">
 15/05/2026
 </p>
 </div>

 <div>
 <p className="text-xs font-semibold text-[#7A8B96]">
 Intereses corrientes (8 días)
 </p>
 <p className="mt-1 text-sm font-extrabold text-[#071A25]">
 Bs 108
 </p>
 </div>

 <div>
 <p className="text-xs font-semibold text-[#7A8B96]">
 Monto de la cuota
 </p>
 <p className="mt-1 text-sm font-extrabold text-[#071A25]">
 Bs 1.842
 </p>
 </div>

 <div className="rounded-[18px] bg-[#FFF4E5] px-4 py-3">
 <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#E08600]">
 Total a pagar hoy
 </p>

 <p className="mt-1 text-[26px] font-extrabold tracking-[-0.04em] text-[#FE6800]">
 Bs 1.950
 </p>
 </div>
 </div>
 </div>

 {/* FECHA LÍMITE */}
 <div className="mt-6 rounded-[18px] bg-[#F7FAFC] px-4 py-4">
 <p className="text-sm font-extrabold text-[#071A25]">
 Paga hasta el 23/05/2026 y evita recargos.
 </p>

 <p className="mt-1 text-xs leading-5 text-[#6B7484]">
 Después de esa fecha podrían aplicarse mora y cargos adicionales.
 </p>
 </div>

 {/* ACCIONES */}
 <div className="mt-6 flex flex-col gap-3 sm:flex-row">
 <a
 href={WHATSAPP_KIVO}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-xl bg-[#EDF7FB] px-5 text-sm font-extrabold text-[#075578]"
 >
 Hablar con mi asesor
 </a>

 <button
 type="button"
 onClick={() => {
 setCuotaVencidaModalOpen(false);
 setPagoRealizado(false);
 setPagoModalOpen(true);
 }}
 className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-extrabold text-white"
 >
 <QrCode className="h-4 w-4" />
 Pagar ahora
 <ArrowRight className="h-4 w-4" />
 </button>
 </div>

 </div>
 </div>
 </div>
 )}

 {/* REQUERIMIENTO DE DOCUMENTACIÓN */}
 {requisitoModalOpen && !prestamoActivo && (
 <div
 className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4"
 role="dialog"
 aria-modal="true"
 aria-labelledby="requisito-boletas-title"
 >
 <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] bg-white">
 <div className="relative bg-[#DDF6FD] px-7 pb-7 pt-8 sm:px-8">
 {/* SOLO PARA EL MOCK */}
 <button
 type="button"
 onClick={() => setRequisitoModalOpen(false)}
 className="absolute right-5 top-5 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white text-[#071A25] transition hover:bg-black hover:text-white"
 aria-label="Cerrar popup de prueba"
 >
 <X className="h-4 w-4" />
 </button>


 <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-black text-white">
 <UploadCloud className="h-5 w-5" />
 </div>

 <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#03AEFE]">
 Estado de tu solicitud
 </p>

 <h2
 id="requisito-boletas-title"
 className="mt-2 max-w-[390px] text-[26px] font-extrabold leading-[1.12] tracking-[-0.035em] text-[#071A25]"
 >
 Necesitamos tus boletas de pago
 </h2>

 <p className="mt-3 max-w-[430px] text-sm leading-6 text-[#5F7180]">
 Para continuar con la evaluación de tu solicitud,
 necesitamos que subas tus boletas de pago.
 </p>
 </div>

 <div className="px-7 py-6 sm:px-8">
 <div className="flex items-start gap-3 rounded-[18px] bg-[#F7FAFC] p-4">
 <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FE9806] text-[11px] font-extrabold text-white">
 !
 </div>

 <div>
 <p className="text-sm font-extrabold text-[#071A25]">
 Información pendiente
 </p>

 <p className="mt-1 text-xs leading-5 text-[#6B7484]">
 Tu solicitud seguirá en revisión mientras
 completamos esta documentación.
 </p>
 </div>
 </div>

 <div className="mt-6 flex flex-col gap-3">
 <Link
 href="/documentos"
 className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-extrabold text-white"
 >
 Subir boletas de pago
 <ArrowRight className="h-4 w-4" />
 </Link>

 <a
 href={WHATSAPP_KIVO}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#DDF6FD] px-5 text-sm font-extrabold text-[#075578]"
 >
 Hablar con mi asesor
 <ArrowRight className="h-4 w-4" />
 </a>
 </div>

 <p className="mt-4 text-center text-[11px] leading-5 text-[#7A8B96]">
 Debes completar este requisito para continuar con la evaluación de tu solicitud.
 </p>
 </div>
 </div>
 </div>
 )}

 {pagoModalOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4">
 <div className="relative w-full max-w-[430px] rounded-[28px] bg-white p-6 sm:p-7">
 <button
 type="button"
 onClick={() => setPagoModalOpen(false)}
 className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-[#F2F5F7] text-[#071A25] cursor-pointer"
 aria-label="Cerrar"
 >
 <X className="h-5 w-5" />
 </button>

 {!pagoRealizado ? (
 <>
 <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#03AEFE]">
 Próximo pago
 </p>

 <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.03em] text-[#071A25]">
 {bs(SOLICITUD.cuota)}
 </h2>

 <p className="mt-1 text-sm font-semibold text-[#6B7484]">
 Vence el {PRESTAMO_ACTIVO_MOCK.proximoPago}
 </p>

 <div className="mx-auto mt-7 flex h-[210px] w-[210px] items-center justify-center rounded-[24px] border border-[#E4EBEF] bg-white">
 <QrCode
 className="h-[165px] w-[165px] text-black"
 strokeWidth={1.6}
 />
 </div>

 <p className="mx-auto mt-5 max-w-[310px] text-center text-sm leading-6 text-[#6B7484]">
 Escanea el QR desde tu aplicación bancaria para realizar el pago.
 </p>

 <button
 type="button"
 onClick={() => setPagoRealizado(true)}
 className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-5 text-sm font-extrabold text-white cursor-pointer"
 >
 Ya realicé el pago
 </button>
 </>
 ) : (
 <>
 <div className="grid h-14 w-14 place-items-center rounded-full bg-[#DDF6FD] text-[#03AEFE]">
 <Upload className="h-6 w-6" />
 </div>

 <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.12em] text-[#03AEFE]">
 Comprobante de pago
 </p>

 <h2 className="mt-2 text-[27px] font-extrabold leading-tight tracking-[-0.03em] text-[#071A25]">
 Sube tu comprobante
 </h2>

 <p className="mt-3 text-sm leading-6 text-[#6B7484]">
 Si ya realizaste el pago por QR, adjunta el comprobante para que Kivo pueda validarlo.
 </p>

 <label className="mt-6 flex min-h-[125px] cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-[#BFD5DF] bg-[#F8FBFC] px-5 text-center">
 <UploadCloud className="h-6 w-6 text-[#03AEFE]" />

 <span className="mt-3 text-sm font-extrabold text-[#071A25]">
 Subir comprobante
 </span>

 <span className="mt-1 text-xs text-[#6B7484]">
 JPG, PNG o PDF
 </span>

 <input
 type="file"
 accept=".jpg,.jpeg,.png,.pdf"
 className="hidden"
 />
 </label>

 <button
 type="button"
 onClick={() => setPagoModalOpen(false)}
 className="mt-4 min-h-12 w-full rounded-xl bg-black px-5 text-sm font-extrabold text-white cursor-pointer"
 >
 Cerrar
 </button>
 </>
 )}
 </div>
 </div>
 )}

 </>
 );
}
