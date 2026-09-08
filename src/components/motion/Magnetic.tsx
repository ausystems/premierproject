import { useEffect, useRef, type ReactNode } from "react";
import { gsap, isTouch, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = { children: ReactNode; strength?: number; className?: string };

/** Fine-pointer only: the child leans toward the cursor and springs back on leave. */
export const Magnetic = ({ children, strength = 0.35, className }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch() || prefersReducedMotion()) return;

    const toX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const toY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      toX((e.clientX - (r.left + r.width / 2)) * strength);
      toY((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </span>
  );
};
