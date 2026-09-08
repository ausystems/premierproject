import { memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";
import Referral from "./pages/Referral";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      networkMode: "always",
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = memo(() => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/programs" element={<Programs />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/referral" element={<Referral />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <PageTransition>
          <AppRoutes />
        </PageTransition>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
