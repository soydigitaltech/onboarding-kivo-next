import { NextResponse } from "next/server";
import { z } from "zod";

import { verificarOtp } from "@/lib/otp-store";

const schema = z.object({
  email: z.string().trim().email(),
  codigo: z.string().trim().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const resultado = verificarOtp(parsed.data.email, parsed.data.codigo);

  if (!resultado.valido) {
    return NextResponse.json(
      { error: resultado.mensaje ?? "Código inválido." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}