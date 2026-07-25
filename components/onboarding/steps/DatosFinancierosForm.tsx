"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { ArrowRight, Wallet } from "lucide-react";
import { NumericFormat } from "react-number-format";

import {
  CUOTA_KEYS,
  NUMERO_DEUDAS_OPCIONES,
  cantidadDeudas,
  datosFinancierosSchema,
  formatBs,
  type DatosFinancierosValues,
} from "@/lib/schemas/datos-financieros";
import { useOnboardingStore } from "@/store/onboarding";
import {
  DangerNotice,
  Field,
  PrefixedInputShell,
  RadioPill,
  SuffixedInputShell,
  prefixedInputClassName,
} from "@/components/ui/fields";

const REVEAL: Transition = { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] };

const numericInputProps = {
  thousandSeparator: ".",
  decimalSeparator: ",",
  allowNegative: false,
  decimalScale: 0,
  inputMode: "numeric",
} as const;

/**
 * Pasos del bloqueo secuencial. "cuotas" solo cuenta cuando hay
 * deudas declaradas (1 a 3); con 0 o "Más de 3" se salta.
 */
type Paso = "ingresoNeto" | "antiguedadMeses" | "numeroDeudas" | "cuotas" | "centralRiesgos";

export function DatosFinancierosForm() {
  const guardados = useOnboardingStore((s) => s.datosFinancieros);
  const setDatosFinancieros = useOnboardingStore((s) => s.setDatosFinancieros);
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DatosFinancierosValues>({
    resolver: zodResolver(datosFinancierosSchema),
    mode: "onTouched",
    defaultValues: guardados
      ? {
          ingresoNeto: guardados.ingresoNeto,
          antiguedadMeses: guardados.antiguedadMeses,
          numeroDeudas: String(
            guardados.numeroDeudas,
          ) as DatosFinancierosValues["numeroDeudas"],
          cuota1: guardados.cuotasDeudas[0],
          cuota2: guardados.cuotasDeudas[1],
          cuota3: guardados.cuotasDeudas[2],
          centralRiesgos: "NO",
        }
      : undefined,
  });

  const values = watch();

  const deudas = cantidadDeudas(values.numeroDeudas);
  const excesoDeudas = values.numeroDeudas === "MAS_3";
  const conReporte = values.centralRiesgos === "SI";
  const descartado = excesoDeudas || conReporte;

  const cuotasActivas = CUOTA_KEYS.slice(0, deudas);
  const totalCuotas = cuotasActivas.reduce<number>(
    (suma, key) => suma + (values[key] ?? 0),
    0,
  );

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
      case "numeroDeudas":
        return values.numeroDeudas !== undefined;
      case "cuotas":
        return cuotasActivas.every((key) => (values[key] ?? 0) > 0);
      case "centralRiesgos":
        return values.centralRiesgos !== undefined;
    }
  };

  const pasosVisibles: Paso[] = [
    "ingresoNeto",
    "antiguedadMeses",
    "numeroDeudas",
    ...(deudas > 0 ? (["cuotas"] as Paso[]) : []),
    "centralRiesgos",
  ];

  const primerIncompleto = pasosVisibles.findIndex(
    (paso) => !pasoCompleto(paso),
  );
  const limite =
    primerIncompleto === -1 ? pasosVisibles.length : primerIncompleto;

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
  // -------------------------------------------------------------

  const onSubmit = (formValues: DatosFinancierosValues) => {
    if (formValues.centralRiesgos === "SI" || formValues.numeroDeudas === "MAS_3") {
      return;
    }

    const cantidad = cantidadDeudas(formValues.numeroDeudas);
    const cuotas = CUOTA_KEYS.slice(0, cantidad).map(
      (key) => formValues[key] ?? 0,
    );

    setDatosFinancieros({
      ingresoNeto: formValues.ingresoNeto,
      antiguedadMeses: formValues.antiguedadMeses,
      numeroDeudas: cantidad,
      cuotasDeudas: cuotas,
      totalCuotasMensuales: cuotas.reduce((suma, c) => suma + c, 0),
      sinReporteCentral: true,
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
                    {...numericInputProps}
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
            <SuffixedInputShell suffix="meses">
              <input
                id="antiguedadMeses"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Ej. 24"
                className={prefixedInputClassName}
                tabIndex={lockTab("antiguedadMeses")}
                {...register("antiguedadMeses", { valueAsNumber: true })}
              />
            </SuffixedInputShell>
          </Field>
        </div>
      </div>

      {/* Deudas activas */}
      <fieldset
        className={`mt-7 border-t border-border-soft pt-6 ${lockCls("numeroDeudas")}`}
        aria-disabled={bloqueado("numeroDeudas")}
      >
        <legend className="sr-only">Deudas activas</legend>

        <p className="text-sm font-bold text-ink">
          ¿Cuántas deudas activas tienes en entidades financieras?
        </p>

        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {NUMERO_DEUDAS_OPCIONES.map((opcion) => (
            <RadioPill
              key={opcion.value}
              label={opcion.label}
              inputProps={{
                value: opcion.value,
                tabIndex: lockTab("numeroDeudas"),
                ...register("numeroDeudas"),
              }}
            />
          ))}
        </div>

        {errors.numeroDeudas ? (
          <p className="mt-2 text-xs font-semibold text-error" role="alert">
            {errors.numeroDeudas.message}
          </p>
        ) : null}
      </fieldset>

      {/* Cuotas por deuda, aparecen según la cantidad elegida */}
      <AnimatePresence initial={false}>
        {deudas > 0 ? (
          <motion.div
            key="cuotas"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className={lockCls("cuotas")} aria-disabled={bloqueado("cuotas")}>
              <div className="grid gap-4 pt-5 sm:grid-cols-3">
                {cuotasActivas.map((key, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...REVEAL, delay: index * 0.05 }}
                  >
                    <Field
                      label={`Cuota mensual · Deuda ${index + 1}`}
                      htmlFor={key}
                      error={errors[key]?.message}
                    >
                      <Controller
                        name={key}
                        control={control}
                        render={({ field }) => (
                          <PrefixedInputShell prefix="Bs">
                            <NumericFormat
                              id={key}
                              getInputRef={field.ref}
                              value={field.value ?? ""}
                              onValueChange={(v) =>
                                field.onChange(v.floatValue)
                              }
                              onBlur={field.onBlur}
                              placeholder="Ej. 800"
                              className={prefixedInputClassName}
                              tabIndex={lockTab("cuotas")}
                              {...numericInputProps}
                            />
                          </PrefixedInputShell>
                        )}
                      />
                    </Field>
                  </motion.div>
                ))}
              </div>

              {totalCuotas > 0 ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface-blue px-3.5 py-1.5 text-[13px] font-bold text-primary-dark">
                  <Wallet className="h-4 w-4 text-cerulean" />
                  Pago mensual actual: {formatBs(totalCuotas)}
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Descarte: más de 3 deudas */}
      <AnimatePresence>
        {excesoDeudas ? (
          <motion.div
            key="exceso"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <DangerNotice title="Por ahora no podemos continuar">
                Con más de 3 deudas activas no es posible acceder a un nuevo
                préstamo. Cuando canceles una de ellas, te esperamos de
                vuelta con gusto.
              </DangerNotice>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

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