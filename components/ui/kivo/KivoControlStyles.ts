/**
 * Estilos base para controles nativos que, por razones de
 * integración, todavía no pueden utilizar KivoInput directamente.
 *
 * Para formularios nuevos, preferir KivoInput.
 */
export const kivoInputClassName =
  "h-12 w-full min-w-0 rounded-xl border-2 border-border bg-white px-4 text-[15px] font-medium text-ink outline-none transition placeholder:font-normal placeholder:text-placeholder focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60";

/**
 * Control utilizado dentro de KivoAffixedInput.
 */
export const kivoAffixedControlClassName =
  "h-12 w-full min-w-0 bg-transparent px-4 text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-placeholder";
