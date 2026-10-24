import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FxKind } from "@/content/poem";
import { playSfx, type SfxName } from "@/lib/nishipoddo/sfx";
import {
  ExperienceContext,
  SCENE_ORDER,
  SCENE_TRANSITION,
  type Bands,
  type Ctx,
  type Discovery,
  type Fx,
  type Scene,
  type Transition,
} from "./experience-context";

export {
  ALL_DISCOVERIES,
  SCENE_LABEL,
  SCENE_ORDER,
  useExperience,
  type Bands,
  type Discovery,
  type Fx,
  type Scene,
  type Transition,
} from "./experience-context";

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [scene, setScene] = useState<Scene>("arrival");
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [transition, setTransition] = useState<Transition | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [moonClicks, setMoonClicks] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [run, setRun] = useState(1);

  const bandsRef = useRef<Bands>({ bass: 0, mid: 0, high: 0, level: 0 });
  const fxRef = useRef<Fx[]>([]);
  const musicStartRef = useRef<(() => void) | null>(null);
  const advanceRef = useRef<(() => void) | null>(null);
  const lakeMood = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const sfx = useCallback(
    (name: SfxName) => {
      if (effectsEnabled) playSfx(name);
    },
    [effectsEnabled],
  );

  const goToScene = useCallback(
    (next: Scene) => {
      if (busy.current || next === scene) return;
      busy.current = true;
      advanceRef.current = null;
      const kind = SCENE_TRANSITION[next];
      setTransition(kind);
      setTransitioning(true);
      const half = reducedMotion ? 200 : 720;
      window.setTimeout(() => {
        setScene(next);
        setUnlockedIndex((i) => Math.max(i, SCENE_ORDER.indexOf(next)));
        window.scrollTo({ top: 0 });
      }, half);
      window.setTimeout(
        () => {
          setTransitioning(false);
          setTransition(null);
          busy.current = false;
        },
        half * 2 + 120,
      );
    },
    [scene, reducedMotion],
  );

  const restart = useCallback(() => {
    setDiscoveries([]);
    setMoonClicks(0);
    setUnlockedIndex(0);
    setRun((r) => r + 1);
    fxRef.current = [];
    goToScene("arrival");
  }, [goToScene]);

  const spawnFx = useCallback((kind: FxKind) => {
    fxRef.current.push({ kind, t: 0 });
    if (fxRef.current.length > 6) fxRef.current.shift();
  }, []);

  const discover = useCallback((d: Discovery) => {
    setDiscoveries((prev) => (prev.includes(d) ? prev : [...prev, d]));
  }, []);

  const startMusic = useCallback(() => {
    musicStartRef.current?.();
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      scene,
      unlockedIndex,
      transitioning,
      transition,
      goToScene,
      advanceRef,
      restart,
      run,
      bandsRef,
      fxRef,
      spawnFx,
      reducedMotion,
      effectsEnabled,
      toggleEffects: () => setEffectsEnabled((v) => !v),
      sfx,
      musicStartRef,
      startMusic,
      discoveries,
      discover,
      moonClicks,
      bumpMoon: () => setMoonClicks((v) => v + 1),
      lakeMood,
    }),
    [
      scene,
      unlockedIndex,
      transitioning,
      transition,
      goToScene,
      restart,
      run,
      spawnFx,
      reducedMotion,
      effectsEnabled,
      sfx,
      startMusic,
      discoveries,
      discover,
      moonClicks,
    ],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
