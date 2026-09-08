import { lazy, Suspense, useState } from "react";
import Hero from "@/components/home/Hero";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui-kit/SectionTitle";
import { IndexRow } from "@/components/ui-kit/IndexRow";
import { Button } from "@/components/ui-kit/Button";
import { InkWords } from "@/components/motion/InkWords";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { useSeo } from "@/lib/seo";
import heroPoster from "@/assets/hero-poster.jpg";
import remixLogo from "@/assets/remix-project-logo.jpeg";
import trilliumLogo from "@/assets/ontario-trillium-logo.jpeg";

const RowFollower = lazy(() => import("@/components/webgl/RowFollower").then((m) => ({ default: m.RowFollower })));

const COMMUNITY = "/lovable-uploads/73b6ed2c-95da-4197-b8d2-ebefa8ca07ab.png";
const PROGRAMS = ["Music", "Recording Arts", "Life Skills", "Business Development"];

const QUOTES = [
  "Project Premier changed my life. I went from feeling lost to having a real plan for my future. Now, I'm in the studio, learning from real professionals and building a career in music. I finally feel like I have a purpose. This program gave me a second chance that no one else would!",
  "Before Project Premier, my past made breaking into the music industry feel impossible. This program gave me the education, guidance, and hands-on experience I needed. With studio time and industry opportunities, I now have a real chance at success.",
  "This program taught me the importance of owning my music rights and understanding copyright. I also learned how to manage my music and release the right content to grow. Being surrounded by other artists gave me a strong sense of collaboration. This experience helped me gain both knowledge and confidence in my career.",
];

const CHANNELS = [
  { label: "Email", node: <a href="mailto:info@projectpremier.org" className="transition-colors hover:text-fg">info@projectpremier.org</a> },
  { label: "Instagram", node: <a href="https://www.instagram.com/projectpremierx/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">@projectpremierx</a> },
  { label: "Address", node: <>130 Queens Quay East<br />Toronto, ON, Canada</> },
  { label: "Hours", node: <>Friday 5 PM to 9 PM<br />Saturday 12 PM to 5 PM<br />Sunday to Thursday closed</> },
];

const Index = () => {
  const [active, setActive] = useState<number | null>(null);
  useSeo({
    path: "/",
    description: "Project Premier is committed to transforming the lives of marginalized youth across the Greater Toronto Area (GTA) through music, creativity, and business education.",
  });

  return (
    <>
      <main>
        <Hero />

        {/* Statement */}
        <section data-theme="paper" className="wrap py-section">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <InkWords className="max-w-[28ch] text-statement">
                At Project Premier, we are committed to transforming the lives of marginalized youth across the Greater Toronto Area (GTA) by providing them with the tools, mentorship, and opportunities they need to succeed. Through the power of music, creativity, and business education, we equip young individuals with essential skills, real-world experience, and a supportive community that fosters growth.
              </InkWords>
              <Reveal className="mt-10">
                <Button variant="link" to="/about">About Us</Button>
              </Reveal>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:mt-24">
              <ImageReveal src={COMMUNITY} alt="Project Premier community" aspect="4 / 5" width={1080} height={1350} sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          </div>
        </section>

        {/* Programs */}
        <section data-theme="paper" className="wrap pb-section">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <SectionTitle className="md:col-span-6">Our Programs.</SectionTitle>
            <Reveal className="text-body text-fg2 md:col-span-5 md:col-start-8">
              Four pillars built to develop the next generation of creators, professionals, and leaders.
            </Reveal>
          </div>
          <div className="mt-12 md:mt-14">
            {PROGRAMS.map((title, i) => (
              <IndexRow
                key={title}
                title={title}
                to="/programs"
                onEnter={() => setActive(i)}
                onLeave={() => setActive(null)}
                last={i === PROGRAMS.length - 1}
              />
            ))}
          </div>
          <Reveal className="mt-10">
            <Button variant="link" to="/programs">More About Our Programs</Button>
          </Reveal>
          <Suspense fallback={null}>
            <RowFollower active={active} images={[heroPoster, COMMUNITY, heroPoster, COMMUNITY]} />
          </Suspense>
        </section>

        {/* Voices: the film beside its heading, centred on each other; then the three quotes as one and two */}
        <section data-theme="ink" className="wrap py-section">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-4">
              <SectionTitle>What Our Youth Say.</SectionTitle>
              <Reveal className="mt-5 text-body text-fg2">
                Real stories from the young creators building their future with Project Premier.
              </Reveal>
            </div>
            <Reveal className="lg:col-span-8">
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/2z-Ztm9UHr4"
                  title="Project Premier Video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-12">
            <figure className="md:col-span-7">
              <SplitReveal as="blockquote" className="max-w-[30ch] text-statement">{QUOTES[0]}</SplitReveal>
              <figcaption className="mt-5 text-sm text-grey">Youth Voice</figcaption>
            </figure>
            <div className="md:col-span-4 md:col-start-9">
              {QUOTES.slice(1).map((q, i) => (
                <Reveal key={i} as="figure" className={i === 0 ? "" : "mt-10"}>
                  <blockquote className="text-h4 font-normal text-fg2">{q}</blockquote>
                  <figcaption className="mt-4 text-sm text-grey">Youth Voice</figcaption>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Partners and Get in touch */}
        <section data-theme="paper" className="wrap py-[clamp(3.5rem,6vw,6rem)]">
          <Reveal className="grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="text-h3">Partners & Collaborators.</h2>
              <p className="mt-3 max-w-[34ch] text-body text-fg2">
                We're proud to work alongside these organizations to create meaningful impact in our community.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-10 md:col-span-6 md:col-start-7 md:justify-end md:gap-14">
              <img src={remixLogo} alt="The Remix Project logo" width={640} height={335} loading="lazy" className="still h-12 w-auto md:h-14" />
              <img src={trilliumLogo} alt="Ontario Trillium Foundation logo" width={1180} height={664} loading="lazy" className="still h-12 w-auto md:h-14" />
            </div>
          </Reveal>

          <div className="mt-20 grid gap-8 md:mt-24 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionTitle size="h3">Get In Touch.</SectionTitle>
              <Reveal className="mt-3 max-w-[34ch] text-body text-fg2">
                Questions, partnerships, or just saying hi. We'd love to hear from you.
              </Reveal>
              <Reveal className="mt-8">
                <Button href="mailto:info@projectpremier.org">Send Us A Message</Button>
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
      </main>
      <Footer />
    </>
  );
};

export default Index;
