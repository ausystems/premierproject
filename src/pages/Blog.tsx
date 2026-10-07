import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StringLine } from "@/components/strings/StringLine";
import { POSTS } from "@/content/posts";
import { readingMinutes } from "@/content/post-bodies";
import { postPath } from "@/seo/pages";
import { useSeo } from "@/lib/seo";

const forWhom = (audience: string) => `For ${audience.charAt(0).toLowerCase()}${audience.slice(1)}.`;

/**
 * The blog: one row per guide between two strings, the question on the left and what it answers on
 * the right. The whole row is the link (the title's link stretches over it), as on the Home lists.
 */
const Blog = () => {
  useSeo("/blog");

  return (
    <>
      <main id="main">
        <section data-theme="paper" className="wrap pt-[calc(theme(spacing.nav-sm)+3rem)] pb-section lg:pt-[calc(theme(spacing.nav)+5rem)]">
          <SplitReveal as="h1" trigger="load" delay={0.2} className="max-w-[14ch] text-display">
            Guides for young <em>artists</em> in Toronto.
          </SplitReveal>
          <Reveal trigger="load" delay={0.8} className="mt-8 max-w-prose text-body text-fg2 md:text-[1.125rem]">
            Plain answers to the questions young artists ask, and to the ones families and youth workers ask when a young person needs a fresh start.
          </Reveal>

          <ul className="row-list mt-16 md:mt-24">
            {POSTS.map((post, i) => (
              <Reveal key={post.slug} as="li" className="row-item group relative grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <StringLine edge="top" />
                {i === POSTS.length - 1 && <StringLine edge="bottom" />}
                <h2 className="row-dim text-h3 md:col-span-7">
                  <Link to={postPath(post.slug)} className="after:absolute after:inset-0 after:content-['']">
                    <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-2">{post.title}</span>
                  </Link>
                </h2>
                <div className="row-dim md:col-span-4 md:col-start-9">
                  <p className="text-body text-fg2">{post.excerpt}</p>
                  <p className="mt-3 text-sm text-grey">
                    {forWhom(post.audience)} {readingMinutes(post.slug)} min read
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
