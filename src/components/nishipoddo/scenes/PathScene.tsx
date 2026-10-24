import { useMemo, useState } from "react";
import { poemPage } from "@/content/poem";
import { PageChrome } from "../PageChrome";
import { PoemText } from "../PoemText";
import { useExperience } from "../experience";

type Path = { id: number; d: string; real: boolean };

function makePaths(run: number): Path[] {
  const realIndex = (run * 3) % 4;
  return Array.from({ length: 4 }, (_, i) => {
    const y = 30 + i * 14 + ((run + i) % 3) * 2;
    return {
      id: i,
      real: i === realIndex,
      d: `M -4 ${y + 22} C 26 ${y + 16 - i * 2}, 52 ${y + 8}, 78 ${y - 4} S 100 ${y - 12}, 104 ${y - 14}`,
    };
  });
}

/** PAGE II — four faint lines across the water. Only one keeps going. */
export function PathScene() {
  const { goToScene, sfx, discover, run } = useExperience();
  const page = poemPage("path");
  const paths = useMemo(() => makePaths(run), [run]);
  const [dead, setDead] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);

  const choose = (p: Path) => {
    if (solved) return;
    if (p.real) {
      setSolved(true);
      discover("path");
      sfx("ripple");
    } else if (!dead.includes(p.id)) {
      setDead((d) => [...d, p.id]);
      sfx("dissolve");
    }
  };

  return (
    <section
      aria-label={page.title}
      className={`relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 transition-all duration-[2500ms] ${
        solved ? "brightness-110" : ""
      }`}
      style={{
        background:
          "linear-gradient(180deg, oklch(0.1 0.03 281) 0%, oklch(0.15 0.05 290) 58%, oklch(0.12 0.04 286) 100%)",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {paths.map((p) => {
          const isDead = dead.includes(p.id);
          return (
            <path
              key={p.id}
              d={p.d}
              fill="none"
              vectorEffect="non-scaling-stroke"
              stroke={
                solved && p.real
                  ? "oklch(0.92 0.07 45 / 85%)"
                  : isDead
                    ? "oklch(0.6 0.03 300 / 8%)"
                    : "oklch(0.72 0.05 310 / 26%)"
              }
              strokeWidth={solved && p.real ? 1.6 : 1}
              className="transition-all duration-[1800ms]"
              style={
                solved && p.real
                  ? { filter: "drop-shadow(0 0 10px oklch(0.9 0.08 50 / 55%))" }
                  : undefined
              }
            />
          );
        })}
      </svg>

      {!solved
        ? paths.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-label="একটি পথ"
              onClick={() => choose(p)}
              className={`absolute left-0 h-14 w-full transition-opacity duration-1000 ${
                dead.includes(p.id) ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
              style={{ top: `${28 + p.id * 14}%` }}
            />
          ))
        : null}

      <div className="pointer-events-none relative max-w-lg">
        <PoemText
          lines={page.lines}
          className="text-[clamp(1.1rem,4vw,1.5rem)] text-foreground/85"
          step={520}
        />
        <p
          className={`mt-10 text-center font-body text-sm text-accent/80 transition-opacity duration-[2200ms] ${
            solved ? "opacity-100" : "opacity-0"
          }`}
        >
          দিশা সবসময় সামনে থাকে না।
        </p>
      </div>

      <PageChrome
        id="path"
        ready={solved}
        onNext={() => {
          sfx("ripple");
          goToScene("lamp");
        }}
      />
    </section>
  );
}
