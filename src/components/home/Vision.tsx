import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { TextEffect } from "@/components/TextEffect";

interface PillarCardProps {
  title: string;
  description: string;
  index: number;
  isVisible: boolean;
}

const PillarCard = ({
  title,
  description,
  index,
  isVisible,
}: PillarCardProps) => (
  <div
    className={`group p-8 md:p-10 border border-premier-black/15 rounded-2xl bg-premier-white transition-all duration-500 hover:border-premier-black hover:-translate-y-1 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <span className="text-xs uppercase tracking-widest text-premier-gray-600 block mb-6">
      Pillar 0{index + 1}
    </span>
    <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tighter mb-4 leading-tight">
      {title}
    </h3>
    <p className="text-premier-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Vision = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const pillars = [
    {
      title: "Growth",
      description: "Elevate young creatives domestically & internationally.",
    },
    {
      title: "Reform",
      description:
        "Change the perspective of culture of underserved communities and youth incarcerated.",
    },
    {
      title: "Connectivity",
      description:
        "Become interconnected with local communities and opportunities.",
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
      id="vision"
      ref={sectionRef}
      className="section bg-premier-white py-24 md:py-32"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div
          className={`mb-12 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
            — Where We're Headed
          </span>
        </div>

        <div
          className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 transition-all duration-500 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <TextEffect
            className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
            highlightClassName="bg-premier-black text-premier-white px-3 py-1"
            segments={[{ text: "Our " }, { text: "Vision", highlight: true }]}
          />
          <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
            Rooted in three pillars — Growth, Reform, and Connectivity — we
            elevate young creatives locally and internationally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {pillars.map((pillar, index) => (
            <PillarCard
              key={pillar.title}
              title={pillar.title}
              description={pillar.description}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        <div
          className={`mt-16 transition-all duration-300 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 bg-premier-black text-premier-white rounded-full px-7 py-3.5 text-base font-medium transition-all duration-300 hover:bg-premier-gray-800 hover:scale-105"
          >
            View Our Programs
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Vision;
