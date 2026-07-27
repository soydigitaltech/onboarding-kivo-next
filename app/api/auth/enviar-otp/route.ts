import { randomInt } from "node:crypto";

import { NextResponse } from "next/server";
import { Resend } from "resend";

import { guardarOtp, puedeReenviar } from "@/lib/otp-store";
import { emailSchema } from "@/lib/schemas/cuenta";

const APP_URL =
  process.env.APP_URL ?? "https://onboarding-kivo-next.vercel.app";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY no configurada.");

    return NextResponse.json(
      {
        error:
          "Servicio de correo no configurado. Contacta al administrador.",
      },
      { status: 503 },
    );
  }

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

  const resend = new Resend(apiKey);
  const codigo = String(randomInt(100000, 1000000));
  const logoUrl = `${APP_URL}/kivo.svg`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Kivo <no-reply@notify.soydigital.tech>",
      to: email,
      replyTo: "hugo@soydigital.tech",
      subject: `${codigo} es tu código de verificación Kivo`,

      text: `
Tu código de verificación Kivo es: ${codigo}

Este código vence en 10 minutos.

Si no solicitaste este código, puedes ignorar este correo.
      `.trim(),

      html: `
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Código de verificación Kivo</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f4f7fb;
              font-family: Arial, Helvetica, sans-serif;
              color: #0b1739;
            "
          >
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="background-color: #f4f7fb;"
            >
              <tr>
                <td align="center" style="padding: 32px 16px;">
                  <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                      width: 100%;
                      max-width: 520px;
                      background-color: #ffffff;
                      border-radius: 24px;
                      overflow: hidden;
                      box-shadow: 0 12px 40px rgba(11, 23, 57, 0.08);
                    "
                  >
                    <tr>
                      <td
                        align="center"
                        style="
                          padding: 32px 32px 24px;
                          background-color: #00aeff;
                        "
                      >
                        <img
                          src="${logoUrl}"
                          width="110"
                          alt="Kivo"
                          style="
                            display: block;
                            width: 110px;
                            max-width: 100%;
                            height: auto;
                            border: 0;
                          "
                        />
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 36px 40px 16px;">
                        <h1
                          style="
                            margin: 0 0 12px;
                            font-size: 26px;
                            line-height: 1.25;
                            font-weight: 800;
                            text-align: center;
                            color: #0b1739;
                          "
                        >
                          Verifica tu correo
                        </h1>

                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            line-height: 1.65;
                            text-align: center;
                            color: #66728a;
                          "
                        >
                          Usa el siguiente código para continuar con tu registro
                          en Kivo.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 20px 40px;">
                        <div
                          style="
                            padding: 24px;
                            border: 2px solid #00aeff;
                            border-radius: 18px;
                            background-color: #f0faff;
                            text-align: center;
                          "
                        >
                          <p
                            style="
                              margin: 0 0 10px;
                              font-size: 12px;
                              line-height: 1.4;
                              font-weight: 700;
                              letter-spacing: 1.2px;
                              text-transform: uppercase;
                              color: #66728a;
                            "
                          >
                            Tu código
                          </p>

                          <div
                            style="
                              margin: 0;
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 38px;
                              line-height: 1;
                              font-weight: 800;
                              letter-spacing: 8px;
                              color: #00aeff;
                              user-select: text;
                              -webkit-user-select: text;
                            "
                          >
                            ${codigo}
                          </div>
                        </div>

                        <p
                          style="
                            margin: 12px 0 0;
                            font-size: 12px;
                            line-height: 1.5;
                            text-align: center;
                            color: #8290a8;
                          "
                        >
                          Mantén presionado o selecciona el código para copiarlo.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 8px 40px 36px;">
                        <div
                          style="
                            padding: 16px 18px;
                            border-radius: 14px;
                            background-color: #fff8ed;
                          "
                        >
                          <p
                            style="
                              margin: 0;
                              font-size: 13px;
                              line-height: 1.6;
                              text-align: center;
                              color: #73521d;
                            "
                          >
                            Este código vence en
                            <strong>10 minutos</strong>. Si no solicitaste este
                            código, puedes ignorar este correo.
                          </p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td
                        align="center"
                        style="
                          padding: 20px 32px;
                          border-top: 1px solid #edf1f7;
                          background-color: #fafcff;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            font-size: 12px;
                            line-height: 1.5;
                            color: #8290a8;
                          "
                        >
                          Este es un mensaje automático enviado por Kivo.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error devuelto por Resend:", error);

      return NextResponse.json(
        { error: "No pudimos enviar el correo. Intenta nuevamente." },
        { status: 500 },
      );
    }

    guardarOtp(email, codigo);

    console.info("OTP enviado correctamente:", {
      email,
      resendId: data?.id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error inesperado enviando OTP:", error);

    return NextResponse.json(
      { error: "No pudimos enviar el correo. Intenta nuevamente." },
      { status: 500 },
    );
  }
}