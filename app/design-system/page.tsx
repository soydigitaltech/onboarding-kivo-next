import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Braces,
  Component,
  Palette,
  PanelsTopLeft,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const sections = [
  {
    title: "Getting Started",
    description:
      "Instalación, arquitectura y reglas básicas para trabajar en Kivo.",
    href: "/design-system/getting-started",
    icon: BookOpen,
  },
  {
    title: "Librerías",
    description:
      "Stack y dependencias oficiales utilizadas por el frontend.",
    href: "/design-system/libraries",
    icon: Braces,
  },
  {
    title: "Foundations",
    description:
      "Colores, tipografía, iconografía y bases visuales del producto.",
    href: "/design-system/foundations/colors",
    icon: Palette,
  },
  {
    title: "Componentes",
    description:
      "Elementos reutilizables, variantes, estados y ejemplos de código.",
    href: "/design-system/components",
    icon: Component,
  },
  {
    title: "Onboarding",
    description:
      "Patrones y componentes específicos del proceso de solicitud.",
    href: "/design-system/onboarding",
    icon: PanelsTopLeft,
  },
  {
    title: "Perfil",
    description:
      "Patrones para visualización y edición de información del cliente.",
    href: "/design-system/profile",
    icon: UserRound,
  },
  {
    title: "Patrones",
    description:
      "Formularios, feedback, loading, empty states y comportamiento.",
    href: "/design-system/patterns",
    icon: Boxes,
  },
  {
    title: "Accesibilidad",
    description:
      "Criterios mínimos de teclado, foco, contraste y contenido.",
    href: "/design-system/accessibility",
    icon: ShieldCheck,
  },
];

export default function DesignSystemPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Kivo"
        title="Design System"
        description="Fuente de verdad visual y técnica para construir experiencias consistentes en el onboarding y perfil de usuario de Kivo."
      />

      <div className="mb-14 rounded-3xl border border-primary/20 bg-surface-blue p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="text-sm font-bold text-primary-dark">
            Versión 1.0
          </div>

          <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink">
            Code-first. Sin Figma. Sin Storybook.
          </h2>

          <p className="mt-3 leading-7 text-body">
            El sistema nace del código real de Kivo. Los componentes,
            variantes y patrones documentados aquí deben coincidir con los
            utilizados en producción.
          </p>
        </div>
      </div>

      <DocsSection
        title="Explorar"
        description="Todo lo necesario para que un frontend pueda entender, integrar y extender Kivo de forma consistente."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-border bg-white p-6 transition hover:border-primary/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-blue text-primary-dark">
                    <Icon size={21} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-placeholder transition group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>

                <h3 className="mt-6 text-lg font-bold text-ink">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-body">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </DocsSection>

      <DocsSection title="Principios">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "Consistencia",
              "Un mismo problema de interfaz debe resolverse con el mismo componente o patrón.",
            ],
            [
              "Simplicidad",
              "Kivo debe sentirse claro, confiable, financiero, moderno y fácil de entender.",
            ],
            [
              "Reutilización",
              "Antes de crear un componente nuevo, revisar si el caso puede resolverse con una variante existente.",
            ],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-surface p-6"
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
