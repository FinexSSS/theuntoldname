import { useEffect, useState } from "react";
import { poemPage } from "@/content/poem";
import { PageChrome } from "../PageChrome";
import { PoemText } from "../PoemText";
import { useExperience } from "../experience";

/** PAGE VI — dark paper. Printed ink. One blot that keeps a sentence. */
export function GratitudeScene() {
  const { goToScene, sfx, discover, reducedMotion } = useExperience();
  const page = poemPage("gratitude");
  const [blot, setBlot] = useState(false);
  const [spread, setSpread] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setBlot(true), reducedMotion ? 600 : 7200);
    return () => window.clearTimeout(t);
  }, [reducedMotion]);

  return (
    <section
      aria-label={page.title}
      className="relative flex min-h-[100svh] items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.24 0.03 300) 0%, oklch(0.13 0.02 290) 78%)",
      }}
    >
      <article className="paper relative w-full max-w-lg px-8 py-16 sm:px-14">
        <PoemText
          lines={page.lines}
          className="text-[clamp(1.1rem,3.9vw,1.45rem)] text-foreground/88"
          step={950}
          align="left"
        />

        <button
          type="button"
          aria-label=" "
          onClick={() => {
            if (spread) return;
            setSpread(true);
            discover("ink");
          }}
          className={`ink-blot absolute right-10 bottom-10 transition-all duration-[1400ms] ${
            blot ? "opacity-100" : "opacity-0"
          } ${spread ? "is-spread" : ""}`}
        />

        <p
          className={`mt-12 font-body text-sm leading-[2] text-accent/85 transition-opacity duration-[2400ms] ${
            spread ? "opacity-100" : "opacity-0"
          }`}
        >
          মনে থাকে বলেই
          <br />
          সবকিছুকে শব্দ দিতে হয় না।
        </p>
      </article>

      <PageChrome
        id="gratitude"
        ready={blot}
        onNext={() => {
          sfx("page");
          goToScene("sky");
        }}
      />
    </section>
  );
}
