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

  const numeroDeudas = watch("numeroDeudas");
  const centralRiesgos = watch("centralRiesgos");
  const cuotasVisibles = watch(["cuota1", "cuota2", "cuota3"]);

  const deudas = cantidadDeudas(numeroDeudas);
  const excesoDeudas = numeroDeudas === "MAS_3";
  const conReporte = centralRiesgos === "SI";
  const descartado = excesoDeudas || conReporte;

  const totalCuotas = cuotasVisibles
    .slice(0, deudas)
    .reduce<number>((suma, cuota) => suma + (cuota ?? 0), 0);

  const onSubmit = (values: DatosFinancierosValues) => {
    if (values.centralRiesgos === "SI" || values.numeroDeudas === "MAS_3") {
      return;
    }

    const cantidad = cantidadDeudas(values.numeroDeudas);
    const cuotas = CUOTA_KEYS.slice(0, cantidad).map(
      (key) => values[key] ?? 0,
    );

    setDatosFinancieros({
      ingresoNeto: values.ingresoNeto,
      antiguedadMeses: values.antiguedadMeses,
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
      <div className="grid gap-5 rounded-2xl border border-border-soft bg-surface p-5 sm:grid-cols-2 sm:p-6">
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
                  {...numericInputProps}
                />
              </PrefixedInputShell>
            )}
          />
        </Field>

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
              {...register("antiguedadMeses", { valueAsNumber: true })}
            />
          </SuffixedInputShell>
        </Field>
      </div>

      {/* Deudas activas */}
      <fieldset className="mt-5 rounded-2xl border border-border-soft bg-surface p-5 sm:p-6">
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
              <div className="grid gap-4 pt-5 sm:grid-cols-3">
                {CUOTA_KEYS.slice(0, deudas).map((key, index) => (
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
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface-blue px-3.5 py-1.5 text-[13px] font-bold text-primary">
                  <Wallet className="h-4 w-4" />
                  Pago mensual actual: {formatBs(totalCuotas)}
                </p>
              ) : null}
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
      </fieldset>

      {/* Central de riesgos */}
      <fieldset className="mt-5 rounded-2xl border border-border-soft bg-surface p-5 sm:p-6">
        <legend className="sr-only">Central de riesgos</legend>

        <p className="text-sm font-bold text-ink">
          ¿Actualmente figuras con algún reporte negativo en la central de
          riesgos del sistema financiero?
        </p>

        <div className="mt-3 grid max-w-xs grid-cols-2 gap-3">
          <RadioPill
            label="No"
            inputProps={{ value: "NO", ...register("centralRiesgos") }}
          />
          <RadioPill
            label="Sí"
            inputProps={{ value: "SI", ...register("centralRiesgos") }}
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
          disabled={descartado}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(254,152,6,0.35)] transition hover:-translate-y-0.5 hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
        >
          Siguiente paso
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}