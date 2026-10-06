// Post-build: one HTML shell per route (correct title, description, canonical, Open Graph and JSON-LD
// for crawlers that do not run JavaScript) plus a sitemap with today's lastmod.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildLd, NOT_FOUND, pageTitle, SITE_URL } from "../src/seo/ld.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, "..", "dist");
const routes = JSON.parse(fs.readFileSync(path.resolve(here, "..", "src", "seo", "routes.json"), "utf8"));
const base = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const setMeta = (html, attr, key, value) =>
  html.replace(new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`), `$1${esc(value)}$2`);

const shellFor = (routePath, route) => {
  const url = `${SITE_URL}${routePath}`;
  const title = pageTitle(route);
  let html = base.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setMeta(html, "name", "description", route.description);
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", route.description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "name", "twitter:description", route.description);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  // Only Home shows the hero poster; elsewhere preloading it would spend bandwidth on nothing.
  if (routePath !== "/") html = html.replace(/\s*<link rel="preload" href="\/hero-poster\.jpg"[^>]*>/, "");
  const ld = JSON.stringify(buildLd(routePath, route)).replace(/</g, "\\u003c");
  return html.replace("</head>", `    <script type="application/ld+json" id="ld-route">${ld}</script>\n  </head>`);
};

let written = 0;
for (const [routePath, route] of Object.entries(routes)) {
  const file = routePath === "/" ? "index.html" : `${routePath.slice(1)}.html`;
  fs.writeFileSync(path.join(dist, file), shellFor(routePath, route));
  written += 1;
}

// Unknown URLs: Vercel answers with dist/404.html and a real 404 status. The app boots on it and shows
// the designed not-found page; crawlers that do not run JavaScript get the same noindex metadata.
{
  const title = pageTitle(NOT_FOUND);
  let html = base.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = setMeta(html, "name", "description", NOT_FOUND.description);
  html = setMeta(html, "name", "robots", "noindex, nofollow");
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", NOT_FOUND.description);
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "name", "twitter:description", NOT_FOUND.description);
  html = html.replace(/\s*<link rel="canonical"[^>]*>/, "").replace(/\s*<meta property="og:url"[^>]*>/, "");
  html = html.replace(/\s*<link rel="preload" href="\/hero-poster\.jpg"[^>]*>/, "");
  fs.writeFileSync(path.join(dist, "404.html"), html);
}

const today = new Date().toISOString().slice(0, 10);
const urls = Object.entries(routes)
  .map(([p, r]) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${r.priority}</priority></url>`)
  .join("\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

console.log(`postbuild: ${written} route shells + 404.html, sitemap.xml with ${Object.keys(routes).length} urls (lastmod ${today})`);
