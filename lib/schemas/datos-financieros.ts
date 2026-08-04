import { z } from "zod";

export const MAX_DEUDAS = 3;

/**
 * Deudas normales 1, 2 y 3.
 * Solo registran entidad financiera y cuota mensual.
 */
export const deudaSchema = z.object({
  entidadFinanciera: z
    .string()
    .trim()
    .min(2, "Ingresa la entidad financiera."),

  cuotaMensual: z
    .number({ message: "Ingresa la cuota mensual de esta deuda." })
    .min(1, "Ingresa una cuota mayor a cero."),
});

/**
 * Cuarta deuda especial.
 *
 * Solo aparece cuando el usuario ya registró tres deudas y selecciona:
 * “Una de mis deudas está en su última cuota”.
 *
 * En este caso el capital pendiente es obligatorio.
 */
export const deudaCuatroSchema = z.object({
  entidadFinanciera: z
    .string()
    .trim()
    .min(2, "Ingresa la entidad financiera de la cuarta deuda."),

  cuotaMensual: z
    .number({ message: "Ingresa la cuota mensual de la cuarta deuda." })
    .min(1, "Ingresa una cuota mayor a cero."),

  capitalPendiente: z
    .number({
      message: "Ingresa el capital pendiente de la cuarta deuda.",
    })
    .min(1, "Ingresa un capital pendiente mayor a cero."),
});

export const datosFinancierosSchema = z
  .object({
    ingresoNeto: z
      .number({ message: "Ingresa tu ingreso neto mensual." })
      .min(1, "Ingresa un ingreso mayor a cero."),

    tieneSegundoIngreso: z.boolean(),

    segundoIngresoMonto: z.number().optional(),

    segundoIngresoRespaldado: z.boolean(),

    deudas: z
      .array(deudaSchema)
      .max(MAX_DEUDAS, `Máximo ${MAX_DEUDAS} deudas.`),

    masDeTresDeudas: z.boolean(),

    excepcionTipo: z
      .enum(["ULTIMA_CUOTA", "COMPRA_DEUDA"])
      .optional(),

    /**
     * Cuarta deuda especial.
     * Solo será obligatoria cuando excepcionTipo sea ULTIMA_CUOTA.
     */
    deudaCuatro: deudaCuatroSchema.optional(),

    /**
     * Compra de una de las tres deudas registradas.
     */
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

    if (values.excepcionTipo === "ULTIMA_CUOTA") {
      if (!values.deudaCuatro) {
        context.addIssue({
          code: "custom",
          path: ["deudaCuatro"],
          message: "Completa los datos de la cuarta deuda.",
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
