"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useId } from "react";

export type CustomSelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  id?: string;
  value?: string;
  options: readonly CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  tabIndex?: number;
  ariaLabel?: string;
};

export function CustomSelect({
  id,
  value = "",
  options,
  placeholder = "Selecciona una opción",
  disabled = false,
  onChange,
  onBlur,
  tabIndex,
  ariaLabel,
}: CustomSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <Select.Root
      value={value || undefined}
      onValueChange={onChange}
      disabled={disabled}
    >
      <Select.Trigger
        id={selectId}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        onBlur={onBlur}
        className="
          flex min-h-12 w-full cursor-pointer
          items-center justify-between gap-4
          rounded-[16px] bg-white px-4
          text-left text-sm font-semibold text-[#071A25]
          outline-none
          ring-1 ring-inset ring-[#DCE7EC]
          transition
          hover:ring-[#9EDFFF]
          focus:ring-2 focus:ring-[#03AEFE]
          data-[disabled]:cursor-not-allowed
          data-[disabled]:opacity-45
          data-[placeholder]:text-[#8A9AA6]
        "
      >
        <Select.Value placeholder={placeholder} />

        <Select.Icon asChild>
          <span
            className="
              grid h-8 w-8 shrink-0 place-items-center
              rounded-full bg-[#E9F7FF] text-[#075578]
            "
          >
            <ChevronDown
              className="h-4 w-4"
              strokeWidth={2.3}
            />
          </span>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          collisionPadding={16}
          avoidCollisions
          className="
            z-[9999]
            min-w-[var(--radix-select-trigger-width)]
            max-w-[calc(100vw-24px)]
            overflow-hidden
            rounded-[18px]
            bg-white
            ring-1 ring-inset ring-[#DCE7EC]
          "
        >
          <Select.Viewport className="p-2">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="
                  relative flex min-h-11
                  cursor-pointer select-none
                  items-center justify-between gap-4
                  rounded-[13px] px-3.5
                  text-sm font-semibold text-[#071A25]
                  outline-none
                  transition-colors
                  data-[highlighted]:bg-[#E9F7FF]
                  data-[highlighted]:font-bold
                  data-[highlighted]:text-[#075578]
                  data-[state=checked]:bg-[#03AEFE]
                  data-[state=checked]:font-extrabold
                  data-[state=checked]:text-white
                "
              >
                <Select.ItemText>
                  {option.label}
                </Select.ItemText>

                <Select.ItemIndicator asChild>
                  <Check
                    className="h-4 w-4 shrink-0"
                    strokeWidth={3}
                  />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
