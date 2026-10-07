import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { isKnownPath } from "./seo/pages";
import "./index.css";

// Tell the inline guard in index.html that the app has started (see the "js" class there).
(window as Window & { __pp?: boolean }).__pp = true;

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// A pre-rendered page is taken over in place when it was rendered for this URL (the 404 page stands in
// for any unknown path). Otherwise (dev server, or a host answering with another page) render afresh.
const here = window.location.pathname.replace(/\/+$/, "") || "/";
const known = isKnownPath(here);
const rendered = rootElement.dataset.route;
const matches = rendered === here || (rendered === "/404" && !known);
if (rootElement.firstElementChild && matches) hydrateRoot(rootElement, <App />);
else {
  rootElement.replaceChildren();
  createRoot(rootElement).render(<App />);
}
