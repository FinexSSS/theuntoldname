import { useEffect, useState } from "react";
import { poemPage } from "@/content/poem";
import { useExperience } from "../experience";
import { Lotus } from "../Lotus";
import { PageChrome } from "../PageChrome";
import { PoemText } from "../PoemText";

/** PAGE X — darkness, one lotus, one small light. Then room to breathe. */
export function FinalScene() {
  const { goToScene, sfx, run, reducedMotion } = useExperience();
  const page = poemPage("final");
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setHeld(true), reducedMotion ? 300 : 15000);
    return () => window.clearTimeout(t);
  }, [reducedMotion]);

  return (
    <section
      aria-label={page.title}
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6"
      style={{ background: "oklch(0.08 0.02 280)" }}
    >
      <div className="relative opacity-90">
        <Lotus size={170} bloom={0.68} seed={run * 11 + 5} />
      </div>

      <PoemText
        lines={page.lines}
        className="mt-10 max-w-md text-[clamp(1.05rem,3.8vw,1.4rem)] text-foreground/85"
        step={1100}
        delay={800}
      />

      <p
        className={`mt-16 font-body text-xs leading-[2.2] text-muted-foreground/70 transition-opacity duration-[3500ms] ${
          held ? "opacity-100" : "opacity-0"
        }`}
      >
        কিছু ফুল
        <br />
        দিনের জন্য ফোটে না।
      </p>

      <PageChrome
        id="final"
        ready={held}
        cue="রেশ"
        onNext={() => {
          sfx("dissolve");
          goToScene("ending");
        }}
      />
    </section>
  );
}
