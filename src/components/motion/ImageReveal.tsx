import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** CSS aspect-ratio for the frame, e.g. "4 / 5". Omit to let the image size itself. */
  aspect?: string;
  /** Stills are rendered black and white by default. */
  still?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  width?: number;
  height?: number;
};

/** Frame that reveals its image with a clip-path inset and a settle from scale 1.15 to 1. */
export const ImageReveal = ({
  src, alt, className, imgClassName, aspect, still = true,
  loading = "lazy", fetchPriority, sizes, width, height,
}: Props) => {
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = img.current;
    const wrap = frame.current;
    if (!el || !wrap || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      el,
      { clipPath: "inset(8% round 2px)", scale: 1.15 },
      {
        clipPath: "inset(0% round 0px)",
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 85%", once: true },
      }
    );
    const fallback = window.setTimeout(() => {
      if (!tween.isActive() && tween.progress() === 0) tween.play(0);
    }, 4000);

    return () => {
      window.clearTimeout(fallback);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)} style={aspect ? { aspectRatio: aspect } : undefined}>
      <img
        ref={img}
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        sizes={sizes}
        width={width}
        height={height}
        decoding="async"
        className={cn("h-full w-full object-cover will-change-transform", still && "still", imgClassName)}
      />
    </div>
  );
};
