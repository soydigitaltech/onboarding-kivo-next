"use client";

import { ReactNode } from "react";

type TooltipProps = {
 texto: string;
 children: ReactNode;
 posicion?: "top" | "bottom";
};

export default function Tooltip({
 texto,
 children,
 posicion = "top",
}: TooltipProps) {
 return (
 <span className="group/tooltip relative inline-flex">
 {children}

 <span
 role="tooltip"
 className={`pointer-events-none absolute left-1/2 z-[200] -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-3 py-2 text-[11px] font-bold text-white opacity-0 transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 ${
 posicion === "top"
 ? "bottom-[calc(100%+8px)]"
 : "top-[calc(100%+8px)]"
 }`}
 >
 {texto}

 <span
 className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-black ${
 posicion === "top"
 ? "-bottom-1"
 : "-top-1"
 }`}
 />
 </span>
 </span>
 );
}
