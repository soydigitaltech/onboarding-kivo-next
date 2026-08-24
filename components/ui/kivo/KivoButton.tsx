"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import {
  LoaderCircle,
} from "lucide-react";

import {
  cn,
} from "@/lib/cn";

export type KivoButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

export type KivoButtonSize =
  | "sm"
  | "md"
  | "lg";

export interface KivoButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: KivoButtonVariant;
  size?: KivoButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-dark focus-visible:ring-accent/35",

  secondary:
    "border-2 border-primary bg-white text-primary hover:bg-surface-blue focus-visible:ring-primary/20",

  ghost:
    "bg-transparent text-primary hover:bg-surface-blue focus-visible:ring-primary/20",

  danger:
    "bg-error text-white hover:bg-error/90 focus-visible:ring-error/20",
};

const sizes = {
  sm:
    "min-h-9 rounded-lg px-3 text-[13px]",

  md:
    "min-h-12 rounded-xl px-6 text-[15px]",

  lg:
    "min-h-14 rounded-xl px-7 text-base",
};

export function KivoButton({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: KivoButtonProps) {
  const isDisabled =
    disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={
        loading || undefined
      }
      className={cn(
        "inline-flex items-center justify-center gap-2.5",
        "font-bold transition-colors",
        "focus:outline-none",
        "focus-visible:ring-4",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <LoaderCircle
          size={18}
          className="animate-spin"
        />
      ) : (
        iconLeft
      )}

      <span>{children}</span>

      {!loading
        ? iconRight
        : null}
    </button>
  );
}
