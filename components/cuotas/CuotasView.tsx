"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "motion/react";
import {
 AlertTriangle,
 Bell,
 CalendarClock,
 CalendarX,
 Check,
 CheckCircle2,
 Clock4,
 FileCheck2,
 ImageUp,
 Landmark,
 MessageCircle,
 QrCode,
 Receipt,
 ShieldCheck,
 Store,
 TrendingUp,
 type LucideIcon,
} from "lucide-react";

import HeroKivoImage from "@/components/ui/HeroKivoImage";

import {
 CREDITO,
 CUOTAS_INICIALES,
 ETIQUETA_CUOTA,
 WHATSAPP_KIVO,
 bs,
 resolverEstadoCuota,
 totalCuota,
 type Cuota,
} from "@/lib/kivo/datos";

type Filtro = "todas" | "pendientes" | "pagadas";
type MetodoPago = "qr" | "transferencia" | "oficina";
type PasoPago = "pagar" | "avisar";

/* ═════════ QR de demostración ═════════
 En producción, la imagen viene del proveedor de QR Simple del banco. */
function QrDemo({ semilla, tamano = 176 }: { semilla: number; tamano?: number }) {
 const modulos = useMemo(() => {
 const N = 25;
 const celda = tamano / N;
 const pseudoAleatorio = (indice: number) => {
 const valor = Math.sin(semilla * 9301 + indice * 49297) * 10000;
 return valor - Math.floor(valor);
 };

 const enFinder = (c: number, r: number) =>
 (c < 8 && r < 8) || (c > N - 9 && r < 8) || (c < 8 && r > N - 9);

 const puntos: { x: number; y: number }[] = [];
 for (let r = 0; r < N; r++) {
 for (let c = 0; c < N; c++) {
 if (enFinder(c, r)) continue;
 const indice = r * N + c;
 if (pseudoAleatorio(indice) > 0.53) {
 puntos.push({ x: c * celda, y: r * celda });
 }
 }
 }
 return { puntos, celda, N };
 }, [semilla, tamano]);

 const { puntos, celda, N } = modulos;

 const finder = (x: number, y: number) => (
 <g key={`f-${x}-${y}`}>
 <rect x={x * celda} y={y * celda} width={7 * celda} height={7 * celda} rx={celda * 1.6} fill="#111A28" />
 <rect x={(x + 1) * celda} y={(y + 1) * celda} width={5 * celda} height={5 * celda} rx={celda} fill="#fff" />
 <rect
 x={(x + 2) * celda}
 y={(y + 2) * celda}
 width={3 * celda}
 height={3 * celda}
 rx={celda * 0.6}
 fill="#111A28"
 />
 </g>
 );

 return (
 <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`}>
 {puntos.map((p, i) => (
 <rect key={i} x={p.x} y={p.y} width={celda} height={celda} rx={celda * 0.28} fill="#111A28" />
 ))}
 {finder(0, 0)}
 {finder(N - 7, 0)}
 {finder(0, N - 7)}
 <rect x={tamano / 2 - 19} y={tamano / 2 - 19} width={38} height={38} rx={12} fill="#fff" />
 <rect x={tamano / 2 - 13} y={tamano / 2 - 13} width={26} height={26} rx={8} fill="#03AEFE" />
 </svg>
 );
}

/* ═════════ Vista ═════════ */

export default function CuotasView() {
 const [cuotas, setCuotas] = useState<Cuota[]>(CUOTAS_INICIALES);
 const [filtro, setFiltro] = useState<Filtro>("todas");
 const [enPago, setEnPago] = useState<Cuota | null>(null);
 const [paso, setPaso] = useState<PasoPago>("pagar");
 const [metodo, setMetodo] = useState<MetodoPago>("qr");
 const [comprobante, setComprobante] = useState(false);
 const [aviso, setAviso] = useState<string | null>(null);

 useEffect(() => {
 if (!aviso) return;
 const t = setTimeout(() => setAviso(null), 3800);
 return () => clearTimeout(t);
 }, [aviso]);

 const pagadas = cuotas.filter(
 (c) => resolverEstadoCuota(c) === "pagada",
 ).length;
 const vencidas = cuotas.filter(
 (c) => resolverEstadoCuota(c) === "vencido",
 ).length;
 const enMora = cuotas.filter(
 (c) => resolverEstadoCuota(c) === "mora",
 ).length;
 const enRevision = cuotas.filter(
 (c) => resolverEstadoCuota(c) === "revision",
 ).length;

 const foco =
 cuotas.find((c) => resolverEstadoCuota(c) === "vencido") ??
 cuotas.find((c) => resolverEstadoCuota(c) === "mora") ??
 cuotas.find((c) => resolverEstadoCuota(c) === "revision") ??
 cuotas.find((c) => resolverEstadoCuota(c) === "pronto") ??
 cuotas.find((c) => resolverEstadoCuota(c) === "pendiente");

 const lista = cuotas.filter((c) => {
 const estado = resolverEstadoCuota(c);

 if (filtro === "todas") return true;
 if (filtro === "pagadas") return estado === "pagada";
 return estado !== "pagada";
 });

 function abrirPago(cuota: Cuota) {
 setEnPago(cuota);
 setPaso("pagar");
 setMetodo("qr");
 setComprobante(false);
 }

 function enviarAviso() {
 if (!enPago) return;
 setCuotas((prev) =>
 prev.map((c) =>
 c.numero === enPago.numero ? { ...c, estado: "revision", diasAtraso: undefined, diasRestantes: undefined } : c,
 ),
 );
 setEnPago(null);
 setAviso("Registramos tu aviso. Kivo Office lo confirma en máximo 2 horas.");
 }

 /** Lo dispara Kivo Office al conciliar el pago. Aquí es un botón de prueba. */
 function confirmarPago(numero: number) {
 setCuotas((prev) =>
 prev.map((c) =>
 c.numero === numero
 ? { ...c, estado: "pagada", pagadaEl: "27 jul", metodo: "QR Simple", mora: undefined }
 : c,
 ),
 );
 confetti({
 particleCount: 120,
 spread: 78,
 origin: { y: 0.62 },
 colors: ["#03AEFE", "#FE9806", "#5FDAF8", "#1B5BB6"],
 });
 setTimeout(
 () =>
 confetti({
 particleCount: 60,
 spread: 100,
 scalar: 0.85,
 origin: { y: 0.55 },
 colors: ["#03AEFE", "#FE9806", "#5FDAF8", "#1B5BB6"],
 }),
 220,
 );
 setAviso(`¡Pago confirmado! Cuota ${numero} al día.`);
 }

 /* ── Tarjeta destacada ── */
 const destacada = (() => {
 if (!foco) return null;

 const config: Record<
 Cuota["estado"],
 {
 marco: string;
 color: string;
 icono: LucideIcon;
 antetitulo: string;
 texto: string;
 chips: { icono: LucideIcon; texto: string }[];
 }
 > = {
 vencido: {
 marco: "bg-[#FFF0EF] border-[#E55249]",
 color: "text-[#A42620]",
 icono: AlertTriangle,
 antetitulo: `Préstamo vencido · ${foco.diasAtraso} días`,
 texto:
 "Tu préstamo superó los 30 días de incumplimiento. Desde el día 31, el capital restante pasa a estado vencido. Comunícate con Kivo para regularizarlo.",
 chips: [
 {
 icono: CalendarX,
 texto: `${foco.diasAtraso} días de incumplimiento`,
 },
 {
 icono: TrendingUp,
 texto: `Capital vencido: ${bs(CREDITO.saldoCapitalRestante)}`,
 },
 ],
 },
 mora: {
 marco: "bg-[#FFEFEE] border-[#FBD5D1]",
 color: "text-[#F0736A]",
 icono: AlertTriangle,
 antetitulo: `Cuota ${foco.numero} · en mora`,
 texto: `Se venció el ${foco.vence}. Cada día suma ${bs(CREDITO.moraDiaria)} de mora — págala hoy y tu préstamo vuelve a estar al día.`,
 chips: [
 { icono: CalendarX, texto: `${foco.diasAtraso} días en mora` },
 { icono: TrendingUp, texto: `Mora acumulada: ${bs(foco.mora ?? 0)}` },
 ],
 },
 pronto: {
 marco: "bg-[#FFF5E4] border-[#FCE3B8]",
 color: "text-[#F0A429]",
 icono: CalendarClock,
 antetitulo: `Cuota ${foco.numero} · próxima`,
 texto: `Vence el ${foco.vence}. Puedes pagarla desde ahora y evitar recargos.`,
 chips: [
 { icono: Clock4, texto: `Faltan ${foco.diasRestantes} días` },
 { icono: Bell, texto: "Te avisamos 3 días antes" },
 ],
 },
 revision: {
 marco: "bg-[#EAF7FE] border-[#D2EEFB]",
 color: "text-primary",
 icono: Clock4,
 antetitulo: `Cuota ${foco.numero} · en revisión`,
 texto:
 "Recibimos tu aviso de pago. Kivo Office lo confirma en máximo 2 horas hábiles y no se genera mora nueva mientras tanto.",
 chips: [
 { icono: FileCheck2, texto: "Comprobante recibido" },
 { icono: ShieldCheck, texto: "Mora congelada" },
 ],
 },
 pendiente: {
 marco: "bg-[#EAF8F0] border-[#C7EBD7]",
 color: "text-[#2FBF71]",
 icono: CheckCircle2,
 antetitulo: "Estás al día",
 texto: `Tu siguiente cuota vence el ${foco.vence}. No tienes nada pendiente por ahora.`,
 chips: [{ icono: Bell, texto: "Te avisamos 3 días antes" }],
 },
 pagada: {
 marco: "bg-[#EAF8F0] border-[#C7EBD7]",
 color: "text-[#2FBF71]",
 icono: CheckCircle2,
 antetitulo: "Estás al día",
 texto: "No tienes cuotas pendientes.",
 chips: [],
 },
 };

 const estado = resolverEstadoCuota(foco);
 return { foco, estado, ...config[estado] };
 })();

 return (
 <>
  {/* HERO CUOTAS Y PAGOS */}
  <section className="mb-4 overflow-hidden rounded-[26px] border border-[#E9F0F6] bg-white">
    <div className="relative overflow-hidden px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
      <HeroKivoImage />

      <div className="relative z-10 mt-8 max-w-[760px]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#FE9806]">
          Cuotas y pagos
        </p>

        <h1 className="mt-2 max-w-xl text-2xl font-extrabold tracking-tight text-ink sm:text-[30px] sm:leading-[1.15]">
          Mantén tus pagos al día desde Kivo
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#6A7F94]">
          Consulta tus cuotas, revisa tus vencimientos y realiza tus pagos de forma simple y segura.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10.5px] font-extrabold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5FDAF8]" />
          Préstamo {CREDITO.numero}
        </div>
      </div>
    </div>
  </section>

  <section className="overflow-hidden rounded-[26px] border border-[#E9F0F6] bg-white">
    {/* CABECERA */}
    <div className="bg-[#FE9806] px-4 py-4 sm:px-5 sm:py-5">
      <div className="grid gap-3 lg:grid-cols-[1.15fr_1fr]">

        {/* CARD CUOTA DESTACADA */}
        {destacada ? (
          <section
            className={`flex flex-col gap-4 rounded-[22px] border p-5 sm:flex-row sm:items-start ${
              destacada.estado === "mora" || destacada.estado === "vencido"
                ? "border-[#F6D2CE] bg-white"
                : destacada.estado === "pronto"
                  ? "border-[#FFE1B0] bg-[#FFF7E9]"
                  : destacada.estado === "revision"
                    ? "border-[#BEEFFF] bg-[#EAF7FE]"
                    : "border-[#D9EDE2] bg-[#F4FBF7]"
            }`}
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white">
              <destacada.icono
                className={`h-5 w-5 ${destacada.color}`}
                strokeWidth={1.9}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#7A8DA0]">
                {destacada.antetitulo}
              </p>

              <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
                <h2 className="text-[24px] font-extrabold leading-none tracking-tight text-ink">
                  {bs(totalCuota(destacada.foco))}
                </h2>

                <span className="text-[11.5px] font-bold text-[#6A7F94]">
                  vence {destacada.foco.vence}
                </span>
              </div>

              <p className="mt-2 max-w-[52ch] text-[12px] leading-5 text-[#5F7284]">
                {destacada.texto}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {destacada.chips.map((chip) => (
                  <span
                    key={chip.texto}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-2.5 py-1 text-[10.5px] font-bold text-[#53697D]"
                  >
                    <chip.icono className="h-3 w-3" strokeWidth={2.2} />
                    {chip.texto}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:min-w-[130px]">
              {destacada.estado === "revision" ? (
                <button
                  type="button"
                  onClick={() => confirmarPago(destacada.foco.numero)}
                  className="rounded-[12px] bg-black px-4 py-2.5 text-[11px] font-extrabold text-white"
                >
                  Confirmar pago
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => abrirPago(destacada.foco)}
                  className={`rounded-[12px] px-4 py-2.5 text-[11px] font-extrabold text-white ${
                    destacada.estado === "mora" ||
                    destacada.estado === "vencido"
                      ? "bg-[#FE9806]"
                      : "bg-black"
                  }`}
                >
                  {destacada.estado === "pendiente"
                    ? "Adelantar cuota"
                    : destacada.estado === "vencido"
                      ? "Regularizar préstamo"
                      : "Pagar ahora"}
                </button>
              )}

              {(destacada.estado === "mora" ||
                destacada.estado === "vencido") && (
                <a
                  href={WHATSAPP_KIVO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#DCE7F0] bg-white px-4 py-2.5 text-[11px] font-extrabold text-[#43596F]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Hablar con Kivo
                </a>
              )}
            </div>
          </section>
        ) : null}

        {/* CARD RESUMEN PRÉSTAMO */}
        <section className="rounded-[22px] border border-[#E9F0F6] bg-white p-5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-[12px] font-extrabold text-ink">
              Préstamo {CREDITO.numero}
            </p>

            <span className="text-[10px] font-bold text-[#7A8DA0]">
              Cuota {pagadas} de {CREDITO.totalCuotas} pagadas
            </span>
          </div>

          <div className="mt-3 flex h-[5px] overflow-hidden rounded-full bg-[#EEF3F6]">
            <span
              className="h-full bg-[#03AEFE]"
              style={{
                width: `${(pagadas / CREDITO.totalCuotas) * 100}%`,
              }}
            />

            <span
              className="h-full bg-[#8F1D18]"
              style={{
                width: `${(vencidas / CREDITO.totalCuotas) * 100}%`,
              }}
            />

            <span
              className="h-full bg-[#F0736A]"
              style={{
                width: `${(enMora / CREDITO.totalCuotas) * 100}%`,
              }}
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9.5px] font-bold text-[#7A8DA0]">
            <span className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-[#03AEFE]" />
              Pagado
            </span>

            <span className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-[#FE9806]" />
              En atraso
            </span>

            <span className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full bg-[#E55249]" />
              En mora
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-4 border-t border-[#EEF3F6] pt-4">
            <div>
              <dt className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#9DAEBF]">
                Pagado
              </dt>

              <dd className="mt-1 text-[15px] font-extrabold tracking-tight text-ink">
                {bs(pagadas * CREDITO.cuota)}
              </dd>
            </div>

            <div>
              <dt className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#9DAEBF]">
                Saldo
              </dt>

              <dd className="mt-1 text-[15px] font-extrabold tracking-tight text-ink">
                {bs(
                  (CREDITO.totalCuotas - pagadas) *
                    CREDITO.cuota,
                )}
              </dd>
            </div>

            <div>
              <dt className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#9DAEBF]">
                Cuota fija
              </dt>

              <dd className="mt-1 text-[15px] font-extrabold tracking-tight text-ink">
                {bs(CREDITO.cuota)}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>

    {/* LISTA */}
    <div className="px-4 py-3 sm:px-6 sm:py-4">
      <ul>
        {lista.map((cuota, index) => {
          const estado = resolverEstadoCuota(cuota);
          const etiqueta = ETIQUETA_CUOTA[estado];
          const esFoco = foco?.numero === cuota.numero;

          const destacado =
            estado === "mora" ||
            estado === "vencido" ||
            estado === "pronto"
              ? "bg-[#FE9806]"
              : estado === "revision"
                ? "bg-[#5FDAF8]"
                : "";

          const textoDestacado =
            estado === "mora" ||
            estado === "vencido" ||
            estado === "pronto"
              ? "text-white"
              : "text-ink";

          return (
            <motion.li
              key={cuota.numero}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.32,
                delay: Math.min(index * 0.035, 0.18),
              }}
              className={`relative flex flex-col gap-3 border-b border-[#E9F0F6] px-1 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:px-0 ${
                esFoco
                  ? `my-2 rounded-[20px] border-b-0 px-4 py-4 sm:px-5 ${destacado}`
                  : ""
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-[13px] font-extrabold ${
                    estado === "pagada"
                      ? "bg-[#DDF6FD] text-[#075578]"
                      : esFoco && estado === "pronto"
                        ? "bg-white text-[#FE9806]"
                        : estado === "mora" || estado === "vencido"
                          ? "bg-white text-[#FE9806]"
                          : "bg-[#F1F5F8] text-[#688092]"
                  }`}
                >
                  {estado === "pagada" ? (
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    cuota.numero
                  )}
                </span>

                <div className="min-w-0">
                  <p
                    className={`text-[14px] font-extrabold ${
                      esFoco ? textoDestacado : "text-ink"
                    }`}
                  >
                    Cuota {cuota.numero} de {CREDITO.totalCuotas}
                  </p>

                  <p
                    className={`mt-0.5 text-[12px] ${
                      esFoco &&
                      (estado === "pronto" ||
                        estado === "mora" ||
                        estado === "vencido")
                        ? "text-white/75"
                        : "text-[#7E91A3]"
                    }`}
                  >
                    Vence {cuota.vence}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <p
                  className={`mr-2 text-[16px] font-extrabold tracking-tight ${
                    esFoco && estado === "pronto"
                      ? "text-white"
                      : "text-ink"
                  }`}
                >
                  {bs(totalCuota(cuota))}
                </p>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${
                    esFoco && estado === "pronto"
                      ? "bg-white/20 text-white"
                      : etiqueta.clases
                  }`}
                >
                  {estado === "pronto"
                    ? "Próximo pago"
                    : etiqueta.texto}
                </span>

                {(estado === "mora" ||
                  estado === "vencido" ||
                  estado === "pronto") && (
                  <button
                    type="button"
                    onClick={() => abrirPago(cuota)}
                    className="inline-flex items-center gap-2 rounded-[12px] bg-black px-4 py-2.5 text-[11px] font-extrabold text-white transition-opacity hover:opacity-80"
                  >
                    <QrCode
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                    Pagar mi cuota con QR
                  </button>
                )}

                {estado === "revision" && (
                  <button
                    type="button"
                    onClick={() => confirmarPago(cuota.numero)}
                    className="rounded-[12px] bg-black px-4 py-2.5 text-[11px] font-extrabold text-white"
                  >
                    Confirmar pago
                  </button>
                )}

                {estado === "pagada" && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-primary-dark"
                  >
                    <Receipt
                      className="h-3.5 w-3.5"
                      strokeWidth={2.2}
                    />
                    Ver comprobante
                  </button>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  </section>

  {/* ASESOR */}
  <section className="mt-4 flex flex-col gap-4 border-t border-[#E9F0F6] py-4 sm:flex-row sm:items-center">
    <div className="flex items-center gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#DFF7FF] text-sm font-extrabold text-primary-dark">
        MF
      </span>

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#688092]">
          Asesor asignado
        </p>

        <p className="mt-1 text-sm font-extrabold text-ink">
          María Fernández
        </p>

        <p className="mt-0.5 text-[12px] text-[#7E91A3]">
          Asesora de préstamos
        </p>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 sm:ml-auto">
      <a
        href={WHATSAPP_KIVO}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-[14px] bg-black px-5 py-3 text-[12px] font-extrabold text-white transition-opacity hover:opacity-80"
      >
        <MessageCircle
          className="h-4 w-4"
          strokeWidth={2}
        />
        Mensaje a mi asesor
        <span aria-hidden="true">→</span>
      </a>

      <a
        href={WHATSAPP_KIVO}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-[14px] border border-[#BDE7F8] bg-white px-5 py-3 text-[12px] font-extrabold text-ink transition-colors hover:bg-[#F7FBFD]"
      >
        Atención al cliente
      </a>
    </div>
  </section>

 {/* ── Modal de pago ── */}
 <AnimatePresence>
 {enPago && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.18 }}
 onClick={(e) => e.target === e.currentTarget && setEnPago(null)}
 className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F141B]/50 p-5 backdrop-blur-sm"
 >
 <motion.div
 initial={{ y: 16, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 10, opacity: 0 }}
 transition={{ duration: 0.22, ease: [0.2, 0.9, 0.3, 1] }}
 role="dialog"
 aria-modal="true"
 className="max-h-[92vh] w-full max-w-[470px] overflow-y-auto rounded-[28px] bg-white"
 >
 <div className="flex items-start gap-3 px-6 pt-5">
 <div>
 <h3 className="text-[19px] font-extrabold tracking-tight">
 {paso === "pagar" ? `Pagar cuota ${enPago.numero}` : "Avísanos de tu pago"}
 </h3>
 <p className="mt-0.5 text-[13.5px] text-[#6A7F94]">
 {paso === "pagar"
 ? `Préstamo ${CREDITO.numero} · vence el ${enPago.vence}`
 : `Cuota ${enPago.numero} · ${bs(totalCuota(enPago))}`}
 </p>
 </div>
 <button
 onClick={() => setEnPago(null)}
 aria-label="Cerrar"
 className="ml-auto grid h-9 w-9 place-items-center rounded-[11px] bg-[#F2F7FB] text-[#6A7F94] transition hover:bg-[#E9F0F6]"
 >
 ✕
 </button>
 </div>

 {paso === "pagar" ? (
 <>
 <div className="px-6 pb-6 pt-4">
 <div className="mb-4 flex items-center gap-3.5 rounded-[20px] bg-[#F5F9FC] p-4">
 <div>
 <p className="text-xs font-extrabold uppercase tracking-wide text-[#9DAEBF]">Total a pagar</p>
 <p className="text-[26px] font-extrabold leading-tight tracking-tighter">
 {bs(totalCuota(enPago))}
 </p>
 </div>
 {enPago.mora ? (
 <p className="ml-auto text-right text-xs font-bold leading-relaxed text-[#6A7F94]">
 Cuota {bs(CREDITO.cuota)}
 <br />
 <span className="text-[#F0736A]">+ mora {bs(enPago.mora)}</span>
 </p>
 ) : null}
 </div>

 <div className="mb-4 flex gap-1.5 rounded-[14px] bg-[#F2F7FB] p-1">
 {(
 [
 ["qr", "QR", QrCode],
 ["transferencia", "Transferencia", Landmark],
 ["oficina", "Oficina", Store],
 ] as [MetodoPago, string, LucideIcon][]
 ).map(([valor, label, Icono]) => (
 <button
 key={valor}
 onClick={() => setMetodo(valor)}
 aria-pressed={metodo === valor}
 className={`flex flex-1 items-center justify-center gap-1.5 rounded-[11px] px-1.5 py-2.5 text-[13px] font-bold transition ${
 metodo === valor ? "bg-white text-primary-dark " : "text-[#6A7F94]"
 }`}
 >
 <Icono className="h-3.5 w-3.5" />
 {label}
 </button>
 ))}
 </div>

 {metodo === "qr" && (
 <div className="text-center">
 <div className="inline-block rounded-[22px] border-2 border-[#E9F0F6] p-3.5">
 <QrDemo semilla={enPago.numero} />
 </div>
 <p className="mt-3 text-[13px] text-[#6A7F94]">
 Escanéalo con la app de tu banco.
 <br />
 Glosa: <b className="text-ink">{`${CREDITO.numero} · Cuota ${enPago.numero}`}</b>
 </p>
 </div>
 )}

 {metodo === "transferencia" && (
 <dl className="text-[13.5px] text-[#6A7F94]">
 <b className="mb-1 block text-sm text-ink">Transferencia o depósito</b>
 {[
 ["Banco", CREDITO.banco.entidad],
 ["Cuenta corriente", CREDITO.banco.cuenta],
 ["Titular", CREDITO.banco.titular],
 ["NIT", CREDITO.banco.nit],
 ["Glosa", `${CREDITO.numero} · Cuota ${enPago.numero}`],
 ].map(([k, v]) => (
 <div key={k} className="flex justify-between gap-3 border-b border-[#F2F7FB] py-1.5 last:border-0">
 <dt>{k}</dt>
 <dd className="text-right font-bold text-ink">{v}</dd>
 </div>
 ))}
 </dl>
 )}

 {metodo === "oficina" && (
 <dl className="text-[13.5px] text-[#6A7F94]">
 <b className="mb-1 block text-sm text-ink">Pago en oficina</b>
 {[
 ["Dirección", CREDITO.oficina.direccion],
 ["Horario", CREDITO.oficina.horario],
 ["Sábados", CREDITO.oficina.sabados],
 ["Lleva", "Tu CI y el número de préstamo"],
 ].map(([k, v]) => (
 <div key={k} className="flex justify-between gap-3 border-b border-[#F2F7FB] py-1.5 last:border-0">
 <dt>{k}</dt>
 <dd className="text-right font-bold text-ink">{v}</dd>
 </div>
 ))}
 </dl>
 )}
 </div>

 <div className="flex flex-col gap-2 px-6 pb-6">
 <button
 onClick={() => setPaso("avisar")}
 className="inline-flex items-center justify-center gap-2 rounded-[13px] bg-accent px-5 py-3 text-sm font-extrabold text-white transition hover:brightness-105"
 >
 <Check className="h-4 w-4" strokeWidth={2.6} />
 Ya hice el pago
 </button>
 <p className="text-center text-[12.5px] text-[#9DAEBF]">
 Avísanos y Kivo Office confirma tu pago en máximo 2 horas hábiles.
 </p>
 </div>
 </>
 ) : (
 <>
 <div className="px-6 pb-2 pt-4">
 <div className="mb-3.5">
 <label htmlFor="referencia" className="mb-1.5 block text-[12.5px] font-extrabold text-[#43596F]">
 Número de referencia o comprobante
 </label>
 <input
 id="referencia"
 inputMode="numeric"
 placeholder="Ej. 458920116"
 className="w-full rounded-[14px] border-[1.5px] border-[#E9F0F6] px-3.5 py-3 text-[14.5px] font-semibold outline-none transition focus:border-primary"
 />
 </div>

 <div className="mb-3.5">
 <label htmlFor="fecha" className="mb-1.5 block text-[12.5px] font-extrabold text-[#43596F]">
 Fecha del pago
 </label>
 <input
 id="fecha"
 type="date"
 defaultValue="2026-07-27"
 className="w-full rounded-[14px] border-[1.5px] border-[#E9F0F6] px-3.5 py-3 text-[14.5px] font-semibold outline-none transition focus:border-primary"
 />
 </div>

 <div className="mb-3.5">
 <p className="mb-1.5 text-[12.5px] font-extrabold text-[#43596F]">Captura o foto del comprobante</p>
 <button
 onClick={() => setComprobante(true)}
 className="w-full rounded-[18px] border-2 border-dashed border-[#E9F0F6] p-5 text-center text-[13.5px] text-[#6A7F94] transition hover:border-sky hover:bg-[#EAF7FE] hover:text-primary-dark"
 >
 {comprobante ? (
 <>
 <FileCheck2 className="mx-auto h-[18px] w-[18px] text-[#2FBF71]" />
 <b className="mt-1.5 block text-sm text-ink">comprobante-cuota-{enPago.numero}.jpg</b>
 Adjuntado
 </>
 ) : (
 <>
 <ImageUp className="mx-auto h-[18px] w-[18px]" />
 <b className="mt-1.5 block text-sm text-ink">Toca para adjuntar</b>
 JPG o PDF, hasta 5 MB
 </>
 )}
 </button>
 </div>
 </div>

 <div className="flex flex-col gap-2 px-6 pb-6">
 <button
 onClick={enviarAviso}
 className="rounded-[13px] bg-accent px-5 py-3 text-sm font-extrabold text-white transition hover:brightness-105"
 >
 Enviar confirmación
 </button>
 <button
 onClick={() => setPaso("pagar")}
 className="rounded-[13px] border-[1.5px] border-[#DCE7F0] px-5 py-3 text-sm font-extrabold text-[#43596F] transition hover:border-primary hover:text-primary-dark"
 >
 Volver
 </button>
 </div>
 </>
 )}
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* ── Aviso flotante ── */}
 <AnimatePresence>
 {aviso && (
 <motion.div
 initial={{ opacity: 0, y: 20, x: "-50%" }}
 animate={{ opacity: 1, y: 0, x: "-50%" }}
 exit={{ opacity: 0, y: 12, x: "-50%" }}
 className="fixed bottom-6 left-1/2 z-[60] flex max-w-[90vw] items-center gap-2.5 rounded-2xl bg-ink px-5 py-3.5 text-[13.5px] font-bold text-white"
 >
 <CheckCircle2 className="h-[18px] w-[18px] text-sky" />
 {aviso}
 </motion.div>
 )}
 </AnimatePresence>
 </>
 );
}