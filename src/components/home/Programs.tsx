import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { TextEffect } from "@/components/TextEffect";

interface ProgramCardProps {
  title: string;
  description: string;
  index: number;
  isVisible: boolean;
}

const ProgramCard = ({
  title,
  description,
  index,
  isVisible,
}: ProgramCardProps) => (
  <div
    className={`group bg-premier-white border border-premier-black/10 rounded-2xl p-8 transition-all duration-500 hover:border-premier-black hover:-translate-y-1 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <div className="flex items-start justify-between mb-6">
      <span className="text-xs uppercase tracking-widest text-premier-gray-600">
        0{index + 1}
      </span>
      <ArrowUpRight className="w-5 h-5 text-premier-black/40 transition-all duration-300 group-hover:text-premier-black group-hover:-translate-y-1 group-hover:translate-x-1" />
    </div>
    <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tighter mb-4 leading-tight">
      {title}
    </h3>
    <p className="text-premier-gray-600 leading-relaxed">{description}</p>
  </div>
);

const Programs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const programs = [
    {
      title: "Music",
      description:
        "Explore the power of music as a tool for expression and personal growth. Learn songwriting, production, and performance techniques.",
    },
    {
      title: "Recording Arts",
      description:
        "Hands-on experience in professional studios with top producers and engineers.",
    },
    {
      title: "Life Skills",
      description:
        "Build essential skills in communication, time management, and financial literacy to navigate life successfully.",
    },
    {
      title: "Business Development",
      description:
        "Gain knowledge in entrepreneurship, branding, marketing, and financial management to build a sustainable career.",
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
      id="programs"
      ref={sectionRef}
      className="section bg-premier-gray-100 py-24 md:py-32"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div
          className={`mb-12 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
            — What We Offer
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
            segments={[{ text: "Our " }, { text: "Programs", highlight: true }]}
          />
          <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
            Four pillars built to develop the next generation of creators,
            professionals, and leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {programs.map((program, index) => (
            <ProgramCard
              key={program.title}
              title={program.title}
              description={program.description}
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
            More About Our Programs
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Programs;
