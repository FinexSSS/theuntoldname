import { SCENE_LABEL, SCENE_ORDER, useExperience } from "./experience";

/** A thin vertical line with tiny points — the spine of the book. */
export function SceneProgress() {
  const { scene, unlockedIndex, goToScene, reducedMotion } = useExperience();
  const currentIndex = SCENE_ORDER.indexOf(scene);

  return (
    <nav
      aria-label="পাতা"
      className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 flex-col items-center gap-2.5 sm:flex"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-[-10px] w-px bg-gradient-to-b from-transparent via-border to-transparent"
      />
      {SCENE_ORDER.map((s, i) => {
        const locked = i > unlockedIndex;
        const active = i === currentIndex;
        return (
          <button
            key={s}
            type="button"
            disabled={locked}
            onClick={() => goToScene(s)}
            aria-label={SCENE_LABEL[s]}
            aria-current={active ? "true" : undefined}
            className={`relative h-[5px] w-[5px] rounded-full transition-all ${
              reducedMotion ? "duration-0" : "duration-700"
            } ${
              active
                ? "scale-[1.7] bg-lotus shadow-[0_0_10px_var(--lotus)]"
                : locked
                  ? "bg-muted-foreground/12"
                  : "bg-[oklch(0.88_0.06_60/_35%)] hover:bg-lotus/80"
            }`}
          />
        );
      })}
    </nav>
  );
}
