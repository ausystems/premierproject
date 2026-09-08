import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Routes, useLocation, type Location } from "react-router-dom";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/lib/SmoothScroll";

const LOGO = "/logo-nav.png";

/**
 * The one signature transition. An ink curtain rises over the old page, the Project Premier logo
 * settles in while the route swaps and scroll resets underneath, then the curtain lifts off the top.
 * Routes render against a frozen location so the old page stays put until it is covered.
 */
export const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [shown, setShown] = useState<Location>(location);
  const curtain = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const lenis = useLenis();
  const busy = useRef(false);

  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location.key !== shown.key) setShown(location);
      return;
    }
    const el = curtain.current;
    const mark = logo.current;
    if (!el || !mark) { setShown(location); return; }

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

    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false;
        lenis?.start();
        ScrollTrigger.refresh();
      },
    });

    tl.set(el, { pointerEvents: "auto" })
      .set(mark, { autoAlpha: 0, scale: 0.94 })
      .fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.7, ease: "power2.inOut" })
      .to(mark, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" }, "-=0.25")
      .add(() => { setShown(location); resetScroll(); })
      .to({}, { duration: 0.3 })
      .to(mark, { autoAlpha: 0, duration: 0.25, ease: "power2.in" })
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power2.inOut" }, "-=0.1")
      .set(el, { pointerEvents: "none", clipPath: "inset(100% 0 0 0)" });

    return () => { tl.kill(); };
  }, [location, shown, lenis]);

  return (
    <>
      <Suspense fallback={null}>
        <Routes location={shown}>{children}</Routes>
      </Suspense>
      <div
        ref={curtain}
        aria-hidden="true"
        data-theme="ink"
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center [clip-path:inset(100%_0_0_0)]"
      >
        <img ref={logo} src={LOGO} alt="" width={384} height={256} decoding="async" className="h-16 w-auto opacity-0 md:h-24" />
      </div>
    </>
  );
};
