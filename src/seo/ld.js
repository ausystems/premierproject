// @ts-check
/**
 * Shared SEO constants and the JSON-LD builder. Used at runtime by the SEO hook and at build time
 * by scripts/postbuild.mjs, so the schema in the static HTML shells and in the live document agree.
 */

export const SITE_URL = "https://premierproject.vercel.app";
export const SITE_NAME = "Project Premier";
export const HOME_TITLE = "Project Premier - Empowering Youth, Changing the Future";
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export const PROGRAMS = [
  { name: "Music", description: "Explore the power of music as a tool for expression and personal growth. Learn songwriting, production, and performance techniques." },
  { name: "Recording Arts", description: "Hands-on experience in professional studios with top producers and engineers." },
  { name: "Life Skills", description: "Build essential skills in communication, time management, and financial literacy to navigate life successfully." },
  { name: "Business Development", description: "Gain knowledge in entrepreneurship, branding, marketing, and financial management to build a sustainable career." },
];

/** @type {Record<string, {name: string, description: string, id: string}>} */
const VIDEOS = {
  "/": { name: "Project Premier Video", description: "See the program in action. Real students, real mentorship, and the moments that change trajectories.", id: "2z-Ztm9UHr4" },
  "/programs": { name: "Premier Project End of Year Celebration", description: "A night honoring the growth, talent, and dedication of our youth. Watch the highlights from our annual celebration.", id: "xUKiKbnl62c" },
};

/**
 * @param {{ title: string }} route
 */
export function pageTitle(route) {
  return route.title ? `${route.title} | ${SITE_NAME}` : HOME_TITLE;
}

/**
 * @param {string} path
 * @param {{ name: string, title: string, description: string, type: string }} route
 */
export function buildLd(path, route) {
  const url = `${SITE_URL}${path}`;
  /** @type {Record<string, unknown>[]} */
  const graph = [];

  /** @type {Record<string, unknown>} */
  const page = {
    "@type": route.type,
    "@id": `${url}#webpage`,
    url,
    name: pageTitle(route),
    description: route.description,
    inLanguage: "en-CA",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
  if (path !== "/") page.breadcrumb = { "@id": `${url}#breadcrumb` };
  graph.push(page);

  if (path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: route.name, item: url },
      ],
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
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
          audience: { "@type": "Audience", audienceType: "Youth" },
        },
      })),
    });
  }

  const video = VIDEOS[path];
  if (video) {
    graph.push({
      "@type": "VideoObject",
      "@id": `${url}#video`,
      name: video.name,
      description: video.description,
      embedUrl: `https://www.youtube.com/embed/${video.id}`,
      thumbnailUrl: [`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`],
      publisher: { "@id": ORG_ID },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
