import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, User } from "lucide-react";
import { TextEffect } from "@/components/TextEffect";
import { cn } from "@/lib/utils";
import heroPoster from "@/assets/hero-poster.jpg";
import heroVideo1080 from "@/assets/hero-video-1080.mp4";
import heroVideo720 from "@/assets/hero-video-720.mp4";

/**
 * Background video strategy
 * - The poster is frame 0 of the clip, so the hand-off from image to video is invisible.
 * - The rendition is chosen once on mount. Both are 16:9, so a later resize or an
 *   orientation change can never alter the framing and the source is never swapped.
 * - Playback is suspended whenever the hero scrolls out of view or the tab is hidden,
 *   which keeps the decoder idle for the rest of the page.
 * - Honours prefers-reduced-motion: those visitors keep the still poster.
 */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(true);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  // Latches on the first rendered frame. It must never flip back: pausing off-screen
  // would otherwise fade the poster in over a mismatched frame.
  const [hasRenderedFrame, setHasRenderedFrame] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const prefersLightRendition = window.matchMedia("(max-width: 767px)").matches;
    setVideoSrc(prefersLightRendition ? heroVideo720 : heroVideo1080);
  }, []);

  const syncPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inViewRef.current && !document.hidden) {
      const attempt = video.play();
      if (attempt) attempt.catch(() => undefined);
    } else {
      video.pause();
    }
  }, []);

  useEffect(() => {
    if (!videoSrc) return;
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.01 }
    );

    observer.observe(section);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [videoSrc, syncPlayback]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-premier-black text-premier-white overflow-hidden pt-24 md:pt-28"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={heroPoster}
          alt="Guitars on stands inside the Project Premier recording studio"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />

        {videoSrc && (
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-out",
              hasRenderedFrame ? "opacity-100" : "opacity-0"
            )}
            src={videoSrc}
            poster={heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            onLoadedData={() => setHasRenderedFrame(true)}
            onPlaying={() => setHasRenderedFrame(true)}
          />
        )}

        {/* Readability scrim: flat base, then dark at the top and bottom where the copy sits */}
        <div className="absolute inset-0 bg-premier-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-premier-black/80 via-premier-black/25 to-premier-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-premier-black/55 via-premier-black/10 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 min-h-[calc(100vh-7rem)] flex flex-col justify-between py-12">
        <div className="max-w-5xl">
          <TextEffect
            as="h1"
            immediate
            className="font-display font-bold tracking-tighter leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-8xl [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]"
            highlightClassName="bg-premier-white text-premier-black px-3 py-1 [text-shadow:none]"
            segments={[
              { text: "Empowering Youth " },
              { text: "Through Music", highlight: true },
              { text: ", Creativity & Business." },
            ]}
          />

          <div className="mt-10">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 bg-premier-white text-premier-black rounded-full px-7 py-3.5 text-base font-medium transition-all duration-300 hover:bg-premier-gray-200 hover:scale-105"
            >
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-end mt-16">
          <p className="text-base md:text-lg text-premier-white/90 max-w-md leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
            A community where young creators, mentors, and innovators come together to build skills, share stories, and shape the future of the GTA.
          </p>

          <div className="md:justify-self-end">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                <span className="w-9 h-9 rounded-full border-2 border-premier-white bg-premier-gray-200 text-premier-black flex items-center justify-center">
                  <User className="w-4 h-4" />
                </span>
                <span className="w-9 h-9 rounded-full border-2 border-premier-white bg-premier-gray-200 text-premier-black flex items-center justify-center">
                  <User className="w-4 h-4" />
                </span>
                <span className="w-9 h-9 rounded-full border-2 border-premier-white bg-premier-black text-premier-white text-xs flex items-center justify-center font-medium">
                  120+
                </span>
              </div>
            </div>

            <p className="text-xs uppercase tracking-wider text-premier-white/80 mb-1 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
              Greater Toronto Area
            </p>

            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-2xl md:text-3xl font-display font-bold tracking-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]"
            >
              Project Premier
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
