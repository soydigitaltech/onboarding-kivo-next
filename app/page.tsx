import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-soft px-5 py-4 sm:px-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kivo.svg" alt="Kivo" className="h-12 w-auto" />

        <div className="flex items-center gap-3">
          {/* Ingresar - fondo blanco, texto negro, va al login */}
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center rounded-xl border border-[#E9F0F6] bg-white px-4 text-sm font-bold text-black transition-colors hover:bg-[#F5F9FC]"
          >
            Ingresar
          </Link>
        </div>
      </header>

      {/* Hero con imagen incluida */}
      <section className="flex-1 bg-primary px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          {/* Texto */}
          <div className="text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
              Préstamos en línea
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Encuentra la cuota que se ajusta a tu bolsillo
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/85">
              Simula tu préstamo, conoce tu cuota al instante y completa tu
              solicitud en minutos, sin filas ni papeleo.
            </p>
            <p className="mt-6 text-sm font-semibold italic text-white/70">
              Simple, transparente y pensado para ti.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white p-7 text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] sm:p-9">
            <p className="text-2xl font-extrabold tracking-tight text-primary">
              ¡Empecemos!
            </p>
            <p className="mt-2 text-sm leading-6 text-body">
              Crea tu cuenta gratis y simula tu préstamo en minutos.
            </p>
            <Link
              href="/onboarding"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:brightness-105 shadow-[0_12px_24px_-14px_rgba(254,152,6,0.4)]"
            >
              Regístrate gratis
              <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
            </Link>
            <p className="mt-3 text-xs text-muted">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Ingresa aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Imagen de Kivo Metas - sin borde */}
        <div className="mx-auto mt-16 max-w-6xl">
          <img
            src="/kivo-metas.png"
            alt="Kivo Metas"
            className="w-full h-auto"
          />
        </div>
      </section>
    </div>
  );
}