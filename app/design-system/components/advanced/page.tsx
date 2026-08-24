"use client";

import {
  useState,
} from "react";

import {
  FileText,
  Mail,
} from "lucide-react";

import CodeBlock from "@/components/design-system/CodeBlock";
import ComponentExample from "@/components/design-system/ComponentExample";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

import {
  KivoButton,
  KivoDocumentCard,
  KivoDocumentUploader,
  KivoLoanSummary,
  KivoModal,
  KivoMoneyInput,
  KivoOTPInput,
  KivoPasswordInput,
  KivoPhoneInput,
  KivoProfileField,
  KivoSelect,
  KivoSkeleton,
  KivoStepper,
} from "@/components/ui/kivo";

const selectOptions = [
  {
    value: "LA_PAZ",
    label: "La Paz",
  },
  {
    value: "EL_ALTO",
    label: "El Alto",
  },
];

export default function AdvancedComponentsPage() {
  const [
    city,
    setCity,
  ] = useState("");

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Advanced Components"
        description="Componentes especializados para los flujos reales de onboarding y perfil de Kivo."
      />

      <ComponentExample
        title="KivoSelect"
        code={`<KivoSelect
  label="Ciudad"
  placeholder="Selecciona tu ciudad"
  value={city}
  onValueChange={setCity}
  options={[
    {
      value: "LA_PAZ",
      label: "La Paz",
    },
    {
      value: "EL_ALTO",
      label: "El Alto",
    },
  ]}
/>`}
      >
        <div className="max-w-md">
          <KivoSelect
            label="Ciudad"
            placeholder="Selecciona tu ciudad"
            value={city}
            onValueChange={setCity}
            options={selectOptions}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoMoneyInput"
        code={`<KivoMoneyInput
  label="Ingreso mensual"
  placeholder="Bs 0"
  helper="Ingresa tu ingreso promedio mensual."
/>`}
      >
        <div className="max-w-md">
          <KivoMoneyInput
            label="Ingreso mensual"
            placeholder="Bs 0"
            helper="Ingresa tu ingreso promedio mensual."
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoPhoneInput"
        code={`<KivoPhoneInput
  label="Número de celular"
  placeholder="76543210"
  helper="Número de Bolivia."
/>`}
      >
        <div className="max-w-md">
          <KivoPhoneInput
            label="Número de celular"
            placeholder="76543210"
            helper="Número de Bolivia."
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoPasswordInput"
        code={`<KivoPasswordInput
  label="Contraseña"
  placeholder="Ingresa tu contraseña"
/>`}
      >
        <div className="max-w-md">
          <KivoPasswordInput
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoOTPInput"
        code={`const [otp, setOtp] = useState("");

<KivoOTPInput
  value={otp}
  onChange={setOtp}
  length={6}
/>`}
      >
        <KivoOTPInput
          value={otp}
          onChange={setOtp}
        />
      </ComponentExample>

      <ComponentExample
        title="KivoModal"
        code={`const [
  open,
  setOpen,
] = useState(false);

<KivoButton
  onClick={() => setOpen(true)}
>
  Abrir modal
</KivoButton>

<KivoModal
  open={open}
  onClose={() => setOpen(false)}
  title="¿Deseas salir?"
  description="Tu información guardada se conservará."
  footer={
    <>
      <KivoButton
        variant="secondary"
        onClick={() => setOpen(false)}
      >
        Cancelar
      </KivoButton>

      <KivoButton
        onClick={() => setOpen(false)}
      >
        Salir
      </KivoButton>
    </>
  }
/>`}
      >
        <KivoButton
          onClick={() =>
            setModalOpen(true)
          }
        >
          Abrir modal
        </KivoButton>

        <KivoModal
          open={modalOpen}
          onClose={() =>
            setModalOpen(false)
          }
          title="¿Deseas salir?"
          description="Tu información guardada se conservará."
          footer={
            <>
              <KivoButton
                variant="secondary"
                onClick={() =>
                  setModalOpen(false)
                }
              >
                Cancelar
              </KivoButton>

              <KivoButton
                onClick={() =>
                  setModalOpen(false)
                }
              >
                Salir
              </KivoButton>
            </>
          }
        />
      </ComponentExample>

      <ComponentExample
        title="KivoStepper"
        code={`<KivoStepper
  steps={[
    {
      label: "Tus datos",
      state: "completed",
    },
    {
      label: "Tus finanzas",
      state: "completed",
    },
    {
      label: "Elige tu préstamo",
      state: "current",
    },
    {
      label: "Más sobre ti",
      state: "pending",
    },
  ]}
/>`}
      >
        <div className="max-w-md">
          <KivoStepper
            steps={[
              {
                label: "Tus datos",
                state: "completed",
              },
              {
                label: "Tus finanzas",
                state: "completed",
              },
              {
                label: "Elige tu préstamo",
                state: "current",
              },
              {
                label: "Más sobre ti",
                state: "pending",
              },
              {
                label: "Tus documentos",
                state: "pending",
              },
              {
                label: "Resumen",
                state: "pending",
              },
            ]}
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoDocumentUploader"
        code={`<KivoDocumentUploader
  title="Sube tu carnet"
  description="PDF, JPG o PNG"
  onFileSelect={(file) => {
    console.log(file);
  }}
/>`}
      >
        <div className="max-w-xl">
          <KivoDocumentUploader
            title="Sube tu carnet"
            description="PDF, JPG o PNG"
            icon={
              <FileText size={22} />
            }
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoDocumentCard"
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
        title="KivoLoanSummary"
        code={`<KivoLoanSummary
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
/>`}
      >
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
      </ComponentExample>

      <ComponentExample
        title="KivoProfileField"
        code={`<KivoProfileField
  label="Correo electrónico"
  value={
    <span className="flex items-center gap-2">
      <Mail size={16} />
      usuario@ejemplo.com
    </span>
  }
/>`}
      >
        <div className="grid max-w-xl gap-5 rounded-2xl border border-border bg-white p-6 md:grid-cols-2">
          <KivoProfileField
            label="Nombre completo"
            value="Usuario Kivo"
          />

          <KivoProfileField
            label="Correo electrónico"
            value={
              <span className="flex items-center gap-2">
                <Mail size={16} />
                usuario@ejemplo.com
              </span>
            }
          />

          <KivoProfileField
            label="Empresa"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="KivoSkeleton"
        code={`<div className="space-y-3">
  <KivoSkeleton className="h-4 w-32" />
  <KivoSkeleton className="h-8 w-52" />
  <KivoSkeleton className="h-4 w-full" />
</div>`}
      >
        <div className="max-w-md space-y-3 rounded-2xl border border-border bg-white p-6">
          <KivoSkeleton className="h-4 w-32" />
          <KivoSkeleton className="h-8 w-52" />
          <KivoSkeleton className="h-4 w-full" />
          <KivoSkeleton className="h-4 w-4/5" />
        </div>
      </ComponentExample>

      <DocsSection title="Importación">
        <CodeBlock
          code={`import {
  KivoDocumentCard,
  KivoDocumentUploader,
  KivoLoanSummary,
  KivoModal,
  KivoMoneyInput,
  KivoOTPInput,
  KivoPasswordInput,
  KivoPhoneInput,
  KivoProfileField,
  KivoSelect,
  KivoSkeleton,
  KivoStepper,
} from "@/components/ui/kivo";`}
        />
      </DocsSection>
    </>
  );
}
