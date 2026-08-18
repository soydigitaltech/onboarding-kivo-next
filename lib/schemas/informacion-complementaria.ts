import { z } from "zod";

export const HOUSING_TYPES = [
  { value: "PROPIA", label: "Propia" },
  { value: "FAMILIAR", label: "Familiar" },
  { value: "ALQUILER", label: "Alquiler" },
  { value: "ANTICRETICO", label: "Anticrético" },
] as const;

export const MARITAL_STATUSES = [
  { value: "SOLTERO", label: "Soltero(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUDO", label: "Viudo(a)" },
  { value: "CONYUGE", label: "Unión libre / Cónyuge" },
] as const;

export const informacionComplementariaSchema = z.object({
  nombreEmpresaNegocio: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre de la empresa o negocio."),

  rubro: z
    .string()
    .trim()
    .min(2, "Ingresa el rubro de la empresa o negocio."),

  cargoActividad: z
    .string()
    .trim()
    .min(2, "Ingresa tu cargo o actividad."),

  direccionLaboral: z
    .string()
    .trim()
    .min(5, "Ingresa la dirección de tu lugar de trabajo o negocio."),

  vivienda: z.enum(
    ["PROPIA", "FAMILIAR", "ALQUILER", "ANTICRETICO"],
    {
      message: "Selecciona tu tipo de vivienda.",
    },
  ),

  estadoCivil: z.enum(
    ["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO", "CONYUGE"],
    {
      message: "Selecciona tu estado civil.",
    },
  ),

  destinoPrestamo: z.enum(
    ["CAPITAL_TRABAJO", "USO_PERSONAL"],
    {
      message: "Selecciona para qué necesitas el préstamo.",
    },
  ),

  detalleDestinoPrestamo: z
    .string()
    .trim()
    .min(
      10,
      "Cuéntanos brevemente para qué utilizarás el préstamo.",
    )
    .max(
      300,
      "El detalle no puede superar los 300 caracteres.",
    ),

  tieneGarante: z.enum(["SI", "NO"]).optional(),

  nombreConyuge: z.string().trim().optional(),

  celularConyuge: z.string().trim().optional(),
}).superRefine((values, ctx) => {
  const requiereGarante =
    values.vivienda === "ALQUILER" ||
    values.vivienda === "ANTICRETICO";

  if (requiereGarante && !values.tieneGarante) {
    ctx.addIssue({
      code: "custom",
      path: ["tieneGarante"],
      message: "Indica si cuentas con garante.",
    });
  }

  const requiereConyuge =
    values.estadoCivil === "CASADO" ||
    values.estadoCivil === "CONYUGE";

  if (
    requiereConyuge &&
    (!values.nombreConyuge ||
      values.nombreConyuge.trim().length < 2)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["nombreConyuge"],
      message: "Ingresa el nombre completo de tu cónyuge.",
    });
  }

  if (
    requiereConyuge &&
    !/^[67]\d{7}$/.test(values.celularConyuge ?? "")
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["celularConyuge"],
      message: "Ingresa un número de celular válido.",
    });
  }
});

export type InformacionComplementariaValues = z.infer<
  typeof informacionComplementariaSchema
>;
