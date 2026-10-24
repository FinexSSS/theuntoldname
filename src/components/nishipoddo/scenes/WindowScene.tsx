import { useEffect, useRef, useState } from "react";
import { poemPage } from "@/content/poem";
import { PageChrome } from "../PageChrome";
import { PoemText } from "../PoemText";
import { useExperience } from "../experience";

/** PAGE IV — a curtain drawn aside; behind it, the light that stayed. */
export function WindowScene() {
  const { goToScene, sfx, discover, reducedMotion } = useExperience();
  const page = poemPage("window");
  const frame = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const [open, setOpen] = useState(reducedMotion ? 1 : 0);
  const [isDragging, setIsDragging] = useState(false);

  const opened = open >= 0.92;

  const setFromEvent = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    const v = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setOpen((prev) => Math.max(prev, v));
  };

  const nudge = () => setOpen((v) => Math.min(1, v < 0.3 ? 0.45 : v + 0.35));

  useEffect(() => {
    if (!opened) return;
    discover("window");
    sfx("chime");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <section
      aria-label={page.title}
      className="relative flex min-h-[100svh] select-none flex-col items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, oklch(0.15 0.04 290) 0%, oklch(0.08 0.02 280) 75%)",
      }}
    >
      <p
        className={`mb-6 flex items-center gap-3 font-ui text-[0.72rem] tracking-[0.28em] text-accent/75 transition-opacity duration-700 ${
          opened ? "opacity-0" : "opacity-100"
        }`}
      >
        পর্দাটি ডানদিকে সরান
        <span aria-hidden="true" className="curtain-hint text-accent">
          →
        </span>
      </p>

      <div
        ref={frame}
        onPointerDown={(e) => {
          e.preventDefault();
          dragging.current = true;
          startX.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          if (Math.abs(e.clientX - startX.current) > 4) setIsDragging(true);
          setFromEvent(e.clientX);
        }}
        onPointerUp={(e) => {
          const wasDrag = Math.abs(e.clientX - startX.current) > 4;
          dragging.current = false;
          setIsDragging(false);
          if (!wasDrag) nudge();
        }}
        onPointerCancel={() => {
          dragging.current = false;
          setIsDragging(false);
        }}
        role="slider"
        tabIndex={0}
        aria-label="পর্দা সরান"
        aria-valuenow={Math.round(open * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={(e) => {
          if (!["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown"].includes(e.key)) return;
          e.preventDefault();
          e.stopPropagation();
          const change = e.key === "ArrowRight" || e.key === "ArrowUp" ? 0.15 : -0.15;
          setOpen((v) => Math.max(0, Math.min(1, v + change)));
        }}
        className="window-frame relative h-[42svh] w-full max-w-lg cursor-ew-resize touch-none overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-[1800ms]"
          style={{
            opacity: 0.25 + open * 0.75,
            background:
              "radial-gradient(ellipse at 50% 45%, oklch(0.86 0.09 75 / 42%), oklch(0.22 0.06 295 / 20%) 70%)",
          }}
        />
        <div className="absolute inset-0 grid place-items-center px-8">
          <PoemText
            lines={page.lines}
            step={0}
            className="text-[clamp(0.95rem,3.4vw,1.25rem)] text-foreground/90 transition-opacity duration-700"
          />
        </div>
        <div
          aria-hidden="true"
          className={`curtain absolute inset-y-0 left-0 ${isDragging ? "curtain--dragging" : ""}`}
          style={{ width: `${100 - open * 100}%` }}
        />
        {!opened && (
          <div
            aria-hidden="true"
            className={`curtain-handle pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 ${
              isDragging ? "curtain-handle--dragging" : ""
            }`}
            style={{ left: `${100 - open * 100}%` }}
          >
            <span className="flex h-16 w-9 items-center justify-center gap-[3px] rounded-full border border-accent/45 bg-background/70 shadow-[0_0_24px_oklch(0.86_0.09_75_/_25%)] backdrop-blur-sm">
              <i className="block h-6 w-px bg-accent/60" />
              <i className="block h-9 w-px bg-accent/80" />
              <i className="block h-6 w-px bg-accent/60" />
            </span>
            <span className="curtain-hint absolute left-full top-1/2 ml-2 -translate-y-1/2 font-ui text-sm text-accent">
              →
            </span>
          </div>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-ui text-[0.6rem] tracking-[0.4em] text-muted-foreground/50"
        >
          {opened ? "" : "পর্দা ধরে টানুন"}
        </span>
      </div>

      <p
        className={`mt-10 max-w-sm text-center font-body text-[clamp(0.95rem,3vw,1.15rem)] leading-[2] text-accent/85 transition-opacity duration-[2200ms] ${
          opened ? "opacity-100" : "opacity-0"
        }`}
      >
        সব কথা থাকে না,
        <br />
        কিছু রেশ থাকে।
      </p>

      <PageChrome
        id="window"
        ready={opened}
        onNext={() => {
          sfx("page");
          goToScene("name");
        }}
      />
    </section>
  );
}
