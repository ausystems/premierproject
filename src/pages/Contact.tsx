import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui-kit/SectionTitle";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";

const EMAIL = "info@projectpremier.org";
const MAP = "/lovable-uploads/49dfc3cf-39fa-42c9-b75f-0d3ff5743c90.png";
const MAPS_URL = "https://maps.google.com/?q=130+Queens+Quay+East,+Toronto,+ON,+Canada";

const CHANNELS = [
  { label: "Email", node: <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-fg">{EMAIL}</a> },
  { label: "Instagram", node: <a href="https://www.instagram.com/projectpremierx/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">@projectpremierx</a> },
  { label: "Address", node: <>130 Queens Quay East,<br />Toronto, ON, Canada</> },
  { label: "Hours", node: <>Friday: 5 PM to 9 PM<br />Saturday: 12 PM to 5 PM<br />Sunday to Thursday: Closed</> },
];

const Contact = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <>
      <main>
        {/* The address is the headline */}
        <section data-theme="paper" className="wrap pt-[calc(theme(spacing.nav-sm)+3rem)] pb-section lg:pt-[calc(theme(spacing.nav)+5rem)]">
          <SplitReveal as="p" trigger="load" delay={0.2} className="max-w-[12ch] text-h2 text-fg2">
            Let's start a <em>conversation</em>.
          </SplitReveal>
          <h1 className="mt-10 md:mt-14">
            <button
              type="button"
              onClick={copy}
              aria-live="polite"
              className="group relative block text-left font-sans text-[clamp(1.75rem,6.2vw,7rem)] font-[450] leading-[0.95] tracking-[-0.04em] [overflow-wrap:anywhere] transition-colors duration-300 hover:text-fg2"
            >
              <span className="block">{EMAIL}</span>
              <span className="meta mt-4 block text-grey">{copied ? "Copied to clipboard" : "Click to copy, or send a message below"}</span>
            </button>
          </h1>
          <Reveal trigger="load" delay={0.9} className="mt-10 max-w-prose text-body text-fg2 md:text-[1.125rem]">
            Questions about our programs, partnership ideas, or just saying hi. We'd love to hear from you.
          </Reveal>
        </section>

        {/* Four channels */}
        <section data-theme="ink" className="wrap py-section">
          <SectionTitle>Get In Touch.</SectionTitle>
          <Reveal className="mt-8 max-w-prose text-body text-fg2 md:mt-12">
            Reach us through any of the channels below. We typically respond within one to two business days.
          </Reveal>
          <Reveal className="mt-12 grid grid-cols-2 hair-t hair-b md:mt-16 md:grid-cols-4">
            {CHANNELS.map((c, i) => (
              <div key={c.label} className={`py-8 pr-6 ${i > 0 ? "md:hair-l md:pl-8" : ""} ${i % 2 === 1 ? "hair-l pl-6 md:pl-8" : ""} ${i > 1 ? "hair-t md:border-t-0" : ""}`}>
                <div className="meta text-grey">{c.label}</div>
                <div className="mt-4 text-body text-fg2">{c.node}</div>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-12">
            <Button href={`mailto:${EMAIL}`} magnetic>Send Us A Message</Button>
          </Reveal>
        </section>

        {/* Studio */}
        <section data-theme="paper" className="wrap grid gap-10 py-section md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <ImageReveal src={MAP} alt="Map showing Project Premier location at 130 Queens Quay East, Toronto" aspect="974 / 770" width={974} height={770} sizes="(min-width: 768px) 58vw, 100vw" />
          </div>
          <div className="md:col-span-4 md:col-start-9 md:self-end">
            <SplitReveal as="h2" className="text-h2">Visit our studio.</SplitReveal>
            <Reveal className="mt-8 max-w-prose text-body text-fg2">
              We're on the Toronto waterfront. Drop by during open hours.
            </Reveal>
            <Reveal className="mt-8">
              <Button variant="link" href={MAPS_URL}>Open In Maps</Button>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
