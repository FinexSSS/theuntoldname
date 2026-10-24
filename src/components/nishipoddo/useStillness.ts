import { useEffect, useRef, useState } from "react";
import { useExperience } from "./experience";

/**
 * If the visitor does nothing for a while, the lake becomes completely still
 * and one petal crosses the screen. No popup, no announcement.
 */
export function useStillness(enabled = true) {
  const { lakeMood, discover } = useExperience();
  const [still, setStill] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const arm = () => {
      window.clearTimeout(timer.current);
      setStill(false);
      lakeMood.current = 0;
      timer.current = window.setTimeout(() => {
        setStill(true);
        lakeMood.current = 1;
        discover("stillness");
      }, 9000);
    };
    arm();
    window.addEventListener("pointermove", arm);
    window.addEventListener("pointerdown", arm);
    window.addEventListener("keydown", arm);
    return () => {
      window.clearTimeout(timer.current);
      lakeMood.current = 0;
      window.removeEventListener("pointermove", arm);
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, [discover, enabled, lakeMood]);

  return still;
}
