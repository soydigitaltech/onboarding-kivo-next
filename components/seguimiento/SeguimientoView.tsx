"use client";

import {
  AlertCircle,
  BadgeCheck,
  CalendarClock,
  Check,
  Clock4,
  FileCheck2,
  FileSignature,
  FileText,
  FileUp,
  Landmark,
  Mail,
  PartyPopper,
  ShieldCheck,
  TrendingUp,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import {
  SOLICITUD,
  VISTAS_SOLICITUD,
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

const PASOS: { id: PasoRuta; titulo: string }[] = [
  { id: "enviada", titulo: "Enviada" },
  { id: "revision", titulo: "En revisión" },
  { id: "aprobada", titulo: "Aprobada" },
  { id: "desembolso", titulo: "Desembolso" },
];

function Tarjeta({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[26px] border border-[#E9F0F6] bg-white shadow-[0_1px_2px_rgba(17,26,40,.03),0_16px_34px_-24px_rgba(27,91,182,.4)] ${className}`}
    >
      {children}
    </section>
  );
}

export default function SeguimientoView() {
  const estado: EstadoSolicitud = "revision";
  const vista = VISTAS_SOLICITUD[estado];

  return (
    <div className="flex flex-col gap-4">
      <Tarjeta>
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
            Estado y seguimiento
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
            La ruta de tu solicitud
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6A7F94]">
            Cada etapa se actualiza automáticamente. Aquí podrás revisar el
            avance, fechas y observaciones.
          </p>
        </div>

        <div className="px-5 pb-6 pt-6 sm:px-6">
          <div className="grid gap-y-6 sm:grid-cols-4">
            {PASOS.map((paso, index) => {
              const hecho = vista.pasosHechos.includes(paso.id);
              const actual = vista.pasoActual === paso.id;

              const subtitulo =
                paso.id === "enviada"
                  ? `${SOLICITUD.enviadaEl.slice(0, 6)} · 09:12`
                  : vista.subtitulos[
                      paso.id as "revision" | "aprobada" | "desembolso"
                    ];

              return (
                <div
                  key={paso.id}
                  className="relative flex items-start gap-3.5 pb-5 text-left sm:block sm:pb-0 sm:text-center"
                >
                  {index < PASOS.length - 1 ? (
                    <>
                      <span
                        className={`absolute bottom-0 left-[19px] top-11 hidden w-[3px] rounded max-sm:block ${
                          hecho ? "bg-primary" : "bg-[#E9F0F6]"
                        }`}
                      />

                      <span
                        className={`absolute left-[calc(50%+27px)] right-[calc(-50%+27px)] top-5 hidden h-[3px] rounded sm:block ${
                          hecho ? "bg-primary" : "bg-[#E9F0F6]"
                        }`}
                      />
                    </>
                  ) : null}

                  <div
                    className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] text-sm font-extrabold sm:mx-auto sm:mb-2.5 ${
                      hecho
                        ? "border-primary bg-primary text-white"
                        : actual
                          ? "border-primary bg-white text-primary-dark shadow-[0_0_0_6px_rgba(3,174,254,.14)]"
                          : "border-[#E9F0F6] bg-white text-[#9DAEBF]"
                    }`}
                  >
                    {hecho ? (
                      <Check
                        className="h-[18px] w-[18px]"
                        strokeWidth={3}
                      />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-[13.5px] font-extrabold ${
                        hecho || actual ? "text-ink" : "text-[#43596F]"
                      }`}
                    >
                      {paso.titulo}
                    </p>

                    <p
                      className={`mt-0.5 min-h-[15px] text-[11.5px] font-semibold ${
                        actual ? "text-primary-dark" : "text-[#9DAEBF]"
                      }`}
                    >
                      {subtitulo}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="relative flex items-start gap-3.5 pl-8 text-left sm:col-start-2 sm:block sm:pl-0 sm:pt-1.5 sm:text-center">
              <span
                className={`absolute -top-3.5 left-[19px] h-[18px] border-l-[3px] border-dashed sm:left-1/2 sm:-top-6 sm:h-[30px] ${
                  vista.ramalActivo
                    ? "border-[#F0A429]"
                    : "border-[#E9F0F6]"
                }`}
              />

              <div
                className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] sm:mx-auto sm:mb-2.5 ${
                  vista.ramalActivo
                    ? "border-[#F0A429] bg-[#F0A429] text-white shadow-[0_0_0_6px_rgba(240,164,41,.18)]"
                    : "border-dashed border-[#E9F0F6] bg-white text-[#9DAEBF]"
                }`}
              >
                <AlertCircle
                  className="h-[18px] w-[18px]"
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <p
                  className={`text-[13.5px] font-extrabold ${
                    vista.ramalActivo ? "text-ink" : "text-[#43596F]"
                  }`}
                >
                  Observada
                </p>

                <p
                  className={`mt-0.5 text-[11.5px] font-semibold ${
                    vista.ramalActivo
                      ? "text-[#B0730B]"
                      : "text-[#9DAEBF]"
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
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
            Historial
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
            Historial del trámite
          </h2>

          <p className="mt-2 text-sm text-[#6A7F94]">
            Todo lo ocurrido en tu solicitud, con fecha y hora.
          </p>
        </div>

        <ol className="px-5 pb-6 pt-5 sm:px-6">
          {vista.historial.map((hito, index) => (
            <li
              key={hito.titulo}
              className="relative flex gap-3.5 pb-5 last:pb-0"
            >
              {index < vista.historial.length - 1 ? (
                <span className="absolute bottom-0 left-[7px] top-[18px] w-0.5 bg-[#F2F7FB]" />
              ) : null}

              <span
                className={`z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-[3px] bg-white ${
                  hito.pendiente
                    ? "border-dashed border-[#E9F0F6]"
                    : "border-primary"
                }`}
              />

              <div>
                <h3
                  className={`text-sm font-extrabold ${
                    hito.pendiente ? "text-[#6A7F94]" : "text-ink"
                  }`}
                >
                  {hito.titulo}
                </h3>

                <p className="mt-0.5 text-[12.5px] text-[#6A7F94]">
                  {hito.detalle}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Tarjeta>

      <Tarjeta>
        <div className="px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF7FE] text-primary-dark">
              {(() => {
                const Icono = ICONOS[vista.icono];
                return <Icono className="h-5 w-5" />;
              })()}
            </span>

            <div>
              <p className="text-sm font-extrabold text-ink">
                Estado actual
              </p>

              <p className="mt-1 text-sm leading-6 text-[#6A7F94]">
                {vista.texto}
              </p>
            </div>
          </div>
        </div>
      </Tarjeta>
    </div>
  );
}
