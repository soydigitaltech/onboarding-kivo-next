import {
  ArrowRight,
  Download,
  LoaderCircle,
  Trash2,
} from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import ComponentExample from "@/components/design-system/ComponentExample";

const primaryCode = `<button
  type="button"
  className="
    inline-flex items-center justify-center gap-2
    rounded-xl bg-accent px-5 py-3
    text-sm font-semibold text-white
    transition-colors hover:bg-accent-dark
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary
    focus-visible:ring-offset-2
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
>
  Continuar
</button>`;

const secondaryCode = `<button
  type="button"
  className="
    inline-flex items-center justify-center
    rounded-xl border border-border
    bg-white px-5 py-3
    text-sm font-semibold text-ink
    transition-colors
    hover:border-primary
    hover:bg-surface
  "
>
  Volver
</button>`;

const iconCode = `import { ArrowRight } from "lucide-react";

<button
  type="button"
  className="
    inline-flex items-center gap-2
    rounded-xl bg-accent
    px-5 py-3
    font-semibold text-white
  "
>
  Continuar
  <ArrowRight size={18} />
</button>`;

const loadingCode = `import { LoaderCircle } from "lucide-react";

<button
  type="button"
  disabled
  className="
    inline-flex items-center gap-2
    rounded-xl bg-accent
    px-5 py-3
    font-semibold text-white
    disabled:opacity-70
  "
>
  <LoaderCircle
    size={18}
    className="animate-spin"
  />
  Guardando...
</button>`;

export default function ButtonsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Buttons"
        description="Los botones comunican acciones. Mantener una jerarquía clara y evitar múltiples acciones primarias compitiendo dentro de una misma vista."
      />

      <ComponentExample
        title="Primary"
        description="Acción principal de la pantalla."
        code={primaryCode}
      >
        <button className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark">
          Continuar
        </button>
      </ComponentExample>

      <ComponentExample
        title="Secondary"
        description="Acciones alternativas como volver, cancelar o mantener el estado actual."
        code={secondaryCode}
      >
        <button className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:bg-surface">
          Volver
        </button>
      </ComponentExample>

      <ComponentExample
        title="Con icono"
        description="El icono refuerza la acción, pero el texto sigue siendo el elemento principal."
        code={iconCode}
      >
        <button className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white">
          Continuar
          <ArrowRight size={18} />
        </button>
      </ComponentExample>

      <ComponentExample
        title="Loading"
        description="Bloquear la acción mientras se procesa para evitar envíos duplicados."
        code={loadingCode}
      >
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white opacity-70"
        >
          <LoaderCircle size={18} className="animate-spin" />
          Guardando...
        </button>
      </ComponentExample>

      <DocsSection title="Variantes">
        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl bg-accent px-5 py-3 font-semibold text-white">
            Primary
          </button>

          <button className="rounded-xl border border-border bg-white px-5 py-3 font-semibold">
            Secondary
          </button>

          <button className="rounded-xl px-5 py-3 font-semibold text-primary-dark hover:bg-surface-blue">
            Ghost
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl bg-error px-5 py-3 font-semibold text-white">
            <Trash2 size={17} />
            Eliminar
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 font-semibold">
            <Download size={17} />
            Descargar
          </button>
        </div>
      </DocsSection>

      <DocsSection title="Tamaños">
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white">
            Small
          </button>

          <button className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white">
            Medium
          </button>

          <button className="rounded-xl bg-accent px-6 py-4 text-base font-semibold text-white">
            Large
          </button>
        </div>
      </DocsSection>

      <DocsSection title="Reglas">
        <ul className="space-y-3 text-sm leading-6 text-body">
          <li>• Primary: una acción principal por contexto.</li>
          <li>• Secondary: acciones alternativas.</li>
          <li>• Ghost: baja prioridad visual.</li>
          <li>• Danger: únicamente acciones destructivas.</li>
          <li>• Usar verbos claros: Continuar, Guardar, Subir, Editar.</li>
          <li>• Evitar textos ambiguos como OK, Ejecutar o Procesar.</li>
        </ul>
      </DocsSection>
    </>
  );
}
