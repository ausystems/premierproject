import { useEffect, useRef } from "react";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui-kit/SectionTitle";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { InkWords } from "@/components/motion/InkWords";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import remixLogo from "@/assets/remix-project-logo.jpeg";
import trilliumLogo from "@/assets/ontario-trillium-logo.jpeg";

const COMMUNITY = "/lovable-uploads/73b6ed2c-95da-4197-b8d2-ebefa8ca07ab.png";

// Five rows, never three: who we serve, the pillars, and where it happens.
const ROWS = [
  { index: "01", title: "Who we serve", body: "Marginalized youth across the Greater Toronto Area.", line: "Toronto, ON" },
  { index: "02", title: "Growth", body: "We focus on personal and professional development, providing resources and mentorship to help our youth grow their skills and confidence.", line: "Elevate young creatives domestically & internationally." },
  { index: "03", title: "Reform", body: "We believe in second chances and creating pathways for youth to transform their lives through education and creative expression.", line: "Change the perspective of culture of underserved communities and youth incarcerated." },
  { index: "04", title: "Connectivity", body: "We build bridges between youth and industry professionals, creating networks that support long-term success and collaboration.", line: "Become interconnected with local communities and opportunities." },
  { index: "05", title: "Where it happens", body: "130 Queens Quay East, on the Toronto waterfront. Friday and Saturday sessions.", line: "Friday 5 PM to 9 PM. Saturday 12 PM to 5 PM." },
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
      { scale: 1.1, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true } }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return (
    <div ref={frame} className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/10]">
      <img ref={img} src={COMMUNITY} alt="Project Premier community" width={1080} height={1350} loading="lazy" decoding="async" className="still h-full w-full object-cover will-change-transform" />
    </div>
  );
};

const About = () => (
  <>
    <main>
      {/* Spread: sticky label column, statement column. No media hero on this page. */}
      <section data-theme="paper" className="wrap grid gap-10 pt-[calc(theme(spacing.nav-sm)+3rem)] pb-section md:grid-cols-12 md:gap-8 lg:pt-[calc(theme(spacing.nav)+5rem)]">
        <aside className="meta text-grey md:col-span-3 md:sticky md:top-32 md:self-start">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col md:gap-3">
            <li>About</li>
            <li>Toronto, ON</li>
            <li>130 Queens Quay East</li>
          </ul>
        </aside>
        <div className="md:col-span-8 md:col-start-5">
          <SplitReveal as="h1" trigger="load" delay={0.2} className="max-w-[12ch] text-display">
            Built for the next generation of <em>creators</em>.
          </SplitReveal>
          <Reveal trigger="load" delay={0.8} className="mt-10 max-w-prose text-body text-fg2 md:text-[1.125rem]">
            A community-driven movement transforming the lives of marginalized youth across the Greater Toronto Area through music, creativity, and business.
          </Reveal>
          <InkWords className="mt-20 max-w-[30ch] text-statement md:mt-28">
            At Project Premier, we are committed to transforming the lives of marginalized youth across the Greater Toronto Area (GTA) by providing them with the tools, mentorship, and opportunities they need to succeed. Through the power of music, creativity, and business education, we equip young individuals with essential skills, real-world experience, and a supportive community that fosters growth.
          </InkWords>
          <Reveal className="mt-10 max-w-prose text-body text-fg2">
            Our vision rests on growth, reform, and connectivity. We strive to elevate young creatives, giving them the tools to succeed both locally and internationally.
          </Reveal>
          <Reveal className="mt-10">
            <Button to="/programs">Join a Program</Button>
          </Reveal>
        </div>
      </section>

      {/* Community: the one big picture, the heading crossing its top edge */}
      <section data-theme="paper" className="relative pb-[clamp(3rem,6vw,6rem)]">
        <div className="wrap relative z-10 -mb-[0.55em]">
          <SectionTitle align="left">Our Community.</SectionTitle>
        </div>
        <ScrollPortrait />
      </section>

      {/* What we stand for: five hairline rows, title on the right this time */}
      <section data-theme="ink" className="wrap py-section">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            {ROWS.map((r, i) => (
              <Reveal key={r.index} as="article" className={`grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 hair-t py-8 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-8 md:py-10 ${i === ROWS.length - 1 ? "hair-b" : ""}`}>
                <span className="meta pt-1.5 text-grey">{r.index}</span>
                <h3 className="text-h3">{r.title}</h3>
                <div className="col-start-2 mt-4 md:col-start-3 md:mt-0">
                  <p className="text-body text-fg2">{r.body}</p>
                  <p className="meta mt-4 text-grey">{r.line}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="md:col-span-4 md:sticky md:top-32 md:self-start md:text-right">
            <SplitReveal as="h2" className="text-h2">What we stand for.</SplitReveal>
          </div>
        </div>
      </section>

      {/* Partners as a two-item list */}
      <section data-theme="paper" className="wrap py-section">
        <SectionTitle>Partners & Collaborators.</SectionTitle>
        <Reveal className="mt-12 grid hair-t md:mt-16 md:grid-cols-2">
          <div className="flex items-center justify-between gap-6 hair-b py-8 md:hair-r md:pr-10">
            <span className="text-h4">The Remix Project</span>
            <img src={remixLogo} alt="The Remix Project logo" width={640} height={335} loading="lazy" className="still h-12 w-auto md:h-16" />
          </div>
          <div className="flex items-center justify-between gap-6 hair-b py-8 md:pl-10">
            <span className="text-h4">Ontario Trillium Foundation</span>
            <img src={trilliumLogo} alt="Ontario Trillium Foundation logo" width={1180} height={664} loading="lazy" className="still h-12 w-auto md:h-16" />
          </div>
        </Reveal>
        <Reveal className="mt-12">
          <Button variant="link" to="/programs">Explore Our Programs</Button>
        </Reveal>
      </section>
    </main>
    <Footer />
  </>
);

export default About;
