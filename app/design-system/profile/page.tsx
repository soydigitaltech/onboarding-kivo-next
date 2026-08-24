import { Edit3, Lock, Mail, Phone, UserRound } from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const profileItems = [
  ["Nombre completo", "Usuario Kivo"],
  ["Documento", "0000000 LP"],
  ["Celular", "76543210"],
  ["Correo", "usuario@ejemplo.com"],
];

export default function ProfileDesignSystemPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Kivo"
        title="Perfil de usuario"
        description="Patrones para visualizar y editar información del cliente sin convertir todo el perfil permanentemente en un formulario."
      />

      <DocsSection title="Principio">
        <div className="rounded-2xl border border-primary/20 bg-surface-blue p-6">
          <p className="leading-7 text-body">
            El perfil debe iniciar en modo lectura. La edición se activa de
            forma explícita y únicamente sobre la sección correspondiente.
          </p>
        </div>
      </DocsSection>

      <DocsSection title="Profile Section">
        <div className="rounded-2xl border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h3 className="font-bold text-ink">
                Información personal
              </h3>
              <p className="mt-1 text-sm text-muted">
                Datos principales de tu cuenta.
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-primary-dark hover:bg-surface-blue">
              <Edit3 size={16} />
              Editar
            </button>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            {profileItems.map(([label, value]) => (
              <div
                key={label}
                className="border-b border-border px-6 py-5 md:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <div className="text-xs font-semibold text-muted">
                  {label}
                </div>
                <div className="mt-1 font-semibold text-ink">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Secciones recomendadas">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [
              UserRound,
              "Información personal",
              "Identidad y datos generales.",
            ],
            [
              Phone,
              "Contacto",
              "Celular y otros medios de contacto.",
            ],
            [
              Mail,
              "Correo electrónico",
              "Correo principal y validación.",
            ],
            [
              Lock,
              "Seguridad",
              "Contraseña, sesiones y cierre de sesión.",
            ],
          ].map(([Icon, title, description]) => {
            const IconComponent = Icon as typeof UserRound;

            return (
              <div
                key={title as string}
                className="rounded-2xl border border-border p-6"
              >
                <IconComponent size={21} className="text-primary-dark" />
                <h3 className="mt-4 font-bold text-ink">
                  {title as string}
                </h3>
                <p className="mt-2 text-sm leading-6 text-body">
                  {description as string}
                </p>
              </div>
            );
          })}
        </div>
      </DocsSection>
    </>
  );
}
