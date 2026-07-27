/**
 * Almacén de OTP en memoria — válido solo para este demo.
 *
 * En producción, reemplazar por Redis/KV (los procesos serverless
 * no comparten memoria de forma confiable entre invocaciones, y este
 * Map se reinicia cada vez que el servidor de desarrollo se reinicia).
 */

interface RegistroOtp {
  codigo: string;
  expiraEn: number;
  intentos: number;
  ultimoEnvio: number;
}

const OTP_VIGENCIA_MS = 10 * 60 * 1000; // 10 minutos
const MAX_INTENTOS = 5;
const REENVIO_COOLDOWN_MS = 45 * 1000; // 45 segundos

const almacen = new Map<string, RegistroOtp>();

export function puedeReenviar(email: string): {
  permitido: boolean;
  segundosRestantes: number;
} {
  const registro = almacen.get(email);
  if (!registro) return { permitido: true, segundosRestantes: 0 };

  const transcurrido = Date.now() - registro.ultimoEnvio;
  if (transcurrido >= REENVIO_COOLDOWN_MS) {
    return { permitido: true, segundosRestantes: 0 };
  }

  return {
    permitido: false,
    segundosRestantes: Math.ceil(
      (REENVIO_COOLDOWN_MS - transcurrido) / 1000,
    ),
  };
}

export function guardarOtp(email: string, codigo: string): void {
  almacen.set(email, {
    codigo,
    expiraEn: Date.now() + OTP_VIGENCIA_MS,
    intentos: 0,
    ultimoEnvio: Date.now(),
  });
}

export function verificarOtp(
  email: string,
  codigo: string,
): { valido: boolean; mensaje?: string } {
  const registro = almacen.get(email);

  if (!registro) {
    return { valido: false, mensaje: "Solicita un nuevo código." };
  }

  if (Date.now() > registro.expiraEn) {
    almacen.delete(email);
    return {
      valido: false,
      mensaje: "El código expiró. Solicita uno nuevo.",
    };
  }

  if (registro.intentos >= MAX_INTENTOS) {
    almacen.delete(email);
    return {
      valido: false,
      mensaje: "Demasiados intentos. Solicita un nuevo código.",
    };
  }

  if (registro.codigo !== codigo) {
    registro.intentos += 1;
    return {
      valido: false,
      mensaje: `Código incorrecto. Te quedan ${
        MAX_INTENTOS - registro.intentos
      } intentos.`,
    };
  }

  almacen.delete(email);
  return { valido: true };
}