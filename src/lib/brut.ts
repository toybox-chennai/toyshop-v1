import { cn } from "@/lib/utils";

/**
 * Shared Neobrutalism building blocks: square corners, 2px black borders,
 * hard offset shadows, and a tactile "press" effect on interactive elements.
 * Kept in one place so every surface stays visually consistent.
 */

export const shadowBrut = "shadow-[4px_4px_0_0_#000]";
export const shadowBrutSm = "shadow-[2px_2px_0_0_#000]";
export const shadowBrutLg = "shadow-[8px_8px_0_0_#000]";

/** Solid black button that physically presses into the page. */
export const btnBrut = cn(
  "inline-flex items-center justify-center gap-2 rounded-none border-2 border-black",
  "font-black uppercase tracking-wide transition-all duration-100",
  shadowBrut,
  "hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[1px_1px_0_0_#000]",
  "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
);

/** Outlined button; hover floods it with a flat yellow block. */
export const btnBrutGhost = cn(
  btnBrut,
  "bg-card text-foreground hover:bg-pop-yellow",
);

/** Flat bordered panel with a hard shadow. */
export const cardBrut = cn(
  "rounded-none border-2 border-black bg-card",
  shadowBrut,
);

/** Square, thick-bordered form control with a hard shadow. */
export const inputBrut = cn(
  "h-11 w-full rounded-none border-2 border-black bg-white px-3 text-base font-semibold",
  "shadow-[3px_3px_0_0_#000] outline-none transition-shadow",
  "placeholder:font-medium placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/40",
);

/** Small uppercase pill-free label chip (square, bordered). */
export const chipBrut =
  "inline-flex w-fit items-center gap-1 border-2 border-black bg-card px-2 py-0.5 text-[11px] font-black uppercase tracking-wide";
