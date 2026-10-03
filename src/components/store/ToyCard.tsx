import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { shadowBrut } from "@/lib/brut";
import { CATEGORY_LABEL, inr, type Toy } from "@/data/toys";
import { useCart } from "@/hooks/use-cart";
import { QtyStepper } from "@/components/store/QtyStepper";
import { ToyArt } from "@/components/store/ToyArt";

const POP_BG: Record<Toy["pop"], string> = {
  yellow: "bg-pop-yellow",
  blue: "bg-pop-blue",
  red: "bg-pop-red",
  mint: "bg-pop-mint",
};

/**
 * The shop's core unit: a flat colour block of art on top, product info
 * below, and an add-to-cart button that swaps into a quantity stepper.
 */
export function ToyCard({ toy }: { toy: Toy }) {
  const { qtyOf, add, setQty } = useCart();
  const qty = qtyOf(toy.id);

  return (
    <article
      className={cn(
        "group flex h-full flex-col border-2 border-black bg-card transition-transform duration-150",
        shadowBrut,
        "hover:-translate-x-[2px] hover:-translate-y-[2px]",
        "hover:shadow-[6px_6px_0_0_#000] focus-within:-translate-x-[2px] focus-within:-translate-y-[2px]",
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center border-b-2 border-black p-5",
          POP_BG[toy.pop],
        )}
      >
        <span className="absolute left-0 top-0 border-b-2 border-r-2 border-black bg-foreground px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
          {CATEGORY_LABEL[toy.category]}
        </span>
        {toy.badge && (
          <span className="absolute right-0 top-0 border-b-2 border-l-2 border-black bg-card px-2 py-1 text-[10px] font-black uppercase tracking-wider">
            {toy.badge}
          </span>
        )}
        <ToyArt
          art={toy.art}
          pop={toy.pop}
          className="mt-6 w-28 transition-transform duration-150 group-hover:-rotate-2 sm:w-32"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-black uppercase leading-tight tracking-tight">
            {toy.name}
          </h3>
          <span className="shrink-0 border-2 border-black bg-pop-mint px-1.5 py-0.5 text-[10px] font-black uppercase">
            {toy.age}
          </span>
        </div>
        <p className="text-xs leading-snug text-muted-foreground">
          {toy.tagline}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="text-2xl font-black leading-none tracking-tight">
            {inr(toy.price)}
          </span>
          {qty === 0 ? (
            <button
              type="button"
              className={cn(
                "inline-flex h-9 items-center gap-1.5 border-2 border-black bg-foreground px-3",
                "text-xs font-black uppercase tracking-wide text-white transition-all",
                "shadow-[3px_3px_0_0_#000] hover:bg-pop-blue",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#000]",
                "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
              )}
              onClick={() => add(toy.id)}
            >
              <Plus className="size-3.5" strokeWidth={3.5} />
              Add
            </button>
          ) : (
            <QtyStepper
              compact
              qty={qty}
              label={toy.name}
              onChange={(next) => setQty(toy.id, next)}
            />
          )}
        </div>
      </div>
    </article>
  );
}
