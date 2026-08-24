export type KivoLoanSummaryItem = {
  label: string;
  value: string;
  emphasis?: boolean;
};

export interface KivoLoanSummaryProps {
  items: KivoLoanSummaryItem[];
}

export function KivoLoanSummary({
  items,
}: KivoLoanSummaryProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-5 border-b border-border px-5 py-4 last:border-b-0"
        >
          <span className="text-sm text-body">
            {item.label}
          </span>

          <span
            className={
              item.emphasis
                ? "text-lg font-bold tabular-nums text-ink"
                : "font-semibold tabular-nums text-ink"
            }
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
