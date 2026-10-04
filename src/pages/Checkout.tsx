import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  ShieldAlert,
  Smartphone,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { btnBrut, btnBrutGhost, inputBrut, shadowBrut } from "@/lib/brut";
import { inr, type Toy } from "@/data/toys";
import { useCart } from "@/hooks/use-cart";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";
import { ToyArt } from "@/components/store/ToyArt";

type Method = "upi" | "card";
type Status = "form" | "processing" | "done";

interface FieldErrors {
  upi?: string;
  number?: string;
  name?: string;
  expiry?: string;
  cvv?: string;
}

interface PlacedOrder {
  id: string;
  method: Method;
  payLabel: string;
  items: { toy: Toy; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  placedAt: string;
}

const UPI_APPS = ["Google Pay", "PhonePe", "Paytm"];
const UPI_PATTERN = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;

const POP_BG = {
  yellow: "bg-pop-yellow",
  blue: "bg-pop-blue",
  red: "bg-pop-red",
  mint: "bg-pop-mint",
} as const;

function makeOrderId(): string {
  return `TB-${Math.floor(100000 + Math.random() * 900000)}`;
}

function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function cardBrand(digits: string): string {
  if (/^4/.test(digits)) return "VISA";
  if (/^5[1-5]/.test(digits)) return "MASTERCARD";
  if (/^6/.test(digits)) return "RUPAY";
  if (/^3[47]/.test(digits)) return "AMEX";
  return "CARD";
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function expiryError(value: string): string {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return "Use MM/YY format";
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return "Month must be 01–12";
  const now = new Date();
  if (
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1)
  ) {
    return "That card has expired (demo)";
  }
  return "";
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className="text-[11px] font-black uppercase tracking-wide"
        >
          {label}
        </label>
        {hint && (
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p role="alert" className="text-[11px] font-black uppercase text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Demo checkout (v1): UPI or card, simulated end to end. Open to guests.
 */
export default function Checkout() {
  const { lines, subtotal, shipping, total, clear } = useCart();
  const navigate = useNavigate();

  const [method, setMethod] = useState<Method>("upi");
  const [status, setStatus] = useState<Status>("form");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState<string | null>(null);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  // Simulated payment round-trip, then the cart is emptied.
  useEffect(() => {
    if (status !== "processing") return;
    const timer = window.setTimeout(() => {
      clear();
      setStatus("done");
    }, 2300);
    return () => window.clearTimeout(timer);
  }, [status, clear]);

  const cardDigits = card.number.replace(/\D/g, "");
  const brand = cardBrand(cardDigits);

  const handlePay = () => {
    const nextErrors: FieldErrors = {};
    let payLabel = "";

    if (method === "upi") {
      const id = upiId.trim();
      if (!UPI_PATTERN.test(id)) {
        nextErrors.upi = "Enter a valid UPI ID, e.g. riya@okhdfc";
      } else {
        payLabel = upiApp ? `UPI · ${id} via ${upiApp}` : `UPI · ${id}`;
      }
    } else {
      if (cardDigits.length < 15) nextErrors.number = "Enter a 16-digit card number";
      if (card.name.trim().length < 3) nextErrors.name = "Enter the name on the card";
      const expError = expiryError(card.expiry);
      if (expError) nextErrors.expiry = expError;
      if (!/^\d{3,4}$/.test(card.cvv)) nextErrors.cvv = "3–4 digits";
      if (Object.keys(nextErrors).length === 0) {
        payLabel = `Card ···· ${cardDigits.slice(-4)} · ${brand}`;
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setOrder({
      id: makeOrderId(),
      method,
      payLabel,
      items: lines.map(({ toy, qty }) => ({ toy, qty })),
      subtotal,
      shipping,
      total,
      placedAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
    setStatus("processing");
  };

  const steps = (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-wide">
      <span className="border-2 border-black bg-pop-mint px-2 py-1">01 · Cart</span>
      <span className="text-muted-foreground">→</span>
      <span
        className={cn(
          "border-2 border-black px-2 py-1",
          status === "done" ? "bg-pop-mint" : "bg-foreground text-background",
        )}
      >
        02 · Pay
      </span>
      <span className="text-muted-foreground">→</span>
      <span
        className={cn(
          "border-2 border-black px-2 py-1",
          status === "done"
            ? "bg-pop-mint"
            : "bg-card text-muted-foreground",
        )}
      >
        03 · Done
      </span>
    </div>
  );

  const demoBanner = (
    <div className="flex items-start gap-3 border-2 border-black bg-pop-yellow p-4 shadow-[4px_4px_0_0_#000]">
      <ShieldAlert className="mt-0.5 size-5 shrink-0" strokeWidth={2.5} />
      <p className="text-sm font-bold leading-snug">
        <span className="font-black uppercase">Demo checkout —</span> payments are
        simulated for version 1. Don&apos;t enter a real card; nothing is charged
        and no data leaves this page.
      </p>
    </div>
  );

  // ── Success ────────────────────────────────────────────────────────
  if (status === "done" && order) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <div className={cn("border-2 border-black bg-card", shadowBrut)}>
            <div className="flex items-center justify-between gap-2 border-b-2 border-black bg-pop-yellow px-5 py-3">
              <span className="text-[11px] font-black uppercase tracking-widest">
                Demo receipt
              </span>
              <span className="border-2 border-black bg-card px-2 py-0.5 text-[11px] font-black uppercase tabular-nums">
                {order.id}
              </span>
            </div>

            <div className="p-6 text-center sm:p-8">
              <div className="mx-auto flex size-16 items-center justify-center border-2 border-black bg-pop-mint shadow-[4px_4px_0_0_#000]">
                <Check className="size-8" strokeWidth={4} />
              </div>
              <h1 className="mt-6 text-3xl font-black uppercase leading-none tracking-tight">
                Payment done
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Simulated successfully — no real money moved. Your toys are
                reserved and would ship within 48 hours.
              </p>

              <dl className="mt-6 grid grid-cols-1 gap-px border-2 border-black bg-black text-left sm:grid-cols-3">
                <div className="bg-card p-3">
                  <dt className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                    Paid with
                  </dt>
                  <dd className="mt-0.5 break-words text-sm font-black uppercase">
                    {order.payLabel}
                  </dd>
                </div>
                <div className="bg-card p-3">
                  <dt className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                    Total
                  </dt>
                  <dd className="mt-0.5 text-sm font-black tabular-nums">
                    {inr(order.total)}
                  </dd>
                </div>
                <div className="bg-card p-3">
                  <dt className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                    Placed at
                  </dt>
                  <dd className="mt-0.5 text-sm font-black">{order.placedAt}</dd>
                </div>
              </dl>

              <ul className="mt-4 divide-y-2 divide-black border-2 border-black bg-card text-left">
                {order.items.map(({ toy, qty }) => (
                  <li key={toy.id} className="flex items-center gap-3 p-3">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center border-2 border-black",
                        POP_BG[toy.pop],
                      )}
                    >
                      <ToyArt art={toy.art} pop={toy.pop} className="w-7" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-black uppercase">
                        {toy.name}
                      </span>
                      <span className="text-xs text-muted-foreground">× {qty}</span>
                    </span>
                    <span className="text-sm font-black tabular-nums">
                      {inr(toy.price * qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  className={cn(btnBrut, "h-12 bg-foreground px-6 text-sm text-white")}
                  onClick={() => navigate("/shop")}
                >
                  Continue shopping
                  <ArrowRight className="size-4" strokeWidth={3} />
                </button>
                <Link
                  to="/"
                  className={cn(btnBrutGhost, "h-12 px-6 text-sm")}
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ── Empty cart ─────────────────────────────────────────────────────
  if (lines.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto w-full max-w-lg flex-1 px-4 py-16 sm:px-6">
          <div className="border-2 border-black bg-card p-8 text-center shadow-[4px_4px_0_0_#000]">
            <p className="text-xl font-black uppercase tracking-tight">
              Your cart is empty
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              There&apos;s nothing to pay for yet — go fill it up.
            </p>
            <button
              type="button"
              className={cn(btnBrut, "mt-6 h-12 bg-pop-yellow px-6 text-sm")}
              onClick={() => navigate("/shop")}
            >
              Browse toys
              <ArrowRight className="size-4" strokeWidth={3} />
            </button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ── Form / processing ──────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Secure-ish (demo) checkout
            </p>
            <h1 className="text-3xl font-black uppercase leading-none tracking-tight sm:text-4xl">
              Pay your way
            </h1>
          </div>
          {steps}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5">
            {demoBanner}

            {status === "processing" ? (
              <div className="border-2 border-black bg-card p-8 text-center shadow-[4px_4px_0_0_#000]">
                <div className="mb-5 flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-4 border-2 border-black bg-pop-yellow animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <p className="text-xl font-black uppercase leading-tight tracking-tight">
                  {method === "upi"
                    ? "Approve the request in your UPI app"
                    : "Verifying card with the bank"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {method === "upi"
                    ? upiApp
                      ? `Request sent to ${upiApp} for ${upiId}`
                      : `Request sent to ${upiId}`
                    : `${brand} ···· ${cardDigits.slice(-4)} · ${card.name}`}
                </p>
                <span className="mt-4 inline-block border-2 border-black bg-pop-mint px-2 py-1 text-[11px] font-black uppercase tracking-wide">
                  Demo mode · nothing is charged
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={method === "upi"}
                    onClick={() => setMethod("upi")}
                    className={cn(
                      "border-2 border-black p-4 text-left transition-all",
                      method === "upi"
                        ? "bg-pop-mint shadow-[4px_4px_0_0_#000]"
                        : "bg-card hover:bg-accent",
                    )}
                  >
                    <Smartphone className="size-5" strokeWidth={2.5} />
                    <span className="mt-2 block text-base font-black uppercase leading-none">
                      UPI
                    </span>
                    <span className="mt-1 block text-[11px] font-bold uppercase text-muted-foreground">
                      GPay · PhonePe · Paytm
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={method === "card"}
                    onClick={() => setMethod("card")}
                    className={cn(
                      "border-2 border-black p-4 text-left transition-all",
                      method === "card"
                        ? "bg-pop-yellow shadow-[4px_4px_0_0_#000]"
                        : "bg-card hover:bg-accent",
                    )}
                  >
                    <CreditCard className="size-5" strokeWidth={2.5} />
                    <span className="mt-2 block text-base font-black uppercase leading-none">
                      Card
                    </span>
                    <span className="mt-1 block text-[11px] font-bold uppercase text-muted-foreground">
                      Visa · Mastercard · RuPay
                    </span>
                  </button>
                </div>

                <div className="border-2 border-black bg-card p-5 shadow-[4px_4px_0_0_#000]">
                  {method === "upi" ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-wide">
                          Pay from
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {UPI_APPS.map((app) => (
                            <button
                              key={app}
                              type="button"
                              aria-pressed={upiApp === app}
                              onClick={() => setUpiApp(upiApp === app ? null : app)}
                              className={cn(
                                "border-2 border-black px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-colors",
                                upiApp === app
                                  ? "bg-foreground text-background"
                                  : "bg-card hover:bg-pop-mint",
                              )}
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Field
                        id="upi-id"
                        label="UPI ID"
                        hint="name@bank"
                        error={errors.upi}
                      >
                        <input
                          id="upi-id"
                          type="text"
                          inputMode="text"
                          autoComplete="off"
                          spellCheck={false}
                          placeholder="riya@okhdfc"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className={inputBrut}
                        />
                      </Field>

                      <p className="text-xs leading-relaxed text-muted-foreground">
                        A collect request pops up in your UPI app — approve it and
                        you&apos;re done. (Simulated in version 1.)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Field
                        id="card-number"
                        label="Card number"
                        hint="Demo: 4242 4242 4242 4242"
                        error={errors.number}
                      >
                        <div className="relative">
                          <input
                            id="card-number"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="4242 4242 4242 4242"
                            value={card.number}
                            onChange={(e) =>
                              setCard((c) => ({
                                ...c,
                                number: formatCardNumber(e.target.value),
                              }))
                            }
                            className={cn(inputBrut, "pr-24 tracking-wide")}
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 border-2 border-black bg-pop-yellow px-1.5 py-0.5 text-[10px] font-black uppercase text-black">
                            {brand}
                          </span>
                        </div>
                      </Field>

                      <Field id="card-name" label="Name on card" error={errors.name}>
                        <input
                          id="card-name"
                          type="text"
                          autoComplete="cc-name"
                          placeholder="RIYA SHARMA"
                          value={card.name}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))
                          }
                          className={inputBrut}
                        />
                      </Field>

                      <div className="grid grid-cols-2 gap-3">
                        <Field id="card-expiry" label="Expiry" hint="MM/YY" error={errors.expiry}>
                          <input
                            id="card-expiry"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            placeholder="09/29"
                            value={card.expiry}
                            onChange={(e) =>
                              setCard((c) => ({
                                ...c,
                                expiry: formatExpiry(e.target.value),
                              }))
                            }
                            className={inputBrut}
                          />
                        </Field>
                        <Field id="card-cvv" label="CVV" hint="3–4 digits" error={errors.cvv}>
                          <input
                            id="card-cvv"
                            type="password"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            placeholder="•••"
                            value={card.cvv}
                            onChange={(e) =>
                              setCard((c) => ({
                                ...c,
                                cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                              }))
                            }
                            className={inputBrut}
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  className={cn(btnBrut, "h-14 w-full bg-foreground text-base text-white")}
                >
                  <Lock className="size-4" strokeWidth={3} />
                  Pay {inr(total)} · Demo
                </button>
              </>
            )}
          </div>

          <aside className="h-fit border-2 border-black bg-card shadow-[4px_4px_0_0_#000] lg:sticky lg:top-24">
            <header className="border-b-2 border-black bg-foreground px-4 py-3 text-background">
              <h2 className="text-xs font-black uppercase tracking-widest">
                Order summary
              </h2>
            </header>
            <ul className="divide-y-2 divide-black">
              {lines.map(({ toy, qty }) => (
                <li key={toy.id} className="flex items-center gap-3 p-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center border-2 border-black",
                      POP_BG[toy.pop],
                    )}
                  >
                    <ToyArt art={toy.art} pop={toy.pop} className="w-7" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-black uppercase">
                      {toy.name}
                    </span>
                    <span className="text-xs text-muted-foreground">× {qty}</span>
                  </span>
                  <span className="text-sm font-black tabular-nums">
                    {inr(toy.price * qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 border-t-2 border-black p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold tabular-nums">{inr(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold tabular-nums">
                  {shipping === 0 ? "FREE" : inr(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t-2 border-black pt-2 text-base">
                <span className="font-black uppercase">Total</span>
                <span className="font-black tabular-nums">{inr(total)}</span>
              </div>
              <Link
                to="/shop"
                className="mt-2 inline-block text-xs font-black uppercase underline underline-offset-4 hover:text-pop-blue"
              >
                ← Edit cart
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
