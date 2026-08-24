import {
  Bell,
  Download,
  UserRound,
} from "lucide-react";

import CodeBlock from "@/components/design-system/CodeBlock";
import ComponentExample from "@/components/design-system/ComponentExample";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

import {
  KivoAvatar,
  KivoLogo,
} from "@/components/ui/kivo";

export default function AssetsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Foundations"
        title="Brand Assets"
        description="Logos, favicon, avatars y recursos visuales oficiales utilizados en la interfaz de Kivo."
      />

      <DocsSection
        title="Logo principal"
        description="Utilizar el asset oficial. No recrear el logo con texto o CSS."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex min-h-52 items-center justify-center rounded-2xl border border-border bg-white p-8">
            <KivoLogo
              size="xl"
              priority
            />
          </div>

          <div className="flex min-h-52 items-center justify-center rounded-2xl bg-[#0F172A] p-8">
            <div className="rounded-xl bg-white p-6">
              <KivoLogo size="lg" />
            </div>
          </div>
        </div>
      </DocsSection>

      <ComponentExample
        title="Uso del logo"
        code={`import {
  KivoLogo
} from "@/components/ui/kivo";

<KivoLogo
  variant="primary"
  size="md"
/>`}
      >
        <div className="flex flex-wrap items-center gap-8">
          <KivoLogo size="sm" />
          <KivoLogo size="md" />
          <KivoLogo size="lg" />
        </div>
      </ComponentExample>

      <DocsSection
        title="Logo de tablero"
        description="Variante disponible actualmente en public/kivo-tablero.svg."
      >
        <div className="flex min-h-44 items-center justify-center rounded-2xl border border-border bg-white p-8">
          <KivoLogo
            variant="dashboard"
            size="xl"
          />
        </div>

        <div className="mt-4">
          <CodeBlock
            code={`<KivoLogo
  variant="dashboard"
  size="lg"
/>`}
          />
        </div>
      </DocsSection>

      <DocsSection title="Favicon">
        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex h-36 items-center justify-center rounded-2xl border border-border bg-surface">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
              <KivoLogo
                size="sm"
                className="max-w-full"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="font-bold">
              app/icon.svg
            </h3>

            <p className="mt-2 text-sm leading-6 text-body">
              Next.js App Router detecta este archivo automáticamente para utilizarlo como icono de la aplicación.
            </p>

            <div className="mt-4 rounded-xl bg-surface px-4 py-3 font-mono text-xs text-body">
              app/icon.svg
            </div>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Reglas del logo">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-success/30 bg-success/5 p-6">
            <div className="font-bold text-success">
              Correcto
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-6 text-body">
              <li>• Utilizar el SVG oficial.</li>
              <li>• Mantener proporción original.</li>
              <li>• Mantener espacio alrededor.</li>
              <li>• Utilizar fondos con contraste suficiente.</li>
              <li>• Importar mediante KivoLogo.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-error/30 bg-error/5 p-6">
            <div className="font-bold text-error">
              Evitar
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-6 text-body">
              <li>• Estirar el logo.</li>
              <li>• Cambiar sus colores manualmente.</li>
              <li>• Recrearlo con una tipografía.</li>
              <li>• Aplicar sombras.</li>
              <li>• Rotarlo o deformarlo.</li>
            </ul>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Avatars">
        <div className="flex flex-wrap items-end gap-6 rounded-2xl border border-border bg-surface p-6">
          <div className="text-center">
            <KivoAvatar
              initials="HK"
              size="sm"
            />
            <div className="mt-2 text-xs text-muted">
              sm
            </div>
          </div>

          <div className="text-center">
            <KivoAvatar
              initials="HK"
              size="md"
            />
            <div className="mt-2 text-xs text-muted">
              md
            </div>
          </div>

          <div className="text-center">
            <KivoAvatar
              initials="HK"
              size="lg"
            />
            <div className="mt-2 text-xs text-muted">
              lg
            </div>
          </div>

          <div className="text-center">
            <KivoAvatar
              initials="HK"
              size="xl"
            />
            <div className="mt-2 text-xs text-muted">
              xl
            </div>
          </div>

          <KivoAvatar
            size="lg"
            alt="Usuario"
          />
        </div>

        <div className="mt-4">
          <CodeBlock
            code={`<KivoAvatar
  initials="HK"
  size="lg"
/>`}
          />
        </div>
      </DocsSection>

      <DocsSection title="Iconografía funcional">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            [UserRound, "Perfil"],
            [Bell, "Notificaciones"],
            [Download, "Descargar"],
          ].map(([Icon, label]) => {
            const IconComponent =
              Icon as typeof UserRound;

            return (
              <div
                key={label as string}
                className="flex items-center gap-3 rounded-xl border border-border p-4"
              >
                <IconComponent
                  size={20}
                  className="text-primary-dark"
                />

                <span className="text-sm font-semibold">
                  {label as string}
                </span>
              </div>
            );
          })}
        </div>
      </DocsSection>
    </>
  );
}
