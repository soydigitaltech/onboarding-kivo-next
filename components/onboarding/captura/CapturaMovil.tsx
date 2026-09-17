"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Webcam from "react-webcam";

import {
  Camera,
  Check,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import type {
  CaptureDocKey,
} from "@/lib/mock-capture-sessions";

interface CapturaMovilProps {
  token: string;
}

interface DocumentoCaptura {
  key: CaptureDocKey;
  titulo: string;
  ayuda: string;
  selfie?: boolean;
}

const DOCUMENTOS: DocumentoCaptura[] = [
  {
    key: "ciAnverso",
    titulo:
      "Carnet de identidad — parte frontal",
    ayuda:
      "Coloca el carnet completo dentro del encuadre.",
  },
  {
    key: "ciReverso",
    titulo:
      "Carnet de identidad — parte posterior",
    ayuda:
      "Fotografía el reverso completo, sin reflejos ni sombras.",
  },
  {
    key: "selfie",
    titulo: "Fotografía / selfie",
    ayuda:
      "Mira directamente a la cámara y procura tener buena iluminación.",
    selfie: true,
  },
  {
    key: "autorizacionBic",
    titulo:
      "Autorización expresa firmada",
    ayuda:
      "Fotografía el documento completo después de firmarlo.",
  },
];


interface CaptureFrame {
  aspectRatio: number;
  width: number;
  height: number;
}

function getCaptureFrame(
  documento: DocumentoCaptura,
): CaptureFrame {
  if (
    documento.key === "ciAnverso" ||
    documento.key === "ciReverso"
  ) {
    /*
     * Proporción aproximada ISO ID-1:
     * 85.60 × 53.98 mm
     */
    return {
      aspectRatio: 85.6 / 53.98,
      width: 1400,
      height: 883,
    };
  }

  return {
    aspectRatio: 3 / 4,
    width: 1080,
    height: 1440,
  };
}

function recortarYOptimizarCaptura(
  dataUrl: string,
  frame: CaptureFrame,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const sourceWidth = image.naturalWidth;
      const sourceHeight = image.naturalHeight;

      if (!sourceWidth || !sourceHeight) {
        reject(
          new Error(
            "No pudimos procesar la fotografía.",
          ),
        );
        return;
      }

      const sourceRatio =
        sourceWidth / sourceHeight;

      const targetRatio =
        frame.width / frame.height;

      let sx = 0;
      let sy = 0;
      let sw = sourceWidth;
      let sh = sourceHeight;

      /*
       * Recorte centrado equivalente a object-cover.
       * Así el archivo enviado coincide con lo que el
       * usuario ve dentro del encuadre.
       */
      if (sourceRatio > targetRatio) {
        sw = sourceHeight * targetRatio;
        sx = (sourceWidth - sw) / 2;
      } else if (sourceRatio < targetRatio) {
        sh = sourceWidth / targetRatio;
        sy = (sourceHeight - sh) / 2;
      }

      const canvas =
        document.createElement("canvas");

      canvas.width = frame.width;
      canvas.height = frame.height;

      const ctx =
        canvas.getContext("2d");

      if (!ctx) {
        reject(
          new Error(
            "No pudimos preparar la fotografía.",
          ),
        );
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        frame.width,
        frame.height,
      );

      resolve(
        canvas.toDataURL(
          "image/jpeg",
          0.86,
        ),
      );
    };

    image.onerror = () => {
      reject(
        new Error(
          "No pudimos procesar la fotografía.",
        ),
      );
    };

    image.src = dataUrl;
  });
}

export function CapturaMovil({
  token,
}: CapturaMovilProps) {
  const webcamRef =
    useRef<Webcam>(null);

  const [indice, setIndice] =
    useState(0);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [enviando, setEnviando] =
    useState(false);

  const [completado, setCompletado] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const documento =
    DOCUMENTOS[indice];

  useEffect(() => {
    void fetch(
      `/api/captura/${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          action: "connect",
        }),
      },
    );
  }, [token]);

  async function tomarFoto() {
    setError(null);

    if (!documento) return;

    const screenshot =
      webcamRef.current?.getScreenshot();

    if (!screenshot) {
      setError(
        "No pudimos tomar la fotografía. Verifica el permiso de cámara.",
      );

      return;
    }

    try {
      const frame =
        getCaptureFrame(documento);

      const esCarnet =
        documento.key === "ciAnverso" ||
        documento.key === "ciReverso";

      let capturaAjustada: string;

      capturaAjustada =
        await recortarYOptimizarCaptura(
          screenshot,
          frame,
        );

      setPreview(capturaAjustada);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos procesar la fotografía.",
      );
    }
  }

  async function confirmarFoto() {
    if (!preview || !documento) return;

    setEnviando(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/captura/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action: "capture",
            key: documento.key,
            imageData: preview,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No pudimos enviar la fotografía.",
        );
      }

      navigator.vibrate?.(80);

      const ultimo =
        indice ===
        DOCUMENTOS.length - 1;

      if (ultimo) {
        setCompletado(true);
        setPreview(null);
        return;
      }

      setIndice(
        (actual) => actual + 1,
      );

      setPreview(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos enviar la fotografía.",
      );
    } finally {
      setEnviando(false);
    }
  }

  if (completado) {
    return (
      <main className="min-h-screen bg-[#EAF8FF] px-5 py-10">
        <div className="mx-auto max-w-md rounded-[28px] bg-white p-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8FFF6] text-[#04B77A]">
            <Check className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-ink">
            Listo
          </h1>

          <p className="mt-2 text-sm leading-6 text-body">
            Recibimos todas tus capturas de forma segura.
          </p>

          <p className="mt-5 rounded-2xl bg-surface-blue px-4 py-4 text-sm font-bold leading-6 text-primary-dark">
            Ya puedes volver a tu computadora. Kivo continuará automáticamente allí.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-primary" />
            La sesión está vinculada únicamente a tu solicitud.
          </div>
        </div>
      </main>
    );
  }

  if (!documento) return null;

  const captureFrame =
    getCaptureFrame(documento);

  const progreso =
    ((indice + (preview ? 1 : 0)) /
      DOCUMENTOS.length) *
    100;

  return (
    <main className="min-h-screen bg-[#EAF8FF] px-4 py-6">
      <div className="mx-auto max-w-md overflow-hidden rounded-[28px] bg-white">
        <div className="px-5 pb-5 pt-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-sm font-black text-white">
            kivo<span className="text-primary">.</span>
          </div>

          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
            Captura segura
          </p>

          <h1 className="mt-2 text-xl font-extrabold leading-7 text-ink">
            {documento.titulo}
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            {documento.ayuda}
          </p>

          {documento.key ===
          "autorizacionBic" ? (
            <a
              href="/AUTORIZACIOEXPRESA.pdf"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-surface-blue px-4 text-sm font-bold text-primary"
            >
              Ver autorización para firmar
            </a>
          ) : null}

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-blue">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${progreso}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs font-semibold text-muted">
            Documento {indice + 1} de{" "}
            {DOCUMENTOS.length}
          </p>
        </div>

        <div
          className="overflow-hidden bg-black"
          style={{
            aspectRatio:
              captureFrame.aspectRatio,
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Vista previa de la fotografía tomada"
              className="h-full w-full object-cover"
            />
          ) : (
            <Webcam
              key={documento.key}
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.82}
              forceScreenshotSourceSize
              mirrored={
                documento.selfie === true
              }
              videoConstraints={{
                facingMode:
                  documento.selfie
                    ? "user"
                    : {
                        ideal:
                          "environment",
                      },
              }}
              onUserMediaError={() =>
                setError(
                  "Necesitamos permiso para usar la cámara. No habilitamos la galería ni la carga de archivos.",
                )
              }
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="p-5">
          {error ? (
            <p className="mb-4 rounded-xl bg-[#FFF0F0] px-4 py-3 text-xs font-bold leading-5 text-error">
              {error}
            </p>
          ) : null}

          {preview ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={enviando}
                onClick={() =>
                  setPreview(null)
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-bold text-body"
              >
                <RotateCcw className="h-4 w-4" />
                Repetir
              </button>

              <button
                type="button"
                disabled={enviando}
                onClick={() =>
                  void confirmarFoto()
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {enviando
                  ? "Enviando…"
                  : "Usar foto"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void tomarFoto()}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-extrabold text-white"
            >
              <Camera className="h-5 w-5" />
              Tomar foto
            </button>
          )}

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-surface-blue p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <p className="text-xs leading-5 text-primary-dark">
              Por seguridad, esta pantalla solo permite capturar imágenes desde la cámara. No existe opción para seleccionar fotos de la galería.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
