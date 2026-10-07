import { useEffect } from "react";
import { PAGES, isKnownPath, type Page } from "@/seo/pages";
import { buildLd, isoDate, NOT_FOUND, shareImageFor, SITE_URL } from "@/seo/ld";

/** Indexable pages: allow large image previews and full snippets in search results and AI answers. */
export const ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const removeMeta = (attr: "name" | "property", key: string) =>
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();

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
 * Per-page document metadata and structured data, kept in step with the pre-rendered pages that
 * scripts/postbuild.mjs writes from the same page registry and JSON-LD builder.
 * Unknown paths (the 404 page) are marked noindex and carry no canonical URL.
 */
export const useSeo = (path: string) => {
  useEffect(() => {
    const known = isKnownPath(path);
    const page: Page = known ? PAGES[path] : NOT_FOUND;
    const url = `${SITE_URL}${path}`;

    document.title = page.title;
    upsertMeta("name", "description", page.description);
    upsertMeta("name", "robots", known ? ROBOTS : "noindex, nofollow");
    upsertMeta("property", "og:title", page.title);
    upsertMeta("property", "og:description", page.description);
    upsertMeta("property", "og:type", page.post ? "article" : "website");
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    const image = shareImageFor(page);
    upsertMeta("property", "og:image", image.url);
    upsertMeta("property", "og:image:alt", image.alt);
    upsertMeta("name", "twitter:image", image.url);
    upsertMeta("name", "twitter:image:alt", image.alt);
    if (page.post) {
      upsertMeta("property", "article:published_time", isoDate(page.post.date));
      upsertMeta("property", "article:modified_time", isoDate(page.post.updated));
    } else {
      removeMeta("property", "article:published_time");
      removeMeta("property", "article:modified_time");
    }
    if (known) {
      upsertMeta("property", "og:url", url);
      upsertLink("canonical", url);
    } else {
      removeMeta("property", "og:url");
      document.head.querySelector('link[rel="canonical"]')?.remove();
    }

    let ld = document.getElementById("ld-route") as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "ld-route";
      document.head.appendChild(ld);
    }
    ld.textContent = known ? JSON.stringify(buildLd(path, page)) : "";
  }, [path]);
};
