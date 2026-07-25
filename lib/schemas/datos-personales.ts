import { z } from "zod";

/**
 * Ciudades del selector: las capitales de departamento + El Alto,
 * y una opción final para poblaciones menores. La cobertura replica
 * la regla del chatbot de Kivo: por ahora solo La Paz y El Alto.
 */
export const CIUDADES = [
  { value: "LA_PAZ", label: "La Paz", cubierta: true },
  { value: "EL_ALTO", label: "El Alto", cubierta: true },
  { value: "SANTA_CRUZ", label: "Santa Cruz de la Sierra", cubierta: false },
  { value: "COCHABAMBA", label: "Cochabamba", cubierta: false },
  { value: "SUCRE", label: "Sucre", cubierta: false },
  { value: "ORURO", label: "Oruro", cubierta: false },
  { value: "POTOSI", label: "Potosí", cubierta: false },
  { value: "TARIJA", label: "Tarija", cubierta: false },
  { value: "TRINIDAD", label: "Trinidad", cubierta: false },
  { value: "COBIJA", label: "Cobija", cubierta: false },
  { value: "OTRA", label: "Otra localidad", cubierta: false },
] as const;

export type CiudadValue = (typeof CIUDADES)[number]["value"];

export function ciudadTieneCobertura(value: string): boolean {
  return CIUDADES.some((c) => c.value === value && c.cubierta);
}

export function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);

  if (Number.isNaN(nacimiento.getTime())) return 0;

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const cumpleNoOcurrio =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() < nacimiento.getDate());

  if (cumpleNoOcurrio) edad -= 1;

  return edad;
}

// TODO: confirmar con Kivo el rango de edad exacto por producto.
export const EDAD_MINIMA = 18;
export const EDAD_MAXIMA = 75;

/** Nombre completo: al menos dos palabras (nombre y apellido). */
export const NOMBRE_COMPLETO_REGEX = /^\s*\S+(\s+\S+)+\s*$/;

export const datosPersonalesSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(5, "Ingresa tu nombre completo.")
    .regex(
      NOMBRE_COMPLETO_REGEX,
      "Ingresa al menos un nombre y un apellido.",
    ),

  ci: z
    .string()
    .trim()
    .regex(/^\d{5,10}$/, "Ingresa tu carnet de identidad (solo números)."),

  fechaNacimiento: z
    .string()
    .min(1, "Ingresa tu fecha de nacimiento.")
    .refine((valor) => {
      const edad = calcularEdad(valor);
      return edad >= EDAD_MINIMA && edad <= EDAD_MAXIMA;
    }, `Debes tener entre ${EDAD_MINIMA} y ${EDAD_MAXIMA} años.`),

  celular: z
    .string()
    .trim()
    .regex(/^[67]\d{7}$/, "Ingresa un celular válido de 8 dígitos."),

  ciudad: z.string().min(1, "Selecciona tu ciudad."),
});

export type DatosPersonalesValues = z.infer<typeof datosPersonalesSchema>;
