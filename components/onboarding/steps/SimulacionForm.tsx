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
import { calcularEdad } from "@/lib/schemas/datos-personales";
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

export function SimulacionForm() {
  const datosPersonales = useOnboardingStore((state) => {
    return state.datosPersonales;
  });

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

  const edad = datosPersonales?.fechaNacimiento
    ? calcularEdad(datosPersonales.fechaNacimiento)
    : 0;

  const aplicaLimiteJoven = edad >= 18 && edad <= 24;

  const montoMaximoPermitido: number = aplicaLimiteJoven
    ? 20000
    : REGLAS_SIMULACION.montoMaximo;

  const plazoMaximoPermitido = aplicaLimiteJoven ? 24 : 36;

  const ingresoPrincipal = datosFinancieros?.ingresoNeto ?? 0;

  const segundoIngreso =
    datosFinancieros?.tieneSegundoIngreso &&
    datosFinancieros.segundoIngresoRespaldado
      ? datosFinancieros.segundoIngresoMonto ?? 0
      : 0;

  const ingresoNeto = ingresoPrincipal + segundoIngreso;
  const totalDeudas = datosFinancieros?.totalCuotasMensuales ?? 0;

  const montoInicial = Math.min(
    montoMaximoPermitido,
    normalizarMonto(simulacionGuardada?.monto ?? 15000),
  );

  const plazoInicial = simulacionGuardada?.plazoMeses ?? 12;

  const [monto, setMonto] = useState<number>(montoInicial);

  const [plazoSeleccionado, setPlazoSeleccionado] =
    useState<number>(plazoInicial);

  const [confirmo, setConfirmo] = useState(false);

  // En el flujo de asalariados, el destino se asigna automáticamente.
  const destinoPrestamo = "USO_PERSONAL" as const;

  const plazosDisponibles = useMemo(() => {
    return REGLAS_SIMULACION.plazosMeses.filter((plazo) => {
      if (plazo > plazoMaximoPermitido) {
        return false;
      }

      if (monto <= 15000) {
        return plazo <= 24;
      }

      if (monto <= 25000) {
        return plazo >= 9 && plazo <= 30;
      }

      return plazo >= 12;
    });
  }, [monto, plazoMaximoPermitido]);

  const plazoSeleccionadoPermitido = Math.min(
    plazoSeleccionado,
    plazoMaximoPermitido,
  );

  const plazoActivo = (
    plazosDisponibles as readonly number[]
  ).includes(plazoSeleccionadoPermitido)
    ? plazoSeleccionadoPermitido
    : (plazosDisponibles[0] ?? 12);

  const indicePlazoActivo = Math.max(
    0,
    (plazosDisponibles as readonly number[]).indexOf(plazoActivo),
  );

  const resultado = useMemo(() => {
    return simular({
      monto,
      plazoMeses: plazoActivo,
      ingresoNeto,
      totalDeudas,
      destinoPrestamo,
    });
  }, [
    monto,
    plazoActivo,
    ingresoNeto,
    totalDeudas,
    destinoPrestamo,
  ]);

  const alternativa = useMemo(() => {
    if (resultado.viable) return null;

    return buscarAlternativa({
      monto,
      plazoMeses: plazoActivo,
      ingresoNeto,
      totalDeudas,
      destinoPrestamo,
    });
  }, [
    resultado.viable,
    monto,
    plazoActivo,
    ingresoNeto,
    totalDeudas,
    destinoPrestamo,
  ]);

  const sinCapacidad = resultado.capacidad.cuotaMaxima <= 0;

  const ajustarMonto = (valor: number) => {
    const montoNormalizado = normalizarMonto(valor);
    setMonto(Math.min(montoMaximoPermitido, montoNormalizado));
  };

  const ajustarPlazo = (valor: number) => {
    const plazoMasCercano = plazosDisponibles.reduce((anterior, actual) => {
      return Math.abs(actual - valor) < Math.abs(anterior - valor)
        ? actual
        : anterior;
    }, plazosDisponibles[0] ?? 12);

    setPlazoSeleccionado(plazoMasCercano);
  };

  const usarAlternativa = () => {
    if (!alternativa) return;

    setMonto(Math.min(alternativa.monto, montoMaximoPermitido));
    setPlazoSeleccionado(
      Math.min(alternativa.plazoMeses, plazoMaximoPermitido),
    );
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
        Completa primero tus datos financieros para calcular tu cuota.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Elige el monto que necesitas y en cuántos meses quieres pagarlo.
        Kivo calculará una cuota compatible con tu capacidad de pago.
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
            {formatBs(montoMaximoPermitido)}.
          </p>

          <input
            type="range"
            min={REGLAS_SIMULACION.montoMinimo}
            max={montoMaximoPermitido}
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

            <span>{formatBs(montoMaximoPermitido)}</span>
          </div>

          {/* Selección de plazo */}
          <div className="mt-7">
            <p className="text-sm font-bold text-ink">
              ¿En cuántos meses quieres pagar?
            </p>

            <div className="mt-2">
              <PrefixedInputShell prefix="Meses">
                <NumericFormat
                  id="plazoSimulacion"
                  value={plazoActivo}
                  onValueChange={(value) => {
                    if (value.floatValue !== undefined) {
                      setPlazoSeleccionado(value.floatValue);
                    }
                  }}
                  onBlur={() => {
                    ajustarPlazo(plazoSeleccionado);
                  }}
                  allowNegative={false}
                  decimalScale={0}
                  inputMode="numeric"
                  className={prefixedInputClassName}
                  aria-label="Plazo del préstamo en meses"
                />
              </PrefixedInputShell>
            </div>

            <p className="mt-1.5 text-xs text-muted">
              Puedes elegir un plazo entre{" "}
              {plazosDisponibles[0] ?? plazoActivo} y{" "}
              {plazosDisponibles[plazosDisponibles.length - 1] ?? plazoActivo}{" "}
              meses.
            </p>

            <input
              type="range"
              min={0}
              max={Math.max(0, plazosDisponibles.length - 1)}
              step={1}
              value={indicePlazoActivo}
              onChange={(event) => {
                const indice = Number(event.target.value);
                const nuevoPlazo = plazosDisponibles[indice];

                if (nuevoPlazo !== undefined) {
                  setPlazoSeleccionado(nuevoPlazo);
                }
              }}
              aria-label="Seleccionar plazo del préstamo"
              aria-valuetext={`${plazoActivo} meses`}
              className="mt-4 w-full accent-primary"
            />

            <div className="mt-1 flex justify-between text-xs font-semibold text-muted">
              <span>{plazosDisponibles[0] ?? plazoActivo} meses</span>

              <span>
                {plazosDisponibles[plazosDisponibles.length - 1] ??
                  plazoActivo}{" "}
                meses
              </span>
            </div>
          </div>

          {/* Tasa */}
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
            durante {plazoActivo} meses
          </p>

          <div className="mt-5 border-t border-white/15 pt-4">
            <p className="text-sm text-white/70">
              Cuota máxima estimada:{" "}
              <strong className="font-bold text-white">
                {formatBs(
                  Math.max(0, resultado.capacidad.cuotaMaxima),
                )}
              </strong>
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
                  resultado.desglosePrimeraCuota
                    .seguroDesgravamen,
                ],
                [
                  "Gastos Administrativos",
                  resultado.desglosePrimeraCuota
                    .gastosAdministrativos,
                ],
                [
                  "Total cuota",
                  resultado.desglosePrimeraCuota.total,
                ],
              ].map(([label, value], index, items) => (
                <div
                  key={String(label)}
                  className={`flex items-center justify-between gap-4 ${
                    index === items.length - 1
                      ? "border-t border-white/15 pt-3"
                      : ""
                  }`}
                >
                  <dt className="text-white/65">
                    {label}
                  </dt>

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
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <DangerNotice title="Por ahora no podemos continuar">
                Tus compromisos actuales no dejan espacio para una
                nueva cuota. Puedes volver a intentarlo cuando
                reduzcas tus deudas.
              </DangerNotice>
            </div>
          </motion.div>
        ) : resultado.viable ? (
          <motion.div
            key="viable"
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
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
                  La cuota está dentro de tu capacidad estimada y
                  puede pasar a la siguiente etapa de evaluación.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-viable"
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={REVEAL}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <DangerNotice title="Esta combinación supera tu capacidad">
                La cuota de {formatBs(resultado.cuotaMensual)} está
                por encima de tu máximo de{" "}
                {formatBs(
                  Math.max(0, resultado.capacidad.cuotaMaxima),
                )}
                . Reduce el monto o aumenta el plazo para encontrar
                una opción compatible.
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
          Confirmo que revisé el cálculo de mi cuota y entiendo que los
          valores son estimados hasta completar la evaluación de
          Kivo.
        </span>
      </label>

      <div className="mt-6">
        <button
          type="button"
          onClick={confirmar}
          disabled={!resultado.viable || !confirmo}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <ShieldCheck
            className="h-4.5 w-4.5"
            strokeWidth={2.5}
          />

          Confirmar

          <ArrowRight
            className="h-4.5 w-4.5"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}