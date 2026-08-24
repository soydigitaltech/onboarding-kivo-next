import { Check } from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import ComponentExample from "@/components/design-system/ComponentExample";

const code = `const steps = [
  "Tus datos",
  "Tus finanzas",
  "Elige tu préstamo",
  "Más sobre ti",
  "Tus documentos",
  "Resumen",
];

{steps.map((step, index) => (
  <div key={step}>
    <div>
      {index < currentStep
        ? <Check size={16} />
        : index + 1}
    </div>

    <span>{step}</span>
  </div>
))}`;

const steps = [
  "Tus datos",
  "Tus finanzas",
  "Elige tu préstamo",
  "Más sobre ti",
  "Tus documentos",
  "Resumen",
];

export default function StepperPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Onboarding"
        title="Stepper"
        description="Representa el avance del usuario durante el onboarding. Debe mantenerse consistente durante todo el flujo."
      />

      <ComponentExample
        title="Estados"
        description="Completado, actual y pendiente."
        code={code}
      >
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                  index < 2
                    ? "bg-primary-dark text-white"
                    : index === 2
                      ? "bg-primary text-white"
                      : "bg-white text-muted"
                }`}
              >
                {index < 2 ? <Check size={16} /> : index + 1}
              </div>

              <span
                className={
                  index === 2
                    ? "font-bold text-ink"
                    : "text-sm text-body"
                }
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </ComponentExample>

      <DocsSection title="Estados">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            "Pending",
            "Current",
            "Completed",
            "Error",
          ].map((state) => (
            <div
              key={state}
              className="rounded-xl border border-border p-4 text-sm font-semibold"
            >
              {state}
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
