import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui-kit/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { useTorontoTime } from "@/hooks/useTorontoTime";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
];

/**
 * Ink footer on every page except 404: the statement, a rule carrying the disc ask and the outlined
 * ask, one row of links, one row of studio metadata, and the wordmark bleeding off the bottom.
 */
export const Footer = () => {
  const time = useTorontoTime();

  return (
    <footer data-theme="ink" className="relative overflow-hidden">
      <div className="wrap pt-section">
        <SplitReveal as="p" className="max-w-[18ch] text-display">
          Empowering youth across the GTA through music, <em>creativity</em>, and business.
        </SplitReveal>

        <Reveal className="relative mt-16 flex flex-wrap items-center gap-6 hair-t pt-8 md:mt-24 md:pt-10">
          <Magnetic>
            <Link
              to="/referral"
              className="group flex h-40 w-40 items-center justify-center rounded-full border border-fg bg-fg text-center text-ui text-bg transition-transform duration-300 ease-out hover:scale-[1.04] active:scale-[0.98] md:h-44 md:w-44"
            >
              <span className="inline-flex items-center gap-1.5">
                Refer a Youth
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </Magnetic>
          <Button to="/programs" variant="secondary">Join a program</Button>
          <p className="ml-auto max-w-[36ch] text-body text-fg2">
            Help connect youth with our programs through this secure referral process. Your referral can make a meaningful difference in a young person's life.
          </p>
        </Reveal>

        <nav aria-label="Footer" className="mt-16 hair-t pt-6 md:mt-24">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-ui">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://www.instagram.com/projectpremierx/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
              >
                Instagram
              </a>
            </li>
          </ul>
        </nav>

        <dl className="meta mt-8 grid grid-cols-2 gap-x-8 gap-y-4 text-grey md:mt-10 md:grid-cols-5">
          <div>
            <dt className="sr-only">Address</dt>
            <dd>130 Queens Quay East, Toronto, ON, Canada</dd>
          </div>
          <div>
            <dt className="sr-only">Hours</dt>
            <dd>Friday 5 PM to 9 PM. Saturday 12 PM to 5 PM.</dd>
          </div>
          <div>
            <dt className="sr-only">Studio time</dt>
            <dd className="tnum">Toronto {time}</dd>
          </div>
          <div>
            <dt className="sr-only">Email</dt>
            <dd><a href="mailto:info@projectpremier.org" className="hover:text-fg transition-colors">info@projectpremier.org</a></dd>
          </div>
          <div className="col-span-2 md:col-span-1">
            <dt className="sr-only">Copyright</dt>
            <dd>© Copyright 2026. Project Premier. All Rights Reserved. Built by <a href="https://www.audesigns.co/" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">AuDesigns.co</a></dd>
          </div>
        </dl>
      </div>

      <div aria-hidden="true" className="mt-10 select-none overflow-hidden leading-none md:mt-12">
        <div className="translate-y-[22%] text-center font-sans text-wordmark-sm uppercase text-fg md:text-wordmark">
          Premier
        </div>
      </div>
    </footer>
  );
};
