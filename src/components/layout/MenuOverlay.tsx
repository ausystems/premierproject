import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/lib/SmoothScroll";
import { useTorontoTime } from "@/hooks/useTorontoTime";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
  { to: "/referral", label: "Refer a Youth" },
];

type Props = { open: boolean; onClose: () => void };

/** Full-screen ink menu. Five numbered links, the studio address and the live studio clock. */
export const MenuOverlay = ({ open, onClose }: Props) => {
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLLIElement[]>([]);
  const lenis = useLenis();
  const time = useTorontoTime();
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
      className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto pb-8 pt-nav-sm lg:pt-nav"
    >
      <nav aria-label="Menu" className="wrap pt-8">
        <ul className="flex flex-col">
          {LINKS.map((l, i) => (
            <li key={l.to} ref={(n) => { if (n) items.current[i] = n; }} className="hair-t py-3 last:hair-b">
              <Link to={l.to} onClick={onClose} className="group flex items-baseline gap-5">
                <span className="meta w-8 text-grey">0{i + 1}</span>
                <span className="text-[12vw] leading-[0.95] tracking-[-0.03em] transition-transform duration-300 ease-out group-hover:translate-x-2 sm:text-[9vw]">
                  {l.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="wrap meta flex flex-wrap justify-between gap-4 text-grey">
        <span>130 Queens Quay East, Toronto</span>
        <span className="tnum">Toronto {time}</span>
      </div>
    </div>
  );
};
