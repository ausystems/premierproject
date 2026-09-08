import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
const heroPoster = "/hero-poster.jpg";
import heroVideo1080 from "@/assets/hero-video-1080.mp4";
import heroVideo720 from "@/assets/hero-video-720.mp4";

/**
 * Background video (unchanged in substance)
 * - The poster is frame 0 of the clip, so the hand-off from image to video is invisible.
 * - The rendition is chosen once on mount. Both are 16:9, so a later resize or an
 *   orientation change can never alter the framing and the source is never swapped.
 * - Playback is suspended whenever the hero scrolls out of view or the tab is hidden.
 * - Honours prefers-reduced-motion: those visitors keep the still poster.
 * The copy layer is one statement and one ask, bottom-left.
 */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(true);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
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
      ([entry]) => { inViewRef.current = entry.isIntersecting; syncPlayback(); },
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
    <section ref={sectionRef} data-theme="ink" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroPoster}
          alt="Guitars on stands inside the Project Premier recording studio"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {videoSrc && (
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out",
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
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/25 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/10 to-transparent" />
      </div>

      <div className="wrap relative z-10 flex min-h-[100svh] flex-col justify-end pb-14 pt-nav-sm md:pb-20 lg:pt-nav">
        <SplitReveal as="h1" trigger="load" delay={0.3} className="max-w-[18ch] text-display [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
          Empowering Youth Through Music, <em>Creativity</em> & Business.
        </SplitReveal>

        <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
          <Reveal trigger="load" delay={0.9} className="md:col-span-6">
            <p className="max-w-[34ch] text-body text-fg2 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:text-[1.125rem]">
              A community where young creators, mentors, and innovators come together to build skills, share stories, and shape the future of the GTA.
            </p>
            <div className="mt-8">
              <Button to="/programs" magnetic>Get Started</Button>
            </div>
          </Reveal>
          <Reveal trigger="load" delay={1.1} className="text-sm text-fg2 md:col-span-6 md:justify-self-end md:text-right">
            <span className="tnum text-fg">120+</span> young creators across the Greater Toronto Area
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
