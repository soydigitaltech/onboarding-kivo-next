"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Store,
  UserRoundCheck,
} from "lucide-react";
import { NumericFormat } from "react-number-format";

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
  perfilLaboral: undefined as unknown as "ASALARIADO" | "INDEPENDIENTE",
  nombreCompleto: "",
  ci: "",
  fechaNacimiento: "",
  celular: "",
  ciudad: "",
  numeroDependientes: 0,
  rubroLaboral: "",
  direccionTrabajo: "",
};

type Campo =
  | "perfilLaboral"
  | "nombreCompleto"
  | "ci"
  | "fechaNacimiento"
  | "celular"
  | "ciudad"
  | "numeroDependientes"
  | "rubroLaboral"
  | "direccionTrabajo";

const FIELD_ORDER: Campo[] = [
  "perfilLaboral",
  "nombreCompleto",
  "ci",
  "fechaNacimiento",
  "celular",
  "ciudad",
  "numeroDependientes",
  "rubroLaboral",
  "direccionTrabajo",
];

function campoCompleto(
  campo: Campo,
  values: Partial<DatosPersonalesValues>,
): boolean {
  switch (campo) {
    case "perfilLaboral":
      return values.perfilLaboral !== undefined;
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
    case "numeroDependientes":
      return (
        values.numeroDependientes !== undefined &&
        Number.isInteger(values.numeroDependientes) &&
        values.numeroDependientes >= 0
      );
    case "rubroLaboral":
      return (values.rubroLaboral ?? "").trim().length >= 3;
    case "direccionTrabajo":
      return (values.direccionTrabajo ?? "").trim().length >= 5;
  }
}

export function DatosPersonalesForm() {
  const datosGuardados = useOnboardingStore((s) => s.datosPersonales);
  const setDatosPersonales = useOnboardingStore((s) => s.setDatosPersonales);
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DatosPersonalesValues>({
    resolver: zodResolver(datosPersonalesSchema),
    mode: "onTouched",
    defaultValues: datosGuardados ?? EMPTY_VALUES,
  });

  const values = watch();

  const primerIncompleto = FIELD_ORDER.findIndex(
    (campo) => !campoCompleto(campo, values),
  );

  const limite =
    primerIncompleto === -1 ? FIELD_ORDER.length : primerIncompleto;

  const bloqueado = (campo: Campo) => FIELD_ORDER.indexOf(campo) > limite;

  const lockCls = (campo: Campo) =>
    bloqueado(campo)
      ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
      : "transition-opacity duration-300";

  const lockTab = (campo: Campo) => (bloqueado(campo) ? -1 : undefined);

  const todoCompleto = primerIncompleto === -1;
  const edad = calcularEdad(values.fechaNacimiento ?? "");
  const sinCobertura =
    values.ciudad !== "" && !ciudadTieneCobertura(values.ciudad);

  const esAsalariado = values.perfilLaboral === "ASALARIADO";

  const onSubmit = (formValues: DatosPersonalesValues) => {
    if (!ciudadTieneCobertura(formValues.ciudad)) return;

    setDatosPersonales(formValues);
    completeAndAdvance("datos-personales");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Empecemos con algunos datos sobre ti y tu actividad laboral. Esta
        información nos ayuda a personalizar tu evaluación.
      </p>

      <fieldset className={lockCls("perfilLaboral")}>
        <legend className="text-sm font-bold text-ink">
          ¿Cuál es tu situación laboral?
        </legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label
            className={`relative min-h-[148px] cursor-pointer rounded-[24px] border-2 p-5 transition-all sm:min-h-[170px] sm:p-6 ${
              values.perfilLaboral === "ASALARIADO"
                ? "border-primary bg-surface-blue shadow-[0_8px_22px_rgba(3,174,254,0.12)]"
                : "border-border bg-white hover:border-primary/40"
            }`}
          >
            <input
              type="radio"
              value="ASALARIADO"
              className="sr-only"
              tabIndex={lockTab("perfilLaboral")}
              {...register("perfilLaboral")}
            />

            <div className="flex h-full items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-16 sm:w-16">
                <UserRoundCheck className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <div>
                <p className="text-lg font-extrabold text-ink">Asalariado</p>
                <p className="mt-1.5 text-sm leading-6 text-muted">
                  Recibes un sueldo de una empresa o institución.
                </p>
              </div>
            </div>
          </label>

          <label
            className={`relative min-h-[148px] cursor-pointer rounded-[24px] border-2 p-5 transition-all sm:min-h-[170px] sm:p-6 ${
              values.perfilLaboral === "INDEPENDIENTE"
                ? "border-primary bg-surface-blue shadow-[0_8px_22px_rgba(3,174,254,0.12)]"
                : "border-border bg-white hover:border-primary/40"
            }`}
          >
            <input
              type="radio"
              value="INDEPENDIENTE"
              className="sr-only"
              tabIndex={lockTab("perfilLaboral")}
              {...register("perfilLaboral")}
            />

            <div className="flex h-full items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent sm:h-16 sm:w-16">
                <Store className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <div>
                <p className="text-lg font-extrabold text-ink">Independiente</p>
                <p className="mt-1.5 text-sm leading-6 text-muted">
                  Generas ingresos por tu negocio, profesión u oficio.
                </p>
              </div>
            </div>
          </label>
        </div>

        {errors.perfilLaboral ? (
          <p className="mt-2 text-xs font-semibold text-error" role="alert">
            {errors.perfilLaboral.message}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-6 grid gap-5 border-t border-border-soft pt-6 sm:grid-cols-2">
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

        <div className={lockCls("ci")}>
          <Field
            label="Carnet de identidad"
            htmlFor="ci"
            error={errors.ci?.message}
          >
            <input
              id="ci"
              type="text"
              inputMode="numeric"
              placeholder="Ej. 6084527"
              className={inputClassName}
              tabIndex={lockTab("ci")}
              {...register("ci")}
            />
          </Field>
        </div>

        <div className={lockCls("fechaNacimiento")}>
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

          {edad >= EDAD_MINIMA && edad <= EDAD_MAXIMA ? (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface-blue px-3 py-1 text-xs font-bold text-primary-dark">
              <CalendarDays className="h-3.5 w-3.5" />
              Tienes {edad} años
            </p>
          ) : null}
        </div>

        <div className={lockCls("celular")}>
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
                placeholder="70000000"
                className={prefixedInputClassName}
                tabIndex={lockTab("celular")}
                {...register("celular")}
              />
            </PrefixedInputShell>
          </Field>
        </div>

        <div className={lockCls("ciudad")}>
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

        <div className={lockCls("numeroDependientes")}>
          <Field
            label="Número de dependientes"
            htmlFor="numeroDependientes"
            error={errors.numeroDependientes?.message}
          >
            <Controller
              name="numeroDependientes"
              control={control}
              render={({ field }) => (
                <PrefixedInputShell prefix="N.º">
                  <NumericFormat
                    id="numeroDependientes"
                    getInputRef={field.ref}
                    value={field.value ?? ""}
                    onValueChange={(value) => field.onChange(value.floatValue)}
                    onBlur={field.onBlur}
                    allowNegative={false}
                    decimalScale={0}
                    placeholder="Ej. 2"
                    className={prefixedInputClassName}
                    tabIndex={lockTab("numeroDependientes")}
                  />
                </PrefixedInputShell>
              )}
            />
          </Field>
        </div>

      </div>


      <div className="mt-6 grid gap-5 border-t border-border-soft pt-6">
        <div className={lockCls("rubroLaboral")}>
          <Field
            label={
              esAsalariado
                ? "Rubro de la empresa"
                : "Actividad económica o rubro"
            }
            htmlFor="rubroLaboral"
            error={errors.rubroLaboral?.message}
          >
            <input
              id="rubroLaboral"
              type="text"
              placeholder={
                esAsalariado
                  ? "Ej. Servicios financieros"
                  : "Ej. Comercio de alimentos"
              }
              className={inputClassName}
              tabIndex={lockTab("rubroLaboral")}
              {...register("rubroLaboral")}
            />
          </Field>
        </div>

        <div className={lockCls("direccionTrabajo")}>
          <Field
            label={
              esAsalariado
                ? "Dirección de la empresa o lugar de trabajo"
                : "Dirección del negocio o lugar de trabajo"
            }
            htmlFor="direccionTrabajo"
            error={errors.direccionTrabajo?.message}
          >
            <div className="relative">
              <BriefcaseBusiness className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="direccionTrabajo"
                type="text"
                placeholder="Ej. Zona Sopocachi, Av. Arce..."
                className={`${inputClassName} pl-11`}
                tabIndex={lockTab("direccionTrabajo")}
                {...register("direccionTrabajo")}
              />
            </div>
          </Field>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border-soft bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border-soft bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold text-ink-soft">
                  Ubicación referencial
                </p>
              </div>

              <span className="rounded-full bg-surface-blue px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-primary-dark">
                Mapa demo
              </span>
            </div>

            <iframe
              title="Mapa referencial del lugar de trabajo"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-68.1288%2C-16.5445%2C-68.0970%2C-16.5170&layer=mapnik&marker=-16.5305%2C-68.1126"
              loading="lazy"
              className="h-[230px] w-full border-0 sm:h-[280px]"
            />

            <p className="px-4 py-3 text-xs leading-5 text-muted">
              Esta ubicación es solo una demostración. La dirección registrada
              será validada durante la evaluación.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sinCobertura ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <BusinessNotice>
                Por ahora Kivo atiende solicitudes en{" "}
                <strong>La Paz y El Alto</strong>.
              </BusinessNotice>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-6">
        <button
          type="submit"
          disabled={!todoCompleto || sinCobertura}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Siguiente paso
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
