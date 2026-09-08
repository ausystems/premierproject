import { lazy, Suspense, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import Partners from "@/components/home/Partners";
import Footer from "@/components/Footer";
import ImagePreloader from "@/components/ImagePreloader";
import ErrorBoundary from "@/components/ErrorBoundary";

const About = lazy(() => {
  const prefetch = () => import("@/components/home/About");
  if (window.requestIdleCallback) {
    window.requestIdleCallback(prefetch);
  } else {
    setTimeout(prefetch, 200);
  }
  return import("@/components/home/About");
});
const Programs = lazy(() => import("@/components/home/Programs"));
const VideoSection = lazy(() => import("@/components/home/VideoSection"));
const Vision = lazy(() => import("@/components/home/Vision"));
const Testimonials = lazy(() => import("@/components/home/Testimonials"));
const Contact = lazy(() => import("@/components/home/Contact"));

const SectionLoader = () => (
  <div className="flex justify-center items-center py-16" role="status" aria-label="Loading content">
    <div className="w-8 h-8 border-4 border-premier-gray-300 border-t-premier-black rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const preloadImages = [
    "/lovable-uploads/73b6ed2c-95da-4197-b8d2-ebefa8ca07ab.png",
    "/lovable-uploads/bf12ca95-bba5-4d99-9c4e-87ec4f7d2807.png",
    "/lovable-uploads/813a40c2-fe91-493f-af82-e4b89a94c7e1.png",
  ];

  useEffect(() => {
    const handleAnchorClick = (event: Event) => {
      event.preventDefault();
      const href = (event.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: (target as HTMLElement).offsetTop,
          behavior: "smooth",
        });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick, { passive: false });
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick);
      });
    };
  }, []);

  useEffect(() => {
    const prefetchSections = () => {
      import("@/components/home/Programs");
      import("@/components/home/VideoSection");
      import("@/components/home/Vision");
      import("@/components/home/Testimonials");
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => prefetchSections(), { timeout: 1500 });
    } else {
      setTimeout(prefetchSections, 800);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <ImagePreloader images={preloadImages} />
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Partners />
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <About />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <Programs />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <VideoSection />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <Vision />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <Testimonials />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary>
            <Suspense fallback={<SectionLoader />}>
              <Contact />
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
