import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui-kit/SectionTitle";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { InkWords } from "@/components/motion/InkWords";
import { Reveal } from "@/components/motion/Reveal";
import { useSeo } from "@/lib/seo";

const PROGRAMS = [
  { title: "Music", body: "Explore the power of music as a tool for expression and personal growth. Learn songwriting, production, and performance techniques." },
  { title: "Recording Arts", body: "Hands-on experience in professional studios with top producers and engineers." },
  { title: "Life Skills", body: "Build essential skills in communication, time management, and financial literacy to navigate life successfully." },
  { title: "Business Development", body: "Gain knowledge in entrepreneurship, branding, marketing, and financial management to build a sustainable career." },
];

const Programs = () => {
  useSeo("/programs");

  return (
    <>
      <main id="main">
        <section data-theme="ink" className="wrap flex min-h-[64svh] flex-col justify-end pb-14 pt-[calc(theme(spacing.nav-sm)+3rem)] md:pb-20 lg:pt-[calc(theme(spacing.nav)+4rem)]">
          <SplitReveal as="h1" trigger="load" delay={0.2} className="max-w-[14ch] text-display">
            Hands-on programs that <em>shape</em> careers.
          </SplitReveal>
          <Reveal trigger="load" delay={0.8} className="mt-8 max-w-prose text-body text-fg2 md:text-[1.125rem]">
            We provide immersive programs designed to inspire, educate, and empower youth through music, recording arts, and life skills, turning passion into a sustainable career.
          </Reveal>
        </section>

        <section data-theme="paper" className="wrap py-section">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <SectionTitle className="md:col-span-6">What we teach.</SectionTitle>
            <Reveal className="text-body text-fg2 md:col-span-5 md:col-start-8">
              Four focused programs built to develop the next generation of creators, professionals, and leaders.
            </Reveal>
          </div>
          <div className="mt-12 md:mt-14">
            {PROGRAMS.map((p, i) => (
              <article key={p.title} className={`grid gap-6 hair-t py-10 md:grid-cols-12 md:py-14 ${i === PROGRAMS.length - 1 ? "hair-b" : ""}`}>
                <SplitReveal as="h3" className="text-h2 md:col-span-5">{p.title}</SplitReveal>
                <div className="md:col-span-6 md:col-start-7">
                  <InkWords className="max-w-[34ch] text-statement">{p.body}</InkWords>
                  <Reveal className="mt-6">
                    <Button variant="link" to="/contact">Join this program</Button>
                  </Reveal>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Celebration: the film beside its heading, centred on each other */}
        <section data-theme="ink" className="wrap py-section">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-4">
              <SectionTitle>End of Year Celebration.</SectionTitle>
              <Reveal className="mt-5 text-body text-fg2">
                A night honoring the growth, talent, and dedication of our youth. Watch the highlights from our annual celebration.
              </Reveal>
              <Reveal className="mt-8 flex flex-wrap items-center gap-4">
                <Button to="/referral" magnetic>Refer a Youth</Button>
                <Button to="/contact" variant="secondary">Get In Touch</Button>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-8">
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/xUKiKbnl62c"
                  title="Premier Project End of Year Celebration"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Programs;
