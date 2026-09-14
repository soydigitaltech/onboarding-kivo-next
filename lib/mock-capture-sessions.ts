export const CAPTURE_DOC_KEYS = [
  "ciAnverso",
  "ciReverso",
  "selfie",
  "autorizacionBic",
] as const;

export type CaptureDocKey =
  (typeof CAPTURE_DOC_KEYS)[number];

export interface CaptureDocument {
  key: CaptureDocKey;
  nombre: string;
  tipo: string;
  tamanoBytes: number;
  capturadoEn: string;
  imageData: string;
}

export interface CaptureSession {
  token: string;
  connected: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  documents: Partial<
    Record<CaptureDocKey, CaptureDocument>
  >;
}

declare global {
  // eslint-disable-next-line no-var
  var __kivoCaptureSessions:
    | Map<string, CaptureSession>
    | undefined;
}

const sessions =
  globalThis.__kivoCaptureSessions ??
  new Map<string, CaptureSession>();

globalThis.__kivoCaptureSessions = sessions;

const DOCUMENT_NAMES: Record<CaptureDocKey, string> = {
  ciAnverso: "carnet-frontal.jpg",
  ciReverso: "carnet-posterior.jpg",
  selfie: "selfie.jpg",
  autorizacionBic: "autorizacion-expresa.jpg",
};

function generarToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let value = "";

  for (let i = 0; i < 6; i += 1) {
    value += chars[
      Math.floor(Math.random() * chars.length)
    ];
  }

  return `KIVO-${value}`;
}

function tamanoDataUrl(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";

  return Math.ceil((base64.length * 3) / 4);
}

function limpiarExpiradas() {
  const limite =
    Date.now() - 30 * 60 * 1000;

  for (const [token, session] of sessions.entries()) {
    if (
      new Date(session.updatedAt).getTime() <
      limite
    ) {
      sessions.delete(token);
    }
  }
}

export function createCaptureSession():
  CaptureSession {
  limpiarExpiradas();

  let token = generarToken();

  while (sessions.has(token)) {
    token = generarToken();
  }

  const ahora = new Date().toISOString();

  const session: CaptureSession = {
    token,
    connected: false,
    completed: false,
    createdAt: ahora,
    updatedAt: ahora,
    documents: {},
  };

  sessions.set(token, session);

  return session;
}

export function getCaptureSession(
  token: string,
): CaptureSession | null {
  limpiarExpiradas();

  return sessions.get(token) ?? null;
}

export function connectCaptureSession(
  token: string,
): CaptureSession | null {
  const session = getCaptureSession(token);

  if (!session) return null;

  session.connected = true;
  session.updatedAt = new Date().toISOString();

  sessions.set(token, session);

  return session;
}

export function saveCapture(
  token: string,
  key: CaptureDocKey,
  imageData: string,
): CaptureSession | null {
  const session = getCaptureSession(token);

  if (!session) return null;

  if (
    !CAPTURE_DOC_KEYS.includes(key)
  ) {
    throw new Error("Documento no válido.");
  }

  if (
    !imageData.startsWith("data:image/")
  ) {
    throw new Error(
      "La captura debe provenir de la cámara.",
    );
  }

  const tamanoBytes =
    tamanoDataUrl(imageData);

  if (tamanoBytes > 5 * 1024 * 1024) {
    throw new Error(
      "La captura supera el tamaño permitido.",
    );
  }

  session.documents[key] = {
    key,
    nombre: DOCUMENT_NAMES[key],
    tipo: "image/jpeg",
    tamanoBytes,
    capturadoEn: new Date().toISOString(),
    imageData,
  };

  session.connected = true;

  session.completed =
    CAPTURE_DOC_KEYS.every(
      (documentKey) =>
        !!session.documents[documentKey],
    );

  session.updatedAt =
    new Date().toISOString();

  sessions.set(token, session);

  return session;
}
