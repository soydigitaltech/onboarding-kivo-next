import { z } from "zod";

/**
 * Reglas de esta sección (extraídas del flujo del chatbot de Kivo):
 * - Ingreso neto mensual obligatorio y mayor a cero.
 * - Hasta 3 deudas activas en entidades financieras; más de 3 = descarte.
 * - Reporte negativo en la Central de Riesgos = descarte.
 */

export const NUMERO_DEUDAS_OPCIONES = [
  { value: "0", label: "Ninguna" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "MAS_3", label: "Más de 3" },
] as const;

export type NumeroDeudasValue =
  (typeof NUMERO_DEUDAS_OPCIONES)[number]["value"];

export const CUOTA_KEYS = ["cuota1", "cuota2", "cuota3"] as const;
export type CuotaKey = (typeof CUOTA_KEYS)[number];

// TODO: confirmar con Kivo el tope de antigüedad razonable.
export const ANTIGUEDAD_MAXIMA_MESES = 720;

export const datosFinancierosSchema = z
  .object({
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

    numeroDeudas: z.enum(
      NUMERO_DEUDAS_OPCIONES.map((o) => o.value) as [
        NumeroDeudasValue,
        ...NumeroDeudasValue[],
      ],
      { message: "Indica cuántas deudas activas tienes." },
    ),

    cuota1: z.number().optional(),
    cuota2: z.number().optional(),
    cuota3: z.number().optional(),

    centralRiesgos: z.enum(["SI", "NO"], {
      message: "Responde esta pregunta para continuar.",
    }),
  })
  .superRefine((data, ctx) => {
    const cantidad = cantidadDeudas(data.numeroDeudas);

    CUOTA_KEYS.forEach((key, index) => {
      const valor = data[key];

      if (index < cantidad && (valor === undefined || valor <= 0)) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: `Ingresa la cuota mensual de la deuda ${index + 1}.`,
        });
      }
    });
  });

export type DatosFinancierosValues = z.infer<typeof datosFinancierosSchema>;

/** Convierte la opción del selector en cantidad numérica de deudas. */
export function cantidadDeudas(opcion: NumeroDeudasValue | undefined): number {
  if (!opcion || opcion === "MAS_3") return 0;
  return Number(opcion);
}

export function formatBs(valor: number): string {
  return `Bs ${new Intl.NumberFormat("es-BO", {
    maximumFractionDigits: 0,
  }).format(valor)}`;
}
