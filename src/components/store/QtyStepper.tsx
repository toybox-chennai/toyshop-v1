import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { shadowBrutSm } from "@/lib/brut";

/**
 * Square, hard-bordered quantity stepper shared by product cards and the
 * cart drawer. Compact variant is used inside cards.
 */
export function QtyStepper({
  qty,
  onChange,
  compact = false,
  label,
}: {
  qty: number;
  onChange: (next: number) => void;
  compact?: boolean;
  /** Accessible name for the row, e.g. the toy's name. */
  label: string;
}) {
  const btn =
    "flex items-center justify-center bg-card font-black transition-colors hover:bg-pop-yellow disabled:opacity-40 disabled:hover:bg-card";
  const size = compact ? "size-8" : "size-10";

  return (
    <div
      role="group"
      aria-label={`Quantity of ${label}`}
      className={cn(
        "inline-flex items-center border-2 border-black bg-card",
        compact ? shadowBrutSm : "shadow-[3px_3px_0_0_#000]",
      )}
    >
      <button
        type="button"
        aria-label={`Decrease quantity of ${label}`}
        className={cn(btn, size, "border-r-2 border-black")}
        onClick={() => onChange(qty - 1)}
      >
        <Minus className={compact ? "size-3.5" : "size-4"} strokeWidth={3} />
      </button>
      <span
        className={cn(
          "px-2 text-center font-black tabular-nums",
          compact ? "min-w-8 text-sm" : "min-w-10 text-base",
        )}
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity of ${label}`}
        className={cn(btn, size, "border-l-2 border-black")}
        onClick={() => onChange(qty + 1)}
        disabled={qty >= 99}
      >
        <Plus className={compact ? "size-3.5" : "size-4"} strokeWidth={3} />
      </button>
    </div>
  );
}
