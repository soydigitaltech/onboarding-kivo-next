import Link from "next/link";

const groups = [
  {
    label: "GETTING STARTED",
    links: [
      ["Overview", "/design-system"],
      ["Instalación", "/design-system/getting-started"],
      ["Implementación", "/design-system/getting-started/implementation"],
      ["Librerías", "/design-system/libraries"],
    ],
  },
  {
    label: "FOUNDATIONS",
    links: [
      ["Colores", "/design-system/foundations/colors"],
      ["Tipografía", "/design-system/foundations/typography"],
      ["Iconografía", "/design-system/foundations/icons"],
      ["Brand Assets", "/design-system/assets"],
    ],
  },
  {
    label: "COMPONENTS",
    links: [
      ["Overview", "/design-system/components"],
      ["Buttons", "/design-system/components/buttons"],
      ["Forms & Inputs", "/design-system/components/forms"],
      ["Selection", "/design-system/components/selection"],
      ["Cards", "/design-system/components/cards"],
      ["Feedback", "/design-system/components/feedback"],
      ["Loading", "/design-system/components/loading"],
      ["Modals", "/design-system/components/modals"],
      ["Advanced", "/design-system/components/advanced"],
      ["Result States", "/design-system/components/results"],
    ],
  },
  {
    label: "ONBOARDING",
    links: [
      ["Overview", "/design-system/onboarding"],
      ["Stepper", "/design-system/onboarding/stepper"],
      ["Documentos", "/design-system/onboarding/documents"],
      ["Layout & Navigation", "/design-system/onboarding/layout"],
      ["Datos personales", "/design-system/onboarding/personal-data"],
    ],
  },
  {
    label: "PROFILE",
    links: [
      ["Overview", "/design-system/profile"],
      ["Secciones", "/design-system/profile/sections"],
      ["Préstamos", "/design-system/loans"],
    ],
  },
  {
    label: "GUIDELINES",
    links: [
      ["Formularios", "/design-system/forms"],
      ["Patrones UX", "/design-system/patterns"],
      ["Accesibilidad", "/design-system/accessibility"],
      ["Responsive", "/design-system/guidelines/responsive"],
      ["UX Writing", "/design-system/guidelines/ux-writing"],
      ["Component API", "/design-system/api"],
      ["Migration Map", "/design-system/migration"],
      ["Legacy Bridge", "/design-system/migration/legacy-bridge"],
      ["Changelog", "/design-system/changelog"],
    ],
  },
] as const;

export default function DesignSystemSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 overflow-y-auto border-r border-border bg-white lg:block">
      <div className="sticky top-0 z-10 border-b border-border bg-white px-7 py-7">
        <Link href="/design-system" className="block">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Kivo
          </div>

          <div className="mt-1 text-xl font-bold tracking-[-0.03em] text-ink">
            Design System
          </div>

          <div className="mt-1 text-xs text-muted">
            Onboarding & Perfil
          </div>
        </Link>
      </div>

      <nav className="space-y-8 px-4 py-7">
        {groups.map((group) => (
          <section key={group.label}>
            <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.14em] text-placeholder">
              {group.label}
            </div>

            <div className="space-y-0.5">
              {group.links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-body transition hover:bg-surface-blue hover:text-primary-dark"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
