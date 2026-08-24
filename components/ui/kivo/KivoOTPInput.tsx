"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import { cn } from "@/lib/cn";


export interface KivoOTPInputHandle {
  focusFirst: () => void;
}


export interface KivoOTPInputProps {
  value: string;

  onChange: (
    value: string,
  ) => void;

  length?: number;

  disabled?: boolean;

  error?: string;

  ariaLabel?: string;

  className?: string;
}


export const KivoOTPInput =
  forwardRef<
    KivoOTPInputHandle,
    KivoOTPInputProps
  >(function KivoOTPInput(
    {
      value,
      onChange,
      length = 6,
      disabled = false,
      error,
      ariaLabel = "Código de verificación",
      className,
    },
    ref,
  ) {
    const refs = useRef<
      Array<HTMLInputElement | null>
    >([]);


    const digits = Array.from(
      {
        length,
      },
      (_, index) =>
        value[index] ?? "",
    );


    useImperativeHandle(
      ref,
      () => ({
        focusFirst() {
          refs.current[0]?.focus();
        },
      }),
      [],
    );


    function updateDigit(
      index: number,
      nextDigit: string,
    ) {
      const cleanDigit =
        nextDigit
          .replace(/\D/g, "")
          .slice(-1);

      const next = [
        ...digits,
      ];

      next[index] =
        cleanDigit;

      onChange(
        next.join(""),
      );


      if (
        cleanDigit &&
        index <
          length - 1
      ) {
        refs.current[
          index + 1
        ]?.focus();
      }
    }


    function handleKeyDown(
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>,
    ) {
      if (
        event.key ===
          "Backspace" &&
        !digits[index] &&
        index > 0
      ) {
        refs.current[
          index - 1
        ]?.focus();
      }
    }


    function handlePaste(
      event: React.ClipboardEvent<HTMLInputElement>,
    ) {
      event.preventDefault();

      const pasted =
        event.clipboardData
          .getData("text")
          .replace(/\D/g, "")
          .slice(
            0,
            length,
          );

      if (!pasted) {
        return;
      }

      onChange(
        pasted,
      );

      refs.current[
        Math.min(
          pasted.length,
          length - 1,
        )
      ]?.focus();
    }


    return (
      <div
        className={
          className
        }
      >
        <div
          className="
            flex flex-wrap
            gap-2.5
          "
          role="group"
          aria-label={
            ariaLabel
          }
        >
          {digits.map(
            (
              digit,
              index,
            ) => (
              <input
                key={index}
                ref={(
                  element,
                ) => {
                  refs.current[
                    index
                  ] =
                    element;
                }}
                type="text"
                value={
                  digit
                }
                disabled={
                  disabled
                }
                inputMode="numeric"
                autoComplete={
                  index === 0
                    ? "one-time-code"
                    : "off"
                }
                maxLength={1}
                aria-label={`Dígito ${
                  index + 1
                } de ${length}`}
                aria-invalid={
                  error
                    ? true
                    : undefined
                }
                onChange={(
                  event,
                ) =>
                  updateDigit(
                    index,
                    event
                      .target
                      .value,
                  )
                }
                onKeyDown={(
                  event,
                ) =>
                  handleKeyDown(
                    index,
                    event,
                  )
                }
                onPaste={
                  handlePaste
                }
                className={cn(
                  "h-14 w-12 rounded-xl border-2 bg-white",
                  "text-center text-xl font-extrabold tabular-nums text-ink",
                  "outline-none transition",
                  "focus:border-primary focus:ring-4 focus:ring-primary/15",
                  "disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted",
                  error
                    ? "border-error"
                    : "border-border",
                )}
              />
            ),
          )}
        </div>


        {error ? (
          <p
            role="alert"
            className="
              mt-3
              text-xs
              font-semibold
              text-error
            "
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  });
