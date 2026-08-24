import { cn } from "@/lib/cn";

export interface KivoProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
}

export function KivoProgress({
  value,
  max = 100,
  showLabel = false,
  className,
}: KivoProgressProps) {
  const safeValue = Math.min(
    Math.max(value, 0),
    max,
  );

  const percent =
    max > 0
      ? Math.round(
          (safeValue / max) * 100,
        )
      : 0;

  return (
    <div className={cn("w-full", className)}>
      {showLabel ? (
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted">
          <span>Progreso</span>
          <span>{percent}%</span>
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={safeValue}
        className="h-2 overflow-hidden rounded-full bg-border-soft"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}
