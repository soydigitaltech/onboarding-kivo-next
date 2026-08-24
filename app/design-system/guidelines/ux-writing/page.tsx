import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const examples = [
  [
    "Sí",
    "Completa tus datos",
    "Ingrese la información requerida",
  ],
  [
    "Sí",
    "Tu préstamo fue solicitado correctamente",
    "La operación fue ejecutada exitosamente",
  ],
  [
    "Sí",
    "Subir documento",
    "Procesar archivo",
  ],
  [
    "Sí",
    "Guardar cambios",
    "Aceptar",
  ],
  [
    "Sí",
    "Préstamo",
    "Crédito cuando hablamos del producto Kivo",
  ],
];

export default function UXWritingPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Guidelines"
        title="UX Writing"
        description="Kivo utiliza lenguaje humano, directo y comprensible. El texto también forma parte del Design System."
      />

      <DocsSection title="Principios">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "Claro",
              "Explicar exactamente qué debe hacer el usuario.",
            ],
            [
              "Cercano",
              "Hablar de tú y evitar lenguaje excesivamente institucional.",
            ],
            [
              "Accionable",
              "Los mensajes de error deben indicar qué hacer a continuación.",
            ],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-border p-5"
            >
              <strong>{title}</strong>

              <p className="mt-2 text-sm leading-6 text-body">
                {description}
              </p>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Ejemplos">
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1fr_1fr] border-b border-border bg-surface px-5 py-3 text-xs font-bold uppercase text-muted">
            <div>Preferir</div>
            <div>Evitar</div>
          </div>

          {examples.map(([, good, bad]) => (
            <div
              key={good}
              className="grid grid-cols-[1fr_1fr] gap-5 border-b border-border px-5 py-4 last:border-b-0"
            >
              <div className="text-sm font-medium text-success">
                {good}
              </div>

              <div className="text-sm text-error">
                {bad}
              </div>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Errores">
        <div className="space-y-3">
          <div className="rounded-xl border border-success/30 bg-success/5 p-5">
            <strong className="text-success">
              Correcto
            </strong>

            <p className="mt-2 text-sm text-body">
              Ingresa un número de celular válido.
            </p>
          </div>

          <div className="rounded-xl border border-error/30 bg-error/5 p-5">
            <strong className="text-error">
              Evitar
            </strong>

            <p className="mt-2 text-sm text-body">
              Error: invalid_phone.
            </p>
          </div>
        </div>
      </DocsSection>
    </>
  );
}
