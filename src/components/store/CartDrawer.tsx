import { useMemo } from "react";
import { ArrowRight, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { btnBrut } from "@/lib/brut";
import { FREE_SHIP_THRESHOLD, inr } from "@/data/toys";
import { useCart } from "@/hooks/use-cart";
import { QtyStepper } from "@/components/store/QtyStepper";
import { ToyArt } from "@/components/store/ToyArt";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const POP_BG = {
  yellow: "bg-pop-yellow",
  blue: "bg-pop-blue",
  red: "bg-pop-red",
  mint: "bg-pop-mint",
} as const;

/**
 * Slide-over cart. Opened from the header on every page; the checkout CTA
 * routes to /checkout.
 */
export function CartDrawer() {
  const {
    lines,
    count,
    subtotal,
    shipping,
    total,
    isCartOpen,
    closeCart,
    setQty,
    remove,
  } = useCart();
  const navigate = useNavigate();

  const remainingForFreeShip = useMemo(
    () => Math.max(0, FREE_SHIP_THRESHOLD - subtotal),
    [subtotal],
  );
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIP_THRESHOLD) * 100));

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full rounded-none border-l-2 border-black bg-background p-0 shadow-none sm:max-w-md"
      >
        <SheetHeader className="flex-row items-center justify-between border-b-2 border-black bg-pop-yellow px-5 py-4">
          <div>
            <SheetTitle className="text-lg font-black uppercase tracking-tight">
              Your cart ({count})
            </SheetTitle>
            <SheetDescription className="text-xs font-semibold uppercase tracking-wide">
              Demo store · UPI &amp; card checkout
            </SheetDescription>
          </div>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <div className="flex size-16 items-center justify-center border-2 border-black bg-muted">
              <X className="size-7" strokeWidth={3} />
            </div>
            <div>
              <p className="font-black uppercase tracking-tight">
                Nothing in the cart
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Go pick something worth playing with.
              </p>
            </div>
            <button
              type="button"
              className={cn(btnBrut, "bg-foreground px-5 py-2.5 text-sm text-white")}
              onClick={() => {
                closeCart();
                navigate("/shop");
              }}
            >
              Browse toys
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map(({ toy, qty }) => (
                <div
                  key={toy.id}
                  className="flex gap-3 border-2 border-black bg-card p-3 shadow-[3px_3px_0_0_#000]"
                >
                  <div
                    className={cn(
                      "flex size-16 shrink-0 items-center justify-center border-2 border-black",
                      POP_BG[toy.pop],
                    )}
                  >
                    <ToyArt art={toy.art} pop={toy.pop} className="w-11" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black uppercase leading-tight">
                          {toy.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inr(toy.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${toy.name} from cart`}
                        className="shrink-0 border-2 border-black bg-card p-1 transition-colors hover:bg-pop-red"
                        onClick={() => remove(toy.id)}
                      >
                        <Trash2 className="size-3.5" strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      <QtyStepper
                        compact
                        qty={qty}
                        label={toy.name}
                        onChange={(next) => setQty(toy.id, next)}
                      />
                      <span className="text-sm font-black tabular-nums">
                        {inr(toy.price * qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t-2 border-black bg-background px-5 py-4">
              {remainingForFreeShip > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide">
                    Add <span className="text-pop-blue">{inr(remainingForFreeShip)}</span>{" "}
                    more for free shipping
                  </p>
                  <div className="h-3 border-2 border-black bg-muted">
                    <div
                      className="h-full bg-pop-blue transition-[width] duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="border-2 border-black bg-pop-mint px-2 py-1.5 text-[11px] font-black uppercase tracking-wide">
                  Free shipping unlocked ✓
                </p>
              )}

              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="font-semibold text-muted-foreground">Subtotal</dt>
                  <dd className="font-bold tabular-nums">{inr(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold text-muted-foreground">Shipping</dt>
                  <dd className="font-bold tabular-nums">
                    {shipping === 0 ? "FREE" : inr(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t-2 border-black pt-2 text-base">
                  <dt className="font-black uppercase">Total</dt>
                  <dd className="font-black tabular-nums">{inr(total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                className={cn(btnBrut, "h-12 w-full bg-foreground text-sm text-white")}
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
              >
                Checkout · {inr(total)}
                <ArrowRight className="size-4" strokeWidth={3} />
              </button>
              <p className="text-center text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Demo checkout — no real payment is taken
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
