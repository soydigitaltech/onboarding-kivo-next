"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import {
  CIUDADES,
  EDAD_MAXIMA,
  EDAD_MINIMA,
  NOMBRE_COMPLETO_REGEX,
  calcularEdad,
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
  nombreCompleto: "",
  ci: "",
  fechaNacimiento: "",
  celular: "",
  ciudad: "",
};

/**
 * Bloqueo secuencial: cada campo se habilita recién cuando el
 * anterior está completo, guiando el llenado en orden.
 */
const FIELD_ORDER = [
  "nombreCompleto",
  "ci",
  "fechaNacimiento",
  "celular",
  "ciudad",
] as const;

function campoCompleto(
  campo: (typeof FIELD_ORDER)[number],
  values: DatosPersonalesValues,
): boolean {
  switch (campo) {
    case "nombreCompleto":
      return NOMBRE_COMPLETO_REGEX.test(values.nombreCompleto ?? "");
    case "ci":
      return /^\d{5,10}$/.test((values.ci ?? "").trim());
    case "fechaNacimiento": {
      const edad = calcularEdad(values.fechaNacimiento ?? "");
      return edad >= EDAD_MINIMA && edad <= EDAD_MAXIMA;
    }
    case "celular":
      return /^[67]\d{7}$/.test((values.celular ?? "").trim());
    case "ciudad":
      return (values.ciudad ?? "") !== "";
  }
}

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

  const values = watch();

  // Índice del primer campo incompleto: todo lo posterior queda bloqueado.
  const primerIncompleto = FIELD_ORDER.findIndex(
    (campo) => !campoCompleto(campo, values),
  );
  const limite = primerIncompleto === -1 ? FIELD_ORDER.length : primerIncompleto;

  const bloqueado = (campo: (typeof FIELD_ORDER)[number]) =>
    FIELD_ORDER.indexOf(campo) > limite;

  const lockCls = (campo: (typeof FIELD_ORDER)[number]) =>
    bloqueado(campo)
      ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
      : "transition-opacity duration-300";

  const lockTab = (campo: (typeof FIELD_ORDER)[number]) =>
    bloqueado(campo) ? -1 : undefined;

  const todoCompleto = primerIncompleto === -1;
  const sinCobertura =
    values.ciudad !== "" && !ciudadTieneCobertura(values.ciudad);

  const onSubmit = (formValues: DatosPersonalesValues) => {
    if (!ciudadTieneCobertura(formValues.ciudad)) return;

    setDatosPersonales(formValues);
    completeAndAdvance("datos-personales");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        ¡Te damos la bienvenida! Estás a pocos pasos de conocer el préstamo
        compatible contigo. Completa tus datos para comenzar.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className={`sm:col-span-2 ${lockCls("nombreCompleto")}`}>
          <Field
            label="Nombre completo"
            htmlFor="nombreCompleto"
            error={errors.nombreCompleto?.message}
          >
            <input
              id="nombreCompleto"
              type="text"
              autoComplete="name"
              placeholder="Ej. Sara Valentina Gonzales Mamani"
              className={inputClassName}
              tabIndex={lockTab("nombreCompleto")}
              {...register("nombreCompleto")}
            />
          </Field>
        </div>

        <div className={lockCls("ci")} aria-disabled={bloqueado("ci")}>
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
              tabIndex={lockTab("ci")}
              {...register("ci")}
            />
          </Field>
        </div>

        <div
          className={lockCls("fechaNacimiento")}
          aria-disabled={bloqueado("fechaNacimiento")}
        >
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
              tabIndex={lockTab("fechaNacimiento")}
              {...register("fechaNacimiento")}
            />
          </Field>
        </div>

        <div className={lockCls("celular")} aria-disabled={bloqueado("celular")}>
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
                tabIndex={lockTab("celular")}
                {...register("celular")}
              />
            </PrefixedInputShell>
          </Field>
        </div>

        <div className={lockCls("ciudad")} aria-disabled={bloqueado("ciudad")}>
          <Field
            label="¿En qué ciudad vives?"
            htmlFor="ciudad"
            error={errors.ciudad?.message}
          >
            <div className="relative">
              <select
                id="ciudad"
                className={selectClassName}
                tabIndex={lockTab("ciudad")}
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
          disabled={!todoCompleto || sinCobertura}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente paso
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}