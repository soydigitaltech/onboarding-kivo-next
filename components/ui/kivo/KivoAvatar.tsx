import Image from "next/image";

import {
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/cn";

export type KivoAvatarSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

export interface KivoAvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: KivoAvatarSize;
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function KivoAvatar({
  src,
  alt = "Avatar",
  initials,
  size = "md",
  className,
}: KivoAvatarProps) {
  if (src) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full bg-surface",
          sizes[size],
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-label={alt}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-surface-blue font-bold text-primary-dark",
        sizes[size],
        className,
      )}
    >
      {initials ? (
        initials.slice(0, 2).toUpperCase()
      ) : (
        <UserRound
          size={size === "xl" ? 28 : 18}
        />
      )}
    </div>
  );
}
