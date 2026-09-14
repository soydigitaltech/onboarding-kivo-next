import { NextResponse } from "next/server";

import {
  createCaptureSession,
} from "@/lib/mock-capture-sessions";

export const dynamic = "force-dynamic";

export async function POST() {
  const session =
    createCaptureSession();

  return NextResponse.json(session);
}
