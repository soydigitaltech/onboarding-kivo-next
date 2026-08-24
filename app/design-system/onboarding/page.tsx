import {
  Check,
  ChevronRight,
  FileText,
  UserRound,
  WalletCards,
} from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const steps = [
  "Tus datos",
  "Tus finanzas",
  "Elige tu préstamo",
  "Más sobre ti",
  "Tus documentos",
  "Resumen",
];

export default function OnboardingDesignSystemPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Kivo"
        title="Onboarding"
        description="Patrones específicos para el flujo de registro y solicitud de préstamo del cliente."
      />

      <DocsSection title="Flujo principal">
        <div className="overflow-hidden rounded-2xl border border-border">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  index < 2
                    ? "bg-primary-dark text-white"
                    : index === 2
                      ? "bg-primary text-white"
                      : "bg-surface text-muted"
                }`}
              >
                {index < 2 ? <Check size={16} /> : index + 1}
              </div>

              <div className="flex-1 font-semibold text-ink">
                {step}
              </div>

              <ChevronRight size={18} className="text-placeholder" />
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Anatomía de cada paso">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              UserRound,
              "Header",
              "Título y explicación clara de lo que el usuario debe completar.",
            ],
            [
              WalletCards,
              "Contenido",
              "Campos agrupados por contexto y mostrados progresivamente.",
            ],
            [
              FileText,
              "Acciones",
              "Volver y Continuar mantienen posición y jerarquía consistentes.",
            ],
          ].map(([Icon, title, description]) => {
            const IconComponent = Icon as typeof UserRound;

            return (
              <div
                key={title as string}
                className="rounded-2xl border border-border p-6"
              >
                <IconComponent size={22} className="text-primary-dark" />
                <h3 className="mt-4 font-bold text-ink">
                  {title as string}
                </h3>
                <p className="mt-2 text-sm leading-6 text-body">
                  {description as string}
                </p>
              </div>
            );
          })}
        </div>
      </DocsSection>

      <DocsSection title="Reglas de contenido">
        <div className="space-y-3">
          {[
            ["Usar", "préstamo"],
            ["Evitar", "crédito cuando se refiere al producto del cliente"],
            ["Usar", "Completa tus datos"],
            ["Evitar", "Ingrese la información requerida"],
            ["Usar", "Continuar / Guardar cambios / Subir documento"],
            ["Evitar", "OK / Procesar / Ejecutar"],
          ].map(([type, value]) => (
            <div
              key={`${type}-${value}`}
              className="grid gap-2 rounded-xl border border-border px-5 py-4 md:grid-cols-[100px_1fr]"
            >
              <div
                className={`text-sm font-bold ${
                  type === "Usar" ? "text-success" : "text-error"
                }`}
              >
                {type}
              </div>
              <div className="text-sm text-body">{value}</div>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Formularios condicionales">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="font-bold text-ink">
            ¿Tienes una segunda actividad?
          </div>

          <div className="mt-4 flex gap-3">
            <button className="rounded-xl border border-primary bg-surface-blue px-5 py-3 font-semibold text-primary-dark">
              Sí
            </button>

            <button className="rounded-xl border border-border bg-white px-5 py-3 font-semibold text-ink">
              No
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-primary/20 bg-white p-5">
            <div className="text-sm font-semibold text-ink">
              Ingresos de tu segunda actividad
            </div>

            <div className="mt-3 rounded-xl border border-border px-4 py-3 text-muted">
              Bs 0
            </div>
          </div>
        </div>
      </DocsSection>
    </>
  );
}
