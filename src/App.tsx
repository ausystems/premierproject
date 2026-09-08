import { lazy } from "react";
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
const Referral = lazy(() => import("./pages/Referral"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
      <Toaster />
      <Sonner />
    </SmoothScroll>
  </BrowserRouter>
);

export default App;
