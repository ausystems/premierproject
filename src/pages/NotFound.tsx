import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui-kit/Button";
import { Reveal } from "@/components/motion/Reveal";
import { prefersReducedMotion } from "@/lib/gsap";
import { useSeo } from "@/lib/seo";

const DIGITS = "0123456789";

const NotFound = () => {
  const location = useLocation();
  const digits = useRef<HTMLSpanElement>(null);
  useSeo(location.pathname);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // The digits shuffle once as the page lands, then settle.
  useEffect(() => {
    const el = digits.current;
    if (!el || prefersReducedMotion()) return;
    let frame = 0;
    const interval = window.setInterval(() => {
      frame += 1;
      el.textContent = "404".split("").map((c, i) => (frame > 8 + i * 3 ? c : DIGITS[Math.floor(Math.random() * 10)])).join("");
      if (frame > 16) { window.clearInterval(interval); el.textContent = "404"; }
    }, 45);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main id="main" data-theme="ink" className="wrap flex min-h-[100svh] flex-col justify-center pb-16 pt-nav-sm lg:pt-nav">
      <h1 className="tnum text-[24vw] font-[450] leading-none tracking-[-0.05em] md:text-[16vw]">
        <span ref={digits}>404</span>
      </h1>
      <Reveal trigger="load" delay={0.4} className="mt-6 text-statement text-fg2">
        Page not found.
      </Reveal>
      <Reveal trigger="load" delay={0.7} className="mt-10 flex flex-wrap gap-8">
        <Button variant="link" to="/">Return to Home</Button>
        <Button variant="link" to="/programs">Programs</Button>
      </Reveal>
    </main>
  );
};

export default NotFound;
