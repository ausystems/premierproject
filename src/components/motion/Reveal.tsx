import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, prefersReducedMotion, revealOverdue, whenPageReady } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  trigger?: "scroll" | "load";
  delay?: number;
  y?: number;
  id?: string;
};

/**
 * Soft entrance for blocks that should not be split: statements, captions, buttons, media frames.
 * Nothing plays under the page transition curtain: triggers are armed once the page is revealed,
 * so above-the-fold blocks enter as the curtain lifts and below-the-fold blocks enter on scroll.
 */
export const Reveal = ({ as = "div", children, className, trigger = "scroll", delay = 0, y = 16, id }: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let tween: gsap.core.Tween | null = null;
    const vars = { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay };
    gsap.set(el, { autoAlpha: 0, y });

    const cancelReady = whenPageReady(() => {
      tween =
        trigger === "scroll"
          ? gsap.to(el, { ...vars, scrollTrigger: { trigger: el, start: "top 90%", once: true } })
          : gsap.to(el, vars);
    });

    // Insurance: nothing on this site may stay hidden because a trigger never fired.
    const fallback = window.setTimeout(() => {
      if (tween && (tween.isActive() || tween.progress() > 0)) return;
      if (trigger === "scroll" && !revealOverdue(el, 0.9)) return;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      tween = gsap.to(el, { ...vars, delay: 0 });
    }, 4000);

    return () => {
      cancelReady();
      window.clearTimeout(fallback);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [trigger, delay, y]);

  return createElement(as, { ref, className, id }, children);
};
