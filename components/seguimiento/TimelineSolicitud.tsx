"use client";

import Link from "next/link";
import {
  Check,
  ExternalLink,
  FileText,
  MapPin,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";

type EstadoPaso = "completado" | "actual" | "pendiente";

type AccionPaso = {
  label: string;
  href: string;
  externa?: boolean;
  icono?: "file" | "whatsapp" | "map";
};

type PasoTimeline = {
  numero: number;
  titulo: string;
  descripcion: string;
  estado: EstadoPaso;
  meta?: string;
  acciones?: AccionPaso[];
};

const PASOS: PasoTimeline[] = [
  {
    numero: 1,
    titulo: "Solicitud recibida",
    descripcion: "Recibimos tu solicitud correctamente.",
    estado: "completado",
    acciones: [
      {
        label: "Ver solicitud",
        href: "/dashboard",
        icono: "file",
      },
    ],
  },
  {
    numero: 2,
    titulo: "Asesor asignado",
    descripcion: "Diego Fernández está acompañando tu solicitud.",
    meta: "Asesor Kivo",
    estado: "completado",
    acciones: [
      {
        label: "Chatear por WhatsApp",
        href: "https://wa.me/59170000000",
        externa: true,
        icono: "whatsapp",
      },
    ],
  },
  {
    numero: 3,
    titulo: "En evaluación",
    descripcion:
      "Tu solicitud está en evaluación. Revisa si necesitamos información o documentación adicional.",
    estado: "actual",
    acciones: [
      {
        label: "Ver requisitos solicitados",
        href: "/documentos",
        icono: "file",
      },
    ],
  },
  {
    numero: 4,
    titulo: "Firma de contrato",
    descripcion:
      "Tu contrato está disponible para firma en la notaría asignada.",
    meta: "Notaría de Fe Pública N.º 18 · Av. Arce 2529, La Paz",
    estado: "pendiente",
    acciones: [
      {
        label: "Ver ubicación",
        href: "https://www.google.com/maps/search/?api=1&query=Av.+Arce+2529,+La+Paz,+Bolivia",
        externa: true,
        icono: "map",
      },
    ],
  },
  {
    numero: 5,
    titulo: "Desembolso",
    descripcion:
      "Tu desembolso está listo. Solo falta completar la firma del contrato.",
    estado: "pendiente",
  },
  {
    numero: 6,
    titulo: "Entrega de contrato",
    descripcion:
      "Recoge tu contrato en las oficinas de Kivo.",
    estado: "pendiente",
  },
];

function IconoAccion({ tipo }: { tipo?: AccionPaso["icono"] }) {
  if (tipo === "whatsapp") {
    return <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.2} />;
  }

  if (tipo === "map") {
    return <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />;
  }

  return <FileText className="h-3.5 w-3.5" strokeWidth={2.2} />;
}

export default function TimelineSolicitud() {
  const currentIndex = PASOS.findIndex(
    (paso) => paso.estado === "actual",
  );

  const progreso =
    currentIndex >= 0
      ? currentIndex / Math.max(PASOS.length - 1, 1)
      : 0;

  return (
    <section className="overflow-hidden rounded-[26px] border border-[#E9F0F6] bg-white">
      <div className="px-5 py-7 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-[820px]">
          <div
            aria-hidden="true"
            className="absolute bottom-7 left-[19px] top-7 w-[3px] sm:left-[21px]"
          >
            <span className="absolute inset-0 rounded-full bg-[#E8EFF4]" />

            <motion.span
              className="absolute inset-0 origin-top rounded-full bg-sky"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: progreso }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 1.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformOrigin: "top center",
              }}
            />
          </div>

          <ol className="relative flex flex-col gap-3">
            {PASOS.map((paso) => {
              const completado = paso.estado === "completado";
              const esActual = paso.estado === "actual";
              const pendiente = paso.estado === "pendiente";

              return (
                <motion.li
                  key={paso.numero}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.48,
                    delay: Math.min(
                      (paso.numero - 1) * 0.05,
                      0.2,
                    ),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-5"
                  aria-current={esActual ? "step" : undefined}
                >
                  <div className="relative z-20 flex justify-center pt-4">
                    <motion.span
                      initial={{
                        scale: 0.65,
                        opacity: 0,
                      }}
                      whileInView={{
                        scale: 1,
                        opacity: 1,
                      }}
                      animate={
                        esActual
                          ? {
                              scale: [1, 1.08, 1],
                              boxShadow: [
                                "0 0 0 0 rgba(95, 218, 248, 0)",
                                "0 0 0 10px rgba(95, 218, 248, 0.22)",
                                "0 0 0 0 rgba(95, 218, 248, 0)",
                              ],
                            }
                          : undefined
                      }
                      viewport={{
                        once: true,
                        amount: 0.5,
                      }}
                      transition={
                        esActual
                          ? {
                              scale: {
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                              },
                              boxShadow: {
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                              },
                            }
                          : {
                              type: "spring",
                              stiffness: 280,
                              damping: 18,
                            }
                      }
                      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold sm:h-11 sm:w-11 ${
                        completado
                          ? "bg-ink text-white"
                          : esActual
                            ? "bg-ink text-[#5FDAF8] ring-[4px] ring-[#5FDAF8]/35"
                            : "bg-[#EEF3F6] text-[#96A5B2]"
                      }`}
                    >
                      {completado ? (
                        <Check
                          className="h-5 w-5"
                          strokeWidth={2.6}
                        />
                      ) : (
                        paso.numero
                      )}
                    </motion.span>
                  </div>

                  <div
                    className={`rounded-[18px] px-4 py-4 sm:px-5 ${
                      esActual
                        ? "bg-[#5FDAF8]"
                        : "bg-[#FAFCFD]"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-[15px] font-extrabold sm:text-[16px] ${
                              pendiente
                                ? "text-[#7F8F9D]"
                                : "text-ink"
                            }`}
                          >
                            {paso.titulo}
                          </h3>

                          {esActual ? (
                            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-extrabold text-white">
                              Estás aquí
                            </span>
                          ) : null}
                        </div>

                        <p
                          className={`mt-1.5 max-w-2xl text-[12.5px] leading-5 ${
                            esActual
                              ? "text-black"
                              : pendiente
                                ? "text-[#96A5B2]"
                                : "text-[#6A7F94]"
                          }`}
                        >
                          {paso.descripcion}
                        </p>
                      </div>
                    </div>

                    {paso.meta ? (
                      <div
                        className={`mt-3 flex items-start gap-2 text-[11.5px] font-bold ${
                          esActual
                            ? "text-black"
                            : "text-[#687B8D]"
                        }`}
                      >
                        {paso.numero === 2 ? (
                          <UserRound
                            className="mt-0.5 h-4 w-4 shrink-0"
                            strokeWidth={2}
                          />
                        ) : (
                          <MapPin
                            className="mt-0.5 h-4 w-4 shrink-0"
                            strokeWidth={2}
                          />
                        )}

                        <span>{paso.meta}</span>
                      </div>
                    ) : null}

                    {paso.acciones?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {paso.acciones.map((accion) => {
                          const clases =
                            "inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-2 text-[11px] font-extrabold text-white transition-opacity hover:opacity-80";

                          if (accion.externa) {
                            return (
                              <a
                                key={accion.label}
                                href={accion.href}
                                target="_blank"
                                rel="noreferrer"
                                className={clases}
                              >
                                <IconoAccion tipo={accion.icono} />
                                {accion.label}
                                <ExternalLink
                                  className="h-3 w-3"
                                  strokeWidth={2}
                                />
                              </a>
                            );
                          }

                          return (
                            <Link
                              key={accion.label}
                              href={accion.href}
                              className={clases}
                            >
                              <IconoAccion tipo={accion.icono} />
                              {accion.label}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
