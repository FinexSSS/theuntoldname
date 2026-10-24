/**
 * A drawn lotus — shape first, glow second.
 * Layered bezier petals with irregular widths, a warm restrained centre,
 * and an optional vertically distorted reflection on the water.
 */

type Variant = "real" | "faint" | "reflection";

type Props = {
  size?: number;
  /** 0 = closed bud, 1 = fully open */
  bloom?: number;
  variant?: Variant;
  /** extra irregularity so no two lotuses are identical */
  seed?: number;
  withReflection?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function rand(seed: number, i: number) {
  const x = Math.sin(seed * 37.19 + i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function petal(h: number, w: number, curl: number) {
  return [
    "M 0 0",
    `C ${-w} ${-h * (0.42 + curl)}, ${-w * 0.58} ${-h * 0.9}, 0 ${-h}`,
    `C ${w * 0.58} ${-h * 0.9}, ${w} ${-h * (0.42 - curl)}, 0 0`,
    "Z",
  ].join(" ");
}

function Flower({ bloom, variant, seed }: { bloom: number; variant: Variant; seed: number }) {
  const outer = 7;
  const inner = 5;
  const faint = variant !== "real";

  const outerPetals = Array.from({ length: outer }, (_, i) => {
    const t = (i - (outer - 1) / 2) / ((outer - 1) / 2); // -1..1
    const spread = (22 + bloom * 58) * t + (rand(seed, i) - 0.5) * 7;
    const h = 58 * (0.82 + rand(seed, i + 20) * 0.3) * (1 - Math.abs(t) * 0.16);
    const w = 15 * (0.8 + rand(seed, i + 40) * 0.5);
    return { d: petal(h, w, (rand(seed, i + 60) - 0.5) * 0.16), spread, i };
  });

  const innerPetals = Array.from({ length: inner }, (_, i) => {
    const t = (i - (inner - 1) / 2) / ((inner - 1) / 2);
    const spread = (10 + bloom * 26) * t + (rand(seed, i + 80) - 0.5) * 5;
    const h = 40 * (0.85 + rand(seed, i + 100) * 0.26);
    const w = 11 * (0.8 + rand(seed, i + 120) * 0.4);
    return { d: petal(h, w, (rand(seed, i + 140) - 0.5) * 0.14), spread, i };
  });

  return (
    <g transform="translate(100 116)">
      {outerPetals.map((p) => (
        <path
          key={`o${p.i}`}
          d={p.d}
          transform={`rotate(${p.spread})`}
          fill={faint ? "url(#lotusFaint)" : "url(#lotusOuter)"}
          stroke={faint ? "oklch(0.72 0.05 310 / 25%)" : "oklch(0.93 0.06 25 / 45%)"}
          strokeWidth="0.8"
        />
      ))}
      {innerPetals.map((p) => (
        <path
          key={`i${p.i}`}
          d={p.d}
          transform={`rotate(${p.spread})`}
          fill={faint ? "url(#lotusFaint)" : "url(#lotusInner)"}
          stroke={faint ? "oklch(0.72 0.05 310 / 18%)" : "oklch(0.96 0.05 40 / 40%)"}
          strokeWidth="0.7"
        />
      ))}
      {!faint ? (
        <>
          <ellipse cx="0" cy="-10" rx="7" ry="9" fill="url(#lotusHeart)" />
          <ellipse cx="0" cy="-12" rx="2.6" ry="4" fill="oklch(0.97 0.09 85 / 85%)" />
        </>
      ) : null}
    </g>
  );
}

export function Lotus({
  size = 180,
  bloom = 0.55,
  variant = "real",
  seed = 1,
  withReflection = false,
  className,
  style,
}: Props) {
  const height = withReflection ? size * 1.55 : size * 0.92;

  return (
    <svg
      viewBox={withReflection ? "0 0 200 300" : "0 0 200 180"}
      width={size}
      height={height}
      aria-hidden="true"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="lotusOuter" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.52 0.09 320 / 70%)" />
          <stop offset="55%" stopColor="oklch(0.78 0.08 10 / 78%)" />
          <stop offset="100%" stopColor="oklch(0.95 0.05 25 / 92%)" />
        </linearGradient>
        <linearGradient id="lotusInner" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.62 0.08 30 / 75%)" />
          <stop offset="100%" stopColor="oklch(0.97 0.05 60 / 95%)" />
        </linearGradient>
        <linearGradient id="lotusFaint" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.4 0.05 300 / 35%)" />
          <stop offset="100%" stopColor="oklch(0.66 0.05 310 / 42%)" />
        </linearGradient>
        <radialGradient id="lotusHeart">
          <stop offset="0%" stopColor="oklch(0.98 0.1 90 / 95%)" />
          <stop offset="100%" stopColor="oklch(0.8 0.1 55 / 20%)" />
        </radialGradient>
        <filter id="lotusSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter id="lotusMirror" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </defs>

      <g filter={variant === "real" ? undefined : "url(#lotusSoft)"}>
        <Flower bloom={bloom} variant={variant} seed={seed} />
      </g>

      {withReflection ? (
        <g
          transform="translate(0 244) scale(1 -0.62)"
          opacity="0.3"
          filter="url(#lotusMirror)"
          className="lotus-mirror"
        >
          <Flower bloom={bloom} variant="faint" seed={seed} />
        </g>
      ) : null}
    </svg>
  );
}
