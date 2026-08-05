"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, type Transition } from "motion/react";
import {
  ArrowRight,
  BadgeDollarSign,
  Gauge,
  HandCoins,
  Landmark,
  Plus,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { NumericFormat } from "react-number-format";

import {
  MAX_DEUDAS,
  datosFinancierosSchema,
  formatBs,
  type DatosFinancierosValues,
} from "@/lib/schemas/datos-financieros";
import { calcularCapacidadPago } from "@/lib/simulacion";
import { useOnboardingStore } from "@/store/onboarding";
import {
  DangerNotice,
  Field,
  PrefixedInputShell,
  RadioPill,
  prefixedInputClassName,
  selectClassName,
} from "@/components/ui/fields";

const REVEAL: Transition = { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] };

const dineroInputProps = {
  thousandSeparator: ".",
  decimalSeparator: ",",
  allowNegative: false,
  decimalScale: 0,
  inputMode: "numeric",
} as const;

/** Pasos del bloqueo secuencial, igual que en datos personales. */
type Paso =
  | "ingresoNeto"
  | "segundoIngreso"
  | "deudas"
  | "centralRiesgos";

const PASOS: Paso[] = [
  "ingresoNeto",
  "segundoIngreso",
  "deudas",
  "centralRiesgos",
];

export function DatosFinancierosForm() {
  const guardados = useOnboardingStore((s) => s.datosFinancieros);
  const datosPersonales = useOnboardingStore((s) => s.datosPersonales);
  const setDatosFinancieros = useOnboardingStore((s) => s.setDatosFinancieros);
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DatosFinancierosValues>({
    resolver: zodResolver(datosFinancierosSchema),
    mode: "onTouched",
    defaultValues: guardados
      ? {
          ingresoNeto: guardados.ingresoNeto,
          tieneSegundoIngreso: guardados.tieneSegundoIngreso,
          segundoIngresoOrigen: guardados.segundoIngresoOrigen,
          segundoIngresoMonto: guardados.segundoIngresoMonto,
          segundoIngresoRespaldado: guardados.segundoIngresoRespaldado,
          deudas: guardados.deudas.map((deuda) => ({
            entidadFinanciera: deuda.entidadFinanciera,
            cuotaMensual: deuda.cuotaMensual,
          })),
          masDeTresDeudas: guardados.excepcionMasDeTres !== null,
          excepcionTipo: guardados.excepcionMasDeTres?.tipo,
          deudaCuatro: guardados.excepcionMasDeTres?.deudaCuatro,
          deudaCompra: guardados.excepcionMasDeTres?.deudaCompra,
          deudaMoraOVencida: guardados.sinDeudaMoraOVencida ? "NO" : "SI",
        }
      : {
          deudas: [],
          masDeTresDeudas: false,
          tieneSegundoIngreso: false,
          segundoIngresoOrigen: undefined,
          segundoIngresoRespaldado: false,
          deudaMoraOVencida: undefined,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "deudas",
  });

  const values = watch();

  const deudas = values.deudas ?? [];
  const tieneMoraOVencida = values.deudaMoraOVencida === "SI";
  const perfilLaboral = datosPersonales?.perfilLaboral;


  const tieneSegundoIngreso = values.tieneSegundoIngreso === true;
  const segundoIngresoValido =
    !tieneSegundoIngreso ||
    ((values.segundoIngresoOrigen ?? "").trim().length >= 3 &&
      (values.segundoIngresoMonto ?? 0) > 0 &&
      values.segundoIngresoRespaldado === true);

  const ingresoTotalEvaluable =
    (values.ingresoNeto ?? 0) +
    (tieneSegundoIngreso && values.segundoIngresoRespaldado
      ? values.segundoIngresoMonto ?? 0
      : 0);


  // El panel de excepciones aparece apenas se registran las 3 deudas.
  const enLimiteDeudas = fields.length >= MAX_DEUDAS;

  const totalCuotas = deudas.reduce<number>(
    (suma, deuda) => suma + (deuda?.cuotaMensual ?? 0),
    0,
  );

  // La excepción solo tiene sentido con las 3 deudas registradas.
  // Si el usuario borra alguna, la selección se limpia sola
  // (también cubre restauraciones de sesión antiguas).
  useEffect(() => {
    if (fields.length < MAX_DEUDAS && values.excepcionTipo !== undefined) {
      setValue("masDeTresDeudas", false);
      setValue("excepcionTipo", undefined);
      setValue("deudaCuatro", undefined);
      setValue("deudaCompra", undefined);
    }
  }, [fields.length, values.excepcionTipo, setValue]);

  // Si el usuario indica que no tiene un segundo ingreso,
  // eliminamos cualquier monto o respaldo que hubiese seleccionado.
  useEffect(() => {
    if (!values.tieneSegundoIngreso) {
      setValue("segundoIngresoOrigen", undefined);
      setValue("segundoIngresoMonto", undefined);
      setValue("segundoIngresoRespaldado", false);
    }
  }, [values.tieneSegundoIngreso, setValue]);

  const deudaCompraValida =
    values.excepcionTipo !== "COMPRA_DEUDA" ||
    ((values.deudaCompra?.entidadFinanciera ?? "").trim().length >= 2 &&
      (values.deudaCompra?.cuotaMensual ?? 0) > 0 &&
      (values.deudaCompra?.capitalPendiente ?? 0) > 0);

  const bloqueoPorDeudas = !deudaCompraValida;

  // Modelo de capacidad Kivo aplicado desde este paso:
  // al ingreso se le "quema" el 40% de gastos personales, se restan
  // las deudas y el margen de ahorro. Si no queda espacio, el
  // descarte ocurre aquí, sin llegar al simulador.
  const capacidad =
    ingresoTotalEvaluable > 0
      ? calcularCapacidadPago({
          ingresoNeto: ingresoTotalEvaluable,
          totalDeudas: totalCuotas,
        })
      : null;

  const sinCapacidad = capacidad !== null && capacidad.cuotaMaxima <= 0;

  const descartado =
    bloqueoPorDeudas ||
    tieneMoraOVencida ||
    sinCapacidad ||
    !segundoIngresoValido;

  // ---- Bloqueo secuencial -------------------------------------
  const pasoCompleto = (paso: Paso): boolean => {
    switch (paso) {
      case "ingresoNeto":
        return (values.ingresoNeto ?? 0) > 0;

      case "segundoIngreso":
        return segundoIngresoValido;

      case "deudas": {
        const deudasPrincipalesValidas = deudas.every(
          (deuda) =>
            (deuda?.entidadFinanciera ?? "").trim().length >= 2 &&
            (deuda?.cuotaMensual ?? 0) > 0,
        );

        const deudaCuatroValida =
          values.excepcionTipo !== "ULTIMA_CUOTA" ||
          ((values.deudaCuatro?.entidadFinanciera ?? "").trim().length >= 2 &&
            (values.deudaCuatro?.cuotaMensual ?? 0) > 0 &&
            (values.deudaCuatro?.capitalPendiente ?? 0) > 0);

        return (
          !bloqueoPorDeudas &&
          deudasPrincipalesValidas &&
          deudaCuatroValida &&
          deudaCompraValida
        );
      }
      case "centralRiesgos":
        return values.deudaMoraOVencida !== undefined;
    }
  };

  const primerIncompleto = PASOS.findIndex((paso) => !pasoCompleto(paso));
  const limite = primerIncompleto === -1 ? PASOS.length : primerIncompleto;

  const bloqueado = (paso: Paso) => PASOS.indexOf(paso) > limite;

  const lockCls = (paso: Paso) =>
    bloqueado(paso)
      ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
      : "transition-opacity duration-300";

  const lockTab = (paso: Paso) => (bloqueado(paso) ? -1 : undefined);

  const todoCompleto = primerIncompleto === -1;
  // -------------------------------------------------------------

  const agregarDeuda = () => {
    if (fields.length >= MAX_DEUDAS) return;
    append({
      entidadFinanciera: "",
      cuotaMensual: undefined as unknown as number,
    });
  };

  const limpiarExcepcion = () => {
    setValue("masDeTresDeudas", false);
    setValue("excepcionTipo", undefined);
    setValue("deudaCuatro", undefined);
    setValue("deudaCompra", undefined);
  };

  const excepcionElegida = values.excepcionTipo !== undefined;

  const onSubmit = (formValues: DatosFinancierosValues) => {
    if (
      formValues.deudaMoraOVencida === "SI" ||
      (formValues.tieneSegundoIngreso &&
        (!formValues.segundoIngresoRespaldado ||
          (formValues.segundoIngresoMonto ?? 0) <= 0))
    ) {
      return;
    }

    const deudasNormalizadas = formValues.deudas.map((deuda) => ({
      entidadFinanciera: deuda.entidadFinanciera.trim(),
      cuotaMensual: deuda.cuotaMensual,
    }));

    setDatosFinancieros({
      ingresoNeto: formValues.ingresoNeto,
      tieneSegundoIngreso: formValues.tieneSegundoIngreso,
      segundoIngresoOrigen: formValues.tieneSegundoIngreso
        ? formValues.segundoIngresoOrigen
        : undefined,
      segundoIngresoMonto: formValues.tieneSegundoIngreso
        ? formValues.segundoIngresoMonto
        : undefined,
      segundoIngresoRespaldado: formValues.tieneSegundoIngreso
        ? formValues.segundoIngresoRespaldado
        : false,
      numeroDeudas: deudasNormalizadas.length,
      deudas: deudasNormalizadas,
      totalCuotasMensuales: deudasNormalizadas.reduce(
        (suma, deuda) => suma + deuda.cuotaMensual,
        0,
      ),
      sinDeudaMoraOVencida: formValues.deudaMoraOVencida === "NO",
      excepcionMasDeTres:
        formValues.excepcionTipo
          ? {
              tipo: formValues.excepcionTipo,
              deudaCuatro:
                formValues.excepcionTipo === "ULTIMA_CUOTA" &&
                formValues.deudaCuatro
                  ? {
                      entidadFinanciera:
                        formValues.deudaCuatro.entidadFinanciera.trim(),
                      cuotaMensual: formValues.deudaCuatro.cuotaMensual,
                      capitalPendiente:
                        formValues.deudaCuatro.capitalPendiente,
                    }
                  : undefined,
              deudaCompra:
                formValues.excepcionTipo === "COMPRA_DEUDA" &&
                formValues.deudaCompra
                  ? {
                      entidadFinanciera:
                        formValues.deudaCompra.entidadFinanciera.trim(),
                      cuotaMensual: formValues.deudaCompra.cuotaMensual,
                      capitalPendiente:
                        formValues.deudaCompra.capitalPendiente,
                    }
                  : undefined,
            }
          : null,
    });

    completeAndAdvance("datos-financieros");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Con esta información calcularemos tu capacidad de pago. Responde con
        sinceridad: nos ayuda a ofrecerte una cuota que realmente puedas
        asumir.
      </p>

      {/* Ingreso principal */}
      <div className={lockCls("ingresoNeto")}>
        <Field
          label="Ingreso neto mensual"
          htmlFor="ingresoNeto"
          error={errors.ingresoNeto?.message}
        >
          <Controller
            name="ingresoNeto"
            control={control}
            render={({ field }) => (
              <PrefixedInputShell prefix="Bs">
                <NumericFormat
                  id="ingresoNeto"
                  getInputRef={field.ref}
                  value={field.value ?? ""}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  onBlur={field.onBlur}
                  placeholder="Ej. 4.500"
                  className={prefixedInputClassName}
                  tabIndex={lockTab("ingresoNeto")}
                  {...dineroInputProps}
                />
              </PrefixedInputShell>
            )}
          />
        </Field>

        <div className="mt-3 flex items-start gap-3 rounded-xl border border-primary/15 bg-surface-blue p-4">
          <BadgeDollarSign className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <div>
            <p className="text-sm font-bold text-ink-soft">
              ¿Qué debes declarar como ingreso neto?
            </p>

            <p className="mt-1 text-xs leading-5 text-body">
  {perfilLaboral === "INDEPENDIENTE"
    ? "Ingresa la utilidad que obtienes cada mes después de pagar a tus proveedores, alquiler, servicios, personal y otros costos relacionados con tu actividad."
    : "Ingresa el monto que recibes cada mes después de los descuentos por aportes y otras retenciones."}
</p>
          </div>
        </div>
      </div>

      {/* Segundo ingreso */}
      <fieldset
        className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
          "segundoIngreso",
        )}`}
      >
        <legend className="text-sm font-bold text-ink">
          ¿Tienes una segunda fuente de ingresos?
        </legend>

        <p className="mt-1 text-xs leading-5 text-muted">
          Puede ser alquiler, otro trabajo, actividad profesional o ingresos
          adicionales de un negocio.
        </p>

        <div className="mt-3 grid max-w-md grid-cols-2 gap-3">
          <RadioPill
            label="No"
            inputProps={{
              value: "false",
              tabIndex: lockTab("segundoIngreso"),
              checked: values.tieneSegundoIngreso === false,
              onChange: () => {
                setValue("tieneSegundoIngreso", false, {
                  shouldValidate: true,
                });
              },
            }}
          />

          <RadioPill
            label="Sí"
            inputProps={{
              value: "true",
              tabIndex: lockTab("segundoIngreso"),
              checked: values.tieneSegundoIngreso === true,
              onChange: () => {
                setValue("tieneSegundoIngreso", true, {
                  shouldValidate: true,
                });
              },
            }}
          />
        </div>

        <AnimatePresence initial={false}>
          {tieneSegundoIngreso ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={REVEAL}
              className="overflow-hidden"
            >
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-primary/20 bg-surface-blue p-4 sm:col-span-2">
                  <p className="text-sm font-bold text-ink-soft">
                    Importante
                  </p>

                  <p className="mt-1 text-xs leading-5 text-body">
                    Declara el monto que realmente te queda cada mes después
                    de pagar los gastos relacionados con este ingreso.
                  </p>
                </div>

                <div>
                  <Field
                    label="¿De dónde proviene tu segundo ingreso?"
                    htmlFor="segundoIngresoOrigen"
                    error={errors.segundoIngresoOrigen?.message}
                  >
                    <input
                      id="segundoIngresoOrigen"
                      type="text"
                      placeholder="Ej. Alquiler, ventas u otro trabajo"
                      className={selectClassName}
                      {...register("segundoIngresoOrigen")}
                    />
                  </Field>
                </div>

                <div>
                  <Field
                    label="¿Cuánto te queda al mes por este ingreso?"
                    htmlFor="segundoIngresoMonto"
                    error={errors.segundoIngresoMonto?.message}
                  >
                    <Controller
                      name="segundoIngresoMonto"
                      control={control}
                      render={({ field }) => (
                        <PrefixedInputShell prefix="Bs">
                          <NumericFormat
                            id="segundoIngresoMonto"
                            getInputRef={field.ref}
                            value={field.value ?? ""}
                            onValueChange={(value) => {
                              field.onChange(value.floatValue);
                            }}
                            onBlur={field.onBlur}
                            placeholder="Ej. 1.500"
                            className={prefixedInputClassName}
                            {...dineroInputProps}
                          />
                        </PrefixedInputShell>
                      )}
                    />
                  </Field>
                </div>

                <div className="rounded-2xl border-2 border-warning-border bg-warning-bg p-4 sm:col-span-2 sm:p-5">
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

                    <div>
                      <p className="text-sm font-extrabold text-ink-soft">
                        Este ingreso necesita respaldo bancario
                      </p>

                      <p className="mt-1 text-xs leading-5 text-body">
                        Para incluirlo en tu capacidad de pago, el segundo
                        ingreso debe estar respaldado al 100% mediante
                        extractos bancarios.
                      </p>
                    </div>
                  </div>

                  <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-white/70 p-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                      {...register("segundoIngresoRespaldado")}
                    />

                    <span className="text-sm font-semibold leading-5 text-ink-soft">
                      Confirmo que puedo respaldar este segundo ingreso al
                      100% con extractos bancarios.
                    </span>
                  </label>

                  {errors.segundoIngresoRespaldado ? (
                    <p
                      className="mt-2 text-xs font-semibold text-error"
                      role="alert"
                    >
                      {errors.segundoIngresoRespaldado.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      {/* Requisitos de extractos */}
      <div className="mt-6 rounded-2xl border border-primary/20 bg-surface-blue p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <div>
            <p className="text-sm font-extrabold text-ink-soft">
              Los extractos bancarios forman parte de la evaluación
            </p>

            <p className="mt-1 text-xs leading-5 text-body">
              Para continuar con la evaluación formal deberás presentar
              extractos bancarios que reflejen, como mínimo, el 70% de tus
              movimientos e ingresos declarados.
            </p>

            <div className="mt-3 grid gap-2 text-xs font-semibold text-ink-soft sm:grid-cols-2">
              <span className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                Extractos obligatorios
              </span>

              <span className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                Mínimo 70% de movimientos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Deudas: el usuario las agrega una por una */}
      <div
        className={`mt-7 border-t border-border-soft pt-6 ${lockCls("deudas")}`}
        aria-disabled={bloqueado("deudas")}
      >
        <p className="text-sm font-bold text-ink">
          ¿Tienes deudas activas en entidades financieras?
        </p>
        <p className="mt-1 text-[13px] leading-5 text-muted">
          Si no tienes, continúa. Si tienes, agrégalas una por una con su
          cuota mensual.
        </p>

        <AnimatePresence initial={false}>
          {fields.map((item, index) => {
            const deuda = deudas[index];

            return (
              <motion.div
                key={item.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={REVEAL}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-2xl border border-border-soft bg-white p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-ink">
                      Deuda {index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Quitar deuda ${index + 1}`}
                      tabIndex={lockTab("deudas")}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-error/40 hover:text-error focus:outline-none focus-visible:ring-4 focus-visible:ring-error/15"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Entidad financiera"
                      htmlFor={`deuda-entidad-${index}`}
                      error={errors.deudas?.[index]?.entidadFinanciera?.message}
                    >
                      <input
                        id={`deuda-entidad-${index}`}
                        type="text"
                        placeholder="Ej. Banco Unión"
                        className={selectClassName}
                        tabIndex={lockTab("deudas")}
                        {...register(`deudas.${index}.entidadFinanciera` as const)}
                      />
                    </Field>

                    <Field
                      label="Cuota mensual"
                      htmlFor={`deuda-cuota-${index}`}
                      error={errors.deudas?.[index]?.cuotaMensual?.message}
                    >
                      <Controller
                        name={`deudas.${index}.cuotaMensual` as const}
                        control={control}
                        render={({ field }) => (
                          <PrefixedInputShell prefix="Bs">
                            <NumericFormat
                              id={`deuda-cuota-${index}`}
                              getInputRef={field.ref}
                              value={field.value ?? ""}
                              onValueChange={(value) =>
                                field.onChange(value.floatValue)
                              }
                              onBlur={field.onBlur}
                              placeholder="Ej. 800"
                              className={prefixedInputClassName}
                              tabIndex={lockTab("deudas")}
                              {...dineroInputProps}
                            />
                          </PrefixedInputShell>
                        )}
                      />
                    </Field>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!enLimiteDeudas ? (
          <button
            type="button"
            onClick={agregarDeuda}
            tabIndex={lockTab("deudas")}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-dashed border-border px-4 text-sm font-bold text-body transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <Plus className="h-4 w-4" />
            {fields.length === 0 ? "Agregar deuda" : "Agregar otra deuda"}
          </button>
        ) : null}

        {/* Al llegar a 3 deudas: dos excepciones permiten continuar con más */}
        <AnimatePresence>
          {enLimiteDeudas ? (
            <motion.div
              key="mas-de-tres"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={REVEAL}
              className="overflow-hidden"
            >
              <div className="mt-5 rounded-xl border border-warning-border bg-warning-bg p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <HandCoins className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                  <div>
                    <p className="text-sm font-bold text-ink-soft">
                      Ya registraste 3 deudas
                    </p>
                    <p className="mt-0.5 text-[13px] leading-5 text-body">
                      Si tienes alguna deuda más, solo podemos continuar en
                      uno de estos dos casos. ¿Alguno es el tuyo?
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <RadioPill
                    label="Una de mis deudas está en su última cuota"
                    inputProps={{
                      value: "ULTIMA_CUOTA",
                      ...register("excepcionTipo"),
                    }}
                  />
                  <RadioPill
                    label="Quiero que Kivo compre una de mis deudas"
                    inputProps={{
                      value: "COMPRA_DEUDA",
                      ...register("excepcionTipo"),
                    }}
                  />
                </div>

                <AnimatePresence initial={false} mode="wait">
                  {values.excepcionTipo === "ULTIMA_CUOTA" ? (
                    <motion.div
                      key="deuda-cuatro"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={REVEAL}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 rounded-2xl border border-warning-border bg-white p-4 sm:p-5">
                        <p className="text-sm font-extrabold text-ink">
                          Deuda 4
                        </p>

                        <p className="mt-1 text-xs leading-5 text-body">
                          Registra la deuda que se encuentra en su última cuota.
                          En este caso, el capital pendiente es obligatorio.
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <Field
                            label="Entidad financiera"
                            htmlFor="deuda-cuatro-entidad"
                            error={
                              errors.deudaCuatro?.entidadFinanciera?.message
                            }
                          >
                            <input
                              id="deuda-cuatro-entidad"
                              type="text"
                              placeholder="Ej. Banco Unión"
                              className={selectClassName}
                              {...register("deudaCuatro.entidadFinanciera")}
                            />
                          </Field>

                          <Field
                            label="Cuota mensual"
                            htmlFor="deuda-cuatro-cuota"
                            error={errors.deudaCuatro?.cuotaMensual?.message}
                          >
                            <Controller
                              name="deudaCuatro.cuotaMensual"
                              control={control}
                              render={({ field }) => (
                                <PrefixedInputShell prefix="Bs">
                                  <NumericFormat
                                    id="deuda-cuatro-cuota"
                                    getInputRef={field.ref}
                                    value={field.value ?? ""}
                                    onValueChange={(value) =>
                                      field.onChange(value.floatValue)
                                    }
                                    onBlur={field.onBlur}
                                    placeholder="Ej. 800"
                                    className={prefixedInputClassName}
                                    {...dineroInputProps}
                                  />
                                </PrefixedInputShell>
                              )}
                            />
                          </Field>

                          <div className="sm:col-span-2">
                            <Field
                              label="Capital pendiente"
                              htmlFor="deuda-cuatro-capital"
                              error={
                                errors.deudaCuatro?.capitalPendiente?.message
                              }
                            >
                              <Controller
                                name="deudaCuatro.capitalPendiente"
                                control={control}
                                render={({ field }) => (
                                  <PrefixedInputShell prefix="Bs">
                                    <NumericFormat
                                      id="deuda-cuatro-capital"
                                      getInputRef={field.ref}
                                      value={field.value ?? ""}
                                      onValueChange={(value) =>
                                        field.onChange(value.floatValue)
                                      }
                                      onBlur={field.onBlur}
                                      placeholder="Ej. 12.000"
                                      className={prefixedInputClassName}
                                      {...dineroInputProps}
                                    />
                                  </PrefixedInputShell>
                                )}
                              />
                            </Field>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}

                  {values.excepcionTipo === "COMPRA_DEUDA" ? (
                    <motion.div
                      key="deuda-compra"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={REVEAL}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 rounded-2xl border border-warning-border bg-white p-4 sm:p-5">
                        <p className="text-sm font-extrabold text-ink">
                          Deuda que Kivo evaluará comprar
                        </p>

                        <p className="mt-1 text-xs leading-5 text-body">
                          Registra los datos de la deuda que quieres incluir
                          en la evaluación de compra.
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <Field
                            label="Entidad financiera"
                            htmlFor="deuda-compra-entidad"
                            error={
                              errors.deudaCompra?.entidadFinanciera?.message
                            }
                          >
                            <input
                              id="deuda-compra-entidad"
                              type="text"
                              placeholder="Ej. Banco Unión"
                              className={selectClassName}
                              {...register("deudaCompra.entidadFinanciera")}
                            />
                          </Field>

                          <Field
                            label="Cuota mensual"
                            htmlFor="deuda-compra-cuota"
                            error={errors.deudaCompra?.cuotaMensual?.message}
                          >
                            <Controller
                              name="deudaCompra.cuotaMensual"
                              control={control}
                              render={({ field }) => (
                                <PrefixedInputShell prefix="Bs">
                                  <NumericFormat
                                    id="deuda-compra-cuota"
                                    getInputRef={field.ref}
                                    value={field.value ?? ""}
                                    onValueChange={(value) =>
                                      field.onChange(value.floatValue)
                                    }
                                    onBlur={field.onBlur}
                                    placeholder="Ej. 800"
                                    className={prefixedInputClassName}
                                    {...dineroInputProps}
                                  />
                                </PrefixedInputShell>
                              )}
                            />
                          </Field>

                          <div className="sm:col-span-2">
                            <Field
                              label="Capital pendiente"
                              htmlFor="deuda-compra-capital"
                              error={
                                errors.deudaCompra?.capitalPendiente?.message
                              }
                            >
                              <Controller
                                name="deudaCompra.capitalPendiente"
                                control={control}
                                render={({ field }) => (
                                  <PrefixedInputShell prefix="Bs">
                                    <NumericFormat
                                      id="deuda-compra-capital"
                                      getInputRef={field.ref}
                                      value={field.value ?? ""}
                                      onValueChange={(value) =>
                                        field.onChange(value.floatValue)
                                      }
                                      onBlur={field.onBlur}
                                      placeholder="Ej. 12.000"
                                      className={prefixedInputClassName}
                                      {...dineroInputProps}
                                    />
                                  </PrefixedInputShell>
                                )}
                              />
                            </Field>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {excepcionElegida ? (
                  <button
                    type="button"
                    onClick={limpiarExcepcion}
                    className="mt-3 text-[13px] font-semibold text-muted underline-offset-2 transition-colors hover:text-primary hover:underline"
                  >
                    No tengo más deudas: quitar selección
                  </button>
                ) : (
                  <p className="mt-3 text-[13px] leading-5 text-muted">
                    ¿No tienes más deudas? Continúa normalmente.
                  </p>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {totalCuotas > 0 && !bloqueoPorDeudas ? (
          <p className="mt-4 flex w-fit items-center gap-2 rounded-full bg-surface-blue px-3.5 py-1.5 text-[13px] font-bold text-primary-dark">
            <Wallet className="h-4 w-4 text-cerulean" />
            Pago mensual actual: {formatBs(totalCuotas)}
          </p>
        ) : null}

        {/* Capacidad de pago en vivo (modelo Kivo) */}
        {capacidad !== null && !bloqueoPorDeudas && !sinCapacidad ? (
          <p className="mt-3 flex w-fit items-center gap-2 rounded-full bg-surface-blue px-3.5 py-1.5 text-[13px] font-bold text-primary-dark">
            <Gauge className="h-4 w-4 text-cerulean" />
            Capacidad de pago estimada: {formatBs(capacidad.cuotaMaxima)}
          </p>
        ) : null}

        {/* Descarte: sin capacidad tras aplicar el modelo */}
        <AnimatePresence>
          {sinCapacidad ? (
            <motion.div
              key="sin-capacidad"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={REVEAL}
              className="overflow-hidden"
            >
              <div className="pt-5">
                <DangerNotice title="Por ahora no podemos continuar">
                  Según tus ingresos y compromisos actuales, no queda espacio
                  para asumir una nueva cuota. Cuando reduzcas tus deudas o
                  mejoren tus ingresos, te esperamos de vuelta.
                </DangerNotice>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Central de riesgos */}
      <fieldset
        className={`mt-7 border-t border-border-soft pt-6 ${lockCls("centralRiesgos")}`}
        aria-disabled={bloqueado("centralRiesgos")}
      >
        <legend className="sr-only">Central de riesgos</legend>

        <p className="text-sm font-bold text-ink">
  ¿Actualmente tienes deudas atrasadas o algún reporte negativo?
</p>

<p className="mt-1 text-xs leading-5 text-muted">
  Incluye deudas vencidas, créditos en mora o deudas castigadas.
</p>

        <div className="mt-3 grid max-w-xs grid-cols-2 gap-3">
          <RadioPill
            label="No"
            inputProps={{
              value: "NO",
              tabIndex: lockTab("centralRiesgos"),
              ...register("deudaMoraOVencida"),
            }}
          />
          <RadioPill
            label="Sí"
            inputProps={{
              value: "SI",
              tabIndex: lockTab("centralRiesgos"),
              ...register("deudaMoraOVencida"),
            }}
          />
        </div>

        {errors.deudaMoraOVencida ? (
          <p className="mt-2 text-xs font-semibold text-error" role="alert">
            {errors.deudaMoraOVencida.message}
          </p>
        ) : null}

        {/* Descarte: reporte en central de riesgos */}
        <AnimatePresence>
          {tieneMoraOVencida ? (
            <motion.div
              key="mora-vencida"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={REVEAL}
              className="overflow-hidden"
            >
              <div className="pt-5">
                <DangerNotice title="Por ahora no podemos continuar">
                  Agradecemos tu sinceridad. Mientras figures con un reporte
                  negativo en la Central de Riesgos no podremos atender tu
                  solicitud. Cuando regularices tu situación, vuelve a
                  intentarlo.
                </DangerNotice>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      <div className="mt-6">
        <button
          type="submit"
          disabled={!todoCompleto || descartado}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente paso
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}