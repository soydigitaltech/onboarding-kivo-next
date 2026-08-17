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

export const datosFinancierosSchema = z.object({
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

  deudaMoraOVencida: z.enum(["SI", "NO"], {
    message: "Indica si tienes deudas atrasadas.",
  }),

  extractos: z.enum(["SI", "NO"], {
    message: "Indica si cuentas con extractos bancarios.",
  }),
});

export type DatosFinancierosValues = z.infer<
  typeof datosFinancierosSchema
>;

export function formatBs(valor: number): string {
  return `Bs ${new Intl.NumberFormat("es-BO", {
    maximumFractionDigits: 0,
  }).format(valor)}`;
}
