import { useEffect, useRef, useState } from "react";
import { ALL_DISCOVERIES, useExperience } from "../experience";
import { Lotus } from "../Lotus";

/** The lotus closes. One petal leaves, and becomes a star. */
export function EndingScene() {
  const { restart, sfx, discover, discoveries, reducedMotion, run } = useExperience();
  const [petalFree, setPetalFree] = useState(reducedMotion);
  const [released, setReleased] = useState(false);
  const [dark, setDark] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 62 });
  const wrap = useRef<HTMLElement | null>(null);
  const darkTimer = useRef<number | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setPetalFree(true), reducedMotion ? 100 : 3200);
    return () => {
      window.clearTimeout(t);
      if (darkTimer.current !== null) window.clearTimeout(darkTimer.current);
    };
  }, [reducedMotion]);

  const follow = (e: React.PointerEvent) => {
    if (released || !petalFree) return;
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos((p) => ({ x: p.x + (x - p.x) * 0.12, y: p.y + (y - p.y) * 0.12 }));
  };

  const release = () => {
    if (released) return;
    setReleased(true);
    discover("petal");
    sfx("chime");
    darkTimer.current = window.setTimeout(() => setDark(true), reducedMotion ? 200 : 4200);
  };

  const complete = ALL_DISCOVERIES.every((d) => discoveries.includes(d) || d === "petal");

  return (
    <section
      ref={wrap}
      onPointerMove={follow}
      aria-label="রেশ থেকে যায়"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: "oklch(0.07 0.02 278)" }}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[oklch(0.05_0.01_275)] transition-opacity duration-[4000ms] ${
          dark ? "opacity-90" : "opacity-0"
        }`}
      />

      <div
        className={`relative transition-all duration-[3000ms] ${released ? "scale-95 opacity-25" : "opacity-90"}`}
      >
        <Lotus size={160} bloom={petalFree ? 0.22 : 0.6} seed={run * 13 + 2} />
      </div>

      {!released ? (
        <button
          type="button"
          onClick={release}
          aria-label="একটি পাপড়ি"
          className={`absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[2000ms] ${
            petalFree ? "opacity-100" : "opacity-0"
          }`}
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path
              d="M20 4 C 30 14, 30 26, 20 36 C 10 26, 10 14, 20 4 Z"
              fill="oklch(0.92 0.06 25 / 72%)"
              stroke="oklch(0.97 0.05 40 / 55%)"
              strokeWidth="0.8"
            />
          </svg>
        </button>
      ) : (
        <span aria-hidden="true" className="rising-light" style={{ left: `${pos.x}%` }} />
      )}

      <div
        className={`relative mt-16 transition-opacity duration-[2600ms] ${released ? "opacity-100" : "opacity-0"}`}
      >
        <p className="font-body text-sm text-foreground/70">রেশ থেকে যায়।</p>
        <p className="mt-8 font-display text-[clamp(1.2rem,4vw,1.6rem)] text-lotus/90">নিশিপদ্ম</p>

        {complete ? (
          <p className="mt-10 font-body text-xs leading-[2] text-accent/70">
            সবকিছু দেখা হয়নি।
            <br />
            তবু রাতটা সম্পূর্ণ।
          </p>
        ) : null}

        <button
          type="button"
          onClick={restart}
          className="relative z-10 mt-14 font-ui text-[0.65rem] tracking-[0.34em] text-muted-foreground transition-colors duration-500 hover:text-lotus"
        >
          আবার রাতটা দেখা যাক
        </button>
      </div>
    </section>
  );
}
