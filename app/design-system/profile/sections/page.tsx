import { Edit3 } from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import ComponentExample from "@/components/design-system/ComponentExample";

const code = `<section className="
  rounded-2xl border
  border-border bg-white
">
  <header className="
    flex items-center justify-between
    border-b border-border
    px-6 py-5
  ">
    <div>
      <h2 className="font-bold">
        Información personal
      </h2>

      <p className="
        mt-1 text-sm text-muted
      ">
        Datos principales de tu cuenta.
      </p>
    </div>

    <button
      type="button"
      className="
        text-sm font-semibold
        text-primary-dark
      "
    >
      Editar
    </button>
  </header>
</section>`;

export default function ProfileSectionsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Profile"
        title="Profile Sections"
        description="El perfil debe priorizar modo lectura y permitir editar únicamente la sección correspondiente."
      />

      <ComponentExample
        title="Sección"
        code={code}
      >
        <section className="max-w-2xl rounded-2xl border border-border bg-white">
          <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div>
              <h2 className="font-bold">
                Información personal
              </h2>

              <p className="mt-1 text-sm text-muted">
                Datos principales de tu cuenta.
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary-dark hover:bg-surface-blue">
              <Edit3 size={16} />
              Editar
            </button>
          </header>

          <div className="grid md:grid-cols-2">
            {[
              ["Nombre completo", "Usuario Kivo"],
              ["Documento", "0000000 LP"],
              ["Celular", "76543210"],
              ["Correo", "usuario@ejemplo.com"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-b border-border px-6 py-5"
              >
                <div className="text-xs font-semibold text-muted">
                  {label}
                </div>

                <div className="mt-1 font-semibold">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>
      </ComponentExample>

      <DocsSection title="Regla">
        <div className="rounded-2xl border border-primary/20 bg-surface-blue p-6">
          <strong>Read first, edit second.</strong>

          <p className="mt-2 leading-7 text-body">
            No convertir todo el perfil en formulario por defecto.
            Mostrar información primero y activar edición de manera explícita.
          </p>
        </div>
      </DocsSection>
    </>
  );
}
