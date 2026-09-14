"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Check,
  Copy,
  LoaderCircle,
  LockKeyhole,
  Smartphone,
} from "lucide-react";

import {
  QRCodeSVG,
} from "qrcode.react";

import {
  CAPTURE_DOC_KEYS,
  type CaptureDocKey,
} from "@/lib/mock-capture-sessions";

interface DocumentoRemoto {
  key: CaptureDocKey;
  nombre: string;
  tipo: string;
  tamanoBytes: number;
  capturadoEn: string;
  imageData: string;
}

interface SessionResponse {
  token: string;
  connected: boolean;
  completed: boolean;
  documents: Partial<
    Record<
      CaptureDocKey,
      DocumentoRemoto
    >
  >;
}

interface Props {
  onDocumentCaptured: (
    key: CaptureDocKey,
    file: File,
  ) => void;

  onSessionCompleted: () => void;
}

const LABELS: Record<
  CaptureDocKey,
  string
> = {
  ciAnverso: "CI frontal",
  ciReverso: "CI posterior",
  selfie: "Selfie",
  autorizacionBic:
    "Autorización expresa",
};

async function dataUrlToFile(
  dataUrl: string,
  nombre: string,
): Promise<File> {
  const response =
    await fetch(dataUrl);

  const blob =
    await response.blob();

  return new File(
    [blob],
    nombre,
    {
      type:
        blob.type ||
        "image/jpeg",
    },
  );
}

export function CapturaDesktopBridge({
  onDocumentCaptured,
  onSessionCompleted,
}: Props) {
  const [session, setSession] =
    useState<SessionResponse | null>(
      null,
    );

  const [mobileUrl, setMobileUrl] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const imported =
    useRef<Set<CaptureDocKey>>(
      new Set(),
    );

  const completadoNotificado =
    useRef(false);

  useEffect(() => {
    let cancelado = false;

    async function crearSesion() {
      try {
        const response = await fetch(
          "/api/captura/sesion",
          {
            method: "POST",
          },
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              "No pudimos crear la sesión.",
          );
        }

        if (cancelado) return;

        setSession(data);

        setMobileUrl(
          `${window.location.origin}/onboarding/captura/${encodeURIComponent(
            data.token,
          )}`,
        );
      } catch (err) {
        if (cancelado) return;

        setError(
          err instanceof Error
            ? err.message
            : "No pudimos crear la sesión.",
        );
      }
    }

    void crearSesion();

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (!session?.token) return;

    let cancelado = false;

    async function revisar() {
      try {
        const response = await fetch(
          `/api/captura/${encodeURIComponent(
            session!.token,
          )}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) return;

        const data: SessionResponse =
          await response.json();

        if (cancelado) return;

        setSession(data);

        for (
          const key of CAPTURE_DOC_KEYS
        ) {
          const remoto =
            data.documents[key];

          if (
            !remoto ||
            imported.current.has(key)
          ) {
            continue;
          }

          const file =
            await dataUrlToFile(
              remoto.imageData,
              remoto.nombre,
            );

          imported.current.add(key);

          onDocumentCaptured(
            key,
            file,
          );
        }

        if (
          data.completed &&
          !completadoNotificado.current
        ) {
          completadoNotificado.current =
            true;

          setTimeout(() => {
            onSessionCompleted();
          }, 1200);
        }
      } catch {
        // El polling vuelve a intentar automáticamente.
      }
    }

    void revisar();

    const interval =
      window.setInterval(
        () => void revisar(),
        1000,
      );

    return () => {
      cancelado = true;

      window.clearInterval(
        interval,
      );
    };
  }, [
    session?.token,
    onDocumentCaptured,
    onSessionCompleted,
  ]);

  const capturados = useMemo(
    () =>
      CAPTURE_DOC_KEYS.filter(
        (key) =>
          !!session?.documents[key],
      ).length,
    [session?.documents],
  );

  async function copiarEnlace() {
    if (!mobileUrl) return;

    await navigator.clipboard.writeText(
      mobileUrl,
    );
  }

  return (
    <div className="mb-7">
      <div className="w-full rounded-[24px] border border-border-soft bg-white p-5 sm:p-6">
        <div className="grid gap-7 md:grid-cols-[1fr_280px]">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-blue text-primary">
              <LockKeyhole className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-2xl font-extrabold leading-8 text-ink">
              Por seguridad, toma tus fotos desde tu celular
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-body">
              Para validar tu identidad, las fotografías deben capturarse en vivo desde la cámara de tu celular. Desde esta computadora no permitimos subir imágenes guardadas.
            </p>

            <div className="mt-6 rounded-[22px] bg-surface-blue p-5">
              <p className="text-sm font-extrabold text-primary-dark">
                Escanea el QR con tu celular
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                La cámara se abrirá automáticamente en tu teléfono.
              </p>

              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="w-fit rounded-2xl bg-white p-3">
                  {mobileUrl ? (
                    <QRCodeSVG
                      value={mobileUrl}
                      size={150}
                      level="M"
                    />
                  ) : (
                    <div className="grid h-[150px] w-[150px] place-items-center">
                      <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted">
                    Código de conexión
                  </p>

                  <p className="mt-1 text-lg font-extrabold tracking-wide text-ink">
                    {session?.token ??
                      "Creando…"}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      void copiarEnlace()
                    }
                    disabled={!mobileUrl}
                    className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-3 text-xs font-bold text-primary disabled:opacity-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar enlace
                  </button>
                </div>
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-xl bg-[#FFF0F0] px-4 py-3 text-xs font-bold text-error">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-[24px] border border-border-soft bg-white p-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  session?.connected
                    ? "bg-[#E8FFF6] text-[#04B77A]"
                    : "bg-surface-blue text-primary"
                }`}
              >
                {session?.connected ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Smartphone className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-sm font-extrabold text-ink">
                  {session?.connected
                    ? "Celular conectado"
                    : "Esperando celular"}
                </p>

                <p className="mt-0.5 text-xs text-muted">
                  {capturados} de 4 capturas
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {CAPTURE_DOC_KEYS.map(
                (key) => {
                  const listo =
                    !!session
                      ?.documents[key];

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-3"
                    >
                      <span className="text-xs font-bold text-body">
                        {LABELS[key]}
                      </span>

                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          listo
                            ? "bg-[#E8FFF6] text-[#04B77A]"
                            : "bg-white text-muted"
                        }`}
                      >
                        {listo ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-current opacity-40" />
                        )}
                      </span>
                    </div>
                  );
                },
              )}
            </div>

            {session?.completed ? (
              <div className="mt-5 rounded-2xl bg-[#E8FFF6] px-4 py-4">
                <p className="text-sm font-extrabold text-[#047A54]">
                  Capturas recibidas
                </p>

                <p className="mt-1 text-xs leading-5 text-[#37695A]">
                  Ya puedes continuar en esta computadora.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 border-t border-border-soft pt-5">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <p className="text-xs leading-5 text-muted">
            No se permite seleccionar selfies ni fotografías almacenadas desde el escritorio. Las imágenes deben originarse en la sesión de cámara del celular.
          </p>
        </div>
      </div>
    </div>
  );
}
