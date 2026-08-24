import {
  CheckCircle2,
  FileText,
  Upload,
} from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import ComponentExample from "@/components/design-system/ComponentExample";

const uploaderCode = `<label className="
  flex cursor-pointer flex-col
  items-center justify-center
  rounded-2xl border
  border-dashed border-border
  bg-white p-8
  text-center
  transition-colors
  hover:border-primary
  hover:bg-surface-blue
">
  <Upload
    size={24}
    className="text-primary-dark"
  />

  <strong className="mt-3">
    Subir documento
  </strong>

  <span className="
    mt-1 text-sm text-muted
  ">
    PDF, JPG o PNG
  </span>

  <input
    type="file"
    className="sr-only"
  />
</label>`;

export default function DocumentsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Onboarding"
        title="Documentos"
        description="Patrones para carga, reemplazo, visualización y estado de documentos requeridos durante el onboarding."
      />

      <ComponentExample
        title="Uploader"
        code={uploaderCode}
      >
        <label className="flex max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center transition hover:border-primary hover:bg-surface-blue">
          <Upload size={24} className="text-primary-dark" />

          <strong className="mt-3">
            Subir documento
          </strong>

          <span className="mt-1 text-sm text-muted">
            PDF, JPG o PNG
          </span>

          <input type="file" className="sr-only" />
        </label>
      </ComponentExample>

      <ComponentExample
        title="Documento cargado"
        code={`<article className="
  flex items-center gap-4
  rounded-2xl border
  border-border bg-white p-5
">
  <FileText />

  <div className="flex-1">
    <strong>
      Carnet de identidad
    </strong>

    <div className="text-sm text-success">
      Documento cargado
    </div>
  </div>
</article>`}
      >
        <article className="flex max-w-xl items-center gap-4 rounded-2xl border border-border bg-white p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-blue text-primary-dark">
            <FileText size={20} />
          </div>

          <div className="flex-1">
            <strong>Carnet de identidad</strong>

            <div className="mt-1 flex items-center gap-1.5 text-sm text-success">
              <CheckCircle2 size={15} />
              Documento cargado
            </div>
          </div>

          <button className="text-sm font-semibold text-primary-dark">
            Reemplazar
          </button>
        </article>
      </ComponentExample>

      <DocsSection title="Estados">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            "Required",
            "Pending",
            "Uploading",
            "Uploaded",
            "Processing",
            "Approved",
            "Observed",
            "Rejected",
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
