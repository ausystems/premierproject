import { Suspense, startTransition, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Routes, useLocation, type Location } from "react-router-dom";
import { gsap, ScrollTrigger, EASE_REVEAL, prefersReducedMotion, transitionState } from "@/lib/gsap";
import { useLenis } from "@/lib/SmoothScroll";

const LOGO = "/logo-nav.png";
const CURTAIN_IN = 0.45;
const LOGO_IN = 0.4;
const HOLD = 0.08;
const LOGO_OUT = 0.18;
const CURTAIN_OUT = 0.5;

/**
 * The one signature transition. An ink curtain rises over the old page and the Project Premier logo
 * wipes in; the route swaps underneath (waiting for lazy pages to commit), scroll resets, then the
 * logo lets go and the curtain lifts while the new page's headline rises with it.
 *
 * Robustness: a run can never be interrupted by React re-rendering, clicks made mid-transition are
 * queued and honoured, same-page clicks scroll to the top, and reduced motion swaps instantly.
 */
export const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [shown, setShown] = useState<Location>(location);
  const [replay, setReplay] = useState(0);
  const shownRef = useRef(shown);
  shownRef.current = shown;
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const curtain = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const busy = useRef(false);
  const queued = useRef<Location | null>(null);
  const active = useRef<gsap.core.Timeline | null>(null);
  const swapResolver = useRef<(() => void) | null>(null);

  // The new page has committed (lazy chunk included) whenever `shown` changes.
  useEffect(() => {
    swapResolver.current?.();
    swapResolver.current = null;
  }, [shown]);

  // Only a real unmount may kill an in-flight timeline.
  useEffect(() => () => {
    active.current?.kill();
    transitionState.active = false;
  }, []);

  const resetScroll = useCallback(() => {
    const l = lenisRef.current;
    if (l) l.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, []);

  const run = useCallback(async (target: Location) => {
    const el = curtain.current;
    const mark = logo.current;
    if (!el || !mark || prefersReducedMotion()) {
      setShown(target);
      resetScroll();
      window.setTimeout(() => ScrollTrigger.refresh(), 60);
      return;
    }

    busy.current = true;
    transitionState.active = true;
    lenisRef.current?.stop();

    const tlIn = gsap.timeline();
    active.current = tlIn;
    tlIn
      .set(el, { pointerEvents: "auto" })
      .set(mark, { autoAlpha: 1, scale: 1, y: 10, clipPath: "inset(0 100% 0 0)" })
      .fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: CURTAIN_IN, ease: "power3.inOut" })
      .to(mark, { y: 0, clipPath: "inset(0 0% 0 0)", duration: LOGO_IN, ease: EASE_REVEAL }, `-=${CURTAIN_IN * 0.4}`);
    await tlIn.then();

    // Swap under the curtain and wait for the incoming page to commit.
    const swapped = new Promise<void>((resolve) => {
      swapResolver.current = resolve;
      window.setTimeout(resolve, 1500);
    });
    // Scroll home under the curtain first, so the new page mounts and measures its ScrollTriggers at the top.
    resetScroll();
    startTransition(() => setShown(target));
    await swapped;
    resetScroll();
    await new Promise((r) => window.setTimeout(r, HOLD * 1000));

    const tlOut = gsap.timeline();
    active.current = tlOut;
    tlOut
      .add(() => {
        transitionState.active = false;
        window.dispatchEvent(new Event("page:ready"));
      })
      .to(mark, { autoAlpha: 0, scale: 1.04, duration: LOGO_OUT, ease: "power2.in" })
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: CURTAIN_OUT, ease: "power3.inOut" }, `-=${LOGO_OUT * 0.5}`)
      .set(el, { pointerEvents: "none", clipPath: "inset(100% 0 0 0)" });
    await tlOut.then();

    active.current = null;
    busy.current = false;
    lenisRef.current?.start();
    ScrollTrigger.refresh();

    const next = queued.current;
    queued.current = null;
    if (next && next.pathname !== target.pathname) setReplay((n) => n + 1);
  }, [resetScroll]);

  useEffect(() => {
    const current = shownRef.current;
    if (location.pathname === current.pathname) {
      if (location.key !== current.key) {
        setShown(location);
        const l = lenisRef.current;
        if (l) l.scrollTo(0, { duration: 1 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    if (busy.current) {
      queued.current = location;
      return;
    }
    void run(location);
  }, [location, replay, run]);

  return (
    <>
      <Suspense fallback={null}>
        <Routes location={shown}>{children}</Routes>
      </Suspense>
      <div
        ref={curtain}
        data-curtain
        aria-hidden="true"
        data-theme="ink"
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center [clip-path:inset(100%_0_0_0)]"
      >
        <img ref={logo} src={LOGO} alt="" width={384} height={256} decoding="async" className="h-20 w-auto opacity-0 md:h-32" />
      </div>
    </>
  );
};
