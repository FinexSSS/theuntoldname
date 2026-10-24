import heroImage from "@/assets/nishipoddo-hero.jpg";
import { useEffect } from "react";
import { useExperience } from "../experience";
import { Lotus } from "../Lotus";

export function ArrivalScene() {
  const { goToScene, startMusic, sfx, advanceRef, reducedMotion } = useExperience();

  const enter = () => {
    startMusic();
    sfx("ripple");
    goToScene("darkness");
  };

  useEffect(() => {
    advanceRef.current = enter;
    return () => {
      advanceRef.current = null;
    };
  });

  return (
    <section
      aria-label="আগমন"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center"
    >
      <img
        src={heroImage}
        alt="রাতের জলে ভেসে থাকা একটি নিশিপদ্ম"
        width={1920}
        height={1280}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--background)_88%)]" />

      <div className={`relative ${reducedMotion ? "" : "lotus-breathe"}`}>
        <Lotus size={190} bloom={0.5} withReflection seed={4} />
      </div>

      <h1 className="relative -mt-6 font-display text-[clamp(2.6rem,11vw,6rem)] leading-none text-lotus">
        নিশিপদ্ম
      </h1>
      <p className="relative mt-6 max-w-sm font-body text-[clamp(0.95rem,2.6vw,1.2rem)] leading-[2] text-foreground/75">
        রাত নামলে
        <br />
        জলের দিকে তাকাতে হয়।
      </p>

      <button
        type="button"
        onClick={enter}
        className="relative mt-14 font-display text-[clamp(1rem,3vw,1.3rem)] text-accent/90 underline decoration-accent/25 decoration-1 underline-offset-[10px] transition-all duration-700 hover:text-lotus hover:decoration-lotus/60 hover:text-glow"
      >
        শুনবেন?
      </button>
    </section>
  );
}
