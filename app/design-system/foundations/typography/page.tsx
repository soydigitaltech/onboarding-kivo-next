import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

export default function TypographyPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Foundations"
        title="Tipografía"
        description="Kivo utiliza Manrope como tipografía principal de interfaz. Se carga mediante next/font y se utiliza como fuente sans-serif del producto."
      />

      <DocsSection title="Fuente oficial">
        <div className="rounded-2xl border border-border p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-muted">
                Familia tipográfica
              </div>

              <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-ink">
                Manrope
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-body">
                Tipografía principal para interfaz, formularios,
                navegación, contenido y valores financieros de Kivo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://fonts.google.com/specimen/Manrope"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center justify-center rounded-xl border-2 border-primary px-4 text-sm font-bold text-primary transition-colors hover:bg-surface-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                Google Fonts ↗
              </a>

              <a
                href="https://nextjs.org/docs/app/getting-started/fonts"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                next/font ↗
              </a>
            </div>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Implementación">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border p-6">
            <h3 className="font-bold text-ink">
              Instalación
            </h3>

            <p className="mt-2 text-sm leading-6 text-body">
              Manrope no requiere instalar un paquete npm adicional en Kivo.
              La fuente se obtiene mediante next/font/google, incluido en
              Next.js.
            </p>

            <div className="mt-4 rounded-xl bg-[#071A25] px-4 py-3">
              <code className="font-mono text-xs text-white">
                import &#123; Manrope &#125; from &quot;next/font/google&quot;;
              </code>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="font-bold text-ink">
              Regla
            </h3>

            <p className="mt-2 text-sm leading-6 text-body">
              No incorporar otra familia tipográfica para la interfaz sin una
              decisión explícita del Design System. La consistencia
              tipográfica forma parte de la identidad visual de Kivo.
            </p>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Pesos">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Regular", "400", "Contenido y textos largos"],
            ["Medium", "500", "Controles y contenido de apoyo"],
            ["Bold", "700", "Labels y jerarquía"],
            ["ExtraBold", "800", "Énfasis y cifras"],
          ].map(([name, weight, use]) => (
            <div
              key={weight}
              className="rounded-2xl border border-border p-5"
            >
              <div className="font-mono text-xs text-muted">
                {weight}
              </div>

              <div
                className="mt-3 text-xl text-ink"
                style={{
                  fontWeight: Number(weight),
                }}
              >
                {name}
              </div>

              <p className="mt-2 text-xs leading-5 text-muted">
                {use}
              </p>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Escala">
        <div className="divide-y divide-border rounded-2xl border border-border">
          <div className="p-6">
            <div className="mb-2 text-xs font-semibold text-muted">
              Display
            </div>
            <div className="text-5xl font-bold tracking-[-0.04em]">
              Diseñamos confianza
            </div>
          </div>

          <div className="p-6">
            <div className="mb-2 text-xs font-semibold text-muted">
              Heading 1
            </div>
            <div className="text-4xl font-bold tracking-[-0.035em]">
              Completa tus datos
            </div>
          </div>

          <div className="p-6">
            <div className="mb-2 text-xs font-semibold text-muted">
              Heading 2
            </div>
            <div className="text-2xl font-bold tracking-[-0.025em]">
              Información personal
            </div>
          </div>

          <div className="p-6">
            <div className="mb-2 text-xs font-semibold text-muted">
              Heading 3
            </div>
            <div className="text-lg font-bold">
              Datos laborales
            </div>
          </div>

          <div className="p-6">
            <div className="mb-2 text-xs font-semibold text-muted">
              Body
            </div>
            <p className="max-w-2xl leading-7 text-body">
              Utiliza textos simples, directos y fáciles de entender.
              Evita lenguaje financiero innecesariamente complejo.
            </p>
          </div>

          <div className="p-6">
            <div className="mb-2 text-xs font-semibold text-muted">
              Label
            </div>
            <div className="text-sm font-semibold">
              Número de celular
            </div>
          </div>

          <div className="p-6">
            <div className="mb-2 text-xs font-semibold text-muted">
              Financial Amount
            </div>
            <div className="text-3xl font-bold tabular-nums">
              Bs 15.000
            </div>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Formato financiero">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Monto", "Bs 15.000"],
            ["Cuota", "Bs 1.245,50"],
            ["Porcentaje", "10,5 %"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-border p-5"
            >
              <div className="text-xs font-semibold text-muted">
                {label}
              </div>

              <div className="mt-2 text-xl font-bold tabular-nums">
                {value}
              </div>
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
