// @ts-check
/**
 * Every indexable page of the site with its search metadata: the title tag, the meta description,
 * the schema.org page type, the sitemap priority and the date its content last changed. Read by the
 * SEO hook in the browser and by scripts/postbuild.mjs, so the live document, the pre-rendered pages,
 * the sitemap and the RSS feed always agree.
 *
 * Titles stay within 60 characters and descriptions within 160, so search results show them whole.
 */
import { POSTS } from "../content/posts.js";

/**
 * @typedef {import("../content/posts.js").Post} Post
 * @typedef {{ name: string, title: string, description: string, type: string, priority: string, updated: string, post?: Post }} Page
 */

/** @type {Record<string, Page>} */
const ROUTES = {
  "/": {
    name: "Home",
    title: "Youth Music & Business Programs in Toronto | Project Premier",
    description:
      "A Toronto nonprofit helping marginalized youth across the GTA build real careers through music, recording arts, life skills and business development programs.",
    type: "WebPage",
    priority: "1.0",
    updated: "2026-10-06",
  },
  "/about": {
    name: "About Us",
    title: "About Project Premier | Toronto Youth Music Nonprofit",
    description:
      "Project Premier is a community-driven Toronto nonprofit using music and business education to open real opportunities for marginalized youth across the GTA.",
    type: "AboutPage",
    priority: "0.8",
    updated: "2026-10-06",
  },
  "/programs": {
    name: "Our Programs",
    title: "Toronto Youth Music & Recording Programs | Project Premier",
    description:
      "Music, Recording Arts, Life Skills and Business Development: four hands-on programs for youth across the GTA, with sessions on the Toronto waterfront.",
    type: "CollectionPage",
    priority: "0.9",
    updated: "2026-10-06",
  },
  "/blog": {
    name: "Blog",
    title: "Guides for Young Artists in Toronto | Project Premier Blog",
    description:
      "Plain answers for young artists and the adults who support them, from free recording in Toronto and music rights in Canada to making a referral.",
    type: "CollectionPage",
    priority: "0.8",
    updated: "2026-10-06",
  },
  "/contact": {
    name: "Contact",
    title: "Contact Project Premier | 130 Queens Quay East, Toronto",
    description:
      "Email info@projectpremier.org or visit 130 Queens Quay East on the Toronto waterfront. Open Friday 5 PM to 9 PM and Saturday 12 PM to 5 PM.",
    type: "ContactPage",
    priority: "0.7",
    updated: "2026-10-06",
  },
  "/referral": {
    name: "Refer a Youth",
    title: "Refer a Youth to Our Toronto Programs | Project Premier",
    description:
      "Youth workers, schools, agencies and families can refer a young person to Project Premier's Toronto youth programs through our secure online form.",
    type: "WebPage",
    priority: "0.9",
    updated: "2026-10-06",
  },
  "/privacy": {
    name: "Privacy Policy",
    title: "Privacy Policy | Project Premier",
    description:
      "How Project Premier collects, uses and protects personal information, including referral form submissions, in line with PIPEDA and, where applicable, FIPPA.",
    type: "WebPage",
    priority: "0.3",
    updated: "2026-09-08",
  },
  "/terms": {
    name: "Terms of Use",
    title: "Terms of Use | Project Premier",
    description:
      "The terms for using the Project Premier website, covering referrals and submissions, intellectual property, third-party content and limits of liability.",
    type: "WebPage",
    priority: "0.3",
    updated: "2026-09-08",
  },
};

/** The path of a blog post. */
export const postPath = (/** @type {string} */ slug) => `/blog/${slug}`;

/** @type {Record<string, Page>} */
export const PAGES = {
  ...ROUTES,
  ...Object.fromEntries(
    POSTS.map((post) => [
      postPath(post.slug),
      {
        name: post.title,
        title: post.seoTitle,
        description: post.description,
        type: "WebPage",
        priority: "0.7",
        updated: post.updated,
        post,
      },
    ])
  ),
};

export const isKnownPath = (/** @type {string} */ path) => Object.prototype.hasOwnProperty.call(PAGES, path);
