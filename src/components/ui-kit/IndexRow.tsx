import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { StringLine } from "@/components/strings/StringLine";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  to?: string;
  href?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  children?: ReactNode;
  className?: string;
  last?: boolean;
};

/**
 * A list row: title and arrow between two strings. The whole row is the link. On hover the other rows
 * fall back, the title leans in, and crossing into the row plays the string above it.
 * Place rows inside a `.row-list` container.
 */
export const IndexRow = ({ title, to, href, onEnter, onLeave, children, className, last }: Props) => {
  const body = (
    <>
      <StringLine edge="top" />
      {last && <StringLine edge="bottom" />}
      <span className="row-dim relative flex w-full items-start justify-between gap-6">
        <span className="min-w-0">
          <span className="block text-h3 transition-transform duration-500 ease-out group-hover:translate-x-2">{title}</span>
          {children && <span className="mt-3 block">{children}</span>}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-1.5 h-5 w-5 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 md:h-6 md:w-6"
        />
      </span>
    </>
  );

  const classes = cn("row-item group relative flex w-full py-6 text-left md:py-7", className);
  const handlers = { onMouseEnter: onEnter, onMouseLeave: onLeave, onFocus: onEnter, onBlur: onLeave };

  if (to) return <Link to={to} className={classes} {...handlers}>{body}</Link>;
  if (href) return <a href={href} className={classes} {...handlers}>{body}</a>;
  return <div className={classes} {...handlers}>{body}</div>;
};
