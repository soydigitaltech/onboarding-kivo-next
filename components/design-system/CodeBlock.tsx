"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export default function CodeBlock({
  code,
  language = "tsx",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#0D1117]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
          {language}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copiado
            </>
          ) : (
            <>
              <Copy size={14} />
              Copiar
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto p-5 text-[13px] leading-6 text-[#E6EDF3]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
