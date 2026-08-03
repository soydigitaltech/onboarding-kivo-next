import { z } from "zod";

/**
 * Información adicional de la solicitud.
 *
 * La situación laboral, el rubro y la dirección del lugar de trabajo
 * ya se registran en el paso "Datos personales".
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

/** Estados civiles que habilitan los datos del cónyuge. */
export const ESTADOS_CON_CONYUGE = ["CASADO", "CONYUGE"] as const;

/** Viviendas que habilitan la pregunta sobre garante. */
export const VIVIENDAS_CON_GARANTE = ["ALQUILER", "ANTICRETICO"] as const;

export const informacionComplementariaSchema = z.object({
  vivienda: z.enum(["PROPIA", "FAMILIAR", "ALQUILER", "ANTICRETICO"], {
    message: "Selecciona tu tipo de vivienda.",
  }),

  estadoCivil: z.enum(
    ["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO", "CONYUGE"],
    {
      message: "Selecciona tu estado civil.",
    },
  ),

  conyugeNombre: z.string().optional(),

  conyugeCelular: z.string().optional(),

  tieneGarante: z.enum(["SI", "NO"]).optional(),

  /**
   * Dirección actual de residencia.
   * La dirección laboral ya está en DatosPersonales.direccionTrabajo.
   */
  direccion: z
    .string()
    .trim()
    .min(5, "Ingresa tu dirección actual."),

  destinoPrestamo: z
    .string()
    .trim()
    .min(5, "Cuéntanos para qué usarás el préstamo."),

  /** Ubicación aproximada de la residencia. */
  ubicacionLat: z.number().optional(),
  ubicacionLng: z.number().optional(),

  extractos: z.enum(["SI", "NO"], {
    message: "Indica si dispones de extractos bancarios.",
  }),
});

export type InformacionComplementariaValues = z.infer<
  typeof informacionComplementariaSchema
>;
