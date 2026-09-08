import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/lib/SmoothScroll";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
  { to: "/referral", label: "Refer a Youth" },
];

type Props = { open: boolean; onClose: () => void };

/** Full-screen ink menu: five links, nothing else. */
export const MenuOverlay = ({ open, onClose }: Props) => {
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLLIElement[]>([]);
  const lenis = useLenis();
  const mounted = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const rows = items.current.filter(Boolean);

    if (!mounted.current) {
      mounted.current = true;
      gsap.set(el, { clipPath: "inset(0 0 100% 0)", pointerEvents: "none" });
      return;
    }

    if (open) {
      lenis?.stop();
      document.documentElement.classList.add("lenis-stopped");
      gsap.set(el, { pointerEvents: "auto" });
      gsap.to(el, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0.2 : 0.8, ease: "power4.inOut" });
      gsap.fromTo(
        rows,
        { yPercent: reduced ? 0 : 110, autoAlpha: reduced ? 0 : 1 },
        { yPercent: 0, autoAlpha: 1, duration: reduced ? 0.2 : 0.9, ease: "power3.out", stagger: reduced ? 0 : 0.07, delay: reduced ? 0 : 0.25 }
      );
      window.setTimeout(() => el.querySelector<HTMLAnchorElement>("a")?.focus(), 400);
    } else {
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: reduced ? 0.2 : 0.6,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(el, { pointerEvents: "none" });
          lenis?.start();
          document.documentElement.classList.remove("lenis-stopped");
        },
      });
    }
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      id="menu-overlay"
      ref={root}
      data-theme="ink"
      data-lenis-prevent
      aria-hidden={!open}
      className="fixed inset-0 z-40 overflow-y-auto pt-nav-sm lg:pt-nav"
    >
      <nav aria-label="Menu" className="wrap pt-10">
        <ul className="flex flex-col">
          {LINKS.map((l, i) => (
            <li key={l.to} ref={(n) => { if (n) items.current[i] = n; }} className="overflow-hidden py-2">
              <Link to={l.to} onClick={onClose} className="block text-[11vw] leading-[1.05] tracking-[-0.03em] transition-opacity duration-300 hover:opacity-60 sm:text-[8vw]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
