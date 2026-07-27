"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, type Transition } from "motion/react";
import {
  ArrowRight,
  Gauge,
  HandCoins,
  Plus,
  Trash2,
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
type Paso = "ingresoNeto" | "antiguedadMeses" | "deudas" | "centralRiesgos";

const PASOS: Paso[] = [
  "ingresoNeto",
  "antiguedadMeses",
  "deudas",
  "centralRiesgos",
];

export function DatosFinancierosForm() {
  const guardados = useOnboardingStore((s) => s.datosFinancieros);
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
          antiguedadMeses: guardados.antiguedadMeses,
          deudas: guardados.cuotasDeudas.map((cuota) => ({ cuota })),
          masDeTresDeudas: guardados.excepcionMasDeTres !== null,
          excepcionTipo: guardados.excepcionMasDeTres?.tipo,
          compraIndice: (() => {
            const cuota = guardados.excepcionMasDeTres?.cuotaCompra;
            if (cuota === undefined) return undefined;
            const idx = guardados.cuotasDeudas.findIndex((cu) => cu === cuota);
            return idx >= 0 ? idx : undefined;
          })(),
          cuotaCompra: guardados.excepcionMasDeTres?.cuotaCompra,
          centralRiesgos: "NO",
        }
      : {
          deudas: [],
          masDeTresDeudas: false,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "deudas",
  });

  const values = watch();

  const deudas = values.deudas ?? [];
  const conReporte = values.centralRiesgos === "SI";

  // El panel de excepciones aparece apenas se registran las 3 deudas.
  const enLimiteDeudas = fields.length >= MAX_DEUDAS;

  const totalCuotas = deudas.reduce<number>(
    (suma, deuda) => suma + (deuda?.cuota ?? 0),
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
      setValue("cuotaCompra", undefined);
    }
  }, [fields.length, values.excepcionTipo, setValue]);

  // Si la deuda seleccionada para compra ya no existe, limpiar la selección.
  useEffect(() => {
    if (
      values.compraIndice !== undefined &&
      values.compraIndice >= fields.length
    ) {
      setValue("compraIndice", undefined);
      setValue("cuotaCompra", undefined);
    }
  }, [fields.length, values.compraIndice, setValue]);

  // Elegir excepción es opcional (sin selección = no tiene más deudas).
  // Solo bloquea si eligió compra de deuda y aún no eligió cuál.
  const compraSeleccionada =
    values.compraIndice !== undefined &&
    !Number.isNaN(values.compraIndice) &&
    (deudas[values.compraIndice]?.cuota ?? 0) > 0;

  const bloqueoPorDeudas =
    values.excepcionTipo === "COMPRA_DEUDA" && !compraSeleccionada;

  // Modelo de capacidad Kivo aplicado desde este paso:
  // al ingreso se le "quema" el 40% de gastos personales, se restan
  // las deudas y el margen de ahorro. Si no queda espacio, el
  // descarte ocurre aquí, sin llegar al simulador.
  const capacidad =
    (values.ingresoNeto ?? 0) > 0
      ? calcularCapacidadPago({
          ingresoNeto: values.ingresoNeto,
          totalDeudas: totalCuotas,
        })
      : null;

  const sinCapacidad = capacidad !== null && capacidad.cuotaMaxima <= 0;

  const descartado = bloqueoPorDeudas || conReporte || sinCapacidad;

  // ---- Bloqueo secuencial -------------------------------------
  const pasoCompleto = (paso: Paso): boolean => {
    switch (paso) {
      case "ingresoNeto":
        return (values.ingresoNeto ?? 0) > 0;
      case "antiguedadMeses":
        return (
          values.antiguedadMeses !== undefined &&
          !Number.isNaN(values.antiguedadMeses) &&
          values.antiguedadMeses >= 0
        );
      case "deudas":
        // Sin deudas también cuenta como completo; con deudas,
        // todas necesitan su cuota; si eligió compra, su cuota también.
        return (
          !bloqueoPorDeudas &&
          deudas.every((d) => (d?.cuota ?? 0) > 0)
        );
      case "centralRiesgos":
        return values.centralRiesgos !== undefined;
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
    append({ cuota: undefined as unknown as number });
  };

  const limpiarExcepcion = () => {
    setValue("masDeTresDeudas", false);
    setValue("excepcionTipo", undefined);
    setValue("compraIndice", undefined);
    setValue("cuotaCompra", undefined);
  };

  const excepcionElegida = values.excepcionTipo !== undefined;

  const onSubmit = (formValues: DatosFinancierosValues) => {
    const cuotaCompraElegida =
      formValues.compraIndice !== undefined
        ? formValues.deudas[formValues.compraIndice]?.cuota
        : undefined;

    if (
      formValues.centralRiesgos === "SI" ||
      (formValues.excepcionTipo === "COMPRA_DEUDA" &&
        (cuotaCompraElegida ?? 0) <= 0)
    ) {
      return;
    }

    const cuotas = formValues.deudas.map((d) => d.cuota);

    setDatosFinancieros({
      ingresoNeto: formValues.ingresoNeto,
      antiguedadMeses: formValues.antiguedadMeses,
      numeroDeudas: cuotas.length,
      cuotasDeudas: cuotas,
      totalCuotasMensuales: cuotas.reduce((suma, c) => suma + c, 0),
      sinReporteCentral: true,
      excepcionMasDeTres:
        formValues.excepcionTipo
          ? {
              tipo: formValues.excepcionTipo,
              cuotaCompra:
                formValues.excepcionTipo === "COMPRA_DEUDA"
                  ? cuotaCompraElegida
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

      {/* Ingreso y antigüedad */}
      <div className="grid gap-5 sm:grid-cols-2">
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
                    onValueChange={(v) => field.onChange(v.floatValue)}
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
        </div>

        <div
          className={lockCls("antiguedadMeses")}
          aria-disabled={bloqueado("antiguedadMeses")}
        >
          <Field
            label="Antigüedad laboral"
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
                    onValueChange={(v) => field.onChange(v.floatValue)}
                    onBlur={field.onBlur}
                    allowNegative={false}
                    decimalScale={0}
                    inputMode="numeric"
                    placeholder="Ej. 24"
                    className={prefixedInputClassName}
                    tabIndex={lockTab("antiguedadMeses")}
                  />
                </SuffixedInputShell>
              )}
            />
          </Field>
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
          {fields.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={REVEAL}
              className="overflow-hidden"
            >
              <div className="flex items-end gap-3 pt-4">
                <div className="flex-1">
                  <Field
                    label={`Deuda ${index + 1} · Cuota mensual`}
                    htmlFor={`deuda-${index}`}
                    error={errors.deudas?.[index]?.cuota?.message}
                  >
                    <Controller
                      name={`deudas.${index}.cuota` as const}
                      control={control}
                      render={({ field }) => (
                        <PrefixedInputShell prefix="Bs">
                          <NumericFormat
                            id={`deuda-${index}`}
                            getInputRef={field.ref}
                            value={field.value ?? ""}
                            onValueChange={(v) =>
                              field.onChange(v.floatValue)
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

                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Quitar deuda ${index + 1}`}
                  tabIndex={lockTab("deudas")}
                  className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-border text-muted transition-colors hover:border-error/40 hover:text-error focus:outline-none focus-visible:ring-4 focus-visible:ring-error/15"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          ))}
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
                                  disabled={(deuda?.cuota ?? 0) <= 0}
                                >
                                  {`Deuda ${index + 1} · ${formatBs(
                                    deuda?.cuota ?? 0,
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
              ...register("centralRiesgos"),
            }}
          />
          <RadioPill
            label="Sí"
            inputProps={{
              value: "SI",
              tabIndex: lockTab("centralRiesgos"),
              ...register("centralRiesgos"),
            }}
          />
        </div>

        {errors.centralRiesgos ? (
          <p className="mt-2 text-xs font-semibold text-error" role="alert">
            {errors.centralRiesgos.message}
          </p>
        ) : null}

        {/* Descarte: reporte en central de riesgos */}
        <AnimatePresence>
          {conReporte ? (
            <motion.div
              key="reporte"
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