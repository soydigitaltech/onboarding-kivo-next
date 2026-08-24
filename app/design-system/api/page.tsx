import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

const components = [
  [
    "KivoButton",
    "variant, size, loading, iconLeft, iconRight, fullWidth, disabled",
  ],
  [
    "KivoInput",
    "label, helper, error, leadingIcon, trailingAction, required",
  ],
  [
    "KivoTextarea",
    "label, helper, error, required",
  ],
  [
    "KivoSelect",
    "label, value, options, onValueChange, helper, error",
  ],
  [
    "KivoMoneyInput",
    "label, helper, error, decimalScale",
  ],
  [
    "KivoPhoneInput",
    "KivoInput props excepto type/leadingIcon",
  ],
  [
    "KivoPasswordInput",
    "KivoInput props excepto type/trailingAction",
  ],
  [
    "KivoOTPInput",
    "value, onChange, length, disabled, error",
  ],
  [
    "KivoCard",
    "variant",
  ],
  [
    "KivoAlert",
    "variant, title",
  ],
  [
    "KivoBadge",
    "variant, icon",
  ],
  [
    "KivoCheckbox",
    "label, description, error",
  ],
  [
    "KivoRadioCard",
    "title, description, icon, checked",
  ],
  [
    "KivoModal",
    "open, onClose, title, description, footer, size",
  ],
  [
    "KivoStepper",
    "steps",
  ],
  [
    "KivoDocumentUploader",
    "title, description, accept, disabled, onFileSelect",
  ],
  [
    "KivoDocumentCard",
    "title, filename, status, statusVariant, action",
  ],
  [
    "KivoLoanSummary",
    "items",
  ],
  [
    "KivoLoanCard",
    "amount, installment, term, status, action",
  ],
  [
    "KivoProfileField",
    "label, value, emptyText",
  ],
  [
    "KivoResultState",
    "variant, title, description, action",
  ],
  [
    "KivoLogo",
    "variant, size, priority",
  ],
  [
    "KivoAvatar",
    "src, initials, size, alt",
  ],
  [
    "KivoActionCard",
    "title, description, icon, meta, selected, disabled, onClick",
  ],
  [
    "KivoStatusCard",
    "title, description, status, statusVariant, icon, action",
  ],
  [
    "KivoProfileCard",
    "name, subtitle, initials, image, details, onEdit",
  ],
];

export default function APIPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Reference"
        title="Component API"
        description="Referencia rápida de las props principales disponibles en los componentes oficiales de Kivo."
      />

      <DocsSection title="Referencia">
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[220px_1fr] border-b border-border bg-surface px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-muted">
            <div>Componente</div>
            <div>Props principales</div>
          </div>

          {components.map(
            ([component, props]) => (
              <div
                key={component}
                className="grid gap-3 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-[220px_1fr]"
              >
                <code className="text-sm font-bold text-primary-dark">
                  {component}
                </code>

                <code className="text-xs leading-6 text-body">
                  {props}
                </code>
              </div>
            ),
          )}
        </div>
      </DocsSection>
    </>
  );
}
