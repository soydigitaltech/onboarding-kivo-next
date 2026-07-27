"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import {
  CircleCheckBig,
  Download,
  FileSignature,
  FileText,
  Printer,
  Trash2,
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
  /** Solo la autorización BIC tiene documento para descargar/imprimir. */
  descargaUrl?: string;
  /** Resalta la tarjeta con borde y pasos numerados (documentos con
   *  una acción externa —descargar, firmar— que el cliente puede
   *  pasar por alto si no la nota de inmediato). */
  destacado?: boolean;
  pasos?: string[];
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
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
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

  return (
    <div
      className={`rounded-xl bg-white p-4 transition-opacity duration-300 sm:p-5 ${
        destacado
          ? "border-2 border-primary/35 shadow-[0_8px_24px_rgba(3,174,254,0.12)]"
          : "border border-border-soft"
      } ${locked ? "pointer-events-none select-none opacity-45" : ""}`}
    >
      {destacado ? (
        <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary">
          <FileSignature className="h-3.5 w-3.5" />
          Requiere firma manuscrita
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">{config.titulo}</p>
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
          {estaSubido ? <CircleCheckBig className="h-3 w-3" /> : null}
          {estaSubido ? "SUBIDO" : "FALTANTE"}
        </span>
      </div>

      {config.pasos && config.pasos.length > 0 ? (
        <ol className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {config.pasos.map((paso, index) => (
            <li
              key={paso}
              className="flex items-center gap-2.5 rounded-lg bg-surface px-3 py-2.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-extrabold text-white">
                {index + 1}
              </span>
              <span className="text-xs font-semibold leading-tight text-ink-soft">
                {paso}
              </span>
            </li>
          ))}
        </ol>
      ) : config.ayuda ? (
        <p className="mt-2 text-xs leading-5 text-muted">{config.ayuda}</p>
      ) : null}

      {config.descargaUrl ? (
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          <a
            href={config.descargaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-bold text-white transition-colors hover:bg-primary-dark"
          >
            <Download className="h-4 w-4" />
            Descargar PDF para firmar
          </a>
          <a
            href={config.descargaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border-2 border-border px-4 text-[13px] font-bold text-ink-soft transition-colors hover:border-primary hover:text-primary"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </a>
        </div>
      ) : null}

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
          <UploadCloud className="h-6 w-6 text-muted" />
          <p className="mt-2 text-xs leading-5 text-body">
            Arrastra y suelta el archivo aquí o{" "}
            <span className="font-bold text-primary">
              selecciona un archivo
            </span>
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