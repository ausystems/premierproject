import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/**
 * Smooth scroll for the whole document, driven by GSAP's ticker so ScrollTrigger and Lenis share
 * one clock. Disabled for prefers-reduced-motion (native scrolling, ScrollTrigger reads the document).
 * Touch screens keep their native scrolling (syncTouch off), which is already smooth and physical.
 * Scroll position on route change is owned by PageTransition, which resets it under the curtain.
 *
 * While a wheel or trackpad is moving the page, nothing under the resting cursor reacts: without this,
 * rows, pills and links light up one after another as they slide past. The lock lifts 160 ms after the
 * last wheel event, so a click that follows a scroll is never lost.
 */
export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const instance = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      autoResize: true,
    });
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const root = document.documentElement;
    let release = 0;
    const onWheel = () => {
      if (instance.isStopped) return;
      root.classList.add("is-wheeling");
      window.clearTimeout(release);
      release = window.setTimeout(() => root.classList.remove("is-wheeling"), 160);
    };
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(release);
      root.classList.remove("is-wheeling");
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
};
