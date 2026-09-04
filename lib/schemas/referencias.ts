import { z } from "zod";

const celularSchema = z
  .string()
  .trim()
  .regex(/^[67]\d{7}$/, "Ingresa un número de celular válido.");

export const referenciaSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(3, "Ingresa el nombre completo."),

  relacion: z
    .string()
    .trim()
    .min(2, "Indica tu relación con esta persona."),

  celular: celularSchema,
});

export const referenciasSchema = z.object({
  personal1: referenciaSchema,
  personal2: referenciaSchema,
  laboralComercial: referenciaSchema,
});

export type ReferenciasValues = z.infer<typeof referenciasSchema>;
