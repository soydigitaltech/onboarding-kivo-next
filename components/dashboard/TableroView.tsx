"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarClock,
  Check,
  ChevronRight,
  Clock4,
  Download,
  FileCheck2,
  FileSignature,
  FileText,
  FileUp,
  Landmark,
  Mail,
  PartyPopper,
  Pencil,
  SearchCheck,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  BLOQUES_PERFIL,
  DATOS_CAPTURADOS,
  PORCENTAJE_PERFIL,
  SOLICITUD,
  VISTAS_SOLICITUD,
  bs,
  type EstadoSolicitud,
  type IconoNombre,
  type PasoRuta,
} from "@/lib/kivo/datos";

const ICONOS: Record<IconoNombre, LucideIcon> = {
  reloj: Clock4,
  alerta: AlertCircle,
  aprobado: BadgeCheck,
  usuario: UserRound,
  documento: FileText,
  subir: FileUp,
  correo: Mail,
  banco: Landmark,
  firma: FileSignature,
  calendario: CalendarClock,
  escudo: ShieldCheck,
  campana: BadgeCheck,
  mora: AlertCircle,
  tendencia: TrendingUp,
  archivoOk: FileCheck2,
  fiesta: PartyPopper,
};

const TONO_BANNER: Record<EstadoSolicitud, string> = {
  revision: "bg-[#EAF7FE] border-[#D2EEFB]",
  observada: "bg-[#FFF5E4] border-[#FCE3B8]",
  aprobada: "bg-[#EAF8F0] border-[#C7EBD7]",
};

const TONO_ICONO: Record<EstadoSolicitud, string> = {
  revision: "text-primary",
  observada: "text-[#F0A429]",
  aprobada: "text-[#2FBF71]",
};

const TONO_ANTETITULO: Record<EstadoSolicitud, string> = {
  revision: "text-primary-dark",
  observada: "text-[#B0730B]",
  aprobada: "text-[#1B8B52]",
};

const PASOS: { id: PasoRuta; titulo: string }[] = [
  { id: "enviada", titulo: "Enviada" },
  { id: "revision", titulo: "En revisión" },
  { id: "aprobada", titulo: "Aprobada" },
  { id: "desembolso", titulo: "Desembolso" },
];

/* ═════════ Piezas ═════════ */

function Tarjeta({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-[26px] border border-[#E9F0F6] bg-white shadow-[0_1px_2px_rgba(17,26,40,.03),0_16px_34px_-24px_rgba(27,91,182,.4)] ${className}`}
    >
      {children}
    </section>
  );
}

function Encabezado({ titulo, texto, lado }: { titulo: string; texto?: string; lado?: string }) {
  return (
    <div className="flex flex-wrap items-start gap-3 px-6 pt-5">
      <div>
        <h3 className="text-[16.5px] font-extrabold tracking-tight">{titulo}</h3>
        {texto && <p className="mt-0.5 text-[13.5px] text-[#6A7F94]">{texto}</p>}
      </div>
      {lado && <span className="ml-auto text-[12.5px] font-extrabold text-primary-dark">{lado}</span>}
    </div>
  );
}

function Chip({ icono: Icono, texto }: { icono: LucideIcon; texto: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-white px-3 py-1 text-[12.5px] font-bold text-[#3E566D]">
      <Icono className="h-3.5 w-3.5" strokeWidth={2.2} />
      {texto}
    </span>
  );
}

/* ═════════ Anillo de completitud ═════════ */

function AnilloPerfil() {
  const R = 56;
  const C = 2 * Math.PI * R;
  const N = BLOQUES_PERFIL.length;
  const GAP = 9;
  const seg = C / N;
  const arco = seg - GAP;

  return (
    <div className="relative h-[132px] w-[132px] shrink-0">
      <svg width={132} height={132} viewBox="0 0 132 132" className="-rotate-90">
        {BLOQUES_PERFIL.map((bloque, i) => {
          const offset = -(i * seg + GAP / 2);
          const lleno = arco * bloque.avance;
          return (
            <g key={bloque.nombre}>
              <circle
                cx={66}
                cy={66}
                r={R}
                fill="none"
                stroke="#E9F0F6"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={`${arco} ${C - arco}`}
                strokeDashoffset={offset}
              />
              {bloque.avance > 0 && (
                <circle
                  cx={66}
                  cy={66}
                  r={R}
                  fill="none"
                  stroke={bloque.avance === 1 ? "#03AEFE" : "#5FDAF8"}
                  strokeWidth={12}
                  strokeLinecap="round"
                  strokeDasharray={`${lleno} ${C - lleno}`}
                  strokeDashoffset={offset}
                />
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <b className="text-[29px] font-extrabold leading-none tracking-tighter">{PORCENTAJE_PERFIL}%</b>
        <span className="text-[11px] font-extrabold text-[#6A7F94]">completo</span>
      </div>
    </div>
  );
}

/* ═════════ Vista ═════════ */

export default function TableroView({
  estado,
  onCambiarEstado,
}: {
  estado: EstadoSolicitud;
  onCambiarEstado: (estado: EstadoSolicitud) => void;
}) {
  const vista = VISTAS_SOLICITUD[estado];
  const [tab, setTab] = useState<string>("Personales");

  const IconoEstado = ICONOS[vista.icono];
  const noLeidos = vista.mensajes.filter((m) => m.noLeido).length;

  return (
    <>
      {/* Conmutador de prueba — se elimina cuando llegue el estado real del backend */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5 rounded-[20px] border border-dashed border-[#E9F0F6] bg-white px-3.5 py-2.5">
        <b className="text-[11.5px] uppercase tracking-[0.08em] text-[#9DAEBF]">Vista de prueba</b>
        <div className="flex gap-0.5 rounded-xl bg-[#F2F7FB] p-1">
          {(["revision", "observada", "aprobada"] as EstadoSolicitud[]).map((e) => (
            <button
              key={e}
              onClick={() => onCambiarEstado(e)}
              aria-pressed={estado === e}
              className={`rounded-[9px] px-3.5 py-1.5 text-[13px] font-bold transition ${
                estado === e ? "bg-white text-primary-dark shadow-sm" : "text-[#6A7F94]"
              }`}
            >
              {e === "revision" ? "En revisión" : e === "observada" ? "Observada" : "Aprobada"}
            </button>
          ))}
        </div>
      </div>

      {/* Banner de estado */}
      <section
        className={`mb-4 flex flex-wrap items-start gap-5 rounded-[26px] border p-6 ${TONO_BANNER[vista.tono]}`}
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[19px] bg-white shadow-[0_10px_22px_-14px_rgba(17,26,40,.6)]">
          <IconoEstado className={`h-[26px] w-[26px] ${TONO_ICONO[vista.tono]}`} strokeWidth={1.8} />
        </div>

        <div className="min-w-[260px] flex-1">
          <p className={`text-[11.5px] font-extrabold uppercase tracking-[0.1em] ${TONO_ANTETITULO[vista.tono]}`}>
            {vista.antetitulo}
          </p>
          <h2 className="mb-1.5 mt-1 text-2xl font-extrabold leading-tight tracking-tight">{vista.titulo}</h2>
          <p className="max-w-[56ch] text-[#3E566D]">{vista.texto}</p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {vista.meta.map((m) => (
              <Chip key={m.texto} icono={ICONOS[m.icono]} texto={m.texto} />
            ))}
          </div>
        </div>

        <div className="flex min-w-[196px] flex-col gap-2">
          {vista.acciones.map((a) => (
            <button
              key={a.label}
              className={`rounded-[13px] px-5 py-3 text-sm font-extrabold transition active:translate-y-px ${
                a.tipo === "accent"
                  ? "bg-accent text-white shadow-[0_12px_24px_-14px_rgba(254,152,6,1)] hover:brightness-105"
                  : "border-[1.5px] border-[#DCE7F0] bg-white text-[#43596F] hover:border-primary hover:text-primary-dark"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </section>

      {/* Ruta + resumen */}
      <div className="mb-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <Tarjeta>
          <div id="ruta" className="scroll-mt-24">
            <Encabezado
              titulo="La ruta de tu solicitud"
              texto="Cada paso se actualiza solo. No necesitas llamar ni ir a una oficina."
              lado={vista.pasoLabel}
            />
          </div>

          <div className="px-6 pb-6 pt-6">
            <div className="grid gap-y-6 sm:grid-cols-4">
              {PASOS.map((paso, i) => {
                const hecho = vista.pasosHechos.includes(paso.id);
                const ahora = vista.pasoActual === paso.id;
                const sub =
                  paso.id === "enviada"
                    ? `${SOLICITUD.enviadaEl.slice(0, 6)} · 09:12`
                    : vista.subtitulos[paso.id as "revision" | "aprobada" | "desembolso"];

                return (
                  <div
                    key={paso.id}
                    className="relative flex items-start gap-3.5 pb-5 text-left sm:block sm:pb-0 sm:text-center"
                  >
                    {i < PASOS.length - 1 && (
                      <>
                        <span
                          className={`absolute left-[19px] bottom-0 top-11 hidden w-[3px] rounded max-sm:block ${
                            hecho ? "bg-primary" : "bg-[#E9F0F6]"
                          }`}
                        />
                        <span
                          className={`absolute left-[calc(50%+27px)] right-[calc(-50%+27px)] top-5 hidden h-[3px] rounded sm:block ${
                            hecho ? "bg-primary" : "bg-[#E9F0F6]"
                          }`}
                        />
                      </>
                    )}

                    <div
                      className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] text-sm font-extrabold transition sm:mx-auto sm:mb-2.5 ${
                        hecho
                          ? "border-primary bg-primary text-white"
                          : ahora
                            ? "border-primary bg-white text-primary-dark shadow-[0_0_0_6px_rgba(3,174,254,.14)]"
                            : "border-[#E9F0F6] bg-white text-[#9DAEBF]"
                      }`}
                    >
                      {hecho ? <Check className="h-[18px] w-[18px]" strokeWidth={3} /> : i + 1}
                    </div>

                    <div>
                      <p
                        className={`text-[13.5px] font-extrabold ${
                          hecho || ahora ? "text-ink" : "text-[#43596F]"
                        }`}
                      >
                        {paso.titulo}
                      </p>
                      <p
                        className={`mt-0.5 min-h-[15px] text-[11.5px] font-semibold ${
                          ahora ? "text-primary-dark" : "text-[#9DAEBF]"
                        }`}
                      >
                        {sub}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Ramal: "Observada" es un desvío posible, no un paso obligatorio */}
              <div className="relative flex items-start gap-3.5 pl-8 text-left sm:col-start-2 sm:block sm:pl-0 sm:pt-1.5 sm:text-center">
                <span
                  className={`absolute -top-3.5 left-[19px] h-[18px] border-l-[3px] border-dashed sm:left-1/2 sm:-top-6 sm:h-[30px] ${
                    vista.ramalActivo ? "border-[#F0A429]" : "border-[#E9F0F6]"
                  }`}
                />
                <div
                  className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] sm:mx-auto sm:mb-2.5 ${
                    vista.ramalActivo
                      ? "border-[#F0A429] bg-[#F0A429] text-white shadow-[0_0_0_6px_rgba(240,164,41,.18)]"
                      : "border-dashed border-[#E9F0F6] bg-white text-[#9DAEBF]"
                  }`}
                >
                  <AlertCircle className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </div>
                <div>
                  <p className={`text-[13.5px] font-extrabold ${vista.ramalActivo ? "text-ink" : "text-[#43596F]"}`}>
                    Observada
                  </p>
                  <p
                    className={`mt-0.5 text-[11.5px] font-semibold ${
                      vista.ramalActivo ? "text-[#B0730B]" : "text-[#9DAEBF]"
                    }`}
                  >
                    {vista.notaRamal}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Tarjeta>

        <Tarjeta>
          <Encabezado titulo="Lo que pediste" />
          <div className="px-6 pb-6 pt-5">
            <p className="mb-0.5 mt-3.5 text-[34px] font-extrabold leading-none tracking-tighter">
              {bs(SOLICITUD.monto)}
              <span className="text-base font-bold tracking-normal text-[#6A7F94]">
                {" "}
                a {SOLICITUD.plazoMeses} meses
              </span>
            </p>
            <p className="mb-4 text-[12.5px] text-[#6A7F94]">
              Solicitud N.º {SOLICITUD.numero} · enviada el {SOLICITUD.enviadaEl}
            </p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#F2F7FB] pt-3.5">
              {[
                ["Cuota estimada", bs(SOLICITUD.cuota)],
                ["Tasa referencial", SOLICITUD.tasa],
                ["Primer pago", SOLICITUD.primerPago],
                ["Destino", SOLICITUD.destino],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11.5px] font-extrabold uppercase tracking-wide text-[#9DAEBF]">{k}</dt>
                  <dd className="text-[14.5px] font-extrabold tracking-tight">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-[#F5F9FC] p-3">
              <div className="grid h-[34px] w-[34px] place-items-center rounded-full bg-sky text-[13px] font-extrabold text-primary-dark">
                {SOLICITUD.analista.iniciales}
              </div>
              <div>
                <small className="block text-[11.5px] font-semibold text-[#6A7F94]">Analista asignada</small>
                <b className="text-[13.5px]">{SOLICITUD.analista.nombre}</b>
              </div>
              <button className="ml-auto text-[13px] font-extrabold text-primary-dark">Escribirle</button>
            </div>
          </div>
        </Tarjeta>
      </div>

      {/* Perfil + Kivo Office */}
      <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <Tarjeta>
          <div id="perfil" className="scroll-mt-24">
            <Encabezado
              titulo="Tu perfil"
              texto="Un perfil completo acelera la revisión y mejora tu evaluación."
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 px-6 pb-5 pt-4">
            <AnilloPerfil />
            <ul className="flex min-w-[230px] flex-1 flex-col gap-2.5">
              {BLOQUES_PERFIL.map((bloque) => {
                const completo = bloque.avance === 1;
                const parcial = bloque.avance > 0 && bloque.avance < 1;
                return (
                  <li key={bloque.nombre} className="flex items-center gap-2.5 text-[13.5px]">
                    <span
                      className={`grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full ${
                        completo
                          ? "bg-primary text-white"
                          : parcial
                            ? "bg-sky text-primary-dark"
                            : "bg-[#F2F7FB] text-[#9DAEBF]"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3.2} />
                    </span>
                    <span className="font-bold text-[#43596F]">{bloque.nombre}</span>
                    <span
                      className={`ml-auto text-xs font-extrabold ${
                        completo ? "text-[#9DAEBF]" : "text-accent"
                      }`}
                    >
                      {completo ? "Completo" : parcial ? `${Math.round(bloque.avance * 100)}%` : "Falta"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[#F2F7FB] px-6 py-3.5">
            <p className="min-w-[180px] flex-1 text-[13px] text-[#6A7F94]">
              Te faltan 2 bloques: referencias personales y respaldo de ingresos.
            </p>
            <button className="rounded-[11px] bg-accent px-4 py-2 text-[13px] font-extrabold text-white shadow-[0_12px_24px_-14px_rgba(254,152,6,1)] transition hover:brightness-105">
              Completar perfil
            </button>
          </div>
        </Tarjeta>

        <Tarjeta>
          <div id="mensajes" className="scroll-mt-24">
            <Encabezado
              titulo="Kivo Office"
              texto="Avisos oficiales sobre tu solicitud y tu cuenta."
              lado={noLeidos ? `${noLeidos} sin leer` : "Todo leído"}
            />
          </div>

          <ul className="max-h-[392px] overflow-y-auto px-3 pb-3 pt-1.5">
            {vista.mensajes.map((m, i) => {
              const Icono = ICONOS[m.icono];
              return (
                <li
                  key={m.id}
                  className={`flex gap-3 rounded-2xl p-3 transition hover:bg-[#F5F9FC] ${
                    i > 0 ? "border-t border-[#F2F7FB]" : ""
                  }`}
                >
                  <span
                    className={`grid h-[34px] w-[34px] shrink-0 place-items-center rounded-xl ${
                      m.tipo === "accion"
                        ? "bg-[#FFF5E4] text-[#B0730B]"
                        : m.tipo === "ok"
                          ? "bg-[#EAF8F0] text-[#1B8B52]"
                          : "bg-[#EAF7FE] text-primary-dark"
                    }`}
                  >
                    <Icono className="h-[17px] w-[17px]" strokeWidth={2} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h4 className="flex items-center gap-2 text-sm font-extrabold">
                      {m.noLeido && <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-accent" />}
                      {m.titulo}
                    </h4>
                    <p className="text-[13px] leading-snug text-[#6A7F94]">{m.texto}</p>
                    {m.accion && (
                      <button className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-accent">
                        {m.accion}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
                      </button>
                    )}
                  </div>

                  <span className="whitespace-nowrap pt-0.5 text-[11.5px] font-bold text-[#9DAEBF]">
                    {m.cuando}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-[#F2F7FB] px-6 py-3 text-center">
            <button className="text-[13px] font-extrabold text-primary-dark">Ver todos los mensajes</button>
          </div>
        </Tarjeta>
      </div>

      {/* Datos capturados */}
      <Tarjeta className="mb-4">
        <div id="datos" className="scroll-mt-24">
          <Encabezado
            titulo="Tus datos"
            texto="Esto es lo que Kivo tiene registrado. Puedes corregirlo mientras la solicitud siga abierta."
          />
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-[#F2F7FB] px-6 pt-4" role="tablist">
          {Object.keys(DATOS_CAPTURADOS).map((clave) => (
            <button
              key={clave}
              role="tab"
              aria-selected={tab === clave}
              onClick={() => setTab(clave)}
              className={`-mb-px rounded-t-xl border-b-[3px] px-3.5 py-2.5 text-[13.5px] font-bold transition ${
                tab === clave
                  ? "border-primary bg-[#EAF7FE] text-primary-dark"
                  : "border-transparent text-[#6A7F94]"
              }`}
            >
              {clave}
            </button>
          ))}
        </div>

        <dl className="grid gap-4 px-6 pb-6 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {DATOS_CAPTURADOS[tab].map((campo) => (
            <div key={campo.etiqueta}>
              <dt className="mb-0.5 text-[11.5px] font-extrabold uppercase tracking-wide text-[#9DAEBF]">
                {campo.etiqueta}
              </dt>
              <dd
                className={`text-[14.5px] font-bold ${
                  campo.falta ? "italic font-semibold text-[#9DAEBF]" : ""
                }`}
              >
                {campo.valor}
                {campo.verificado && (
                  <span className="ml-1.5 rounded-full bg-[#EAF8F0] px-2 py-px align-[2px] text-[11px] font-extrabold text-[#1B8B52]">
                    verificado
                  </span>
                )}
                {campo.porVerificar && (
                  <span className="ml-1.5 rounded-full bg-[#FFF5E4] px-2 py-px align-[2px] text-[11px] font-extrabold text-[#B0730B]">
                    por verificar
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-4 border-t border-[#F2F7FB] px-6 py-3">
          <button className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-primary-dark">
            <Pencil className="h-3.5 w-3.5" strokeWidth={2.4} />
            Editar este bloque
          </button>
          <button className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-primary-dark">
            <Download className="h-3.5 w-3.5" strokeWidth={2.4} />
            Descargar mi solicitud (PDF)
          </button>
        </div>
      </Tarjeta>

      {/* Historial + aprende */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <Tarjeta>
          <Encabezado titulo="Historial del trámite" texto="Todo lo que pasó, con fecha y hora." />
          <ol className="px-6 pb-6 pt-4">
            {vista.historial.map((hito, i) => (
              <li key={hito.titulo} className="relative flex gap-3.5 pb-5 last:pb-0">
                {i < vista.historial.length - 1 && (
                  <span className="absolute bottom-0 left-[7px] top-[18px] w-0.5 bg-[#F2F7FB]" />
                )}
                <span
                  className={`z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-[3px] bg-white ${
                    hito.pendiente ? "border-dashed border-[#E9F0F6]" : "border-primary"
                  }`}
                />
                <div>
                  <h5 className={`text-sm font-extrabold ${hito.pendiente ? "text-[#6A7F94]" : ""}`}>
                    {hito.titulo}
                  </h5>
                  <p className="mt-0.5 text-[12.5px] text-[#6A7F94]">{hito.detalle}</p>
                </div>
              </li>
            ))}
          </ol>
        </Tarjeta>

        <Tarjeta>
          <Encabezado titulo="Aprende con Kivo" texto="Tres minutos por tema, en palabras simples." />
          <div className="flex flex-col gap-2.5 px-6 pb-6 pt-4">
            {[
              { icono: BookOpen, titulo: "Cómo se calcula tu cuota", texto: "Sistema francés, sin letra chica" },
              { icono: SearchCheck, titulo: "Qué mira el análisis", texto: "Ingresos, deudas y capacidad de pago" },
              { icono: Wallet, titulo: "Cómo pagar sin recargos", texto: "Fechas, canales y qué pasa si te atrasas" },
            ].map((t) => (
              <button
                key={t.titulo}
                className="flex w-full items-center gap-3 rounded-2xl bg-[#F5F9FC] p-3.5 text-left transition hover:translate-x-1 hover:bg-[#EAF7FE]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[13px] bg-white text-primary shadow-[0_5px_12px_-8px_rgba(17,26,40,.5)]">
                  <t.icono className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
                <span>
                  <b className="block text-[13.5px] font-extrabold">{t.titulo}</b>
                  <small className="text-xs text-[#6A7F94]">{t.texto}</small>
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-[#9DAEBF]" strokeWidth={2.5} />
              </button>
            ))}
          </div>
        </Tarjeta>
      </div>
    </>
  );
}