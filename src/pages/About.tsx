import { useEffect, useRef } from "react";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui-kit/SectionTitle";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { InkWords } from "@/components/motion/InkWords";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useSeo } from "@/lib/seo";
import remixLogo from "@/assets/remix-project-logo.webp";
import trilliumLogo from "@/assets/ontario-trillium-logo.webp";

const COMMUNITY = "/community.webp";

// Five rows, never three.
const ROWS = [
  { title: "Who we serve", body: "Marginalized youth across the Greater Toronto Area." },
  { title: "Growth", body: "We focus on personal and professional development, providing resources and mentorship to help our youth grow their skills and confidence." },
  { title: "Reform", body: "We believe in second chances and creating pathways for youth to transform their lives through education and creative expression." },
  { title: "Connectivity", body: "We build bridges between youth and industry professionals, creating networks that support long-term success and collaboration." },
  { title: "Where it happens", body: "130 Queens Quay East, on the Toronto waterfront. Friday and Saturday sessions." },
];

/** The portrait leans closer as the reader scrolls past it. */
const ScrollPortrait = () => {
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!frame.current || !img.current || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      img.current,
      { scale: 1 },
      { scale: 1.08, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true } }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return (
    <div ref={frame} className="relative aspect-[4/5] w-full overflow-hidden">
      <img ref={img} src={COMMUNITY} alt="Project Premier community" width={1080} height={1350} loading="lazy" decoding="async" sizes="(min-width: 768px) 42vw, 100vw" className="still h-full w-full object-cover will-change-transform" />
    </div>
  );
};

const About = () => {
  useSeo("/about");

  return (
    <>
      <main id="main">
        <section data-theme="paper" className="wrap grid gap-10 pt-[calc(theme(spacing.nav-sm)+3rem)] pb-section md:grid-cols-12 lg:pt-[calc(theme(spacing.nav)+5rem)]">
          <div className="md:col-span-8 md:col-start-4">
            <SplitReveal as="h1" trigger="load" delay={0.2} className="max-w-[14ch] text-display">
              Built for the next generation of <em>creators</em>.
            </SplitReveal>
            <Reveal trigger="load" delay={0.8} className="mt-8 max-w-prose text-body text-fg2 md:text-[1.125rem]">
              A community-driven movement transforming the lives of marginalized youth across the Greater Toronto Area through music, creativity, and business.
            </Reveal>
            <InkWords className="mt-16 max-w-[30ch] text-statement md:mt-24">
              At Project Premier, we are committed to transforming the lives of marginalized youth across the Greater Toronto Area (GTA) by providing them with the tools, mentorship, and opportunities they need to succeed. Through the power of music, creativity, and business education, we equip young individuals with essential skills, real-world experience, and a supportive community that fosters growth.
            </InkWords>
            <Reveal className="mt-8 max-w-prose text-body text-fg2">
              Our vision rests on growth, reform, and connectivity. We strive to elevate young creatives, giving them the tools to succeed both locally and internationally.
            </Reveal>
            <Reveal className="mt-10">
              <Button to="/programs">Join a Program</Button>
            </Reveal>
          </div>
        </section>

        {/* Community: heading beside a contained portrait */}
        <section data-theme="paper" className="wrap grid gap-8 pb-section md:grid-cols-12 md:items-end md:gap-12">
          <div className="md:col-span-4">
            <SectionTitle>Our Community.</SectionTitle>
          </div>
          <Reveal className="md:col-span-5 md:col-start-7">
            <ScrollPortrait />
          </Reveal>
        </section>

        <section data-theme="ink" className="wrap py-section">
          <SectionTitle>What we stand for.</SectionTitle>
          <div className="mt-12 md:mt-14">
            {ROWS.map((r, i) => (
              <Reveal key={r.title} as="article" className={`grid gap-4 hair-t py-7 md:grid-cols-12 md:py-9 ${i === ROWS.length - 1 ? "hair-b" : ""}`}>
                <h3 className="text-h3 md:col-span-5">{r.title}</h3>
                <p className="text-body text-fg2 md:col-span-6 md:col-start-7">{r.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section data-theme="paper" className="wrap py-[clamp(3.5rem,6vw,6rem)]">
          <Reveal className="grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="text-h3">Partners & Collaborators.</h2>
              <Button variant="link" to="/programs" className="mt-4">Explore Our Programs</Button>
            </div>
            <div className="flex flex-wrap items-center gap-8 md:col-span-6 md:col-start-7 md:justify-end md:gap-12 lg:gap-16">
              <img src={remixLogo} alt="The Remix Project logo" width={1462} height={622} loading="lazy" className="still h-20 w-auto md:h-24 lg:h-28" />
              <img src={trilliumLogo} alt="Ontario Trillium Foundation logo" width={1214} height={878} loading="lazy" className="still h-20 w-auto md:h-24 lg:h-28" />
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
