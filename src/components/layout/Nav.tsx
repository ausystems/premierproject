import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui-kit/Button";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { isTouch } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const LOGO_ON_INK = "/lovable-uploads/58c29542-568b-4ddb-898d-7f3c77b14af4.png";
const LOGO_ON_PAPER = "/lovable-uploads/4bf7339d-93aa-401c-960e-c32ebe22e59a.png";

const LINKS = [
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
];

/**
 * Transparent fixed bar. Its colour follows whichever data-theme section sits under it,
 * it hides on scroll-down and returns on scroll-up (fine pointers only), and under 1024px
 * the link cluster collapses to the word "Menu".
 */
export const Nav = () => {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState<"ink" | "paper">("ink");
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  // Which themed section is under the bar right now.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const t = e.target.getAttribute("data-theme");
            if (t === "ink" || t === "paper") setTheme(t);
          }
        }
      },
      { rootMargin: "-1px 0px -96% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    if (isTouch()) return;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y > 100 && delta > 4) setHidden(true);
      else if (delta < -8 || y <= 100) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const showTheme = open ? "ink" : theme;

  return (
    <>
      <header
        data-theme={showTheme}
        className={cn(
          "fixed inset-x-0 top-0 z-50 !bg-transparent transition-[transform,color] duration-400 ease-out",
          hidden && !open && "-translate-y-full"
        )}
      >
        <nav aria-label="Primary" className="wrap flex h-nav-sm items-center justify-between lg:h-nav">
          <Link to="/" className="relative z-[60] flex items-center" aria-label="Project Premier, home">
            <img
              src={showTheme === "ink" ? LOGO_ON_INK : LOGO_ON_PAPER}
              alt="Project Premier"
              width={120}
              height={80}
              className="h-9 w-auto lg:h-12"
              decoding="async"
            />
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "group relative text-ui transition-opacity duration-250",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-300 after:ease-out",
                    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100 opacity-80 hover:opacity-100"
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
