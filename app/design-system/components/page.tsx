import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Edit3,
  FileText,
  Mail,
  Upload,
} from "lucide-react";

import CodeBlock from "@/components/design-system/CodeBlock";
import ComponentExample from "@/components/design-system/ComponentExample";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

import {
  KivoAlert,
  KivoBadge,
  KivoButton,
  KivoCard,
  KivoCheckbox,
  KivoEmptyState,
  KivoInput,
  KivoRadioCard,
  KivoSection,
  KivoTextarea,
} from "@/components/ui/kivo";

const importCode = `import {
  KivoAlert,
  KivoBadge,
  KivoButton,
  KivoCard,
  KivoCheckbox,
  KivoEmptyState,
  KivoInput,
  KivoRadioCard,
  KivoSection,
  KivoTextarea,
} from "@/components/ui/kivo";`;

export default function ComponentsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Core Components"
        description="Componentes oficiales y reutilizables de Kivo. El frontend debe preferir estos componentes sobre implementar estilos manuales repetidos."
      />

      <DocsSection
        title="Importación"
        description="Todos los componentes core pueden importarse desde un único punto."
      >
        <CodeBlock code={importCode} />
      </DocsSection>

      <ComponentExample
        title="KivoButton"
        description="Botón oficial para acciones primarias, secundarias, ghost y destructivas."
        code={`import {
  KivoButton
} from "@/components/ui/kivo";

<KivoButton
  variant="primary"
  iconRight={
    <ArrowRight size={18} />
  }
>
  Continuar
</KivoButton>`}
      >
        <div className="flex flex-wrap gap-3">
          <KivoButton
            iconRight={
              <ArrowRight size={18} />
            }
          >
            Continuar
          </KivoButton>

          <KivoButton variant="secondary">
            Volver
          </KivoButton>

          <KivoButton variant="ghost">
            Ver detalle
          </KivoButton>

          <KivoButton variant="danger">
            Eliminar
          </KivoButton>

          <KivoButton loading>
            Guardando
          </KivoButton>
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoInput"
        description="Input con label, helper, errores, required e iconos."
        code={`import {
  KivoInput
} from "@/components/ui/kivo";

<KivoInput
  label="Correo electrónico"
  type="email"
  placeholder="correo@ejemplo.com"
  helper="Usaremos este correo para contactarte."
  leadingIcon={
    <Mail size={18} />
  }
/>`}
      >
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <KivoInput
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            helper="Usaremos este correo para contactarte."
            leadingIcon={
              <Mail size={18} />
            }
          />

          <KivoInput
            label="Número de celular"
            defaultValue="7654"
            error="Ingresa un número de celular válido."
            required
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoTextarea"
        description="Texto multilínea con la misma anatomía visual que los inputs."
        code={`<KivoTextarea
  label="Observaciones"
  placeholder="Escribe aquí..."
  helper="Máximo 500 caracteres."
  maxLength={500}
/>`}
      >
        <div className="max-w-xl">
          <KivoTextarea
            label="Observaciones"
            placeholder="Escribe aquí..."
            helper="Máximo 500 caracteres."
            maxLength={500}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoCard"
        description="Superficie base sin sombras. Disponible en default, muted, selected e interactive."
        code={`<KivoCard variant="selected">
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
        <div className="grid gap-4 md:grid-cols-3">
          <KivoCard>
            <div className="text-sm text-muted">
              Monto solicitado
            </div>

            <div className="mt-2 text-2xl font-bold tabular-nums">
              Bs 15.000
            </div>
          </KivoCard>

          <KivoCard variant="selected">
            <div className="text-sm text-primary-dark">
              Cuota seleccionada
            </div>

            <div className="mt-2 text-2xl font-bold tabular-nums">
              Bs 1.245
            </div>
          </KivoCard>

          <KivoCard variant="muted">
            <div className="text-sm text-muted">
              Plazo
            </div>

            <div className="mt-2 text-2xl font-bold">
              18 meses
            </div>
          </KivoCard>
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoAlert"
        description="Feedback persistente que debe permanecer visible mientras la información sea relevante."
        code={`<KivoAlert
  variant="warning"
  title="Documento pendiente"
>
  Sube tu extracto bancario
  para continuar.
</KivoAlert>`}
      >
        <div className="space-y-3">
          <KivoAlert
            variant="info"
            title="Información"
          >
            Revisa tus datos antes de continuar.
          </KivoAlert>

          <KivoAlert
            variant="success"
            title="Guardado correctamente"
          >
            Tus cambios fueron guardados.
          </KivoAlert>

          <KivoAlert
            variant="warning"
            title="Documento pendiente"
          >
            Sube tu extracto bancario para continuar.
          </KivoAlert>

          <KivoAlert
            variant="error"
            title="No pudimos guardar"
          >
            Revisa tu conexión e inténtalo nuevamente.
          </KivoAlert>
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoBadge"
        description="Representación compacta de estados."
        code={`<KivoBadge variant="approved">
  Aprobado
</KivoBadge>`}
      >
        <div className="flex flex-wrap gap-3">
          <KivoBadge variant="approved">
            Aprobado
          </KivoBadge>

          <KivoBadge variant="pending">
            Pendiente
          </KivoBadge>

          <KivoBadge variant="processing">
            Procesando
          </KivoBadge>

          <KivoBadge variant="observed">
            Observado
          </KivoBadge>

          <KivoBadge variant="rejected">
            Rechazado
          </KivoBadge>
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoCheckbox"
        code={`<KivoCheckbox
  label="Confirmo la información"
  description="
    Declaro que los datos proporcionados
    son correctos.
  "
/>`}
      >
        <div className="max-w-xl">
          <KivoCheckbox
            defaultChecked
            label="Confirmo la información"
            description="Declaro que los datos proporcionados son correctos."
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoRadioCard"
        description="Ideal para decisiones importantes del onboarding con pocas opciones."
        code={`<KivoRadioCard
  name="actividad"
  value="SI"
  checked={true}
  title="Sí"
  description="
    Tengo ingresos adicionales.
  "
/>`}
      >
        <div className="grid max-w-3xl gap-3 md:grid-cols-2">
          <KivoRadioCard
            name="actividad-demo"
            value="SI"
            checked
            readOnly
            title="Sí"
            description="Tengo ingresos adicionales."
          />

          <KivoRadioCard
            name="actividad-demo"
            value="NO"
            readOnly
            title="No"
            description="No tengo otra fuente de ingresos."
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoSection"
        description="Base para las secciones del perfil."
        code={`<KivoSection
  title="Información personal"
  description="
    Datos principales de tu cuenta.
  "
  action={
    <KivoButton
      variant="ghost"
      size="sm"
    >
      Editar
    </KivoButton>
  }
>
  Contenido
</KivoSection>`}
      >
        <KivoSection
          title="Información personal"
          description="Datos principales de tu cuenta."
          action={
            <KivoButton
              variant="ghost"
              size="sm"
              iconLeft={
                <Edit3 size={16} />
              }
            >
              Editar
            </KivoButton>
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <div className="text-xs font-semibold text-muted">
                Nombre completo
              </div>

              <div className="mt-1 font-semibold">
                Usuario Kivo
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted">
                Celular
              </div>

              <div className="mt-1 font-semibold">
                76543210
              </div>
            </div>
          </div>
        </KivoSection>
      </ComponentExample>

      <ComponentExample
        title="KivoEmptyState"
        description="Utilizar cuando no existe contenido y existe una posible siguiente acción."
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
    <KivoButton
      iconLeft={
        <Upload size={17} />
      }
    >
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
          description="Cuando subas tus documentos podrás consultarlos desde aquí."
          action={
            <KivoButton
              iconLeft={
                <Upload size={17} />
              }
            >
              Subir documento
            </KivoButton>
          }
        />
      </ComponentExample>

      <DocsSection
        title="Regla principal"
        description="La implementación debe consumir el componente, no copiar y modificar internamente sus estilos."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <KivoAlert
            variant="success"
            title="Correcto"
          >
            <code>
              {"<KivoButton>Continuar</KivoButton>"}
            </code>
          </KivoAlert>

          <KivoAlert
            variant="error"
            title="Evitar"
          >
            Crear un nuevo botón con veinte clases Tailwind porque una pantalla necesita un CTA.
          </KivoAlert>
        </div>
      </DocsSection>

      <DocsSection title="Componentes disponibles">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "KivoButton",
            "KivoInput",
            "KivoTextarea",
            "KivoCard",
            "KivoAlert",
            "KivoBadge",
            "KivoCheckbox",
            "KivoRadioCard",
            "KivoSection",
            "KivoEmptyState",
          ].map((component) => (
            <div
              key={component}
              className="rounded-xl border border-border bg-white px-4 py-3 font-mono text-sm"
            >
              {component}
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Próximos componentes">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "KivoSelect",
            "KivoMoneyInput",
            "KivoOTPInput",
            "KivoModal",
            "KivoToast",
            "KivoSkeleton",
            "KivoStepper",
            "KivoDocumentUploader",
            "KivoDocumentCard",
            "KivoLoanSummary",
            "KivoProfileField",
            "KivoPageHeader",
          ].map((component) => (
            <KivoCard
              key={component}
              variant="muted"
            >
              <div className="font-mono text-sm font-semibold">
                {component}
              </div>

              <KivoBadge
                variant="neutral"
                className="mt-3"
              >
                Próximamente
              </KivoBadge>
            </KivoCard>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
