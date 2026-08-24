import CodeBlock from "@/components/design-system/CodeBlock";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const installCode = `git clone <repositorio-kivo>
cd onboarding-kivo-next

npm install
npm run dev`;

const validationCode = `npm run lint
npm run build`;

const structureCode = `app/
├── onboarding/
├── perfil/
├── dashboard/
└── design-system/

components/
├── onboarding/
├── perfil/
├── shell/
├── ui/
└── design-system/`;

export default function GettingStartedPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Getting Started"
        title="Instalación"
        description="Guía rápida para levantar el frontend de Kivo y comenzar a trabajar utilizando las convenciones del Design System."
      />

      <DocsSection
        title="Requisitos"
        description="Antes de iniciar, asegúrate de disponer del entorno necesario."
      >
        <div className="overflow-hidden rounded-2xl border border-border">
          {[
            ["Node.js", "Versión compatible con el proyecto"],
            ["npm", "Gestor de paquetes"],
            ["Git", "Control de versiones"],
            ["VS Code / editor", "Editor recomendado"],
          ].map(([name, detail]) => (
            <div
              key={name}
              className="grid gap-1 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-[180px_1fr]"
            >
              <div className="font-semibold text-ink">{name}</div>
              <div className="text-sm text-body">{detail}</div>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Levantar el proyecto">
        <CodeBlock code={installCode} language="bash" />
      </DocsSection>

      <DocsSection
        title="Validación antes de entregar"
        description="Todo cambio frontend debe verificarse antes de abrir un PR o entregar la implementación."
      >
        <CodeBlock code={validationCode} language="bash" />
      </DocsSection>

      <DocsSection
        title="Estructura relevante"
        description="El Design System vive en el mismo proyecto para poder utilizar los componentes reales."
      >
        <CodeBlock code={structureCode} language="text" />
      </DocsSection>

      <DocsSection title="Regla para componentes nuevos">
        <div className="space-y-3">
          {[
            "1. Revisar si el componente ya existe.",
            "2. Revisar si el caso se puede resolver mediante una variante.",
            "3. Evitar estilos arbitrarios si existe un token o patrón.",
            "4. Implementar responsive desde el inicio.",
            "5. Contemplar estados de error, disabled y loading cuando correspondan.",
            "6. Agregar o actualizar la documentación en /design-system.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-border bg-surface px-5 py-4 text-sm text-body"
            >
              {item}
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
