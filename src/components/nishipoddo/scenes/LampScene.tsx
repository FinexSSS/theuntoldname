import { useEffect, useRef, useState } from "react";
import { poemPage } from "@/content/poem";
import { PageChrome } from "../PageChrome";
import { PoemText } from "../PoemText";
import { useExperience } from "../experience";

function Diya({ pulse }: { pulse: number }) {
  return (
    <svg viewBox="0 0 120 90" width="120" height="90" aria-hidden="true">
      <defs>
        <linearGradient id="diyaBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.52 0.07 45)" />
          <stop offset="100%" stopColor="oklch(0.3 0.05 30)" />
        </linearGradient>
        <radialGradient id="diyaFlame">
          <stop offset="0%" stopColor="oklch(0.99 0.09 95)" />
          <stop offset="60%" stopColor="oklch(0.88 0.14 70 / 85%)" />
          <stop offset="100%" stopColor="oklch(0.7 0.12 50 / 0%)" />
        </radialGradient>
      </defs>
      <ellipse
        cx="60"
        cy="30"
        rx={16 + pulse * 4}
        ry={22 + pulse * 5}
        fill="url(#diyaFlame)"
        opacity="0.75"
      />
      <path
        d="M60 14 C 66 24, 68 30, 60 38 C 52 30, 54 24, 60 14 Z"
        fill="oklch(0.98 0.1 92)"
      />
      <path
        d="M28 44 C 34 62, 86 62, 92 44 C 80 50, 40 50, 28 44 Z"
        fill="url(#diyaBody)"
        stroke="oklch(0.8 0.07 50 / 45%)"
        strokeWidth="0.8"
      />
      <ellipse cx="60" cy="44" rx="32" ry="5" fill="oklch(0.62 0.08 45 / 55%)" />
      <ellipse cx="60" cy="70" rx="30" ry="7" fill="oklch(0.8 0.09 60 / 14%)" />
    </svg>
  );
}

/** PAGE III — a small lamp left on the water. */
export function LampScene() {
  const { goToScene, sfx, discover, bandsRef, reducedMotion } = useExperience();
  const page = poemPage("lamp");
  const [lit, setLit] = useState(false);
  const [phase, setPhase] = useState(0);
  const [pulse, setPulse] = useState(0);
  const rippleRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const loop = () => {
      setPulse(bandsRef.current.level);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [bandsRef, reducedMotion]);

  const touch = () => {
    if (lit) return;
    setLit(true);
    discover("lamp");
    sfx("ripple");
    window.setTimeout(() => setPhase(1), 900);
    window.setTimeout(() => setPhase(2), 2600);
  };

  return (
    <section
      aria-label={page.title}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "linear-gradient(180deg, oklch(0.12 0.04 282) 0%, oklch(0.18 0.06 292) 62%, oklch(0.14 0.05 288) 100%)" }}
    >
      <div className="relative flex flex-col items-center">
        <button
          type="button"
          onClick={touch}
          aria-label="জলে ভাসা প্রদীপ"
          className={`relative ${reducedMotion ? "" : "lamp-bob"} transition-transform duration-700 hover:scale-105`}
        >
          <Diya pulse={lit ? pulse : pulse * 0.4} />
          {lit ? (
            <span ref={rippleRef} aria-hidden="true" className="lamp-ripple" />
          ) : null}
        </button>

        <div className="mt-6 h-10 text-center">
          <p
            className={`font-display text-lg text-lotus transition-opacity duration-[1600ms] ${
              phase >= 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            কিছু আলফাজ
          </p>
          <p
            className={`font-display text-lg text-accent/90 transition-opacity duration-[1600ms] ${
              phase >= 2 ? "opacity-100" : "opacity-0"
            }`}
          >
            নিজে থেকে আলো করে।
          </p>
        </div>
      </div>

      <PoemText
        lines={page.lines}
        className="mt-14 max-w-md text-[clamp(1.05rem,3.8vw,1.4rem)] text-foreground/75"
        step={560}
      />

      <PageChrome
        id="lamp"
        ready={phase >= 2}
        onNext={() => {
          sfx("page");
          goToScene("window");
        }}
      />
    </section>
  );
}
