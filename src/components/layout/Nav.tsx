import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui-kit/Button";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const LOGO = "/logo-nav.png";

const LINKS = [
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
];

/** Solid black bar, always readable, always present. Under 1024px the links collapse to "Menu". */
export const Nav = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // First paint: the bar settles in from above once, after the hero copy has begun its reveal.
  useEffect(() => {
    const el = bar.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(el, { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", delay: 0.15 });
    return () => { tween.kill(); };
  }, []);

  return (
    <>
      <header ref={bar} data-theme="ink" className="fixed inset-x-0 top-0 z-50 bg-ink text-paper">
        <nav aria-label="Primary" className="wrap flex h-nav-sm items-center justify-between lg:h-nav">
          <Link to="/" className="relative z-[60] flex items-center" aria-label="Project Premier, home">
            <img src={LOGO} alt="Project Premier" width={384} height={256} className="h-12 w-auto lg:h-16" decoding="async" />
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "relative text-ui transition-opacity duration-250",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-300 after:ease-out",
                    active ? "after:scale-x-100" : "after:scale-x-0 opacity-70 hover:opacity-100 hover:after:scale-x-100"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            <Button to="/referral" magnetic className="px-5 py-2.5">Refer a Youth</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-overlay"
            className="relative z-[60] -mr-2 px-2 py-2 text-ui lg:hidden"
          >
            <span className="relative block h-[1em] overflow-hidden">
              <span className={cn("block transition-transform duration-300 ease-out", open && "-translate-y-full")}>Menu</span>
              <span className={cn("absolute inset-0 block translate-y-full transition-transform duration-300 ease-out", open && "translate-y-0")}>Close</span>
            </span>
          </button>
        </nav>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
};
