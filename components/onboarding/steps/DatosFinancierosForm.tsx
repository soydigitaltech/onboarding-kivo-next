"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BadgeDollarSign,
  Plus,
  Store,
  Trash2,
  UserRoundCheck,
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
  BusinessNotice,
  DangerNotice,
  Field,
  PrefixedInputShell,
  RadioPill,
  inputClassName,
  prefixedInputClassName,
} from "@/components/ui/fields";

const dineroInputProps = {
  thousandSeparator: ".",
  decimalSeparator: ",",
  allowNegative: false,
  decimalScale: 0,
  inputMode: "numeric",
} as const;

type Paso =
  | "perfilLaboral"
  | "ingresoNeto"
  | "deudas"
  | "deudaAtrasada"
  | "extractos";

const PASOS: Paso[] = [
  "perfilLaboral",
  "ingresoNeto",
  "deudas",
  "deudaAtrasada",
  "extractos",
];

export function DatosFinancierosForm() {
  const guardados = useOnboardingStore((s) => s.datosFinancieros);
  const datosPersonales = useOnboardingStore((s) => s.datosPersonales);
  const datosComplementarios = useOnboardingStore(
    (s) => s.datosComplementarios,
  );

  const setDatosFinancieros = useOnboardingStore(
    (s) => s.setDatosFinancieros,
  );

  const completeAndAdvance = useOnboardingStore(
    (s) => s.completeAndAdvance,
  );

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
          perfilLaboral: guardados.perfilLaboral,
          ingresoNeto: guardados.ingresoNeto,

          deudas: guardados.deudas.map((deuda) => ({
            entidadFinanciera: deuda.entidadFinanciera,
            cuotaMensual: deuda.cuotaMensual,
          })),

          deudaMoraOVencida: guardados.sinDeudaMoraOVencida
            ? "NO"
            : "SI",

          extractos: guardados.extractos,
        }
      : {
          perfilLaboral: datosPersonales?.perfilLaboral,
          deudas: [],
          deudaMoraOVencida: undefined,
          extractos: datosComplementarios?.extractos,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "deudas",
  });

  const values = watch();

  const deudas = values.deudas ?? [];

  const totalCuotas = deudas.reduce<number>(
    (suma, deuda) => suma + (deuda?.cuotaMensual ?? 0),
    0,
  );

  const tieneDeudaAtrasada = values.deudaMoraOVencida === "SI";
  const sinExtractos = values.extractos === "NO";

  const capacidad =
    (values.ingresoNeto ?? 0) > 0
      ? calcularCapacidadPago({
          ingresoNeto: values.ingresoNeto,
          totalDeudas: totalCuotas,
        })
      : null;

  const sinCapacidad =
    capacidad !== null && capacidad.cuotaMaxima <= 0;

  function pasoCompleto(paso: Paso): boolean {
    switch (paso) {
      case "perfilLaboral":
        return values.perfilLaboral !== undefined;

      case "ingresoNeto":
        return (values.ingresoNeto ?? 0) > 0;

      case "deudas":
        return deudas.every((deuda) => {
          return (
            (deuda?.entidadFinanciera ?? "").trim().length >= 2 &&
            (deuda?.cuotaMensual ?? 0) > 0
          );
        });

      case "deudaAtrasada":
        return values.deudaMoraOVencida !== undefined;

      case "extractos":
        return values.extractos !== undefined;
    }
  }

  const primerIncompleto = PASOS.findIndex(
    (paso) => !pasoCompleto(paso),
  );

  const limite =
    primerIncompleto === -1 ? PASOS.length : primerIncompleto;

  const bloqueado = (paso: Paso) => {
    return PASOS.indexOf(paso) > limite;
  };

  const lockCls = (paso: Paso) =>
    bloqueado(paso)
      ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
      : "transition-opacity duration-300";

  const lockTab = (paso: Paso) =>
    bloqueado(paso) ? -1 : undefined;

  const todoCompleto = primerIncompleto === -1;

  const agregarDeuda = () => {
    if (fields.length >= MAX_DEUDAS) return;

    append({
      entidadFinanciera: "",
      cuotaMensual: undefined as unknown as number,
    });
  };

  const onSubmit = (formValues: DatosFinancierosValues) => {
    if (formValues.deudaMoraOVencida === "SI") return;

    const deudasNormalizadas = formValues.deudas.map((deuda) => ({
      entidadFinanciera: deuda.entidadFinanciera.trim(),
      cuotaMensual: deuda.cuotaMensual,
    }));

    setDatosFinancieros({
      perfilLaboral: formValues.perfilLaboral,
      ingresoNeto: formValues.ingresoNeto,

      /*
       * Compatibilidad temporal con el cálculo actual del Paso 3.
       * Estos campos ya no se preguntan en "Tus finanzas".
       */
      tieneSegundoIngreso: false,
      segundoIngresoOrigen: undefined,
      segundoIngresoMonto: undefined,
      segundoIngresoRespaldado: false,

      numeroDeudas: deudasNormalizadas.length,
      deudas: deudasNormalizadas,

      totalCuotasMensuales: deudasNormalizadas.reduce(
        (suma, deuda) => suma + deuda.cuotaMensual,
        0,
      ),

      sinDeudaMoraOVencida:
        formValues.deudaMoraOVencida === "NO",

      extractos: formValues.extractos,

      /*
       * Compatibilidad temporal con el modelo anterior.
       */
      excepcionMasDeTres: null,
    });

    completeAndAdvance("datos-financieros");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Cuéntanos sobre tus ingresos y compromisos actuales para conocer
        mejor tu situación financiera.
      </p>

      {/* 1. Tipo de actividad */}
      <fieldset className={lockCls("perfilLaboral")}>
        <legend className="text-sm font-bold text-ink">
          Tipo de actividad
        </legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label
            className={`relative min-h-[140px] cursor-pointer rounded-[24px] border-2 p-5 transition-all ${
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
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRoundCheck className="h-7 w-7" />
              </span>

              <div>
                <p className="text-lg font-extrabold text-ink">
                  Asalariado
                </p>

                <p className="mt-1.5 text-sm leading-6 text-muted">
                  Recibes un sueldo de una empresa o institución.
                </p>
              </div>
            </div>
          </label>

          <label
            className={`relative min-h-[140px] cursor-pointer rounded-[24px] border-2 p-5 transition-all ${
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
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Store className="h-7 w-7" />
              </span>

              <div>
                <p className="text-lg font-extrabold text-ink">
                  Independiente
                </p>

                <p className="mt-1.5 text-sm leading-6 text-muted">
                  Generas ingresos por tu negocio, profesión u oficio.
                </p>
              </div>
            </div>
          </label>
        </div>

        {errors.perfilLaboral ? (
          <p className="mt-2 text-xs font-semibold text-error">
            {errors.perfilLaboral.message}
          </p>
        ) : null}
      </fieldset>

      {/* 2. Ingresos mensuales */}
      <div
        className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
          "ingresoNeto",
        )}`}
      >
        <Field
          label="Ingresos mensuales"
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

        <p className="mt-2 flex items-center gap-2 text-xs leading-5 text-muted">
          <BadgeDollarSign className="h-4 w-4 shrink-0 text-primary" />

          {values.perfilLaboral === "INDEPENDIENTE"
            ? "Ingresa el monto que te queda aproximadamente cada mes después de los gastos de tu actividad."
            : "Ingresa el monto aproximado que recibes cada mes después de descuentos."}
        </p>
      </div>

      {/* 3. Deudas actuales */}
      <div
        className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
          "deudas",
        )}`}
      >
        <p className="text-sm font-bold text-ink">
          Deudas actuales
        </p>

        <p className="mt-1 text-xs leading-5 text-muted">
          Si tienes préstamos o deudas vigentes, agrégalos con su cuota
          mensual. Si no tienes deudas, puedes continuar.
        </p>

        <AnimatePresence initial={false}>
          {fields.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
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
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-error/40 hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Entidad financiera"
                    htmlFor={`deuda-entidad-${index}`}
                    error={
                      errors.deudas?.[index]?.entidadFinanciera?.message
                    }
                  >
                    <input
                      id={`deuda-entidad-${index}`}
                      type="text"
                      placeholder="Ej. Banco Unión"
                      className={inputClassName}
                      {...register(
                        `deudas.${index}.entidadFinanciera` as const,
                      )}
                    />
                  </Field>

                  <Field
                    label="Cuota mensual"
                    htmlFor={`deuda-cuota-${index}`}
                    error={
                      errors.deudas?.[index]?.cuotaMensual?.message
                    }
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
                            onValueChange={(value) => {
                              field.onChange(value.floatValue);
                            }}
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {fields.length < MAX_DEUDAS ? (
          <button
            type="button"
            onClick={agregarDeuda}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-dashed border-border px-4 text-sm font-bold text-body transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            {fields.length === 0
              ? "Agregar deuda"
              : "Agregar otra deuda"}
          </button>
        ) : null}

        {totalCuotas > 0 ? (
          <p className="mt-4 flex w-fit items-center gap-2 rounded-full bg-surface-blue px-3.5 py-1.5 text-[13px] font-bold text-primary-dark">
            <Wallet className="h-4 w-4 text-cerulean" />
            Cuotas mensuales actuales: {formatBs(totalCuotas)}
          </p>
        ) : null}

        <AnimatePresence>
          {sinCapacidad ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <DangerNotice title="Por ahora no podemos continuar">
                  Según tus ingresos y compromisos actuales, no queda
                  suficiente capacidad para asumir una nueva cuota.
                </DangerNotice>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* 4. Deudas atrasadas */}
      <fieldset
        className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
          "deudaAtrasada",
        )}`}
      >
        <legend className="text-sm font-bold text-ink">
          ¿Tienes deudas atrasadas?
        </legend>

        <div className="mt-3 grid max-w-xs grid-cols-2 gap-3">
          <RadioPill
            label="No"
            inputProps={{
              value: "NO",
              tabIndex: lockTab("deudaAtrasada"),
              ...register("deudaMoraOVencida"),
            }}
          />

          <RadioPill
            label="Sí"
            inputProps={{
              value: "SI",
              tabIndex: lockTab("deudaAtrasada"),
              ...register("deudaMoraOVencida"),
            }}
          />
        </div>

        {errors.deudaMoraOVencida ? (
          <p className="mt-2 text-xs font-semibold text-error">
            {errors.deudaMoraOVencida.message}
          </p>
        ) : null}

        <AnimatePresence>
          {tieneDeudaAtrasada ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <DangerNotice title="Por ahora no podemos continuar">
                  Mientras tengas deudas atrasadas, Kivo no podrá continuar
                  con la evaluación de la solicitud.
                </DangerNotice>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      {/* 5. Extractos bancarios */}
      <fieldset
        className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
          "extractos",
        )}`}
      >
        <legend className="text-sm font-bold text-ink">
          ¿Cuentas con extractos bancarios?
        </legend>

        <div className="mt-3 grid max-w-xs grid-cols-2 gap-3">
          <RadioPill
            label="Sí"
            inputProps={{
              value: "SI",
              tabIndex: lockTab("extractos"),
              ...register("extractos"),
            }}
          />

          <RadioPill
            label="No"
            inputProps={{
              value: "NO",
              tabIndex: lockTab("extractos"),
              ...register("extractos"),
            }}
          />
        </div>

        {errors.extractos ? (
          <p className="mt-2 text-xs font-semibold text-error">
            {errors.extractos.message}
          </p>
        ) : null}

        <AnimatePresence>
          {sinExtractos ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <BusinessNotice>
                  Registramos que actualmente no cuentas con extractos
                  bancarios. Esta información será considerada durante la
                  evaluación.
                </BusinessNotice>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </fieldset>

      <div className="mt-6">
        <button
          type="submit"
          disabled={
            !todoCompleto ||
            tieneDeudaAtrasada ||
            sinCapacidad
          }
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Siguiente paso
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
