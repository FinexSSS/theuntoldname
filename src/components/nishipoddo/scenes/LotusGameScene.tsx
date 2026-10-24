import { useEffect, useMemo, useRef, useState } from "react";
import { useExperience } from "../experience";
import { Lotus } from "../Lotus";

type Bloom = { id: number; x: number; y: number; real: boolean; scale: number; tilt: number };

function makeBlooms(run: number): Bloom[] {
  const rng = (i: number) => {
    const x = Math.sin(run * 91.7 + i * 27.31) * 43758.5453;
    return x - Math.floor(x);
  };
  const count = 5 + Math.floor(rng(0) * 3); // 5-7
  const realIndex = Math.floor(rng(1) * count);
  const cols = Math.ceil(count / 2);
  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      id: i,
      x: 12 + (col + 0.5) * (76 / cols) + (rng(i + 10) - 0.5) * 8,
      y: 26 + row * 34 + (rng(i + 20) - 0.5) * 10,
      real: i === realIndex,
      scale: 0.78 + rng(i + 30) * 0.3,
      tilt: (rng(i + 40) - 0.5) * 12,
    };
  });
}

/** The quiet search: reflections everywhere, one actual flower. */
export function LotusGameScene() {
  const { goToScene, sfx, discover, bandsRef, reducedMotion, run } = useExperience();
  const [blooms, setBlooms] = useState<Bloom[]>(() => makeBlooms(run));
  const [note, setNote] = useState<string | null>(null);
  const [found, setFound] = useState(false);
  const [phase, setPhase] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [pointer, setPointer] = useState({ x: -999, y: -999 });
  const areaRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => setBlooms(makeBlooms(run)), [run]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    },
    [],
  );

  const real = useMemo(() => blooms.find((b) => b.real), [blooms]);

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

  const near =
    !!real && !found && Math.hypot(pointer.x - real.x, (pointer.y - real.y) * 0.6) < 15;

  const pick = (b: Bloom) => {
    if (found) return;
    if (b.real) {
      setFound(true);
      discover("game");
      sfx("chime");
      const timings = reducedMotion ? [150, 300, 900] : [1600, 4600, 8200];
      timers.current.push(
        window.setTimeout(() => setPhase(1), timings[0]),
        window.setTimeout(() => setPhase(2), timings[1]),
        window.setTimeout(() => goToScene("gratitude"), timings[2]),
      );
    } else {
      sfx("dissolve");
      setNote("প্রতিবিম্ব।");
      timers.current.push(window.setTimeout(() => setNote(null), reducedMotion ? 600 : 2200));
      setBlooms((prev) => prev.filter((n) => n.id !== b.id));
    }
  };

  return (
    <section
      aria-label="আসল ফুল"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-5"
    >
      <p className="mb-6 text-center font-display text-[clamp(1.05rem,3.4vw,1.35rem)] leading-[1.9] text-lotus/85">
        আলোকে নয়,
        <br />
        ফুলটাকে চিনুন।
      </p>

      <div
        ref={areaRef}
        onPointerMove={(e) => {
          const rect = areaRef.current?.getBoundingClientRect();
          if (!rect) return;
          setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
        className={`relative h-[62svh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-border/50 transition-all duration-[2000ms] ${
          found ? "brightness-110" : ""
        }`}
        style={{
          background:
            "linear-gradient(180deg, oklch(0.19 0.06 296) 0%, oklch(0.13 0.04 284) 100%)",
        }}
      >
        {blooms.map((b) => {
          const hide = found && !b.real;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => pick(b)}
              aria-label={b.real ? "একটি ফুল" : "জলের উপর কিছু একটা"}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-[1400ms] ${
                hide ? "pointer-events-none opacity-0" : "opacity-100"
              } ${b.real && !reducedMotion ? "lotus-breathe" : ""}`}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                transform: `translate(-50%,-50%) rotate(${b.tilt}deg) scale(${
                  b.scale * (b.real ? 1 + pulse * 0.03 + (near ? 0.06 : 0) : 1)
                })`,
              }}
            >
              <Lotus
                size={found && b.real ? 150 : 104}
                bloom={b.real ? (found ? 0.95 : 0.5) : 0.3 + (b.id % 3) * 0.12}
                variant={b.real ? "real" : "faint"}
                seed={b.id * 5 + run}
                withReflection={b.real}
              />
            </button>
          );
        })}

        {near && !found && real ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute h-2 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.85_0.06_30/_18%)] blur-[3px]"
            style={{ left: `${real.x}%`, top: `${real.y + 9}%` }}
          />
        ) : null}

        {note ? (
          <p className="absolute inset-x-0 bottom-8 text-center font-body text-sm text-muted-foreground">
            {note}
          </p>
        ) : null}

        {found ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-10 px-6 text-center">
            <p
              className={`font-body text-[clamp(0.95rem,3vw,1.2rem)] leading-[2] text-foreground/90 transition-opacity duration-[2000ms] ${
                phase >= 1 ? "opacity-100" : "opacity-0"
              }`}
            >
              কিছু জিনিস
              <br />
              চোখে পড়ে না—
              <br />
              চোখকে একটু থামাতে হয়।
            </p>
            <p
              className={`mt-5 font-display text-lg text-lotus transition-opacity duration-[2000ms] ${
                phase >= 2 ? "text-glow opacity-100" : "opacity-0"
              }`}
            >
              পেয়েছেন।
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
