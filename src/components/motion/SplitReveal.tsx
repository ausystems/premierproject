import { createElement, useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, EASE_REVEAL, DURATION, STAGGER, prefersReducedMotion, reachableStart, revealOverdue, whenPageReady } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "scroll" plays when 88% into view (once); "load" plays after `delay` once the page is revealed. */
  trigger?: "scroll" | "load";
  delay?: number;
  stagger?: number;
  id?: string;
};

/**
 * Line-by-line mask reveal. Text is split only after fonts are ready so line breaks are final;
 * a page headline (h1) also inks in, its weight settling from light to its own as the lines rise;
 * the split is reverted after the reveal so the DOM returns to plain text (resize-safe, a11y-safe).
 * Nothing plays under the page transition curtain: triggers are armed once the page is revealed.
 * The block is hidden before the first paint and shown again the moment its lines are parked below
 * their masks, so a headline never flashes and then vanishes before it rises.
 * Content is never left hidden: a fallback timer plays the reveal if no trigger ever fires.
 */
export const SplitReveal = ({
  as = "div",
  children,
  className,
  trigger = "scroll",
  delay = 0,
  stagger = STAGGER.lines,
  id,
}: Props) => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    gsap.set(el, { autoAlpha: 0 });
    // Insurance for the hidden starting state, should the split never happen.
    const unveil = window.setTimeout(() => gsap.set(el, { autoAlpha: 1 }), 3000);

    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;
    let cancelReady: (() => void) | null = null;
    let fallback = 0;
    let cancelled = false;

    const revert = () => {
      split?.revert();
      split = null;
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      const weight = parseFloat(getComputedStyle(el).fontWeight) || 450;
      const ink = as === "h1";
      split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "split-line" });
      const lines = split.lines;
      gsap.set(lines, { yPercent: 110, ...(ink ? { fontWeight: Math.min(300, weight) } : {}) });
      gsap.set(el, { autoAlpha: 1 });
      window.clearTimeout(unveil);
      const vars = { yPercent: 0, ...(ink ? { fontWeight: weight } : {}), duration: DURATION.base, ease: EASE_REVEAL, stagger, delay, onComplete: revert };

      cancelReady = whenPageReady(() => {
        if (cancelled) return;
        tween =
          trigger === "scroll"
            ? gsap.to(lines, { ...vars, scrollTrigger: { trigger: el, start: reachableStart(el, 0.88), once: true } })
            : gsap.to(lines, vars);
      });

      // Insurance: nothing on this site may stay hidden because a trigger never fired.
      fallback = window.setTimeout(() => {
        if (cancelled || (tween && (tween.isActive() || tween.progress() > 0))) return;
        if (trigger === "scroll" && !revealOverdue(el, 0.88)) return;
        tween?.scrollTrigger?.kill();
        tween?.kill();
        tween = gsap.to(lines, { ...vars, delay: 0 });
      }, 4000);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(unveil);
      gsap.set(el, { clearProps: "opacity,visibility" });
      cancelReady?.();
      window.clearTimeout(fallback);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      revert();
    };
  }, [trigger, delay, stagger, as]);

  return createElement(as, { ref, className, id }, children);
};
