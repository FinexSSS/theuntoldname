import { useEffect } from "react";
import { POEM_PAGES, poemPage, type PoemPageId } from "@/content/poem";
import { useExperience } from "./experience";

/**
 * The faint manuscript page number plus the quiet cue that turns the page.
 * Also registers the scene's "move on" handler for keyboard and swipe.
 */
export function PageChrome({
  id,
  ready,
  cue = "পাতা উল্টান",
  onNext,
}: {
  id: PoemPageId;
  ready: boolean;
  cue?: string;
  onNext: () => void;
}) {
  const page = poemPage(id);
  const { advanceRef } = useExperience();

  useEffect(() => {
    advanceRef.current = onNext;
    return () => {
      advanceRef.current = null;
    };
  }, [advanceRef, onNext]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-32 z-20 flex flex-col items-center gap-4 px-6">
      <span className="font-ui text-[0.62rem] tracking-[0.42em] text-muted-foreground/45">
        {`নিশি, ${page.numeral} / ${POEM_PAGES.length === 10 ? "১০" : POEM_PAGES.length}`}
      </span>
      <button
        type="button"
        data-cue="page"
        data-ready={ready}
        onClick={onNext}
        className={`pointer-events-auto font-display text-[0.95rem] transition-all duration-1000 hover:text-lotus hover:text-glow ${
          ready ? "text-lotus/90" : "text-accent/85"
        }`}
      >
        {cue}
      </button>
    </div>
  );
}
