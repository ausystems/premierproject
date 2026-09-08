import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TextEffect } from "@/components/TextEffect";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface Program {
  number: string;
  title: string;
  description: string;
}

const programs: Program[] = [
  {
    number: "01",
    title: "Music",
    description:
      "Explore the power of music as a tool for expression and personal growth. Learn songwriting, production, and performance techniques.",
  },
  {
    number: "02",
    title: "Recording Arts",
    description:
      "Hands-on experience in professional studios with top producers and engineers.",
  },
  {
    number: "03",
    title: "Life Skills",
    description:
      "Build essential skills in communication, time management, and financial literacy to navigate life successfully.",
  },
  {
    number: "04",
    title: "Business Development",
    description:
      "Gain knowledge in entrepreneurship, branding, marketing, and financial management to build a sustainable career.",
  },
];

interface ProgramCardProps {
  program: Program;
  index: number;
  isVisible: boolean;
}

const ProgramCard = ({ program, index, isVisible }: ProgramCardProps) => {
  const { number, title, description } = program;

  return (
    <div
      className={cn(
        "group relative rounded-2xl bg-premier-white text-premier-black p-6 sm:p-8 lg:p-10",
        "flex flex-col h-full",
        "transition-all duration-700 ease-out",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-6 sm:mb-8 lg:mb-10">
        <span className="text-xs sm:text-sm tracking-wide text-premier-black/50">
          {number}
        </span>
        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-premier-black/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter leading-[1.05] mb-4 sm:mb-6 text-premier-black">
        {title}
      </h3>
      <p className="text-sm sm:text-base lg:text-lg text-premier-black/70 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const Programs = () => {
  const programsSectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = programsSectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-premier-white text-premier-black pt-32 md:pt-40 pb-20 md:pb-28">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-10">
              <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
                — Our Programs
              </span>
            </div>
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
              <TextEffect
                as="h1"
                immediate
                className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
                highlightClassName="bg-premier-black text-premier-white px-3 py-1"
                segments={[
                  { text: "Hands-on programs that " },
                  { text: "shape careers.", highlight: true },
                ]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
                We provide immersive programs designed to inspire, educate, and
                empower youth through music, recording arts, and life skills —
                turning passion into a sustainable career.
              </p>
            </div>
          </div>
        </section>

        <section
          ref={programsSectionRef}
          className="bg-premier-black text-premier-white py-24 md:py-32"
        >
          <div className="container mx-auto px-6 lg:px-12">
            <div
              className={cn(
                "mb-12 transition-all duration-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <span className="inline-block border border-premier-white/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-white/80">
                — Our Programs
              </span>
            </div>
            <div
              className={cn(
                "grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 transition-all duration-500 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <TextEffect
                className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl"
                highlightClassName="bg-premier-white text-premier-black px-3 py-1"
                segments={[
                  { text: "What we " },
                  { text: "teach", highlight: true },
                ]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-white/80 leading-relaxed">
                Four focused programs built to develop the next generation of
                creators, professionals, and leaders.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {programs.map((program, index) => (
                <ProgramCard
                  key={program.title}
                  program={program}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
            <div
              className={cn(
                "mt-16 transition-all duration-300 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-premier-white text-premier-black rounded-full px-7 py-3.5 text-base font-medium transition-all duration-300 hover:bg-premier-gray-200 hover:scale-105"
              >
                Get In Touch
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-premier-white text-premier-black py-24 md:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12">
              <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
                — Celebrate With Us
              </span>
            </div>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16">
              <TextEffect
                className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
                highlightClassName="bg-premier-black text-premier-white px-3 py-1"
                segments={[
                  { text: "Project Premier " },
                  { text: "End of Year", highlight: true },
                  { text: " Celebration" },
                ]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
                A night honoring the growth, talent, and dedication of our youth.
                Watch the highlights from our annual celebration.
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <AspectRatio
                ratio={16 / 9}
                className="rounded-2xl overflow-hidden border-2 border-premier-black/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]"
              >
                <iframe
                  className="w-full h-full absolute inset-0"
                  src="https://www.youtube.com/embed/xUKiKbnl62c"
                  title="Premier Project End of Year Celebration"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </AspectRatio>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
