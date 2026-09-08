import { lazy, useEffect } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SmoothScroll } from "@/lib/SmoothScroll";
import { PageTransition } from "@/components/layout/PageTransition";
import { Nav } from "@/components/layout/Nav";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";

// Secondary pages load on demand; the transition curtain covers the fetch.
const loadReferral = () => import("./pages/Referral");
const loadPrivacy = () => import("./pages/Privacy");
const loadTerms = () => import("./pages/Terms");
const loadNotFound = () => import("./pages/NotFound");
const Referral = lazy(loadReferral);
const Privacy = lazy(loadPrivacy);
const Terms = lazy(loadTerms);
const NotFound = lazy(loadNotFound);

/** Warm the lazy chunks once the first page is idle, so later transitions never wait on the network. */
const Prefetch = () => {
  useEffect(() => {
    const warm = () => { void loadReferral(); void loadPrivacy(); void loadTerms(); void loadNotFound(); };
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(warm, { timeout: 4000 });
    else window.setTimeout(warm, 2500);
  }, []);
  return null;
};

const App = () => (
  <BrowserRouter>
    <SmoothScroll>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-ui focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <PageTransition>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </PageTransition>
      <Prefetch />
      <Toaster />
      <Sonner />
    </SmoothScroll>
  </BrowserRouter>
);

export default App;
