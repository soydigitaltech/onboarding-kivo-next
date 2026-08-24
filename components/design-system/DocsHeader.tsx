type DocsHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function DocsHeader({
  eyebrow,
  title,
  description,
}: DocsHeaderProps) {
  return (
    <header className="mb-12 border-b border-border pb-10">
      {eyebrow ? (
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-primary">
          {eyebrow}
        </div>
      ) : null}

      <h1 className="max-w-4xl text-4xl font-bold tracking-[-0.04em] text-ink md:text-5xl">
        {title}
      </h1>

      <p className="mt-5 max-w-3xl text-base leading-7 text-body md:text-lg md:leading-8">
        {description}
      </p>
    </header>
  );
}
