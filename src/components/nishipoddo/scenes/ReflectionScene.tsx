import { useEffect, useRef, useState } from "react";
import { poemPage } from "@/content/poem";
import { useExperience } from "../experience";
import { Lotus } from "../Lotus";
import { PageChrome } from "../PageChrome";
import { PoemText } from "../PoemText";

/** PAGE IX — the more the water is disturbed, the less there is to see. */
export function ReflectionScene() {
  const { goToScene, sfx, reducedMotion } = useExperience();
  const page = poemPage("reflection");
  const [disturb, setDisturb] = useState(0);
  const [phase, setPhase] = useState(0);
  const area = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timings = reducedMotion ? [100, 200, 300] : [2200, 6000, 9500];
    const t = timings.map((ms, i) => window.setTimeout(() => setPhase(i + 1), ms));
    return () => t.forEach(window.clearTimeout);
  }, [reducedMotion]);

  useEffect(() => {
    const id = window.setInterval(() => setDisturb((d) => Math.max(0, d - 0.06)), 160);
    return () => window.clearInterval(id);
  }, []);

  const clarity = 1 - Math.min(1, disturb);

  return (
    <section
      aria-label={page.title}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.11 0.03 282) 0%, oklch(0.17 0.05 292) 55%, oklch(0.1 0.03 280) 100%)",
      }}
    >
      <div
        ref={area}
        onPointerDown={() => {
          setDisturb((d) => Math.min(1.4, d + 0.5));
          sfx("ripple");
        }}
        onPointerMove={(e) => {
          if (e.buttons) setDisturb((d) => Math.min(1.4, d + 0.05));
        }}
        className="relative grid h-[46svh] w-full max-w-2xl touch-none place-items-center"
      >
        <div
          className="transition-all duration-700"
          style={{
            opacity: 0.18 + clarity * 0.82,
            filter: `blur(${(1 - clarity) * 7}px)`,
            transform: `translateY(${(1 - clarity) * 18}px) scale(${0.92 + clarity * 0.08})`,
          }}
        >
          <Lotus size={reducedMotion ? 180 : 200} bloom={0.35 + clarity * 0.4} withReflection />
        </div>
      </div>

      <div className="relative max-w-md text-center font-body text-[clamp(1rem,3.6vw,1.35rem)] leading-[2.1]">
        <p className={`transition-opacity duration-[2000ms] ${phase >= 1 ? "opacity-100" : "opacity-0"}`}>
          {page.lines[0]}
          <br />
          {page.lines[1]}
        </p>
        <p className={`mt-6 transition-opacity duration-[2000ms] ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
          {page.lines[3]}
          <br />
          {page.lines[4]}
        </p>
      </div>

      <div className="mt-8 max-w-md opacity-70">
        <PoemText lines={page.lines.slice(6)} step={800} delay={9000} className="text-sm" />
      </div>

      <PageChrome
        id="reflection"
        ready={phase >= 3 && clarity > 0.85}
        cue="একটু থামুন"
        onNext={() => {
          sfx("page");
          goToScene("final");
        }}
      />
    </section>
  );
}
