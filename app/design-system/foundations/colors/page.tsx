import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const brandColors = [
  ["Primary", "#03AEFE", "bg-primary"],
  ["Primary Dark", "#1B5BB6", "bg-primary-dark"],
  ["Cerulean", "#44A3DA", "bg-cerulean"],
  ["Sky", "#5FDAF8", "bg-sky"],
  ["Accent", "#FE9806", "bg-accent"],
  ["Purple", "#9003FD", "bg-purple"],
];

const neutralColors = [
  ["Ink", "#000000", "bg-ink"],
  ["Ink Soft", "#17181C", "bg-ink-soft"],
  ["Body", "#4C5566", "bg-body"],
  ["Muted", "#6B7484", "bg-muted"],
  ["Placeholder", "#9AA2B1", "bg-placeholder"],
  ["Page", "#DDF6FD", "bg-page"],
  ["Surface", "#F7FAFC", "bg-surface"],
  ["Surface Blue", "#E9F7FF", "bg-surface-blue"],
  ["Border", "#D9DFE8", "bg-border"],
];

const statusColors = [
  ["Success", "#0BBF7C", "bg-success"],
  ["Error", "#E02424", "bg-error"],
  ["Warning", "#A56800", "bg-warning"],
];

function ColorGrid({
  colors,
}: {
  colors: string[][];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {colors.map(([name, hex, className]) => (
        <div
          key={name}
          className="overflow-hidden rounded-2xl border border-border"
        >
          <div className={`h-28 ${className}`} />

          <div className="bg-white p-4">
            <div className="font-bold text-ink">{name}</div>
            <div className="mt-1 font-mono text-xs text-muted">
              {hex}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ColorsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Foundations"
        title="Colores"
        description="Paleta oficial y tokens semánticos utilizados en la interfaz de Kivo."
      />

      <DocsSection title="Marca">
        <ColorGrid colors={brandColors} />
      </DocsSection>

      <DocsSection title="Neutros y superficies">
        <ColorGrid colors={neutralColors} />
      </DocsSection>

      <DocsSection
        title="Estados"
        description="Los colores de estado representan significado funcional, no decoración."
      >
        <ColorGrid colors={statusColors} />
      </DocsSection>

      <DocsSection title="Regla">
        <div className="rounded-2xl border border-warning-border bg-warning-bg p-6">
          <p className="leading-7 text-body">
            No crear nuevos hexadecimales directamente en componentes si el
            color ya existe como token del sistema. Los colores semánticos
            deben utilizarse según su significado.
          </p>
        </div>
      </DocsSection>
    </>
  );
}
