import { memo, useEffect, useRef, useState } from "react";
import { TextEffect } from "@/components/TextEffect";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const VideoSectionComponent = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const videoWrapperClassName = `max-w-5xl mx-auto transition-all duration-700 delay-200 ${
    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
  }`;

  return (
    <section
      id="video-section"
      ref={sectionRef}
      className="section bg-premier-black text-premier-white py-24 md:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div
          className={`mb-12 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block border border-premier-white/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-white/80">
            — Watch The Story
          </span>
        </div>

        <div
          className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 transition-all duration-500 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <TextEffect
            className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-white"
            highlightClassName="bg-premier-white text-premier-black px-3 py-1"
            segments={[
              { text: "Discover How We " },
              { text: "Empower", highlight: true },
              { text: " Youth" },
            ]}
          />
          <p className="lg:col-span-4 text-base md:text-lg text-premier-white/70 leading-relaxed">
            See the program in action — real students, real mentorship, and the
            moments that change trajectories.
          </p>
        </div>

        <div className={videoWrapperClassName}>
          <AspectRatio
            ratio={16 / 9}
            className="rounded-2xl overflow-hidden border-2 border-white shadow-[0_20px_50px_-15px_rgba(255,255,255,0.25)]"
          >
            <iframe
              className="w-full h-full absolute inset-0"
              src="https://www.youtube.com/embed/2z-Ztm9UHr4"
              title="Project Premier Video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </AspectRatio>
        </div>
      </div>
    </section>
  );
};

const VideoSection = memo(VideoSectionComponent);

export default VideoSection;
