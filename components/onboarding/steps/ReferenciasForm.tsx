"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useOnboardingStore } from "@/store/onboarding";
import {
  referenciasSchema,
  type ReferenciasValues,
} from "@/lib/schemas/referencias";

const EMPTY_VALUES: ReferenciasValues = {
  personal1: {
    nombreCompleto: "",
    relacion: "",
    celular: "",
  },
  personal2: {
    nombreCompleto: "",
    relacion: "",
    celular: "",
  },
  laboralComercial: {
    nombreCompleto: "",
    relacion: "",
    celular: "",
  },
};

export function ReferenciasForm() {
  const datosFinancieros = useOnboardingStore(
    (state) => state.datosFinancieros,
  );

  const guardados = useOnboardingStore(
    (state) => state.referencias,
  );

  const setReferencias = useOnboardingStore(
    (state) => state.setReferencias,
  );

  const completeAndAdvance = useOnboardingStore(
    (state) => state.completeAndAdvance,
  );

  const editStep = useOnboardingStore(
    (state) => state.editStep,
  );

  const esAsalariado =
    datosFinancieros?.perfilLaboral === "ASALARIADO";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ReferenciasValues>({
    resolver: zodResolver(referenciasSchema),
    mode: "onChange",
    defaultValues: guardados ?? EMPTY_VALUES,
  });

  const onSubmit = (values: ReferenciasValues) => {
    setReferencias(values);
    completeAndAdvance("referencias");
  };

  const inputClass =
    "mt-1.5 min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10";

  const errorClass = "mt-1.5 text-xs font-medium text-red-600";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Registra personas que podamos contactar como referencia durante
        la evaluación de tu solicitud.
      </p>

      <div className="space-y-7">
        <section>
          <h3 className="text-base font-extrabold text-ink">
            Referencia personal 1
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-ink">
                Nombre completo
              </label>
              <input
                {...register("personal1.nombreCompleto")}
                className={inputClass}
                placeholder="Ej. María Fernández"
              />
              {errors.personal1?.nombreCompleto && (
                <p className={errorClass}>
                  {errors.personal1.nombreCompleto.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-ink">
                Parentesco o relación
              </label>
              <input
                {...register("personal1.relacion")}
                className={inputClass}
                placeholder="Ej. Hermana"
              />
              {errors.personal1?.relacion && (
                <p className={errorClass}>
                  {errors.personal1.relacion.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-ink">
                Celular
              </label>
              <input
                {...register("personal1.celular")}
                className={inputClass}
                inputMode="numeric"
                placeholder="Ej. 71234567"
              />
              {errors.personal1?.celular && (
                <p className={errorClass}>
                  {errors.personal1.celular.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-black/8 pt-7">
          <h3 className="text-base font-extrabold text-ink">
            Referencia personal 2
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-ink">
                Nombre completo
              </label>
              <input
                {...register("personal2.nombreCompleto")}
                className={inputClass}
                placeholder="Ej. Carlos Mendoza"
              />
              {errors.personal2?.nombreCompleto && (
                <p className={errorClass}>
                  {errors.personal2.nombreCompleto.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-ink">
                Parentesco o relación
              </label>
              <input
                {...register("personal2.relacion")}
                className={inputClass}
                placeholder="Ej. Amigo"
              />
              {errors.personal2?.relacion && (
                <p className={errorClass}>
                  {errors.personal2.relacion.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-ink">
                Celular
              </label>
              <input
                {...register("personal2.celular")}
                className={inputClass}
                inputMode="numeric"
                placeholder="Ej. 76543210"
              />
              {errors.personal2?.celular && (
                <p className={errorClass}>
                  {errors.personal2.celular.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-black/8 pt-7">
          <h3 className="text-base font-extrabold text-ink">
            {esAsalariado
              ? "Referencia laboral"
              : "Referencia comercial"}
          </h3>

          <p className="mt-1 text-sm leading-6 text-muted">
            {esAsalariado
              ? "Registra a una persona que pueda confirmar tu relación laboral."
              : "Registra a una persona que conozca tu actividad o negocio."}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-bold text-ink">
                Nombre completo
              </label>
              <input
                {...register("laboralComercial.nombreCompleto")}
                className={inputClass}
                placeholder="Ej. Andrea Vargas"
              />
              {errors.laboralComercial?.nombreCompleto && (
                <p className={errorClass}>
                  {errors.laboralComercial.nombreCompleto.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-ink">
                {esAsalariado
                  ? "Cargo o relación laboral"
                  : "Relación comercial"}
              </label>
              <input
                {...register("laboralComercial.relacion")}
                className={inputClass}
                placeholder={
                  esAsalariado
                    ? "Ej. Supervisora"
                    : "Ej. Proveedor"
                }
              />
              {errors.laboralComercial?.relacion && (
                <p className={errorClass}>
                  {errors.laboralComercial.relacion.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-ink">
                Celular
              </label>
              <input
                {...register("laboralComercial.celular")}
                className={inputClass}
                inputMode="numeric"
                placeholder="Ej. 70123456"
              />
              {errors.laboralComercial?.celular && (
                <p className={errorClass}>
                  {errors.laboralComercial.celular.message}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => editStep("informacion-complementaria")}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <button
          type="submit"
          disabled={!isValid}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continuar
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
