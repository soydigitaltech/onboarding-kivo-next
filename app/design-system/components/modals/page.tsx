import { X } from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import ComponentExample from "@/components/design-system/ComponentExample";

const modalCode = `<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  className="
    w-full max-w-md
    rounded-2xl bg-white p-6
  "
>
  <h2
    id="dialog-title"
    className="text-xl font-bold"
  >
    ¿Deseas salir?
  </h2>

  <p className="mt-2 text-sm text-body">
    Tu información guardada se conservará.
  </p>

  <div className="
    mt-6 flex justify-end gap-3
  ">
    <button>
      Cancelar
    </button>

    <button>
      Salir
    </button>
  </div>
</div>`;

export default function ModalsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Modals"
        description="Los modales deben utilizarse para decisiones importantes, formularios breves o información que requiere atención antes de continuar."
      />

      <ComponentExample
        title="Confirmation"
        code={modalCode}
      >
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                ¿Deseas salir?
              </h2>

              <p className="mt-2 text-sm leading-6 text-body">
                Tu información guardada se conservará.
              </p>
            </div>

            <button
              type="button"
              aria-label="Cerrar"
              className="rounded-lg p-2 text-muted hover:bg-surface"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="rounded-xl border border-border px-4 py-2.5 font-semibold">
              Cancelar
            </button>

            <button className="rounded-xl bg-accent px-4 py-2.5 font-semibold text-white">
              Salir
            </button>
          </div>
        </div>
      </ComponentExample>

      <DocsSection title="Variantes">
        <div className="grid gap-4 md:grid-cols-4">
          {["Confirmation", "Information", "Form", "Destructive"].map(
            (item) => (
              <div
                key={item}
                className="rounded-xl border border-border p-4 text-sm font-semibold"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </DocsSection>
    </>
  );
}
