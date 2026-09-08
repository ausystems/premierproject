import { Link } from "react-router-dom";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
];

const link =
  "relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100";

/** Ink footer: the statement, the two asks, one row of links, one row of facts. */
export const Footer = () => (
  <footer data-theme="ink">
    <div className="wrap py-section">
      <SplitReveal as="p" className="max-w-[24ch] text-h2">
        Empowering youth across the GTA through music, <em>creativity</em>, and business.
      </SplitReveal>

      <Reveal className="mt-10 flex flex-wrap items-center gap-4">
        <Button to="/referral" magnetic>Refer a Youth</Button>
        <Button to="/programs" variant="secondary">Join a program</Button>
      </Reveal>

      <Reveal className="mt-20 grid gap-10 text-ui md:mt-28 md:grid-cols-12">
        <nav aria-label="Footer" className="md:col-span-5">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} className={link}>{l.label}</Link></li>
            ))}
            <li>
              <a href="https://www.instagram.com/projectpremierx/" target="_blank" rel="noopener noreferrer" className={link}>Instagram</a>
            </li>
          </ul>
        </nav>
        <dl className="grid gap-x-8 gap-y-6 text-sm text-fg2 sm:grid-cols-2 md:col-span-7">
          <div>
            <dt className="sr-only">Studio</dt>
            <dd>130 Queens Quay East, Toronto, ON, Canada<br />Friday 5 PM to 9 PM. Saturday 12 PM to 5 PM.</dd>
          </div>
          <div>
            <dt className="sr-only">Contact</dt>
            <dd>
              <a href="mailto:info@projectpremier.org" className="transition-colors hover:text-fg">info@projectpremier.org</a><br />
              <a href="https://www.instagram.com/projectpremierx/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">@projectpremierx</a>
            </dd>
          </div>
        </dl>
      </Reveal>

      <Reveal as="p" className="mt-14 text-sm text-grey">
        © Copyright 2026. Project Premier. All Rights Reserved. Built by{" "}
        <a href="https://www.audesigns.co/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">AuDesigns.co</a>
      </Reveal>
    </div>
  </footer>
);
