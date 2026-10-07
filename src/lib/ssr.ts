/**
 * Every page is pre-rendered to HTML at build time (scripts/postbuild.mjs), so search engines, AI
 * crawlers and readers on slow connections get the full page before any JavaScript runs; the app then
 * takes over the same markup. On that first, server-rendered page the entrances that play on load run
 * in CSS from the very first frame (see index.css), and their JavaScript versions stand aside. Once the
 * reader moves to another page, everything is client-rendered and the JavaScript entrances take over.
 */
export const isServerFirstPaint = (): boolean =>
  typeof document !== "undefined" && document.documentElement.classList.contains("ssr");

export const endServerFirstPaint = (): void => {
  if (typeof document !== "undefined") document.documentElement.classList.remove("ssr");
};
