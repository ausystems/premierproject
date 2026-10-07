// Post-build: one pre-rendered HTML page per page of the site (the full page markup from the build-time
// renderer, plus the right title, description, canonical, Open Graph and JSON-LD), a 404 page, the
// sitemap, the blog's RSS feed and llms.txt. Search engines and AI crawlers that do not run JavaScript
// read the whole page; browsers take it over.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildLd, isoDate, NOT_FOUND, shareImageFor, SITE_URL } from "../src/seo/ld.js";
import { PAGES, postPath } from "../src/seo/pages.js";
import { POSTS } from "../src/content/posts.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, "..", "dist");
// The renderer bundles React; production mode keeps it quiet and fast.
process.env.NODE_ENV = "production";
// Keep the untouched template, so this step can be re-run after the first pass has filled index.html.
const templatePath = path.resolve(here, "..", "dist-ssr", "template.html");
const built = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const base = built.includes('<div id="root"></div>') ? built : fs.readFileSync(templatePath, "utf8");
fs.writeFileSync(templatePath, base);
const { render } = await import(path.resolve(here, "..", "dist-ssr", "entry-server.js"));

// Site ownership for Google Search Console and Bing Webmaster Tools: set these in the hosting
// environment (Vercel: Settings, Environment Variables) and every page carries the tag.
const VERIFY = [
  ["google-site-verification", process.env.GOOGLE_SITE_VERIFICATION],
  ["msvalidate.01", process.env.BING_SITE_VERIFICATION],
].filter(([, value]) => value);

// Every post shares with its own card; scripts/share-images.py makes them. Never publish without one.
for (const p of POSTS) {
  if (!fs.existsSync(path.join(dist, "blog", `${p.slug}.jpg`))) {
    throw new Error(`postbuild: public/blog/${p.slug}.jpg is missing. Run: python3 scripts/share-images.py`);
  }
}

/** Pictures each page shows, listed in the sitemap so image search can find them. */
const IMAGES = {
  ...Object.fromEntries(POSTS.map((p) => [postPath(p.slug), [`/blog/${p.slug}.jpg`]])),
  "/": ["/project-premier-recording-studio-guitars.jpg", "/project-premier-youth-community.webp"],
  "/about": ["/project-premier-youth-community.webp"],
  "/contact": ["/project-premier-map-130-queens-quay-east-toronto.webp"],
};

/**
 * Put the rendered page inside #root, record which route it was rendered for (the browser only takes
 * over markup that matches its URL), and mark the document as server-rendered (see src/lib/ssr.ts).
 */
const withMarkup = (html, markup, routePath) => {
  if (!html.includes('<div id="root"></div>')) throw new Error("postbuild: #root placeholder not found");
  if (!html.includes('<html lang="en-CA">')) throw new Error("postbuild: <html lang> not found");
  return html
    .replace('<html lang="en-CA">', '<html lang="en-CA" class="ssr">')
    .replace('<div id="root"></div>', `<div id="root" data-route="${routePath}">${markup}</div>`);
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const setMeta = (html, attr, key, value) => {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`postbuild: <meta ${attr}="${key}"> not found`);
  return html.replace(re, `$1${esc(value)}$2`);
};
const addToHead = (html, tags) => html.replace("</head>", `${tags.map((t) => `    ${t}\n`).join("")}  </head>`);
const dropHeroPreload = (html) => html.replace(/\s*<link rel="preload" as="image"[^>]*data-hero-preload[^>]*>/, "");

const shellFor = (routePath, page) => {
  const url = `${SITE_URL}${routePath}`;
  let html = base.replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`);
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  const image = shareImageFor(page);
  html = setMeta(html, "property", "og:image", image.url);
  html = setMeta(html, "property", "og:image:alt", image.alt);
  html = setMeta(html, "name", "twitter:image", image.url);
  html = setMeta(html, "name", "twitter:image:alt", image.alt);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  // Only Home shows the hero still; elsewhere preloading it would spend bandwidth on nothing.
  if (routePath !== "/") html = dropHeroPreload(html);

  const tags = [];
  if (page.post) {
    html = setMeta(html, "property", "og:type", "article");
    tags.push(`<meta property="article:published_time" content="${isoDate(page.post.date)}" />`);
    tags.push(`<meta property="article:modified_time" content="${isoDate(page.post.updated)}" />`);
  }
  for (const [name, value] of VERIFY) tags.push(`<meta name="${name}" content="${esc(value)}" />`);
  const ld = JSON.stringify(buildLd(routePath, page)).replace(/</g, "\\u003c");
  tags.push(`<script type="application/ld+json" id="ld-route">${ld}</script>`);
  return addToHead(html, tags);
};

let written = 0;
for (const [routePath, page] of Object.entries(PAGES)) {
  const file = path.join(dist, routePath === "/" ? "index.html" : `${routePath.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, withMarkup(shellFor(routePath, page), await render(routePath), routePath));
  written += 1;
}

// Unknown URLs: Vercel answers with dist/404.html and a real 404 status. The app boots on it and shows
// the designed not-found page; crawlers that do not run JavaScript get the same noindex metadata.
{
  let html = base.replace(/<title>[^<]*<\/title>/, `<title>${esc(NOT_FOUND.title)}</title>`);
  html = setMeta(html, "name", "description", NOT_FOUND.description);
  html = setMeta(html, "name", "robots", "noindex, nofollow");
  html = setMeta(html, "property", "og:title", NOT_FOUND.title);
  html = setMeta(html, "property", "og:description", NOT_FOUND.description);
  html = setMeta(html, "name", "twitter:title", NOT_FOUND.title);
  html = setMeta(html, "name", "twitter:description", NOT_FOUND.description);
  html = html.replace(/\s*<link rel="canonical"[^>]*>/, "").replace(/\s*<meta property="og:url"[^>]*>/, "");
  fs.writeFileSync(path.join(dist, "404.html"), withMarkup(dropHeroPreload(html), await render("/404"), "/404"));
}

// Sitemap: every page with the date its content last changed, and the pictures it shows.
const urls = Object.entries(PAGES).map(([p, page]) => {
  const images = (IMAGES[p] || []).map((src) => `<image:image><image:loc>${SITE_URL}${src}</image:loc></image:image>`).join("");
  return `  <url><loc>${SITE_URL}${p}</loc><lastmod>${page.updated}</lastmod><priority>${page.priority}</priority>${images}</url>`;
});
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join("\n")}\n</urlset>\n`
);

// RSS feed of the blog, newest first.
const byDate = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
const rssDate = (day) => new Date(isoDate(day)).toUTCString();
const items = byDate.map((p) => [
  "    <item>",
  `      <title>${xml(p.title)}</title>`,
  `      <link>${SITE_URL}${postPath(p.slug)}</link>`,
  `      <guid isPermaLink="true">${SITE_URL}${postPath(p.slug)}</guid>`,
  `      <pubDate>${rssDate(p.date)}</pubDate>`,
  `      <description>${xml(p.description)}</description>`,
  "    </item>",
].join("\n"));
fs.writeFileSync(
  path.join(dist, "rss.xml"),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Project Premier Blog</title>",
    `    <link>${SITE_URL}/blog</link>`,
    `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    `    <description>${xml(PAGES["/blog"].description)}</description>`,
    "    <language>en-ca</language>",
    `    <lastBuildDate>${rssDate(byDate.reduce((d, p) => (p.updated > d ? p.updated : d), byDate[0].updated))}</lastBuildDate>`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n")
);

// llms.txt: the hand-written summary in public/, with the blog's guides listed from the same source.
{
  const file = path.join(dist, "llms.txt");
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes("{{BLOG}}")) throw new Error("postbuild: {{BLOG}} placeholder not found in llms.txt");
  const list = POSTS.map((p) => `- [${p.title}](${SITE_URL}${postPath(p.slug)}): ${p.description}`).join("\n");
  fs.writeFileSync(file, text.replace("{{BLOG}}", list));
}

console.log(
  `postbuild: ${written} pre-rendered pages + 404.html, sitemap.xml (${urls.length} urls), rss.xml (${POSTS.length} posts), llms.txt` +
    (VERIFY.length ? `, verification: ${VERIFY.map(([n]) => n).join(", ")}` : "")
);
