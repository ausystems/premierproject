import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  title: string;
  meta?: ReactNode;
  to?: string;
  href?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  /** Optional body shown under the title (descriptions, inline stills on touch). */
  children?: ReactNode;
  className?: string;
  last?: boolean;
};

/**
 * Numbered hairline row. The whole row is the link. On hover the ground inverts and the title
 * leans right; hover styles are inert on touch (Tailwind hoverOnlyWhenSupported).
 */
export const IndexRow = ({ index, title, meta, to, href, onEnter, onLeave, children, className, last }: Props) => {
  const body = (
    <>
      <span className="meta pt-1.5 text-grey transition-colors duration-250 group-hover:text-bg/60">{index}</span>
      <span className="min-w-0">
        <span className="block text-h3 transition-transform duration-300 ease-out group-hover:translate-x-3">{title}</span>
        {children && <span className="mt-4 block">{children}</span>}
      </span>
      {meta !== undefined && (
        <span className="meta hidden pt-1.5 text-grey transition-colors duration-250 group-hover:text-bg/60 md:block">{meta}</span>
      )}
      <ArrowUpRight
        aria-hidden="true"
        className="mt-1 h-5 w-5 justify-self-end transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 md:h-6 md:w-6"
      />
    </>
  );

  const classes = cn(
    "group grid w-full grid-cols-[3rem_minmax(0,1fr)_1.5rem] items-start gap-x-4 py-6 text-left",
    "hair-t transition-colors duration-250 ease-out hover:bg-fg hover:text-bg",
    "md:grid-cols-[4rem_minmax(0,1fr)_12rem_2rem] md:gap-x-6 md:py-8",
    last && "hair-b",
    className
  );

  const handlers = { onMouseEnter: onEnter, onMouseLeave: onLeave, onFocus: onEnter, onBlur: onLeave };

  if (to) return <Link to={to} className={classes} {...handlers}>{body}</Link>;
  if (href) return <a href={href} className={classes} {...handlers}>{body}</a>;
  return <div className={classes} {...handlers}>{body}</div>;
};
