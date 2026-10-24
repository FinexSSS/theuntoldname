import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import trackAsset from "@/assets/nishipoddo.mp3.asset.json";
import { useExperience } from "./experience";

const BAR_COUNT = 64;

function bn(text: string) {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return text.replace(/\d/g, (d) => digits[Number(d)] ?? d);
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "০:০০";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return bn(`${m}:${s.toString().padStart(2, "0")}`);
}

/** Deterministic resting waveform shape so the bar looks like a track, not noise. */
function restingShape(i: number) {
  const a = Math.sin(i * 0.45) * 0.5 + 0.5;
  const b = Math.sin(i * 1.31 + 1.7) * 0.5 + 0.5;
  const c = Math.sin(i * 0.19 + 0.4) * 0.5 + 0.5;
  return 0.22 + (a * 0.4 + b * 0.25 + c * 0.35) * 0.6;
}

export function AudioPlayer() {
  const { bandsRef, musicStartRef, effectsEnabled, toggleEffects } = useExperience();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveRef = useRef<Float32Array>(new Float32Array(BAR_COUNT));
  const dragging = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(true);
  const [volume, setVolume] = useState(0.85);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const bars = useMemo(() => Array.from({ length: BAR_COUNT }, (_, i) => restingShape(i)), []);

  const ensureAnalyser = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || analyserRef.current) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    try {
      const ctx = new Ctx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      void ctx.resume();
    } catch {
      /* analysis is decorative; playback continues without it */
    }
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    ensureAnalyser();
    try {
      await audioContextRef.current?.resume();
      await audio.play();
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [ensureAnalyser]);

  useEffect(() => {
    musicStartRef.current = () => {
      void play();
    };
    return () => {
      musicStartRef.current = null;
    };
  }, [musicStartRef, play]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  // waveform painting + frequency band analysis
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const freq = new Uint8Array(128);

    const paint = () => {
      if (document.hidden) {
        raf = window.requestAnimationFrame(paint);
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.floor(w * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const analyser = analyserRef.current;
      let bass = 0;
      let mid = 0;
      let high = 0;
      if (analyser) {
        analyser.getByteFrequencyData(freq);
        for (let i = 0; i < 10; i++) bass += freq[i] ?? 0;
        for (let i = 10; i < 48; i++) mid += freq[i] ?? 0;
        for (let i = 48; i < 110; i++) high += freq[i] ?? 0;
        bass = bass / 10 / 255;
        mid = mid / 38 / 255;
        high = high / 62 / 255;
      }
      const b = bandsRef.current;
      b.bass = b.bass * 0.86 + bass * 0.14;
      b.mid = b.mid * 0.86 + mid * 0.14;
      b.high = b.high * 0.86 + high * 0.14;
      b.level = (b.bass + b.mid + b.high) / 3;

      const audio = audioRef.current;
      const progress = audio && audio.duration ? audio.currentTime / audio.duration : 0;
      const gap = 2;
      const barW = Math.max(1.5, w / BAR_COUNT - gap);

      for (let i = 0; i < BAR_COUNT; i++) {
        const rest = bars[i] ?? 0.4;
        const binValue = freq[Math.floor((i / BAR_COUNT) * 100)] ?? 0;
        const target = analyser ? rest * (0.45 + (binValue / 255) * 1.1) : rest * 0.7;
        const prev = liveRef.current[i] ?? 0;
        const next = prev * 0.78 + target * 0.22;
        liveRef.current[i] = next;
        const barH = Math.max(2, Math.min(1, next) * (h - 6));
        const x = i * (barW + gap);
        const y = (h - barH) / 2;
        const played = i / BAR_COUNT <= progress;
        ctx.fillStyle = played ? "rgba(255, 194, 200, 0.95)" : "rgba(212, 168, 255, 0.3)";
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, barW / 2);
        ctx.fill();
      }
      raf = window.requestAnimationFrame(paint);
    };
    raf = window.requestAnimationFrame(paint);
    return () => window.cancelAnimationFrame(raf);
  }, [bars, bandsRef]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void play();
    else audio.pause();
  };

  const seekTo = (clientX: number, el: HTMLElement) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setCurrent(audio.currentTime);
  };

  return (
    <div className="panel rounded-2xl px-4 py-3 sm:px-5">
      <audio
        ref={audioRef}
        src={trackAsset.url}
        preload="metadata"
        loop={loop}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onCanPlay={() => setLoading(false)}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          setCurrent(a.currentTime);
          if (!Number.isFinite(a.duration) && a.seekable.length) {
            const end = a.seekable.end(a.seekable.length - 1);
            if (Number.isFinite(end) && end > 0) setDuration(end);
          }
        }}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setLoading(false);
        }}
        onError={() => {
          setFailed(true);
          setLoading(false);
        }}
      >
        <track kind="captions" />
      </audio>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "সুর থামাও" : "সুর বাজাও"}
          aria-pressed={playing}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-muted/50 text-lotus transition-transform duration-200 hover:scale-110 hover:text-primary"
        >
          {loading && !playing ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
          ) : playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div
            role="slider"
            tabIndex={0}
            aria-label="সুরের অবস্থান"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration) || 0}
            aria-valuenow={Math.floor(current)}
            aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              seekTo(e.clientX, e.currentTarget);
            }}
            onPointerMove={(e) => {
              if (dragging.current) seekTo(e.clientX, e.currentTarget);
            }}
            onPointerUp={(e) => {
              dragging.current = false;
              if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
              }
            }}
            onPointerCancel={() => {
              dragging.current = false;
            }}
            onKeyDown={(e) => {
              const audio = audioRef.current;
              if (!audio) return;
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              e.stopPropagation();
              const delta = e.key === "ArrowRight" ? 5 : -5;
              audio.currentTime = Math.min(audio.duration || 0, Math.max(0, audio.currentTime + delta));
              setCurrent(audio.currentTime);
            }}
            className="h-11 w-full cursor-pointer touch-none"
          >
            <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
          </div>
          <div className="mt-1 flex items-center justify-between font-ui text-[0.7rem] text-muted-foreground">
            <span>{formatTime(current)}</span>
            <span className="hidden tracking-[0.3em] sm:inline">নিশিপদ্মের রেশ</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <label className="hidden items-center sm:flex">
            <span className="sr-only">শব্দের মাত্রা</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                const audio = audioRef.current;
                if (audio && audio.muted) {
                  audio.muted = false;
                  setMuted(false);
                }
              }}
              className="nishi-range w-16"
              aria-label="শব্দের মাত্রা"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              const audio = audioRef.current;
              if (!audio) return;
              audio.muted = !audio.muted;
              setMuted(audio.muted);
            }}
            aria-label={muted ? "শব্দ ফেরাও" : "নীরব করো"}
            aria-pressed={muted}
            className={`grid h-11 w-11 place-items-center rounded-full border border-border transition-colors ${
              muted ? "text-muted-foreground" : "text-accent"
            } hover:text-primary`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" />
              {muted ? (
                <path d="M16 9l5 6m0-6l-5 6" stroke="currentColor" strokeWidth="1.8" fill="none" />
              ) : null}
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setLoop((v) => !v)}
            aria-label="পুনরাবৃত্তি"
            aria-pressed={loop}
            className={`grid h-11 w-11 place-items-center rounded-full border border-border transition-colors ${
              loop ? "text-accent" : "text-muted-foreground"
            } hover:text-primary`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-none stroke-current"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M17 3l3 3-3 3" />
              <path d="M20 6H8a4 4 0 0 0-4 4v1" />
              <path d="M7 21l-3-3 3-3" />
              <path d="M4 18h12a4 4 0 0 0 4-4v-1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleEffects}
            aria-label="শব্দ"
            aria-pressed={effectsEnabled}
            className={`grid h-11 min-w-11 place-items-center rounded-full border border-border px-2 font-ui text-[0.7rem] transition-colors ${
              effectsEnabled ? "text-accent" : "text-muted-foreground"
            } hover:text-primary`}
          >
            শব্দ
          </button>
        </div>
      </div>

      {failed ? (
        <p className="mt-2 font-ui text-xs text-muted-foreground">
          সুরটি এখন বাজানো যাচ্ছে না — একটু পরে আবার চেষ্টা করুন।
        </p>
      ) : null}
    </div>
  );
}
