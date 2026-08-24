import {
  Building2,
  ChevronRight,
  FileText,
  UserRound,
  WalletCards,
} from "lucide-react";

import ComponentExample from "@/components/design-system/ComponentExample";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

import {
  KivoActionCard,
  KivoAmountCard,
  KivoBadge,
  KivoButton,
  KivoCard,
  KivoDocumentCard,
  KivoEmptyState,
  KivoLoanCard,
  KivoProfileCard,
  KivoProfileField,
  KivoStatusCard,
} from "@/components/ui/kivo";

export default function CardsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Cards"
        description="Catálogo oficial de superficies y agrupaciones visuales utilizadas en onboarding, perfil, documentos y préstamo."
      />

      <ComponentExample
        title="Base Card"
        description="La superficie base utiliza borde, fondo y espaciado. No necesita sombra."
        code={`<KivoCard>
  <div className="text-sm text-muted">
    Monto solicitado
  </div>

  <div className="
    mt-2 text-2xl font-bold
    tabular-nums
  ">
    Bs 15.000
  </div>
</KivoCard>`}
      >
        <div className="max-w-sm">
          <KivoCard>
            <div className="text-sm text-muted">
              Monto solicitado
            </div>

            <div className="mt-2 text-2xl font-bold tabular-nums">
              Bs 15.000
            </div>
          </KivoCard>
        </div>
      </ComponentExample>

      <ComponentExample
        title="Amount Card"
        description="Utilizada para destacar montos, cuotas o valores financieros."
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

      <ComponentExample
        title="Action Card"
        description="Representa una sección o acción navegable."
        code={`<KivoActionCard
  title="Información laboral"
  description="
    Revisa y actualiza
    tus datos laborales.
  "
  icon={
    <Building2 size={20} />
  }
/>`}
      >
        <div className="max-w-xl">
          <KivoActionCard
            title="Información laboral"
            description="Revisa y actualiza tus datos laborales."
            icon={
              <Building2 size={20} />
            }
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="Selected Action Card"
        description="Utilizar cuando una opción forma parte de una selección."
        code={`<KivoActionCard
  title="Cuenta propia"
  description="
    Trabajo de manera independiente.
  "
  selected
/>`}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <KivoActionCard
            title="Cuenta propia"
            description="Trabajo de manera independiente."
            selected
          />

          <KivoActionCard
            title="Dependiente"
            description="Trabajo para una empresa."
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="Status Card"
        code={`<KivoStatusCard
  title="Validación de identidad"
  description="
    Estamos revisando
    tus documentos.
  "
  status="En revisión"
  statusVariant="pending"
  icon={
    <UserRound size={20} />
  }
/>`}
      >
        <div className="max-w-xl">
          <KivoStatusCard
            title="Validación de identidad"
            description="Estamos revisando tus documentos."
            status="En revisión"
            statusVariant="pending"
            icon={
              <UserRound size={20} />
            }
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="Loan Card"
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
        title="Document Card"
        code={`<KivoDocumentCard
  title="Carnet de identidad"
  filename="carnet-frontal.jpg"
  status="Aprobado"
  statusVariant="approved"
  action={
    <KivoButton
      variant="ghost"
      size="sm"
    >
      Reemplazar
    </KivoButton>
  }
/>`}
      >
        <div className="max-w-xl">
          <KivoDocumentCard
            title="Carnet de identidad"
            filename="carnet-frontal.jpg"
            status="Aprobado"
            statusVariant="approved"
            action={
              <KivoButton
                variant="ghost"
                size="sm"
              >
                Reemplazar
              </KivoButton>
            }
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="Profile Card"
        code={`<KivoProfileCard
  name="Usuario Kivo"
  subtitle="Cliente"
  initials="UK"
  details={
    <div className="
      grid gap-5 md:grid-cols-2
    ">
      <KivoProfileField
        label="Celular"
        value="76543210"
      />

      <KivoProfileField
        label="Ciudad"
        value="La Paz"
      />
    </div>
  }
/>`}
      >
        <div className="max-w-2xl">
          <KivoProfileCard
            name="Usuario Kivo"
            subtitle="Cliente"
            initials="UK"
            details={
              <div className="grid gap-5 md:grid-cols-2">
                <KivoProfileField
                  label="Celular"
                  value="76543210"
                />

                <KivoProfileField
                  label="Ciudad"
                  value="La Paz"
                />

                <KivoProfileField
                  label="Correo"
                  value="usuario@ejemplo.com"
                />

                <KivoProfileField
                  label="Estado"
                  value={
                    <KivoBadge variant="approved">
                      Verificado
                    </KivoBadge>
                  }
                />
              </div>
            }
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="Empty Card"
        code={`<KivoEmptyState
  icon={
    <FileText size={22} />
  }
  title="Aún no tienes documentos"
  description="
    Cuando subas tus documentos
    podrás consultarlos aquí.
  "
  action={
    <KivoButton>
      Subir documento
    </KivoButton>
  }
/>`}
      >
        <KivoEmptyState
          icon={
            <FileText size={22} />
          }
          title="Aún no tienes documentos"
          description="Cuando subas tus documentos podrás consultarlos aquí."
          action={
            <KivoButton>
              Subir documento
            </KivoButton>
          }
        />
      </ComponentExample>

      <DocsSection title="Estados de Card">
        <div className="grid gap-4 md:grid-cols-4">
          <KivoCard>
            <strong>Default</strong>
          </KivoCard>

          <KivoCard variant="muted">
            <strong>Muted</strong>
          </KivoCard>

          <KivoCard variant="selected">
            <strong>Selected</strong>
          </KivoCard>

          <KivoCard variant="interactive">
            <div className="flex items-center justify-between">
              <strong>Interactive</strong>
              <ChevronRight size={17} />
            </div>
          </KivoCard>
        </div>
      </DocsSection>

      <DocsSection title="Reglas de cards">
        <div className="space-y-3">
          {[
            "No utilizar sombras para separar una card del fondo salvo una excepción justificada.",
            "Usar border-border como separación principal.",
            "No crear radios diferentes por pantalla.",
            "Mantener padding consistente.",
            "Una card seleccionable debe tener un estado selected visible.",
            "No depender únicamente del color para comunicar estados.",
            "Los montos deben utilizar tabular-nums.",
            "En mobile las cards deben ocupar normalmente el ancho disponible.",
            "Una card interactiva debe tener hover y focus visible.",
          ].map((rule) => (
            <div
              key={rule}
              className="rounded-xl border border-border px-5 py-4 text-sm leading-6 text-body"
            >
              {rule}
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
