import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

export default function ResponsivePage() {
  return (
    <>
      <DocsHeader
        eyebrow="Guidelines"
        title="Responsive"
        description="El onboarding de Kivo es mobile-first. Desktop amplía la experiencia, pero no debe definirla."
      />

      <DocsSection title="Reglas generales">
        <div className="overflow-hidden rounded-2xl border border-border">
          {[
            [
              "Formularios",
              "1 columna mobile. Usar 2 columnas únicamente cuando los campos tengan relación clara y exista espacio suficiente.",
            ],
            [
              "Cards",
              "Full width en mobile. Grid progresivo en pantallas mayores.",
            ],
            [
              "Acciones",
              "Pueden ser sticky abajo en mobile para mantener Continuar accesible.",
            ],
            [
              "Stepper",
              "Debe compactarse en mobile y evitar desbordamientos horizontales.",
            ],
            [
              "Modales",
              "En mobile pueden acercarse a fullscreen cuando el contenido lo requiera.",
            ],
            [
              "Tablas",
              "Evitar tablas complejas en mobile. Preferir cards o listas.",
            ],
          ].map(([title, description]) => (
            <div
              key={title}
              className="grid gap-2 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-[160px_1fr]"
            >
              <strong>{title}</strong>

              <div className="text-sm leading-6 text-body">
                {description}
              </div>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Breakpoints">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Mobile", "< 640px"],
            ["sm", "640px"],
            ["md", "768px"],
            ["lg", "1024px+"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-border p-5"
            >
              <strong>{label}</strong>
              <div className="mt-2 font-mono text-sm text-muted">
                {value}
              </div>
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
