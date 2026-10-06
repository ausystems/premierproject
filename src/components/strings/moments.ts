import { useEffect, type MutableRefObject, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, reachableStart, whenPageReady } from "@/lib/gsap";
import { strumWithin, type StringHandle } from "@/lib/strings";

/**
 * Scripted moments for the strings: each plays once when its section is reached, and never under the
 * page transition curtain. Reduced motion skips them entirely.
 */

const onArrival = (el: HTMLElement, ratio: number, play: () => void) => {
  let st: ScrollTrigger | null = null;
  const cancel = whenPageReady(() => {
    st = ScrollTrigger.create({ trigger: el, start: reachableStart(el, ratio), once: true, onEnter: play });
  });
  return () => {
    cancel();
    st?.kill();
  };
};

/** Every string in the block is strummed top to bottom, like a chord, as the block comes into view. */
export const useChord = (ref: RefObject<HTMLElement>, opts?: Parameters<typeof strumWithin>[1]) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return onArrival(el, 0.6, () => strumWithin(el, opts));
    // opts are literals at the call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
};

/**
 * A single string speaks: a run of soft plucks at uneven intervals, swelling and falling away like a
 * voice, as its block comes into view.
 */
export const useVoice = (ref: RefObject<HTMLElement>, string: MutableRefObject<StringHandle | null>, { syllables = 9, amp = 11 } = {}) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const calls: gsap.core.Tween[] = [];
    const stop = onArrival(el, 0.72, () => {
      let t = 0;
      for (let k = 0; k < syllables; k++) {
        const swell = Math.sin(((k + 0.5) / syllables) * Math.PI);
        const at = 0.18 + Math.random() * 0.64;
        const a = amp * (0.45 + 0.55 * swell) * (0.7 + Math.random() * 0.3);
        calls.push(gsap.delayedCall(t, () => string.current?.pluck(at, a, k % 2 ? -1 : 1)));
        t += 0.09 + Math.random() * 0.15;
      }
    });
    return () => {
      stop();
      calls.forEach((c) => c.kill());
    };
  }, [ref, string, syllables, amp]);
};

/** The last line of the page sounds once whenever the reader reaches the very bottom. */
export const useLastNote = (ref: RefObject<HTMLElement>, string: MutableRefObject<StringHandle | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let st: ScrollTrigger | null = null;
    const cancel = whenPageReady(() => {
      st = ScrollTrigger.create({
        trigger: el,
        start: () => Math.max(ScrollTrigger.maxScroll(window) - 2, 0),
        onEnter: () => string.current?.pluck(0.3 + Math.random() * 0.4, 7, 1),
      });
    });
    return () => {
      cancel();
      st?.kill();
    };
  }, [ref, string]);
};
