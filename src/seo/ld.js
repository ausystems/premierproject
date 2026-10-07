// @ts-check
/**
 * Shared SEO constants and the JSON-LD builder. Used at runtime by the SEO hook and at build time
 * by scripts/postbuild.mjs, so the schema in the pre-rendered pages and in the live document agree.
 */
import { POSTS } from "../content/posts.js";

export const SITE_URL = "https://premierproject.vercel.app";
export const SITE_NAME = "Project Premier";
/** The picture shown when a page is shared, and the image of every article. */
export const SHARE_IMAGE = {
  url: `${SITE_URL}/project-premier-youth-music-program-toronto.jpg`,
  width: 1200,
  height: 630,
  alt: "Project Premier logo over guitars in the Project Premier recording studio",
};
/** The picture shared for a page: a blog post has its own card, every other page the site's. */
export const shareImageFor = (/** @type {{ post?: { slug: string, title: string } }} */ page) =>
  page.post
    ? { url: `${SITE_URL}/blog/${page.post.slug}.jpg`, width: 1200, height: 630, alt: `Project Premier: ${page.post.title}` }
    : SHARE_IMAGE;
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const BLOG_ID = `${SITE_URL}/blog#blog`;
/** The organization as author or publisher, named in place so every block reads on its own. */
const ORG = { "@type": "NGO", "@id": ORG_ID, name: SITE_NAME, url: `${SITE_URL}/` };

export const PROGRAMS = [
  { name: "Music", description: "Explore the power of music as a tool for expression and personal growth. Learn songwriting, production, and performance techniques." },
  { name: "Recording Arts", description: "Hands-on experience in professional studios with top producers and engineers." },
  { name: "Life Skills", description: "Build essential skills in communication, time management, and financial literacy to navigate life successfully." },
  { name: "Business Development", description: "Gain knowledge in entrepreneurship, branding, marketing, and financial management to build a sustainable career." },
];

/** The films on the site, as published on the Project Premier YouTube channel. */
export const VIDEOS = {
  reflection: {
    id: "2z-Ztm9UHr4",
    name: "Project Premier: Mid-Point Reflection",
    description:
      "Project Premier's Mid-Point Reflection, where youth participants openly share their experiences, personal growth and thoughts on the program so far.",
    uploadDate: "2026-05-07T06:56:57-07:00",
    duration: "PT47S",
  },
  celebration: {
    id: "xUKiKbnl62c",
    name: "Project Premier End of Year Celebration",
    description:
      "Project Premier's first End of Year Celebration, an evening recognizing the hard work, growth, dedication and achievements of each participant in the program.",
    uploadDate: "2026-05-07T06:49:43-07:00",
    duration: "PT1M13S",
  },
};
/** @type {Record<string, typeof VIDEOS.reflection>} */
const PAGE_VIDEOS = { "/": VIDEOS.reflection, "/programs": VIDEOS.celebration };

/**
 * @typedef {import("./pages.js").Page} Page
 */

/** Metadata for any path that is not a page: the designed 404, never indexed. */
export const NOT_FOUND = {
  name: "Page not found",
  title: "Page not found | Project Premier",
  description: "The page you were looking for does not exist.",
  type: "WebPage",
  priority: "0",
  updated: "",
};

/** @param {{ title: string }} page */
export const pageTitle = (page) => page.title;

/** A date as schema.org and Open Graph expect it: the day, at midnight in Toronto. */
export const isoDate = (/** @type {string} */ day) => `${day}T00:00:00-04:00`;

/**
 * @param {string} path
 * @param {Page} page
 */
export function buildLd(path, page) {
  const url = `${SITE_URL}${path}`;
  const post = page.post;
  /** @type {Record<string, unknown>[]} */
  const graph = [];

  /** @type {Record<string, unknown>} */
  const webPage = {
    "@type": page.type,
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: "en-CA",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    publisher: ORG,
  };
  if (page.updated) webPage.dateModified = isoDate(page.updated);
  if (path !== "/") webPage.breadcrumb = { "@id": `${url}#breadcrumb` };
  if (post) webPage.mainEntity = { "@id": `${url}#article` };
  if (path === "/blog") webPage.mainEntity = { "@id": BLOG_ID };
  graph.push(webPage);

  if (path !== "/") {
    const trail = [{ name: "Home", item: `${SITE_URL}/` }];
    if (post) trail.push({ name: "Blog", item: `${SITE_URL}/blog` });
    trail.push({ name: page.name, item: url });
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, ...t })),
    });
  }

  if (path === "/programs") {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#programs`,
      name: "Project Premier programs",
      numberOfItems: PROGRAMS.length,
      itemListElement: PROGRAMS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: p.name,
          description: p.description,
          serviceType: "Youth program",
          provider: ORG,
          areaServed: { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
          audience: { "@type": "Audience", audienceType: "Youth" },
        },
      })),
    });
  }

  if (path === "/blog") {
    graph.push({
      "@type": "Blog",
      "@id": BLOG_ID,
      url,
      name: "Project Premier Blog",
      description: page.description,
      inLanguage: "en-CA",
      publisher: ORG,
      blogPost: POSTS.map((p) => ({
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${p.slug}#article`,
        url: `${SITE_URL}/blog/${p.slug}`,
        headline: p.title,
        description: p.description,
        datePublished: isoDate(p.date),
        dateModified: isoDate(p.updated),
        author: ORG,
      })),
    });
  }

  if (post) {
    graph.push({
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      url,
      headline: post.title,
      description: post.description,
      image: { "@type": "ImageObject", url: shareImageFor(page).url, width: 1200, height: 630 },
      datePublished: isoDate(post.date),
      dateModified: isoDate(post.updated),
      author: ORG,
      publisher: ORG,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      isPartOf: { "@id": BLOG_ID },
      inLanguage: "en-CA",
      keywords: post.keywords.join(", "),
      audience: { "@type": "Audience", audienceType: post.audience },
    });
  }

  const video = PAGE_VIDEOS[path];
  if (video) {
    graph.push({
      "@type": "VideoObject",
      "@id": `${url}#video`,
      name: video.name,
      description: video.description,
      uploadDate: video.uploadDate,
      duration: video.duration,
      thumbnailUrl: [`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`, `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`],
      embedUrl: `https://www.youtube.com/embed/${video.id}`,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      publisher: ORG,
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
