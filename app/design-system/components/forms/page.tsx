import { AlertCircle, Eye, Mail } from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import ComponentExample from "@/components/design-system/ComponentExample";

const inputCode = `<label className="block">
  <span className="
    mb-2 block
    text-sm font-semibold text-ink
  ">
    Nombre completo
  </span>

  <input
    type="text"
    placeholder="Escribe tu nombre"
    className="
      w-full rounded-xl
      border border-border
      bg-white px-4 py-3
      text-ink outline-none
      placeholder:text-placeholder
      transition-colors
      focus:border-primary
      focus:ring-2
      focus:ring-primary/10
    "
  />
</label>`;

const errorCode = `<label className="block">
  <span className="
    mb-2 block
    text-sm font-semibold text-ink
  ">
    Correo electrónico
  </span>

  <input
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
    className="
      w-full rounded-xl
      border border-error
      bg-white px-4 py-3
      outline-none
    "
  />

  <span
    id="email-error"
    className="
      mt-2 flex items-center gap-1.5
      text-xs text-error
    "
  >
    Ingresa un correo válido.
  </span>
</label>`;

const moneyCode = `import { NumericFormat } from "react-number-format";

<NumericFormat
  thousandSeparator="."
  decimalSeparator=","
  decimalScale={2}
  allowNegative={false}
  prefix="Bs "
  placeholder="Bs 0"
  className="
    w-full rounded-xl
    border border-border
    bg-white px-4 py-3
    outline-none
    focus:border-primary
  "
/>`;

export default function FormsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Forms & Inputs"
        description="Los formularios son el núcleo del onboarding. Label, control, ayuda, validación y error deben mantener una estructura consistente."
      />

      <ComponentExample
        title="Input estándar"
        code={inputCode}
      >
        <label className="block max-w-md">
          <span className="mb-2 block text-sm font-semibold text-ink">
            Nombre completo
          </span>

          <input
            placeholder="Escribe tu nombre"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </label>
      </ComponentExample>

      <ComponentExample
        title="Con icono"
        code={`import { Mail } from "lucide-react";

<div className="relative">
  <Mail
    size={18}
    className="
      absolute left-4 top-1/2
      -translate-y-1/2 text-muted
    "
  />

  <input
    type="email"
    className="
      w-full rounded-xl
      border border-border
      py-3 pl-11 pr-4
    "
  />
</div>`}
      >
        <div className="relative max-w-md">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 outline-none focus:border-primary"
          />
        </div>
      </ComponentExample>

      <ComponentExample
        title="Estado error"
        code={errorCode}
      >
        <label className="block max-w-md">
          <span className="mb-2 block text-sm font-semibold">
            Correo electrónico
          </span>

          <input
            defaultValue="correo@"
            className="w-full rounded-xl border border-error bg-white px-4 py-3 outline-none"
          />

          <span className="mt-2 flex items-center gap-1.5 text-xs text-error">
            <AlertCircle size={14} />
            Ingresa un correo válido.
          </span>
        </label>
      </ComponentExample>

      <ComponentExample
        title="Password"
        code={`<div className="relative">
  <input
    type="password"
    className="
      w-full rounded-xl
      border border-border
      px-4 py-3 pr-12
    "
  />

  <button
    type="button"
    aria-label="Mostrar contraseña"
    className="
      absolute right-3 top-1/2
      -translate-y-1/2
    "
  >
    <Eye size={18} />
  </button>
</div>`}
      >
        <div className="relative max-w-md">
          <input
            type="password"
            defaultValue="12345678"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 outline-none"
          />

          <button
            type="button"
            aria-label="Mostrar contraseña"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted"
          >
            <Eye size={18} />
          </button>
        </div>
      </ComponentExample>

      <ComponentExample
        title="Monto"
        description="Para montos utilizar react-number-format y mantener el formato financiero consistente."
        code={moneyCode}
      >
        <div className="max-w-md">
          <div className="mb-2 text-sm font-semibold">
            Ingreso mensual
          </div>

          <div className="rounded-xl border border-border bg-white px-4 py-3 font-semibold tabular-nums">
            Bs 8.500,00
          </div>
        </div>
      </ComponentExample>

      <DocsSection title="Estados obligatorios">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Default",
            "Focus",
            "Filled",
            "Error",
            "Disabled",
            "Readonly",
            "Loading",
            "Success",
          ].map((state) => (
            <div
              key={state}
              className="rounded-xl border border-border bg-white p-4 text-sm font-semibold"
            >
              {state}
            </div>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
