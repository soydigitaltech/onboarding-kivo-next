"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
 const router = useRouter();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setIsLoading(true);
 setError("");

 // Simulación de login
 await new Promise(resolve => setTimeout(resolve, 1000));
 
 // Siempre inicia sesión exitosamente (demo)
 router.push("/dashboard");
 };

 return (
 <main className="flex min-h-dvh w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
 {/* Header */}
 <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 sm:px-8">
 <Link href="/">
 <img src="/kivo.svg" alt="Kivo" className="h-9 w-auto" />
 </Link>

 <Link
 href="/registro"
 className="inline-flex min-h-11 items-center rounded-xl border border-[#E9F0F6] bg-white px-4 text-sm font-bold text-black transition-colors hover:bg-[#F5F9FC]"
 >
 Regístrate
 </Link>
 </header>

 {/* Logo central */}
 <Link href="/">
 <img src="/kivo.svg" alt="Kivo" className="h-16 w-auto" />
 </Link>

 <motion.div
 initial={{ opacity: 0, y: 14 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
 className="mt-7 w-full max-w-md rounded-[28px] bg-white p-6 sm:p-8"
 >
 <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
 Bienvenido de vuelta
 </p>
 <h1 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
 Inicia sesión en tu cuenta
 </h1>

 <form onSubmit={handleSubmit} className="mt-6 space-y-4">
 {error && (
 <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
 {error}
 </div>
 )}

 <div>
 <label htmlFor="email" className="text-sm font-extrabold text-ink">
 Correo electrónico
 </label>
 <input
 id="email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 placeholder="ejemplo@correo.com"
 className="mt-1.5 w-full rounded-xl border border-[#E9F0F6] px-4 py-3 text-sm text-ink placeholder:text-[#9DAEBF] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
 />
 </div>

 <div>
 <label htmlFor="password" className="text-sm font-extrabold text-ink">
 Contraseña
 </label>
 <div className="relative mt-1.5">
 <input
 id="password"
 type={showPassword ? "text" : "password"}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 placeholder="••••••••"
 className="w-full rounded-xl border border-[#E9F0F6] px-4 py-3 pr-12 text-sm text-ink placeholder:text-[#9DAEBF] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DAEBF] hover:text-ink"
 >
 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
 </button>
 </div>
 <Link
 href="/recuperar-contrasena"
 className="mt-1.5 block text-right text-xs font-bold text-primary hover:underline"
 >
 ¿Olvidaste tu contraseña?
 </Link>
 </div>

 <button
 type="submit"
 disabled={isLoading}
 className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
 </button>
 </form>

 <p className="mt-6 text-center text-xs text-muted">
 ¿No tienes una cuenta?{" "}
 <Link href="/registro" className="font-bold text-primary hover:underline">
 Regístrate aquí
 </Link>
 </p>
 </motion.div>

 <div className="mt-6 flex items-center gap-2 text-xs text-muted">
 <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-cerulean" />
 <span>Tu información está segura y protegida.</span>
 </div>
 </main>
 );
}