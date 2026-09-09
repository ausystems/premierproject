import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// House easings. "reveal" is the editorial ease used for every mask reveal on the site;
// "drift" is slower and used for parallax settling and page transitions.
export const EASE_REVEAL = CustomEase.create("reveal", "M0,0 C0.16,1 0.3,1 1,1");
export const EASE_DRIFT = CustomEase.create("drift", "M0,0 C0.22,1 0.36,1 1,1");

export const DURATION = {
  fast: 0.5,
  base: 0.9,
  slow: 1.4,
} as const;

export const STAGGER = {
  lines: 0.08,
  words: 0.03,
  items: 0.1,
} as const;

gsap.defaults({ ease: EASE_REVEAL, duration: DURATION.base });

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Page transition coordination. While a curtain transition is active, load-triggered reveals on the
 * incoming page wait for "page:ready" (dispatched as the curtain starts to lift) so the headline rises
 * with the curtain instead of playing unseen behind it.
 */
export const transitionState = { active: false };

export const whenPageReady = (cb: () => void): (() => void) => {
  if (!transitionState.active) {
    cb();
    return () => undefined;
  }
  const handler = () => {
    window.removeEventListener("page:ready", handler);
    cb();
  };
  window.addEventListener("page:ready", handler);
  return () => window.removeEventListener("page:ready", handler);
};

export const isTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

export { gsap, ScrollTrigger, SplitText };

/**
 * True when a scroll trigger at "top {ratio}" for `el` has already been passed, or can never be
 * reached because the page is too short to scroll it there. Used by reveal fallbacks so content
 * is never left hidden without taking scroll-driven entrances away from long pages.
 */
export const revealOverdue = (el: Element, ratio: number): boolean => {
  const top = el.getBoundingClientRect().top;
  const vh = window.innerHeight;
  if (top <= vh * ratio) return true;
  const maxScroll = document.documentElement.scrollHeight - vh;
  return top + window.scrollY - vh * ratio > maxScroll;
};

/**
 * ScrollTrigger start for "top {ratio}" that always stays reachable. ScrollTrigger only clamps a
 * start beyond the maximum scroll during a full refresh, so triggers created after the load event
 * near the bottom of a page would otherwise never fire. Recomputed on every refresh.
 */
export const reachableStart = (el: Element, ratio: number) => (): number => {
  const natural = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * ratio;
  const max = ScrollTrigger.maxScroll(window);
  return Math.max(0, Math.min(natural, max - 1));
};
