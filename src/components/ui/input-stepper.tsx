import * as React from "react";

import { cn } from "@/lib/utils";

type InputStepperProps = React.ComponentProps<"input"> & {
  onDecrease?: () => void;
  onIncrease?: () => void;
};

const InputStepper = React.forwardRef<HTMLInputElement, InputStepperProps>(
  (
    { className, type = "number", onDecrease, onIncrease, disabled, ...props },
    ref,
  ) => {
    const btn =
      "absolute top-1/2 -translate-y-1/2 z-10 size-9 shrink-0 rounded-lg bg-brand-tertiary " +
      "flex items-center justify-center text-white text-2xl leading-none select-none " +
      "transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-50 disabled:pointer-events-none";

    return (
      <div className="relative w-full">
        <button
          type="button"
          aria-label="Decrease"
          onClick={onDecrease}
          disabled={disabled}
          className={cn(btn, "left-2.5")}
        >
          −
        </button>

        <input
          type={type}
          ref={ref}
          disabled={disabled}
          data-slot="input"
          className={cn(
            "h-12.5 w-full min-w-0 rounded-lg border border-input bg-white py-3 text-base transition-colors outline-none",
            "px-14 text-center tabular-nums",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            "placeholder:text-muted-foreground",
            "focus-visible:border-input-focus focus-visible:ring-3 focus-visible:ring-input-focus-ring",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            "dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            className,
          )}
          {...props}
        />

        <button
          type="button"
          aria-label="Increase"
          onClick={onIncrease}
          disabled={disabled}
          className={cn(btn, "right-2.5")}
        >
          +
        </button>
      </div>
    );
  },
);

InputStepper.displayName = "InputStepper";

export { InputStepper };
