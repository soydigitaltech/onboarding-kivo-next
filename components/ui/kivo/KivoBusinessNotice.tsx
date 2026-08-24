import type {
  ReactNode,
} from "react";

import {
  TriangleAlert,
} from "lucide-react";

export interface KivoBusinessNoticeProps {
  children: ReactNode;
}

export function KivoBusinessNotice({
  children,
}: KivoBusinessNoticeProps) {
  return (
    <div
      role="status"
      className="
        flex items-start gap-3
        rounded-xl
        border border-warning-border
        bg-warning-bg
        px-4 py-3
      "
    >
      <TriangleAlert
        className="
          mt-0.5 h-4 w-4 shrink-0
          text-warning
        "
      />

      <div
        className="
          text-[13px] leading-5
          text-ink-soft
        "
      >
        {children}
      </div>
    </div>
  );
}
