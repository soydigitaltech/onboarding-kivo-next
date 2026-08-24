import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

export default function ChangelogPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Design System"
        title="Changelog"
        description="Registro de cambios relevantes del Kivo Design System."
      />

      <DocsSection title="v1.0.0">
        <div className="rounded-2xl border border-border p-6">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-primary-dark">
            Initial Release
          </div>

          <h3 className="mt-2 text-xl font-bold">
            Kivo Design System
          </h3>

          <ul className="mt-5 space-y-2 text-sm leading-6 text-body">
            <li>• Foundations y tokens oficiales.</li>
            <li>• Documentación de stack y librerías.</li>
            <li>• Componentes básicos de formularios.</li>
            <li>• Select, dinero, teléfono, password y OTP.</li>
            <li>• Buttons, cards, alerts y badges.</li>
            <li>• Modal, skeleton y result states.</li>
            <li>• Stepper y layout de onboarding.</li>
            <li>• DocumentUploader y DocumentCard.</li>
            <li>• LoanCard, LoanSummary y AmountCard.</li>
            <li>• ProfileField y ProfileSection.</li>
            <li>• Responsive, accesibilidad y UX Writing.</li>
            <li>• Component API.</li>
          </ul>
        </div>
      </DocsSection>
    </>
  );
}
