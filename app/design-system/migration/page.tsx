import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const rows = [
  [
    "fields.tsx · retirado",
    "Field",
    "KivoInput / componentes especializados",
    "Migrado",
  ],
  [
    "fields.tsx · retirado",
    "PrefixedInputShell",
    "KivoAffixedInput",
    "Migrado",
  ],
  [
    "fields.tsx · retirado",
    "SuffixedInputShell",
    "KivoAffixedInput",
    "Migrado",
  ],
  [
    "fields.tsx · retirado",
    "RadioPill",
    "KivoRadioPill",
    "Migrado",
  ],
  [
    "fields.tsx · retirado",
    "BusinessNotice",
    "KivoBusinessNotice",
    "Migrado",
  ],
  [
    "fields.tsx · retirado",
    "DangerNotice",
    "KivoDangerNotice",
    "Migrado",
  ],
  [
    "CustomSelect.tsx · retirado",
    "CustomSelect",
    "Integrado directamente en KivoSelect",
    "Conservar",
  ],
  [
    "components/onboarding/Stepper.tsx",
    "Stepper",
    "Stepper oficial del onboarding",
    "Conservar",
  ],
  [
    "components/onboarding/AccordionSection.tsx",
    "AccordionSection",
    "Patrón de onboarding",
    "Conservar",
  ],
  [
    "components/onboarding/steps/DocumentoSlot.tsx",
    "DocumentoSlot",
    "Componente de dominio",
    "Conservar",
  ],
  [
    "components/onboarding/steps/DocumentosForm.tsx",
    "DocumentosForm",
    "Orquestador de documentos",
    "Conservar",
  ],
  [
    "components/perfil/PerfilView.tsx",
    "TarjetaPerfil",
    "KivoSection / KivoProfileCard",
    "Migrar gradualmente",
  ],
  [
    "components/perfil/PerfilView.tsx",
    "Campo",
    "KivoProfileField",
    "Migrado",
  ],
];

export default function MigrationPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Reference"
        title="Migration Map"
        description="Mapa entre los componentes actuales de producción y la API oficial del Kivo Design System."
      />

      <DocsSection title="Estado actual">
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-surface">
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-xs font-bold text-muted">
                  Archivo actual
                </th>

                <th className="px-5 py-3 text-xs font-bold text-muted">
                  Actual
                </th>

                <th className="px-5 py-3 text-xs font-bold text-muted">
                  Design System
                </th>

                <th className="px-5 py-3 text-xs font-bold text-muted">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map(
                ([
                  file,
                  current,
                  designSystem,
                  action,
                ]) => (
                  <tr
                    key={`${file}-${current}`}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-body">
                      {file}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-ink">
                      {current}
                    </td>

                    <td className="px-5 py-4 font-mono text-xs text-primary-dark">
                      {designSystem}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`
                          rounded-full px-3 py-1.5
                          text-xs font-bold
                          ${
                            action === "Conservar"
                              ? "bg-success/10 text-success"
                              : "bg-surface-blue text-primary-dark"
                          }
                        `}
                      >
                        {action}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </DocsSection>

      <DocsSection title="Orden de migración">
        <div className="space-y-3">
          {[
            "1. Fields y estilos base",
            "2. Selects",
            "3. Buttons",
            "4. Cards y secciones",
            "5. Perfil",
            "6. Revisar Stepper sin reemplazarlo",
            "7. Documentar DocumentoSlot sin eliminar lógica",
          ].map((item) => (
            <div
              key={item}
              className="
                rounded-xl border border-border
                px-5 py-4
                text-sm font-semibold text-body
              "
            >
              {item}
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
