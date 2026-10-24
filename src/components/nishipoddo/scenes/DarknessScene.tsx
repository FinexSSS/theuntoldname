import { useRef, useState } from "react";
import { poemPage } from "@/content/poem";
import { PageChrome } from "../PageChrome";
import { PoemText } from "../PoemText";
import { useExperience } from "../experience";

const COLS = 5;
const ROWS = 4;

/** PAGE I — almost black. Words are found inside the darkness, not shown. */
export function DarknessScene() {
  const { goToScene, sfx, reducedMotion } = useExperience();
  const page = poemPage("darkness");
  const surface = useRef<HTMLDivElement | null>(null);
  const seen = useRef(new Set<number>());
  const [explored, setExplored] = useState(reducedMotion ? 1 : 0);

  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = surface.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    const cell =
      Math.floor((x / rect.width) * COLS) + Math.floor((y / rect.height) * ROWS) * COLS;
    if (!seen.current.has(cell)) {
      seen.current.add(cell);
      setExplored(Math.min(1, seen.current.size / (COLS * ROWS * 0.55)));
    }
  };

  const open = explored >= 1;

  return (
    <section
      aria-label={page.title}
      className="relative flex min-h-[100svh] items-center justify-center px-6"
      style={{ background: "radial-gradient(ellipse at 50% 120%, oklch(0.17 0.05 288), oklch(0.09 0.03 280) 70%)" }}
    >
      <div
        ref={surface}
        onPointerMove={track}
        className="ink-surface relative w-full max-w-xl touch-none py-10"
      >
        <PoemText
          lines={page.lines}
          live={false}
          className="ink-dim text-[clamp(1.15rem,4.2vw,1.55rem)]"
          step={0}
        />
        <div
          aria-hidden="true"
          className="ink-bright pointer-events-none absolute inset-0 py-10 text-[clamp(1.15rem,4.2vw,1.55rem)]"
          style={open ? { WebkitMaskImage: "none", maskImage: "none" } : undefined}
        >
          <PoemText lines={page.lines} live={false} step={0} />
        </div>
      </div>

      <PageChrome
        id="darkness"
        ready={open}
        onNext={() => {
          sfx("page");
          goToScene("path");
        }}
      />
    </section>
  );
}
