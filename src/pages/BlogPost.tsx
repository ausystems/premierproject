import { useParams } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui-kit/SectionTitle";
import { IndexRow } from "@/components/ui-kit/IndexRow";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StringLine } from "@/components/strings/StringLine";
import { Rich } from "@/components/blog/Rich";
import { POSTS, postBySlug, type Post } from "@/content/posts";
import { BODIES, type Block } from "@/content/post-bodies";
import { postPath } from "@/seo/pages";
import { useSeo } from "@/lib/seo";
import NotFound from "./NotFound";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** "2026-10-06" as "October 6, 2026", the same on the server and in every browser. */
const longDate = (day: string) => {
  const [y, m, d] = day.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

type Part = { heading?: string; blocks: Block[] };
/** The opening (everything before the first heading), then one part per heading. */
const partsOf = (body: Block[]) =>
  body.reduce<Part[]>((parts, block) => {
    if (block.h2) parts.push({ heading: block.h2, blocks: [] });
    else parts[parts.length - 1].blocks.push(block);
    return parts;
  }, [{ blocks: [] }]);

const CTA = ({ kind }: { kind: "refer" | "contact" }) => (
  <div className="mt-12 flex flex-wrap items-center gap-4">
    {kind === "refer" ? <Button to="/referral" magnetic>Refer a Youth</Button> : <Button to="/contact" magnetic>Get In Touch</Button>}
    <Button to="/programs" variant="secondary">Our Programs</Button>
  </div>
);

const BlockView = ({ block, lead }: { block: Block; lead?: boolean }) => {
  if (block.p) {
    return (
      <p className={lead ? "mt-6 text-body text-fg first:mt-0 md:text-[1.1875rem] md:leading-[1.55]" : "mt-5 text-body text-fg2 first:mt-0"}>
        <Rich text={block.p} />
      </p>
    );
  }
  if (block.h3) return <h3 className="mt-10 text-h4 first:mt-0">{block.h3}</h3>;
  if (block.ul || block.ol) {
    const List = block.ol ? "ol" : "ul";
    return (
      <List className={`mt-5 space-y-2.5 pl-5 text-body text-fg2 marker:text-grey ${block.ol ? "list-decimal" : "list-disc"}`}>
        {(block.ol || block.ul || []).map((item) => (
          <li key={item} className="pl-1"><Rich text={item} /></li>
        ))}
      </List>
    );
  }
  if (block.quote) {
    return (
      <figure className="relative mt-10 pt-8">
        <StringLine edge="top" amp={12} />
        <blockquote className="text-h4 font-normal text-fg">{block.quote}</blockquote>
        {block.cite && <figcaption className="mt-3 text-sm text-grey">{block.cite}</figcaption>}
      </figure>
    );
  }
  if (block.note) {
    return (
      <aside role="note" className="relative mb-10 py-5 text-body text-fg">
        <StringLine edge="top" amp={10} />
        <StringLine edge="bottom" amp={10} />
        <Rich text={block.note} />
      </aside>
    );
  }
  if (block.cta) return <CTA kind={block.cta} />;
  return null;
};

/** The two guides that follow this one, wrapping round to the start. */
const nextTwo = (post: Post) => {
  const at = POSTS.findIndex((p) => p.slug === post.slug);
  return [1, 2].map((step) => POSTS[(at + step) % POSTS.length]);
};

const Article = ({ post }: { post: Post }) => {
  useSeo(postPath(post.slug));
  const [opening, ...parts] = partsOf(BODIES[post.slug] || []);

  return (
    <>
      <main id="main">
        <article data-theme="paper" className="wrap pt-[calc(theme(spacing.nav-sm)+3rem)] pb-section lg:pt-[calc(theme(spacing.nav)+5rem)]">
          <header>
            <SplitReveal as="h1" trigger="load" delay={0.2} className="max-w-[20ch] text-display">{post.title}</SplitReveal>
          </header>

          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
            <Reveal trigger="load" delay={0.7} className="text-sm text-grey md:sticky md:top-32 md:col-span-3 md:self-start">
              <p>By the Project Premier team</p>
              <p className="mt-1">
                Published <time dateTime={post.date}>{longDate(post.date)}</time>
              </p>
            </Reveal>

            <div className="md:col-span-8 md:col-start-4 xl:col-span-7">
              <Reveal trigger="load" delay={0.8}>
                {opening.blocks.map((block, i) => <BlockView key={i} block={block} lead />)}
              </Reveal>
              {parts.map((part) => (
                <Reveal key={part.heading} as="section" className="mt-14 md:mt-16">
                  <h2 className="text-h3">{part.heading}</h2>
                  <div className="mt-5">
                    {part.blocks.map((block, i) => <BlockView key={i} block={block} />)}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </article>

        <section data-theme="paper" className="wrap pb-section">
          <SectionTitle>Keep reading.</SectionTitle>
          <ul className="row-list mt-12 md:mt-14">
            {nextTwo(post).map((p, i) => (
              <li key={p.slug}>
                <IndexRow title={p.title} to={postPath(p.slug)} last={i === 1} />
              </li>
            ))}
          </ul>
          <Reveal className="mt-10">
            <Button variant="link" to="/blog">All Guides</Button>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
};

/** A guide from the blog, or the designed 404 for a slug that does not exist. */
const BlogPost = () => {
  const { slug = "" } = useParams();
  const post = postBySlug(slug);
  return post ? <Article post={post} /> : <NotFound />;
};

export default BlogPost;
