import type { PopColor, ToyArtKey } from "@/data/toys";

/**
 * Flat, geometric toy illustrations drawn as simple primitives with heavy
 * black outlines — matches the Neobrutalism theme and reuses one palette.
 */

const POP_HEX: Record<PopColor, string> = {
  yellow: "#ffd23f",
  blue: "#3b6dff",
  red: "#ff5a49",
  mint: "#79e2b4",
};

const ALT: Record<PopColor, PopColor> = {
  yellow: "blue",
  blue: "yellow",
  red: "yellow",
  mint: "blue",
};

const STROKE = {
  stroke: "#000",
  strokeWidth: 4.5,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;

export function ToyArt({
  art,
  pop,
  className,
}: {
  art: ToyArtKey;
  pop: PopColor;
  className?: string;
}) {
  const c = POP_HEX[pop];
  const alt = POP_HEX[ALT[pop]];
  const flame = pop === "yellow" ? POP_HEX.red : POP_HEX.yellow;

  let shapes: React.ReactNode = null;

  switch (art) {
    case "blocks":
      shapes = (
        <>
          <rect x={35} y={24} width={42} height={42} fill="#fff" {...STROKE} />
          <rect x={14} y={66} width={42} height={42} fill={c} {...STROKE} />
          <rect x={56} y={66} width={42} height={42} fill={alt} {...STROKE} />
          <text
            x={56}
            y={46}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={26}
            fontWeight={900}
            fill="#000"
            stroke="none"
          >
            A
          </text>
          <text
            x={35}
            y={87}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={26}
            fontWeight={900}
            fill="#000"
            stroke="none"
          >
            B
          </text>
          <text
            x={77}
            y={87}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={26}
            fontWeight={900}
            fill="#000"
            stroke="none"
          >
            C
          </text>
        </>
      );
      break;

    case "teddy":
      shapes = (
        <>
          <circle cx={34} cy={34} r={15} fill={c} {...STROKE} />
          <circle cx={86} cy={34} r={15} fill={c} {...STROKE} />
          <circle cx={60} cy={62} r={37} fill={c} {...STROKE} />
          <ellipse cx={60} cy={76} rx={19} ry={14} fill="#fff" {...STROKE} />
          <circle cx={47} cy={54} r={4.5} fill="#000" stroke="none" />
          <circle cx={73} cy={54} r={4.5} fill="#000" stroke="none" />
          <path d="M55 68 h10 l-5 7 z" fill="#000" stroke="none" />
          <path d="M53 82 q7 7 14 0" fill="none" {...STROKE} />
        </>
      );
      break;

    case "car":
      shapes = (
        <>
          <path
            d="M10 84 V64 h14 l12 -16 h40 l10 16 h20 v20 z"
            fill={c}
            {...STROKE}
          />
          <rect x={42} y={53} width={26} height={12} fill="#fff" {...STROKE} />
          <circle cx={34} cy={84} r={13} fill="#000" {...STROKE} />
          <circle cx={34} cy={84} r={5} fill="#fff" stroke="none" />
          <circle cx={88} cy={84} r={13} fill="#000" {...STROKE} />
          <circle cx={88} cy={84} r={5} fill="#fff" stroke="none" />
        </>
      );
      break;

    case "board":
      shapes = (
        <>
          <rect x={16} y={16} width={88} height={88} fill="#fff" {...STROKE} />
          <rect x={16} y={16} width={44} height={44} fill={c} {...STROKE} />
          <rect x={60} y={60} width={44} height={44} fill={c} {...STROKE} />
          <circle cx={82} cy={38} r={11} fill={alt} {...STROKE} />
          <circle cx={38} cy={82} r={11} fill={alt} {...STROKE} />
        </>
      );
      break;

    case "ball":
      shapes = (
        <>
          <circle cx={60} cy={60} r={40} fill="#fff" {...STROKE} />
          <path
            d="M60 20 C36 36 36 84 60 100 C84 84 84 36 60 20 Z"
            fill={c}
            {...STROKE}
          />
          <path d="M21 52 h78" fill="none" {...STROKE} />
          <path d="M22 70 h76" fill="none" {...STROKE} />
        </>
      );
      break;

    case "rocket":
      shapes = (
        <>
          <path d="M40 66 L22 96 L40 90 Z" fill={alt} {...STROKE} />
          <path d="M80 66 L98 96 L80 90 Z" fill={alt} {...STROKE} />
          <path
            d="M60 10 C78 26 84 48 84 68 v22 H36 V68 C36 48 42 26 60 10 Z"
            fill={c}
            {...STROKE}
          />
          <circle cx={60} cy={48} r={11} fill="#fff" {...STROKE} />
          <path d="M50 90 h20 l-5 16 q-5 6 -10 0 z" fill={flame} {...STROKE} />
        </>
      );
      break;

    case "robot":
      shapes = (
        <>
          <path d="M60 24 V15" fill="none" {...STROKE} />
          <circle cx={60} cy={11} r={6} fill={c} {...STROKE} />
          <rect x={16} y={36} width={12} height={22} fill={alt} {...STROKE} />
          <rect x={92} y={36} width={12} height={22} fill={alt} {...STROKE} />
          <rect x={28} y={24} width={64} height={46} fill={c} {...STROKE} />
          <circle cx={47} cy={45} r={8} fill="#fff" {...STROKE} />
          <circle cx={73} cy={45} r={8} fill="#fff" {...STROKE} />
          <circle cx={47} cy={46} r={3.5} fill="#000" stroke="none" />
          <circle cx={73} cy={46} r={3.5} fill="#000" stroke="none" />
          <path d="M45 61 h30" fill="none" {...STROKE} />
          <rect x={38} y={78} width={44} height={30} fill="#fff" {...STROKE} />
          <circle cx={60} cy={93} r={7} fill={alt} {...STROKE} />
        </>
      );
      break;

    case "dino":
      shapes = (
        <>
          <path d="M34 76 L6 60 L20 90 Z" fill={c} {...STROKE} />
          <path d="M40 52 l8 -14 8 14 z" fill={alt} {...STROKE} />
          <path d="M58 49 l8 -14 8 14 z" fill={alt} {...STROKE} />
          <rect x={38} y={86} width={13} height={22} fill={c} {...STROKE} />
          <rect x={66} y={86} width={13} height={22} fill={c} {...STROKE} />
          <ellipse cx={58} cy={72} rx={34} ry={24} fill={c} {...STROKE} />
          <ellipse cx={58} cy={78} rx={20} ry={13} fill="#fff" {...STROKE} />
          <circle cx={88} cy={46} r={17} fill={c} {...STROKE} />
          <circle cx={93} cy={42} r={3.5} fill="#000" stroke="none" />
        </>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {shapes}
    </svg>
  );
}
