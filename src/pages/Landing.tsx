import { motion } from "framer-motion";
import { ArrowRight, Box, CreditCard, ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { btnBrut, btnBrutGhost } from "@/lib/brut";
import { CATEGORIES, FREE_SHIP_THRESHOLD, inr, TOYS } from "@/data/toys";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";
import { ToyArt } from "@/components/store/ToyArt";
import { ToyCard } from "@/components/store/ToyCard";

const POP_BG = {
  yellow: "bg-pop-yellow",
  blue: "bg-pop-blue",
  red: "bg-pop-red",
  mint: "bg-pop-mint",
} as const;

const POP_CYCLE = ["yellow", "blue", "red", "mint", "yellow", "blue"] as const;

const MARQUEE_ITEMS = [
  `Free shipping over ${inr(FREE_SHIP_THRESHOLD)}`,
  "UPI + card demo checkout",
  "New toys every Friday",
  "Ages 0–12",
  "Packed by humans, not robots",
];

const STEPS = [
  {
    num: "01",
    icon: Box,
    title: "Browse the shelf",
    body: "Six aisles, sixteen toys, zero clutter. Filter by aisle and add to the cart from any page — no sign-up needed to look around.",
  },
  {
    num: "02",
    icon: ShoppingCart,
    title: "Fill your cart",
    body: "Quantities, totals and free-shipping progress update live. The cart is remembered between visits, so nothing disappears.",
  },
  {
    num: "03",
    icon: CreditCard,
    title: "Pay your way",
    body: "Checkout with UPI or card. Version 1 runs a demo payment end-to-end — instant confirmation, no money actually moves.",
  },
];

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function MarqueeHalf() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8 text-xs font-black uppercase tracking-[0.2em] text-pop-yellow">
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="flex shrink-0 items-center gap-8">
          {item}
          <span className="text-background/50">✦</span>
        </span>
      ))}
    </div>
  );
}

const picks = TOYS.filter((toy) => toy.badge).slice(0, 4);

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="border-b-2 border-black">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-block border-2 border-black bg-card px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_#000]">
              One toy shop · Ages 0–12
            </span>

            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.88] tracking-tight sm:text-6xl lg:text-7xl">
              Big toys
              <br />
              for{" "}
              <span className="inline-block border-2 border-black bg-pop-yellow px-2 shadow-[4px_4px_0_0_#000]">
                little
              </span>
              <br />
              humans.
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Blocks, plush pals, puzzles and garden kit — one small shop, one
              honest shelf. Free shipping over {inr(FREE_SHIP_THRESHOLD)}, and a
              demo UPI/card checkout when you&apos;re ready.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className={cn(btnBrut, "h-12 bg-foreground px-6 text-sm text-white")}
              >
                Shop toys
                <ArrowRight className="size-4" strokeWidth={3} />
              </Link>
              <a
                href="#how"
                className={cn(btnBrutGhost, "h-12 px-6 text-sm")}
              >
                How it works
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-wide">
              <span className="border-2 border-black bg-pop-mint px-2 py-1">
                16 toys in stock
              </span>
              <span className="border-2 border-black bg-card px-2 py-1">
                48h dispatch
              </span>
              <span className="border-2 border-black bg-pop-blue px-2 py-1">
                UPI + Card
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {picks.map((toy, index) => (
              <motion.div
                key={toy.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.15 + index * 0.09,
                  ease: "easeOut",
                }}
                style={{ rotate: index % 2 === 0 ? -2 : 2 }}
              >
                <Link
                  to={`/shop?category=${toy.category}`}
                  className="block border-2 border-black bg-card shadow-[5px_5px_0_0_#000] transition-transform duration-150 hover:-translate-y-1 hover:rotate-0"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center border-b-2 border-black p-4",
                      POP_BG[toy.pop],
                    )}
                  >
                    <ToyArt art={toy.art} pop={toy.pop} className="w-24 sm:w-28" />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3">
                    <span className="text-[11px] font-black uppercase leading-tight">
                      {toy.name}
                    </span>
                    <span className="text-sm font-black tabular-nums">
                      {inr(toy.price)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────── */}
      <div className="overflow-hidden border-b-2 border-black bg-foreground py-3">
        <div className="tb-marquee-track">
          <MarqueeHalf />
          <MarqueeHalf />
        </div>
      </div>

      {/* ── Picks ────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block border-2 border-black bg-pop-yellow px-2 py-1 text-[11px] font-black uppercase tracking-[0.2em]">
              Fresh on the shelf
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">
              Shop&apos;s favourites
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-black uppercase tracking-wide underline underline-offset-4 hover:text-pop-blue"
          >
            All {TOYS.length} toys →
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((toy, index) => (
            <Reveal key={toy.id} delay={index * 0.06} className="h-full">
              <ToyCard toy={toy} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how" className="border-y-2 border-black bg-pop-mint">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <Reveal>
            <span className="inline-block border-2 border-black bg-card px-2 py-1 text-[11px] font-black uppercase tracking-[0.2em]">
              Three steps, no nonsense
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">
              How it works
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.num} delay={index * 0.08}>
                  <div className="h-full border-2 border-black bg-card p-5 shadow-[4px_4px_0_0_#000]">
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center border-2 border-black bg-foreground text-background">
                        <Icon className="size-5" strokeWidth={2.5} />
                      </span>
                      <span className="text-3xl font-black leading-none tracking-tight text-pop-blue">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-black uppercase leading-none tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── By the numbers ───────────────────────────────────────── */}
      <section className="border-b-2 border-black bg-foreground text-background">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 sm:grid-cols-3">
          {[
            { value: `${TOYS.length}`, label: "Toys on the shelf" },
            { value: `${CATEGORIES.length}`, label: "Aisles to explore" },
            { value: "48h", label: "From cart to courier" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "px-6 py-10 text-center",
                index > 0 && "border-t-2 border-background/20 sm:border-t-0 sm:border-l-2",
              )}
            >
              <p className="text-5xl font-black leading-none tracking-tight text-pop-yellow">
                {stat.value}
              </p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-background/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Aisles ───────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block border-2 border-black bg-card px-2 py-1 text-[11px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_#000]">
              Shop by aisle
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">
              Pick a shelf
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((category, index) => {
            const count = TOYS.filter((t) => t.category === category.key).length;
            return (
              <Reveal key={category.key} delay={index * 0.05}>
                <Link
                  to={`/shop?category=${category.key}`}
                  className={cn(
                    "group flex h-full flex-col justify-between gap-4 border-2 border-black p-4 shadow-[4px_4px_0_0_#000]",
                    "transition-all duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_#000]",
                    POP_BG[POP_CYCLE[index] as keyof typeof POP_BG],
                  )}
                >
                  <span className="text-lg font-black uppercase leading-tight tracking-tight">
                    {category.label}
                  </span>
                  <span className="flex items-center justify-between text-[11px] font-black uppercase tracking-wide">
                    {count} toy{count === 1 ? "" : "s"}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={3}
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <section className="border-t-2 border-black bg-pop-yellow">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl">
              Ready to fill
              <br />
              the toybox?
            </h2>
            <p className="mt-3 text-sm font-bold uppercase tracking-wide">
              Free shipping over {inr(FREE_SHIP_THRESHOLD)} · Demo UPI &amp; card
              checkout
            </p>
          </div>
          <Link
            to="/shop"
            className={cn(btnBrut, "h-14 shrink-0 bg-foreground px-8 text-base text-white")}
          >
            Shop now
            <ArrowRight className="size-5" strokeWidth={3} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
