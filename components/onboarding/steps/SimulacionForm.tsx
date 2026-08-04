"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  type Transition,
} from "motion/react";
import {
  ArrowRight,
  CircleCheckBig,
  Lightbulb,
  Percent,
  ShieldCheck,
} from "lucide-react";
import { NumericFormat } from "react-number-format";

import {
  REGLAS_SIMULACION,
  buscarAlternativa,
  normalizarMonto,
  simular,
} from "@/lib/simulacion";
import { formatBs } from "@/lib/schemas/datos-financieros";
import { useOnboardingStore } from "@/store/onboarding";
import {
  DangerNotice,
  PrefixedInputShell,
  prefixedInputClassName,
} from "@/components/ui/fields";

const REVEAL: Transition = {
  duration: 0.3,
  ease: [0.25, 0.8, 0.25, 1],
};

function CuotaAnimada({ valor }: { valor: number }) {
  const spring = useSpring(valor, {
    stiffness: 130,
    damping: 22,
  });

  const texto = useTransform(spring, (value) => {
    return formatBs(Math.round(value));
  });

  useEffect(() => {
    spring.set(valor);
  }, [valor, spring]);

  return <motion.span>{texto}</motion.span>;
}

function etiquetaCapacidad(
  nivel: "COMODA" | "AJUSTADA" | "AL_LIMITE",
): string {
  if (nivel === "COMODA") return "Cómoda";
  if (nivel === "AJUSTADA") return "Ajustada";
  return "Al límite";
}

export function SimulacionForm() {
  const datosFinancieros = useOnboardingStore((state) => {
    return state.datosFinancieros;
  });

  const simulacionGuardada = useOnboardingStore((state) => {
    return state.simulacion;
  });

  const setSimulacion = useOnboardingStore((state) => {
    return state.setSimulacion;
  });

  const completeAndAdvance = useOnboardingStore((state) => {
    return state.completeAndAdvance;
  });

  const ingresoPrincipal = datosFinancieros?.ingresoNeto ?? 0;

  const segundoIngreso =
    datosFinancieros?.tieneSegundoIngreso &&
    datosFinancieros.segundoIngresoRespaldado
      ? datosFinancieros.segundoIngresoMonto ?? 0
      : 0;

  const ingresoNeto = ingresoPrincipal + segundoIngreso;
  const totalDeudas = datosFinancieros?.totalCuotasMensuales ?? 0;

  const montoInicial = normalizarMonto(
    simulacionGuardada?.monto ?? 15000,
  );

  const [monto, setMonto] = useState<number>(montoInicial);
  const [confirmo, setConfirmo] = useState(false);

  // Flujo Asalariado:
  // El destino se asigna automáticamente.
  const destinoPrestamo = "USO_PERSONAL" as const;

  // El plazo se calcula automáticamente.
  const plazoSeleccionado = useMemo(() => {
    const plazos = REGLAS_SIMULACION.plazosMeses.filter((plazo) => {
      if (monto <= 15000) return plazo <= 24;
      if (monto <= 25000) return plazo >= 9 && plazo <= 30;
      return plazo >= 12;
    });

    const resultados = plazos.map((plazoMeses) =>
      simular({
        monto,
        plazoMeses,
        ingresoNeto,
        totalDeudas,
        destinoPrestamo,
      }),
    );

    const viables = resultados.filter((r) => r.viable);

    if (viables.length > 0) {
      return viables[Math.floor(viables.length / 2)].plazoMeses;
    }

    return plazos.at(-1) ?? 12;
  }, [monto, ingresoNeto, totalDeudas]);

  const resultado = useMemo(() => {
    return simular({
      monto,
      plazoMeses: plazoSeleccionado,
      ingresoNeto,
      totalDeudas,
      destinoPrestamo,
    });
  }, [
    monto,
    plazoSeleccionado,
    ingresoNeto,
    totalDeudas,
  ]);

  const alternativa = useMemo(() => {
    if (resultado.viable) return null;

    return buscarAlternativa({
      monto,
      plazoMeses: plazoSeleccionado,
      ingresoNeto,
      totalDeudas,
      destinoPrestamo,
    });
  }, [
    resultado.viable,
    monto,
    plazoSeleccionado,
    ingresoNeto,
    totalDeudas,
  ]);

  const sinCapacidad = resultado.capacidad.cuotaMaxima <= 0;

  const cronogramaVisible = resultado.cronograma.slice(0, 3);

  const porcentajeVisual = Math.min(
    100,
    Math.max(0, resultado.porcentajeCapacidad),
  );

  const ajustarMonto = (valor: number) => {
    setMonto(normalizarMonto(valor));
  };

  const usarAlternativa = () => {
    if (!alternativa) return;

    setMonto(alternativa.monto);
  };

    const confirmar = () => {
    if (!resultado.viable || !confirmo) return;

    setSimulacion({
      monto: resultado.monto,
      plazoMeses: resultado.plazoMeses,
      destinoPrestamo: resultado.destinoPrestamo,

      cuotaMensual: resultado.cuotaMensual,
      cuotaBase: resultado.cuotaBase,

      capitalPrimeraCuota:
        resultado.desglosePrimeraCuota.capital,

      interesPrimeraCuota:
        resultado.desglosePrimeraCuota.interes,

      seguroDesgravamenMensual:
        resultado.desglosePrimeraCuota.seguroDesgravamen,

      gastosAdministrativosMensuales:
        resultado.desglosePrimeraCuota.gastosAdministrativos,

      totalPagar: resultado.totalPagar,
      interesTotal: resultado.interesTotal,
      seguroTotal: resultado.seguroTotal,
      gastosAdministrativosTotal:
        resultado.gastosAdministrativosTotal,

      cuotaMaxima: resultado.capacidad.cuotaMaxima,
      porcentajeCapacidad: resultado.porcentajeCapacidad,

      tasaMensualPorcentaje:
        REGLAS_SIMULACION.tasaMensualPorcentaje,

      confirmadaEn: new Date().toISOString(),
    });

    completeAndAdvance("simulacion");
  };

  if (!datosFinancieros) {
    return (
      <p className="text-sm leading-6 text-body">
        Completa primero tus datos financieros para simular tu préstamo.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Elige el monto que necesitas. Kivo calculará automáticamente el
        plazo recomendado y una cuota compatible con tu capacidad de pago.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        {/* Controles */}
        <div>
          <p className="text-sm font-bold text-ink">
            ¿Cuánto necesitas?
          </p>

          <div className="mt-2">
            <PrefixedInputShell prefix="Bs">
              <NumericFormat
                id="montoSimulacion"
                value={monto}
                onValueChange={(value) => {
                  if (value.floatValue !== undefined) {
                    setMonto(value.floatValue);
                  }
                }}
                onBlur={() => {
                  ajustarMonto(monto);
                }}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                decimalScale={0}
                inputMode="numeric"
                className={prefixedInputClassName}
                aria-label="Monto del préstamo"
              />
            </PrefixedInputShell>
          </div>

          <p className="mt-1.5 text-xs text-muted">
            Puedes elegir montos de Bs 1.000 en Bs 1.000, desde{" "}
            {formatBs(REGLAS_SIMULACION.montoMinimo)} hasta{" "}
            {formatBs(REGLAS_SIMULACION.montoMaximo)}.
          </p>

          <input
            type="range"
            min={REGLAS_SIMULACION.montoMinimo}
            max={REGLAS_SIMULACION.montoMaximo}
            step={REGLAS_SIMULACION.pasoMonto}
            value={normalizarMonto(monto)}
            onChange={(event) => {
              setMonto(Number(event.target.value));
            }}
            aria-label="Ajustar monto del préstamo"
            className="mt-4 w-full accent-primary"
          />

          <div className="mt-1 flex justify-between text-xs font-semibold text-muted">
            <span>{formatBs(REGLAS_SIMULACION.montoMinimo)}</span>
            <span>{formatBs(REGLAS_SIMULACION.montoMaximo)}</span>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3">
            <div>
              <p className="text-xs font-medium text-muted">
                Tasa mensual
              </p>

              <p className="mt-0.5 text-lg font-bold text-ink">
                {REGLAS_SIMULACION.tasaMensualPorcentaje}% mensual
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
              <Percent className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div
          className={`rounded-2xl p-5 text-white transition-colors sm:p-6 ${
            resultado.viable ? "bg-primary-dark" : "bg-ink-soft"
          }`}
          aria-live="polite"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
            Tu cuota mensual estimada
          </p>

          <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-[42px]">
            <CuotaAnimada valor={resultado.cuotaMensual} />
          </p>

          <p className="mt-1 text-sm text-white/70">
            durante {plazoSeleccionado} meses
          </p>

          <div className="mt-5 border-t border-white/15 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-white/60">
                  Uso de tu capacidad
                </p>

                <p className="font-bold">
                  {etiquetaCapacidad(resultado.nivelCapacidad)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-extrabold">
                  {Math.round(resultado.porcentajeCapacidad)}%
                </p>
              </div>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white transition-[width]"
                style={{ width: `${porcentajeVisual}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-white/65">
              Cuota máxima estimada:{" "}
              {formatBs(Math.max(0, resultado.capacidad.cuotaMaxima))}
            </p>
          </div>
                    <div className="mt-5 border-t border-white/15 pt-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Desglose de la primera cuota
              </h3>

              <p className="mt-1 text-xs leading-5 text-white/60">
                Valores estimados para que entiendas cómo se compone.
              </p>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Capital", resultado.desglosePrimeraCuota.capital],
                ["Interés", resultado.desglosePrimeraCuota.interes],
                [
                  "Seguro",
                  resultado.desglosePrimeraCuota.seguroDesgravamen,
                ],
                [
                  "Gastos Administrativos",
                  resultado.desglosePrimeraCuota.gastosAdministrativos,
                ],
                ["Total cuota", resultado.desglosePrimeraCuota.total],
              ].map(([label, value], index, items) => (
                <div
                  key={String(label)}
                  className={`flex items-center justify-between gap-4 ${
                    index === items.length - 1
                      ? "border-t border-white/15 pt-3"
                      : ""
                  }`}
                >
                  <dt className="text-white/65">{label}</dt>

                  <dd className="font-bold text-white">
                    {formatBs(Number(value))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      
            {/* Veredicto */}
      <AnimatePresence mode="wait" initial={false}>
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
                Tus compromisos actuales no dejan espacio para una nueva
                cuota. Puedes volver a intentarlo cuando reduzcas tus deudas.
              </DangerNotice>
            </div>
          </motion.div>
        ) : resultado.viable ? (
          <motion.div
            key="viable"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-success/25 bg-success/5 px-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <CircleCheckBig className="h-4.5 w-4.5" />
              </span>

              <div>
                <p className="text-sm font-bold text-ink-soft">
                  Esta opción es compatible contigo
                </p>

                <p className="mt-0.5 text-[13px] leading-5 text-body">
                  La cuota está dentro de tu capacidad estimada y puede pasar
                  a la siguiente etapa de evaluación.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-viable"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <DangerNotice title="Esta combinación supera tu capacidad">
                La cuota de {formatBs(resultado.cuotaMensual)} está por encima
                de tu máximo de{" "}
                {formatBs(Math.max(0, resultado.capacidad.cuotaMaxima))}.
                Reduce el monto para encontrar una opción compatible.
              </DangerNotice>

              {alternativa ? (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3.5">
                  <Lightbulb className="h-4.5 w-4.5 shrink-0 text-warning" />

                  <p className="flex-1 text-[13px] leading-5 text-ink-soft">
                    <strong>Te sugerimos:</strong>{" "}
                    {formatBs(alternativa.monto)} a{" "}
                    {alternativa.plazoMeses} meses, con cuota de{" "}
                    {formatBs(alternativa.cuotaMensual)}.
                  </p>

                  <button
                    type="button"
                    onClick={usarAlternativa}
                    className="min-h-9 rounded-lg bg-primary px-3.5 text-[13px] font-bold text-white transition-colors hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                  >
                    Usar esta opción
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-surface p-4">
        <input
          type="checkbox"
          checked={confirmo}
          onChange={(event) => {
            setConfirmo(event.target.checked);
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />

        <span className="text-sm leading-6 text-ink-soft">
          Confirmo que revisé esta simulación y entiendo que los valores son
          estimados hasta completar la evaluación de Kivo.
        </span>
      </label>

      <div className="mt-6">
        <button
          type="button"
          onClick={confirmar}
          disabled={!resultado.viable || !confirmo}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.5} />
          Confirmar simulación
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}