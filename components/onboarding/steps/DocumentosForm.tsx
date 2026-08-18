"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useOnboardingStore, type DatosDocumentos } from "@/store/onboarding";
import { DocumentoSlot, documentoEstaSubido, type DocConfig } from "./DocumentoSlot";

// TODO: confirmar con Kivo la URL definitiva del PDF de autorización BIC.
const DOCUMENTOS_CONFIG: DocConfig[] = [
 // 1. Carnet de identidad
 {
 key: "ciAnverso",
 titulo: "Carnet de identidad — parte frontal",
 descripcion:
 "Sube una foto clara de la parte donde aparecen tu fotografía y tus datos personales.",
 ejemploUrl: "/carnet.png",
 ejemploAlt: "Ejemplo de la parte frontal del carnet de identidad",
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
 "Sube una foto clara de la parte posterior de tu carnet de identidad.",
 ejemploUrl: "/carnetes.png",
 ejemploAlt: "Ejemplo de la parte posterior del carnet de identidad",
 recomendaciones: [
 "No cortes los bordes del carnet.",
 "Evita cubrir los datos con los dedos.",
 "La imagen debe estar enfocada.",
 ],
 accept: ".jpg,.jpeg,.png",
 },

 // 2. Fotografía / selfie
 {
 key: "selfie",
 titulo: "Fotografía / selfie",
 descripcion:
 "Tómate una selfie sosteniendo tu carnet. Tu rostro y el documento deben verse claramente.",
 ejemploUrl: "/selfie.png",
 ejemploAlt: "Ejemplo de una selfie sosteniendo el carnet",
 recomendaciones: [
 "Mira directamente a la cámara.",
 "No uses gorra, lentes oscuros ni barbijo.",
 "Sostén el carnet sin cubrir tu rostro.",
 "Busca un lugar con buena iluminación.",
 ],
 accept: ".jpg,.jpeg,.png",
 },

 // 3. Autorización
 {
 key: "autorizacionBic",
 titulo: "Autorización para consulta y uso de información",
 descripcion:
 "Con este documento autorizas a Kivo a consultar la información necesaria para evaluar tu solicitud.",
 destacado: true,
 pasos: [
 "Descarga el documento",
 "Fírmalo con tu puño y letra",
 "Sube una foto o el PDF firmado",
 ],
 ejemploUrl: "/documents/examples/autorizacion-firmada.webp",
 ejemploAlt: "Ejemplo de autorización firmada",
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
 Completa los documentos requeridos: tu carnet de identidad, una
 selfie y la autorización. Asegúrate de que todo sea legible.
 </p>

 <div className="flex flex-col gap-4">
 {DOCUMENTOS_CONFIG.map((cfg, index) => (
 <DocumentoSlot
 key={cfg.key}
 config={cfg}
 file={archivos[cfg.key]}
 metaGuardada={guardados?.[cfg.key]}
 removidoLocal={removidos[cfg.key]}
 locked={
          index > limite &&
          !(
            cfg.key === "autorizacionBic" &&
            DOCUMENTOS_CONFIG[limite]?.key === "selfie"
          )
        }
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