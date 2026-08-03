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
  BriefcaseBusiness,
  CircleCheckBig,
  Gauge,
  HeartHandshake,
  Lightbulb,
  Percent,
  ShieldCheck,
} from "lucide-react";
import { NumericFormat } from "react-number-format";

import {
  REGLAS_SIMULACION,
  buscarAlternativa,
  compararPlazos,
  normalizarMonto,
  obtenerPlazosPorMonto,
  simular,
  type DestinoPrestamo,
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

  const [destinoPrestamo, setDestinoPrestamo] =
    useState<DestinoPrestamo>(
      simulacionGuardada?.destinoPrestamo ?? "CAPITAL_TRABAJO",
    );

  const plazosDisponibles = useMemo(() => {
    return obtenerPlazosPorMonto(monto);
  }, [monto]);

  const plazoInicial =
    simulacionGuardada?.plazoMeses &&
    plazosDisponibles.includes(simulacionGuardada.plazoMeses)
      ? simulacionGuardada.plazoMeses
      : plazosDisponibles[Math.floor(plazosDisponibles.length / 2)] ??
        plazosDisponibles[0] ??
        12;

  const [plazoMeses, setPlazoMeses] = useState<number>(plazoInicial);
  const [confirmo, setConfirmo] = useState(false);

  const plazoSeleccionado = plazosDisponibles.includes(plazoMeses)
    ? plazoMeses
    : (plazosDisponibles[Math.floor(plazosDisponibles.length / 2)] ??
      plazosDisponibles[0] ??
      12);

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
    destinoPrestamo,
  ]);

  const comparacion = useMemo(() => {
    return compararPlazos({
      monto,
      ingresoNeto,
      totalDeudas,
      destinoPrestamo,
    });
  }, [monto, ingresoNeto, totalDeudas, destinoPrestamo]);

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
    destinoPrestamo,
  ]);

  const sinCapacidad = resultado.capacidad.cuotaMaxima <= 0;

  const cronogramaVisible = resultado.cronograma.slice(0, 3);

  const porcentajeVisual = Math.min(
    100,
    Math.max(0, resultado.porcentajeCapacidad),
  );

  const ajustarMonto = (valor: number) => {
    const normalizado = normalizarMonto(valor);
    setMonto(normalizado);
  };

  const usarAlternativa = () => {
    if (!alternativa) return;

    setMonto(alternativa.monto);
    setPlazoMeses(alternativa.plazoMeses);
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
        Elige el destino, monto y plazo. Te mostraremos una cuota estimada,
        el costo total y qué tan cómoda resulta para tu capacidad de pago.
      </p>

      {/* Destino */}
      <fieldset>
        <legend className="text-sm font-bold text-ink">
          ¿Para qué necesitas el préstamo?
        </legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label
            className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
              destinoPrestamo === "CAPITAL_TRABAJO"
                ? "border-primary bg-surface-blue shadow-[0_8px_22px_rgba(3,174,254,0.12)]"
                : "border-border bg-white hover:border-primary/40"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              checked={destinoPrestamo === "CAPITAL_TRABAJO"}
              onChange={() => {
                setDestinoPrestamo("CAPITAL_TRABAJO");
              }}
            />

            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BriefcaseBusiness className="h-5 w-5" />
              </span>

              <div>
                <p className="font-extrabold text-ink">
                  Capital de trabajo
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Mercadería, proveedores, herramientas o flujo de caja.
                </p>
              </div>
            </div>
          </label>

          <label
            className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
              destinoPrestamo === "USO_PERSONAL"
                ? "border-primary bg-surface-blue shadow-[0_8px_22px_rgba(3,174,254,0.12)]"
                : "border-border bg-white hover:border-primary/40"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              checked={destinoPrestamo === "USO_PERSONAL"}
              onChange={() => {
                setDestinoPrestamo("USO_PERSONAL");
              }}
            />

            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <HeartHandshake className="h-5 w-5" />
              </span>

              <div>
                <p className="font-extrabold text-ink">
                  Uso personal
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Salud, estudios, hogar u otra necesidad personal.
                </p>
              </div>
            </div>
          </label>
        </div>
      </fieldset>

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

          <p className="mt-6 text-sm font-bold text-ink">
            Selecciona el plazo
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {comparacion.map((opcion) => (
              <button
                key={opcion.plazoMeses}
                type="button"
                onClick={() => {
                  setPlazoMeses(opcion.plazoMeses);
                }}
                className={`relative rounded-2xl border-2 p-3 text-left transition-all ${
                  plazoSeleccionado === opcion.plazoMeses
                    ? "border-primary bg-surface-blue"
                    : opcion.viable
                      ? "border-border bg-white hover:border-primary/40"
                      : "border-border bg-surface opacity-55"
                }`}
              >
                {opcion.recomendado ? (
                  <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold text-white">
                    Recomendado
                  </span>
                ) : null}

                <p className="text-xl font-extrabold text-ink">
                  {opcion.plazoMeses}
                </p>

                <p className="text-xs text-muted">meses</p>

                <p className="mt-2 text-sm font-bold text-primary-dark">
                  {formatBs(opcion.cuotaMensual)}
                </p>

                <p className="text-[11px] text-muted">
                  Total {formatBs(opcion.totalPagar)}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3">
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

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-sm">
            <div>
              <p className="text-xs text-white/60">Monto solicitado</p>
              <p className="font-bold">{formatBs(resultado.monto)}</p>
            </div>

            <div>
              <p className="text-xs text-white/60">Total a pagar</p>
              <p className="font-bold">
                {formatBs(resultado.totalPagar)}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/60">Interés total</p>
              <p className="font-bold">
                {formatBs(resultado.interesTotal)}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/60">Seguro total</p>
              <p className="font-bold">
                {formatBs(resultado.seguroTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose */}
      <section className="mt-6 rounded-2xl border border-border-soft bg-white p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-blue text-primary">
            <Gauge className="h-5 w-5" />
          </span>

          <div>
            <h3 className="text-sm font-extrabold text-ink">
              Desglose de la primera cuota
            </h3>

            <p className="text-xs text-muted">
              Valores estimados para que entiendas cómo se compone.
            </p>
          </div>
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            [
              "Capital",
              resultado.desglosePrimeraCuota.capital,
            ],
            [
              "Interés",
              resultado.desglosePrimeraCuota.interes,
            ],
            [
              "Seguro",
              resultado.desglosePrimeraCuota.seguroDesgravamen,
            ],
            [
              "Administración",
              resultado.desglosePrimeraCuota.gastosAdministrativos,
            ],
            [
              "Total cuota",
              resultado.desglosePrimeraCuota.total,
            ],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-xl bg-surface p-3"
            >
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {label}
              </dt>

              <dd className="mt-1 text-base font-extrabold text-ink-soft">
                {formatBs(Number(value))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Cronograma */}
      <section className="mt-6 rounded-2xl border border-border-soft bg-white p-4 sm:p-5">
        <h3 className="text-sm font-extrabold text-ink">
          Primeras cuotas estimadas
        </h3>

        <p className="mt-1 text-xs text-muted">
          El capital aumenta y el interés disminuye conforme avanzan los pagos.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-soft text-[11px] uppercase tracking-wide text-muted">
                <th className="px-3 py-2">Cuota</th>
                <th className="px-3 py-2">Capital</th>
                <th className="px-3 py-2">Interés</th>
                <th className="px-3 py-2">Seguro</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Saldo</th>
              </tr>
            </thead>

            <tbody>
              {cronogramaVisible.map((cuota) => (
                <tr
                  key={cuota.numero}
                  className="border-b border-border-soft last:border-0"
                >
                  <td className="px-3 py-3 font-bold text-ink">
                    {cuota.numero}
                  </td>

                  <td className="px-3 py-3">
                    {formatBs(cuota.capital)}
                  </td>

                  <td className="px-3 py-3">
                    {formatBs(cuota.interes)}
                  </td>

                  <td className="px-3 py-3">
                    {formatBs(cuota.seguroDesgravamen)}
                  </td>

                  <td className="px-3 py-3 font-bold text-ink-soft">
                    {formatBs(cuota.cuotaTotal)}
                  </td>

                  <td className="px-3 py-3">
                    {formatBs(cuota.saldoCapital)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
                Ajusta el monto o el plazo.
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
