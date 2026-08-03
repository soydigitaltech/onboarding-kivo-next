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

import {
  CREDITO,
  CUOTAS_INICIALES,
  ETIQUETA_CUOTA,
  WHATSAPP_KIVO,
  bs,
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
    let s = semilla * 9301 + 49297;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const enFinder = (c: number, r: number) =>
      (c < 8 && r < 8) || (c > N - 9 && r < 8) || (c < 8 && r > N - 9);

    const puntos: { x: number; y: number }[] = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (enFinder(c, r)) continue;
        if (rnd() > 0.53) puntos.push({ x: c * celda, y: r * celda });
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

  const pagadas = cuotas.filter((c) => c.estado === "pagada").length;
  const enMora = cuotas.filter((c) => c.estado === "mora").length;
  const enRevision = cuotas.filter((c) => c.estado === "revision").length;

  const foco =
    cuotas.find((c) => c.estado === "mora") ??
    cuotas.find((c) => c.estado === "revision") ??
    cuotas.find((c) => c.estado === "pronto") ??
    cuotas.find((c) => c.estado === "pendiente");

  const lista = cuotas.filter((c) =>
    filtro === "todas" ? true : filtro === "pagadas" ? c.estado === "pagada" : c.estado !== "pagada",
  );

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
      mora: {
        marco: "bg-[#FFEFEE] border-[#FBD5D1]",
        color: "text-[#F0736A]",
        icono: AlertTriangle,
        antetitulo: `Cuota ${foco.numero} · vencida`,
        texto: `Se venció el ${foco.vence}. Cada día suma ${bs(CREDITO.moraDiaria)} de mora — págala hoy y tu préstamo vuelve a estar al día.`,
        chips: [
          { icono: CalendarX, texto: `${foco.diasAtraso} días de atraso` },
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

    return { foco, ...config[foco.estado] };
  })();

  return (
    <>
      {/* ── Resumen ── */}
      <div className="mb-4 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        {destacada && (
          <section className={`flex flex-wrap items-start gap-5 rounded-[26px] border p-6 ${destacada.marco}`}>
            <div className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-[19px] bg-white shadow-[0_10px_22px_-14px_rgba(17,26,40,.6)]">
              <destacada.icono className={`h-[26px] w-[26px] ${destacada.color}`} strokeWidth={1.8} />
            </div>

            <div className="min-w-[250px] flex-1">
              <p className="text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-[#7A8DA0]">
                {destacada.antetitulo}
              </p>
              <h2 className="mb-0.5 mt-1 text-[32px] font-extrabold leading-tight tracking-tighter">
                {bs(totalCuota(destacada.foco))}
                <span className="text-[15px] font-bold tracking-normal text-[#6A7F94]">
                  {" "}
                  · vence {destacada.foco.vence}
                </span>
              </h2>
              <p className="max-w-[48ch] text-sm text-[#3E566D]">{destacada.texto}</p>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {destacada.chips.map((chip) => (
                  <span
                    key={chip.texto}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-white px-3 py-1 text-[12.5px] font-bold text-[#3E566D]"
                  >
                    <chip.icono className="h-3.5 w-3.5" strokeWidth={2.2} />
                    {chip.texto}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex min-w-[180px] flex-col gap-2">
              {destacada.foco.estado === "revision" ? (
                <button
                  onClick={() => confirmarPago(destacada.foco.numero)}
                  className="rounded-[13px] border-[1.5px] border-[#DCE7F0] bg-white px-5 py-3 text-sm font-extrabold text-[#43596F] transition hover:border-primary hover:text-primary-dark"
                >
                  Simular confirmación
                </button>
              ) : (
                <button
                  onClick={() => abrirPago(destacada.foco)}
                  className="rounded-[13px] bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_-14px_rgba(254,152,6,1)] transition hover:brightness-105 active:translate-y-px"
                >
                  {destacada.foco.estado === "pendiente" ? "Adelantar cuota" : "Pagar ahora"}
                </button>
              )}

              {destacada.foco.estado === "mora" && (
                <a
                  href={WHATSAPP_KIVO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[13px] border-[1.5px] border-[#DCE7F0] bg-white px-5 py-3 text-sm font-extrabold text-[#43596F] transition hover:border-primary hover:text-primary-dark"
                >
                  <MessageCircle className="h-4 w-4" />
                  Hablar con Kivo
                </a>
              )}
            </div>
          </section>
        )}

        <section className="rounded-[26px] border border-[#E9F0F6] bg-white p-6 shadow-[0_1px_2px_rgba(17,26,40,.03),0_16px_34px_-24px_rgba(27,91,182,.4)]">
          <div className="mb-3.5 flex flex-wrap items-baseline gap-2.5">
            <b className="text-[16.5px] font-extrabold tracking-tight">Préstamo {CREDITO.numero}</b>
            <span className="text-[12.5px] font-bold text-[#6A7F94]">
              Cuota {pagadas} de {CREDITO.totalCuotas} pagada{pagadas === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex h-[11px] overflow-hidden rounded-full bg-[#F2F7FB]">
            <span className="h-full bg-primary" style={{ width: `${(pagadas / CREDITO.totalCuotas) * 100}%` }} />
            <span className="h-full bg-[#F0736A]" style={{ width: `${(enMora / CREDITO.totalCuotas) * 100}%` }} />
          </div>

          <div className="mt-2.5 flex flex-wrap gap-3.5 text-xs font-bold text-[#6A7F94]">
            <span className="inline-flex items-center gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-primary" />
              Pagado
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-[#F0736A]" />
              En mora
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-[#F2F7FB]" />
              Por vencer
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-3.5 border-t border-[#F2F7FB] pt-4">
            {[
              ["Pagado", bs(pagadas * CREDITO.cuota)],
              ["Saldo", bs((CREDITO.totalCuotas - pagadas) * CREDITO.cuota)],
              ["Cuota fija", bs(CREDITO.cuota)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] font-extrabold uppercase tracking-wide text-[#9DAEBF]">{k}</dt>
                <dd className="text-[17px] font-extrabold tracking-tighter">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* ── Lista de cuotas ── */}
      <section className="rounded-[26px] border border-[#E9F0F6] bg-white shadow-[0_1px_2px_rgba(17,26,40,.03),0_16px_34px_-24px_rgba(27,91,182,.4)]">
        <div className="flex flex-wrap items-start gap-3 px-6 pt-5">
          <div>
            <h3 className="text-[16.5px] font-extrabold tracking-tight">Tus cuotas</h3>
            <p className="mt-0.5 text-[13.5px] text-[#6A7F94]">
              Puedes pagar la cuota del mes o adelantar las siguientes.
            </p>
          </div>
          <span className="ml-auto text-[12.5px] font-extrabold text-primary-dark">
            {enMora ? `${enMora} cuota en mora` : enRevision ? `${enRevision} en revisión` : "Estás al día"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 px-6 pb-3.5 pt-4">
          {(
            [
              ["todas", "Todas"],
              ["pendientes", "Por pagar"],
              ["pagadas", "Pagadas"],
            ] as [Filtro, string][]
          ).map(([valor, label]) => (
            <button
              key={valor}
              onClick={() => setFiltro(valor)}
              aria-pressed={filtro === valor}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold transition ${
                filtro === valor ? "bg-ink text-white" : "bg-[#F2F7FB] text-[#6A7F94]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <ul className="px-3.5 pb-3.5">
          {lista.map((cuota, i) => {
            const etiqueta = ETIQUETA_CUOTA[cuota.estado];

            const detalle =
              cuota.estado === "pagada"
                ? `Pagada el ${cuota.pagadaEl} · ${cuota.metodo}`
                : cuota.estado === "mora"
                  ? `Venció el ${cuota.vence} · ${cuota.diasAtraso} días de atraso`
                  : cuota.estado === "pronto"
                    ? `Vence el ${cuota.vence} · en ${cuota.diasRestantes} días`
                    : cuota.estado === "revision"
                      ? "Aviso enviado · Kivo Office confirma en 2 h"
                      : `Vence el ${cuota.vence}`;

            return (
              <li
                key={cuota.numero}
                className={`grid grid-cols-[44px_1fr] items-center gap-x-3.5 gap-y-2.5 rounded-[18px] p-3 transition hover:bg-[#F5F9FC] sm:grid-cols-[52px_1fr_auto_auto] ${
                  i > 0 ? "border-t border-[#F2F7FB]" : ""
                }`}
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-[15px] text-[15px] font-extrabold ${etiqueta.clases}`}
                >
                  {String(cuota.numero).padStart(2, "0")}
                </span>

                <div>
                  <b className="block text-[14.5px] font-extrabold tracking-tight">
                    Cuota {cuota.numero} de {CREDITO.totalCuotas}
                  </b>
                  <small className="text-[12.5px] font-semibold text-[#6A7F94]">{detalle}</small>
                  <div className="mt-1.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${etiqueta.clases}`}>
                      {etiqueta.texto}
                    </span>
                  </div>
                </div>

                <div className="col-start-2 sm:col-start-auto sm:text-right">
                  <b
                    className={`block text-[15px] tracking-tight ${
                      cuota.estado === "pagada" ? "font-bold text-[#6A7F94]" : "font-extrabold"
                    }`}
                  >
                    {bs(totalCuota(cuota))}
                  </b>
                  {cuota.mora ? (
                    <small className="text-xs font-extrabold text-[#F0736A]">
                      incluye {bs(cuota.mora)} de mora
                    </small>
                  ) : null}
                </div>

                <div className="col-span-2 flex justify-end sm:col-span-1 sm:min-w-[130px]">
                  {cuota.estado === "mora" || cuota.estado === "pronto" ? (
                    <button
                      onClick={() => abrirPago(cuota)}
                      className="w-full rounded-[11px] bg-accent px-4 py-2 text-[13px] font-extrabold text-white transition hover:brightness-105 sm:w-auto"
                    >
                      Pagar
                    </button>
                  ) : cuota.estado === "pendiente" ? (
                    <button
                      onClick={() => abrirPago(cuota)}
                      className="w-full rounded-[11px] border-[1.5px] border-[#DCE7F0] px-4 py-2 text-[13px] font-extrabold text-[#43596F] transition hover:border-primary hover:text-primary-dark sm:w-auto"
                    >
                      Adelantar
                    </button>
                  ) : cuota.estado === "revision" ? (
                    <button
                      onClick={() => confirmarPago(cuota.numero)}
                      className="w-full rounded-[11px] border-[1.5px] border-[#DCE7F0] px-4 py-2 text-[13px] font-extrabold text-[#43596F] transition hover:border-primary hover:text-primary-dark sm:w-auto"
                    >
                      Simular confirmación
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-primary-dark">
                      <Receipt className="h-3.5 w-3.5" strokeWidth={2.4} />
                      Recibo
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-4 flex items-start gap-3.5 rounded-[26px] border border-[#E9F0F6] bg-white px-6 py-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#EAF7FE] text-primary-dark">
          <ShieldCheck className="h-[18px] w-[18px]" />
        </span>
        <div>
          <b className="text-[14.5px] font-extrabold">¿Pagaste y tu cuota sigue en revisión?</b>
          <p className="mt-0.5 max-w-[70ch] text-[13.5px] text-[#6A7F94]">
            Kivo Office confirma los pagos en máximo 2 horas hábiles. Si pasó ese tiempo, escríbenos con tu número de
            referencia y lo resolvemos el mismo día. Mientras esté en revisión, no se genera mora nueva.
          </p>
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
                            metodo === valor ? "bg-white text-primary-dark shadow-sm" : "text-[#6A7F94]"
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
                      className="inline-flex items-center justify-center gap-2 rounded-[13px] bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_-14px_rgba(254,152,6,1)] transition hover:brightness-105"
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
                      className="rounded-[13px] bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_-14px_rgba(254,152,6,1)] transition hover:brightness-105"
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