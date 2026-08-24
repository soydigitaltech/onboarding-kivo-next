"use client";

import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  KivoInput,
  type KivoInputProps,
} from "./KivoInput";

export type KivoPasswordInputProps =
  Omit<
    KivoInputProps,
    "type" | "trailingAction"
  >;

export function KivoPasswordInput(
  props: KivoPasswordInputProps,
) {
  const [
    visible,
    setVisible,
  ] = useState(false);

  return (
    <KivoInput
      type={
        visible
          ? "text"
          : "password"
      }
      autoComplete="current-password"
      trailingAction={
        <button
          type="button"
          aria-label={
            visible
              ? "Ocultar contraseña"
              : "Mostrar contraseña"
          }
          onClick={() =>
            setVisible((current) => !current)
          }
          className="rounded-lg p-1.5 text-muted transition hover:bg-surface hover:text-ink"
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      }
      {...props}
    />
  );
}
