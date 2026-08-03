import { z } from "zod";

export const MAX_DEUDAS = 3;
export const ANTIGUEDAD_MAXIMA_MESES = 720;

export function obtenerAntiguedadMinima(edad: number): number {
  if (edad >= 18 && edad <= 24) return 36;
  return 12;
}

export function mensajeAntiguedadMinima(edad: number): string {
  const meses = obtenerAntiguedadMinima(edad);

  if (meses === 36) {
    return "Por tu edad, necesitas al menos 36 meses de antigüedad laboral o en tu actividad económica.";
  }

  return "Necesitas al menos 12 meses de antigüedad laboral o en tu actividad económica.";
}

export const deudaSchema = z
  .object({
    entidadFinanciera: z
      .string()
      .trim()
      .min(2, "Ingresa la entidad financiera."),

    cuotaMensual: z
      .number({ message: "Ingresa la cuota mensual de esta deuda." })
      .min(1, "Ingresa una cuota mayor a cero."),

    capitalPendiente: z
      .number()
      .min(1, "Ingresa un capital pendiente mayor a cero.")
      .optional(),

    estaEnUltimaCuota: z.boolean(),

    montoUltimaCuota: z.number().optional(),
  })
  .superRefine((values, context) => {
    if (
      values.estaEnUltimaCuota &&
      (values.montoUltimaCuota === undefined ||
        values.montoUltimaCuota <= 0)
    ) {
      context.addIssue({
        code: "custom",
        path: ["montoUltimaCuota"],
        message: "Ingresa el monto de la última cuota.",
      });
    }
  });

export const datosFinancierosSchema = z
  .object({
    ingresoNeto: z
      .number({ message: "Ingresa tu ingreso neto mensual." })
      .min(1, "Ingresa un ingreso mayor a cero."),

    tieneSegundoIngreso: z.boolean(),

    segundoIngresoMonto: z.number().optional(),

    segundoIngresoRespaldado: z.boolean(),

    antiguedadMeses: z
      .number({ message: "Ingresa tu antigüedad en meses." })
      .int("Ingresa meses completos, sin decimales.")
      .min(12, "La antigüedad mínima permitida es de 12 meses.")
      .max(
        ANTIGUEDAD_MAXIMA_MESES,
        "Revisa la antigüedad: parece demasiado alta.",
      ),

    deudas: z
      .array(deudaSchema)
      .max(MAX_DEUDAS, `Máximo ${MAX_DEUDAS} deudas.`),

    masDeTresDeudas: z.boolean(),

    excepcionTipo: z
      .enum(["ULTIMA_CUOTA", "COMPRA_DEUDA"])
      .optional(),

    compraIndice: z.number().optional(),

    capitalCompra: z.number().optional(),

    deudaMoraOVencida: z.enum(["SI", "NO"], {
      message: "Indica si tienes alguna deuda en mora o vencida.",
    }),
  })
  .superRefine((values, context) => {
    if (values.tieneSegundoIngreso) {
      if (
        values.segundoIngresoMonto === undefined ||
        values.segundoIngresoMonto <= 0
      ) {
        context.addIssue({
          code: "custom",
          path: ["segundoIngresoMonto"],
          message: "Ingresa el monto neto de tu segundo ingreso.",
        });
      }

      if (!values.segundoIngresoRespaldado) {
        context.addIssue({
          code: "custom",
          path: ["segundoIngresoRespaldado"],
          message:
            "El segundo ingreso debe estar respaldado al 100% con extractos bancarios.",
        });
      }
    }

    if (values.excepcionTipo === "COMPRA_DEUDA") {
      if (values.compraIndice === undefined) {
        context.addIssue({
          code: "custom",
          path: ["compraIndice"],
          message: "Selecciona la deuda que Kivo evaluará comprar.",
        });
      }

      if (
        values.capitalCompra === undefined ||
        values.capitalCompra <= 0
      ) {
        context.addIssue({
          code: "custom",
          path: ["capitalCompra"],
          message: "Ingresa el capital pendiente de la deuda.",
        });
      }
    }
  });

export type DatosFinancierosValues = z.infer<
  typeof datosFinancierosSchema
>;

export function formatBs(valor: number): string {
  return `Bs ${new Intl.NumberFormat("es-BO", {
    maximumFractionDigits: 0,
  }).format(valor)}`;
}
