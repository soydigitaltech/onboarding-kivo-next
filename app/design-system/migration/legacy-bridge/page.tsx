import {
  KivoAlert,
} from "@/components/ui/kivo";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import CodeBlock from "@/components/design-system/CodeBlock";

export default function LegacyBridgePage() {
  return (
    <>
      <DocsHeader
        eyebrow="Migration"
        title="Legacy UI Bridge"
        description="Histórico de la capa de compatibilidad utilizada durante la migración hacia la API oficial del Kivo Design System."
      />

      <DocsSection title="Estado">
        <KivoAlert
          variant="warning"
          title="Bridge retirado"
        >
          components/ui/fields.tsx fue retirado. Los formularios productivos consumen ahora directamente @/components/ui/kivo.
        </KivoAlert>
      </DocsSection>

      <DocsSection title="Código nuevo">
        <CodeBlock
          code={`import {
  KivoButton,
  KivoField,
  KivoInput,
  KivoSelect,
  KivoAffixedInput,
  KivoRadioPill,
  KivoBusinessNotice,
  KivoDangerNotice,
} from "@/components/ui/kivo";`}
        />
      </DocsSection>

      <DocsSection title="Mapa">
        <div className="overflow-hidden rounded-2xl border border-border">
          {[
            [
              "Field",
              "KivoField / KivoInput",
            ],

            [
              "PrefixedInputShell",
              "KivoAffixedInput",
            ],

            [
              "SuffixedInputShell",
              "KivoAffixedInput",
            ],

            [
              "RadioPill",
              "KivoRadioPill",
            ],

            [
              "BusinessNotice",
              "KivoBusinessNotice",
            ],

            [
              "DangerNotice",
              "KivoDangerNotice",
            ],

            [
              "inputClassName",
              "KivoInput",
            ],

            [
              "selectClassName",
              "KivoSelect",
            ],
          ].map(
            ([legacy, current]) => (
              <div
                key={legacy}
                className="
                  grid gap-2
                  border-b border-border
                  px-5 py-4
                  last:border-b-0
                  md:grid-cols-[220px_1fr]
                "
              >
                <code className="text-sm text-error">
                  {legacy}
                </code>

                <code className="text-sm text-primary-dark">
                  {current}
                </code>
              </div>
            ),
          )}
        </div>
      </DocsSection>
    </>
  );
}
