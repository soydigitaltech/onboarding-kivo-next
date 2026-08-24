import type { ReactNode } from "react";

export interface KivoOnboardingLayoutProps {
  header?: ReactNode;
  progress?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}

export function KivoOnboardingLayout({
  header,
  progress,
  children,
  actions,
}: KivoOnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {header ? (
          <div>{header}</div>
        ) : null}

        {progress ? (
          <div className="mt-6">
            {progress}
          </div>
        ) : null}

        <main className="flex-1 py-8">
          {children}
        </main>

        {actions ? (
          <div className="sticky bottom-0 -mx-4 border-t border-border bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
