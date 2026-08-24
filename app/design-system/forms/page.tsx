import CodeBlock from "@/components/design-system/CodeBlock";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const schemaCode = `import {
  z,
} from "zod";

export const personalDataSchema =
  z.object({
    firstName: z
      .string()
      .min(
        2,
        "Ingresa tu nombre."
      ),

    lastName: z
      .string()
      .min(
        2,
        "Ingresa tu apellido."
      ),

    email: z
      .string()
      .email(
        "Ingresa un correo válido."
      ),

    phone: z
      .string()
      .regex(
        /^[67]\\d{7}$/,
        "Ingresa un número válido."
      ),

    city: z.enum([
      "LA_PAZ",
      "EL_ALTO",
    ]),
  });`;

const formCode = `"use client";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  KivoButton,
  KivoInput,
  KivoPhoneInput,
  KivoSelect,
} from "@/components/ui/kivo";

export function PersonalDataForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver:
      zodResolver(
        personalDataSchema
      ),
  });

  const city =
    watch("city");

  return (
    <form
      onSubmit={
        handleSubmit(
          async (values) => {
            console.log(values);
          }
        )
      }
      className="space-y-5"
    >
      <KivoInput
        label="Nombre"
        error={
          errors.firstName?.message
        }
        {...register("firstName")}
      />

      <KivoPhoneInput
        label="Celular"
        error={
          errors.phone?.message
        }
        {...register("phone")}
      />

      <KivoSelect
        label="Ciudad"
        value={city}
        onValueChange={(value) =>
          setValue(
            "city",
            value,
            {
              shouldValidate: true,
            }
          )
        }
        options={[
          {
            value: "LA_PAZ",
            label: "La Paz",
          },
          {
            value: "EL_ALTO",
            label: "El Alto",
          },
        ]}
      />

      <KivoButton
        type="submit"
        loading={isSubmitting}
        fullWidth
      >
        Continuar
      </KivoButton>
    </form>
  );
}`;

export default function FormsGuidelinePage() {
  return (
    <>
      <DocsHeader
        eyebrow="Patterns"
        title="Formularios"
        description="Patrón recomendado para nuevos formularios del onboarding utilizando React Hook Form, Zod y los componentes oficiales de Kivo."
      />

      <DocsSection title="Schema">
        <CodeBlock
          code={schemaCode}
        />
      </DocsSection>

      <DocsSection title="Formulario">
        <CodeBlock
          code={formCode}
        />
      </DocsSection>

      <DocsSection title="Reglas">
        <div className="space-y-3">
          {[
            "Mostrar el error junto al campo relacionado.",
            "No validar únicamente al final de todo el onboarding.",
            "Mantener mensajes de error humanos y accionables.",
            "No borrar información previamente ingresada cuando una validación falla.",
            "Los campos condicionales deben desmontarse o ignorarse correctamente cuando dejan de aplicar.",
            "No enviar un formulario dos veces mientras isSubmitting sea true.",
            "Los valores monetarios deben mantenerse como números en la lógica y formatearse únicamente en interfaz.",
            "Utilizar préstamo como término visible del producto.",
          ].map((rule) => (
            <div
              key={rule}
              className="rounded-xl border border-border px-5 py-4 text-sm leading-6 text-body"
            >
              {rule}
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
