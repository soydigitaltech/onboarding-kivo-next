"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useOnboardingStore, type DatosDocumentos } from "@/store/onboarding";
import { DocumentoSlot, documentoEstaSubido, type DocConfig } from "./DocumentoSlot";

// TODO: confirmar con Kivo la URL definitiva del PDF de autorización BIC.
const DOCUMENTOS_CONFIG: DocConfig[] = [
  {
    key: "autorizacionBic",
    titulo: "Autorización BIC firmada",
    descripcion:
      "Documento firmado que autoriza la consulta de tu información.",
    destacado: true,
    pasos: [
      "Descarga el documento",
      "Fírmalo a mano",
      "Sube la foto o PDF aquí",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
    descargaUrl: "/documents/autorizacion-bic-kivo.pdf",
  },
  {
    key: "ciAnverso",
    titulo: "Carnet de identidad (Anverso)",
    descripcion: "Foto de la parte frontal de tu carnet.",
    accept: ".jpg,.jpeg,.png",
  },
  {
    key: "ciReverso",
    titulo: "Carnet de identidad (Reverso)",
    descripcion: "Foto de la parte trasera de tu carnet.",
    accept: ".jpg,.jpeg,.png",
  },
  {
    key: "selfie",
    titulo: "Selfie",
    descripcion:
      "Foto tuya sosteniendo tu carnet de identidad, con el rostro claramente visible.",
    accept: ".jpg,.jpeg,.png",
  },
];

type DocKey = DocConfig["key"];

export function DocumentosForm() {
  const guardados = useOnboardingStore((s) => s.datosDocumentos);
  const setDatosDocumentos = useOnboardingStore((s) => s.setDatosDocumentos);
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);
  const editStep = useOnboardingStore((s) => s.editStep);

  const [archivos, setArchivos] = useState<Record<DocKey, File | null>>({
    autorizacionBic: null,
    ciAnverso: null,
    ciReverso: null,
    selfie: null,
  });

  const [removidos, setRemovidos] = useState<Record<DocKey, boolean>>({
    autorizacionBic: false,
    ciAnverso: false,
    ciReverso: false,
    selfie: false,
  });

  const estadoSubidos = DOCUMENTOS_CONFIG.map((cfg) =>
    documentoEstaSubido(
      archivos[cfg.key],
      guardados?.[cfg.key],
      removidos[cfg.key],
    ),
  );

  const primerIncompleto = estadoSubidos.findIndex((v) => !v);
  const limite =
    primerIncompleto === -1 ? DOCUMENTOS_CONFIG.length : primerIncompleto;

  const todoCompleto = primerIncompleto === -1;

  const onSelect = (key: DocKey, file: File) => {
    setArchivos((prev) => ({ ...prev, [key]: file }));
    setRemovidos((prev) => ({ ...prev, [key]: false }));
  };

  const onRemove = (key: DocKey) => {
    setArchivos((prev) => ({ ...prev, [key]: null }));
    setRemovidos((prev) => ({ ...prev, [key]: true }));
  };

  const onContinuar = () => {
    if (!todoCompleto) return;

    const datos = {} as DatosDocumentos;

    for (const cfg of DOCUMENTOS_CONFIG) {
      const archivo = archivos[cfg.key];

      if (archivo) {
        datos[cfg.key] = {
          nombre: archivo.name,
          tamanoBytes: archivo.size,
          tipo: archivo.type || "desconocido",
          subidoEn: new Date().toISOString(),
        };
      } else if (!removidos[cfg.key] && guardados?.[cfg.key]) {
        datos[cfg.key] = guardados[cfg.key];
      } else {
        datos[cfg.key] = null;
      }
    }

    setDatosDocumentos(datos);
    completeAndAdvance("carga-documentos");
  };

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Sube los 4 archivos requeridos, en orden. Asegúrate de que estén
        legibles y en los formatos permitidos.
      </p>

      <div className="flex flex-col gap-4">
        {DOCUMENTOS_CONFIG.map((cfg, index) => (
          <DocumentoSlot
            key={cfg.key}
            config={cfg}
            file={archivos[cfg.key]}
            metaGuardada={guardados?.[cfg.key]}
            removidoLocal={removidos[cfg.key]}
            locked={index > limite}
            onSelect={(file) => onSelect(cfg.key, file)}
            onRemove={() => onRemove(cfg.key)}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => editStep("informacion-complementaria")}
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
          <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}