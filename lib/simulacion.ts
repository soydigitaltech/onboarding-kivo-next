/**
 * Motor de simulación de préstamos Kivo.
 *
 * Capacidad de pago:
 * 1. Se descuenta 40% del ingreso como gastos personales.
 * 2. Se restan las cuotas de otras entidades.
 * 3. Se reserva 10% del saldo disponible como margen de ahorro.
 * 4. El resultado es la cuota máxima estimada.
 */

export const REGLAS_SIMULACION = {
  /** Tasa mensual. */
  tasaMensualPorcentaje: 3,

  montoMinimo: 7000,
  montoMaximo: 35000,

  /** Los montos solo avanzan de Bs 1.000 en Bs 1.000. */
  pasoMonto: 1000,

  /** Plazos disponibles, siempre de tres en tres meses. */
  plazosMeses: [6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],

  castigoGastosPersonales: 0.4,
  margenAhorroSobreSaldo: 0.1,

  /**
   * Parámetros provisionales para mostrar el desglose.
   * Deben confirmarse con Kivo antes de producción.
   */
  seguroDesgravamenMensualPorcentaje: 0.15,
  gastosAdministrativosMensuales: 18,
} as const;

export type DestinoPrestamo = "CAPITAL_TRABAJO" | "USO_PERSONAL";

export interface CapacidadPago {
  ingresoNeto: number;
  gastosPersonales: number;
  saldoDisponible: number;
  totalDeudas: number;
  disponibleTrasDeudas: number;
  margenAhorro: number;
  cuotaMaxima: number;
}

export interface DesgloseCuota {
  capital: number;
  interes: number;
  seguroDesgravamen: number;
  gastosAdministrativos: number;
  total: number;
}

export interface CronogramaItem {
  numero: number;
  capital: number;
  interes: number;
  seguroDesgravamen: number;
  gastosAdministrativos: number;
  cuotaTotal: number;
  saldoCapital: number;
}

export interface ResultadoSimulacion {
  monto: number;
  plazoMeses: number;
  destinoPrestamo: DestinoPrestamo;

  cuotaBase: number;
  cuotaMensual: number;
  totalPagar: number;
  interesTotal: number;
  seguroTotal: number;
  gastosAdministrativosTotal: number;

  desglosePrimeraCuota: DesgloseCuota;
  cronograma: CronogramaItem[];

  capacidad: CapacidadPago;
  porcentajeCapacidad: number;
  nivelCapacidad: "COMODA" | "AJUSTADA" | "AL_LIMITE";
  viable: boolean;
}

export interface ComparacionPlazo {
  plazoMeses: number;
  cuotaMensual: number;
  totalPagar: number;
  interesTotal: number;
  viable: boolean;
  recomendado: boolean;
}

export interface Alternativa {
  monto: number;
  plazoMeses: number;
  cuotaMensual: number;
  estrategia: "AMPLIAR_PLAZO" | "REDUCIR_MONTO";
}

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
 * Define los plazos disponibles según el monto solicitado.
 */
export function obtenerPlazosPorMonto(monto: number): number[] {
  if (monto <= 15000) {
    return [6, 9, 12, 15, 18, 21, 24];
  }

  if (monto <= 25000) {
    return [9, 12, 15, 18, 21, 24, 27, 30];
  }

  return [12, 15, 18, 21, 24, 27, 30, 33, 36];
}

/**
 * Garantiza montos válidos, dentro del rango y en incrementos de Bs 1.000.
 */
export function normalizarMonto(valor: number): number {
  const { montoMinimo, montoMaximo, pasoMonto } = REGLAS_SIMULACION;

  const acotado = Math.min(montoMaximo, Math.max(montoMinimo, valor));
  const normalizado = Math.round(acotado / pasoMonto) * pasoMonto;

  return Math.min(montoMaximo, Math.max(montoMinimo, normalizado));
}

/**
 * Cuota base mediante sistema francés.
 */
export function calcularCuotaMensual({
  monto,
  plazoMeses,
}: {
  monto: number;
  plazoMeses: number;
}): number {
  const tasa = REGLAS_SIMULACION.tasaMensualPorcentaje / 100;

  if (monto <= 0 || plazoMeses <= 0) return 0;
  if (tasa === 0) return redondear(monto / plazoMeses);

  const factor = Math.pow(1 + tasa, plazoMeses);

  return redondear(
    monto * ((tasa * factor) / (factor - 1)),
  );
}

function calcularSeguroMensual(monto: number): number {
  return redondear(
    monto *
      (REGLAS_SIMULACION.seguroDesgravamenMensualPorcentaje / 100),
  );
}

function generarCronograma({
  monto,
  plazoMeses,
  cuotaBase,
  seguroMensual,
}: {
  monto: number;
  plazoMeses: number;
  cuotaBase: number;
  seguroMensual: number;
}): CronogramaItem[] {
  const tasa = REGLAS_SIMULACION.tasaMensualPorcentaje / 100;
  const gastos = REGLAS_SIMULACION.gastosAdministrativosMensuales;

  let saldo = monto;
  const cronograma: CronogramaItem[] = [];

  for (let numero = 1; numero <= plazoMeses; numero += 1) {
    const interes = redondear(saldo * tasa);
    const capital = redondear(Math.min(saldo, cuotaBase - interes));
    saldo = redondear(Math.max(0, saldo - capital));

    cronograma.push({
      numero,
      capital,
      interes,
      seguroDesgravamen: seguroMensual,
      gastosAdministrativos: gastos,
      cuotaTotal: redondear(cuotaBase + seguroMensual + gastos),
      saldoCapital: saldo,
    });
  }

  return cronograma;
}

export function simular({
  monto,
  plazoMeses,
  ingresoNeto,
  totalDeudas,
  destinoPrestamo = "CAPITAL_TRABAJO",
}: {
  monto: number;
  plazoMeses: number;
  ingresoNeto: number;
  totalDeudas: number;
  destinoPrestamo?: DestinoPrestamo;
}): ResultadoSimulacion {
  const montoNormalizado = normalizarMonto(monto);
  const capacidad = calcularCapacidadPago({ ingresoNeto, totalDeudas });

  const cuotaBase = calcularCuotaMensual({
    monto: montoNormalizado,
    plazoMeses,
  });

  const seguroMensual = calcularSeguroMensual(montoNormalizado);
  const gastosMensuales = REGLAS_SIMULACION.gastosAdministrativosMensuales;

  const cuotaMensual = redondear(
    cuotaBase + seguroMensual + gastosMensuales,
  );

  const cronograma = generarCronograma({
    monto: montoNormalizado,
    plazoMeses,
    cuotaBase,
    seguroMensual,
  });

  const interesTotal = redondear(
    cronograma.reduce((total, cuota) => total + cuota.interes, 0),
  );

  const seguroTotal = redondear(seguroMensual * plazoMeses);
  const gastosAdministrativosTotal = redondear(
    gastosMensuales * plazoMeses,
  );

  const totalPagar = redondear(
    montoNormalizado +
      interesTotal +
      seguroTotal +
      gastosAdministrativosTotal,
  );

  const primeraCuota = cronograma[0];

  const porcentajeCapacidad =
    capacidad.cuotaMaxima > 0
      ? redondear((cuotaMensual / capacidad.cuotaMaxima) * 100)
      : 100;

  const nivelCapacidad =
    porcentajeCapacidad <= 70
      ? "COMODA"
      : porcentajeCapacidad <= 90
        ? "AJUSTADA"
        : "AL_LIMITE";

  return {
    monto: montoNormalizado,
    plazoMeses,
    destinoPrestamo,
    cuotaBase,
    cuotaMensual,
    totalPagar,
    interesTotal,
    seguroTotal,
    gastosAdministrativosTotal,
    desglosePrimeraCuota: {
      capital: primeraCuota?.capital ?? 0,
      interes: primeraCuota?.interes ?? 0,
      seguroDesgravamen: seguroMensual,
      gastosAdministrativos: gastosMensuales,
      total: cuotaMensual,
    },
    cronograma,
    capacidad,
    porcentajeCapacidad,
    nivelCapacidad,
    viable:
      cuotaMensual > 0 &&
      capacidad.cuotaMaxima > 0 &&
      cuotaMensual <= capacidad.cuotaMaxima,
  };
}

export function compararPlazos({
  monto,
  ingresoNeto,
  totalDeudas,
  destinoPrestamo,
}: {
  monto: number;
  ingresoNeto: number;
  totalDeudas: number;
  destinoPrestamo: DestinoPrestamo;
}): ComparacionPlazo[] {
  const plazos = obtenerPlazosPorMonto(monto);

  const resultados = plazos.map((plazoMeses) => {
    const resultado = simular({
      monto,
      plazoMeses,
      ingresoNeto,
      totalDeudas,
      destinoPrestamo,
    });

    return {
      plazoMeses,
      cuotaMensual: resultado.cuotaMensual,
      totalPagar: resultado.totalPagar,
      interesTotal: resultado.interesTotal,
      viable: resultado.viable,
      recomendado: false,
    };
  });

  const opcionesViables = resultados.filter((resultado) => resultado.viable);

  if (opcionesViables.length > 0) {
    const indiceRecomendado = Math.floor(opcionesViables.length / 2);
    const recomendado = opcionesViables[indiceRecomendado];

    return resultados.map((resultado) => ({
      ...resultado,
      recomendado: resultado.plazoMeses === recomendado.plazoMeses,
    }));
  }

  return resultados;
}

export function buscarAlternativa({
  monto,
  plazoMeses,
  ingresoNeto,
  totalDeudas,
  destinoPrestamo = "CAPITAL_TRABAJO",
}: {
  monto: number;
  plazoMeses: number;
  ingresoNeto: number;
  totalDeudas: number;
  destinoPrestamo?: DestinoPrestamo;
}): Alternativa | null {
  const montoNormalizado = normalizarMonto(monto);
  const plazosDisponibles = obtenerPlazosPorMonto(montoNormalizado);

  const plazosMayores = plazosDisponibles.filter(
    (plazo) => plazo > plazoMeses,
  );

  for (const plazo of plazosMayores) {
    const resultado = simular({
      monto: montoNormalizado,
      plazoMeses: plazo,
      ingresoNeto,
      totalDeudas,
      destinoPrestamo,
    });

    if (resultado.viable) {
      return {
        monto: montoNormalizado,
        plazoMeses: plazo,
        cuotaMensual: resultado.cuotaMensual,
        estrategia: "AMPLIAR_PLAZO",
      };
    }
  }

  const plazoMasLargo = Math.max(...plazosDisponibles);

  for (
    let montoAlternativo =
      montoNormalizado - REGLAS_SIMULACION.pasoMonto;
    montoAlternativo >= REGLAS_SIMULACION.montoMinimo;
    montoAlternativo -= REGLAS_SIMULACION.pasoMonto
  ) {
    const resultado = simular({
      monto: montoAlternativo,
      plazoMeses: plazoMasLargo,
      ingresoNeto,
      totalDeudas,
      destinoPrestamo,
    });

    if (resultado.viable) {
      return {
        monto: montoAlternativo,
        plazoMeses: plazoMasLargo,
        cuotaMensual: resultado.cuotaMensual,
        estrategia: "REDUCIR_MONTO",
      };
    }
  }

  return null;
}

function redondear(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}
