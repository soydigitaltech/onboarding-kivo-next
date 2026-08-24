import { LoaderCircle } from "lucide-react";

import DocsHeader from "@/components/design-system/DocsHeader";
import DocsSection from "@/components/design-system/DocsSection";
import ComponentExample from "@/components/design-system/ComponentExample";

export default function LoadingPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Loading"
        description="Indicadores de carga para comunicar que una acción o contenido se encuentra en proceso."
      />

      <ComponentExample
        title="Spinner"
        code={`import { LoaderCircle } from "lucide-react";

<LoaderCircle
  size={22}
  className="animate-spin text-primary"
/>`}
      >
        <LoaderCircle
          size={24}
          className="animate-spin text-primary"
        />
      </ComponentExample>

      <ComponentExample
        title="Skeleton"
        code={`<div className="animate-pulse">
  <div className="
    h-4 w-32 rounded
    bg-border
  " />

  <div className="
    mt-3 h-8 w-48 rounded
    bg-border
  " />
</div>`}
      >
        <div className="w-full max-w-sm animate-pulse rounded-2xl border border-border bg-white p-5">
          <div className="h-3 w-32 rounded bg-border" />
          <div className="mt-3 h-7 w-48 rounded bg-border" />
          <div className="mt-5 h-3 w-full rounded bg-border-soft" />
          <div className="mt-2 h-3 w-4/5 rounded bg-border-soft" />
        </div>
      </ComponentExample>

      <DocsSection title="Regla">
        <p className="leading-7 text-body">
          Utilizar Skeleton cuando la estructura final del contenido es
          conocida. Utilizar Spinner para procesos breves o acciones
          puntuales.
        </p>
      </DocsSection>
    </>
  );
}
