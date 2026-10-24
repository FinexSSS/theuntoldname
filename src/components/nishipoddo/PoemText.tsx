import { LIVE_WORDS, WORD_FX, type LiveWord } from "@/content/poem";
import { useExperience } from "./experience";

function Line({ line, live }: { line: string; live: boolean }) {
  const { spawnFx, sfx } = useExperience();
  if (line === "") return <span className="block h-[0.9em]" />;
  if (!live) return <>{line}</>;

  const parts = line.split(/(\s+)/);
  return (
    <>
      {parts.map((part, i) => {
        const bare = part.replace(/[।,—“”…\-?]/g, "");
        const word = LIVE_WORDS.find((w) => bare === w);
        if (!word) return <span key={i}>{part}</span>;
        const respond = () => {
          spawnFx(WORD_FX[word as LiveWord]);
          if (word === "প্রদীপ" || word === "পদ্ম") sfx("ripple");
        };
        return (
          <button
            key={i}
            type="button"
            onPointerEnter={respond}
            onClick={respond}
            className="live-word"
          >
            {part}
          </button>
        );
      })}
    </>
  );
}

/**
 * Poem typography. Lines arrive one after another like breath,
 * and a few words stay alive to the pointer.
 */
export function PoemText({
  lines,
  live = true,
  delay = 0,
  step = 900,
  className = "",
  align = "center",
}: {
  lines: string[];
  live?: boolean;
  delay?: number;
  step?: number;
  className?: string;
  align?: "center" | "left";
}) {
  const { reducedMotion } = useExperience();

  return (
    <div
      className={`font-body leading-[2.15] ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {lines.map((line, i) => (
        <p
          key={i}
          className={reducedMotion ? "" : "line-breathe"}
          style={
            reducedMotion ? undefined : { animationDelay: `${delay + i * step}ms` }
          }
        >
          <Line line={line} live={live} />
        </p>
      ))}
    </div>
  );
}
