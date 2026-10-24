import { useEffect, useRef, useState } from "react";

/** Refined desktop-only cursor: a soft point that opens into a ring over interactive things. */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [ring, setRing] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;
    document.body.classList.add("cursor-hidden");

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const el = e.target as HTMLElement | null;
      setRing(Boolean(el?.closest("button, a, [role='slider'], [data-interactive]")));
    };
    window.addEventListener("pointermove", move);

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("cursor-hidden");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={dot} aria-hidden="true" className="nishi-cursor">
      <span className={ring ? "nishi-cursor-ring is-ring" : "nishi-cursor-ring"} />
    </div>
  );
}
