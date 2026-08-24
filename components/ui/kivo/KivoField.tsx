import type {
  ReactNode,
} from "react";

export interface KivoFieldProps {
  label: string;

  htmlFor: string;

  error?: string;

  helper?: string;

  required?: boolean;

  children: ReactNode;
}

export function KivoField({
  label,
  htmlFor,
  error,
  helper,
  required = false,
  children,
}: KivoFieldProps) {
  const errorId =
    `${htmlFor}-error`;

  const helperId =
    `${htmlFor}-helper`;

  return (
    <div className="w-full">
      <label
        htmlFor={htmlFor}
        className="
          mb-1.5 block
          text-sm font-bold text-ink
        "
      >
        {label}

        {required ? (
          <span
            aria-hidden="true"
            className="ml-1 text-error"
          >
            *
          </span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="
            mt-1.5
            text-xs font-semibold
            text-error
          "
        >
          {error}
        </p>
      ) : helper ? (
        <p
          id={helperId}
          className="
            mt-2
            text-xs leading-5
            text-muted
          "
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
}
