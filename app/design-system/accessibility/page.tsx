import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const requirements = [
  [
    "Keyboard",
    "Toda acción interactiva debe poder utilizarse sin mouse.",
  ],
  [
    "Focus visible",
    "Nunca eliminar el foco sin proporcionar una alternativa visual.",
  ],
  [
    "Labels",
    "Los campos de formulario deben tener labels comprensibles.",
  ],
  [
    "Errores",
    "No depender únicamente del color para comunicar un error.",
  ],
  [
    "Touch",
    "Mantener áreas táctiles suficientemente grandes en mobile.",
  ],
  [
    "Reduced motion",
    "Respetar prefers-reduced-motion en animaciones.",
  ],
  [
    "Disabled",
    "Un control deshabilitado debe ser visual y semánticamente reconocible.",
  ],
  [
    "ARIA",
    "Agregar atributos ARIA cuando el HTML semántico no sea suficiente.",
  ],
];

export default function AccessibilityPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Guidelines"
        title="Accesibilidad"
        description="Criterios mínimos para asegurar que los componentes de Kivo puedan ser utilizados por la mayor cantidad posible de personas."
      />

      <DocsSection title="Checklist">
        <div className="overflow-hidden rounded-2xl border border-border">
          {requirements.map(([title, description]) => (
            <div
              key={title}
              className="grid gap-2 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-[180px_1fr]"
            >
              <div className="font-semibold text-ink">
                {title}
              </div>
              <div className="text-sm leading-6 text-body">
                {description}
              </div>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Definition of Done">
        <div className="space-y-3">
          {[
            "Funciona correctamente en mobile.",
            "Funciona correctamente en desktop.",
            "Tiene estado focus visible.",
            "Contempla disabled cuando corresponde.",
            "Contempla loading cuando corresponde.",
            "Contempla errores cuando corresponde.",
            "Utiliza tokens del Design System.",
            "Utiliza Lucide para iconografía funcional.",
            "No duplica un componente existente.",
            "Está documentado en /design-system cuando introduce un patrón nuevo.",
            "npm run build finaliza correctamente.",
          ].map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-xl border border-border px-5 py-4 text-sm text-body"
            >
              <span className="font-bold text-success">✓</span>
              {item}
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
