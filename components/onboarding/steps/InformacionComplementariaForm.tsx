"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BriefcaseBusiness, ShoppingBag } from "lucide-react";

import {
  HOUSING_TYPES,
  MARITAL_STATUSES,
  informacionComplementariaSchema,
  type InformacionComplementariaValues,
} from "@/lib/schemas/informacion-complementaria";
import { useOnboardingStore } from "@/store/onboarding";
import {
  Field,
  SelectChevron,
  inputClassName,
  selectClassName,
} from "@/components/ui/fields";

const EMPTY_VALUES: InformacionComplementariaValues = {
  nombreEmpresaNegocio: "",
  rubro: "",
  cargoActividad: "",
  direccionLaboral: "",
  vivienda: undefined as unknown as InformacionComplementariaValues["vivienda"],
  estadoCivil:
    undefined as unknown as InformacionComplementariaValues["estadoCivil"],
  destinoPrestamo:
    undefined as unknown as InformacionComplementariaValues["destinoPrestamo"],
};

type Paso =
  | "nombreEmpresaNegocio"
  | "rubro"
  | "cargoActividad"
  | "direccionLaboral"
  | "vivienda"
  | "estadoCivil"
  | "destinoPrestamo";

const PASOS: Paso[] = [
  "nombreEmpresaNegocio",
  "rubro",
  "cargoActividad",
  "direccionLaboral",
  "vivienda",
  "estadoCivil",
  "destinoPrestamo",
];

function pasoCompleto(
  paso: Paso,
  values: Partial<InformacionComplementariaValues>,
): boolean {
  switch (paso) {
    case "nombreEmpresaNegocio":
      return (values.nombreEmpresaNegocio ?? "").trim().length >= 2;

    case "rubro":
      return (values.rubro ?? "").trim().length >= 2;

    case "cargoActividad":
      return (values.cargoActividad ?? "").trim().length >= 2;

    case "direccionLaboral":
      return (values.direccionLaboral ?? "").trim().length >= 5;

    case "vivienda":
      return values.vivienda !== undefined;

    case "estadoCivil":
      return values.estadoCivil !== undefined;

    case "destinoPrestamo":
      return values.destinoPrestamo !== undefined;
  }
}

export function InformacionComplementariaForm() {
  const guardados = useOnboardingStore(
    (state) => state.datosComplementarios,
  );

  const datosFinancieros = useOnboardingStore(
    (state) => state.datosFinancieros,
  );

  const setDatosComplementarios = useOnboardingStore(
    (state) => state.setDatosComplementarios,
  );

  const completeAndAdvance = useOnboardingStore(
    (state) => state.completeAndAdvance,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InformacionComplementariaValues>({
    resolver: zodResolver(informacionComplementariaSchema),
    mode: "onTouched",
    defaultValues: guardados ?? EMPTY_VALUES,
  });

  const values = watch();

  const primerIncompleto = PASOS.findIndex(
    (paso) => !pasoCompleto(paso, values),
  );

  const limite =
    primerIncompleto === -1 ? PASOS.length : primerIncompleto;

  const bloqueado = (paso: Paso): boolean => {
    return PASOS.indexOf(paso) > limite;
  };

  const lockCls = (paso: Paso): string => {
    return bloqueado(paso)
      ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
      : "transition-opacity duration-300";
  };

  const lockTab = (paso: Paso): number | undefined => {
    return bloqueado(paso) ? -1 : undefined;
  };

  const todoCompleto = primerIncompleto === -1;

  const esAsalariado =
    datosFinancieros?.perfilLaboral === "ASALARIADO";

  const onSubmit = (
    formValues: InformacionComplementariaValues,
  ) => {
    setDatosComplementarios(formValues);
    completeAndAdvance("informacion-complementaria");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Cuéntanos un poco más sobre tu actividad, tu vivienda y para qué
        necesitas el préstamo.
      </p>

      {/* Empresa / negocio */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div
          className={`sm:col-span-2 ${lockCls(
            "nombreEmpresaNegocio",
          )}`}
        >
          <Field
            label="Nombre de la empresa / negocio"
            htmlFor="nombreEmpresaNegocio"
            error={errors.nombreEmpresaNegocio?.message}
          >
            <input
              id="nombreEmpresaNegocio"
              type="text"
              placeholder={
                esAsalariado
                  ? "Ej. Banco Nacional de Bolivia"
                  : "Ej. Comercial San Martín"
              }
              className={inputClassName}
              tabIndex={lockTab("nombreEmpresaNegocio")}
              {...register("nombreEmpresaNegocio")}
            />
          </Field>
        </div>

        {/* Rubro */}
        <div className={lockCls("rubro")}>
          <Field
            label="Rubro"
            htmlFor="rubro"
            error={errors.rubro?.message}
          >
            <input
              id="rubro"
              type="text"
              placeholder={
                esAsalariado
                  ? "Ej. Servicios financieros"
                  : "Ej. Comercio de alimentos"
              }
              className={inputClassName}
              tabIndex={lockTab("rubro")}
              {...register("rubro")}
            />
          </Field>
        </div>

        {/* Cargo / actividad */}
        <div className={lockCls("cargoActividad")}>
          <Field
            label="Cargo / actividad"
            htmlFor="cargoActividad"
            error={errors.cargoActividad?.message}
          >
            <input
              id="cargoActividad"
              type="text"
              placeholder={
                esAsalariado
                  ? "Ej. Analista comercial"
                  : "Ej. Comerciante"
              }
              className={inputClassName}
              tabIndex={lockTab("cargoActividad")}
              {...register("cargoActividad")}
            />
          </Field>
        </div>

        {/* Dirección laboral */}
        <div
          className={`sm:col-span-2 ${lockCls(
            "direccionLaboral",
          )}`}
        >
          <Field
            label="Dirección laboral"
            htmlFor="direccionLaboral"
            error={errors.direccionLaboral?.message}
          >
            <input
              id="direccionLaboral"
              type="text"
              placeholder="Ej. Zona Sopocachi, Av. Arce N.º 1234"
              className={inputClassName}
              tabIndex={lockTab("direccionLaboral")}
              {...register("direccionLaboral")}
            />
          </Field>
        </div>

        {/* Vivienda */}
        <div className={lockCls("vivienda")}>
          <Field
            label="Tipo de vivienda"
            htmlFor="vivienda"
            error={errors.vivienda?.message}
          >
            <div className="relative">
              <select
                id="vivienda"
                className={selectClassName}
                tabIndex={lockTab("vivienda")}
                {...register("vivienda")}
              >
                <option value="">
                  Selecciona una opción
                </option>

                {HOUSING_TYPES.map((tipo) => (
                  <option
                    key={tipo.value}
                    value={tipo.value}
                  >
                    {tipo.label}
                  </option>
                ))}
              </select>

              <SelectChevron />
            </div>
          </Field>
        </div>

        {/* Estado civil */}
        <div className={lockCls("estadoCivil")}>
          <Field
            label="Estado civil"
            htmlFor="estadoCivil"
            error={errors.estadoCivil?.message}
          >
            <div className="relative">
              <select
                id="estadoCivil"
                className={selectClassName}
                tabIndex={lockTab("estadoCivil")}
                {...register("estadoCivil")}
              >
                <option value="">
                  Selecciona una opción
                </option>

                {MARITAL_STATUSES.map((estado) => (
                  <option
                    key={estado.value}
                    value={estado.value}
                  >
                    {estado.label}
                  </option>
                ))}
              </select>

              <SelectChevron />
            </div>
          </Field>
        </div>
      </div>

      {/* Destino del préstamo */}
      <fieldset
        className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
          "destinoPrestamo",
        )}`}
      >
        <legend className="text-sm font-bold text-ink">
          ¿Para qué necesitas el préstamo?
        </legend>

        <p className="mt-1 text-xs leading-5 text-muted">
          Selecciona la opción que mejor describe cómo utilizarás el dinero.
        </p>

        <div
          className={`mt-3 grid gap-3 ${
            esAsalariado
              ? "sm:max-w-md"
              : "sm:grid-cols-2"
          }`}
        >
          {!esAsalariado ? (
            <label
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                values.destinoPrestamo === "CAPITAL_TRABAJO"
                  ? "border-primary bg-surface-blue"
                  : "border-border bg-white hover:border-primary/40"
              }`}
            >
              <input
                type="radio"
                value="CAPITAL_TRABAJO"
                className="sr-only"
                tabIndex={lockTab("destinoPrestamo")}
                {...register("destinoPrestamo")}
              />

              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BriefcaseBusiness className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-sm font-extrabold text-ink">
                    Capital de trabajo
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted">
                    Para mercadería, insumos, herramientas u otros gastos
                    relacionados con tu actividad.
                  </p>
                </div>
              </div>
            </label>
          ) : null}

          <label
            className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
              values.destinoPrestamo === "USO_PERSONAL"
                ? "border-primary bg-surface-blue"
                : "border-border bg-white hover:border-primary/40"
            }`}
          >
            <input
              type="radio"
              value="USO_PERSONAL"
              className="sr-only"
              tabIndex={lockTab("destinoPrestamo")}
              {...register("destinoPrestamo")}
            />

            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <ShoppingBag className="h-5 w-5" />
              </span>

              <div>
                <p className="text-sm font-extrabold text-ink">
                  Uso personal
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Para cubrir una necesidad o gasto personal.
                </p>
              </div>
            </div>
          </label>
        </div>

        {errors.destinoPrestamo ? (
          <p
            className="mt-2 text-xs font-semibold text-error"
            role="alert"
          >
            {errors.destinoPrestamo.message}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-6">
        <button
          type="submit"
          disabled={!todoCompleto}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Siguiente paso

          <ArrowRight
            className="h-4.5 w-4.5"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </form>
  );
}
