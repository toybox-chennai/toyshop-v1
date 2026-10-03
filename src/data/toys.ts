/** Toy catalog for TOYBOX — one toy shop. Static v1 data, prices in whole rupees. */

export type PopColor = "yellow" | "blue" | "red" | "mint";

export type ToyArtKey =
  | "blocks"
  | "teddy"
  | "car"
  | "board"
  | "ball"
  | "rocket"
  | "robot"
  | "dino";

export type CategoryKey =
  | "blocks"
  | "plush"
  | "vehicles"
  | "puzzles"
  | "outdoor"
  | "stem";

export interface Toy {
  id: string;
  name: string;
  tagline: string;
  price: number;
  age: string;
  category: CategoryKey;
  art: ToyArtKey;
  pop: PopColor;
  badge?: string;
}

export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "blocks", label: "Building Blocks" },
  { key: "plush", label: "Soft Toys" },
  { key: "vehicles", label: "Vehicles" },
  { key: "puzzles", label: "Puzzles & Games" },
  { key: "outdoor", label: "Outdoor Play" },
  { key: "stem", label: "STEM Kits" },
];

export const CATEGORY_LABEL: Record<CategoryKey, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<CategoryKey, string>;

export const TOYS: Toy[] = [
  {
    id: "rainbow-stack",
    name: "Rainbow Stack Blocks",
    tagline: "12 nesting blocks that teach colours and balance.",
    price: 649,
    age: "2–4 yrs",
    category: "blocks",
    art: "blocks",
    pop: "yellow",
    badge: "Bestseller",
  },
  {
    id: "mega-brick-250",
    name: "Mega Brick Set · 250pc",
    tagline: "A tub of compatibility bricks for very big ideas.",
    price: 1299,
    age: "5–9 yrs",
    category: "blocks",
    art: "blocks",
    pop: "blue",
  },
  {
    id: "alphabet-blocks",
    name: "Alphabet Blocks",
    tagline: "Solid wood ABCs with non-toxic paint, 24 pieces.",
    price: 499,
    age: "1–3 yrs",
    category: "blocks",
    art: "blocks",
    pop: "mint",
  },
  {
    id: "barnaby-bear",
    name: "Barnaby the Bear",
    tagline: "Absurdly huggable bear with embroidered eyes.",
    price: 549,
    age: "0+ yrs",
    category: "plush",
    art: "teddy",
    pop: "yellow",
    badge: "Staff pick",
  },
  {
    id: "snoozie-bunny",
    name: "Snoozie Bunny",
    tagline: "Weighted little bunny for calmer bedtimes.",
    price: 449,
    age: "0+ yrs",
    category: "plush",
    art: "teddy",
    pop: "mint",
  },
  {
    id: "jumbo-dino-plush",
    name: "Jumbo Dino Plush",
    tagline: "60cm of friendly dinosaur. Machine washable.",
    price: 799,
    age: "3+ yrs",
    category: "plush",
    art: "dino",
    pop: "mint",
  },
  {
    id: "turbo-rc-racer",
    name: "Turbo RC Racer",
    tagline: "2.4GHz remote control, 15 minutes of zooming.",
    price: 1499,
    age: "6+ yrs",
    category: "vehicles",
    art: "car",
    pop: "red",
    badge: "New",
  },
  {
    id: "wooden-school-bus",
    name: "Wooden School Bus",
    tagline: "Chunky pull-along bus with six wooden passengers.",
    price: 799,
    age: "2–5 yrs",
    category: "vehicles",
    art: "car",
    pop: "yellow",
  },
  {
    id: "pocket-speedsters",
    name: "Pocket Speedsters · 3pk",
    tagline: "Pull-back cars that race across any floor.",
    price: 349,
    age: "3+ yrs",
    category: "vehicles",
    art: "car",
    pop: "blue",
  },
  {
    id: "space-puzzle-100",
    name: "Space Puzzle · 100pc",
    tagline: "A rocket-filled night sky in a sturdy box.",
    price: 599,
    age: "5–9 yrs",
    category: "puzzles",
    art: "board",
    pop: "blue",
  },
  {
    id: "memory-match",
    name: "Memory Match Game",
    tagline: "Flip, remember, win. Two-to-four players.",
    price: 399,
    age: "4–8 yrs",
    category: "puzzles",
    art: "board",
    pop: "yellow",
  },
  {
    id: "bounce-ball-pro",
    name: "Bounce Ball Pro",
    tagline: "High-bounce rubber ball for garden wars.",
    price: 349,
    age: "5+ yrs",
    category: "outdoor",
    art: "ball",
    pop: "red",
  },
  {
    id: "junior-soccer-set",
    name: "Junior Soccer Set",
    tagline: "Adjustable goal, ball and pump for small pitches.",
    price: 899,
    age: "6–12 yrs",
    category: "outdoor",
    art: "ball",
    pop: "mint",
  },
  {
    id: "dino-dig-kit",
    name: "Dino Dig Kit",
    tagline: "Chisel out a T-rex skeleton from real plaster.",
    price: 699,
    age: "7+ yrs",
    category: "outdoor",
    art: "dino",
    pop: "yellow",
    badge: "New",
  },
  {
    id: "robot-builder-kit",
    name: "Robot Builder Kit",
    tagline: "Build 8 motorised robots, no glue required.",
    price: 1199,
    age: "8–12 yrs",
    category: "stem",
    art: "robot",
    pop: "blue",
    badge: "Bestseller",
  },
  {
    id: "moon-lab-rocket",
    name: "Moon Lab Rocket Set",
    tagline: "Launch a foam rocket and log your missions.",
    price: 1099,
    age: "8–12 yrs",
    category: "stem",
    art: "rocket",
    pop: "yellow",
  },
];

export const FREE_SHIP_THRESHOLD = 999;
export const FLAT_SHIP_FEE = 49;

export function inr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function shippingFor(subtotal: number): number {
  if (subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD) return 0;
  return FLAT_SHIP_FEE;
}
