import CodeBlock from "@/components/design-system/CodeBlock";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

import {
  KivoAlert,
} from "@/components/ui/kivo";

const importCode = `import {
  KivoButton,
  KivoInput,
  KivoCard,
  KivoAlert,
} from "@/components/ui/kivo";`;

const formCode = `"use client";

import {
  useForm
} from "react-hook-form";

import {
  zodResolver
} from "@hookform/resolvers/zod";

import {
  z
} from "zod";

import {
  KivoButton,
  KivoInput,
} from "@/components/ui/kivo";

const schema = z.object({
  email: z
    .string()
    .email("Ingresa un correo válido."),
});

type FormValues = z.infer<
  typeof schema
>;

export default function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(
    values: FormValues
  ) {
    console.log(values);
  }

  return (
    <form
      onSubmit={
        handleSubmit(onSubmit)
      }
      className="space-y-5"
    >
      <KivoInput
        label="Correo electrónico"
        type="email"
        error={
          errors.email?.message
        }
        {...register("email")}
      />

      <KivoButton
        type="submit"
        loading={isSubmitting}
      >
        Continuar
      </KivoButton>
    </form>
  );
}`;

export default function ImplementationPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Getting Started"
        title="Implementación"
        description="Reglas técnicas para consumir correctamente los componentes del Kivo Design System."
      />

      <DocsSection title="Importar componentes">
        <CodeBlock code={importCode} />
      </DocsSection>

      <DocsSection
        title="React Hook Form + Zod"
        description="Patrón recomendado para formularios nuevos que requieran validación estructurada."
      >
        <CodeBlock code={formCode} />
      </DocsSection>

      <DocsSection title="Qué debe hacer el frontend">
        <div className="space-y-3">
          {[
            "Buscar primero un componente existente.",
            "Importarlo desde @/components/ui/kivo.",
            "Utilizar sus props para variantes y estados.",
            "Evitar copiar internamente el CSS/Tailwind del componente.",
            "No crear nuevos colores fuera de los tokens existentes.",
            "Utilizar Lucide para iconografía funcional.",
            "Agregar validación y mensajes de error claros.",
            "Verificar mobile y desktop.",
            "Ejecutar npm run build antes de entregar.",
            "Documentar un componente nuevo si introduce un patrón reutilizable.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-border px-5 py-4 text-sm leading-6 text-body"
            >
              {item}
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="No hacer">
        <KivoAlert
          variant="warning"
          title="Evitar duplicación"
        >
          No copiar un componente existente y cambiarle nombre para resolver una diferencia menor de estilo. Primero extender sus variantes.
        </KivoAlert>
      </DocsSection>
    </>
  );
}
