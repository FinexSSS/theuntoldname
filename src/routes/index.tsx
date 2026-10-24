import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AmbientCanvas } from "@/components/nishipoddo/AmbientCanvas";
import { AudioPlayer } from "@/components/nishipoddo/AudioPlayer";
import { CustomCursor } from "@/components/nishipoddo/CustomCursor";
import { SceneProgress } from "@/components/nishipoddo/SceneProgress";
import { ExperienceProvider, SCENE_ORDER, useExperience } from "@/components/nishipoddo/experience";
import { ArrivalScene } from "@/components/nishipoddo/scenes/ArrivalScene";
import { DarknessScene } from "@/components/nishipoddo/scenes/DarknessScene";
import { EndingScene } from "@/components/nishipoddo/scenes/EndingScene";
import { FinalScene } from "@/components/nishipoddo/scenes/FinalScene";
import { GratitudeScene } from "@/components/nishipoddo/scenes/GratitudeScene";
import { LampScene } from "@/components/nishipoddo/scenes/LampScene";
import { LightScene } from "@/components/nishipoddo/scenes/LightScene";
import { LotusGameScene } from "@/components/nishipoddo/scenes/LotusGameScene";
import { NameScene } from "@/components/nishipoddo/scenes/NameScene";
import { PathScene } from "@/components/nishipoddo/scenes/PathScene";
import { ReflectionScene } from "@/components/nishipoddo/scenes/ReflectionScene";
import { SkyScene } from "@/components/nishipoddo/scenes/SkyScene";
import { WindowScene } from "@/components/nishipoddo/scenes/WindowScene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "নিশিপদ্ম — একটি রাতের কবিতা" },
      {
        name: "description",
        content:
          "নিশিপদ্ম: অন্ধকার, জল আর আলো নিয়ে দশ পাতার একটি ইন্টারেক্টিভ বাংলা কবিতা — প্রতিটি পাতায় একটি ছবি, একটি নীরব আবিষ্কার।",
      },
      { property: "og:title", content: "নিশিপদ্ম — একটি রাতের কবিতা" },
      {
        property: "og:description",
        content:
          "A ten-page Bengali poem you turn page by page: night, water, a lamp, a lotus and the light that stays.",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "bn_BD" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NishipoddoPage,
});

function SceneSwitch() {
  const { scene } = useExperience();
  switch (scene) {
    case "arrival":
      return <ArrivalScene />;
    case "darkness":
      return <DarknessScene />;
    case "path":
      return <PathScene />;
    case "lamp":
      return <LampScene />;
    case "window":
      return <WindowScene />;
    case "name":
      return <NameScene />;
    case "game":
      return <LotusGameScene />;
    case "gratitude":
      return <GratitudeScene />;
    case "sky":
      return <SkyScene />;
    case "light":
      return <LightScene />;
    case "reflection":
      return <ReflectionScene />;
    case "final":
      return <FinalScene />;
    case "ending":
      return <EndingScene />;
    default:
      return null;
  }
}

function Experience() {
  const { transition, transitioning, scene, advanceRef, goToScene, unlockedIndex } =
    useExperience();
  const touchX = useRef<number | null>(null);
  const touchStartedOnControl = useRef(false);

  useEffect(() => {
    const back = () => {
      const i = SCENE_ORDER.indexOf(scene);
      if (i > 0 && i - 1 <= unlockedIndex) goToScene(SCENE_ORDER[i - 1]!);
    };
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && ["INPUT", "TEXTAREA", "BUTTON"].includes(el.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
        if (advanceRef.current) {
          e.preventDefault();
          advanceRef.current();
        }
      } else if (e.key === "ArrowLeft") {
        back();
      }
    };
    const onStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      touchStartedOnControl.current = Boolean(
        target?.closest("button, input, a, [role='slider'], [data-interactive]"),
      );
      touchX.current = e.changedTouches[0]?.clientX ?? null;
    };
    const onEnd = (e: TouchEvent) => {
      const start = touchX.current;
      const end = e.changedTouches[0]?.clientX;
      touchX.current = null;
      const startedOnControl = touchStartedOnControl.current;
      touchStartedOnControl.current = false;
      if (startedOnControl || start == null || end == null) return;
      const dx = end - start;
      if (Math.abs(dx) < 70) return;
      if (dx < 0) advanceRef.current?.();
      else back();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [advanceRef, goToScene, scene, unlockedIndex]);

  return (
    <div className="relative min-h-[100svh] overflow-x-hidden">
      <AmbientCanvas />
      <CustomCursor />
      <SceneProgress />

      <main key={scene} data-scene={scene} className="scene-enter relative z-10">
        <SceneSwitch />
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-4">
        <div className="pointer-events-auto mx-auto w-full max-w-xl">
          <AudioPlayer />
        </div>
      </div>

      {transition ? (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-50 tx tx-${transition} ${
            transitioning ? "is-active" : ""
          }`}
        />
      ) : null}
    </div>
  );
}

function NishipoddoPage() {
  return (
    <ExperienceProvider>
      <Experience />
    </ExperienceProvider>
  );
}
