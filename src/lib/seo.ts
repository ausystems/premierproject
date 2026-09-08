import { useEffect } from "react";

export const SITE_URL = "https://premierproject.vercel.app";
export const SITE_NAME = "Project Premier";
const HOME_TITLE = "Project Premier - Empowering Youth, Changing the Future";

type Seo = {
  /** Page title without the site name; the home page keeps its full brand title. */
  title?: string;
  description: string;
  /** Route path, e.g. "/about". */
  path: string;
  noindex?: boolean;
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

/** Per-route document metadata: title, description, canonical, Open Graph and Twitter fields. */
export const useSeo = ({ title, description, path, noindex = false }: Seo) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : HOME_TITLE;
    const url = `${SITE_URL}${path}`;
    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertLink("canonical", url);
  }, [title, description, path, noindex]);
};
