"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

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

  const destacado = Boolean(config.destacado);

  const [documentoDescargado, setDocumentoDescargado] = useState(false);
  const [documentoFirmado, setDocumentoFirmado] = useState(false);

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
                  Descargar
                </a>

                <a
                  href={config.descargaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDocumentoDescargado(true)}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-primary px-5 text-sm font-extrabold text-primary transition-colors hover:bg-surface-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  <Printer className="h-5 w-5" />
                  Imprimir
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
          {config.ejemploUrl ? (
            <div className="mt-4 grid gap-4 rounded-2xl border border-border-soft bg-surface p-4 sm:grid-cols-[220px_1fr] sm:p-5">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-primary">
                  Así debe verse
                </p>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.ejemploUrl}
                  alt={config.ejemploAlt ?? `Ejemplo de ${config.titulo}`}
                  className="h-auto max-h-52 w-full rounded-xl border border-border-soft bg-white object-contain"
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

      {estaSubido && infoMostrada ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-success/25 bg-success/5 p-3">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white text-muted">
              <FileText className="h-6 w-6" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink-soft">
              {infoMostrada.nombre}
            </p>
            <p className="text-xs text-muted">
              {formatBytes(infoMostrada.tamanoBytes)}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Quitar ${config.titulo}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-error focus:outline-none focus-visible:ring-4 focus-visible:ring-error/15"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
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

      {errorLocal ? (
        <p className="mt-2 text-xs font-semibold text-error" role="alert">
          {errorLocal}
        </p>
      ) : null}
    </div>
  );
}