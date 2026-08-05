"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, type Transition } from "motion/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import type { Coordenadas } from "./MapaUbicacion";

import {
  ESTADOS_CON_CONYUGE,
  HOUSING_TYPES,
  MARITAL_STATUSES,
  VIVIENDAS_CON_GARANTE,
  informacionComplementariaSchema,
  type InformacionComplementariaValues,
} from "@/lib/schemas/informacion-complementaria";
import { calcularEdad } from "@/lib/schemas/datos-personales";
import { useOnboardingStore } from "@/store/onboarding";
import {
  BusinessNotice,
  Field,
  PrefixedInputShell,
  RadioPill,
  SelectChevron,
  inputClassName,
  prefixedInputClassName,
  selectClassName,
} from "@/components/ui/fields";

// Leaflet utiliza window al inicializarse, por eso se carga solo en cliente.
const MapaUbicacion = dynamic(() => import("./MapaUbicacion"), {
  ssr: false,
  loading: () => (
    <div className="mt-2 h-[200px] w-full animate-pulse rounded-xl bg-surface" />
  ),
});

const REVEAL: Transition = {
  duration: 0.3,
  ease: [0.25, 0.8, 0.25, 1],
};

type Paso =
  | "vivienda"
  | "estadoCivil"
  | "conyugeNombre"
  | "conyugeCelular"
  | "tieneGarante"
  | "direccion"
  | "destinoPrestamo"
  | "extractos";

function calcularPasosVisibles(
  values: Partial<InformacionComplementariaValues>,
  edad: number,
): Paso[] {
  const pasos: Paso[] = ["vivienda", "estadoCivil"];

  if (
    values.estadoCivil &&
    (ESTADOS_CON_CONYUGE as readonly string[]).includes(values.estadoCivil)
  ) {
    pasos.push("conyugeNombre", "conyugeCelular");
  }

  const esJoven = edad >= 18 && edad <= 24;

  const requiereGarantePorVivienda =
    values.vivienda !== undefined &&
    (
      (VIVIENDAS_CON_GARANTE as readonly string[]).includes(
        values.vivienda,
      ) ||
      (esJoven && values.vivienda === "FAMILIAR")
    );

  if (requiereGarantePorVivienda) {
    pasos.push("tieneGarante");
  }

  pasos.push("direccion", "destinoPrestamo", "extractos");

  return pasos;
}

function pasoCompleto(
  paso: Paso,
  values: Partial<InformacionComplementariaValues>,
): boolean {
  switch (paso) {
    case "vivienda":
      return values.vivienda !== undefined;

    case "estadoCivil":
      return values.estadoCivil !== undefined;

    case "conyugeNombre":
      return (values.conyugeNombre ?? "").trim().length >= 5;

    case "conyugeCelular":
      return /^[67]\d{7}$/.test((values.conyugeCelular ?? "").trim());

    case "tieneGarante":
      return values.tieneGarante !== undefined;

    case "direccion":
      return (values.direccion ?? "").trim().length >= 5;

    case "destinoPrestamo":
      return values.destinoPrestamo !== undefined;

    case "extractos":
      return values.extractos !== undefined;
  }
}

export function InformacionComplementariaForm() {
  const guardados = useOnboardingStore((state) => {
    return state.datosComplementarios;
  });

  const datosPersonales = useOnboardingStore((state) => {
    return state.datosPersonales;
  });

  const perfilLaboral = datosPersonales?.perfilLaboral;

  const edad = datosPersonales?.fechaNacimiento
    ? calcularEdad(datosPersonales.fechaNacimiento)
    : 0;

  const setDatosComplementarios = useOnboardingStore((state) => {
    return state.setDatosComplementarios;
  });

  const completeAndAdvance = useOnboardingStore((state) => {
    return state.completeAndAdvance;
  });

  const [ubicacion, setUbicacion] = useState<Coordenadas | null>(
    guardados?.ubicacionLat !== undefined &&
      guardados?.ubicacionLng !== undefined
      ? {
          lat: guardados.ubicacionLat,
          lng: guardados.ubicacionLng,
        }
      : null,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InformacionComplementariaValues>({
    resolver: zodResolver(informacionComplementariaSchema),
    mode: "onTouched",
    defaultValues: guardados ?? undefined,
  });

  const values = watch();

  const pasosVisibles = calcularPasosVisibles(values, edad);

  const primerIncompleto = pasosVisibles.findIndex((paso) => {
    return !pasoCompleto(paso, values);
  });

  const limite =
    primerIncompleto === -1 ? pasosVisibles.length : primerIncompleto;

  const estaVisible = (paso: Paso): boolean => {
    return pasosVisibles.includes(paso);
  };

  const bloqueado = (paso: Paso): boolean => {
    const indice = pasosVisibles.indexOf(paso);

    if (indice === -1) return true;

    return indice > limite;
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
  const requiereConyuge = estaVisible("conyugeNombre");
  const requiereGarante = estaVisible("tieneGarante");
  const sinExtractos = values.extractos === "NO";

  const onSubmit = (formValues: InformacionComplementariaValues) => {
    setDatosComplementarios({
      ...formValues,
      ubicacionLat: ubicacion?.lat,
      ubicacionLng: ubicacion?.lng,
    });

    completeAndAdvance("informacion-complementaria");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Para completar tu evaluación necesitamos conocer algunos datos sobre
        tu vivienda, tu dirección actual y el destino del préstamo.
      </p>

      {/* Vivienda y estado civil */}
      <div className="grid gap-5 sm:grid-cols-2">
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
                <option value="">Selecciona una opción</option>

                {HOUSING_TYPES.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>

              <SelectChevron />
            </div>
          </Field>
        </div>

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
                <option value="">Selecciona una opción</option>

                {MARITAL_STATUSES.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>

              <SelectChevron />
            </div>
          </Field>
        </div>
      </div>

      {/* Datos del cónyuge */}
      <AnimatePresence initial={false}>
        {requiereConyuge ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className="mt-6 grid gap-5 border-t border-border-soft pt-6 sm:grid-cols-2">
              <div className={lockCls("conyugeNombre")}>
                <Field
                  label="Nombre completo del cónyuge"
                  htmlFor="conyugeNombre"
                  error={errors.conyugeNombre?.message}
                >
                  <input
                    id="conyugeNombre"
                    type="text"
                    autoComplete="name"
                    placeholder="Ej. María Fernanda López"
                    className={inputClassName}
                    tabIndex={lockTab("conyugeNombre")}
                    {...register("conyugeNombre")}
                  />
                </Field>
              </div>

              <div className={lockCls("conyugeCelular")}>
                <Field
                  label="Celular del cónyuge"
                  htmlFor="conyugeCelular"
                  error={errors.conyugeCelular?.message}
                >
                  <PrefixedInputShell prefix="+591">
                    <input
                      id="conyugeCelular"
                      type="tel"
                      inputMode="numeric"
                      maxLength={8}
                      placeholder="70000000"
                      className={prefixedInputClassName}
                      tabIndex={lockTab("conyugeCelular")}
                      {...register("conyugeCelular")}
                    />
                  </PrefixedInputShell>
                </Field>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Garante */}
      <AnimatePresence initial={false}>
        {requiereGarante ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div
              className={`mt-6 rounded-2xl border border-border-soft bg-surface p-4 sm:p-5 ${lockCls(
                "tieneGarante",
              )}`}
            >
              <p className="text-sm font-bold text-ink">
                ¿Cuentas con un garante que tenga vivienda propia?
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                {edad >= 18 &&
                edad <= 24 &&
                values.vivienda === "FAMILIAR"
                  ? "Por tu edad y porque vives en una vivienda familiar, necesitamos que cuentes con un garante con vivienda propia."
                  : "Esta condición aplica porque declaraste que vives en alquiler o anticrético."}
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <RadioPill
                  label="Sí, cuento con garante"
                  inputProps={{
                    value: "SI",
                    tabIndex: lockTab("tieneGarante"),
                    ...register("tieneGarante"),
                  }}
                />

                <RadioPill
                  label="No cuento con garante"
                  inputProps={{
                    value: "NO",
                    tabIndex: lockTab("tieneGarante"),
                    ...register("tieneGarante"),
                  }}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Dirección actual */}
      <div className="mt-6 border-t border-border-soft pt-6">
        <div className={lockCls("direccion")}>
          <Field
            label="Dirección actual de residencia"
            htmlFor="direccion"
            error={errors.direccion?.message}
          >
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

              <input
                id="direccion"
                type="text"
                autoComplete="street-address"
                placeholder="Ej. Zona Sopocachi, calle..."
                className={`${inputClassName} pl-11`}
                tabIndex={lockTab("direccion")}
                {...register("direccion")}
              />
            </div>
          </Field>

          <div className="mt-3 overflow-hidden rounded-2xl border border-border-soft">
            <MapaUbicacion value={ubicacion} onChange={setUbicacion} />
          </div>

          <p className="mt-2 text-xs leading-5 text-muted">
            Marca en el mapa la ubicación aproximada de tu vivienda.
          </p>
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
          Selecciona la opción que mejor describe cómo usarás el dinero.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
                    Para mercadería, insumos, herramientas u otros gastos de tu
                    actividad.
                  </p>
                </div>
              </div>
            </label>

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
          <p className="mt-2 text-xs font-semibold text-error" role="alert">
            {errors.destinoPrestamo.message}
          </p>
        ) : null}
      </fieldset>

      {/* Extractos bancarios */}
      <fieldset
        className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
          "extractos",
        )}`}
      >
        <legend className="text-sm font-bold text-ink">
          ¿Dispones de extractos bancarios?
        </legend>

        <p className="mt-1 text-xs leading-5 text-muted">
          Por ahora solo necesitamos que nos confirmes si cuentas con ellos.
          No debes subirlos en este paso.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RadioPill
            label="Sí, dispongo de extractos"
            inputProps={{
              value: "SI",
              tabIndex: lockTab("extractos"),
              ...register("extractos"),
            }}
          />

          <RadioPill
            label="No dispongo de extractos"
            inputProps={{
              value: "NO",
              tabIndex: lockTab("extractos"),
              ...register("extractos"),
            }}
          />
        </div>

        {errors.extractos ? (
          <p className="mt-2 text-xs font-semibold text-error" role="alert">
            {errors.extractos.message}
          </p>
        ) : null}

        <AnimatePresence>
          {sinExtractos ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={REVEAL}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <BusinessNotice>
                  Registramos que actualmente no dispones de extractos
                  bancarios. Más adelante revisaremos esta condición dentro
                  de los requisitos de evaluación.
                </BusinessNotice>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      <div className="mt-6">
        <button
          type="submit"
          disabled={!todoCompleto}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Evaluar y continuar
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
