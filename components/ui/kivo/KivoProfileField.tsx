import type {
  ReactNode,
} from "react";

export interface KivoProfileFieldProps {
  label: string;
  value?: ReactNode;
  emptyText?: string;
}

export function KivoProfileField({
  label,
  value,
  emptyText = "No registrado",
}: KivoProfileFieldProps) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    value !== "";

  return (
    <div>
      <div className="text-xs font-semibold text-muted">
        {label}
      </div>

      <div
        className={
          hasValue
            ? "mt-1 font-semibold text-ink"
            : "mt-1 text-sm italic text-placeholder"
        }
      >
        {hasValue
          ? value
          : emptyText}
      </div>
    </div>
  );
}
