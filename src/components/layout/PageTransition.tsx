import { useEffect, useRef, useState, type ReactNode } from "react";
import { Routes, useLocation, type Location } from "react-router-dom";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/lib/SmoothScroll";

const WORD = "PREMIER";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * The one signature transition. An ink curtain rises over the old page, the wordmark shuffles
 * while the route swaps and scroll resets underneath, then the curtain lifts off the top.
 * Routes are rendered against a frozen location so the old page stays put until it is covered.
 */
export const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [shown, setShown] = useState<Location>(location);
  const curtain = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  const busy = useRef(false);

  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location.key !== shown.key) setShown(location);
      return;
    }
    const el = curtain.current;
    const w = word.current;
    if (!el || !w) { setShown(location); return; }

    const resetScroll = () => {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    };

    if (prefersReducedMotion()) {
      setShown(location);
      resetScroll();
      window.setTimeout(() => ScrollTrigger.refresh(), 60);
      return;
    }

    if (busy.current) return;
    busy.current = true;
    lenis?.stop();

    let shuffle = 0;
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false;
        lenis?.start();
        ScrollTrigger.refresh();
      },
    });

    tl.set(el, { pointerEvents: "auto" })
      .fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.7, ease: "power2.inOut" })
      .add(() => {
        setShown(location);
        resetScroll();
        let frame = 0;
        shuffle = window.setInterval(() => {
          frame += 1;
          w.textContent = WORD.split("")
            .map((c, i) => (frame > 6 + i ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join("");
          if (frame > 14) { window.clearInterval(shuffle); w.textContent = WORD; }
        }, 40);
      })
      .to({}, { duration: 0.45 })
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power2.inOut" })
      .set(el, { pointerEvents: "none", clipPath: "inset(100% 0 0 0)" });

    return () => { window.clearInterval(shuffle); };
  }, [location, shown, lenis]);

  return (
    <>
      <Routes location={shown}>{children}</Routes>
      <div
        ref={curtain}
        aria-hidden="true"
        data-theme="ink"
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center [clip-path:inset(100%_0_0_0)]"
      >
        <span ref={word} className="font-sans text-[14vw] uppercase leading-none tracking-[-0.05em] md:text-[10vw]">
          {WORD}
        </span>
      </div>
    </>
  );
};
