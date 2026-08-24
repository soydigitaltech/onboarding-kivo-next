import ComponentExample from "@/components/design-system/ComponentExample";
import DocsHeader from "@/components/design-system/DocsHeader";

import {
  KivoButton,
  KivoResultState,
} from "@/components/ui/kivo";

export default function ResultsPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Components"
        title="Result States"
        description="Estados finales o intermedios que comunican claramente el resultado de una acción o proceso."
      />

      <ComponentExample
        title="Success"
        code={`<KivoResultState
  variant="success"
  title="Solicitud enviada"
  description="
    Recibimos tu solicitud.
    Te avisaremos cuando tengamos novedades.
  "
  action={
    <KivoButton>
      Ir al inicio
    </KivoButton>
  }
/>`}
      >
        <KivoResultState
          variant="success"
          title="Solicitud enviada"
          description="Recibimos tu solicitud. Te avisaremos cuando tengamos novedades."
          action={
            <KivoButton>
              Ir al inicio
            </KivoButton>
          }
        />
      </ComponentExample>

      <ComponentExample
        title="Pending"
        code={`<KivoResultState
  variant="pending"
  title="Estamos revisando tu información"
  description="
    Este proceso puede requerir
    validaciones adicionales.
  "
/>`}
      >
        <KivoResultState
          variant="pending"
          title="Estamos revisando tu información"
          description="Este proceso puede requerir validaciones adicionales."
        />
      </ComponentExample>
    </>
  );
}
