import { useEffect, useRef, type MutableRefObject } from "react";
import { registerString, type StringHandle } from "@/lib/strings";
import { cn } from "@/lib/utils";

type Props = {
  /** Which edge of the positioned parent the line sits on. */
  edge?: "top" | "bottom";
  /** Largest swing in px. Keep it inside the padding around the line. */
  amp?: number;
  /** A featured string rests brighter than a hairline. */
  bright?: boolean;
  interactive?: boolean;
  /** Tuning: below 1 rings lower and slower. */
  pitch?: number;
  /** Above 1 rings longer. */
  sustain?: number;
  className?: string;
  handle?: MutableRefObject<StringHandle | null>;
};

/**
 * A hairline that is also a string. At rest it is the same 1px rule the site has always used, drawn
 * as a box so it stays pixel-crisp; while it moves, an SVG path takes over and the rule hides.
 * Decorative only: hidden from assistive technology and never in the way of a click.
 */
export const StringLine = ({ edge = "top", amp = 14, bright = false, interactive = true, pitch = 1, sustain = 1, className, handle }: Props) => {
  const host = useRef<HTMLSpanElement>(null);
  const rest = useRef<HTMLSpanElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!host.current || !rest.current || !svg.current || !path.current) return;
    const h = registerString(
      { host: host.current, rest: rest.current, svg: svg.current, path: path.current },
      { amp, restAlpha: bright ? 0.55 : 0.15, peakAlpha: bright ? 1 : 0.6, interactive, pitch, sustain }
    );
    if (handle) handle.current = h;
    return () => {
      h.dispose();
      if (handle) handle.current = null;
    };
    // interactive is read once; later changes go through handle.setInteractive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amp, bright, pitch, sustain]);

  const offset = edge === "top" ? 0 : -1;

  return (
    <span
      ref={host}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 block h-0 text-fg", edge === "top" ? "top-0" : "bottom-0", className)}
    >
      <span ref={rest} className={cn("absolute inset-x-0 block h-px", bright ? "bg-fg/55" : "bg-fg/15")} style={{ top: offset }} />
      <svg
        ref={svg}
        className="absolute left-0 w-full overflow-visible"
        style={{ top: offset - amp, height: amp * 2 + 1, visibility: "hidden" }}
        focusable="false"
      >
        <path ref={path} fill="none" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
};
