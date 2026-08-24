"use client";

import {
  Phone,
} from "lucide-react";

import {
  KivoInput,
  type KivoInputProps,
} from "./KivoInput";

export type KivoPhoneInputProps =
  Omit<KivoInputProps, "type" | "leadingIcon">;

export function KivoPhoneInput(
  props: KivoPhoneInputProps,
) {
  return (
    <KivoInput
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      leadingIcon={
        <Phone size={18} />
      }
      {...props}
    />
  );
}
