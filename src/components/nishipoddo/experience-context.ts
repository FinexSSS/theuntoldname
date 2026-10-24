import { createContext, useContext } from "react";
import type { FxKind } from "@/content/poem";
import type { SfxName } from "@/lib/nishipoddo/sfx";

export type Scene =
  | "arrival"
  | "darkness"
  | "path"
  | "lamp"
  | "window"
  | "name"
  | "game"
  | "gratitude"
  | "sky"
  | "light"
  | "reflection"
  | "final"
  | "ending";

export const SCENE_ORDER: Scene[] = [
  "arrival",
  "darkness",
  "path",
  "lamp",
  "window",
  "name",
  "game",
  "gratitude",
  "sky",
  "light",
  "reflection",
  "final",
  "ending",
];

export const SCENE_LABEL: Record<Scene, string> = {
  arrival: "আগমন",
  darkness: "অন্ধকারেরও ভেতর",
  path: "পথ",
  lamp: "অচেনা আলো",
  window: "রেশ",
  name: "নাম",
  game: "আসল ফুল",
  gratitude: "নীরবতার পাতা",
  sky: "আপনার আকাশ",
  light: "আলো",
  reflection: "শেষ নয়",
  final: "নিশিপদ্ম",
  ending: "রেশ থেকে যায়",
};

/** Each transition is motivated by the metaphor of the page it opens. */
export type Transition =
  | "ripple"
  | "dark"
  | "lines"
  | "window"
  | "moon"
  | "water"
  | "ink"
  | "stars"
  | "lights"
  | "petals";

export const SCENE_TRANSITION: Record<Scene, Transition> = {
  arrival: "ripple",
  darkness: "dark",
  path: "lines",
  lamp: "ripple",
  window: "window",
  name: "moon",
  game: "water",
  gratitude: "ink",
  sky: "stars",
  light: "lights",
  reflection: "water",
  final: "dark",
  ending: "petals",
};

export type Bands = { bass: number; mid: number; high: number; level: number };
export type Fx = { kind: FxKind; t: number };

export type Discovery =
  | "path"
  | "lamp"
  | "window"
  | "name"
  | "game"
  | "ink"
  | "stars"
  | "lights"
  | "stillness"
  | "moon"
  | "petal";

export const ALL_DISCOVERIES: Discovery[] = [
  "path",
  "lamp",
  "window",
  "name",
  "game",
  "ink",
  "stars",
  "lights",
  "stillness",
  "moon",
  "petal",
];

export type Ctx = {
  scene: Scene;
  unlockedIndex: number;
  transitioning: boolean;
  transition: Transition | null;
  goToScene: (next: Scene) => void;
  /** the scene's own "I am ready to move on" handler, used by keyboard + swipe */
  advanceRef: React.MutableRefObject<(() => void) | null>;
  restart: () => void;
  /** changes on every replay so positions differ slightly */
  run: number;
  bandsRef: React.MutableRefObject<Bands>;
  fxRef: React.MutableRefObject<Fx[]>;
  spawnFx: (kind: FxKind) => void;
  reducedMotion: boolean;
  effectsEnabled: boolean;
  toggleEffects: () => void;
  sfx: (name: SfxName) => void;
  musicStartRef: React.MutableRefObject<(() => void) | null>;
  startMusic: () => void;
  discoveries: Discovery[];
  discover: (d: Discovery) => void;
  moonClicks: number;
  bumpMoon: () => void;
  lakeMood: React.MutableRefObject<number>;
};

export const ExperienceContext = createContext<Ctx | null>(null);

export function useExperience() {
  const v = useContext(ExperienceContext);
  if (!v) throw new Error("useExperience must be used inside ExperienceProvider");
  return v;
}
