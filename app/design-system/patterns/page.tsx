import {
  AlertCircle,
  CheckCircle2,
  FileX2,
  LoaderCircle,
} from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

export default function PatternsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="UI"
        title="Patrones"
        description="Comportamientos recurrentes que deben resolverse de forma consistente en onboarding y perfil."
      />

      <DocsSection title="Feedback">
        <div className="space-y-4">
          <div className="flex gap-3 rounded-2xl border border-success/30 bg-success/5 p-5">
            <CheckCircle2 className="shrink-0 text-success" size={20} />
            <div>
              <div className="font-bold text-ink">
                Datos actualizados
              </div>
              <div className="mt-1 text-sm text-body">
                Tus cambios se guardaron correctamente.
              </div>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border border-error/30 bg-error/5 p-5">
            <AlertCircle className="shrink-0 text-error" size={20} />
            <div>
              <div className="font-bold text-ink">
                No pudimos guardar tus datos
              </div>
              <div className="mt-1 text-sm text-body">
                Revisa tu conexión e inténtalo nuevamente.
              </div>
            </div>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Loading">
        <div className="flex items-center gap-3 rounded-2xl border border-border p-5">
          <LoaderCircle
            size={20}
            className="animate-spin text-primary"
          />
          <span className="text-sm font-semibold text-body">
            Guardando información...
          </span>
        </div>
      </DocsSection>

      <DocsSection title="Empty State">
        <div className="rounded-2xl border border-border py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-blue text-primary-dark">
            <FileX2 size={22} />
          </div>

          <h3 className="mt-4 font-bold text-ink">
            Aún no tienes documentos
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-body">
            Cuando subas tus documentos podrás consultarlos desde aquí.
          </p>

          <button className="mt-5 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-dark">
            Subir documento
          </button>
        </div>
      </DocsSection>

      <DocsSection title="Reglas">
        <div className="space-y-3">
          {[
            "Los errores deben explicar qué ocurrió y qué puede hacer el usuario.",
            "Los errores de campo deben mostrarse junto al campo, no únicamente mediante Toast.",
            "Utilizar Skeleton cuando conocemos la estructura que se está cargando.",
            "Utilizar Spinner para acciones breves y puntuales.",
            "Los Empty States deben orientar al usuario hacia el siguiente paso cuando exista una acción útil.",
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
