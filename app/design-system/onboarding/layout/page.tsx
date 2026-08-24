import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import ComponentExample from "@/components/design-system/ComponentExample";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

import {
  KivoButton,
  KivoOnboardingActions,
  KivoPageHeader,
  KivoProgress,
} from "@/components/ui/kivo";

export default function OnboardingLayoutPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Onboarding"
        title="Layout & Navigation"
        description="Estructura estándar para mantener consistencia entre todos los pasos del onboarding."
      />

      <ComponentExample
        title="Header + Progress"
        code={`<KivoPageHeader
  eyebrow="Paso 2 de 6"
  title="Cuéntanos sobre tus finanzas"
  description="
    Esta información nos ayuda
    a conocer mejor tu capacidad
    de pago.
  "
/>

<KivoProgress
  value={2}
  max={6}
  showLabel
/>`}
      >
        <div className="max-w-3xl">
          <KivoPageHeader
            eyebrow="Paso 2 de 6"
            title="Cuéntanos sobre tus finanzas"
            description="Esta información nos ayuda a conocer mejor tu capacidad de pago."
          />

          <div className="mt-6">
            <KivoProgress
              value={2}
              max={6}
              showLabel
            />
          </div>
        </div>
      </ComponentExample>

      <ComponentExample
        title="Actions"
        code={`<KivoOnboardingActions
  back={
    <KivoButton
      variant="ghost"
      iconLeft={
        <ArrowLeft size={18} />
      }
    >
      Volver
    </KivoButton>
  }
  primary={
    <KivoButton
      iconRight={
        <ArrowRight size={18} />
      }
    >
      Continuar
    </KivoButton>
  }
/>`}
      >
        <KivoOnboardingActions
          back={
            <KivoButton
              variant="ghost"
              iconLeft={
                <ArrowLeft size={18} />
              }
            >
              Volver
            </KivoButton>
          }
          primary={
            <KivoButton
              iconRight={
                <ArrowRight size={18} />
              }
            >
              Continuar
            </KivoButton>
          }
        />
      </ComponentExample>

      <DocsSection title="Reglas">
        <div className="space-y-3">
          {[
            "El CTA primario debe mantenerse visualmente consistente durante todo el onboarding.",
            "En mobile las acciones pueden permanecer sticky en la parte inferior.",
            "Volver no debe competir visualmente con Continuar.",
            "El progreso debe ser comprensible sin depender únicamente del color.",
            "No cambiar el orden de los pasos sin actualizar todo el flujo.",
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
