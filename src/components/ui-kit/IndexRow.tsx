import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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

/** A list row: title and arrow on a hairline. The whole row is the link; hover inverts it. */
export const IndexRow = ({ title, to, href, onEnter, onLeave, children, className, last }: Props) => {
  const body = (
    <>
      <span className="min-w-0">
        <span className="block text-h3 transition-transform duration-300 ease-out group-hover:translate-x-2">{title}</span>
        {children && <span className="mt-3 block">{children}</span>}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="mt-1.5 h-5 w-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 md:h-6 md:w-6"
      />
    </>
  );

  const classes = cn(
    "group flex w-full items-start justify-between gap-6 py-6 text-left hair-t transition-colors duration-250 ease-out hover:bg-fg hover:text-bg md:py-7",
    last && "hair-b",
    className
  );
  const handlers = { onMouseEnter: onEnter, onMouseLeave: onLeave, onFocus: onEnter, onBlur: onLeave };

  if (to) return <Link to={to} className={classes} {...handlers}>{body}</Link>;
  if (href) return <a href={href} className={classes} {...handlers}>{body}</a>;
  return <div className={classes} {...handlers}>{body}</div>;
};
