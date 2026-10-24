import { useEffect, useMemo, useState } from "react";
import { poemPage } from "@/content/poem";
import { PageChrome } from "../PageChrome";
import { PoemText } from "../PoemText";
import { useExperience } from "../experience";

function makeStars(run: number) {
  const rng = (i: number) => {
    const x = Math.sin(run * 53.3 + i * 19.77) * 43758.5453;
    return x - Math.floor(x);
  };
  return Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: 14 + (i / 5) * 68 + (rng(i) - 0.5) * 9,
    y: 16 + (i / 5) * 30 + (rng(i + 9) - 0.5) * 14,
  }));
}

/** PAGE VII — a very empty sky. A few points, loosely suggesting a way out. */
export function SkyScene() {
  const { goToScene, sfx, discover, bandsRef, reducedMotion, run } = useExperience();
  const page = poemPage("sky");
  const stars = useMemo(() => makeStars(run), [run]);
  const [lit, setLit] = useState<number[]>([]);
  const [twinkle, setTwinkle] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const loop = () => {
      setTwinkle(bandsRef.current.high);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [bandsRef, reducedMotion]);

  const all = lit.length === stars.length;

  useEffect(() => {
    if (all) discover("stars");
  }, [all, discover]);

  const ordered = lit.map((id) => stars.find((s) => s.id === id)!);

  return (
    <section
      aria-label={page.title}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-6 pb-40"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.1 0.03 280) 0%, oklch(0.16 0.05 292) 72%, oklch(0.21 0.06 305) 100%)",
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {ordered.slice(1).map((s, i) => {
          const prev = ordered[i]!;
          return (
            <line
              key={s.id}
              x1={prev.x}
              y1={prev.y}
              x2={s.x}
              y2={s.y}
              stroke="oklch(0.9 0.04 80 / 22%)"
              strokeWidth="0.35"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {stars.map((s) => {
        const on = lit.includes(s.id);
        return (
          <button
            key={s.id}
            type="button"
            aria-label="একটি তারা"
            onClick={() => {
              if (on) return;
              setLit((l) => [...l, s.id]);
              if (lit.length === stars.length - 1) sfx("chime");
            }}
            className="absolute z-10 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              background: `radial-gradient(circle, oklch(0.98 0.03 88 / ${on ? 0.95 : 0.24 + twinkle * 0.25}) 0 ${on ? 2.2 : 1.1}px, transparent 62%)`,
              filter: on ? "drop-shadow(0 0 10px oklch(0.95 0.05 85 / 55%))" : undefined,
            }}
          />
        );
      })}

      <div className="pointer-events-none relative max-w-lg">
        <PoemText
          lines={page.lines}
          className="text-[clamp(1rem,3.6vw,1.35rem)] text-foreground/80"
          align="left"
          step={620}
        />
        <p
          className={`mt-10 font-display text-base text-lotus transition-opacity duration-[2200ms] ${
            all ? "opacity-100" : "opacity-0"
          }`}
        >
          দিগন্ত একটু ফাঁকা থাকুক।
        </p>
        <p
          className={`mt-2 font-ui text-[0.65rem] tracking-[0.4em] text-muted-foreground transition-opacity duration-[3000ms] ${
            all ? "opacity-100" : "opacity-0"
          }`}
        >
          আপনার জন্য।
        </p>
      </div>

      <PageChrome
        id="sky"
        ready={all}
        onNext={() => {
          sfx("page");
          goToScene("light");
        }}
      />
    </section>
  );
}
