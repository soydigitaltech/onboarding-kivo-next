"use client";

import { useState } from "react";
import { Download, Pencil } from "lucide-react";

import {
  DATOS_CAPTURADOS,
  BLOQUES_PERFIL,
  PORCENTAJE_PERFIL,
} from "@/lib/kivo/datos";

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

function AnilloPerfil() {
  const radio = 56;
  const circunferencia = 2 * Math.PI * radio;
  const cantidad = BLOQUES_PERFIL.length;
  const separacion = 9;
  const segmento = circunferencia / cantidad;
  const arco = segmento - separacion;

  return (
    <div className="relative h-[132px] w-[132px] shrink-0">
      <svg
        width={132}
        height={132}
        viewBox="0 0 132 132"
        className="-rotate-90"
      >
        {BLOQUES_PERFIL.map((bloque, index) => {
          const offset = -(index * segmento + separacion / 2);
          const lleno = arco * bloque.avance;

          return (
            <g key={bloque.nombre}>
              <circle
                cx={66}
                cy={66}
                r={radio}
                fill="none"
                stroke="#E9F0F6"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={`${arco} ${circunferencia - arco}`}
                strokeDashoffset={offset}
              />

              {bloque.avance > 0 ? (
                <circle
                  cx={66}
                  cy={66}
                  r={radio}
                  fill="none"
                  stroke={bloque.avance === 1 ? "#03AEFE" : "#5FDAF8"}
                  strokeWidth={12}
                  strokeLinecap="round"
                  strokeDasharray={`${lleno} ${circunferencia - lleno}`}
                  strokeDashoffset={offset}
                />
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0 grid place-content-center text-center">
        <b className="text-[29px] font-extrabold leading-none tracking-tighter">
          {PORCENTAJE_PERFIL}%
        </b>
        <span className="text-[11px] font-extrabold text-[#6A7F94]">
          completo
        </span>
      </div>
    </div>
  );
}

export default function PerfilView() {
  const [tab, setTab] = useState<string>("Personales");

  return (
    <div className="flex flex-col gap-4">
      <Tarjeta>
        <div className="flex flex-wrap items-start gap-5 p-5 sm:p-6">
          <AnilloPerfil />

          <div className="min-w-[240px] flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
              Estado del perfil
            </p>

            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
              Tu perfil está {PORCENTAJE_PERFIL}% completo
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6A7F94]">
              Completar tus datos ayuda a que Kivo pueda revisar tu solicitud
              con mayor rapidez.
            </p>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {BLOQUES_PERFIL.map((bloque) => (
                <li
                  key={bloque.nombre}
                  className="flex items-center justify-between rounded-xl bg-[#F5F9FC] px-3 py-2.5"
                >
                  <span className="text-sm font-bold text-[#43596F]">
                    {bloque.nombre}
                  </span>

                  <span className="text-xs font-extrabold text-primary-dark">
                    {bloque.avance === 1
                      ? "Completo"
                      : bloque.avance > 0
                        ? `${Math.round(bloque.avance * 100)}%`
                        : "Pendiente"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Tarjeta>

      <Tarjeta>
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
            Mi información
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
            Tus datos registrados
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6A7F94]">
            Puedes revisar la información registrada en Kivo mientras tu
            solicitud siga abierta.
          </p>
        </div>

        <div
          className="mt-4 flex flex-wrap gap-1.5 border-b border-[#F2F7FB] px-5 sm:px-6"
          role="tablist"
          aria-label="Secciones del perfil"
        >
          {Object.keys(DATOS_CAPTURADOS).map((clave) => (
            <button
              key={clave}
              type="button"
              role="tab"
              aria-selected={tab === clave}
              onClick={() => setTab(clave)}
              className={`-mb-px rounded-t-xl border-b-[3px] px-3.5 py-2.5 text-[13.5px] font-bold transition ${
                tab === clave
                  ? "border-primary bg-[#EAF7FE] text-primary-dark"
                  : "border-transparent text-[#6A7F94] hover:text-primary-dark"
              }`}
            >
              {clave}
            </button>
          ))}
        </div>

        <dl className="grid gap-5 px-5 pb-6 pt-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {DATOS_CAPTURADOS[tab].map((campo) => (
            <div key={campo.etiqueta}>
              <dt className="mb-0.5 text-[11.5px] font-extrabold uppercase tracking-wide text-[#9DAEBF]">
                {campo.etiqueta}
              </dt>

              <dd
                className={`text-[14.5px] font-bold ${
                  campo.falta
                    ? "italic font-semibold text-[#9DAEBF]"
                    : "text-ink"
                }`}
              >
                {campo.valor}

                {campo.verificado ? (
                  <span className="ml-1.5 rounded-full bg-[#EAF8F0] px-2 py-px align-[2px] text-[11px] font-extrabold text-[#1B8B52]">
                    verificado
                  </span>
                ) : null}

                {campo.porVerificar ? (
                  <span className="ml-1.5 rounded-full bg-[#FFF5E4] px-2 py-px align-[2px] text-[11px] font-extrabold text-[#B0730B]">
                    por verificar
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-4 border-t border-[#F2F7FB] px-5 py-4 sm:px-6">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-primary-dark"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2.4} />
            Editar este bloque
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-primary-dark"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2.4} />
            Descargar mi solicitud
          </button>
        </div>
      </Tarjeta>
    </div>
  );
}
