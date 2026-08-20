"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeroKivoImage from "@/components/ui/HeroKivoImage";

import {
  Bell,
  CalendarClock,
  Check,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  FileText,
  UserRound,
} from "lucide-react";

type TipoNotificacion =
  | "documento"
  | "observacion"
  | "estado"
  | "asesor"
  | "recordatorio";

type Notificacion = {
  id: number;
  tipo: TipoNotificacion;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  leida: boolean;
  accion?: string;
  href?: string;
};

const NOTIFICACIONES: Notificacion[] = [
  {
    id: 1,
    tipo: "documento",
    titulo: "Necesitamos un documento adicional",
    descripcion:
      "Adjunta tu extracto bancario de los últimos 3 meses para continuar con la evaluación de tu solicitud.",
    fecha: "Hoy",
    hora: "18:40",
    leida: false,
    accion: "Ver requerimiento",
    href: "/documentos",
  },
  {
    id: 2,
    tipo: "observacion",
    titulo: "Tu documento necesita ser actualizado",
    descripcion:
      "La fotografía de tu carnet no permite validar correctamente algunos datos. Vuelve a cargar una imagen más clara.",
    fecha: "Hoy",
    hora: "15:20",
    leida: false,
    accion: "Actualizar documento",
    href: "/documentos",
  },
  {
    id: 3,
    tipo: "estado",
    titulo: "Tu solicitud está en evaluación",
    descripcion:
      "Nuestro equipo está revisando tu información financiera y los documentos enviados.",
    fecha: "Hoy",
    hora: "09:15",
    leida: false,
    accion: "Ver seguimiento",
    href: "/seguimiento",
  },
  {
    id: 4,
    tipo: "asesor",
    titulo: "Ya tienes un asesor asignado",
    descripcion:
      "Diego Fernández acompañará tu solicitud y podrá contactarte si necesitamos información adicional.",
    fecha: "Ayer",
    hora: "16:45",
    leida: true,
    accion: "Ver seguimiento",
    href: "/seguimiento",
  },
  {
    id: 5,
    tipo: "recordatorio",
    titulo: "Recuerda tu próxima cuota",
    descripcion:
      "Tu próxima cuota vence el 05 de septiembre. Puedes consultar tu plan de pagos desde Kivo.",
    fecha: "18 ago",
    hora: "10:30",
    leida: true,
    accion: "Ver cuotas",
    href: "/cuotas",
  },
];

function obtenerIcono(tipo: TipoNotificacion) {
  switch (tipo) {
    case "documento":
      return FileText;
    case "observacion":
      return CircleAlert;
    case "estado":
      return FileCheck2;
    case "asesor":
      return UserRound;
    case "recordatorio":
      return CalendarClock;
  }
}

function obtenerEstilo(tipo: TipoNotificacion) {
  switch (tipo) {
    case "documento":
      return {
        fondo: "bg-[#EAF9FF]",
        texto: "text-[#0878EA]",
      };

    case "observacion":
      return {
        fondo: "bg-[#FFF1E8]",
        texto: "text-[#E77600]",
      };

    case "estado":
      return {
        fondo: "bg-[#EAF9FF]",
        texto: "text-black",
      };

    case "asesor":
      return {
        fondo: "bg-[#F1EDFF]",
        texto: "text-[#6F32C9]",
      };

    case "recordatorio":
      return {
        fondo: "bg-[#FFF6DF]",
        texto: "text-[#B87900]",
      };
  }
}

export default function NotificacionesView() {
  const [notificaciones, setNotificaciones] =
    useState<Notificacion[]>(NOTIFICACIONES);

  useEffect(() => {
    const guardadas = localStorage.getItem("kivo-notificaciones-leidas");

    if (!guardadas) return;

    try {
      const idsLeidos: number[] = JSON.parse(guardadas);

      setNotificaciones(
        NOTIFICACIONES.map((notificacion) => ({
          ...notificacion,
          leida: notificacion.leida || idsLeidos.includes(notificacion.id),
        })),
      );
    } catch {
      localStorage.removeItem("kivo-notificaciones-leidas");
    }
  }, []);

  const noLeidas = notificaciones.filter(
    (notificacion) => !notificacion.leida,
  ).length;

  const marcarTodasComoLeidas = () => {
    const actualizadas = notificaciones.map((notificacion) => ({
      ...notificacion,
      leida: true,
    }));

    setNotificaciones(actualizadas);

    localStorage.setItem(
      "kivo-notificaciones-leidas",
      JSON.stringify(actualizadas.map((notificacion) => notificacion.id)),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* CABECERA */}
      <section className="overflow-hidden rounded-[26px] border border-[#E9F0F6] bg-white">
        <div className="relative overflow-hidden px-5 py-7 sm:px-7 sm:py-8">
          <HeroKivoImage />

          <div className="relative z-10 max-w-[760px]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#03AEFE]">
              Mi solicitud
            </p>

            <h1 className="mt-2 max-w-xl text-2xl font-extrabold tracking-tight text-ink sm:text-[30px] sm:leading-[1.15]">
              Notificaciones
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6A7F94]">
              Aquí te avisaremos cuando necesitemos información, documentos
              o exista alguna novedad en tu solicitud.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10.5px] font-extrabold text-white">
              <Bell className="h-3.5 w-3.5" strokeWidth={2.2} />
              {noLeidas} nuevas
            </div>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="overflow-hidden rounded-[26px] border border-[#E9F0F6] bg-white">
        <div className="flex items-center justify-between border-b border-[#EEF3F6] px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-primary">
              Actividad reciente
            </p>

            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-ink">
              Tus novedades
            </h2>
          </div>

        </div>

        <div>
          {notificaciones.map((notificacion, index) => {
            const Icono = obtenerIcono(notificacion.tipo);
            const estilo = obtenerEstilo(notificacion.tipo);

            return (
              <article
                key={notificacion.id}
                className={`relative px-5 py-5 sm:px-6 ${
                  index > 0 ? "border-t border-[#EEF3F6]" : ""
                } ${
                  !notificacion.leida
                    ? "bg-[#F4FBFE]"
                    : "bg-white"
                }`}
              >
                {!notificacion.leida ? (
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-[#5FDAF8]" />
                ) : null}

                <div className="flex items-start gap-4">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] ${estilo.fondo} ${estilo.texto}`}
                  >
                    <Icono className="h-5 w-5" strokeWidth={2} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-[14px] ${
                              !notificacion.leida
                                ? "font-extrabold text-ink"
                                : "font-bold text-[#53697D]"
                            }`}
                          >
                            {notificacion.titulo}
                          </h3>

                          {!notificacion.leida ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F7FF] px-2 py-1 text-[9.5px] font-extrabold text-[#0878EA]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#03AEFE]" />
                              Nueva
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2F5F7] px-2 py-1 text-[9.5px] font-bold text-[#8495A5]">
                              <Check className="h-3 w-3" strokeWidth={2.3} />
                              Leída
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-1.5 max-w-3xl text-[12.5px] leading-5 ${
                            !notificacion.leida
                              ? "text-[#53697D]"
                              : "text-[#8A9CAD]"
                          }`}
                        >
                          {notificacion.descripcion}
                        </p>
                      </div>

                      <p className="shrink-0 text-[10.5px] font-bold text-[#97A8B8]">
                        {notificacion.fecha} · {notificacion.hora}
                      </p>
                    </div>

                    {notificacion.accion && notificacion.href ? (
                      <Link
                        href={notificacion.href}
                        className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-extrabold text-primary-dark"
                      >
                        {notificacion.accion}
                        <ChevronRight
                          className="h-4 w-4"
                          strokeWidth={2.1}
                        />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* INFO */}
      <section className="rounded-[22px] bg-[#EAF9FF] px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-white">
            <Bell className="h-4 w-4" strokeWidth={2.1} />
          </span>

          <div>
            <p className="text-[13px] font-extrabold text-ink">
              Mantente pendiente de tus notificaciones
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#63788C]">
              Algunas solicitudes pueden requerir documentos o información
              adicional antes de continuar con la evaluación.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
