import Image from "next/image";

import { cn } from "@/lib/cn";

export type KivoLogoVariant =
  | "primary"
  | "dashboard";

export type KivoLogoSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

export interface KivoLogoProps {
  variant?: KivoLogoVariant;
  size?: KivoLogoSize;
  className?: string;
  priority?: boolean;
}

const sizes: Record<
  KivoLogoSize,
  {
    width: number;
    height: number;
    className: string;
  }
> = {
  sm: {
    width: 90,
    height: 32,
    className: "h-7 w-auto",
  },

  md: {
    width: 130,
    height: 42,
    className: "h-9 w-auto",
  },

  lg: {
    width: 170,
    height: 54,
    className: "h-12 w-auto",
  },

  xl: {
    width: 220,
    height: 72,
    className: "h-16 w-auto",
  },
};

const sources: Record<
  KivoLogoVariant,
  string
> = {
  primary: "/kivo.svg",
  dashboard: "/kivo-tablero.svg",
};

export function KivoLogo({
  variant = "primary",
  size = "md",
  className,
  priority = false,
}: KivoLogoProps) {
  const config = sizes[size];

  return (
    <Image
      src={sources[variant]}
      alt="Kivo"
      width={config.width}
      height={config.height}
      priority={priority}
      className={cn(
        "object-contain object-left",
        config.className,
        className,
      )}
    />
  );
}
