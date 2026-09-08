import { useEffect, useRef, useState } from "react";
import { TextEffect } from "@/components/TextEffect";

interface TestimonialCardProps {
  quote: string;
  author: string;
  index: number;
  isVisible: boolean;
}

const TestimonialCard = ({
  quote,
  author,
  index,
  isVisible,
}: TestimonialCardProps) => (
  <div
    className={`group bg-premier-white/5 border border-premier-white/15 rounded-2xl p-8 md:p-10 transition-all duration-500 hover:border-premier-white/60 hover:-translate-y-1 flex flex-col ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <div className="font-display text-7xl leading-none text-premier-white/25 mb-2">
      {'"'}
    </div>
    <p className="text-premier-white/80 leading-relaxed mb-8 flex-1">{quote}</p>
    <div className="flex items-center justify-between pt-6 border-t border-premier-white/15">
      <span className="font-display text-xl font-bold tracking-tight text-premier-white">
        {author}
      </span>
      <span className="text-xs uppercase tracking-widest text-premier-white/60">
        Youth Voice
      </span>
    </div>
  </div>
);

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      quote:
        "Project Premier changed my life. I went from feeling lost to having a real plan for my future. Now, I'm in the studio, learning from real professionals and building a career in music. I finally feel like I have a purpose. This program gave me a second chance that no one else would!",
      author: "Isaiah",
    },
    {
      quote:
        "Before Project Premier, my past made breaking into the music industry feel impossible. This program gave me the education, guidance, and hands-on experience I needed. With studio time and industry opportunities, I now have a real chance at success.",
      author: "Markell",
    },
    {
      quote:
        "This program taught me the importance of owning my music rights and understanding copyright. I also learned how to manage my music and release the right content to grow. Being surrounded by other artists gave me a strong sense of collaboration. This experience helped me gain both knowledge and confidence in my career.",
      author: "Josh",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section bg-premier-black text-premier-white py-24 md:py-32"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div
          className={`mb-12 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block border border-premier-white/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-white/80">
            — Voices Of The Program
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
              { text: "What Our " },
              { text: "Youth", highlight: true },
              { text: " Say" },
            ]}
          />
          <p className="lg:col-span-4 text-base md:text-lg text-premier-white/70 leading-relaxed">
            Real stories from the young creators building their future with
            Project Premier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
