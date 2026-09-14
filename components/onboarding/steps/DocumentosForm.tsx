"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  CapturaDesktopBridge,
} from "@/components/onboarding/captura/CapturaDesktopBridge";

import {
  useOnboardingStore,
  type DatosDocumentos,
} from "@/store/onboarding";

import {
  DocumentoSlot,
  documentoEstaSubido,
  type DocConfig,
} from "./DocumentoSlot";


const DOCUMENTOS: DocConfig[] = [
  {
    key: "ciAnverso",
    titulo: "Carnet de identidad — parte frontal",
    descripcion:
      "Toma una foto clara de la parte donde aparecen tu fotografía y tus datos personales.",
    ejemploUrl: "/carnet.png",
    ejemploAlt:
      "Ejemplo de la parte frontal del carnet de identidad",
    recomendaciones: [
      "Fotografía el carnet completo.",
      "Evita reflejos y sombras.",
      "Todos los datos deben poder leerse.",
    ],
    accept: ".jpg,.jpeg,.png",
  },

  {
    key: "ciReverso",
    titulo: "Carnet de identidad — parte posterior",
    descripcion:
      "Toma una foto clara de la parte posterior de tu carnet de identidad.",
    ejemploUrl: "/carnetes.png",
    ejemploAlt:
      "Ejemplo de la parte posterior del carnet de identidad",
    recomendaciones: [
      "No cortes los bordes del carnet.",
      "Evita cubrir los datos con los dedos.",
      "La imagen debe estar enfocada.",
    ],
    accept: ".jpg,.jpeg,.png",
  },

  {
    key: "selfie",
    titulo: "Fotografía / selfie",
    descripcion:
      "Tómate una fotografía donde tu rostro pueda verse claramente.",
    ejemploUrl: "/selfie.png",
    ejemploAlt: "Ejemplo de fotografía o selfie",
    recomendaciones: [
      "Mira directamente a la cámara.",
      "Busca un lugar con buena iluminación.",
      "Evita lentes oscuros o elementos que cubran tu rostro.",
    ],
    accept: ".jpg,.jpeg,.png",
  },

  {
    key: "autorizacionBic",
    titulo: "Autorización expresa firmada",
    descripcion:
      "Descarga la autorización, fírmala y toma una foto clara del documento completo.",
    destacado: true,
    pasos: [
      "Descarga el documento",
      "Fírmalo con tu puño y letra",
      "Toma una foto del documento firmado",
    ],
    ejemploUrl:
      "/documents/examples/autorizacion-firmada.webp",
    ejemploAlt:
      "Ejemplo de autorización expresa firmada",
    recomendaciones: [
      "La firma debe verse claramente.",
      "El documento debe estar completo.",
      "No subas el documento sin firmar.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
    descargaUrl: "/AUTORIZACIOEXPRESA.pdf",
  },
];


type DocKey = DocConfig["key"];


function archivosIniciales(): Record<DocKey, File | null> {
  return {
    ciAnverso: null,
    ciReverso: null,
    selfie: null,
    autorizacionBic: null,
  };
}


function removidosIniciales(): Record<DocKey, boolean> {
  return {
    ciAnverso: false,
    ciReverso: false,
    selfie: false,
    autorizacionBic: false,
  };
}


function documentosVacios(): DatosDocumentos {
  return {
    ciAnverso: null,
    ciReverso: null,
    selfie: null,
    autorizacionBic: null,
  };
}


export function DocumentosForm() {
  const guardados = useOnboardingStore(
    (state) => state.datosDocumentos,
  );

  const setDatosDocumentos = useOnboardingStore(
    (state) => state.setDatosDocumentos,
  );

  const completeAndAdvance = useOnboardingStore(
    (state) => state.completeAndAdvance,
  );

  const editStep = useOnboardingStore(
    (state) => state.editStep,
  );

  const [archivos, setArchivos] =
    useState<Record<DocKey, File | null>>(
      archivosIniciales,
    );

  const [removidos, setRemovidos] =
    useState<Record<DocKey, boolean>>(
      removidosIniciales,
    );

  const [esDesktop, setEsDesktop] =
    useState<boolean | null>(null);

  const [
    capturaRemotaCompletada,
    setCapturaRemotaCompletada,
  ] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px)",
    );

    const actualizar = () => {
      setEsDesktop(media.matches);
    };

    actualizar();

    media.addEventListener(
      "change",
      actualizar,
    );

    return () => {
      media.removeEventListener(
        "change",
        actualizar,
      );
    };
  }, []);


  const estaSubido = (key: DocKey) =>
    documentoEstaSubido(
      archivos[key],
      guardados?.[key],
      removidos[key],
    );


  const documentosCompletos =
    esDesktop === true
      ? DOCUMENTOS.filter(
          (documento) =>
            archivos[documento.key] !== null,
        ).length
      : DOCUMENTOS.filter((documento) =>
          estaSubido(documento.key),
        ).length;

  const totalDocumentos = DOCUMENTOS.length;

  const porcentajeDocumentos = Math.round(
    (documentosCompletos / totalDocumentos) * 100,
  );

  const todoCompleto =
    documentosCompletos === totalDocumentos;


  const onSelect = (
    key: DocKey,
    file: File,
  ) => {
    setArchivos((actuales) => ({
      ...actuales,
      [key]: file,
    }));

    setRemovidos((actuales) => ({
      ...actuales,
      [key]: false,
    }));
  };


  const onRemove = (key: DocKey) => {
    setArchivos((actuales) => ({
      ...actuales,
      [key]: null,
    }));

    setRemovidos((actuales) => ({
      ...actuales,
      [key]: true,
    }));
  };


  const onContinuar = () => {
    if (!todoCompleto) return;

    const datos = documentosVacios();

    for (const documento of DOCUMENTOS) {
      const archivo =
        archivos[documento.key];

      if (archivo) {
        datos[documento.key] = {
          nombre: archivo.name,
          tamanoBytes: archivo.size,
          tipo:
            archivo.type || "desconocido",
          subidoEn:
            new Date().toISOString(),
        };

        continue;
      }

      if (
        !removidos[documento.key] &&
        guardados?.[documento.key]
      ) {
        datos[documento.key] =
          guardados[documento.key];

        continue;
      }

      datos[documento.key] = null;
    }

    setDatosDocumentos(datos);

    completeAndAdvance(
      "carga-documentos",
    );
  };


  return (
    <div>
      <div className="mb-7">
        <p className="max-w-2xl text-sm leading-6 text-body">
          Para enviar tu solicitud necesitamos
          estos cuatro documentos esenciales.
        </p>

        <div className="mt-4 rounded-[20px] bg-surface-blue px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-primary-dark">
                {documentosCompletos} de{" "}
                {totalDocumentos} documentos listos
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                Revisa que cada archivo sea claro,
                completo y legible.
              </p>
            </div>

            <span className="text-sm font-extrabold text-primary">
              {porcentajeDocumentos}%
            </span>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${porcentajeDocumentos}%`,
              }}
            />
          </div>
        </div>
      </div>


      <section>
        <div className="mb-4">
          <h3 className="text-base font-extrabold text-ink">
            Identidad y autorización
          </h3>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">
            Completa los documentos necesarios para
            validar tu identidad y autorizar la
            evaluación de tu solicitud.
          </p>
        </div>

        {esDesktop === true &&
        !capturaRemotaCompletada ? (
          <CapturaDesktopBridge
            onDocumentCaptured={(key, file) =>
              onSelect(key, file)
            }
            onSessionCompleted={() =>
              setCapturaRemotaCompletada(true)
            }
          />
        ) : null}

        <div className="flex flex-col gap-4">
          {esDesktop !== false
            ? DOCUMENTOS
                .filter(
                  (documento) =>
                    archivos[documento.key] !== null
                )
                .map((documento) => (
                  <div
                    key={documento.key}
                    className="rounded-[20px] border border-border-soft bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-extrabold text-ink">
                          {documento.titulo}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted">
                          Captura recibida desde la cámara del celular.
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-[#E8FFF6] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#04A66F]">
                        Recibido
                      </span>
                    </div>

                    <div className="mt-4 flex min-h-[96px] items-center justify-center rounded-2xl bg-[#F0FBF7]">
                      <p className="max-w-sm px-5 text-center text-xs font-bold leading-5 text-muted">
                        La captura quedó vinculada a esta sesión.
                      </p>
                    </div>
                  </div>
                ))
            : DOCUMENTOS.map((documento) => (
                <DocumentoSlot
                  key={documento.key}
                  config={documento}
                  file={
                    archivos[
                      documento.key
                    ]
                  }
                  metaGuardada={
                    guardados?.[
                      documento.key
                    ]
                  }
                  removidoLocal={
                    removidos[
                      documento.key
                    ]
                  }
                  locked={false}
                  onSelect={(file) =>
                    onSelect(
                      documento.key,
                      file,
                    )
                  }
                  onRemove={() =>
                    onRemove(
                      documento.key,
                    )
                  }
                />
              ))}
        </div>
      </section>


      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() =>
            editStep(
              "informacion-complementaria",
            )
          }
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <button
          type="button"
          onClick={onContinuar}
          disabled={!todoCompleto}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continuar con mi solicitud

          <ArrowRight
            className="h-4.5 w-4.5"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}
