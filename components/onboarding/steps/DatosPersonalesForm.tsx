"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import {
  CIUDADES,
  ciudadTieneCobertura,
  datosPersonalesSchema,
  type DatosPersonalesValues,
} from "@/lib/schemas/datos-personales";
import { useOnboardingStore } from "@/store/onboarding";
import {
  BusinessNotice,
  Field,
  PrefixedInputShell,
  SelectChevron,
  inputClassName,
  prefixedInputClassName,
  selectClassName,
} from "@/components/ui/fields";

const EMPTY_VALUES: DatosPersonalesValues = {
  nombres: "",
  apellidos: "",
  ci: "",
  fechaNacimiento: "",
  celular: "",
  ciudad: "",
};

export function DatosPersonalesForm() {
  const datosGuardados = useOnboardingStore((s) => s.datosPersonales);
  const setDatosPersonales = useOnboardingStore((s) => s.setDatosPersonales);
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DatosPersonalesValues>({
    resolver: zodResolver(datosPersonalesSchema),
    mode: "onTouched",
    defaultValues: datosGuardados ?? EMPTY_VALUES,
  });

  const ciudadSeleccionada = watch("ciudad");
  const sinCobertura =
    ciudadSeleccionada !== "" && !ciudadTieneCobertura(ciudadSeleccionada);

  const onSubmit = (values: DatosPersonalesValues) => {
    if (!ciudadTieneCobertura(values.ciudad)) return;

    setDatosPersonales(values);
    completeAndAdvance("datos-personales");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        ¡Te damos la bienvenida! Estás a pocos pasos de conocer el préstamo
        compatible contigo. Completa tus datos para comenzar.
      </p>

      <div className="grid gap-5 rounded-2xl border border-border-soft bg-surface p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Nombres" htmlFor="nombres" error={errors.nombres?.message}>
          <input
            id="nombres"
            type="text"
            autoComplete="given-name"
            placeholder="Ej. Sara Valentina"
            className={inputClassName}
            {...register("nombres")}
          />
        </Field>

        <Field
          label="Apellidos"
          htmlFor="apellidos"
          error={errors.apellidos?.message}
        >
          <input
            id="apellidos"
            type="text"
            autoComplete="family-name"
            placeholder="Ej. Gonzales Mamani"
            className={inputClassName}
            {...register("apellidos")}
          />
        </Field>

        <Field
          label="Carnet de identidad"
          htmlFor="ci"
          error={errors.ci?.message}
        >
          <input
            id="ci"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej. 6084527"
            className={inputClassName}
            {...register("ci")}
          />
        </Field>

        <Field
          label="Fecha de nacimiento"
          htmlFor="fechaNacimiento"
          error={errors.fechaNacimiento?.message}
        >
          <input
            id="fechaNacimiento"
            type="date"
            autoComplete="bday"
            className={inputClassName}
            {...register("fechaNacimiento")}
          />
        </Field>

        <Field
          label="Número de celular"
          htmlFor="celular"
          error={errors.celular?.message}
        >
          <PrefixedInputShell prefix="+591">
            <input
              id="celular"
              type="tel"
              inputMode="numeric"
              maxLength={8}
              autoComplete="tel-national"
              placeholder="70000000"
              className={prefixedInputClassName}
              {...register("celular")}
            />
          </PrefixedInputShell>
        </Field>

        <Field
          label="¿En qué ciudad vives?"
          htmlFor="ciudad"
          error={errors.ciudad?.message}
        >
          <div className="relative">
            <select
              id="ciudad"
              className={selectClassName}
              {...register("ciudad")}
            >
              <option value="">Selecciona tu ciudad</option>
              {CIUDADES.map((ciudad) => (
                <option key={ciudad.value} value={ciudad.value}>
                  {ciudad.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </Field>
      </div>

      {/* Regla del negocio: cobertura solo en La Paz y El Alto */}
      <AnimatePresence>
        {sinCobertura ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <BusinessNotice>
                Por ahora Kivo atiende solicitudes en{" "}
                <strong>La Paz y El Alto</strong>. Estamos trabajando para
                llegar pronto a tu ciudad.
              </BusinessNotice>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-6">
        <button
          type="submit"
          disabled={sinCobertura}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(254,152,6,0.35)] transition hover:-translate-y-0.5 hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
        >
          Siguiente paso
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}