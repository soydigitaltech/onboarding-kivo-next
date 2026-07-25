"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { OctagonX, TriangleAlert } from "lucide-react";

export const inputClassName =
  "h-12 w-full min-w-0 rounded-xl border-2 border-border bg-white px-4 text-[15px] font-medium text-ink outline-none transition placeholder:font-normal placeholder:text-placeholder focus:border-primary focus:ring-4 focus:ring-primary/15";

export const selectClassName = `${inputClassName} appearance-none pr-10`;

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

/** Envuelve un control con su label y su mensaje de error. */
export function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-bold text-ink"
      >
        {label}
      </label>

      {children}

      {error ? (
        <p className="mt-1.5 text-xs font-semibold text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Input con prefijo fijo (Bs, +591...). */
export function PrefixedInputShell({
  prefix,
  children,
}: {
  prefix: string;
  children: ReactNode;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border-2 border-border bg-white transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
      <span className="flex items-center border-r-2 border-border bg-surface px-3.5 text-sm font-bold text-ink-soft">
        {prefix}
      </span>
      {children}
    </div>
  );
}

export const prefixedInputClassName =
  "h-12 w-full min-w-0 bg-transparent px-4 text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-placeholder";

/** Flecha del select (los nativos no se estilizan solos). */
export function SelectChevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Aviso ámbar para reglas de negocio (cobertura, requisitos...). */
export function BusinessNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-warning-border bg-warning-bg px-4 py-3"
    >
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="text-[13px] leading-5 text-ink-soft">{children}</p>
    </div>
  );
}

/** Aviso rojo para descartes definitivos (central de riesgos, +3 deudas). */
export function DangerNotice({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-error/25 bg-error/5 px-4 py-3.5"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
        <OctagonX className="h-4.5 w-4.5" />
      </span>
      <div>
        <p className="text-sm font-bold text-ink-soft">{title}</p>
        <p className="mt-0.5 text-[13px] leading-5 text-body">{children}</p>
      </div>
    </div>
  );
}

/** Input con sufijo fijo (meses, %, ...). */
export function SuffixedInputShell({
  suffix,
  children,
}: {
  suffix: string;
  children: ReactNode;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border-2 border-border bg-white transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
      {children}
      <span className="flex items-center border-l-2 border-border bg-surface px-3.5 text-sm font-bold text-ink-soft">
        {suffix}
      </span>
    </div>
  );
}

/**
 * Opción tipo píldora para grupos de radio (Sí/No, cantidades...).
 * El input queda oculto y el estilo reacciona con has-[:checked].
 */
export function RadioPill({
  label,
  inputProps,
}: {
  label: string;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-xl border-2 border-border bg-white px-4 text-sm font-bold text-ink-soft transition hover:border-primary/60 has-[:checked]:border-primary has-[:checked]:bg-surface-blue has-[:checked]:text-primary has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20">
      <input type="radio" className="sr-only" {...inputProps} />
      {label}
    </label>
  );
}
