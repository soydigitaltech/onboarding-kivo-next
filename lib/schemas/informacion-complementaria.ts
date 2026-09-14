import { z } from "zod";

export const HOUSING_TYPES = [
  { value: "PROPIA", label: "Propia" },
  { value: "FAMILIAR", label: "Familiar" },
  { value: "ALQUILER", label: "Alquiler" },
  { value: "ANTICRETICO", label: "Anticrético" },
] as const;

export const RUBROS = [
  { value: "Comercio", label: "Comercio" },
  { value: "Servicios", label: "Servicios" },
  { value: "Industria", label: "Industria" },
  { value: "Agropecuaria", label: "Agropecuaria" },
  { value: "Construcción", label: "Construcción" },
  { value: "Transporte", label: "Transporte" },
  { value: "Tecnología", label: "Tecnología" },
  { value: "Finanzas", label: "Finanzas" },
  { value: "Turismo", label: "Turismo" },
  { value: "Salud y Educación", label: "Salud y Educación" },
  { value: "OTRO", label: "Otro" },
] as const;

export const FAMILY_HOUSING_RELATIONSHIPS = [
  { value: "PADRES", label: "Padres" },
  { value: "HIJOS", label: "Hijos" },
  { value: "HERMANOS", label: "Hermanos" },
  { value: "ABUELOS", label: "Abuelos" },
  { value: "OTROS", label: "Otros" },
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

  rubro: z.enum(
    [
      "Comercio",
      "Servicios",
      "Industria",
      "Agropecuaria",
      "Construcción",
      "Transporte",
      "Tecnología",
      "Finanzas",
      "Turismo",
      "Salud y Educación",
      "OTRO",
    ],
    {
      message: "Selecciona el rubro de la empresa o negocio.",
    },
  ),

  cargoActividad: z
    .string()
    .trim()
    .min(2, "Ingresa tu cargo o actividad."),

  antiguedadActividad: z
    .number({
      message: "Ingresa tu antigüedad en meses.",
    })
    .int("La antigüedad debe expresarse en meses completos.")
    .min(12, "Debes tener al menos 12 meses de antigüedad.")
    .max(600, "Revisa la antigüedad ingresada."),

  /** NIT declarado por trabajadores independientes. */
  tieneNit: z.enum(["SI", "NO"]).optional(),

  /** Licencia de funcionamiento o patente declarada por independientes. */
  tieneLicenciaFuncionamiento: z.enum(["SI", "NO"]).optional(),

  direccionLaboral: z
    .string()
    .trim()
    .min(5, "Ingresa la dirección de tu lugar de trabajo o negocio."),

  /** Afiliación a AFP, cuando corresponde. */
  tieneAfp: z.enum(["SI", "NO"]).optional(),

  /** Disponibilidad de boletas de pago, cuando corresponde. */
  tieneBoletasPago: z.enum(["SI", "NO"]).optional(),

  vivienda: z.enum(
    ["PROPIA", "FAMILIAR", "ALQUILER", "ANTICRETICO"],
    {
      message: "Selecciona tu tipo de vivienda.",
    },
  ),

  parentescoViviendaFamiliar: z
    .enum([
      "PADRES",
      "HIJOS",
      "HERMANOS",
      "ABUELOS",
      "OTROS",
    ])
    .optional(),

  detalleParentescoViviendaFamiliar: z
    .string()
    .trim()
    .optional(),

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
      "Cuéntanos para qué utilizarás el préstamo.",
    ),

  tieneGarante: z.enum(["SI", "NO"]).optional(),

}).superRefine((values, ctx) => {
  if (
    values.vivienda === "FAMILIAR" &&
    !values.parentescoViviendaFamiliar
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["parentescoViviendaFamiliar"],
      message: "Indica el parentesco de la vivienda familiar.",
    });
  }

  if (
    values.vivienda === "FAMILIAR" &&
    values.parentescoViviendaFamiliar === "OTROS" &&
    (!values.detalleParentescoViviendaFamiliar ||
      values.detalleParentescoViviendaFamiliar.trim().length < 2)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["detalleParentescoViviendaFamiliar"],
      message: "Detalla el parentesco o relación.",
    });
  }

  const requiereGarante =
    values.vivienda === "ALQUILER" ||
    values.vivienda === "ANTICRETICO";

  if (requiereGarante && !values.tieneGarante) {
    ctx.addIssue({
      code: "custom",
      path: ["tieneGarante"],
      message: "Indica si cuentas con garante con vivienda propia.",
    });
  }

  if (
    requiereGarante &&
    values.tieneGarante === "NO"
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["tieneGarante"],
      message:
        "Para continuar necesitas un garante con vivienda propia.",
    });
  }
});

export type InformacionComplementariaValues = z.infer<
  typeof informacionComplementariaSchema
>;
