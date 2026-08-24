import type {
  ReactNode,
} from "react";

import {
  OctagonX,
} from "lucide-react";

export interface KivoDangerNoticeProps {
  title: string;
  children: ReactNode;
}

export function KivoDangerNotice({
  title,
  children,
}: KivoDangerNoticeProps) {
  return (
    <div
      role="alert"
      className="
        flex items-start gap-3
        rounded-xl
        border border-error/25
        bg-error/5
        px-4 py-3.5
      "
    >
      <span
        className="
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-full
          bg-error/10 text-error
        "
      >
        <OctagonX className="h-[18px] w-[18px]" />
      </span>

      <div>
        <p className="text-sm font-bold text-ink-soft">
          {title}
        </p>

        <div className="mt-0.5 text-[13px] leading-5 text-body">
          {children}
        </div>
      </div>
    </div>
  );
}
