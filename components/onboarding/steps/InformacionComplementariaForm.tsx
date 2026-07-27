"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { ArrowRight } from "lucide-react";

import type { Coordenadas } from "./MapaUbicacion";

// Leaflet toca `window` al inicializar: debe cargar solo en cliente.
const MapaUbicacion = dynamic(() => import("./MapaUbicacion"), {
  ssr: false,
  loading: () => (
    <div className="mt-2 h-[200px] w-full animate-pulse rounded-xl bg-surface" />
  ),
});

import {
  CONTRACT_TYPES,
  ESTADOS_CON_CONYUGE,
  HOUSING_TYPES,
  MARITAL_STATUSES,
  VIVIENDAS_CON_GARANTE,
  informacionComplementariaSchema,
  type InformacionComplementariaValues,
} from "@/lib/schemas/informacion-complementaria";
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

const REVEAL: Transition = { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] };

/**
 * Pasos del bloqueo secuencial. Los grupos condicionales (asalariado,
 * independiente, cónyuge, garante) se agregan dinámicamente según lo
 * que el usuario elige en pasos anteriores.
 */
type Paso =
  | "perfilLaboral"
  | "empresa"
  | "cargo"
  | "tipoContrato"
  | "aportaAFP"
  | "tieneBoletas"
  | "actividadEconomica"
  | "tieneNit"
  | "tienePatente"
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
): Paso[] {
  const pasos: Paso[] = ["perfilLaboral"];

  if (values.perfilLaboral === "ASALARIADO") {
    pasos.push(
      "empresa",
      "cargo",
      "tipoContrato",
      "aportaAFP",
      "tieneBoletas",
    );
  } else if (values.perfilLaboral === "INDEPENDIENTE") {
    pasos.push("actividadEconomica", "tieneNit", "tienePatente");
  }

  pasos.push("vivienda", "estadoCivil");

  if (
    values.estadoCivil &&
    (ESTADOS_CON_CONYUGE as readonly string[]).includes(values.estadoCivil)
  ) {
    pasos.push("conyugeNombre", "conyugeCelular");
  }

  if (
    values.vivienda &&
    (VIVIENDAS_CON_GARANTE as readonly string[]).includes(values.vivienda)
  ) {
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
    case "perfilLaboral":
      return values.perfilLaboral !== undefined;
    case "empresa":
      return (values.empresa ?? "").trim() !== "";
    case "cargo":
      return (values.cargo ?? "").trim() !== "";
    case "tipoContrato":
      return values.tipoContrato !== undefined;
    case "aportaAFP":
      return values.aportaAFP !== undefined;
    case "tieneBoletas":
      return values.tieneBoletas !== undefined;
    case "actividadEconomica":
      return (values.actividadEconomica ?? "").trim() !== "";
    case "tieneNit":
      return values.tieneNit !== undefined;
    case "tienePatente":
      return values.tienePatente !== undefined;
    case "vivienda":
      return values.vivienda !== undefined;
    case "estadoCivil":
      return values.estadoCivil !== undefined;
    case "conyugeNombre":
      return (values.conyugeNombre ?? "").trim() !== "";
    case "conyugeCelular":
      return /^[67]\d{7}$/.test((values.conyugeCelular ?? "").trim());
    case "tieneGarante":
      return values.tieneGarante !== undefined;
    case "direccion":
      return (values.direccion ?? "").trim().length >= 5;
    case "destinoPrestamo":
      return (values.destinoPrestamo ?? "").trim().length >= 5;
    case "extractos":
      return values.extractos !== undefined;
  }
}

export function InformacionComplementariaForm() {
  const guardados = useOnboardingStore((s) => s.datosComplementarios);
  const setDatosComplementarios = useOnboardingStore(
    (s) => s.setDatosComplementarios,
  );
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);

  const [ubicacion, setUbicacion] = useState<Coordenadas | null>(
    guardados?.ubicacionLat !== undefined && guardados?.ubicacionLng !== undefined
      ? { lat: guardados.ubicacionLat, lng: guardados.ubicacionLng }
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

  const pasosVisibles = calcularPasosVisibles(values);
  const primerIncompleto = pasosVisibles.findIndex(
    (paso) => !pasoCompleto(paso, values),
  );
  const limite =
    primerIncompleto === -1 ? pasosVisibles.length : primerIncompleto;

  const estaVisible = (paso: Paso) => pasosVisibles.includes(paso);
  const bloqueado = (paso: Paso) => {
    const indice = pasosVisibles.indexOf(paso);
    return indice === -1 ? true : indice > limite;
  };

  const lockCls = (paso: Paso) =>
    bloqueado(paso)
      ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
      : "transition-opacity duration-300";

  const lockTab = (paso: Paso) => (bloqueado(paso) ? -1 : undefined);

  const todoCompleto = primerIncompleto === -1;

  const esAsalariado = values.perfilLaboral === "ASALARIADO";
  const esIndependiente = values.perfilLaboral === "INDEPENDIENTE";
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
        Responde según tu situación actual. En este paso no necesitas cargar
        documentos.
      </p>

      {/* Perfil laboral */}
      <fieldset className={lockCls("perfilLaboral")}>
        <legend className="text-sm font-bold text-ink">
          ¿Cuál es tu situación laboral?
        </legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RadioPill
            label="Asalariado"
            inputProps={{
              value: "ASALARIADO",
              tabIndex: lockTab("perfilLaboral"),
              ...register("perfilLaboral"),
            }}
          />
          <RadioPill
            label="Independiente"
            inputProps={{
              value: "INDEPENDIENTE",
              tabIndex: lockTab("perfilLaboral"),
              ...register("perfilLaboral"),
            }}
          />
        </div>

        {errors.perfilLaboral ? (
          <p className="mt-2 text-xs font-semibold text-error" role="alert">
            {errors.perfilLaboral.message}
          </p>
        ) : null}
      </fieldset>

      {/* Asalariado */}
      <AnimatePresence initial={false}>
        {esAsalariado ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className="mt-6 grid gap-5 border-t border-border-soft pt-6 sm:grid-cols-2">
              <div className={lockCls("empresa")}>
                <Field
                  label="Empresa o institución"
                  htmlFor="empresa"
                  error={errors.empresa?.message}
                >
                  <input
                    id="empresa"
                    type="text"
                    placeholder="Ej. Empresa Andina"
                    className={inputClassName}
                    tabIndex={lockTab("empresa")}
                    {...register("empresa")}
                  />
                </Field>
              </div>

              <div className={lockCls("cargo")}>
                <Field
                  label="Cargo"
                  htmlFor="cargo"
                  error={errors.cargo?.message}
                >
                  <input
                    id="cargo"
                    type="text"
                    placeholder="Ej. Analista administrativo"
                    className={inputClassName}
                    tabIndex={lockTab("cargo")}
                    {...register("cargo")}
                  />
                </Field>
              </div>

              <div className={lockCls("tipoContrato")}>
                <Field
                  label="Tipo de contrato"
                  htmlFor="tipoContrato"
                  error={errors.tipoContrato?.message}
                >
                  <div className="relative">
                    <select
                      id="tipoContrato"
                      className={selectClassName}
                      tabIndex={lockTab("tipoContrato")}
                      {...register("tipoContrato")}
                    >
                      <option value="">Selecciona una opción</option>
                      {CONTRACT_TYPES.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                </Field>
              </div>

              <div className={`sm:col-span-2 ${lockCls("aportaAFP")}`}>
                <p className="text-sm font-bold text-ink">
                  ¿Realizas aportes a la Gestora (AFP)?
                </p>
                <div className="mt-2 grid max-w-xs grid-cols-2 gap-3">
                  <RadioPill
                    label="Sí"
                    inputProps={{
                      value: "SI",
                      tabIndex: lockTab("aportaAFP"),
                      ...register("aportaAFP"),
                    }}
                  />
                  <RadioPill
                    label="No"
                    inputProps={{
                      value: "NO",
                      tabIndex: lockTab("aportaAFP"),
                      ...register("aportaAFP"),
                    }}
                  />
                </div>
              </div>

              <div className={`sm:col-span-2 ${lockCls("tieneBoletas")}`}>
                <p className="text-sm font-bold text-ink">
                  ¿Cuentas con boletas de pago de los últimos 3 meses?
                </p>
                <div className="mt-2 grid max-w-xs grid-cols-2 gap-3">
                  <RadioPill
                    label="Sí"
                    inputProps={{
                      value: "SI",
                      tabIndex: lockTab("tieneBoletas"),
                      ...register("tieneBoletas"),
                    }}
                  />
                  <RadioPill
                    label="No"
                    inputProps={{
                      value: "NO",
                      tabIndex: lockTab("tieneBoletas"),
                      ...register("tieneBoletas"),
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Independiente */}
        {esIndependiente ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className="mt-6 grid gap-5 border-t border-border-soft pt-6 sm:grid-cols-2">
              <div className={`sm:col-span-2 ${lockCls("actividadEconomica")}`}>
                <Field
                  label="Actividad económica"
                  htmlFor="actividadEconomica"
                  error={errors.actividadEconomica?.message}
                >
                  <input
                    id="actividadEconomica"
                    type="text"
                    placeholder="Ej. Comercio de alimentos"
                    className={inputClassName}
                    tabIndex={lockTab("actividadEconomica")}
                    {...register("actividadEconomica")}
                  />
                </Field>
              </div>

              <div className={`sm:col-span-2 ${lockCls("actividadEconomica")}`}>
                <Field
                  label="Nombre del negocio (opcional)"
                  htmlFor="nombreNegocio"
                >
                  <input
                    id="nombreNegocio"
                    type="text"
                    placeholder="Ej. Comercial San José"
                    className={inputClassName}
                    tabIndex={lockTab("actividadEconomica")}
                    {...register("nombreNegocio")}
                  />
                </Field>
              </div>

              <div className={lockCls("tieneNit")}>
                <p className="text-sm font-bold text-ink">¿Tienes NIT?</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <RadioPill
                    label="Sí"
                    inputProps={{
                      value: "SI",
                      tabIndex: lockTab("tieneNit"),
                      ...register("tieneNit"),
                    }}
                  />
                  <RadioPill
                    label="No"
                    inputProps={{
                      value: "NO",
                      tabIndex: lockTab("tieneNit"),
                      ...register("tieneNit"),
                    }}
                  />
                </div>
              </div>

              <div className={lockCls("tienePatente")}>
                <p className="text-sm font-bold text-ink">
                  ¿Tienes Patente o Licencia de Funcionamiento?
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <RadioPill
                    label="Sí"
                    inputProps={{
                      value: "SI",
                      tabIndex: lockTab("tienePatente"),
                      ...register("tienePatente"),
                    }}
                  />
                  <RadioPill
                    label="No"
                    inputProps={{
                      value: "NO",
                      tabIndex: lockTab("tienePatente"),
                      ...register("tienePatente"),
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Vivienda y estado civil */}
      <div className="mt-6 grid gap-5 border-t border-border-soft pt-6 sm:grid-cols-2">
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

      {/* Cónyuge */}
      <AnimatePresence initial={false}>
        {requiereConyuge ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className={lockCls("conyugeNombre")}>
                <Field
                  label="Nombre completo del cónyuge"
                  htmlFor="conyugeNombre"
                  error={errors.conyugeNombre?.message}
                >
                  <input
                    id="conyugeNombre"
                    type="text"
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
              className={`mt-5 rounded-xl border border-border-soft bg-surface p-4 ${lockCls(
                "tieneGarante",
              )}`}
            >
              <p className="text-sm font-bold text-ink">
                ¿Cuentas con un garante que tenga vivienda propia?
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Esta condición aplica porque declaraste vivienda en alquiler
                o anticrético.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
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

      {/* Dirección y destino */}
      <div className="mt-6 grid gap-5 border-t border-border-soft pt-6">
        <div className={lockCls("direccion")}>
          <Field
            label="Dirección actual"
            htmlFor="direccion"
            error={errors.direccion?.message}
          >
            <input
              id="direccion"
              type="text"
              placeholder="Ej. Zona Sopocachi, calle..."
              className={inputClassName}
              tabIndex={lockTab("direccion")}
              {...register("direccion")}
            />
          </Field>

          <MapaUbicacion value={ubicacion} onChange={setUbicacion} />
          <p className="mt-1.5 text-xs text-muted">
            Marca tu ubicación aproximada en el mapa (referencial).
          </p>
        </div>

        <div className={lockCls("destinoPrestamo")}>
          <Field
            label="Destino del préstamo"
            htmlFor="destinoPrestamo"
            error={errors.destinoPrestamo?.message}
          >
            <input
              id="destinoPrestamo"
              type="text"
              placeholder="Ej. Compra de un vehículo para mi negocio"
              className={inputClassName}
              tabIndex={lockTab("destinoPrestamo")}
              {...register("destinoPrestamo")}
            />
          </Field>
        </div>
      </div>

      {/* Extractos bancarios */}
      <fieldset
        className={`mt-6 border-t border-border-soft pt-6 ${lockCls("extractos")}`}
      >
        <legend className="text-sm font-bold text-ink">
          ¿Dispones de extractos bancarios?
        </legend>
        <p className="mt-1 text-xs leading-5 text-muted">
          No necesitas cargarlos ahora. Podrán solicitarse más adelante,
          después de la preaprobación.
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
                  No hay problema, puedes continuar sin ellos. Aun así, si
                  logras conseguirlos más adelante, pueden ayudarte a
                  agilizar tu evaluación y a que te ofrezcamos mejores
                  condiciones.
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
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Evaluar y continuar
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}