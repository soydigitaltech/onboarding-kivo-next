"use client";

import { useMemo, useState } from "react";
import HeroKivoImage from "@/components/ui/HeroKivoImage";

import {
  CalendarDays,
  Check,
  ChevronRight,
  FileText,
  Info,
  LockKeyhole,
  ReceiptText,
  WalletCards,
} from "lucide-react";

type FiltroFacturacion = "todos" | "2026" | "2025";

type DocumentoFacturacion = {
  id: string;
  titulo: string;
  cuota?: string;
  fecha: string;
  concepto: string;
  valor: string;
  estado: "pagado";
  anio: "2026" | "2025";
};

const DOCUMENTOS: DocumentoFacturacion[] = [
  {
    id: "000005",
    titulo: "Factura / Documento #000005",
    cuota: "Cuota 4 de 12",
    fecha: "30/07/2026",
    concepto: "Pago de cuota",
    valor: "Bs 350.000",
    estado: "pagado",
    anio: "2026",
  },
  {
    id: "000004",
    titulo: "Factura / Documento #000004",
    cuota: "Cuota 3 de 12",
    fecha: "30/06/2026",
    concepto: "Pago de cuota",
    valor: "Bs 350.000",
    estado: "pagado",
    anio: "2026",
  },
  {
    id: "000003",
    titulo: "Factura / Documento #000003",
    cuota: "Cuota 2 de 12",
    fecha: "30/05/2026",
    concepto: "Pago de cuota",
    valor: "Bs 350.000",
    estado: "pagado",
    anio: "2026",
  },
  {
    id: "000002",
    titulo: "Factura / Documento #000002",
    cuota: "Cuota 1 de 12",
    fecha: "30/04/2026",
    concepto: "Pago de cuota",
    valor: "Bs 350.000",
    estado: "pagado",
    anio: "2026",
  },
];

export default function FacturacionView() {
  const [filtro, setFiltro] = useState<FiltroFacturacion>("todos");

  const documentos = useMemo(() => {
    if (filtro === "todos") return DOCUMENTOS;
    return DOCUMENTOS.filter((documento) => documento.anio === filtro);
  }, [filtro]);

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
              Facturación
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6A7F94]">
              Consulta los documentos generados por los pagos y movimientos
              asociados a tu préstamo.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10.5px] font-extrabold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5FDAF8]" />
              Documentos disponibles
            </div>
          </div>
        </div>

        {/* DATOS PRINCIPALES */}
        <div className="border-t border-[#EEF3F6] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[15px] bg-[#DDF6FD] text-[#075578]">
                <ReceiptText className="h-6 w-6" strokeWidth={2.1} />
              </span>

              <div>
                <p className="text-[15px] font-extrabold text-ink">
                  Préstamo KV-CR-00184
                </p>

                <p className="mt-1 text-[12px] text-[#6A7F94]">
                  Facturación de tu préstamo
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[430px]">
              <div className="border-l border-[#E9F0F6] pl-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8A9CAD]">
                  Documentos emitidos
                </p>

                <p className="mt-1 text-[13px] font-extrabold text-ink">
                  {DOCUMENTOS.length}
                </p>
              </div>

              <div className="border-l border-[#E9F0F6] pl-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8A9CAD]">
                  Último documento
                </p>

                <p className="mt-1 text-[13px] font-extrabold text-ink">
                  30/07/2026
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
            <Info className="h-4 w-4" strokeWidth={2.2} />
          </span>

          <div>
            <p className="text-sm font-extrabold text-black">
              Tus documentos de facturación
            </p>

            <p className="mt-1 max-w-3xl text-[12.5px] leading-5 text-black/70">
              Aquí puedes consultar las facturas y documentos generados por los
              pagos y movimientos realizados en tu préstamo.
            </p>
          </div>
        </div>
      </section>

      {/* DOCUMENTOS */}
      <section className="rounded-[26px] border border-[#E9F0F6] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-primary">
              Mis documentos
            </p>

            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink">
              Facturas y comprobantes
            </h2>
          </div>

          <div className="flex w-fit rounded-full bg-[#F2F7FB] p-1">
            {(
              [
                ["todos", "Todos"],
                ["2026", "2026"],
                ["2025", "2025"],
              ] as [FiltroFacturacion, string][]
            ).map(([valor, label]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setFiltro(valor)}
                aria-pressed={filtro === valor}
                className={`rounded-full px-4 py-2 text-[11px] font-extrabold transition ${
                  filtro === valor
                    ? "bg-black text-white"
                    : "text-[#6A7F94]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[20px] border border-[#E9F0F6]">
          {documentos.map((documento, index) => (
            <article
              key={documento.id}
              className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5 ${
                index > 0 ? "border-t border-[#E9F0F6]" : ""
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#EAF7FE] text-primary-dark">
                <FileText className="h-5 w-5" strokeWidth={2} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[14px] font-extrabold text-ink">
                    {documento.titulo}
                  </h3>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF8F0] px-2.5 py-1 text-[10px] font-extrabold text-[#087D43]">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                    Pagado
                  </span>
                </div>

                {documento.cuota ? (
                  <p className="mt-1 text-[11.5px] font-extrabold text-primary-dark">
                    {documento.cuota}
                  </p>
                ) : null}

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] text-[#6A7F94]">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
                    Fecha de emisión: {documento.fecha}
                  </span>

                  <span>
                    Concepto:{" "}
                    <strong className="font-bold text-ink">
                      {documento.concepto}
                    </strong>
                  </span>

                  <span>
                    Valor:{" "}
                    <strong className="font-bold text-ink">
                      {documento.valor}
                    </strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-extrabold text-primary-dark"
              >
                Ver documento
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* SEGURIDAD */}
      <section className="rounded-[22px] border border-[#E9F0F6] bg-white px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EAF7FE] text-primary-dark">
            <LockKeyhole className="h-4 w-4" strokeWidth={2.2} />
          </span>

          <div>
            <p className="text-sm font-extrabold text-ink">
              Tus documentos son archivos seguros
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#6A7F94]">
              Solo tú puedes consultar los documentos vinculados a tu préstamo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
