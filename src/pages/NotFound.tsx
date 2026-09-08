import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui-kit/Button";
import { Reveal } from "@/components/motion/Reveal";
import { useTorontoTime } from "@/hooks/useTorontoTime";
import { prefersReducedMotion } from "@/lib/gsap";

const DIGITS = "0123456789";

const NotFound = () => {
  const location = useLocation();
  const time = useTorontoTime();
  const digits = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // The digits settle, then re-shuffle briefly every few seconds: a counter searching for a page.
  useEffect(() => {
    const el = digits.current;
    if (!el || prefersReducedMotion()) return;
    let interval = 0;
    const run = () => {
      let frame = 0;
      interval = window.setInterval(() => {
        frame += 1;
        el.textContent = "404".split("").map((c, i) => (frame > 8 + i * 3 ? c : DIGITS[Math.floor(Math.random() * 10)])).join("");
        if (frame > 16) { window.clearInterval(interval); el.textContent = "404"; }
      }, 45);
    };
    run();
    const loop = window.setInterval(run, 6000);
    return () => { window.clearInterval(interval); window.clearInterval(loop); };
  }, []);

  return (
    <main data-theme="ink" className="wrap flex min-h-[100svh] flex-col justify-between pb-8 pt-nav-sm lg:pt-nav">
      <div className="flex flex-1 flex-col justify-center py-16">
        <h1 className="tnum text-[28vw] font-[450] leading-none tracking-[-0.05em] md:text-[20vw]">
          <span ref={digits}>404</span>
        </h1>
        <Reveal trigger="load" delay={0.4} className="mt-8 max-w-[20ch] text-statement text-fg2">
          Page not found.
        </Reveal>
        <Reveal trigger="load" delay={0.7} className="mt-10 flex flex-wrap gap-8">
          <Button variant="link" to="/">Return to Home</Button>
          <Button variant="link" to="/programs">Programs</Button>
        </Reveal>
      </div>
      <div className="meta flex flex-wrap justify-between gap-4 text-grey">
        <span>130 Queens Quay East, Toronto</span>
        <span className="tnum">Toronto {time}</span>
      </div>
    </main>
  );
};

export default NotFound;
