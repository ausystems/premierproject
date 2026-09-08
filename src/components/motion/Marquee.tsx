import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Pixels per second. */
  speed?: number;
  pauseOnHover?: boolean;
};

/** One continuous track, four copies, linear. Static under reduced motion. */
export const Marquee = ({ children, className, speed = 80, pauseOnHover = true }: Props) => {
  const track = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const el = track.current;
    if (!el || reduced) return;
    const half = el.scrollWidth / 2;
    const tween = gsap.to(el, { xPercent: -50, duration: half / speed, ease: "none", repeat: -1 });
    const pause = () => tween.pause();
    const play = () => tween.play();
    if (pauseOnHover) {
      el.addEventListener("mouseenter", pause);
      el.addEventListener("mouseleave", play);
    }
    return () => {
      tween.kill();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", play);
    };
  }, [speed, pauseOnHover, reduced]);

  if (reduced) return <div className={cn("overflow-hidden", className)}>{children}</div>;

  return (
    <div className={cn("overflow-hidden", className)} aria-hidden="true">
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
};
