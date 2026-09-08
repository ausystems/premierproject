import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  trigger?: "scroll" | "load";
  delay?: number;
  y?: number;
  id?: string;
};

/** Soft entrance for blocks that should not be split: statements, captions, buttons, media frames. */
export const Reveal = ({ as = "div", children, className, trigger = "scroll", delay = 0, y = 16, id }: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay,
        ...(trigger === "scroll" ? { scrollTrigger: { trigger: el, start: "top 90%", once: true } } : {}),
      }
    );
    const fallback = window.setTimeout(() => {
      if (!tween.isActive() && tween.progress() === 0) tween.play(0);
    }, 4000);

    return () => {
      window.clearTimeout(fallback);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [trigger, delay, y]);

  return createElement(as, { ref, className, id }, children);
};
