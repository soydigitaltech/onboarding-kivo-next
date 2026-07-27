import { z } from "zod";

/**
 * Sección "Información complementaria" (paso 4 del flujo Kivo).
 *
 * Ingreso mensual y antigüedad laboral ya se capturaron en
 * "Datos financieros" — aquí solo se agrega lo que falta del
 * perfil laboral, vivienda, estado civil y garante.
 */

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

export const CONTRACT_TYPES = [
  { value: "INDEFINIDO", label: "Indefinido" },
  { value: "PLAZO_FIJO", label: "Plazo fijo" },
  { value: "CONSULTORIA", label: "Consultoría" },
  { value: "OTRO", label: "Otro" },
] as const;

/** Estados civiles que habilitan los campos del cónyuge. */
export const ESTADOS_CON_CONYUGE = ["CASADO", "CONYUGE"] as const;

/** Tipos de vivienda que habilitan la pregunta de garante. */
export const VIVIENDAS_CON_GARANTE = ["ALQUILER", "ANTICRETICO"] as const;

export const informacionComplementariaSchema = z.object({
  perfilLaboral: z.enum(["ASALARIADO", "INDEPENDIENTE"], {
    message: "Selecciona tu situación laboral.",
  }),

  // -- Asalariado --
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  tipoContrato: z
    .enum(["INDEFINIDO", "PLAZO_FIJO", "CONSULTORIA", "OTRO"])
    .optional(),
  aportaAFP: z.enum(["SI", "NO"]).optional(),
  tieneBoletas: z.enum(["SI", "NO"]).optional(),

  // -- Independiente --
  actividadEconomica: z.string().optional(),
  nombreNegocio: z.string().optional(),
  tieneNit: z.enum(["SI", "NO"]).optional(),
  tienePatente: z.enum(["SI", "NO"]).optional(),

  // -- Vivienda y datos personales --
  vivienda: z.enum(["PROPIA", "FAMILIAR", "ALQUILER", "ANTICRETICO"], {
    message: "Selecciona tu tipo de vivienda.",
  }),

  estadoCivil: z.enum(
    ["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO", "CONYUGE"],
    { message: "Selecciona tu estado civil." },
  ),

  conyugeNombre: z.string().optional(),
  conyugeCelular: z.string().optional(),

  tieneGarante: z.enum(["SI", "NO"]).optional(),

  direccion: z
    .string()
    .trim()
    .min(5, "Ingresa tu dirección actual."),

  destinoPrestamo: z
    .string()
    .trim()
    .min(5, "Cuéntanos para qué usarás el préstamo."),

  /** Ubicación marcada en el mapa (referencial, no bloquea el flujo). */
  ubicacionLat: z.number().optional(),
  ubicacionLng: z.number().optional(),

  // -- Declaración de extractos --
  extractos: z.enum(["SI", "NO"], {
    message: "Indica si dispones de extractos bancarios.",
  }),
});

export type InformacionComplementariaValues = z.infer<
  typeof informacionComplementariaSchema
>;