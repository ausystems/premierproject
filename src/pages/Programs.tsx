import { useEffect, useRef } from "react";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui-kit/SectionTitle";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { InkWords } from "@/components/motion/InkWords";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const PROGRAMS = [
  { index: "01", title: "Music", body: "Explore the power of music as a tool for expression and personal growth. Learn songwriting, production, and performance techniques." },
  { index: "02", title: "Recording Arts", body: "Hands-on experience in professional studios with top producers and engineers." },
  { index: "03", title: "Life Skills", body: "Build essential skills in communication, time management, and financial literacy to navigate life successfully." },
  { index: "04", title: "Business Development", body: "Gain knowledge in entrepreneurship, branding, marketing, and financial management to build a sustainable career." },
];

const Programs = () => {
  const counter = useRef<HTMLSpanElement>(null);
  const articles = useRef<HTMLElement[]>([]);

  // The page's one system break: a tape-counter numeral that flips as each program passes.
  useEffect(() => {
    const el = counter.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const flip = (to: string) => {
      if (el.textContent === to) return;
      if (reduced) { el.textContent = to; return; }
      gsap.timeline()
        .to(el, { yPercent: -60, autoAlpha: 0, duration: 0.25, ease: "power2.in" })
        .add(() => { el.textContent = to; })
        .fromTo(el, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" });
    };
    const triggers = articles.current.filter(Boolean).map((a, i) =>
      ScrollTrigger.create({
        trigger: a,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => flip(PROGRAMS[i].index),
        onEnterBack: () => flip(PROGRAMS[i].index),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <>
      <main>
        {/* Ink strip */}
        <section data-theme="ink" className="wrap flex min-h-[70svh] flex-col justify-end pb-16 pt-[calc(theme(spacing.nav-sm)+3rem)] md:pb-24 lg:pt-[calc(theme(spacing.nav)+4rem)]">
          <SplitReveal as="h1" trigger="load" delay={0.2} className="max-w-[11ch] text-display">
            Hands-on programs that <em>shape</em> careers.
          </SplitReveal>
          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
            <Reveal trigger="load" delay={0.8} className="max-w-prose text-body text-fg2 md:col-span-7 md:text-[1.125rem]">
              We provide immersive programs designed to inspire, educate, and empower youth through music, recording arts, and life skills, turning passion into a sustainable career.
            </Reveal>
            <Reveal trigger="load" delay={1} className="meta text-grey md:col-span-5 md:text-right">
              Four focused programs built to develop the next generation of creators, professionals, and leaders.
            </Reveal>
          </div>
        </section>

        {/* Counter + four spreads */}
        <section data-theme="paper" className="wrap grid gap-10 py-section md:grid-cols-12 md:gap-8">
          <div className="hidden md:col-span-4 md:block">
            <div className="sticky top-32 overflow-hidden">
              <span className="meta text-grey">What we teach</span>
              <div className="mt-4 overflow-hidden leading-none">
                <span ref={counter} className="tnum inline-block text-[18vw] font-[450] leading-none tracking-[-0.05em]">01</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <SplitReveal as="h2" className="text-h2 md:hidden">What we teach.</SplitReveal>
            {PROGRAMS.map((p, i) => (
              <article
                key={p.title}
                ref={(n) => { if (n) articles.current[i] = n; }}
                className={`grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 hair-t py-12 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-x-8 md:py-20 ${i === PROGRAMS.length - 1 ? "hair-b" : ""}`}
              >
                <span className="meta pt-2 text-grey">{p.index}</span>
                <div>
                  <SplitReveal as="h3" className="text-h2">{p.title}</SplitReveal>
                  <InkWords className="mt-8 max-w-[34ch] text-statement">{p.body}</InkWords>
                  <Reveal className="mt-8">
                    <Button variant="link" to="/contact">Join this program</Button>
                  </Reveal>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Celebration */}
        <section data-theme="ink" className="py-section">
          <div className="wrap">
            <SectionTitle>End of Year Celebration.</SectionTitle>
            <Reveal className="mt-8 max-w-prose text-body text-fg2 md:mt-12">
              A night honoring the growth, talent, and dedication of our youth. Watch the highlights from our annual celebration.
            </Reveal>
          </div>
          <Reveal className="mt-14 md:mt-20">
            <div className="relative aspect-video w-full hair-t hair-b">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/xUKiKbnl62c"
                title="Premier Project End of Year Celebration"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="wrap meta flex flex-wrap justify-between gap-4 py-4 text-grey">
              <span>Premier Project End of Year Celebration</span>
              <span>Annual</span>
            </div>
          </Reveal>
          <Reveal className="wrap mt-16 flex flex-wrap items-center gap-6 md:mt-24">
            <Button to="/referral" magnetic>Refer a Youth</Button>
            <Button to="/contact" variant="secondary">Get In Touch</Button>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Programs;
