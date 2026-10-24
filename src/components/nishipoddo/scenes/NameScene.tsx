import { useEffect, useState } from "react";
import { useExperience } from "../experience";
import { Lotus } from "../Lotus";
import { PageChrome } from "../PageChrome";
import { useStillness } from "../useStillness";

const MOON_LINES = [
  "",
  "",
  "",
  "",
  "নিশিরও কিছু গোপন কথা থাকে।",
];

/** PAGE V — the lake returns. The lotus rises, and the name arrives last. */
export function NameScene() {
  const { goToScene, sfx, discover, moonClicks, bumpMoon, bandsRef, reducedMotion, run } =
    useExperience();
  const [phase, setPhase] = useState(0);
  const [breath, setBreath] = useState(0);
  const still = useStillness(!reducedMotion);

  useEffect(() => {
    const timings = reducedMotion ? [100, 200, 300, 400, 500] : [1400, 4200, 7200, 10200, 13000];
    const timers = timings.map((ms, i) =>
      window.setTimeout(() => setPhase(i + 1), ms),
    );
    const done = window.setTimeout(() => discover("name"), reducedMotion ? 550 : 13200);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [discover, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const loop = () => {
      setBreath(bandsRef.current.level);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [bandsRef, reducedMotion]);

  const moon = Math.min(moonClicks, 5);

  return (
    <section
      aria-label="নাম"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.13 0.05 285) 0%, oklch(0.2 0.06 298) 52%, oklch(0.16 0.05 292) 100%)",
      }}
    >
      {/* the unlabelled moon */}
      <button
        type="button"
        aria-label=" "
        onClick={() => {
          if (moon >= 5) return;
          bumpMoon();
          if (moon >= 4) discover("moon");
          if (moon === 2) sfx("ripple");
        }}
        className="absolute top-[10%] right-[14%] h-16 w-16 rounded-full transition-all duration-[1600ms]"
        style={{
          background: `radial-gradient(circle at 40% 38%, oklch(0.97 0.03 90 / ${0.5 + moon * 0.1}), transparent 72%)`,
          boxShadow: `0 0 ${40 + moon * 18}px ${8 + moon * 4}px oklch(0.95 0.04 90 / ${0.08 + moon * 0.04})`,
        }}
      />
      {moon >= 2 ? (
        <span
          aria-hidden="true"
          className="absolute top-[22%] left-[30%] h-1 w-1 rounded-full bg-[oklch(0.98_0.02_90)] shadow-[0_0_14px_4px_oklch(0.95_0.04_90/_35%)]"
        />
      ) : null}

      {/* water */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[42%] transition-opacity duration-[2200ms]"
        style={{
          opacity: moon >= 3 ? 0.85 : 0.4,
          background:
            "linear-gradient(180deg, oklch(0.24 0.06 300 / 60%), oklch(0.11 0.04 282 / 92%))",
        }}
      />
      {moon >= 4 ? <span aria-hidden="true" className="moon-ripple" /> : null}

      <div className="relative flex flex-col items-center pb-28">
        <div
          className={`transition-all duration-[3000ms] ${phase >= 1 ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          style={{ transform: `scale(${1 + breath * 0.02})` }}
        >
          <Lotus
            size={reducedMotion ? 150 : 170}
            bloom={Math.min(1, 0.35 + phase * 0.12 + (moon >= 5 ? 0.25 : 0))}
            withReflection
            seed={run * 7 + 3}
          />
        </div>

        <h2
          className={`mt-2 font-display text-[clamp(2.2rem,9vw,4rem)] text-lotus transition-all duration-[2600ms] ${
            phase >= 2 ? "text-glow opacity-100" : "opacity-0"
          }`}
        >
          নিশিপদ্ম
        </h2>

        <div className="mt-6 max-w-md text-center font-body text-[clamp(1rem,3.4vw,1.3rem)] leading-[2.1]">
          <p className={`transition-opacity duration-[2200ms] ${phase >= 3 ? "opacity-100" : "opacity-0"}`}>
            নিশি—
            <br />
            যেখানে সব শব্দ ধীরে যায়।
          </p>
          <p
            className={`mt-6 transition-opacity duration-[2200ms] ${phase >= 4 ? "opacity-100" : "opacity-0"}`}
          >
            পদ্ম—
            <br />
            যে অন্ধকারের জল ঠেলে
            <br />
            আলোয় মুখ তোলে।
          </p>
          <p
            className={`mt-6 font-display text-lotus transition-opacity duration-[2600ms] ${
              phase >= 5 ? "opacity-100" : "opacity-0"
            }`}
          >
            নিশিপদ্ম।
          </p>
        </div>
      </div>

      {moon >= 5 ? (
        <p className="absolute bottom-[30%] font-body text-xs text-accent/70">{MOON_LINES[4]}</p>
      ) : null}

      {still ? (
        <>
          <span aria-hidden="true" className="drift-petal" />
          <p className="absolute bottom-[24%] font-body text-xs text-muted-foreground/70">
            স্থির জলেরও রেশ থাকে।
          </p>
        </>
      ) : null}

      <PageChrome
        id="name"
        ready={phase >= 5}
        cue="একটু থামুন"
        onNext={() => {
          sfx("ripple");
          goToScene("game");
        }}
      />
    </section>
  );
}
