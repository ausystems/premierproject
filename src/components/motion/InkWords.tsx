import { createElement, useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
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
 * The statement rests in grey from the first paint, so it never flashes ink before it is read.
 */
export const InkWords = ({ as = "p", children, className }: Props) => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;
    let cancelled = false;
    const cs = getComputedStyle(el);
    const ink = cs.color;
    const grey = `rgb(${cs.getPropertyValue("--grey").trim().split(/\s+/).join(", ")})`;
    el.style.color = grey;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      split = new SplitText(el, { type: "words", wordsClass: "ink-word" });
      tween = gsap.fromTo(
        split.words,
        { color: grey },
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
      el.style.color = "";
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, []);

  return createElement(as, { ref, className }, children);
};
