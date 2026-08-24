import type { ReactNode } from "react";
import CodeBlock from "./CodeBlock";

type ComponentExampleProps = {
  title: string;
  description?: string;
  children: ReactNode;
  code: string;
  language?: string;
};

export default function ComponentExample({
  title,
  description,
  children,
  code,
  language = "tsx",
}: ComponentExampleProps) {
  return (
    <div className="mb-10 overflow-hidden rounded-2xl border border-border">
      <div className="border-b border-border bg-white px-6 py-5">
        <h3 className="text-lg font-bold text-ink">{title}</h3>

        {description ? (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-body">
            {description}
          </p>
        ) : null}
      </div>

      <div className="bg-surface p-6 md:p-8">
        {children}
      </div>

      <div className="border-t border-border bg-white p-4">
        <CodeBlock code={code} language={language} />
      </div>
    </div>
  );
}
