import { ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { CATEGORIES, FREE_SHIP_THRESHOLD, inr, TOYS } from "@/data/toys";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";
import { ToyCard } from "@/components/store/ToyCard";

/**
 * The shop floor: one grid of every toy, filtered by aisle via
 * /shop?category=… links from the header, footer and landing page.
 */
export default function Shop() {
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get("category");
  const category = CATEGORIES.some((c) => c.key === rawCategory)
    ? (rawCategory as (typeof CATEGORIES)[number]["key"])
    : "all";

  const toys =
    category === "all" ? TOYS : TOYS.filter((toy) => toy.category === category);
  const activeLabel = CATEGORIES.find((c) => c.key === category)?.label;

  const setCategory = (key: string) => {
    if (key === "all") setParams({});
    else setParams({ category: key });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <section className="border-b-2 border-black bg-pop-blue">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 inline-block border-2 border-black bg-card px-2 py-1 text-[11px] font-black uppercase tracking-widest">
              The shelf · Ages 0–12
            </p>
            <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl">
              {category === "all" ? (
                <>
                  All the toys.
                  <br />
                  One shop.
                </>
              ) : (
                activeLabel
              )}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide">
            <span className="border-2 border-black bg-card px-2 py-1">
              {toys.length} toy{toys.length === 1 ? "" : "s"}
            </span>
            <span className="border-2 border-black bg-pop-mint px-2 py-1">
              Free ship over {inr(FREE_SHIP_THRESHOLD)}
            </span>
            <span className="border-2 border-black bg-pop-yellow px-2 py-1">
              UPI + Card demo
            </span>
          </div>
        </div>
      </section>

      <nav
        aria-label="Filter by category"
        className="border-b-2 border-black bg-background"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className={cn(
              "border-2 border-black px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-colors",
              category === "all"
                ? "bg-foreground text-background"
                : "bg-card hover:bg-pop-yellow",
            )}
          >
            All toys
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              aria-pressed={category === c.key}
              className={cn(
                "border-2 border-black px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-colors",
                category === c.key
                  ? "bg-foreground text-background"
                  : "bg-card hover:bg-pop-yellow",
              )}
            >
              {c.label}
            </button>
          ))}
          {category !== "all" && (
            <button
              type="button"
              onClick={() => setCategory("all")}
              className="ml-auto inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide underline underline-offset-4 hover:text-pop-blue"
            >
              Clear filter
              <ArrowRight className="size-3.5" strokeWidth={3} />
            </button>
          )}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {toys.length === 0 ? (
          <div className="mx-auto mt-8 max-w-md border-2 border-black bg-card p-8 text-center shadow-[4px_4px_0_0_#000]">
            <p className="text-lg font-black uppercase">Shelf is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing in this aisle right now — try another one.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 border-2 border-black bg-pop-yellow px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#000]"
            >
              Show all toys
              <ArrowRight className="size-3.5" strokeWidth={3} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {toys.map((toy) => (
              <ToyCard key={toy.id} toy={toy} />
            ))}
          </div>
        )}

        <p className="mt-10 border-2 border-black bg-muted px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
          New toys land every Friday · Everything here ships in 48 hours
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
