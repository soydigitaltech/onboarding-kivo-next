import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import ComponentExample from "@/components/design-system/ComponentExample";

const alertCode = `import { TriangleAlert } from "lucide-react";

<div className="
  flex gap-3
  rounded-2xl
  border border-warning-border
  bg-warning-bg p-5
">
  <TriangleAlert
    size={20}
    className="shrink-0 text-warning"
  />

  <div>
    <div className="font-bold text-ink">
      Documento pendiente
    </div>

    <p className="mt-1 text-sm text-body">
      Sube tu extracto bancario para continuar.
    </p>
  </div>
</div>`;

export default function FeedbackPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Feedback"
        description="Alerts, estados y mensajes utilizados para comunicar información, éxito, advertencias y errores."
      />

      <ComponentExample
        title="Warning Alert"
        code={alertCode}
      >
        <div className="flex max-w-xl gap-3 rounded-2xl border border-warning-border bg-warning-bg p-5">
          <TriangleAlert
            size={20}
            className="shrink-0 text-warning"
          />

          <div>
            <div className="font-bold">
              Documento pendiente
            </div>

            <p className="mt-1 text-sm text-body">
              Sube tu extracto bancario para continuar.
            </p>
          </div>
        </div>
      </ComponentExample>

      <DocsSection title="Variantes">
        <div className="space-y-3">
          <div className="flex gap-3 rounded-2xl border border-primary/30 bg-surface-blue p-5">
            <Info size={20} className="text-primary-dark" />
            <div>
              <strong>Información</strong>
              <p className="mt-1 text-sm text-body">
                Información relevante para completar el proceso.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border border-success/30 bg-success/5 p-5">
            <CheckCircle2 size={20} className="text-success" />
            <div>
              <strong>Guardado correctamente</strong>
              <p className="mt-1 text-sm text-body">
                Tus cambios fueron guardados.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border border-warning-border bg-warning-bg p-5">
            <TriangleAlert size={20} className="text-warning" />
            <div>
              <strong>Revisa esta información</strong>
              <p className="mt-1 text-sm text-body">
                Hay información pendiente.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border border-error/30 bg-error/5 p-5">
            <AlertCircle size={20} className="text-error" />
            <div>
              <strong>No pudimos guardar</strong>
              <p className="mt-1 text-sm text-body">
                Inténtalo nuevamente.
              </p>
            </div>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Badges">
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
            Aprobado
          </span>

          <span className="rounded-full bg-warning-bg px-3 py-1.5 text-xs font-bold text-warning">
            En revisión
          </span>

          <span className="rounded-full bg-error/10 px-3 py-1.5 text-xs font-bold text-error">
            Observado
          </span>

          <span className="rounded-full bg-surface-blue px-3 py-1.5 text-xs font-bold text-primary-dark">
            Procesando
          </span>
        </div>
      </DocsSection>
    </>
  );
}
