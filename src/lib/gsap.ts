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

export const isTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

export { gsap, ScrollTrigger, SplitText };
