import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

type Library = {
  name: string;
  version: string;
  purpose: string;
  install: string;
  docs: string;
};

const libraries: Library[] = [
  {
    name: "Next.js",
    version: "16.2.11",
    purpose: "Framework principal, App Router, rendering y optimizaciones.",
    install: "npm install next react react-dom",
    docs: "https://nextjs.org/docs",
  },
  {
    name: "React",
    version: "19.2.4",
    purpose: "Construcción de interfaces y componentes.",
    install: "npm install react react-dom",
    docs: "https://react.dev/",
  },
  {
    name: "React DOM",
    version: "19.2.4",
    purpose: "Integración de React con el DOM del navegador.",
    install: "npm install react react-dom",
    docs: "https://react.dev/reference/react-dom",
  },
  {
    name: "TypeScript",
    version: "5.x",
    purpose: "Tipado estático y seguridad del frontend.",
    install: "npm install -D typescript",
    docs: "https://www.typescriptlang.org/docs/",
  },
  {
    name: "Tailwind CSS",
    version: "4.x",
    purpose: "Sistema de estilos, responsive y tokens visuales.",
    install:
      "npm install -D tailwindcss @tailwindcss/postcss postcss",
    docs: "https://tailwindcss.com/docs",
  },
  {
    name: "Lucide React",
    version: "1.26.0",
    purpose: "Iconografía funcional oficial del producto.",
    install: "npm install lucide-react",
    docs: "https://lucide.dev/guide/packages/lucide-react",
  },
  {
    name: "Motion",
    version: "12.42.2",
    purpose: "Animaciones e interacciones declarativas.",
    install: "npm install motion",
    docs: "https://motion.dev/docs/react",
  },
  {
    name: "GSAP",
    version: "3.15.0",
    purpose: "Animaciones complejas, timelines y secuencias.",
    install: "npm install gsap",
    docs: "https://gsap.com/docs/v3/",
  },
  {
    name: "@gsap/react",
    version: "2.1.2",
    purpose: "Integración oficial de GSAP con React.",
    install: "npm install @gsap/react",
    docs: "https://gsap.com/resources/React/",
  },
  {
    name: "React Hook Form",
    version: "7.83.0",
    purpose: "Gestión eficiente del estado de formularios.",
    install: "npm install react-hook-form",
    docs: "https://react-hook-form.com/",
  },
  {
    name: "Zod",
    version: "4.4.3",
    purpose: "Validación y definición de schemas.",
    install: "npm install zod",
    docs: "https://zod.dev/",
  },
  {
    name: "@hookform/resolvers",
    version: "5.4.3",
    purpose: "Integración entre React Hook Form y Zod.",
    install: "npm install @hookform/resolvers",
    docs: "https://github.com/react-hook-form/resolvers",
  },
  {
    name: "Radix Select",
    version: "2.3.7",
    purpose: "Primitive accesible utilizada por KivoSelect.",
    install: "npm install @radix-ui/react-select",
    docs: "https://www.radix-ui.com/primitives/docs/components/select",
  },
  {
    name: "React Number Format",
    version: "5.4.5",
    purpose: "Formato de montos, números y campos monetarios.",
    install: "npm install react-number-format",
    docs: "https://s-yadav.github.io/react-number-format/",
  },
  {
    name: "Zustand",
    version: "5.0.14",
    purpose: "Estado global liviano del onboarding y producto.",
    install: "npm install zustand",
    docs: "https://zustand.docs.pmnd.rs/",
  },
  {
    name: "Resend",
    version: "6.18.0",
    purpose: "Envío transaccional de OTP y correos.",
    install: "npm install resend",
    docs: "https://resend.com/docs",
  },
  {
    name: "Leaflet",
    version: "1.9.4",
    purpose: "Mapas y representación de ubicación.",
    install: "npm install leaflet",
    docs: "https://leafletjs.com/reference.html",
  },
  {
    name: "dnd-kit",
    version: "0.5.0",
    purpose: "Interacciones drag and drop.",
    install: "npm install @dnd-kit/react @dnd-kit/helpers",
    docs: "https://dndkit.com/",
  },
  {
    name: "canvas-confetti",
    version: "1.9.4",
    purpose: "Feedback celebratorio puntual.",
    install: "npm install canvas-confetti",
    docs: "https://www.npmjs.com/package/canvas-confetti",
  },
  {
    name: "boring-avatars",
    version: "2.0.4",
    purpose: "Generación de avatares visuales.",
    install: "npm install boring-avatars",
    docs: "https://boringavatars.com/",
  },
];

export default function LibrariesPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Getting Started"
        title="Librerías"
        description="Stack oficial utilizado actualmente por Kivo. Cada dependencia incluye su versión de referencia, comando de instalación y documentación oficial."
      />

      <DocsSection title="Stack oficial">
        <div className="space-y-3">
          {libraries.map((library) => (
            <article
              key={library.name}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-ink">
                      {library.name}
                    </h3>

                    <span className="rounded-lg bg-surface px-2 py-1 font-mono text-[11px] font-semibold text-muted">
                      {library.version}
                    </span>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
                    {library.purpose}
                  </p>
                </div>

                <a
                  href={library.docs}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border-2 border-primary px-4 text-sm font-bold text-primary transition-colors hover:bg-surface-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  Documentación oficial ↗
                </a>
              </div>

              <div className="mt-4 overflow-x-auto rounded-xl bg-[#071A25] px-4 py-3">
                <code className="whitespace-nowrap font-mono text-xs text-white">
                  {library.install}
                </code>
              </div>
            </article>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Instalación base">
        <div className="rounded-2xl border border-border p-6">
          <p className="text-sm leading-6 text-body">
            Para instalar las dependencias definidas actualmente por el
            proyecto no es necesario instalarlas individualmente. Después de
            clonar el repositorio utiliza:
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl bg-[#071A25] px-4 py-3">
            <code className="font-mono text-xs text-white">
              npm install
            </code>
          </div>

          <p className="mt-3 text-xs leading-5 text-muted">
            Los comandos individuales documentados arriba sirven como
            referencia cuando una dependencia deba incorporarse a otro
            proyecto o reinstalarse explícitamente.
          </p>
        </div>
      </DocsSection>

      <DocsSection title="Reglas">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [
              "Iconos",
              "Utilizar Lucide React. Evitar incorporar FontAwesome, Heroicons, Phosphor u otra librería adicional sin una necesidad técnica justificada.",
            ],
            [
              "Animaciones",
              "Utilizar Motion para interacciones comunes y GSAP cuando la animación requiera secuencias, timelines o control avanzado.",
            ],
            [
              "Formularios",
              "Priorizar React Hook Form + Zod para formularios que requieran validación estructurada.",
            ],
            [
              "Estado",
              "Mantener estado local cuando sea suficiente. Utilizar Zustand únicamente cuando exista estado compartido real.",
            ],
            [
              "Componentes UI",
              "Antes de incorporar una nueva librería visual, revisar los componentes disponibles en components/ui/kivo.",
            ],
            [
              "Dependencias",
              "No agregar librerías duplicadas para resolver un problema que ya cubre el stack oficial.",
            ],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-border p-6"
            >
              <h3 className="font-bold text-ink">{title}</h3>

              <p className="mt-2 text-sm leading-6 text-body">
                {description}
              </p>
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
