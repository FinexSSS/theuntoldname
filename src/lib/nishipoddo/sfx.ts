/** Tiny synthesized sound effects — no asset downloads, very low volume. */
let ctx: AudioContext | null = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    try {
      ctx = new Ctx();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export type SfxName = "ripple" | "page" | "chime" | "dissolve";

export function playSfx(name: SfxName) {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const master = c.createGain();
  master.connect(c.destination);

  if (name === "chime") {
    master.gain.value = 0.07;
    [880, 1320, 1760].forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0, now + i * 0.09);
      g.gain.linearRampToValueAtTime(0.6 / (i + 1), now + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 1.6);
      o.connect(g);
      g.connect(master);
      o.start(now + i * 0.09);
      o.stop(now + i * 0.09 + 1.7);
    });
    return;
  }

  // noise-based textures: ripple / page / dissolve
  const dur = name === "page" ? 0.5 : 0.7;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, name === "page" ? 1.4 : 3);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = name === "page" ? "highpass" : "lowpass";
  filter.frequency.value = name === "page" ? 1800 : name === "ripple" ? 900 : 500;
  master.gain.value = name === "page" ? 0.05 : 0.045;
  src.connect(filter);
  filter.connect(master);
  src.start(now);
}
