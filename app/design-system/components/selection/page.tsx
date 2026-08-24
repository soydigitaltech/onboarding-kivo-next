import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import ComponentExample from "@/components/design-system/ComponentExample";

const radioCode = `<fieldset>
  <legend className="
    mb-3 text-sm font-semibold text-ink
  ">
    ¿Tienes una segunda actividad?
  </legend>

  <div className="flex gap-3">
    <label className="
      flex cursor-pointer items-center gap-2
      rounded-xl border border-primary
      bg-surface-blue px-4 py-3
    ">
      <input
        type="radio"
        name="segundaActividad"
        value="SI"
      />
      Sí
    </label>

    <label className="
      flex cursor-pointer items-center gap-2
      rounded-xl border border-border
      bg-white px-4 py-3
    ">
      <input
        type="radio"
        name="segundaActividad"
        value="NO"
      />
      No
    </label>
  </div>
</fieldset>`;

const checkboxCode = `<label className="
  flex cursor-pointer items-start gap-3
">
  <input
    type="checkbox"
    className="mt-1 h-4 w-4"
  />

  <span className="text-sm leading-6 text-body">
    Confirmo que la información proporcionada
    es correcta.
  </span>
</label>`;

export default function SelectionPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Selection"
        description="Radio, checkbox y controles de selección utilizados en formularios y decisiones del onboarding."
      />

      <ComponentExample
        title="Radio"
        description="Utilizar para pocas opciones mutuamente excluyentes."
        code={radioCode}
      >
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">
            ¿Tienes una segunda actividad?
          </legend>

          <div className="flex gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-primary bg-surface-blue px-4 py-3 font-semibold text-primary-dark">
              <input
                type="radio"
                defaultChecked
                name="demo"
              />
              Sí
            </label>

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 font-semibold">
              <input type="radio" name="demo" />
              No
            </label>
          </div>
        </fieldset>
      </ComponentExample>

      <ComponentExample
        title="Checkbox"
        description="Utilizar para confirmaciones o selección múltiple."
        code={checkboxCode}
      >
        <label className="flex max-w-lg cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            defaultChecked
            className="mt-1 h-4 w-4"
          />

          <span className="text-sm leading-6 text-body">
            Confirmo que la información proporcionada es correcta.
          </span>
        </label>
      </ComponentExample>

      <DocsSection title="Cuándo usar cada uno">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border p-5">
            <strong>Radio</strong>
            <p className="mt-2 text-sm leading-6 text-body">
              Elegir una opción entre varias.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-5">
            <strong>Checkbox</strong>
            <p className="mt-2 text-sm leading-6 text-body">
              Confirmar o seleccionar múltiples opciones.
            </p>
          </div>

          <div className="rounded-2xl border border-border p-5">
            <strong>Switch</strong>
            <p className="mt-2 text-sm leading-6 text-body">
              Reservado para configuraciones con efecto inmediato.
            </p>
          </div>
        </div>
      </DocsSection>
    </>
  );
}
