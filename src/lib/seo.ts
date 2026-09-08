import { useEffect } from "react";
import routes from "@/seo/routes.json";
import { buildLd, pageTitle, SITE_URL } from "@/seo/ld";

type Route = { name: string; title: string; description: string; type: string; priority: string };
const ROUTES = routes as Record<string, Route>;

const NOT_FOUND: Route = {
  name: "Page not found",
  title: "Page not found",
  description: "The page you were looking for does not exist.",
  type: "WebPage",
  priority: "0",
};

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Per-route document metadata and structured data, kept in step with the static shells that
 * scripts/postbuild.mjs writes from the same routes.json and JSON-LD builder.
 * Unknown paths (the 404 page) are marked noindex.
 */
export const useSeo = (path: string) => {
  useEffect(() => {
    const known = Object.prototype.hasOwnProperty.call(ROUTES, path);
    const route = known ? ROUTES[path] : NOT_FOUND;
    const title = pageTitle(route);
    const url = `${SITE_URL}${path}`;

    document.title = title;
    upsertMeta("name", "description", route.description);
    upsertMeta("name", "robots", known ? "index, follow, max-image-preview:large" : "noindex, nofollow");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", route.description);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", route.description);
    upsertLink("canonical", url);

    let ld = document.getElementById("ld-route") as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "ld-route";
      document.head.appendChild(ld);
    }
    ld.textContent = known ? JSON.stringify(buildLd(path, route)) : "";
  }, [path]);
};
