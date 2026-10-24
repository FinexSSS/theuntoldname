import { useEffect, useRef, useState } from "react";
import { LIGHTS, poemPage, type LightId } from "@/content/poem";
import { useExperience } from "../experience";
import { Lotus } from "../Lotus";
import { PageChrome } from "../PageChrome";
import { PoemText } from "../PoemText";

const POSITIONS = [
  { x: 22, y: 30 },
  { x: 68, y: 22 },
  { x: 44, y: 46 },
  { x: 80, y: 52 },
  { x: 16, y: 60 },
];

/** PAGE VIII — the warmest page. Five small lights, five different rooms. */
export function LightScene() {
  const { goToScene, sfx, discover, bandsRef, reducedMotion, lakeMood, run } = useExperience();
  const page = poemPage("light");
  const [found, setFound] = useState<LightId[]>([]);
  const [active, setActive] = useState<LightId | null>(null);
  const [amp, setAmp] = useState(0);
  const responseTimer = useRef<number | null>(null);
  const moodTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (responseTimer.current !== null) window.clearTimeout(responseTimer.current);
      if (moodTimer.current !== null) window.clearTimeout(moodTimer.current);
      lakeMood.current = 0;
    },
    [lakeMood],
  );

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const loop = () => {
      setAmp(bandsRef.current.level);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [bandsRef, reducedMotion]);

  const all = found.length === LIGHTS.length;
  useEffect(() => {
    if (all) discover("lights");
  }, [all, discover]);

  const touch = (id: LightId) => {
    setActive(id);
    setFound((f) => (f.includes(id) ? f : [...f, id]));
    if (id === "nirobota") {
      lakeMood.current = 1;
      if (moodTimer.current !== null) window.clearTimeout(moodTimer.current);
      moodTimer.current = window.setTimeout(
        () => (lakeMood.current = 0),
        reducedMotion ? 200 : 1200,
      );
    } else if (id === "asha") {
      sfx("chime");
    }
    if (responseTimer.current !== null) window.clearTimeout(responseTimer.current);
    responseTimer.current = window.setTimeout(
      () => setActive((a) => (a === id ? null : a)),
      reducedMotion ? 500 : 2600,
    );
  };

  return (
    <section
      aria-label={page.title}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6"
      style={{
        background:
          "radial-gradient(ellipse at 50% 60%, oklch(0.21 0.05 300) 0%, oklch(0.11 0.03 282) 76%)",
      }}
    >
      {/* atmosphere responses */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 transition-opacity duration-[1800ms]"
        style={{
          opacity: active === "sahos" ? 0.55 : 0,
          background: "linear-gradient(180deg, transparent, oklch(0.78 0.1 55 / 45%))",
        }}
      />
      {active === "asha" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[12%] left-[68%] h-1.5 w-1.5 rounded-full bg-[oklch(0.98_0.03_88)] shadow-[0_0_24px_8px_oklch(0.95_0.05_85/_45%)]"
        />
      ) : null}
      {active === "smriti" ? (
        <div className="pointer-events-none absolute bottom-[6%] left-1/2 -translate-x-1/2 opacity-40">
          <Lotus size={140} bloom={0.6} variant="faint" seed={run + 2} />
        </div>
      ) : null}
      {active === "kotha" ? (
        <p className="pointer-events-none absolute top-[16%] left-1/2 -translate-x-1/2 font-body text-sm text-foreground/45">
          কিছু কথা এখনও কোথাও লেগে আছে।
        </p>
      ) : null}

      {LIGHTS.map((l, i) => {
        const pos = POSITIONS[i]!;
        const on = found.includes(l.id);
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => touch(l.id)}
            aria-label={l.word}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: `${26 + amp * 8}px`,
              height: `${26 + amp * 8}px`,
              background: `radial-gradient(circle at 42% 38%, oklch(0.96 0.08 80 / ${on ? 0.85 : 0.35}), transparent 70%)`,
              boxShadow: on ? "0 0 26px 8px oklch(0.92 0.09 75 / 22%)" : undefined,
            }}
          >
            <span
              className={`absolute top-full left-1/2 mt-1 -translate-x-1/2 font-ui text-[0.6rem] tracking-[0.3em] whitespace-nowrap transition-opacity duration-700 ${
                on ? "text-lotus/70 opacity-100" : "opacity-0"
              }`}
            >
              {l.word}
            </span>
          </button>
        );
      })}

      <div
        className={`pointer-events-none relative max-w-md transition-opacity duration-[2600ms] ${all ? "opacity-100" : "opacity-25"}`}
      >
        <PoemText
          lines={page.lines}
          className="text-[clamp(1rem,3.6vw,1.35rem)] text-foreground/85"
          step={520}
        />
      </div>

      <PageChrome
        id="light"
        ready={all}
        onNext={() => {
          sfx("ripple");
          goToScene("reflection");
        }}
      />
    </section>
  );
}
