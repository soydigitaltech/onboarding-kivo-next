import { KIVO_ONBOARDING_DEFAULTS } from "@/lib/config/kivo";

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
  tasaMensualPorcentaje: KIVO_ONBOARDING_DEFAULTS.tasaMensualPorcentaje,

  montoMinimo: 7000,

  /**
   * Límite visual utilizado por el slider.
   * No representa el monto máximo del préstamo.
   */
  montoMaximo: 50000,

  /**
   * Permite respetar límites exactos como
   * Bs 20.001, 35.001 y 50.001.
   */
  pasoMonto: 1,

  /** Plazos disponibles, siempre de tres en tres meses. */
  plazosMeses: Array.from(
    { length: 67 },
    (_, index) => index + 6,
  ),

  castigoGastosPersonales: 0.4,
  margenAhorroSobreSaldo: 0.1,

  /**
   * Parámetros provisionales para mostrar el desglose.
   * Deben confirmarse con Kivo antes de producción.
   */
  seguroDesgravamenMensualPorcentaje: 0.07,
} as const;


export interface CapacidadPago {
  ingresoNeto: number;
  gastosPersonales: number;
  saldoDisponible: number;
  totalDeudas: number;

  /** MD = IN - GP - TD */
  disponibleTrasDeudas: number;

  /** DIF = MD - CK */
  diferencia: number;

  /**
   * Se conserva por compatibilidad.
   * Representa la diferencia disponible después de CK.
   */
  margenAhorro: number;

  /** MA = DIF / IN expresado en porcentaje. */
  margenAhorroPorcentaje: number;

  /** PDE = (CK + TD) / IN expresado en porcentaje. */
  porcentajeEndeudamiento: number;
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

  cuotaBase: number;
  cuotaMensual: number;
  totalPagar: number;
  interesTotal: number;
  seguroTotal: number;
  gastosAdministrativosTotal: number;

  desglosePrimeraCuota: DesgloseCuota;
  cronograma: CronogramaItem[];

  cargoAdministrativoConfigurado: boolean;
  motivoCalculoNoDisponible:
    | "CARGO_ADMINISTRATIVO_NO_CONFIGURADO"
    | null;

  capacidad: CapacidadPago;
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
  cuotaKivo = 0,
}: {
  ingresoNeto: number;
  totalDeudas: number;
  cuotaKivo?: number;
}): CapacidadPago {
  const gastosPersonales = redondear(
    ingresoNeto *
      REGLAS_SIMULACION.castigoGastosPersonales,
  );

  const saldoDisponible = redondear(
    ingresoNeto - gastosPersonales,
  );

  const disponibleTrasDeudas = redondear(
    saldoDisponible - totalDeudas,
  );

  const diferencia = redondear(
    disponibleTrasDeudas - cuotaKivo,
  );

  const porcentajeEndeudamiento =
    ingresoNeto > 0
      ? redondear(
          ((cuotaKivo + totalDeudas) /
            ingresoNeto) *
            100,
        )
      : 100;

  const margenAhorroPorcentaje =
    ingresoNeto > 0
      ? redondear(
          (diferencia / ingresoNeto) * 100,
        )
      : 0;
return {
    ingresoNeto,
    gastosPersonales,
    saldoDisponible,
    totalDeudas,
    disponibleTrasDeudas,
    diferencia,

    // Compatibilidad con componentes existentes.
    margenAhorro: diferencia,

    margenAhorroPorcentaje,
    porcentajeEndeudamiento,
  };
}

/**
 * Define los plazos disponibles según el monto solicitado.
 */
export function obtenerPlazosPorMonto(
  monto: number,
): number[] {
  let minimo: number;
  let maximo: number;

  if (monto <= 20000) {
    minimo = 6;
    maximo = 24;
  } else if (monto <= 35000) {
    minimo = 6;
    maximo = 36;
  } else if (monto <= 50000) {
    minimo = 12;
    maximo = 48;
  } else {
    minimo = 12;
    maximo = 72;
  }

  return Array.from(
    {
      length: maximo - minimo + 1,
    },
    (_, index) => minimo + index,
  );
}

/**
 * Garantiza montos válidos, dentro del rango y en incrementos de Bs 1.000.
 */
export function normalizarMonto(valor: number): number {
  const {
    montoMinimo,
    pasoMonto,
  } = REGLAS_SIMULACION;

  const acotado = Math.max(
    montoMinimo,
    valor,
  );

  const normalizado =
    Math.round(
      acotado / pasoMonto,
    ) * pasoMonto;

  return Math.max(
    montoMinimo,
    normalizado,
  );
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


export function calcularGastoAdministrativoMensual(
  monto: number,
): number | null {
  const rango =
    KIVO_ONBOARDING_DEFAULTS.cargosAdministrativos.find(
      (item) =>
        monto >= item.desde &&
        monto <= item.hasta,
    );

  return rango?.cargo ?? null;
}

function generarCronograma({
  monto,
  plazoMeses,
  cuotaBase,
  seguroMensual,
  gastosMensuales,
}: {
  monto: number;
  plazoMeses: number;
  cuotaBase: number;
  seguroMensual: number;
  gastosMensuales: number;
}): CronogramaItem[] {
  const tasa =
    REGLAS_SIMULACION.tasaMensualPorcentaje / 100;

  const gastos = gastosMensuales;

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
}: {
  monto: number;
  plazoMeses: number;
  ingresoNeto: number;
  totalDeudas: number;
}): ResultadoSimulacion {
  const montoNormalizado = normalizarMonto(monto);

  const cuotaBase = calcularCuotaMensual({
    monto: montoNormalizado,
    plazoMeses,
  });

  const seguroMensual =
    calcularSeguroMensual(montoNormalizado);

  const gastoAdministrativo =
    calcularGastoAdministrativoMensual(
      montoNormalizado,
    );

  const cargoAdministrativoConfigurado =
    gastoAdministrativo !== null;

  const gastosMensuales =
    gastoAdministrativo ?? 0;

  const cuotaMensual =
    cargoAdministrativoConfigurado
      ? redondear(
          cuotaBase +
            seguroMensual +
            gastosMensuales,
        )
      : 0;

  const capacidad = calcularCapacidadPago({
    ingresoNeto,
    totalDeudas,
    cuotaKivo: cuotaMensual,
  });

  const cronograma =
    cargoAdministrativoConfigurado
      ? generarCronograma({
          monto: montoNormalizado,
          plazoMeses,
          cuotaBase,
          seguroMensual,
          gastosMensuales,
        })
      : [];

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

  const nivelCapacidad =
    capacidad.porcentajeEndeudamiento < 40
      ? "COMODA"
      : capacidad.porcentajeEndeudamiento < 51
        ? "AJUSTADA"
        : "AL_LIMITE";

  return {
    monto: montoNormalizado,
    plazoMeses,
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

    cargoAdministrativoConfigurado,
    motivoCalculoNoDisponible:
      cargoAdministrativoConfigurado
        ? null
        : "CARGO_ADMINISTRATIVO_NO_CONFIGURADO",

    capacidad,
    nivelCapacidad,
    viable:
      cargoAdministrativoConfigurado &&
      cuotaMensual > 0 &&
      ingresoNeto > 0 &&
      capacidad.porcentajeEndeudamiento < 51,
  };
}

export function compararPlazos({
  monto,
  ingresoNeto,
  totalDeudas,
}: {
  monto: number;
  ingresoNeto: number;
  totalDeudas: number;
}): ComparacionPlazo[] {
  const plazos = obtenerPlazosPorMonto(monto);

  const resultados = plazos.map((plazoMeses) => {
    const resultado = simular({
      monto,
      plazoMeses,
      ingresoNeto,
      totalDeudas,
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
}: {
  monto: number;
  plazoMeses: number;
  ingresoNeto: number;
  totalDeudas: number;
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
