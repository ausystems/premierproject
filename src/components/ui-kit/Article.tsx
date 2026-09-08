import { type ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";

export type ArticleSection = {
  heading: string;
  body: ReactNode[];
  /** Optional plain list rendered as hairline rows. */
  items?: string[];
};

type Props = {
  title: ReactNode;
  intro: string;
  updated: string;
  sections: ArticleSection[];
};

/** Long-form page: one centred reading column, section headings, short paragraphs. */
export const Article = ({ title, intro, updated, sections }: Props) => (
  <section data-theme="paper" className="wrap pt-[calc(theme(spacing.nav-sm)+3rem)] pb-section lg:pt-[calc(theme(spacing.nav)+5rem)]">
    <div className="mx-auto max-w-[46rem]">
      <SplitReveal as="h1" trigger="load" delay={0.2} className="text-display">{title}</SplitReveal>
      <Reveal trigger="load" delay={0.8} className="mt-8 text-body text-fg2 md:text-[1.125rem]">{intro}</Reveal>
      <Reveal trigger="load" delay={1} className="mt-4 text-sm text-grey">Last updated {updated}</Reveal>

      <div className="mt-14 md:mt-16">
        {sections.map((s) => (
          <Reveal key={s.heading} as="section" className="mt-12 first:mt-0">
            <h2 className="text-h4 font-medium">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-4 text-body text-fg2">{p}</p>
            ))}
            {s.items && (
              <ul className="mt-5">
                {s.items.map((it) => (
                  <li key={it} className="hair-t py-3 text-body text-fg2 last:hair-b">{it}</li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
