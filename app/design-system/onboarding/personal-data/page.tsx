"use client";

import {
  useState,
} from "react";

import {
  ArrowRight,
} from "lucide-react";

import ComponentExample from "@/components/design-system/ComponentExample";
import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";

import {
  KivoAffixedInput,
  KivoBusinessNotice,
  KivoButton,
  KivoInput,
  KivoSelect,
  kivoAffixedInputClassName,
} from "@/components/ui/kivo";


const ciudades = [
  {
    value: "LA_PAZ",
    label: "La Paz",
  },
  {
    value: "EL_ALTO",
    label: "El Alto",
  },
];


export default function PersonalDataDesignSystemPage() {
  const [
    ciudad,
    setCiudad,
  ] = useState("");


  return (
    <>
      <DocsHeader
        eyebrow="Onboarding"
        title="Datos personales"
        description="Implementación oficial de los controles utilizados en el primer paso del onboarding de Kivo."
      />


      <ComponentExample
        title="Nombre completo"
        code={`<KivoInput
  label="Nombre completo"
  placeholder="Ej. Sara Valentina Gonzales Mamani"
  {...register("nombreCompleto")}
/>`}
      >
        <div className="max-w-xl">
          <KivoInput
            label="Nombre completo"
            placeholder="Ej. Sara Valentina Gonzales Mamani"
          />
        </div>
      </ComponentExample>


      <ComponentExample
        title="Carnet"
        code={`<KivoInput
  label="Carnet de identidad"
  inputMode="numeric"
  placeholder="Ej. 6084527"
/>`}
      >
        <div className="max-w-md">
          <KivoInput
            label="Carnet de identidad"
            inputMode="numeric"
            placeholder="Ej. 6084527"
          />
        </div>
      </ComponentExample>


      <ComponentExample
        title="Celular con prefijo"
        code={`<div>
  <div className="
    mb-1.5 text-sm
    font-bold text-ink
  ">
    Número de celular
  </div>

  <KivoAffixedInput
    prefix="+591"
  >
    <input
      type="tel"
      maxLength={8}
      placeholder="70000000"
      className={
        kivoAffixedInputClassName
      }
    />
  </KivoAffixedInput>
</div>`}
      >
        <div className="max-w-md">
          <div className="mb-1.5 text-sm font-bold text-ink">
            Número de celular
          </div>

          <KivoAffixedInput
            prefix="+591"
          >
            <input
              type="tel"
              maxLength={8}
              placeholder="70000000"
              className={
                kivoAffixedInputClassName
              }
            />
          </KivoAffixedInput>
        </div>
      </ComponentExample>


      <ComponentExample
        title="Ciudad"
        code={`<KivoSelect
  label="Ciudad"
  value={ciudad}
  onChange={setCiudad}
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
            value={ciudad}
            onChange={setCiudad}
            options={ciudades}
          />
        </div>
      </ComponentExample>


      <ComponentExample
        title="Número con prefijo"
        code={`<KivoAffixedInput
  prefix="N.º"
>
  <input
    inputMode="numeric"
    placeholder="Ej. 2"
    className={
      kivoAffixedInputClassName
    }
  />
</KivoAffixedInput>`}
      >
        <div className="max-w-sm">
          <div className="mb-1.5 text-sm font-bold text-ink">
            Número de dependientes
          </div>

          <KivoAffixedInput
            prefix="N.º"
          >
            <input
              inputMode="numeric"
              placeholder="Ej. 2"
              className={
                kivoAffixedInputClassName
              }
            />
          </KivoAffixedInput>
        </div>
      </ComponentExample>


      <ComponentExample
        title="Cobertura"
        code={`<KivoBusinessNotice>
  Por ahora Kivo atiende
  solicitudes únicamente en
  La Paz y El Alto.
</KivoBusinessNotice>`}
      >
        <div className="max-w-xl">
          <KivoBusinessNotice>
            Por ahora Kivo atiende solicitudes únicamente en{" "}
            <strong>
              La Paz y El Alto
            </strong>
            .
          </KivoBusinessNotice>
        </div>
      </ComponentExample>


      <ComponentExample
        title="Siguiente paso"
        code={`<KivoButton
  type="submit"
  iconRight={
    <ArrowRight size={18} />
  }
>
  Siguiente paso
</KivoButton>`}
      >
        <KivoButton
          iconRight={
            <ArrowRight
              size={18}
            />
          }
        >
          Siguiente paso
        </KivoButton>
      </ComponentExample>


      <DocsSection title="Regla de implementación">
        <div className="rounded-2xl border border-primary/20 bg-surface-blue p-6">
          <p className="text-sm leading-7 text-body">
            Los componentes visuales provienen de{" "}
            <code className="font-semibold text-primary-dark">
              @/components/ui/kivo
            </code>
            , mientras que la lógica de validación progresiva, React Hook Form, Zod y Zustand permanece dentro del componente de dominio.
          </p>
        </div>
      </DocsSection>
    </>
  );
}
