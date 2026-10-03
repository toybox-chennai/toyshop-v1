import { Link } from "react-router";
import { CATEGORIES, inr, FREE_SHIP_THRESHOLD } from "@/data/toys";
import { LogoMark } from "@/components/store/SiteHeader";

/** Shared footer for landing, shop and checkout. */
export function SiteFooter() {
  return (
    <footer className="border-t-2 border-black bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-8 border-2 border-background" />
            <span className="text-lg font-black uppercase leading-none tracking-tight">
              Toybox<span className="text-pop-yellow">.</span>
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-background/70">
            One toy shop for ages 0–12. Picked by humans, packed flat, shipped
            across India.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-pop-yellow">
            Aisles
          </p>
          <ul className="space-y-1.5 text-sm">
            {CATEGORIES.map((category) => (
              <li key={category.key}>
                <Link
                  to={`/shop?category=${category.key}`}
                  className="hover:text-pop-yellow"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-pop-yellow">
            Good to know
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>Free shipping over {inr(FREE_SHIP_THRESHOLD)}</li>
            <li>UPI &amp; card accepted (demo checkout)</li>
            <li>
              <Link to="/shop" className="hover:text-pop-yellow">
                Browse all toys
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-pop-yellow">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-background/20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 text-[11px] font-bold uppercase tracking-wide text-background/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 Toybox · Demo store</span>
          <span>Payments are simulated — no real money moves</span>
        </div>
      </div>
    </footer>
  );
}
