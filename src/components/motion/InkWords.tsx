import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

/**
 * The site's text signature. A statement starts in grey and its words step into full ink,
 * one after another, as it scrolls through the viewport, like a lyric being read.
 * Scrubbed, so it works with native scrolling on touch. Reduced motion: plain ink.
 */
export const InkWords = ({ as = "p", children, className }: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      const ink = getComputedStyle(el).color;
      split = new SplitText(el, { type: "words", wordsClass: "ink-word" });
      tween = gsap.fromTo(
        split.words,
        { color: "rgb(138, 138, 138)" },
        {
          color: ink,
          ease: "none",
          stagger: { each: 1, amount: 1 },
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.4 },
        }
      );
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, []);

  return createElement(as, { ref, className }, children);
};
