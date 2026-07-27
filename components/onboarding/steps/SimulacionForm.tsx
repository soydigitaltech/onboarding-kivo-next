"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  type Transition,
} from "motion/react";
import { ArrowRight, CircleCheckBig, Lightbulb, Percent } from "lucide-react";
import { NumericFormat } from "react-number-format";

import {
  REGLAS_SIMULACION,
  buscarAlternativa,
  simular,
} from "@/lib/simulacion";
import { formatBs } from "@/lib/schemas/datos-financieros";
import { useOnboardingStore } from "@/store/onboarding";
import {
  DangerNotice,
  PrefixedInputShell,
  prefixedInputClassName,
} from "@/components/ui/fields";

const REVEAL: Transition = { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] };

/** Número que se anima con física de spring al cambiar. */
function CuotaAnimada({ valor }: { valor: number }) {
  const spring = useSpring(valor, { stiffness: 130, damping: 22 });
  const texto = useTransform(spring, (v) => formatBs(Math.round(v)));

  useEffect(() => {
    spring.set(valor);
  }, [valor, spring]);

  return <motion.span>{texto}</motion.span>;
}

export function SimulacionForm() {
  const datosFinancieros = useOnboardingStore((s) => s.datosFinancieros);
  const setSimulacion = useOnboardingStore((s) => s.setSimulacion);
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);

  const { montoMinimo, montoMaximo, pasoMonto } = REGLAS_SIMULACION;
  const plazosMeses: readonly number[] = REGLAS_SIMULACION.plazosMeses;

  const [monto, setMonto] = useState<number>(15000);
  const [plazoMeses, setPlazoMeses] = useState<number>(plazosMeses[1] ?? 12);

  const ingresoNeto = datosFinancieros?.ingresoNeto ?? 0;
  const totalDeudas = datosFinancieros?.totalCuotasMensuales ?? 0;

  const resultado = useMemo(
    () => simular({ monto, plazoMeses, ingresoNeto, totalDeudas }),
    [monto, plazoMeses, ingresoNeto, totalDeudas],
  );

  const alternativa = useMemo(
    () =>
      resultado.viable
        ? null
        : buscarAlternativa({ monto, plazoMeses, ingresoNeto, totalDeudas }),
    [resultado.viable, monto, plazoMeses, ingresoNeto, totalDeudas],
  );

  const sinCapacidad = resultado.capacidad.cuotaMaxima <= 0;
  const indicePlazo = Math.max(0, plazosMeses.indexOf(plazoMeses));

  const ajustarMonto = (valor: number) => {
    const acotado = Math.min(montoMaximo, Math.max(montoMinimo, valor));
    setMonto(acotado);
  };

  const usarAlternativa = () => {
    if (!alternativa) return;
    setMonto(alternativa.monto);
    setPlazoMeses(alternativa.plazoMeses);
  };

  const confirmar = () => {
    if (!resultado.viable) return;

    setSimulacion({
      monto: resultado.monto,
      plazoMeses: resultado.plazoMeses,
      cuotaMensual: resultado.cuotaMensual,
      totalPagar: resultado.totalPagar,
      interesTotal: resultado.interesTotal,
      cuotaMaxima: resultado.capacidad.cuotaMaxima,
      tasaMensualPorcentaje: REGLAS_SIMULACION.tasaMensualPorcentaje,
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
        Ajusta el monto y el plazo: tu cuota se calcula al instante según tu
        capacidad de pago.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        {/* Controles */}
        <div>
          {/* Monto */}
          <p className="text-sm font-bold text-ink">¿Cuánto necesitas?</p>

          <div className="mt-2">
            <PrefixedInputShell prefix="Bs">
              <NumericFormat
                id="montoSimulacion"
                value={monto}
                onValueChange={(v) => {
                  if (v.floatValue !== undefined) setMonto(v.floatValue);
                }}
                onBlur={() => ajustarMonto(monto)}
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
            Monto mínimo disponible: {formatBs(montoMinimo)}.
          </p>

          <input
            type="range"
            min={montoMinimo}
            max={montoMaximo}
            step={pasoMonto}
            value={Math.min(montoMaximo, Math.max(montoMinimo, monto))}
            onChange={(e) => setMonto(Number(e.target.value))}
            aria-label="Ajustar monto del préstamo"
            className="mt-3 w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-muted">
            <span>{formatBs(montoMinimo)}</span>
            <span>{formatBs(montoMaximo)}</span>
          </div>

          {/* Plazo: card con número grande + slider */}
          <p className="mt-6 text-sm font-bold text-ink">Selecciona el plazo</p>

          <div className="mt-2 rounded-xl border-2 border-border bg-white px-4 py-4">
            <div className="flex items-start justify-between">
              <span className="pt-1.5 text-sm font-medium text-muted">
                Tiempo de pago
              </span>
              <div className="text-right">
                <span className="block text-3xl font-extrabold leading-none text-primary">
                  {plazoMeses}
                </span>
                <span className="text-xs font-medium text-placeholder">
                  meses
                </span>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={plazosMeses.length - 1}
              step={1}
              value={indicePlazo}
              onChange={(e) => {
                const elegido = plazosMeses[Number(e.target.value)];
                if (elegido !== undefined) setPlazoMeses(elegido);
              }}
              aria-label="Plazo en meses"
              className="mt-4 w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs font-medium text-placeholder">
              <span>{Math.min(...plazosMeses)} meses</span>
              <span>{Math.max(...plazosMeses)} meses</span>
            </div>
          </div>

          {/* Tasa referencial */}
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3">
            <div>
              <p className="text-xs font-medium text-muted">
                Tasa de interés referencial
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

        {/* Resultado en vivo */}
        <div
          className={`rounded-2xl p-5 text-white transition-colors sm:p-6 ${
            resultado.viable ? "bg-primary-dark" : "bg-ink-soft"
          }`}
          aria-live="polite"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
            Tu cuota mensual
          </p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-[42px]">
            <CuotaAnimada valor={resultado.cuotaMensual} />
          </p>
          <p className="mt-1 text-sm text-white/70">
            durante {plazoMeses} meses
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-sm">
            <div>
              <p className="text-xs text-white/60">Total a pagar</p>
              <p className="font-bold">{formatBs(resultado.totalPagar)}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Interés total</p>
              <p className="font-bold">{formatBs(resultado.interesTotal)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-white/60">
                Tu cuota máxima según capacidad de pago
              </p>
              <p className="font-bold">
                {formatBs(Math.max(0, resultado.capacidad.cuotaMaxima))}
              </p>
            </div>
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
                  La cuota está dentro de tu capacidad de pago estimada.
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
                La cuota de {formatBs(resultado.cuotaMensual)} está por
                encima de tu máximo de{" "}
                {formatBs(Math.max(0, resultado.capacidad.cuotaMaxima))}.
                Ajusta el monto o el plazo.
              </DangerNotice>

              {alternativa ? (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3.5">
                  <Lightbulb className="h-4.5 w-4.5 shrink-0 text-warning" />
                  <p className="flex-1 text-[13px] leading-5 text-ink-soft">
                    <strong>Te sugerimos:</strong>{" "}
                    {formatBs(alternativa.monto)} a {alternativa.plazoMeses}{" "}
                    meses, con cuota de {formatBs(alternativa.cuotaMensual)}.
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

      <div className="mt-6">
        <button
          type="button"
          onClick={confirmar}
          disabled={!resultado.viable}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirmar simulación
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}