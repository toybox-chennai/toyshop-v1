import { LogOut, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { btnBrut, btnBrutGhost, shadowBrutSm } from "@/lib/brut";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/store/CartDrawer";

/** Pixel-block logo mark; exported so the footer can reuse it. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x={2} y={2} width={28} height={28} fill="#ffd23f" stroke="#000" strokeWidth={3} />
      <rect x={7} y={7} width={7.5} height={7.5} fill="#000" />
      <rect x={17.5} y={7} width={7.5} height={7.5} fill="#fff" stroke="#000" strokeWidth={2} />
      <rect x={7} y={17.5} width={7.5} height={7.5} fill="#fff" stroke="#000" strokeWidth={2} />
      <rect x={17.5} y={17.5} width={7.5} height={7.5} fill="#000" />
    </svg>
  );
}

export function SiteHeader() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const { count, openCart } = useCart();
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")[0];

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-black bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5"
          >
            <LogoMark className="size-7" />
            <span className="text-lg font-black uppercase leading-none tracking-tight">
              Toybox
              <span className="text-pop-blue">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/shop"
              className="border-2 border-transparent px-3 py-2 text-xs font-black uppercase tracking-wide hover:border-black hover:bg-pop-yellow"
            >
              Shop
            </Link>
            <Link
              to="/shop?category=stem"
              className="border-2 border-transparent px-3 py-2 text-xs font-black uppercase tracking-wide hover:border-black hover:bg-pop-yellow"
            >
              STEM
            </Link>
            <Link
              to="/shop?category=plush"
              className="border-2 border-transparent px-3 py-2 text-xs font-black uppercase tracking-wide hover:border-black hover:bg-pop-yellow"
            >
              Soft toys
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <span className="h-9 w-20 border-2 border-black bg-muted" aria-hidden="true" />
            ) : isAuthenticated ? (
              <>
                <span className="hidden border-2 border-black bg-pop-mint px-2 py-1.5 text-[11px] font-black uppercase tracking-wide sm:inline-block">
                  Hi {firstName || "friend"}
                </span>
                <button
                  type="button"
                  title="Sign out"
                  aria-label="Sign out"
                  className="flex size-9 items-center justify-center border-2 border-black bg-card transition-colors hover:bg-pop-red"
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                >
                  <LogOut className="size-4" strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className={cn(
                  btnBrutGhost,
                  "h-9 px-3 text-xs shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000]",
                )}
              >
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              className={cn(
                btnBrut,
                "h-9 bg-pop-yellow px-3 text-xs text-foreground",
                shadowBrutSm,
                "hover:bg-pop-mint",
              )}
            >
              <ShoppingCart className="size-4" strokeWidth={2.5} />
              Cart
              <span
                key={count}
                className="inline-flex min-w-5 items-center justify-center border-2 border-black bg-foreground px-1 text-[11px] leading-4 text-white animate-in zoom-in-50 duration-200"
              >
                {count}
              </span>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
