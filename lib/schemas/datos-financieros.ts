import { z } from "zod";

export const MAX_DEUDAS = 3;

export const deudaSchema = z.object({
  entidadFinanciera: z
    .string()
    .trim()
    .min(2, "Ingresa la entidad financiera."),

  cuotaMensual: z
    .number({
      message: "Ingresa la cuota mensual de esta deuda.",
    })
    .min(1, "Ingresa una cuota mayor a cero."),
});

/**
 * Deuda especial para:
 * - una cuarta deuda que está en su última cuota;
 * - una deuda que Kivo evaluará comprar.
 */
export const deudaEspecialSchema = z.object({
  entidadFinanciera: z
    .string()
    .trim()
    .min(2, "Ingresa la entidad financiera."),

  cuotaMensual: z
    .number({
      message: "Ingresa la cuota mensual.",
    })
    .min(1, "Ingresa una cuota mayor a cero."),

  capitalPendiente: z
    .number({
      message: "Ingresa el capital pendiente.",
    })
    .min(1, "Ingresa un capital pendiente mayor a cero."),
});

export const datosFinancierosSchema = z
  .object({
    perfilLaboral: z.enum(["ASALARIADO", "INDEPENDIENTE"], {
      message: "Selecciona tu tipo de actividad.",
    }),

    ingresoNeto: z
      .number({
        message: "Ingresa tus ingresos mensuales.",
      })
      .min(1, "Ingresa un monto mayor a cero."),

    deudas: z
      .array(deudaSchema)
      .max(MAX_DEUDAS, `Máximo ${MAX_DEUDAS} deudas.`),

    masDeTresDeudas: z.boolean().optional(),

    excepcionTipo: z
      .enum(["ULTIMA_CUOTA", "COMPRA_DEUDA"])
      .optional(),

    deudaCuatro: deudaEspecialSchema.optional(),

    deudaCompra: deudaEspecialSchema.optional(),

    deudaMoraOVencida: z.enum(["SI", "NO"], {
      message: "Indica si tienes deudas atrasadas.",
    }),

    extractos: z.enum(["SI", "NO"], {
      message: "Indica si cuentas con extractos bancarios.",
    }),
  })
  .superRefine((values, context) => {
    if (
      values.excepcionTipo === "ULTIMA_CUOTA" &&
      !values.deudaCuatro
    ) {
      context.addIssue({
        code: "custom",
        path: ["deudaCuatro"],
        message: "Completa los datos de la cuarta deuda.",
      });
    }

    if (
      values.excepcionTipo === "COMPRA_DEUDA" &&
      !values.deudaCompra
    ) {
      context.addIssue({
        code: "custom",
        path: ["deudaCompra"],
        message:
          "Completa los datos de la deuda que Kivo evaluará comprar.",
      });
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
