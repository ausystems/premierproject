import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";

const LOGO = "/logo-nav.png";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

const underline =
  "relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

/**
 * Compact ink footer in two columns pinned to the same top and bottom lines: the mark above the
 * statement on the left, the ways to reach us above the address on the right; then one hairline
 * row of links and the copyright. Every section above already asks, so the footer carries no buttons.
 */
export const Footer = () => (
  <footer data-theme="ink" className="border-t border-fg/15">
    <div className="wrap pt-[clamp(2.25rem,4vw,3.5rem)] pb-[clamp(1.5rem,2.5vw,2rem)]">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="flex flex-col gap-8 md:col-span-6 md:justify-between lg:col-span-7">
          <Reveal y={12}>
            <Link
              to="/"
              aria-label="Project Premier, home"
              className="inline-block transition-opacity duration-300 ease-out hover:opacity-70"
            >
              <img
                src={LOGO}
                alt="Project Premier"
                width={384}
                height={256}
                loading="lazy"
                decoding="async"
                className="h-16 w-auto lg:h-[4.5rem]"
              />
            </Link>
          </Reveal>
          <SplitReveal as="p" className="max-w-[24ch] text-h3">
            Empowering youth across the GTA through music, <em>creativity</em>, and business.
          </SplitReveal>
        </div>

        <Reveal
          as="address"
          delay={0.1}
          className="flex flex-col gap-8 not-italic md:col-span-6 md:col-start-7 md:justify-between lg:col-span-4 lg:col-start-9"
        >
          <ul className="space-y-3 text-ui">
            <li>
              <a href="https://www.instagram.com/projectpremierx/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3">
                <Instagram aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
                <span className={underline}>@projectpremierx</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@projectpremier.org" className="group inline-flex items-center gap-3">
                <Mail aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
                <span className={underline}>info@projectpremier.org</span>
              </a>
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-fg2">
            <span className="inline-block">130 Queens Quay East, Toronto, ON, Canada</span>
            <br />
            <span className="inline-block">Friday 5 PM to 9 PM.</span> <span className="inline-block">Saturday 12 PM to 5 PM.</span>
          </p>
        </Reveal>
      </div>

      <Reveal
        delay={0.2}
        className="hair-t mt-10 flex flex-col gap-4 pt-5 text-sm text-grey lg:mt-12 lg:flex-row lg:items-center lg:justify-between"
      >
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-wrap">
            {LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} className={`${underline} transition-colors hover:text-fg`}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <p>
          © Copyright 2026. Project Premier. All Rights Reserved. Built by{" "}
          <a href="https://www.skyboundscaling.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">Skybound Scaling</a>
        </p>
      </Reveal>
    </div>
  </footer>
);
