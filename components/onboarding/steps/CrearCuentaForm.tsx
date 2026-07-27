"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

import { emailSchema } from "@/lib/schemas/cuenta";
import { useOnboardingStore } from "@/store/onboarding";
import { Field, inputClassName } from "@/components/ui/fields";

const REVEAL: Transition = { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] };
const REENVIO_COOLDOWN_SEGUNDOS = 45;

type Etapa = "email" | "otp";

export function CrearCuentaForm() {
  const router = useRouter();
  const cuenta = useOnboardingStore((s) => s.cuenta);
  const setCuenta = useOnboardingStore((s) => s.setCuenta);

  const [etapa, setEtapa] = useState<Etapa>(cuenta ? "otp" : "email");
  const [email, setEmail] = useState(cuenta?.email ?? "");
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  const [digitos, setDigitos] = useState<string[]>(Array(6).fill(""));
  const [errorOtp, setErrorOtp] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function enviarCodigo() {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setErrorEmail(parsed.error.issues[0]?.message ?? "Correo inválido.");
      return;
    }

    setErrorEmail(null);
    setEnviandoEmail(true);

    try {
      const res = await fetch("/api/auth/enviar-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorEmail(data.error ?? "No pudimos enviar el código.");
        return;
      }

      setEtapa("otp");
      setDigitos(Array(6).fill(""));
      setErrorOtp(null);
      setCooldown(REENVIO_COOLDOWN_SEGUNDOS);
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    } catch {
      setErrorEmail("No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setEnviandoEmail(false);
    }
  }

  function actualizarDigito(index: number, valor: string) {
    const limpio = valor.replace(/\D/g, "").slice(-1);
    setDigitos((prev) => {
      const copia = [...prev];
      copia[index] = limpio;
      return copia;
    });

    if (limpio && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function onKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digitos[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const texto = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!texto) return;
    e.preventDefault();
    const nuevos = Array(6).fill("");
    texto.split("").forEach((d, i) => (nuevos[i] = d));
    setDigitos(nuevos);
    inputsRef.current[Math.min(texto.length, 5)]?.focus();
  }

  async function verificarCodigo() {
    const codigo = digitos.join("");
    if (codigo.length !== 6) {
      setErrorOtp("Ingresa los 6 dígitos del código.");
      return;
    }

    setErrorOtp(null);
    setVerificando(true);

    try {
      const res = await fetch("/api/auth/verificar-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorOtp(data.error ?? "Código inválido.");
        return;
      }

      setCuenta({ email, verificadaEn: new Date().toISOString() });
      router.push("/onboarding");
    } catch {
      setErrorOtp("No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setVerificando(false);
    }
  }

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Crea tu cuenta con tu correo electrónico. Te enviaremos un código de
        verificación para confirmar que eres tú.
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {etapa === "email" ? (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={REVEAL}
          >
            <Field label="Correo electrónico" htmlFor="email" error={errorEmail ?? undefined}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tunombre@correo.com"
                className={inputClassName}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarCodigo()}
              />
            </Field>

            <div className="mt-6">
              <button
                type="button"
                onClick={enviarCodigo}
                disabled={enviandoEmail}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Mail className="h-4.5 w-4.5" />
                {enviandoEmail ? "Enviando..." : "Enviar código"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={REVEAL}
          >
            <p className="text-sm font-bold text-ink">
              Ingresa el código que enviamos a
            </p>
            <p className="mt-0.5 text-sm text-body">{email}</p>

            <div className="mt-4 flex gap-2.5">
              {digitos.map((digito, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digito}
                  onChange={(e) => actualizarDigito(index, e.target.value)}
                  onKeyDown={(e) => onKeyDown(index, e)}
                  onPaste={onPaste}
                  className="h-14 w-12 rounded-xl border-2 border-border bg-white text-center text-xl font-extrabold text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              ))}
            </div>

            {errorOtp ? (
              <p className="mt-3 text-xs font-semibold text-error" role="alert">
                {errorOtp}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={verificarCodigo}
                disabled={verificando}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShieldCheck className="h-4.5 w-4.5" />
                {verificando ? "Verificando..." : "Verificar"}
                {!verificando ? <ArrowRight className="h-4 w-4" /> : null}
              </button>

              <button
                type="button"
                onClick={enviarCodigo}
                disabled={cooldown > 0 || enviandoEmail}
                className="text-sm font-bold text-primary transition-colors hover:underline disabled:cursor-not-allowed disabled:text-placeholder disabled:no-underline"
              >
                {cooldown > 0
                  ? `Reenviar código (${cooldown}s)`
                  : "Reenviar código"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setEtapa("email");
                setErrorOtp(null);
              }}
              className="mt-4 text-xs font-semibold text-muted transition-colors hover:text-primary"
            >
              ¿Correo equivocado? Cambiar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}