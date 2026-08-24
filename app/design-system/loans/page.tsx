import {
  WalletCards,
} from "lucide-react";

import ComponentExample from "@/components/design-system/ComponentExample";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

import {
  KivoAmountCard,
  KivoButton,
  KivoLoanCard,
  KivoLoanSummary,
} from "@/components/ui/kivo";

export default function LoansPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Kivo Domain"
        title="Préstamos"
        description="Componentes específicos para representar montos, cuotas, plazo y estados del préstamo."
      />

      <ComponentExample
        title="KivoLoanCard"
        code={`<KivoLoanCard
  amount="Bs 15.000"
  installment="Bs 1.245"
  term="18 meses"
  status="Solicitado"
  statusVariant="info"
  action={
    <KivoButton fullWidth>
      Ver préstamo
    </KivoButton>
  }
/>`}
      >
        <div className="max-w-md">
          <KivoLoanCard
            amount="Bs 15.000"
            installment="Bs 1.245"
            term="18 meses"
            status="Solicitado"
            statusVariant="info"
            action={
              <KivoButton fullWidth>
                Ver préstamo
              </KivoButton>
            }
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoAmountCard"
        code={`<KivoAmountCard
  label="Cuota mensual"
  value="Bs 1.245"
  helper="18 cuotas"
  selected
/>`}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <KivoAmountCard
            label="Monto solicitado"
            value="Bs 15.000"
            icon={
              <WalletCards size={17} />
            }
          />

          <KivoAmountCard
            label="Cuota mensual"
            value="Bs 1.245"
            helper="18 cuotas"
            selected
          />

          <KivoAmountCard
            label="Total"
            value="Bs 19.455"
          />
        </div>
      </ComponentExample>

      <DocsSection title="Resumen financiero">
        <div className="max-w-xl">
          <KivoLoanSummary
            items={[
              {
                label: "Monto solicitado",
                value: "Bs 15.000",
                emphasis: true,
              },
              {
                label: "Total",
                value: "Bs 19.455",
              },
              {
                label: "Interés",
                value: "Bs 3.848",
              },
              {
                label: "Seguro",
                value: "Bs 338",
              },
            ]}
          />
        </div>
      </DocsSection>
    </>
  );
}
