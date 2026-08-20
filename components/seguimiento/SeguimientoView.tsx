"use client";

import TimelineSolicitud from "@/components/seguimiento/TimelineSolicitud";

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

import Image from "next/image";

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

type PasoSeguimiento =
  | "solicitud"
  | "asesor"
  | "evaluacion"
  | "firma"
  | "desembolso"
  | "entrega";

const PASOS: { id: PasoSeguimiento; titulo: string }[] = [
  { id: "solicitud", titulo: "Solicitud recibida" },
  { id: "asesor", titulo: "Asesor asignado" },
  { id: "evaluacion", titulo: "En evaluación" },
  { id: "firma", titulo: "Firma de contrato" },
  { id: "desembolso", titulo: "Desembolso" },
  { id: "entrega", titulo: "Entrega de contrato" },
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
 className={`rounded-[26px] border border-[#E9F0F6] bg-white ${className}`}
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
 <div className="relative overflow-hidden rounded-[26px] px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">

  <div className="pointer-events-none absolute -bottom-[18px] top-[18px] right-0 z-0 hidden w-[420px] md:block lg:w-[480px]">
    <span
      aria-hidden="true"
      className="absolute -bottom-[155px] -right-[85px] z-0 h-[560px] w-[620px] rounded-full bg-[#5FDAF8]"
    />

    <Image
      src="/estado-kivo.png"
      alt="Estado de tu solicitud"
      fill
      sizes="(max-width: 1024px) 420px, 480px"
      className="relative z-10 object-cover object-right"
      priority
      unoptimized
    />
  </div>

<div className="relative z-10 mt-8 max-w-[760px]">
  <h1 className="max-w-xl text-2xl font-extrabold tracking-tight text-ink sm:text-[30px] sm:leading-[1.15]">
    Tu solicitud está siendo revisada por nuestro equipo
  </h1>

  <p className="mt-3 max-w-xl text-sm leading-6 text-[#6A7F94]">
    Estamos validando tu información y documentación. Si necesitamos algo
    adicional, te avisaremos por aquí y por WhatsApp.
  </p>

  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10.5px] font-extrabold text-white">
    <span className="h-1.5 w-1.5 rounded-full bg-[#5FDAF8]" />
    Estado actual · En evaluación
  </div>
</div>
 </div>
 </Tarjeta>

 <TimelineSolicitud />

 </div>
 );
}
