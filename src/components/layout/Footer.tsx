import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";

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
 * Compact ink footer built to convert: the statement and the two asks on the left, the ways to
 * reach us (with icons) on the right, then one row of links and the copyright.
 */
export const Footer = () => (
  <footer data-theme="ink">
    <div className="wrap py-[clamp(3rem,6vw,5.5rem)]">
      <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
        <div className="md:col-span-7">
          <SplitReveal as="p" className="max-w-[26ch] text-h3">
            Empowering youth across the GTA through music, <em>creativity</em>, and business.
          </SplitReveal>
          <Reveal className="mt-7 flex flex-wrap items-center gap-3">
            <Button to="/referral" magnetic>Refer a Youth</Button>
            <Button to="/programs" variant="secondary">Join a program</Button>
          </Reveal>
        </div>

        <Reveal as="address" className="not-italic md:col-span-4 md:col-start-9">
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
          <p className="mt-5 text-sm text-fg2">
            130 Queens Quay East, Toronto, ON, Canada<br />
            Friday 5 PM to 9 PM. Saturday 12 PM to 5 PM.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-12 flex flex-col gap-4 text-sm text-grey md:mt-14 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
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
