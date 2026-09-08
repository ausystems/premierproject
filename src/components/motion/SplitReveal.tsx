import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, EASE_REVEAL, DURATION, STAGGER, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "scroll" plays when 85% into view (once); "load" plays after `delay` on mount. */
  trigger?: "scroll" | "load";
  delay?: number;
  stagger?: number;
  id?: string;
};

/**
 * Line-by-line mask reveal. Text is split only after fonts are ready so line breaks are final;
 * the split is reverted after the reveal so the DOM returns to plain text (resize-safe, a11y-safe).
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

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;
    let fallback = 0;
    let cancelled = false;

    const revert = () => {
      split?.revert();
      split = null;
    };

    document.fonts.ready.then(() => {
      if (cancelled) return;
      split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "split-line" });
      gsap.set(split.lines, { yPercent: 110 });

      tween = gsap.to(split.lines, {
        yPercent: 0,
        duration: DURATION.base,
        ease: EASE_REVEAL,
        stagger,
        delay,
        onComplete: revert,
        ...(trigger === "scroll"
          ? { scrollTrigger: { trigger: el, start: "top 88%", once: true } }
          : {}),
      });

      // Insurance: nothing on this site may stay hidden because a trigger never fired.
      fallback = window.setTimeout(() => {
        if (tween && !tween.isActive() && tween.progress() === 0) tween.play(0);
      }, 4000);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      revert();
    };
  }, [trigger, delay, stagger]);

  return createElement(as, { ref, className, id }, children);
};
