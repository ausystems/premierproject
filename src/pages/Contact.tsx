import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui-kit/SectionTitle";
import { Button } from "@/components/ui-kit/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";

const EMAIL = "info@projectpremier.org";
const MAP = "/lovable-uploads/49dfc3cf-39fa-42c9-b75f-0d3ff5743c90.png";
const MAPS_URL = "https://maps.google.com/?q=130+Queens+Quay+East,+Toronto,+ON,+Canada";

const CHANNELS = [
  { label: "Email", node: <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-fg">{EMAIL}</a> },
  { label: "Instagram", node: <a href="https://www.instagram.com/projectpremierx/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">@projectpremierx</a> },
  { label: "Address", node: <>130 Queens Quay East<br />Toronto, ON, Canada</> },
  { label: "Hours", node: <>Friday 5 PM to 9 PM<br />Saturday 12 PM to 5 PM<br />Sunday to Thursday closed</> },
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
          <h1>
            <button
              type="button"
              onClick={copy}
              aria-live="polite"
              className="block text-left font-sans text-[clamp(1.75rem,6vw,6.5rem)] font-[450] leading-[0.95] tracking-[-0.04em] [overflow-wrap:anywhere] transition-colors duration-300 hover:text-fg2"
            >
              <span className="block">{EMAIL}</span>
              <span className="mt-4 block text-sm font-normal tracking-normal text-grey">{copied ? "Copied to clipboard" : "Click to copy"}</span>
            </button>
          </h1>
          <Reveal trigger="load" delay={0.6} className="mt-10 max-w-prose text-body text-fg2 md:text-[1.125rem]">
            Questions about our programs, partnership ideas, or just saying hi. We'd love to hear from you.
          </Reveal>
        </section>

        <section data-theme="ink" className="wrap py-section">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionTitle>Get In Touch.</SectionTitle>
              <Reveal className="mt-4 max-w-[34ch] text-body text-fg2">
                Reach us through any of the channels below. We typically respond within one to two business days.
              </Reveal>
              <Reveal className="mt-8">
                <Button href={`mailto:${EMAIL}`} magnetic>Send Us A Message</Button>
              </Reveal>
            </div>
            <Reveal className="grid gap-x-8 gap-y-8 sm:grid-cols-2 md:col-span-6 md:col-start-7">
              {CHANNELS.map((c) => (
                <div key={c.label}>
                  <div className="text-sm text-grey">{c.label}</div>
                  <div className="mt-1.5 text-body text-fg2">{c.node}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section data-theme="paper" className="wrap grid gap-10 py-section md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <ImageReveal src={MAP} alt="Map showing Project Premier location at 130 Queens Quay East, Toronto" aspect="974 / 770" width={974} height={770} sizes="(min-width: 768px) 58vw, 100vw" />
          </div>
          <div className="md:col-span-4 md:col-start-9 md:self-end">
            <SectionTitle>Visit our studio.</SectionTitle>
            <Reveal className="mt-6 max-w-prose text-body text-fg2">
              We're on the Toronto waterfront. Drop by during open hours.
            </Reveal>
            <Reveal className="mt-6">
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
