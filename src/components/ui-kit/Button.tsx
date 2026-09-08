import { type ReactNode, type MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "link";

type Props = {
  children: ReactNode;
  variant?: Variant;
  to?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: "button" | "submit";
  className?: string;
  /** Persistent conversion pills only. */
  magnetic?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
};

const pill =
  "group relative inline-flex min-h-[44px] items-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-ui " +
  "transition-transform duration-250 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

/** Circle that rises from below the pill and inverts it. */
const Fill = ({ className }: { className: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "pointer-events-none absolute left-1/2 top-full h-[160%] w-[150%] -translate-x-1/2 rounded-[50%]",
      "transition-transform duration-400 ease-fill group-hover:-translate-y-[82%]",
      className
    )}
  />
);

const Arrow = ({ className }: { className?: string }) => (
  <ArrowUpRight
    aria-hidden="true"
    className={cn("h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5", className)}
  />
);

/**
 * The three CTA shapes of the site. Primary is ink on paper (or paper on ink) and inverts on hover;
 * secondary is outlined; link is an underline that draws from the left.
 */
export const Button = ({
  children, variant = "primary", to, href, onClick, type = "button", className,
  magnetic = false, arrow = true, disabled, ariaLabel,
}: Props) => {
  const classes =
    variant === "link"
      ? cn(
          "group relative inline-flex items-center gap-1.5 text-ui",
          "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 hover:after:scale-x-100",
          className
        )
      : variant === "primary"
        ? cn(pill, "border-fg bg-fg text-bg", className)
        : cn(pill, "border-fg bg-transparent text-fg", className);

  const inner = (
    <>
      {variant === "primary" && <Fill className="bg-bg" />}
      {variant === "secondary" && <Fill className="bg-fg" />}
      <span
        className={cn(
          "relative z-10 inline-flex items-center gap-2 transition-colors duration-400 ease-fill",
          variant === "primary" && "group-hover:text-fg",
          variant === "secondary" && "group-hover:text-bg"
        )}
      >
        {children}
        {arrow && <Arrow />}
      </span>
    </>
  );

  const node = to ? (
    <Link to={to} className={classes} onClick={onClick} aria-label={ariaLabel}>{inner}</Link>
  ) : href ? (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {inner}
    </a>
  ) : (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>{inner}</button>
  );

  // A magnetic pill asked to be full width must let its inline wrapper stretch on small screens.
  const fullWidth = className?.includes("w-full");
  return magnetic ? <Magnetic className={fullWidth ? "block w-full sm:inline-block sm:w-auto" : undefined}>{node}</Magnetic> : node;
};
