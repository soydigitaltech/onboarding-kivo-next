/**
 * Valores temporales del onboarding.
 *
 * Estos parámetros deberán venir del BackOffice cuando
 * exista la configuración remota correspondiente.
 */
export const KIVO_ONBOARDING_DEFAULTS = {
  maxDeudas: 3,

  /**
   * Fallback temporal.
   *
   * La tasa real debe ser configurable desde BackOffice.
   * Se conserva temporalmente el 3% que utilizaba
   * el simulador antes de implementar la configuración remota.
   */
  tasaMensualPorcentaje: 3,

  /**
   * Cargos administrativos definidos por Kivo v5.
   *
   * Ojo:
   * la documentación actual solo define cargos
   * hasta Bs 150.000.
   */
  cargosAdministrativos: [
    {
      desde: 7000,
      hasta: 15000,
      cargo: 60,
    },
    {
      desde: 15001,
      hasta: 30000,
      cargo: 60,
    },
    {
      desde: 30001,
      hasta: 70000,
      cargo: 52.5,
    },
    {
      desde: 70001,
      hasta: 100000,
      cargo: 52.5,
    },
    {
      desde: 100001,
      hasta: 150000,
      cargo: 52.5,
    },
  ],
} as const;
