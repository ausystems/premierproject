import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui-kit/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StringLine } from "@/components/strings/StringLine";
import { gsap } from "@/lib/gsap";
import type { StringHandle } from "@/lib/strings";
import { cn } from "@/lib/utils";
const heroPoster = "/hero-poster.jpg";
import heroVideo1080 from "@/assets/hero-video-1080.mp4";
import heroVideo720 from "@/assets/hero-video-720.mp4";

/** Where the exit plays: motion welcome, and a screen tall enough to hold the copy while pinned. */
const EXIT_QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 620px)";
/** Scroll progress at which the closed film becomes a string and is struck. */
const STRIKE = 0.66;

/**
 * Background video (unchanged in substance)
 * - The poster is frame 0 of the clip, so the hand-off from image to video is invisible.
 * - The rendition is chosen once on mount. Both are 16:9, so a later resize or an
 *   orientation change can never alter the framing and the source is never swapped.
 * - Playback is suspended whenever the hero scrolls out of view or the tab is hidden.
 * - Honours prefers-reduced-motion: those visitors keep the still poster.
 * The copy layer is one statement and one ask, bottom-left.
 *
 * Exit: the film holds still for a short runway and closes like a letterbox into a single line of
 * light the width of the page, while the copy keeps travelling up at the speed of the reader's hand,
 * so the page never feels stopped. The line is struck as it forms, then the house lights come up
 * slowly: the ink turns to paper and the string to ink, ringing as it glides down onto the page, which
 * carries straight on into the statement. It is the first string of the site.
 */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stringRef = useRef<StringHandle | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(true);
  const closedRef = useRef(false);

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
    if (inViewRef.current && !closedRef.current && !document.hidden) {
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

  // The exit: scrubbed by the runway, so it plays forwards and backwards with the reader's hand.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const media = mediaRef.current;
    const lens = lensRef.current;
    const copy = copyRef.current;
    const line = lineRef.current;
    if (!section || !stage || !media || !lens || !copy || !line) return;

    const mm = gsap.matchMedia();
    mm.add(EXIT_QUERY, () => {
      const gutter = () => parseFloat(getComputedStyle(copy).paddingLeft) || 16;
      const band = () => Math.max(stage.clientHeight / 2 - 1, 0);
      const runway = () => Math.max(section.offsetHeight - stage.clientHeight, 1);
      let last = 0;

      gsap.set(media, { clipPath: "inset(0px 0px 0px 0px)" });
      gsap.set(line, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const v = Math.abs(self.getVelocity());
            if (last < STRIKE && p >= STRIKE) stringRef.current?.pluck(0.36 + Math.random() * 0.28, gsap.utils.clamp(18, 32, v * 0.02), 1);
            else if (last >= STRIKE && p < STRIKE) stringRef.current?.pluck(0.36 + Math.random() * 0.28, gsap.utils.clamp(10, 20, v * 0.012), -1);
            stringRef.current?.setInteractive(p >= STRIKE);
            const closed = p > 0.72;
            if (closed !== closedRef.current) {
              closedRef.current = closed;
              syncPlayback();
            }
            last = p;
          },
        },
      });

      // the copy moves exactly as far as the page would have, so the hand never feels the hold
      tl.to(copy, { y: () => -runway(), duration: 1 }, 0)
        .to(copy, { autoAlpha: 0, ease: "power1.in", duration: 0.26 }, 0.28)
        .to(media, { clipPath: () => `inset(${band()}px ${gutter()}px ${band()}px ${gutter()}px)`, ease: "power3.inOut", duration: 0.6 }, 0.04)
        .to(lens, { scale: 1.12, ease: "power1.inOut", duration: 0.6 }, 0.04)
        .to(line, { autoAlpha: 1, duration: 0.05 }, 0.6)
        .to(media, { autoAlpha: 0, duration: 0.06 }, 0.64)
        // house lights, slowly: the stage's own palette flips, so the ringing string turns to ink on paper
        .to(stage, { "--bg": "242 242 240", "--fg": "11 11 11", ease: "sine.inOut", duration: 0.3 }, 0.68)
        // and the string glides down to rest just above the statement that follows
        .to(line, { y: () => stage.clientHeight * 0.24, ease: "power2.inOut", duration: 0.32 }, 0.68);

      return () => {
        gsap.set(stage, { clearProps: "--bg,--fg" });
        closedRef.current = false;
        stringRef.current?.setInteractive(false);
        syncPlayback();
      };
    });
    return () => mm.revert();
  }, [syncPlayback]);

  return (
    <section ref={sectionRef} data-theme="ink" className="hero-runway">
      <div ref={stageRef} className="hero-stage overflow-hidden bg-bg">
        <div ref={mediaRef} className="absolute inset-0 z-0">
          <div ref={lensRef} className="absolute inset-0">
            <img
              src={heroPoster}
              alt="Guitars on stands inside the Project Premier recording studio"
              width={1920}
              height={1080}
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
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 z-20">
          <div className="wrap">
            <div ref={lineRef} className="invisible relative">
              <StringLine bright amp={36} pitch={0.72} sustain={1.6} interactive={false} handle={stringRef} />
            </div>
          </div>
        </div>

        <div ref={copyRef} className="wrap relative z-10 flex flex-1 flex-col justify-end pb-14 pt-nav-sm md:pb-20 lg:pt-nav">
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
      </div>
    </section>
  );
};

export default Hero;
