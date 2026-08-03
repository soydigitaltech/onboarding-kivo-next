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
  mensajeAntiguedadMinima,
  obtenerAntiguedadMinima,
  type DatosFinancierosValues,
} from "@/lib/schemas/datos-financieros";
import { calcularCapacidadPago } from "@/lib/simulacion";
import { calcularEdad } from "@/lib/schemas/datos-personales";
import { useOnboardingStore } from "@/store/onboarding";
import {
  DangerNotice,
  Field,
  PrefixedInputShell,
  RadioPill,
  SelectChevron,
  SuffixedInputShell,
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
  | "antiguedadMeses"
  | "deudas"
  | "centralRiesgos";

const PASOS: Paso[] = [
  "ingresoNeto",
  "segundoIngreso",
  "antiguedadMeses",
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
          segundoIngresoMonto: guardados.segundoIngresoMonto,
          segundoIngresoRespaldado: guardados.segundoIngresoRespaldado,
          antiguedadMeses: guardados.antiguedadMeses,
          deudas: guardados.deudas.map((deuda) => ({
            entidadFinanciera: deuda.entidadFinanciera,
            cuotaMensual: deuda.cuotaMensual,
            capitalPendiente: deuda.capitalPendiente,
            estaEnUltimaCuota: deuda.estaEnUltimaCuota,
            montoUltimaCuota: deuda.montoUltimaCuota,
          })),
          masDeTresDeudas: guardados.excepcionMasDeTres !== null,
          excepcionTipo: guardados.excepcionMasDeTres?.tipo,
          compraIndice: guardados.excepcionMasDeTres?.deudaIndice,
          capitalCompra: guardados.excepcionMasDeTres?.capitalCompra,
          deudaMoraOVencida: guardados.sinDeudaMoraOVencida ? "NO" : "SI",
        }
      : {
          deudas: [],
          masDeTresDeudas: false,
          tieneSegundoIngreso: false,
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
  const edad = calcularEdad(datosPersonales?.fechaNacimiento ?? "");
  const antiguedadMinima = obtenerAntiguedadMinima(edad);

  const tieneSegundoIngreso = values.tieneSegundoIngreso === true;
  const segundoIngresoValido =
    !tieneSegundoIngreso ||
    ((values.segundoIngresoMonto ?? 0) > 0 &&
      values.segundoIngresoRespaldado === true);

  const ingresoTotalEvaluable =
    (values.ingresoNeto ?? 0) +
    (tieneSegundoIngreso && values.segundoIngresoRespaldado
      ? values.segundoIngresoMonto ?? 0
      : 0);

  const antiguedadInsuficiente =
    values.antiguedadMeses !== undefined &&
    !Number.isNaN(values.antiguedadMeses) &&
    values.antiguedadMeses < antiguedadMinima;

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
      setValue("compraIndice", undefined);
      setValue("capitalCompra", undefined);
    }
  }, [fields.length, values.excepcionTipo, setValue]);

  // Si el usuario indica que no tiene un segundo ingreso,
  // eliminamos cualquier monto o respaldo que hubiese seleccionado.
  useEffect(() => {
    if (!values.tieneSegundoIngreso) {
      setValue("segundoIngresoMonto", undefined);
      setValue("segundoIngresoRespaldado", false);
    }
  }, [values.tieneSegundoIngreso, setValue]);

  // Si la deuda seleccionada para compra ya no existe, limpiar la selección.
  useEffect(() => {
    if (
      values.compraIndice !== undefined &&
      values.compraIndice >= fields.length
    ) {
      setValue("compraIndice", undefined);
      setValue("capitalCompra", undefined);
    }
  }, [fields.length, values.compraIndice, setValue]);

  // Elegir excepción es opcional (sin selección = no tiene más deudas).
  // Solo bloquea si eligió compra de deuda y aún no eligió cuál.
  const compraSeleccionada =
    values.compraIndice !== undefined &&
    !Number.isNaN(values.compraIndice) &&
    (deudas[values.compraIndice]?.cuotaMensual ?? 0) > 0;

  const bloqueoPorDeudas =
    values.excepcionTipo === "COMPRA_DEUDA" && !compraSeleccionada;

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
    antiguedadInsuficiente ||
    !segundoIngresoValido;

  // ---- Bloqueo secuencial -------------------------------------
  const pasoCompleto = (paso: Paso): boolean => {
    switch (paso) {
      case "ingresoNeto":
        return (values.ingresoNeto ?? 0) > 0;

      case "segundoIngreso":
        return segundoIngresoValido;

      case "antiguedadMeses":
        return (
          values.antiguedadMeses !== undefined &&
          !Number.isNaN(values.antiguedadMeses) &&
          values.antiguedadMeses >= antiguedadMinima
        );
      case "deudas":
        // Sin deudas también cuenta como completo; con deudas,
        // todas necesitan su cuota; si eligió compra, su cuota también.
        return (
          !bloqueoPorDeudas &&
          deudas.every(
            (deuda) =>
              (deuda?.entidadFinanciera ?? "").trim().length >= 2 &&
              (deuda?.cuotaMensual ?? 0) > 0 &&
              (!deuda?.estaEnUltimaCuota ||
                (deuda?.montoUltimaCuota ?? 0) > 0),
          )
        );
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
      capitalPendiente: undefined,
      estaEnUltimaCuota: false,
      montoUltimaCuota: undefined,
    });
  };

  const limpiarExcepcion = () => {
    setValue("masDeTresDeudas", false);
    setValue("excepcionTipo", undefined);
    setValue("compraIndice", undefined);
    setValue("capitalCompra", undefined);
  };

  const excepcionElegida = values.excepcionTipo !== undefined;

  const onSubmit = (formValues: DatosFinancierosValues) => {
    const deudaCompraElegida =
      formValues.compraIndice !== undefined
        ? formValues.deudas[formValues.compraIndice]
        : undefined;

    if (
      formValues.deudaMoraOVencida === "SI" ||
      formValues.antiguedadMeses < antiguedadMinima ||
      (formValues.tieneSegundoIngreso &&
        (!formValues.segundoIngresoRespaldado ||
          (formValues.segundoIngresoMonto ?? 0) <= 0)) ||
      (formValues.excepcionTipo === "COMPRA_DEUDA" &&
        (!deudaCompraElegida ||
          (formValues.capitalCompra ?? 0) <= 0))
    ) {
      return;
    }

    const deudasNormalizadas = formValues.deudas.map((deuda) => ({
      entidadFinanciera: deuda.entidadFinanciera.trim(),
      cuotaMensual: deuda.cuotaMensual,
      capitalPendiente: deuda.capitalPendiente,
      estaEnUltimaCuota: deuda.estaEnUltimaCuota,
      montoUltimaCuota: deuda.estaEnUltimaCuota
        ? deuda.montoUltimaCuota
        : undefined,
    }));

    setDatosFinancieros({
      ingresoNeto: formValues.ingresoNeto,
      tieneSegundoIngreso: formValues.tieneSegundoIngreso,
      segundoIngresoMonto: formValues.tieneSegundoIngreso
        ? formValues.segundoIngresoMonto
        : undefined,
      segundoIngresoRespaldado: formValues.tieneSegundoIngreso
        ? formValues.segundoIngresoRespaldado
        : false,
      antiguedadMeses: formValues.antiguedadMeses,
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
              deudaIndice:
                formValues.excepcionTipo === "COMPRA_DEUDA"
                  ? formValues.compraIndice
                  : undefined,
              capitalCompra:
                formValues.excepcionTipo === "COMPRA_DEUDA"
                  ? formValues.capitalCompra
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
                ? "Ingresa el monto que realmente te queda cada mes después de pagar mercadería, alquiler, servicios, personal y otros costos de tu actividad."
                : "Ingresa el monto que recibes cada mes después de descuentos como aportes, impuestos, anticipos, préstamos u otras retenciones."}
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
              <div className="mt-5 grid gap-4">
                <div className="max-w-sm">
                  <Field
                    label="Monto neto del segundo ingreso"
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

                <div className="rounded-2xl border-2 border-warning-border bg-warning-bg p-4 sm:p-5">
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

      {/* Antigüedad */}
      <div
        className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
          "antiguedadMeses",
        )}`}
        aria-disabled={bloqueado("antiguedadMeses")}
      >
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.8fr)]">
          <Field
            label={
              perfilLaboral === "INDEPENDIENTE"
                ? "Antigüedad en tu actividad"
                : "Antigüedad laboral"
            }
            htmlFor="antiguedadMeses"
            error={errors.antiguedadMeses?.message}
          >
            <Controller
              name="antiguedadMeses"
              control={control}
              render={({ field }) => (
                <SuffixedInputShell suffix="meses">
                  <NumericFormat
                    id="antiguedadMeses"
                    getInputRef={field.ref}
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    onBlur={field.onBlur}
                    allowNegative={false}
                    decimalScale={0}
                    inputMode="numeric"
                    placeholder={`Mínimo ${antiguedadMinima}`}
                    className={prefixedInputClassName}
                    tabIndex={lockTab("antiguedadMeses")}
                  />
                </SuffixedInputShell>
              )}
            />
          </Field>

          <div
            className={`rounded-xl border p-4 ${
              antiguedadInsuficiente
                ? "border-error/30 bg-error/5"
                : "border-primary/15 bg-surface-blue"
            }`}
          >
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-muted">
              Antigüedad mínima requerida
            </p>

            <p
              className={`mt-1 text-2xl font-extrabold ${
                antiguedadInsuficiente ? "text-error" : "text-primary-dark"
              }`}
            >
              {antiguedadMinima} meses
            </p>

            <p className="mt-1 text-xs leading-5 text-body">
              {mensajeAntiguedadMinima(edad)}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {antiguedadInsuficiente ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={REVEAL}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <DangerNotice title="La antigüedad no alcanza el mínimo">
                  Para continuar necesitas acreditar al menos{" "}
                  <strong>{antiguedadMinima} meses</strong> de antigüedad.
                </DangerNotice>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

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

                    <Field
                      label="Capital pendiente (opcional)"
                      htmlFor={`deuda-capital-${index}`}
                      error={errors.deudas?.[index]?.capitalPendiente?.message}
                    >
                      <Controller
                        name={`deudas.${index}.capitalPendiente` as const}
                        control={control}
                        render={({ field }) => (
                          <PrefixedInputShell prefix="Bs">
                            <NumericFormat
                              id={`deuda-capital-${index}`}
                              getInputRef={field.ref}
                              value={field.value ?? ""}
                              onValueChange={(value) =>
                                field.onChange(value.floatValue)
                              }
                              onBlur={field.onBlur}
                              placeholder="Ej. 12.000"
                              className={prefixedInputClassName}
                              tabIndex={lockTab("deudas")}
                              {...dineroInputProps}
                            />
                          </PrefixedInputShell>
                        )}
                      />
                    </Field>

                    <div>
                      <p className="text-sm font-bold text-ink">
                        ¿Está en su última cuota?
                      </p>

                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <label className="cursor-pointer rounded-xl border-2 border-border px-3 py-2.5 text-center text-sm font-bold transition-colors has-[:checked]:border-primary has-[:checked]:bg-surface-blue">
                          <input
                            type="radio"
                            value="false"
                            className="sr-only"
                            checked={deuda?.estaEnUltimaCuota === false}
                            onChange={() =>
                              setValue(
                                `deudas.${index}.estaEnUltimaCuota`,
                                false,
                                { shouldValidate: true },
                              )
                            }
                          />
                          No
                        </label>

                        <label className="cursor-pointer rounded-xl border-2 border-border px-3 py-2.5 text-center text-sm font-bold transition-colors has-[:checked]:border-primary has-[:checked]:bg-surface-blue">
                          <input
                            type="radio"
                            value="true"
                            className="sr-only"
                            checked={deuda?.estaEnUltimaCuota === true}
                            onChange={() =>
                              setValue(
                                `deudas.${index}.estaEnUltimaCuota`,
                                true,
                                { shouldValidate: true },
                              )
                            }
                          />
                          Sí
                        </label>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {deuda?.estaEnUltimaCuota ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={REVEAL}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 max-w-sm">
                          <Field
                            label="Monto de la última cuota"
                            htmlFor={`deuda-ultima-${index}`}
                            error={
                              errors.deudas?.[index]?.montoUltimaCuota?.message
                            }
                          >
                            <Controller
                              name={`deudas.${index}.montoUltimaCuota` as const}
                              control={control}
                              render={({ field }) => (
                                <PrefixedInputShell prefix="Bs">
                                  <NumericFormat
                                    id={`deuda-ultima-${index}`}
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
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
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
                    <motion.p
                      key="nota-ultima"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={REVEAL}
                      className="overflow-hidden pt-3 text-[13px] leading-5 text-body"
                    >
                      Perfecto: como esa deuda está por terminar, no la
                      contaremos en tu evaluación. Puedes continuar.
                    </motion.p>
                  ) : null}

                  {values.excepcionTipo === "COMPRA_DEUDA" ? (
                    <motion.div
                      key="cuota-compra"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={REVEAL}
                      className="overflow-hidden"
                    >
                      <div className="max-w-sm pt-4">
                        <Field
                          label="¿Cuál de tus deudas quieres que compremos?"
                          htmlFor="compraIndice"
                        >
                          <div className="relative">
                            <select
                              id="compraIndice"
                              className={selectClassName}
                              {...register("compraIndice", {
                                setValueAs: (v) =>
                                  v === "" ? undefined : Number(v),
                              })}
                            >
                              <option value="">Selecciona una deuda</option>
                              {deudas.map((deuda, index) => (
                                <option
                                  key={index}
                                  value={index}
                                  disabled={(deuda?.cuotaMensual ?? 0) <= 0}
                                >
                                  {`Deuda ${index + 1} · ${formatBs(
                                    deuda?.cuotaMensual ?? 0,
                                  )} por mes`}
                                </option>
                              ))}
                            </select>
                            <SelectChevron />
                          </div>
                        </Field>
                        <p className="mt-2 text-[13px] leading-5 text-body">
                          La incluiremos en tu propuesta para evaluar la
                          compra de esa deuda.
                        </p>
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
          ¿Actualmente figuras con algún reporte negativo en la central de
          riesgos del sistema financiero?
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