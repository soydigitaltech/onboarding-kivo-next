import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  FileText,
  Home,
  Lock,
  Mail,
  MapPin,
  Phone,
  Search,
  Upload,
  User,
} from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import CodeBlock from "@/components/design-system/CodeBlock";

const icons = [
  ["Home", Home],
  ["User", User],
  ["Bell", Bell],
  ["FileText", FileText],
  ["Upload", Upload],
  ["Mail", Mail],
  ["Phone", Phone],
  ["MapPin", MapPin],
  ["Lock", Lock],
  ["Search", Search],
  ["Check", Check],
  ["CircleCheck", CircleCheck],
  ["CircleAlert", CircleAlert],
  ["ChevronDown", ChevronDown],
  ["ArrowLeft", ArrowLeft],
  ["ArrowRight", ArrowRight],
];

const code = `import { Bell } from "lucide-react";

<Bell size={20} />`;

export default function IconsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Foundations"
        title="Iconografía"
        description="Lucide React es la librería oficial para iconografía funcional en Kivo."
      />

      <DocsSection title="Iconos comunes">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {icons.map(([name, Icon]) => {
            const IconComponent = Icon as typeof Home;

            return (
              <div
                key={name as string}
                className="flex items-center gap-3 rounded-xl border border-border p-4"
              >
                <IconComponent size={20} />
                <span className="text-sm font-medium">{name as string}</span>
              </div>
            );
          })}
        </div>
      </DocsSection>

      <DocsSection title="Tamaños">
        <div className="grid gap-4 sm:grid-cols-4">
          {[16, 18, 20, 24].map((size) => (
            <div
              key={size}
              className="rounded-2xl border border-border p-5 text-center"
            >
              <Bell size={size} className="mx-auto" />
              <div className="mt-3 text-sm font-semibold">
                {size}px
              </div>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Código">
        <CodeBlock code={code} />
      </DocsSection>

      <DocsSection title="Regla">
        <p className="rounded-2xl border border-border bg-surface p-6 leading-7 text-body">
          No incorporar otra librería de iconos únicamente para resolver un
          icono que pueda representarse adecuadamente con Lucide.
        </p>
      </DocsSection>
    </>
  );
}
