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
import heroPoster from "@/assets/hero-poster.jpg";
import remixLogo from "@/assets/remix-project-logo.jpeg";
import trilliumLogo from "@/assets/ontario-trillium-logo.jpeg";

const RowFollower = lazy(() => import("@/components/webgl/RowFollower").then((m) => ({ default: m.RowFollower })));

const COMMUNITY = "/lovable-uploads/73b6ed2c-95da-4197-b8d2-ebefa8ca07ab.png";

const PROGRAMS = [
  { index: "01", title: "Music", meta: "Songwriting, production, performance" },
  { index: "02", title: "Recording Arts", meta: "Professional studios" },
  { index: "03", title: "Life Skills", meta: "Communication, time management, financial literacy" },
  { index: "04", title: "Business Development", meta: "Entrepreneurship, branding, marketing" },
];

const QUOTES = [
  "Project Premier changed my life. I went from feeling lost to having a real plan for my future. Now, I'm in the studio, learning from real professionals and building a career in music. I finally feel like I have a purpose. This program gave me a second chance that no one else would!",
  "Before Project Premier, my past made breaking into the music industry feel impossible. This program gave me the education, guidance, and hands-on experience I needed. With studio time and industry opportunities, I now have a real chance at success.",
  "This program taught me the importance of owning my music rights and understanding copyright. I also learned how to manage my music and release the right content to grow. Being surrounded by other artists gave me a strong sense of collaboration. This experience helped me gain both knowledge and confidence in my career.",
];

const CHANNELS = [
  { label: "Email", node: <a href="mailto:info@projectpremier.org" className="hover:text-fg transition-colors">info@projectpremier.org</a> },
  { label: "Instagram", node: <a href="https://www.instagram.com/projectpremierx/" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">@projectpremierx</a> },
  { label: "Address", node: <>130 Queens Quay East,<br />Toronto, ON, Canada</> },
  { label: "Hours", node: <>Friday: 5 PM to 9 PM<br />Saturday: 12 PM to 5 PM<br />Sunday to Thursday: Closed</> },
];

const Index = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <main>
        <Hero />

        {/* 01 Statement */}
        <section data-theme="paper" className="wrap py-section">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <span className="meta text-grey">01</span>
              <InkWords className="mt-6 max-w-[28ch] text-statement">
                At Project Premier, we are committed to transforming the lives of marginalized youth across the Greater Toronto Area (GTA) by providing them with the tools, mentorship, and opportunities they need to succeed. Through the power of music, creativity, and business education, we equip young individuals with essential skills, real-world experience, and a supportive community that fosters growth.
              </InkWords>
              <Reveal className="mt-10">
                <Button variant="link" to="/about">About Us</Button>
              </Reveal>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:mt-32">
              <ImageReveal src={COMMUNITY} alt="Project Premier community" aspect="4 / 5" width={1080} height={1350} sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          </div>
        </section>

        {/* 02 Programs */}
        <section data-theme="paper" className="wrap pb-section">
          <SectionTitle index="02">Our Programs.</SectionTitle>
          <Reveal className="mt-8 max-w-prose text-body text-fg2 md:mt-12">
            Four pillars built to develop the next generation of creators, professionals, and leaders.
          </Reveal>
          <div className="mt-12 md:mt-16">
            {PROGRAMS.map((p, i) => (
              <IndexRow
                key={p.title}
                index={p.index}
                title={p.title}
                meta={p.meta}
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

        {/* 03 Voices: the story film, then the three quotes set as one and two, never three equal blocks */}
        <section data-theme="ink" className="py-section">
          <div className="wrap">
            <SectionTitle index="03">What Our Youth Say.</SectionTitle>
            <Reveal className="mt-8 max-w-prose text-body text-fg2 md:mt-12">
              Real stories from the young creators building their future with Project Premier.
            </Reveal>
          </div>

          <Reveal className="mt-14 md:mt-20">
            <div className="relative aspect-video w-full hair-t hair-b">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/2z-Ztm9UHr4"
                title="Project Premier Video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="wrap meta flex flex-wrap justify-between gap-4 py-4 text-grey">
              <span>Discover How We Empower Youth</span>
              <span className="max-w-[48ch] text-right">See the program in action. Real students, real mentorship, and the moments that change trajectories.</span>
            </div>
          </Reveal>

          <div className="wrap mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-8">
            <figure className="md:col-span-7">
              <SplitReveal as="blockquote" className="max-w-[30ch] text-statement">
                {QUOTES[0]}
              </SplitReveal>
              <figcaption className="meta mt-6 text-grey">Youth Voice</figcaption>
            </figure>
            <div className="md:col-span-4 md:col-start-9">
              {QUOTES.slice(1).map((q, i) => (
                <Reveal key={i} as="figure" className="hair-t py-8 first:pt-0 first:border-t-0 md:first:pt-0">
                  <blockquote className="text-h4 font-normal text-fg2">{q}</blockquote>
                  <figcaption className="meta mt-5 text-grey">Youth Voice</figcaption>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 04 Partners */}
        <section data-theme="paper" className="wrap py-section">
          <SectionTitle index="04">Partners & Collaborators.</SectionTitle>
          <Reveal className="mt-12 grid items-center gap-8 hair-t hair-b py-10 md:mt-16 md:grid-cols-12">
            <p className="max-w-[34ch] text-body text-fg2 md:col-span-5">
              We're proud to work alongside these organizations to create meaningful impact in our community.
            </p>
            <div className="flex flex-wrap items-center gap-10 md:col-span-7 md:justify-end md:gap-16">
              <img src={remixLogo} alt="The Remix Project logo" width={640} height={335} loading="lazy" className="still h-14 w-auto md:h-20" />
              <img src={trilliumLogo} alt="Ontario Trillium Foundation logo" width={1180} height={664} loading="lazy" className="still h-14 w-auto md:h-20" />
            </div>
          </Reveal>
        </section>

        {/* 05 Get in touch */}
        <section data-theme="paper" className="wrap pb-section">
          <SectionTitle index="05">Get In Touch.</SectionTitle>
          <Reveal className="mt-8 max-w-prose text-body text-fg2 md:mt-12">
            Questions, partnerships, or just saying hi. We'd love to hear from you.
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
            <Button href="mailto:info@projectpremier.org">Send Us A Message</Button>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
