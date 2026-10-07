import { useEffect, useRef, useState } from "react";

type Props = { id: string; title: string };

/** The privacy-enhanced player: YouTube sets no cookies until the visitor plays the film. */
const YT = "https://www.youtube-nocookie.com";

/**
 * A YouTube film. With smooth scrolling and a mouse, a cross-origin iframe swallows the wheel whenever
 * the cursor crosses it, and the page lurches between smooth and native scrolling. A clear shield keeps
 * the wheel on the page; the first click on the film lifts it for good and starts playback through the
 * player API, so one click still plays. Touch screens and reduced motion scroll natively and get the
 * plain embed.
 */
export const VideoEmbed = ({ id, title }: Props) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const loaded = useRef(false);
  const [shield, setShield] = useState(false);

  useEffect(() => {
    const smooth = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
    setShield(smooth);
  }, []);

  const command = (func: string) =>
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), YT);

  const play = () => {
    setShield(false);
    frame.current?.focus();
    // The player may still be starting: ask a few times, playVideo is idempotent.
    const ask = () => [0, 300, 900, 1800].forEach((t) => window.setTimeout(() => command("playVideo"), t));
    if (loaded.current) ask();
    else frame.current?.addEventListener("load", ask, { once: true });
  };

  return (
    <div className="relative aspect-video w-full">
      <iframe
        ref={frame}
        onLoad={() => (loaded.current = true)}
        className="absolute inset-0 h-full w-full"
        src={`${YT}/embed/${id}?enablejsapi=1`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      {shield && (
        <button type="button" aria-label={`Play ${title}`} onClick={play} className="absolute inset-0 z-10 cursor-pointer" />
      )}
    </div>
  );
};
