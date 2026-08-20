"use client";

import HeroKivoImage from "@/components/ui/HeroKivoImage";

import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  FileText,
  ShieldCheck,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

const POLIZA = {
  numeroPrestamo: "KV-CR-00184",
  aseguradora: "Seguros Kivo",
  numeroPoliza: "POL-00012345",
  titular: "Hugo Soliz Vedia",
  asegurados: "1",
  tipoSeguro: "Protección de pago de préstamo",
  inicio: "30/03/2026",
  vencimiento: "30/03/2027",
  valorAsegurado: "Bs 42.000",
};

const COBERTURAS = [
  "Incapacidad total y permanente",
  "Desempleo involuntario",
  "Fallecimiento",
];

function Dato({
  icono: Icono,
  label,
  children,
}: {
  icono: typeof ShieldCheck;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-[#EAF7FE] text-primary-dark">
        <Icono className="h-4 w-4" strokeWidth={2} />
      </span>

      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8A9CAD]">
          {label}
        </p>

        <div className="mt-1 text-[13px] font-extrabold text-ink">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SegurosView() {
  return (
    <div className="flex flex-col gap-4">

      {/* CABECERA */}
      <section className="overflow-hidden rounded-[26px] border border-[#E9F0F6] bg-white">
        {/* HERO */}
        <div className="relative overflow-hidden px-5 py-7 sm:px-7 sm:py-8">
          <HeroKivoImage />

          <div className="relative z-10 max-w-[760px]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#03AEFE]">
              Mi préstamo
            </p>

            <h1 className="mt-2 max-w-xl text-2xl font-extrabold tracking-tight text-ink sm:text-[30px] sm:leading-[1.15]">
              Póliza de seguros
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6A7F94]">
              Consulta la cobertura de seguro asociada a tu préstamo Kivo.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10.5px] font-extrabold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5FDAF8]" />
              Póliza activa
            </div>
          </div>
        </div>

        {/* DATOS PRINCIPALES */}
        <div className="border-t border-[#EEF3F6] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[15px] bg-[#DDF6FD] text-[#075578]">
                <ShieldCheck className="h-6 w-6" strokeWidth={2.1} />
              </span>

              <div>
                <p className="text-[15px] font-extrabold text-ink">
                  Préstamo {POLIZA.numeroPrestamo}
                </p>

                <p className="mt-1 text-[12px] text-[#6A7F94]">
                  Póliza asociada a tu préstamo
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[430px]">
              <div className="border-l border-[#E9F0F6] pl-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8A9CAD]">
                  Fecha de inicio
                </p>
                <p className="mt-1 text-[13px] font-extrabold text-ink">
                  {POLIZA.inicio}
                </p>
              </div>

              <div className="border-l border-[#E9F0F6] pl-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8A9CAD]">
                  Fecha de vencimiento
                </p>
                <p className="mt-1 text-[13px] font-extrabold text-ink">
                  {POLIZA.vencimiento}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AVISO */}
      <section className="rounded-[22px] bg-[#5FDAF8] px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-white">
            <CircleCheck className="h-4 w-4" strokeWidth={2.2} />
          </span>

          <div>
            <p className="text-sm font-extrabold text-black">
              Tu póliza está activa
            </p>

            <p className="mt-1 max-w-3xl text-[12.5px] leading-5 text-black/70">
              Este seguro protege tu préstamo ante determinados imprevistos.
              Si tienes dudas o necesitas asistencia, comunícate con Kivo.
            </p>
          </div>
        </div>
      </section>

      {/* RESUMEN */}
      <section className="rounded-[26px] border border-[#E9F0F6] bg-white p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-primary">
            Resumen de tu póliza
          </p>

          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
            Información del seguro
          </h2>
        </div>

        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
          <Dato icono={ShieldCheck} label="Aseguradora">
            {POLIZA.aseguradora}
          </Dato>

          <Dato icono={FileText} label="Número de póliza">
            {POLIZA.numeroPoliza}
          </Dato>

          <Dato icono={UserRound} label="Titular">
            {POLIZA.titular}
          </Dato>

          <Dato icono={UsersRound} label="Asegurados">
            {POLIZA.asegurados}
          </Dato>

          <Dato icono={ShieldCheck} label="Tipo de seguro">
            {POLIZA.tipoSeguro}
          </Dato>

          <Dato icono={CalendarDays} label="Vigencia">
            {POLIZA.inicio} al {POLIZA.vencimiento}
          </Dato>

          <Dato icono={WalletCards} label="Valor asegurado">
            {POLIZA.valorAsegurado}
          </Dato>

          <Dato icono={CircleCheck} label="Estado">
            <span className="inline-flex items-center gap-1.5 text-[#087D43]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#04D99D]" />
              Activa
            </span>
          </Dato>
        </div>
      </section>

      {/* COBERTURAS */}
      <section className="rounded-[26px] border border-[#E9F0F6] bg-white p-5 sm:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-primary">
          Coberturas incluidas
        </p>

        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
          ¿Qué cubre tu seguro?
        </h2>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {COBERTURAS.map((cobertura) => (
            <div
              key={cobertura}
              className="flex items-center gap-3 rounded-[18px] border border-[#E9F0F6] bg-white px-4 py-4"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white">
                <Check className="h-4 w-4" strokeWidth={2.4} />
              </span>

              <p className="text-[12.5px] font-extrabold text-ink">
                {cobertura}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 text-[12px] font-extrabold text-primary-dark"
        >
          Ver todas las coberturas y condiciones
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </section>

      {/* DOCUMENTO */}
      <section className="rounded-[26px] border border-[#E9F0F6] bg-white p-5 sm:p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-primary">
          Documento de la póliza
        </p>

        <div className="mt-4 flex flex-col gap-4 rounded-[20px] border border-[#E9F0F6] p-4 sm:flex-row sm:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[15px] bg-[#EAF7FE] text-primary-dark">
            <FileText className="h-6 w-6" strokeWidth={2} />
          </span>

          <div className="min-w-0">
            <p className="text-[14px] font-extrabold text-ink">
              Póliza de seguro
            </p>

            <p className="mt-1 text-[12px] text-[#6A7F94]">
              Póliza N.º {POLIZA.numeroPoliza}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[13px] bg-black px-4 py-2.5 text-[11px] font-extrabold text-white sm:ml-auto"
          >
            Ver póliza completa
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </section>
    </div>
  );
}
