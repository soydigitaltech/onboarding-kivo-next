"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
 Camera,
 CircleCheckBig,
 Download,
 FileSignature,
 FileText,
 Printer,
 ShieldCheck,
 Trash2,
 TriangleAlert,
 UploadCloud,
} from "lucide-react";
import type { DocumentoMeta } from "@/store/onboarding";

const TAMANO_MAXIMO_BYTES = 8 * 1024 * 1024; // 8 MB

export interface DocConfig {
 key: "autorizacionBic" | "ciAnverso" | "ciReverso" | "selfie";
 titulo: string;
 descripcion: string;
 accept: string;
 ayuda?: string;

 /** Documento que el usuario puede descargar o imprimir. */
 descargaUrl?: string;

 /** Resalta documentos que necesitan pasos adicionales. */
 destacado?: boolean;

 /** Pasos que el usuario debe seguir. */
 pasos?: string[];

 /** Imagen visual que muestra cómo debe verse el documento. */
 ejemploUrl?: string;
 ejemploAlt?: string;

 /** Recomendaciones para evitar cargas incorrectas. */
 recomendaciones?: string[];
}

/** Determina si un documento cuenta como cargado (vivo o restaurado de sesión). */
export function documentoEstaSubido(
 archivoLocal: File | null,
 metaGuardada: DocumentoMeta | null | undefined,
 removidoLocal: boolean,
): boolean {
 return archivoLocal !== null || (!removidoLocal && !!metaGuardada);
}

function formatBytes(bytes: number): string {
 if (bytes < 1024) return `${bytes} B`;
 if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
 return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Objeto URL para previsualizar imágenes, con limpieza automática. */
function useObjectUrl(file: File | null): string | null {
 const objectUrl = useMemo(() => {
 if (!file || !file.type.startsWith("image/")) return null;
 return URL.createObjectURL(file);
 }, [file]);

 useEffect(() => {
 return () => {
 if (objectUrl) URL.revokeObjectURL(objectUrl);
 };
 }, [objectUrl]);

 return objectUrl;
}

interface DocumentoSlotProps {
 config: DocConfig;
 file: File | null;
 metaGuardada: DocumentoMeta | null | undefined;
 removidoLocal: boolean;
 locked: boolean;
 onSelect: (file: File) => void;
 onRemove: () => void;
}

export function DocumentoSlot({
 config,
 file,
 metaGuardada,
 removidoLocal,
 locked,
 onSelect,
 onRemove,
}: DocumentoSlotProps) {
 const inputRef = useRef<HTMLInputElement>(null);
 const videoRef = useRef<HTMLVideoElement>(null);
 const streamRef = useRef<MediaStream | null>(null);

 const [isDragOver, setIsDragOver] = useState(false);
 const [errorLocal, setErrorLocal] = useState<string | null>(null);
 const [camaraAbierta, setCamaraAbierta] = useState(false);
 const [errorCamara, setErrorCamara] = useState<string | null>(null);

 const previewUrl = useObjectUrl(file);
 const estaSubido = documentoEstaSubido(file, metaGuardada, removidoLocal);

 const infoMostrada = file
 ? { nombre: file.name, tamanoBytes: file.size }
 : !removidoLocal && metaGuardada
 ? { nombre: metaGuardada.nombre, tamanoBytes: metaGuardada.tamanoBytes }
 : null;

 const extensionesAceptadas = config.accept
 .split(",")
 .map((ext) => ext.trim().toLowerCase());

 function validarYSeleccionar(nuevoArchivo: File) {
 const extension = `.${nuevoArchivo.name.split(".").pop()?.toLowerCase()}`;

 if (!extensionesAceptadas.includes(extension)) {
 setErrorLocal(
 `Formato no permitido. Usa: ${config.accept.replaceAll(".", "")}.`,
 );
 return;
 }

 if (nuevoArchivo.size > TAMANO_MAXIMO_BYTES) {
 setErrorLocal("El archivo supera el tamaño máximo de 8 MB.");
 return;
 }

 setErrorLocal(null);
 onSelect(nuevoArchivo);
 }

 function handleDrop(event: DragEvent<HTMLLabelElement>) {
 event.preventDefault();
 setIsDragOver(false);
 if (locked) return;

 const nuevoArchivo = event.dataTransfer.files?.[0];
 if (nuevoArchivo) validarYSeleccionar(nuevoArchivo);
 }

 function detenerCamara() {
 const stream = streamRef.current;

 if (stream) {
 stream.getTracks().forEach((track) => track.stop());
 streamRef.current = null;
 }

 if (videoRef.current) {
 videoRef.current.srcObject = null;
 }
 }

 async function abrirCamara() {
 if (config.key !== "selfie") return;

 setErrorCamara(null);

 // MOCK: usamos la imagen de ejemplo como una selfie válida.
 try {
   const response = await fetch("/selfie.png");

   if (!response.ok) {
     throw new Error("No se pudo cargar la selfie mock.");
   }

   const blob = await response.blob();

   const mockFile = new File(
     [blob],
     "selfie.png",
     { type: blob.type || "image/png" },
   );

   onSelect(mockFile);
 } catch {
   setErrorCamara(
     "No pudimos cargar la selfie de demostración.",
   );
 }

 return;

 if (!navigator.mediaDevices?.getUserMedia) {
 setErrorCamara(
 "Tu navegador no permite acceder a la cámara. Puedes subir una foto desde tu dispositivo.",
 );
 return;
 }

 try {
 const stream = await navigator.mediaDevices.getUserMedia({
 video: {
 facingMode: "user",
 width: { ideal: 1280 },
 height: { ideal: 720 },
 },
 audio: false,
 });

 streamRef.current = stream;
 setCamaraAbierta(true);

 requestAnimationFrame(() => {
 if (videoRef.current) {
 videoRef.current.srcObject = stream;
 void videoRef.current.play();
 }
 });
 } catch {
 setErrorCamara(
 "No pudimos acceder a tu cámara. Revisa los permisos del navegador e inténtalo nuevamente.",
 );
 }
 }

 function cerrarCamara() {
 detenerCamara();
 setCamaraAbierta(false);
 setErrorCamara(null);
 }

 function tomarFoto() {
 const video = videoRef.current;

 if (!video || !video.videoWidth || !video.videoHeight) {
 setErrorCamara("La cámara todavía no está lista. Inténtalo nuevamente.");
 return;
 }

 const canvas = document.createElement("canvas");

 canvas.width = video.videoWidth;
 canvas.height = video.videoHeight;

 const context = canvas.getContext("2d");

 if (!context) {
 setErrorCamara("No pudimos procesar la fotografía.");
 return;
 }

 context.drawImage(video, 0, 0, canvas.width, canvas.height);

 canvas.toBlob(
 (blob) => {
 if (!blob) {
 setErrorCamara("No pudimos guardar la fotografía.");
 return;
 }

 const archivo = new File(
 [blob],
 `selfie-kivo-${Date.now()}.jpg`,
 { type: "image/jpeg" },
 );

 validarYSeleccionar(archivo);
 cerrarCamara();
 },
 "image/jpeg",
 0.9,
 );
 }

 useEffect(() => {
 return () => {
 detenerCamara();
 };
 }, []);

 const destacado = Boolean(config.destacado);

 const [documentoDescargado, setDocumentoDescargado] = useState(false);
 const [documentoFirmado, setDocumentoFirmado] = useState(false);
 const [mostrarDocumento, setMostrarDocumento] = useState(false);

 const tituloDestacado = estaSubido
 ? "¡Excelente! Recibimos tu autorización firmada"
 : documentoFirmado
 ? "Tu documento está firmado"
 : documentoDescargado
 ? "¡Perfecto! Ya tienes el documento"
 : config.titulo;

 const descripcionDestacada = estaSubido
 ? "El documento fue cargado correctamente. Ahora podemos continuar con la evaluación de tu solicitud."
 : documentoFirmado
 ? "Ahora sube una foto clara o el PDF firmado para completar esta autorización."
 : documentoDescargado
 ? "Fírmalo con tu puño y letra. Cuando termines, confirma tu firma y sube el documento."
 : "Para continuar con tu solicitud necesitamos tu autorización para consultar tu historial en el Buró de Información Crediticia.";

 return (
 <div
 className={`rounded-xl bg-white p-4 transition-opacity duration-300 sm:p-5 ${
 destacado
 ? "border-2 border-primary/35"
 : "border border-border-soft"
 } ${locked ? "pointer-events-none select-none opacity-45" : ""}`}
 >
 {destacado ? (
 <>
 {/* Estados superiores */}
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.04em] text-primary">
 <FileSignature className="h-4 w-4" />
 Requiere firma manuscrita
 </div>

 <span
 className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase ${
 estaSubido
 ? "bg-success/10 text-success"
 : "bg-error/10 text-error"
 }`}
 >
 {estaSubido ? (
 <CircleCheckBig className="h-3.5 w-3.5" />
 ) : (
 <TriangleAlert className="h-3.5 w-3.5" />
 )}

 {estaSubido ? "Subido" : "Faltante"}
 </span>
 </div>

 {/* Explicación principal */}
 <div className="mt-4 overflow-hidden rounded-2xl border border-error/30 bg-white">
 <div className="p-4 sm:p-5">
 <div className="flex items-start gap-4">
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-error/10">
 <FileSignature className="h-6 w-6 text-error" />
 </div>

 <div className="min-w-0 flex-1">
 <p className="text-lg font-extrabold leading-tight text-ink">
 {config.titulo}
 </p>

 <p className="mt-2 text-sm leading-6 text-body">
 Para continuar con tu solicitud necesitamos tu autorización
 para consultar tu historial en el Buró de Información
 Crediticia.
 </p>

 <div className="mt-4 overflow-hidden rounded-lg bg-error/5">
 <div className="flex items-start gap-2 px-4 py-3">
 <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-error" />

 <p className="text-xs leading-5 text-ink-soft">
 {estaSubido
 ? "Tu autorización fue recibida correctamente y será utilizada únicamente para evaluar tu solicitud."
 : "Tu información será utilizada únicamente para evaluar tu solicitud de préstamo y será tratada de forma confidencial."}
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Documento para revisar */}
 {config.descargaUrl ? (
   <div className="mt-5 rounded-[18px] bg-surface-blue p-4 sm:p-5">
     <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
       <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
         <FileText className="h-8 w-8" />
       </div>

       <div className="min-w-0 flex-1">
         <p className="text-sm font-extrabold text-ink">
           Autorización expresa
         </p>

         <p className="mt-1 text-xs leading-5 text-body">
           Revisa el documento que debes firmar antes de descargarlo.
         </p>

         <button
           type="button"
           onClick={() => setMostrarDocumento(true)}
           className="mt-3 inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl bg-white px-4 text-xs font-extrabold text-primary transition-colors hover:bg-primary/5"
         >
           Ver documento
         </button>
       </div>
     </div>
   </div>
 ) : null}

 {/* Acciones */}
 {config.descargaUrl ? (
 <div className="mt-4">
 <div className="flex flex-wrap gap-3">
 <a
 href={config.descargaUrl}
 target="_blank"
 rel="noopener noreferrer"
 onClick={() => setDocumentoDescargado(true)}
 className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-white transition-colors hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
 >
 <Download className="h-5 w-5" />
 Descargar autorización autorización
 </a>

 <a
 href={config.descargaUrl}
 target="_blank"
 rel="noopener noreferrer"
 onClick={() => setDocumentoDescargado(true)}
 className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-primary px-5 text-sm font-extrabold text-primary transition-colors hover:bg-surface-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
 >
 <Printer className="h-5 w-5" />
 Imprimir autorización autorización
 </a>
 </div>

 {documentoFirmado && !estaSubido ? (
 <div className="mt-4 rounded-xl border border-success/25 bg-success/5 p-4">
 <div className="flex items-start gap-3">
 <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-success" />

 <div>
 <p className="text-sm font-bold text-success">
 Documento firmado
 </p>

 <p className="mt-1 text-xs leading-5 text-body">
 Ahora sube una foto clara o el PDF firmado en el área
 que aparece debajo.
 </p>
 </div>
 </div>
 </div>
 ) : null}
 </div>
 ) : null}


 {/* Pasos */}
 <ol className="mt-5 grid gap-3 sm:grid-cols-3">
 {[
 {
 completado: documentoDescargado,
 activo: !documentoDescargado,
 pendiente: "Descarga el documento",
 completadoTexto: "Documento descargado",
 },
 {
 completado: documentoFirmado,
 activo: documentoDescargado && !documentoFirmado,
 pendiente: "Fírmalo con tu puño y letra",
 completadoTexto: "Documento firmado",
 },
 {
 completado: estaSubido,
 activo: documentoFirmado && !estaSubido,
 pendiente: "Sube una foto o el PDF firmado",
 completadoTexto: "Documento cargado",
 },
 ].map((paso, index) => (
 <li
 key={paso.pendiente}
 className={`relative flex min-h-20 items-center gap-3 rounded-2xl border-2 px-4 py-3 transition-colors ${
 paso.completado
 ? "border-success/35 bg-success/5"
 : paso.activo
 ? "border-primary bg-surface-blue"
 : "border-border bg-white"
 }`}
 >
 <span
 className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white ${
 paso.completado
 ? "bg-success"
 : paso.activo
 ? "bg-primary"
 : "bg-muted"
 }`}
 >
 {paso.completado ? (
 <CircleCheckBig className="h-5 w-5" />
 ) : (
 index + 1
 )}
 </span>

 <span
 className={`text-sm font-bold leading-5 ${
 paso.completado
 ? "text-success"
 : "text-ink-soft"
 }`}
 >
 {paso.completado
 ? paso.completadoTexto
 : paso.pendiente}
 </span>

 {index < 2 ? (
 <span
 aria-hidden="true"
 className="absolute -right-3 top-1/2 z-10 hidden h-px w-3 bg-border sm:block"
 />
 ) : null}
 </li>
 ))}
 </ol>


 {documentoDescargado &&
 !documentoFirmado &&
 !estaSubido ? (
 <div className="mt-4 rounded-xl border border-border-soft bg-surface p-4">
 <p className="text-sm font-bold text-ink-soft">
 ¿Ya firmaste el documento?
 </p>

 <p className="mt-1 text-xs leading-5 text-muted">
 Confirma únicamente después de firmarlo con tu puño y
 letra.
 </p>

 <button
 type="button"
 onClick={() => setDocumentoFirmado(true)}
 className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-bold text-white transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-4 focus-visible:ring-ink/20"
 >
 <CircleCheckBig className="h-4 w-4" />
 Ya firmé el documento
 </button>
 </div>
 ) : null}

 </>
 ) : (
 <>
 {/* Encabezado normal para carnet y selfie */}
 <div className="flex items-start justify-between gap-3">
 <div>
 <p className="text-sm font-bold text-ink">
 {config.titulo}
 </p>

 <p className="mt-0.5 text-xs leading-5 text-muted">
 {config.descripcion}
 </p>
 </div>

 <span
 className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
 estaSubido
 ? "bg-success/10 text-success"
 : "bg-surface text-muted"
 }`}
 >
 {estaSubido ? (
 <CircleCheckBig className="h-3 w-3" />
 ) : null}

 {estaSubido ? "SUBIDO" : "FALTANTE"}
 </span>
 </div>

 {/* Ejemplo visual */}
 {config.ejemploUrl && !estaSubido ? (
 <div className="mt-4 grid gap-5 rounded-[22px] bg-[#F5FAFC] p-4 sm:grid-cols-[220px_1fr] sm:p-5">
 <div>
 <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-primary">
 Así debe verse
 </p>

 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={config.ejemploUrl}
 alt={config.ejemploAlt ?? `Ejemplo de ${config.titulo}`}
 className="h-auto max-h-52 w-full rounded-xl bg-white object-contain"
 />
 </div>

 {config.recomendaciones?.length ? (
 <div className="self-center">
 <p className="text-sm font-extrabold text-ink">
 Antes de subirlo, revisa esto:
 </p>

 <ul className="mt-3 grid gap-2">
 {config.recomendaciones.map((recomendacion) => (
 <li
 key={recomendacion}
 className="flex items-start gap-2 text-xs leading-5 text-body"
 >
 <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-success" />
 <span>{recomendacion}</span>
 </li>
 ))}
 </ul>
 </div>
 ) : null}
 </div>
 ) : null}

 {config.ayuda ? (
 <p className="mt-2 text-xs leading-5 text-muted">
 {config.ayuda}
 </p>
 ) : null}
 </>
 )}

 {config.key === "selfie" && !estaSubido ? (
 <div className="mt-5 rounded-[22px] bg-surface-blue px-5 py-7 text-center sm:px-8 sm:py-8">
   <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
     <Camera className="h-7 w-7" />
   </div>

   <p className="mt-4 text-lg font-extrabold text-ink">
     Tómate una selfie
   </p>

   <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">
     Necesitamos una foto tomada en este momento con tu carnet visible y tu rostro claramente identificado.
   </p>

   <button
     type="button"
     onClick={abrirCamara}
     disabled={locked}
     className="mx-auto mt-5 inline-flex min-h-12 min-w-[220px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-extrabold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
   >
     <Camera className="h-5 w-5" />
     Abrir cámara
   </button>

   <p className="mt-3 text-xs leading-5 text-muted">
     Tu navegador te pedirá permiso para usar la cámara.
   </p>

   {errorCamara ? (
     <p
       className="mx-auto mt-3 max-w-md text-xs font-semibold leading-5 text-error"
       role="alert"
     >
       {errorCamara}
     </p>
   ) : null}
 </div>
 ) : null}

 {estaSubido && infoMostrada ? (
 <div className="mt-4 overflow-hidden rounded-[22px] bg-[#F1FBF7]">
   <div className="flex items-center justify-between gap-4 px-5 pt-5">
     <div>
       <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-success">
         Tu documento
       </p>

       <p className="mt-1 text-xs text-muted">
         Revisa que la imagen se vea clara antes de continuar.
       </p>
     </div>

     <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[10px] font-extrabold uppercase text-success">
       <CircleCheckBig className="h-3.5 w-3.5" />
       Subido
     </span>
   </div>

   {previewUrl ? (
     <div className="px-5 pt-4">
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img
         src={previewUrl}
         alt={`Documento cargado: ${config.titulo}`}
         className={`max-h-[280px] rounded-[18px] bg-transparent object-contain ${
          config.key === "selfie"
            ? "mx-auto w-auto max-w-full"
            : "w-full"
        }`}
       />
     </div>
   ) : (
     <div className="mx-5 mt-4 flex min-h-[150px] items-center justify-center rounded-[18px] bg-white text-muted">
       <FileText className="h-10 w-10" />
     </div>
   )}

   <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
     <div className="min-w-0">
       <p className="truncate text-sm font-extrabold text-ink">
         {infoMostrada.nombre}
       </p>

       <p className="mt-1 text-xs text-muted">
         {formatBytes(infoMostrada.tamanoBytes)}
       </p>
     </div>

     <div className="flex flex-wrap items-center gap-2">
       {config.key === "selfie" ? (
         <button
           type="button"
           onClick={abrirCamara}
           disabled={locked}
           className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-primary transition-colors hover:bg-surface-blue disabled:cursor-not-allowed disabled:opacity-50"
         >
           <Camera className="h-4 w-4" />
           Tomar otra selfie
         </button>
       ) : (
         <label className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl bg-white px-4 text-xs font-extrabold text-primary transition-colors hover:bg-surface-blue">
           Cambiar archivo

           <input
             type="file"
             accept={config.accept}
             disabled={locked}
             className="sr-only"
             onChange={(e) => {
               const nuevoArchivo = e.target.files?.[0];

               if (nuevoArchivo) {
                 validarYSeleccionar(nuevoArchivo);
               }

               e.target.value = "";
             }}
           />
         </label>
       )}

       <button
         type="button"
         onClick={onRemove}
         aria-label={`Eliminar ${config.titulo}`}
         className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-error transition-colors hover:bg-error/5"
       >
         <Trash2 className="h-4 w-4" />
         Eliminar
       </button>
     </div>
   </div>
 </div>
 ) : config.key === "selfie" ? null : (
 <label
 onDragOver={(e) => {
 e.preventDefault();
 if (!locked) setIsDragOver(true);
 }}
 onDragLeave={() => setIsDragOver(false)}
 onDrop={handleDrop}
 className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${
 isDragOver
 ? "border-primary bg-surface-blue"
 : "border-border bg-surface hover:border-primary/50"
 }`}
 >
 <UploadCloud className="h-8 w-8 text-primary" />

 <p className="mt-3 text-sm font-bold leading-5 text-ink-soft">
 {destacado
 ? "Sube aquí el documento firmado"
 : "Sube aquí tu documento"}
 </p>

 <p className="mt-1 text-xs leading-5 text-body">
 Arrastra el archivo o{" "}
 <span className="font-bold text-primary">
 selecciónalo desde tu dispositivo
 </span>
 </p>

 <p className="mt-2 text-[11px] font-semibold text-muted">
 {config.accept.replaceAll(".", "").toUpperCase()} · Máximo 8 MB
 </p>
 <input
 ref={inputRef}
 type="file"
 accept={config.accept}
 disabled={locked}
 className="sr-only"
 onChange={(e) => {
 const nuevoArchivo = e.target.files?.[0];
 if (nuevoArchivo) validarYSeleccionar(nuevoArchivo);
 e.target.value = "";
 }}
 />
 </label>
 )}

 {mostrarDocumento && config.descargaUrl ? (
   <div
     className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 p-3 sm:p-6"
     role="dialog"
     aria-modal="true"
     aria-label="Vista previa de la autorización"
   >
     <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] bg-white">
       <div className="flex items-center justify-between gap-4 border-b border-border-soft px-5 py-4 sm:px-6">
         <div className="min-w-0">
           <p className="text-base font-extrabold text-ink sm:text-lg">
             Autorización expresa
           </p>

           <p className="mt-0.5 text-xs text-muted">
             Revisa el documento antes de descargarlo y firmarlo.
           </p>
         </div>

         <button
           type="button"
           onClick={() => setMostrarDocumento(false)}
           aria-label="Cerrar documento"
           className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface text-xl font-medium text-ink transition-colors hover:bg-border-soft"
         >
           ×
         </button>
       </div>

       <div className="min-h-0 flex-1 bg-surface">
         <iframe
           src={config.descargaUrl}
           title={`Vista previa de ${config.titulo}`}
           className="h-full w-full bg-white"
         />
       </div>

       <div className="flex flex-col-reverse gap-2 border-t border-border-soft bg-white p-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
         <button
           type="button"
           onClick={() => setMostrarDocumento(false)}
           className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-surface px-5 text-sm font-extrabold text-ink transition-colors hover:bg-border-soft"
         >
           Cerrar
         </button>

         <a
           href={config.descargaUrl}
           download
           onClick={() => setDocumentoDescargado(true)}
           className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-white transition-colors hover:bg-primary-dark"
         >
           <Download className="h-4.5 w-4.5" />
           Descargar autorización
         </a>
       </div>
     </div>
   </div>
 ) : null}

 {camaraAbierta && config.key === "selfie" ? (
 <div
 className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
 role="dialog"
 aria-modal="true"
 aria-label="Tomar selfie"
 >
 <div className="w-full max-w-xl overflow-hidden rounded-[24px] bg-white">
 <div className="flex items-start justify-between gap-4 px-5 py-4">
 <div>
 <p className="text-lg font-extrabold text-ink">
 Tómate una selfie
 </p>

 <p className="mt-1 text-sm leading-5 text-body">
 Mira a la cámara y asegúrate de que tu rostro y tu carnet se vean claramente.
 </p>
 </div>
 </div>

 <div className="bg-black">
 <video
 ref={videoRef}
 autoPlay
 playsInline
 muted
 className="aspect-[4/3] w-full object-cover"
 />
 </div>

 {errorCamara ? (
 <p className="px-5 pt-4 text-xs font-semibold text-error">
 {errorCamara}
 </p>
 ) : null}

 <div className="flex flex-col-reverse gap-2 p-5 sm:flex-row sm:justify-end">
 <button
 type="button"
 onClick={cerrarCamara}
 className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-surface px-5 text-sm font-extrabold text-ink transition-colors hover:bg-border-soft"
 >
 Cancelar
 </button>

 <button
 type="button"
 onClick={tomarFoto}
 className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-white transition-colors hover:bg-primary-dark"
 >
 <Camera className="h-4.5 w-4.5" />
 Tomar foto
 </button>
 </div>
 </div>
 </div>
 ) : null}

 {errorLocal ? (
 <p className="mt-2 text-xs font-semibold text-error" role="alert">
 {errorLocal}
 </p>
 ) : null}
 </div>
 );
}