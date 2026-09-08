import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Total travel in percent of the child's height, split evenly around rest. */
  range?: number;
};

/** Slow drift of an over-sized child inside a clipped frame. Nothing larger than 10 percent. */
export const Parallax = ({ children, className, range = 10 }: Props) => {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = frame.current;
    const el = inner.current;
    if (!wrap || !el || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      el,
      { yPercent: -range },
      { yPercent: range, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [range]);

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)}>
      <div ref={inner} className="h-full w-full scale-[1.22] will-change-transform">
        {children}
      </div>
    </div>
  );
};
