/**
 * Motor de simulación de préstamos Kivo.
 *
 * Modelo de capacidad de pago (documento interno Kivo):
 *   1. Al ingreso neto se le castiga un 40% como gastos personales.
 *   2. Saldo disponible = ingreso × 60%.
 *   3. Se restan los pasivos (cuotas mensuales en otras entidades).
 *   4. Se reserva un margen de ahorro del 10% del saldo disponible.
 *   5. Lo que queda es la cuota máxima aceptable para Kivo.
 *
 * Ejemplo del documento: ingreso 10.000 → saldo 6.000 → deudas 1.100
 * → 4.900 → margen 600 → cuota máxima 4.300. ✓
 */

export const REGLAS_SIMULACION = {
  /** Tasa de interés MENSUAL en % (sistema francés). TODO: confirmar con Kivo. */
  tasaMensualPorcentaje: 3,

  /** Monto mínimo en Bs. TODO: confirmar con Kivo. */
  montoMinimo: 7000,

  /** Tope de autoservicio en Bs (montos mayores → oficina). TODO: confirmar. */
  montoMaximo: 35000,

  /** Paso del selector de monto. */
  pasoMonto: 500,

  /** Plazos disponibles en meses. TODO: confirmar con Kivo. */
  plazosMeses: [6, 12, 18, 24],

  /** Castigo de gastos personales sobre el ingreso neto. */
  castigoGastosPersonales: 0.4,

  /** Margen de ahorro sobre el saldo disponible. */
  margenAhorroSobreSaldo: 0.1,
} as const;

export interface CapacidadPago {
  ingresoNeto: number;
  gastosPersonales: number;
  saldoDisponible: number;
  totalDeudas: number;
  disponibleTrasDeudas: number;
  margenAhorro: number;
  cuotaMaxima: number;
}

/** Aplica la cascada del documento de Kivo. */
export function calcularCapacidadPago({
  ingresoNeto,
  totalDeudas,
}: {
  ingresoNeto: number;
  totalDeudas: number;
}): CapacidadPago {
  const gastosPersonales = redondear(
    ingresoNeto * REGLAS_SIMULACION.castigoGastosPersonales,
  );
  const saldoDisponible = redondear(ingresoNeto - gastosPersonales);
  const disponibleTrasDeudas = redondear(saldoDisponible - totalDeudas);
  const margenAhorro = redondear(
    saldoDisponible * REGLAS_SIMULACION.margenAhorroSobreSaldo,
  );
  const cuotaMaxima = redondear(disponibleTrasDeudas - margenAhorro);

  return {
    ingresoNeto,
    gastosPersonales,
    saldoDisponible,
    totalDeudas,
    disponibleTrasDeudas,
    margenAhorro,
    cuotaMaxima,
  };
}

/**
 * Cuota mensual con sistema francés.
 * cuota = capital × [i(1+i)^n] / [(1+i)^n − 1], con i = tasa mensual.
 */
export function calcularCuotaMensual({
  monto,
  plazoMeses,
}: {
  monto: number;
  plazoMeses: number;
}): number {
  const i = REGLAS_SIMULACION.tasaMensualPorcentaje / 100;

  if (monto <= 0 || plazoMeses <= 0) return 0;
  if (i === 0) return redondear(monto / plazoMeses);

  const factor = Math.pow(1 + i, plazoMeses);
  return redondear(monto * ((i * factor) / (factor - 1)));
}

export interface ResultadoSimulacion {
  monto: number;
  plazoMeses: number;
  cuotaMensual: number;
  totalPagar: number;
  interesTotal: number;
  capacidad: CapacidadPago;
  viable: boolean;
}

export function simular({
  monto,
  plazoMeses,
  ingresoNeto,
  totalDeudas,
}: {
  monto: number;
  plazoMeses: number;
  ingresoNeto: number;
  totalDeudas: number;
}): ResultadoSimulacion {
  const capacidad = calcularCapacidadPago({ ingresoNeto, totalDeudas });
  const cuotaMensual = calcularCuotaMensual({ monto, plazoMeses });
  const totalPagar = redondear(cuotaMensual * plazoMeses);
  const interesTotal = redondear(totalPagar - monto);

  return {
    monto,
    plazoMeses,
    cuotaMensual,
    totalPagar,
    interesTotal,
    capacidad,
    viable: cuotaMensual > 0 && cuotaMensual <= capacidad.cuotaMaxima,
  };
}

export interface Alternativa {
  monto: number;
  plazoMeses: number;
  cuotaMensual: number;
  estrategia: "AMPLIAR_PLAZO" | "REDUCIR_MONTO";
}

/**
 * Si la combinación no es viable: primero intenta conservar el monto
 * ampliando el plazo; si no alcanza, reduce el monto (en pasos) con
 * el plazo más largo disponible.
 */
export function buscarAlternativa({
  monto,
  plazoMeses,
  ingresoNeto,
  totalDeudas,
}: {
  monto: number;
  plazoMeses: number;
  ingresoNeto: number;
  totalDeudas: number;
}): Alternativa | null {
  const { plazosMeses, montoMinimo, pasoMonto } = REGLAS_SIMULACION;

  const plazosMayores = plazosMeses.filter((p) => p > plazoMeses);

  for (const plazo of plazosMayores) {
    const r = simular({ monto, plazoMeses: plazo, ingresoNeto, totalDeudas });
    if (r.viable) {
      return {
        monto,
        plazoMeses: plazo,
        cuotaMensual: r.cuotaMensual,
        estrategia: "AMPLIAR_PLAZO",
      };
    }
  }

  const plazoMasLargo = Math.max(...plazosMeses);

  for (
    let m = monto - pasoMonto;
    m >= montoMinimo;
    m -= pasoMonto
  ) {
    const r = simular({
      monto: m,
      plazoMeses: plazoMasLargo,
      ingresoNeto,
      totalDeudas,
    });
    if (r.viable) {
      return {
        monto: m,
        plazoMeses: plazoMasLargo,
        cuotaMensual: r.cuotaMensual,
        estrategia: "REDUCIR_MONTO",
      };
    }
  }

  return null;
}

function redondear(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}