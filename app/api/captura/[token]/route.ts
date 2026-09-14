import { NextResponse } from "next/server";

import {
  CAPTURE_DOC_KEYS,
  connectCaptureSession,
  getCaptureSession,
  saveCapture,
  type CaptureDocKey,
} from "@/lib/mock-capture-sessions";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    token: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const { token } = await context.params;

  const session =
    getCaptureSession(token);

  if (!session) {
    return NextResponse.json(
      {
        error:
          "La sesión de captura no existe o expiró.",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(session);
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const { token } = await context.params;

  try {
    const body = await request.json();

    if (body.action === "connect") {
      const session =
        connectCaptureSession(token);

      if (!session) {
        return NextResponse.json(
          {
            error:
              "La sesión de captura no existe o expiró.",
          },
          {
            status: 404,
          },
        );
      }

      return NextResponse.json(session);
    }

    if (body.action === "capture") {
      const key =
        body.key as CaptureDocKey;

      if (
        !CAPTURE_DOC_KEYS.includes(key)
      ) {
        return NextResponse.json(
          {
            error: "Documento no válido.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        typeof body.imageData !== "string"
      ) {
        return NextResponse.json(
          {
            error:
              "No se recibió una captura válida.",
          },
          {
            status: 400,
          },
        );
      }

      const session = saveCapture(
        token,
        key,
        body.imageData,
      );

      if (!session) {
        return NextResponse.json(
          {
            error:
              "La sesión de captura no existe o expiró.",
          },
          {
            status: 404,
          },
        );
      }

      return NextResponse.json(session);
    }

    return NextResponse.json(
      {
        error: "Acción no válida.",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No pudimos procesar la captura.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      },
    );
  }
}
