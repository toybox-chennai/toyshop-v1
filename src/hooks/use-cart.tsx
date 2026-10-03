import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  FLAT_SHIP_FEE,
  FREE_SHIP_THRESHOLD,
  shippingFor,
  TOYS,
  type Toy,
} from "@/data/toys";

const STORAGE_KEY = "toybox-cart-v1";
const MAX_QTY = 99;

/** id → quantity. Unknown or malformed entries are dropped on load. */
export type CartItems = Record<string, number>;

export interface CartLine {
  toy: Toy;
  qty: number;
}

interface CartContextValue {
  items: CartItems;
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  qtyOf: (id: string) => number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadInitialItems(): CartItems {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const clean: CartItems = {};
    for (const [id, qty] of Object.entries(parsed as Record<string, unknown>)) {
      const known = TOYS.some((toy) => toy.id === id);
      if (!known || typeof qty !== "number" || !Number.isFinite(qty)) continue;
      const bounded = Math.min(MAX_QTY, Math.max(0, Math.floor(qty)));
      if (bounded > 0) clean[id] = bounded;
    }
    return clean;
  } catch {
    // Malformed storage should never break the shop.
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItems>(loadInitialItems);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable (private mode); cart still works in-memory.
    }
  }, [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const add = useCallback((id: string) => {
    setItems((prev) => ({ ...prev, [id]: Math.min(MAX_QTY, (prev[id] ?? 0) + 1) }));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => {
      if (!(id in prev)) return prev;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: Math.min(MAX_QTY, Math.floor(qty)) };
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = [];
    for (const [id, qty] of Object.entries(items)) {
      const toy = TOYS.find((t) => t.id === id);
      if (toy) lines.push({ toy, qty });
    }
    lines.sort((a, b) => a.toy.name.localeCompare(b.toy.name));

    const subtotal = lines.reduce((sum, line) => sum + line.toy.price * line.qty, 0);
    const shipping = shippingFor(subtotal);

    return {
      items,
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      isCartOpen,
      openCart,
      closeCart,
      qtyOf: (id: string) => items[id] ?? 0,
      add,
      setQty,
      remove,
      clear,
    };
  }, [items, isCartOpen, openCart, closeCart, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { FLAT_SHIP_FEE, FREE_SHIP_THRESHOLD };
