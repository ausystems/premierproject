import { Route, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SmoothScroll } from "@/lib/SmoothScroll";
import { PageTransition } from "@/components/layout/PageTransition";
import { Nav } from "@/components/layout/Nav";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";
import Referral from "./pages/Referral";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1, networkMode: "always", refetchOnWindowFocus: false },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SmoothScroll>
        <Nav />
        <PageTransition>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="*" element={<NotFound />} />
        </PageTransition>
        <Toaster />
        <Sonner />
      </SmoothScroll>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
