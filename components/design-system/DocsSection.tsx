import type { ReactNode } from "react";

type DocsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function DocsSection({
  title,
  description,
  children,
}: DocsSectionProps) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-[-0.025em] text-ink">
          {title}
        </h2>

        {description ? (
          <p className="mt-2 max-w-3xl leading-7 text-body">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}
