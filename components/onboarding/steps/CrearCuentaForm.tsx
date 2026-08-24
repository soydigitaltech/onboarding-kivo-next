"use client";

import {
  KivoButton,
  KivoInput,
  KivoOTPInput,
  type KivoOTPInputHandle,
} from "@/components/ui/kivo";

import {
 useEffect,
 useRef,
 useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

import { emailSchema } from "@/lib/schemas/cuenta";
import { useOnboardingStore } from "@/store/onboarding";
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
 const otpRef = useRef<KivoOTPInputHandle>(null);

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
 setTimeout(() => otpRef.current?.focusFirst(), 50);
 } catch {
 setErrorEmail("No pudimos conectar con el servidor. Intenta de nuevo.");
 } finally {
 setEnviandoEmail(false);
 }
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
 <KivoInput
 id="email"
 label="Correo electrónico"
 type="email"
 autoComplete="email"
 placeholder="tunombre@correo.com"
 value={email}
 error={errorEmail ?? undefined}
 onChange={(e) => setEmail(e.target.value)}
 onKeyDown={(e) => {
   if (e.key === "Enter") {
     enviarCodigo();
   }
 }}
 />

 <div className="mt-6">
 <KivoButton
 type="button"
 onClick={enviarCodigo}
 loading={enviandoEmail}
 iconLeft={
   <Mail
     className="h-[18px] w-[18px]"
     strokeWidth={2.5}
   />
 }
>
 Enviar código
</KivoButton>
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

 <KivoOTPInput
 ref={otpRef}
 value={digitos.join("")}
 onChange={(codigo) => {
   setDigitos(
     Array.from(
       { length: 6 },
       (_, index) =>
         codigo[index] ?? "",
     ),
   );
 }}
 error={errorOtp ?? undefined}
 className="mt-4"
/>

 <div className="mt-6 flex flex-wrap items-center gap-4">
 <KivoButton
 type="button"
 onClick={verificarCodigo}
 loading={verificando}
 iconLeft={
   <ShieldCheck
     className="h-[18px] w-[18px]"
     strokeWidth={2.5}
   />
 }
 iconRight={
   <ArrowRight
     className="h-4 w-4"
     strokeWidth={2.5}
   />
 }
>
 Verificar
</KivoButton>

 <KivoButton
 type="button"
 variant="ghost"
 size="sm"
 onClick={enviarCodigo}
 loading={enviandoEmail}
 disabled={cooldown > 0}
 className="
   px-2
   hover:bg-transparent
   hover:underline
 "
>
 {cooldown > 0
   ? `Reenviar código (${cooldown}s)`
   : "Reenviar código"}
</KivoButton>
 </div>

 <KivoButton
 type="button"
 variant="ghost"
 size="sm"
 onClick={() => {
   setEtapa("email");
   setErrorOtp(null);
 }}
 className="
   mt-3
   px-2
   text-xs
   text-muted
   hover:bg-transparent
   hover:text-primary
 "
>
 ¿Correo equivocado? Cambiar
</KivoButton>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}