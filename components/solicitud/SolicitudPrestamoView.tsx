"use client";

import Link from "next/link";
import HeroKivoImage from "@/components/ui/HeroKivoImage";
import {
  ArrowRight,
  BadgeDollarSign,
  RefreshCcw,
  ShieldCheck,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { WHATSAPP_KIVO } from "@/lib/kivo/datos";

type TipoSolicitud = {
  titulo: string;
  descripcion: string;
  href: string;
  icono: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const OPCIONES: TipoSolicitud[] = [
  {
    titulo: "Préstamo nuevo",
    descripcion: "Solicita un nuevo préstamo para seguir creciendo.",
    href: "/onboarding?tipo=nuevo",
    icono: WalletCards,
    iconBg: "bg-[#DDF6FD]",
    iconColor: "text-[#075578]",
  },
  {
    titulo: "Refinanciamiento",
    descripcion:
      "Mejora las condiciones de tu préstamo actual y obtén mejores beneficios.",
    href: "/onboarding?tipo=refinanciamiento",
    icono: RefreshCcw,
    iconBg: "bg-[#F2E9FF]",
    iconColor: "text-[#7C16D8]",
  },
  {
    titulo: "Reestructuración",
    descripcion:
      "Ajusta tus condiciones de pago para que se adapten a tu situación actual.",
    href: "/onboarding?tipo=reestructuracion",
    icono: BadgeDollarSign,
    iconBg: "bg-[#FFF1E3]",
    iconColor: "text-[#FE9806]",
  },
  {
    titulo: "Préstamo con garantía",
    descripcion:
      "Obtén un préstamo ofreciendo un bien como garantía.",
    href: "/onboarding?tipo=garantia",
    icono: ShieldCheck,
    iconBg: "bg-[#FFF6D8]",
    iconColor: "text-[#C99300]",
  },
];

export default function SolicitudPrestamoView() {
  return (
    <div className="flex flex-col gap-4">
      {/* HERO */}
      <section className="overflow-hidden rounded-[26px] border border-[#E9F0F6] bg-white">
        <div className="relative overflow-hidden px-5 py-7 sm:px-7 sm:py-8">
          <HeroKivoImage />

          <div className="relative z-10 max-w-[760px]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#03AEFE]">
              Mi solicitud
            </p>

            <h1 className="mt-2 max-w-xl text-2xl font-extrabold tracking-tight text-ink sm:text-[30px] sm:leading-[1.15]">
              ¿Qué necesitas hoy?
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6A7F94]">
              Selecciona el tipo de solicitud que deseas realizar con Kivo.
              Te guiaremos paso a paso durante todo el proceso.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10.5px] font-extrabold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5FDAF8]" />
              Solicitud de préstamo
            </div>
          </div>
        </div>
      </section>

      {/* OPCIONES */}
      <section className="rounded-[26px] border border-[#E9F0F6] bg-white p-5 sm:p-6">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#03AEFE]">
            Tipo de solicitud
          </p>

          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
            Elige una opción
          </h2>

          <p className="mt-1 text-[12.5px] leading-5 text-[#6A7F94]">
            Selecciona la alternativa que mejor se ajuste a lo que necesitas.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {OPCIONES.map((opcion) => {
            const Icono = opcion.icono;

            return (
              <Link
                key={opcion.titulo}
                href={opcion.href}
                className="group relative flex min-h-[190px] flex-col rounded-[22px] border border-[#E7EEF4] bg-white p-5 transition-colors hover:border-[#5FDAF8] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[15px] ${opcion.iconBg} ${opcion.iconColor}`}
                  >
                    <Icono className="h-6 w-6" strokeWidth={2} />
                  </span>

                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F4F8FA] text-[#688092] transition-colors group-hover:bg-black group-hover:text-white">
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2.2}
                    />
                  </span>
                </div>

                <div className="mt-auto pt-6">
                  <h3 className="text-[17px] font-extrabold tracking-tight text-ink">
                    {opcion.titulo}
                  </h3>

                  <p className="mt-1.5 max-w-md text-[12.5px] leading-5 text-[#63788C]">
                    {opcion.descripcion}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* INFO */}
      <section className="rounded-[22px] bg-black px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-white text-black">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
            </span>

            <div>
              <p className="text-[12px] font-extrabold text-white">
                Antes de comenzar
              </p>

              <p className="mt-1 max-w-3xl text-[12px] leading-5 text-white/70">
                Te pediremos algunos datos personales, información financiera y
                documentos para evaluar tu solicitud.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_KIVO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-white px-5 text-[12px] font-extrabold text-black transition hover:bg-[#F3F6F8]"
            >
              Hablar con un asesor
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </a>

            <a
              href={WHATSAPP_KIVO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-white px-5 text-[12px] font-extrabold text-black transition hover:bg-[#F3F6F8]"
            >
              Atención al cliente
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
