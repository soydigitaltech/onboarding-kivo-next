import { z } from "zod";

/**
 * Reglas de esta sección (extraídas del flujo del chatbot de Kivo):
 * - Ingreso neto mensual obligatorio y mayor a cero.
 * - Deudas: el usuario las agrega una por una (máximo 3).
 *   Declarar más de 3 = descarte.
 * - Reporte negativo en la Central de Riesgos = descarte.
 */

export const MAX_DEUDAS = 3;

// TODO: confirmar con Kivo el tope de antigüedad razonable.
export const ANTIGUEDAD_MAXIMA_MESES = 720;

export const deudaSchema = z.object({
  cuota: z
    .number({ message: "Ingresa la cuota mensual de esta deuda." })
    .min(1, "Ingresa una cuota mayor a cero."),
});

export const datosFinancierosSchema = z.object({
  ingresoNeto: z
    .number({ message: "Ingresa tu ingreso neto mensual." })
    .min(1, "Ingresa un ingreso mayor a cero."),

  antiguedadMeses: z
    .number({ message: "Ingresa tu antigüedad laboral en meses." })
    .int("Ingresa meses completos, sin decimales.")
    .min(0, "La antigüedad no puede ser negativa.")
    .max(
      ANTIGUEDAD_MAXIMA_MESES,
      "Revisa la antigüedad: parece demasiado alta.",
    ),

  deudas: z
    .array(deudaSchema)
    .max(MAX_DEUDAS, `Máximo ${MAX_DEUDAS} deudas.`),

  /** El usuario declaró tener más de 3 deudas. */
  masDeTresDeudas: z.boolean(),

  /**
   * Excepciones que permiten continuar con más de 3 deudas:
   * - ULTIMA_CUOTA: una de sus deudas está en su última cuota.
   * - COMPRA_DEUDA: pide que Kivo compre una de sus deudas.
   */
  excepcionTipo: z.enum(["ULTIMA_CUOTA", "COMPRA_DEUDA"]).optional(),

  /** Índice (0-2) de la deuda registrada que quiere que Kivo compre. */
  compraIndice: z.number().optional(),

  /** Cuota mensual de la deuda que quiere que Kivo compre. */
  cuotaCompra: z.number().optional(),

  centralRiesgos: z.enum(["SI", "NO"], {
    message: "Responde esta pregunta para continuar.",
  }),
});

export type DatosFinancierosValues = z.infer<typeof datosFinancierosSchema>;

export function formatBs(valor: number): string {
  return `Bs ${new Intl.NumberFormat("es-BO", {
    maximumFractionDigits: 0,
  }).format(valor)}`;
}