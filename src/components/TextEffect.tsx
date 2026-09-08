import React, { useEffect, useRef, useState } from "react";
import { type Variants } from "framer-motion";

import { TextEffect as TextEffectPrimitive } from "@/components/ui/text-effect";
import { cn } from "@/lib/utils";

const WORD_STAGGER = 0.022;
const WORD_DURATION = 0.28;

const wordVariants: { container: Variants; item: Variants } = {
  container: {
    hidden: {
      opacity: 1,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: WORD_STAGGER,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: WORD_DURATION,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
};

export type TextSegment = {
  text: string;
  highlight?: boolean;
};

export type TextEffectProps = {
  segments: TextSegment[];
  className?: string;
  highlightClassName?: string;
  immediate?: boolean;
  as?: keyof JSX.IntrinsicElements;
};

export function TextEffect({
  segments,
  className,
  highlightClassName,
  immediate = false,
  as = "h2",
}: TextEffectProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(immediate);
  const [highlightedSegments, setHighlightedSegments] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    if (immediate) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [immediate]);

  const Tag = as as React.ElementType;

  const segmentDelays: number[] = [];
  let wordCount = 0;
  for (const segment of segments) {
    segmentDelays.push(wordCount * WORD_STAGGER);
    wordCount += segment.text.split(/(\s+)/).length;
  }

  useEffect(() => {
    if (!isVisible) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    segments.forEach((segment, index) => {
      if (!segment.highlight) return;

      const delay = segmentDelays[index] * 1000;

      timers.push(
        setTimeout(() => {
          setHighlightedSegments((previous) =>
            previous[index] ? previous : { ...previous, [index]: true },
          );
        }, delay),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  return (
    <Tag
      ref={containerRef}
      className={className}
      aria-label={segments.map((segment) => segment.text).join("")}
    >
      {segments.map((segment, index) => {
        const delay = segmentDelays[index];

        return segment.highlight ? (
          <span
            key={index}
            className={cn(
              "inline-block transition-colors duration-200 ease-out",
              highlightedSegments[index] && highlightClassName,
            )}
          >
            <TextEffectPrimitive
              as="span"
              per="word"
              variants={wordVariants}
              trigger={isVisible}
              delay={delay}
              className="inline-block"
            >
              {segment.text}
            </TextEffectPrimitive>
          </span>
        ) : (
          <TextEffectPrimitive
            key={index}
            as="span"
            per="word"
            variants={wordVariants}
            trigger={isVisible}
            delay={delay}
            className="inline"
          >
            {segment.text}
          </TextEffectPrimitive>
        );
      })}
    </Tag>
  );
}

export default TextEffect;
