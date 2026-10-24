import { useEffect, useRef } from "react";
import { useExperience } from "./experience";

type Petal = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  alpha: number;
  phase: number;
  depth: number; // 0 background .. 1 foreground
};

type Ripple = { x: number; y: number; t: number; strength: number };

/**
 * Layered ambient canvas: depth-sorted motes, tap ripples on the water,
 * and short-lived poetic light metaphors. Reacts gently to the music.
 */
export function AmbientCanvas() {
  const { bandsRef, fxRef, reducedMotion, lakeMood } = useExperience();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripples = useRef<Ripple[]>([]);
  const stars = useRef<{ x: number; y: number; r: number; phase: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let petals: Petal[] = [];
    let raf = 0;
    let hidden = false;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    const seed = () => {
      const base = reducedMotion ? 10 : isMobile ? 22 : Math.min(46, Math.round(width / 34));
      petals = Array.from({ length: base }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.5 + depth * 1.6,
          speed: 0.04 + depth * 0.32,
          drift: (Math.random() - 0.5) * (0.08 + depth * 0.3),
          alpha: 0.06 + depth * 0.22,
          phase: Math.random() * Math.PI * 2,
          depth,
        };
      }).sort((a, b) => a.depth - b.depth);
      stars.current = Array.from({ length: isMobile ? 26 : 48 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.55,
        r: 0.4 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();
    window.addEventListener("resize", resize);

    const onPointer = (e: PointerEvent) => {
      ripples.current.push({ x: e.clientX, y: e.clientY, t: 0, strength: 1 });
      if (ripples.current.length > 5) ripples.current.shift();
    };
    window.addEventListener("pointerdown", onPointer);

    const onVis = () => {
      hidden = document.hidden;
      if (!hidden) {
        raf = window.requestAnimationFrame(draw);
      } else {
        window.cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    let time = 0;
    function draw() {
      if (hidden) return;
      time += 0.016;
      const b = bandsRef.current;
      const calm = lakeMood.current; // 1 = unnaturally still
      ctx!.clearRect(0, 0, width, height);

      // stars shimmer with high frequencies
      for (const s of stars.current) {
        const tw = 0.25 + 0.35 * (Math.sin(time * 1.4 + s.phase) * 0.5 + 0.5) + b.high * 0.5;
        ctx!.fillStyle = `rgba(236, 226, 255, ${Math.min(0.7, tw) * (1 - calm * 0.4)})`;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // depth-layered motes
      for (const p of petals) {
        const stillness = 1 - calm * 0.92;
        p.y -= p.speed * (reducedMotion ? 0.35 : 1) * (1 + b.bass * 0.7) * stillness;
        p.x += Math.sin(time * 0.5 + p.phase) * p.drift * stillness;
        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        const radius = p.r * (1 + b.level * 0.35);
        const glow = p.alpha * (0.75 + b.mid * 0.6);
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 6);
        grad.addColorStop(0, `rgba(255, 214, 220, ${glow})`);
        grad.addColorStop(1, "rgba(255, 214, 220, 0)");
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, radius * 6, 0, Math.PI * 2);
        ctx!.fill();
      }

      // water ripples
      ripples.current = ripples.current.filter((r) => r.t < 1);
      for (const r of ripples.current) {
        r.t += 0.014;
        const radius = r.t * 240;
        ctx!.strokeStyle = `rgba(212, 168, 255, ${0.3 * (1 - r.t)})`;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.ellipse(r.x, r.y, radius, radius * 0.42, 0, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.strokeStyle = `rgba(255, 198, 205, ${0.18 * (1 - r.t)})`;
        ctx!.beginPath();
        ctx!.ellipse(r.x, r.y, radius * 0.6, radius * 0.25, 0, 0, Math.PI * 2);
        ctx!.stroke();
      }

      // poetic word metaphors
      const fxs = fxRef.current;
      for (let i = fxs.length - 1; i >= 0; i--) {
        const fx = fxs[i]!;
        fx.t += 0.006;
        if (fx.t >= 1) {
          fxs.splice(i, 1);
          continue;
        }
        const fade = Math.sin(fx.t * Math.PI);
        if (fx.kind === "glow") {
          const g = ctx!.createRadialGradient(
            width * 0.78,
            height * 0.3,
            0,
            width * 0.78,
            height * 0.3,
            220,
          );
          g.addColorStop(0, `rgba(255, 216, 178, ${0.3 * fade})`);
          g.addColorStop(1, "rgba(255,216,178,0)");
          ctx!.fillStyle = g;
          ctx!.fillRect(0, 0, width, height);
        } else if (fx.kind === "warm-horizon") {
          const g = ctx!.createLinearGradient(0, height * 0.45, 0, height);
          g.addColorStop(0, "rgba(255, 170, 140, 0)");
          g.addColorStop(1, `rgba(255, 168, 132, ${0.18 * fade})`);
          ctx!.fillStyle = g;
          ctx!.fillRect(0, height * 0.45, width, height * 0.55);
        } else if (fx.kind === "lamp" || fx.kind === "lake-lamp") {
          const lx = width * (fx.kind === "lamp" ? 0.22 : 0.5);
          const ly = height * (fx.kind === "lamp" ? 0.35 : 0.78) - fx.t * 40;
          const g = ctx!.createRadialGradient(lx, ly, 0, lx, ly, 90);
          g.addColorStop(0, `rgba(255, 214, 160, ${0.45 * fade})`);
          g.addColorStop(1, "rgba(255,214,160,0)");
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(lx, ly, 90, 0, Math.PI * 2);
          ctx!.fill();
          if (fx.kind === "lake-lamp") {
            ctx!.fillStyle = `rgba(255, 214, 160, ${0.12 * fade})`;
            ctx!.fillRect(lx - 14, ly, 28, height * 0.16);
          }
        } else if (fx.kind === "star") {
          const sx = width * 0.62;
          const sy = height * 0.18;
          const g = ctx!.createRadialGradient(sx, sy, 0, sx, sy, 70);
          g.addColorStop(0, `rgba(255, 255, 240, ${0.6 * fade})`);
          g.addColorStop(1, "rgba(255,255,240,0)");
          ctx!.fillStyle = g;
          ctx!.beginPath();
          ctx!.arc(sx, sy, 70, 0, Math.PI * 2);
          ctx!.fill();
        } else if (fx.kind === "hush") {
          ctx!.fillStyle = `rgba(10, 8, 24, ${0.16 * fade})`;
          ctx!.fillRect(0, 0, width, height);
        }
      }

      raf = window.requestAnimationFrame(draw);
    }
    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [bandsRef, fxRef, reducedMotion, lakeMood]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
