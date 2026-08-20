"use client";

import HeroKivoImage from "@/components/ui/HeroKivoImage";

import {
  Check,
  Clock3,
  Download,
  Eye,
  FileText,
  MapPin,
} from "lucide-react";

type EstadoContrato = "firmado" | "pendiente";

type Contrato = {
  id: string;
  titulo: string;
  numero: string;
  fecha: string;
  estado: EstadoContrato;
  descripcion: string;
  notaria?: string;
};

const CONTRATOS: Contrato[] = [
  {
    id: "contrato-001",
    titulo: "Contrato de préstamo",
    numero: "KV-CR-00184",
    fecha: "19 ago 2026",
    estado: "pendiente",
    descripcion:
      "Consulta aquí la información correspondiente a tu contrato de préstamo.",
    notaria: "Oficinas de Kivo",
  },
];

function EstadoBadge({ estado }: { estado: EstadoContrato }) {
  if (estado === "firmado") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[10.5px] font-extrabold text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        Firmado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5FDAF8] px-3 py-1.5 text-[10.5px] font-extrabold text-black">
      <Clock3 className="h-3.5 w-3.5" strokeWidth={2.3} />
      Pendiente de firma
    </span>
  );
}

export default function ContratosView() {
  return (
    <div className="flex flex-col gap-4">
      <section className="overflow-hidden rounded-[26px] border border-[#E9F0F6] bg-white">
        <div className="relative overflow-hidden px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
          <HeroKivoImage />

          <div className="relative z-10 mt-8 max-w-[760px]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#03AEFE]">
              Mi préstamo
            </p>

            <h1 className="mt-2 max-w-xl text-2xl font-extrabold tracking-tight text-ink sm:text-[30px] sm:leading-[1.15]">
              Mis contratos
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6A7F94]">
              Consulta los contratos y documentos asociados a tu préstamo.
              Aquí podrás revisar su estado y acceder a cada documento.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10.5px] font-extrabold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5FDAF8]" />
              Préstamo KV-CR-00184
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-[#E9F0F6] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-3">
          {CONTRATOS.map((contrato) => (
            <article
              key={contrato.id}
              className="rounded-[20px] border border-[#E9F0F6] bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#E9F7FF] text-primary-dark">
                    <FileText className="h-5 w-5" strokeWidth={2} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-extrabold text-ink sm:text-base">
                        {contrato.titulo}
                      </h2>

                      {contrato.id !== "contrato-001" ? (
                        <EstadoBadge estado={contrato.estado} />
                      ) : null}
                    </div>

                    <p className="mt-1 text-[12px] font-bold text-[#7B8B9B]">
                      {contrato.numero} · {contrato.fecha}
                    </p>

                    <p className="mt-3 max-w-2xl text-[12.5px] leading-5 text-[#6A7F94]">
                      {contrato.descripcion}
                    </p>

                    {contrato.notaria ? (
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Kivo+La+Paz+Bolivia"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-[11.5px] font-bold text-[#687B8D] transition-colors hover:text-ink"
                      >
                        <MapPin
                          className="h-4 w-4 shrink-0"
                          strokeWidth={2}
                        />
                        {contrato.notaria}
                      </a>
                    ) : null}

                    {contrato.id === "contrato-001" ? (
                      <div className="mt-4 rounded-[14px] bg-[#E9F7FF] px-4 py-3">
                        <p className="text-[12px] font-extrabold text-ink">
                          Tu contrato deberá ser recogido en las oficinas de Kivo.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-[11px] font-extrabold text-white transition-opacity hover:opacity-80"
                  >
                    <Eye className="h-4 w-4" strokeWidth={2} />
                    Ver contrato
                  </button>


                  {contrato.estado === "firmado" ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-[#DDE7EE] bg-white px-4 py-2.5 text-[11px] font-extrabold text-ink transition-colors hover:bg-[#F7FBFD]"
                    >
                      <Download className="h-4 w-4" strokeWidth={2} />
                      Descargar PDF
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] bg-[#5FDAF8] px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-white">
            <FileText className="h-4 w-4" strokeWidth={2.2} />
          </div>

          <div>
            <p className="text-sm font-extrabold text-black">
              Tus documentos siempre disponibles
            </p>

            <p className="mt-1 max-w-2xl text-[12.5px] leading-5 text-black/70">
              Cuando un nuevo contrato esté listo para revisión o firma,
              aparecerá automáticamente en esta sección.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
