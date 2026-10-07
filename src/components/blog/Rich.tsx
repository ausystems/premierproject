import { type ReactNode } from "react";
import { Link } from "react-router-dom";

/** [label](href) or **bold**. */
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

// Padding on an inline link widens what a finger can hit without moving a single line of text.
export const textLink =
  "-mx-1 px-1 py-3 text-fg underline decoration-fg/40 underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-fg";

/** A link in running text: pages of this site route in place, everything else opens as usual. */
export const TextLink = ({ href, children }: { href: string; children: ReactNode }) => {
  if (href.startsWith("/")) return <Link to={href} className={textLink}>{children}</Link>;
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      // a phone number is one tap target and never breaks across lines
      className={href.startsWith("tel:") ? `${textLink} whitespace-nowrap` : textLink}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

/** Renders the small inline markup used in blog text (see src/content/post-bodies.js). */
export const Rich = ({ text }: { text: string }) => {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      m[1] !== undefined
        ? <TextLink key={at} href={m[2]}>{m[1]}</TextLink>
        : <strong key={at} className="font-medium text-fg">{m[3]}</strong>
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
};
