import { NextResponse } from "next/server";
import { Resend } from "resend";

import { emailSchema } from "@/lib/schemas/cuenta";
import { guardarOtp, puedeReenviar } from "@/lib/otp-store";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = emailSchema.safeParse(body?.email);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ingresa un correo electrónico válido." },
      { status: 400 },
    );
  }

  const email = parsed.data;

  const espera = puedeReenviar(email);
  if (!espera.permitido) {
    return NextResponse.json(
      {
        error: `Espera ${espera.segundosRestantes}s antes de solicitar otro código.`,
      },
      { status: 429 },
    );
  }

  const codigo = String(Math.floor(100000 + Math.random() * 900000));
  guardarOtp(email, codigo);

  try {
    await resend.emails.send({
      // TODO: reemplazar por el dominio verificado de Kivo en Resend.
      from: "Kivo <onboarding@resend.dev>",
      to: email,
      subject: "Tu código de verificación Kivo",
      html: `
        <div style="font-family: sans-serif; max-width: 420px; margin: 0 auto;">
          <p style="color:#0b1739;font-size:15px;">Tu código de verificación es:</p>
          <p style="font-size:32px;font-weight:800;letter-spacing:6px;color:#03aefe;">${codigo}</p>
          <p style="color:#66728a;font-size:13px;">Vence en 10 minutos. Si no solicitaste este código, ignora este correo.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error enviando OTP:", error);
    return NextResponse.json(
      { error: "No pudimos enviar el correo. Intenta nuevamente." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}