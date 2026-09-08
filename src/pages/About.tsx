import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TextEffect } from "@/components/TextEffect";

interface PillarCardProps {
  title: string;
  description: string;
  index: number;
  isVisible: boolean;
}

const PillarCard = ({ title, description, index, isVisible }: PillarCardProps) => (
  <div
    className={`group p-8 md:p-10 border border-premier-black/15 rounded-2xl bg-premier-white transition-all duration-500 hover:border-premier-black hover:-translate-y-1 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <span className="text-xs uppercase tracking-widest text-premier-gray-600 block mb-6">Pillar 0{index + 1}</span>
    <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tighter mb-4 leading-tight">{title}</h3>
    <p className="text-premier-gray-600 leading-relaxed">{description}</p>
  </div>
);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const pillars = [
    {
      title: "Growth",
      description:
        "We focus on personal and professional development, providing resources and mentorship to help our youth grow their skills and confidence.",
    },
    {
      title: "Reform",
      description:
        "We believe in second chances and creating pathways for youth to transform their lives through education and creative expression.",
    },
    {
      title: "Connectivity",
      description:
        "We build bridges between youth and industry professionals, creating networks that support long-term success and collaboration.",
    },
  ];

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -5% 0px",
      }
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
                — Our Story
              </span>
            </div>
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
              <TextEffect
                as="h1"
                immediate
                className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
                highlightClassName="bg-premier-black text-premier-white px-3 py-1"
                segments={[
                  { text: "Built for the " },
                  { text: "next generation", highlight: true },
                  { text: " of creators." },
                ]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
                A community-driven movement transforming the lives of marginalized youth across the Greater Toronto Area
                through music, creativity, and business.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-premier-black text-premier-white py-24 md:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12">
              <span className="inline-block border border-premier-white/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-white/80">
                — About Project Premier
              </span>
            </div>
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7">
                <TextEffect
                  className="font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl mb-10"
                  highlightClassName="bg-premier-white text-premier-black px-3 py-1"
                  segments={[{ text: "About " }, { text: "Us", highlight: true }]}
                />
                <p className="text-lg md:text-xl text-premier-white/80 leading-relaxed mb-6 max-w-2xl">
                  At Project Premier, we are committed to transforming the lives of marginalized youth across the Greater
                  Toronto Area (GTA) by providing them with the tools, mentorship, and opportunities they need to
                  succeed. Through the power of music, creativity, and business education, we equip young individuals
                  with essential skills, real-world experience, and a supportive community that fosters growth.
                </p>
                <p className="text-lg md:text-xl text-premier-white/80 leading-relaxed mb-10 max-w-2xl">
                  Our vision is rooted in three core pillars: Growth, Reform, and Connectivity. We strive to elevate
                  young creatives, giving them the tools to succeed both locally and internationally.
                </p>
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 bg-premier-white text-premier-black rounded-full px-7 py-3.5 text-base font-medium transition-all duration-300 hover:bg-premier-gray-200 hover:scale-105"
                >
                  Join a Program
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="lg:col-span-5 overflow-hidden rounded-2xl">
                <img
                  src="/lovable-uploads/73b6ed2c-95da-4197-b8d2-ebefa8ca07ab.png"
                  alt="Project Premier Community"
                  className="w-full h-[360px] sm:h-[440px] md:h-[520px] lg:h-[560px] xl:h-[620px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section ref={sectionRef} className="bg-premier-gray-100 py-24 md:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div
              className={`mb-12 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
                — What We Stand For
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
                segments={[{ text: "Our " }, { text: "Community", highlight: true }]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
                Three pillars guide every program, mentorship and opportunity we create for youth across the GTA.
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
                Explore Our Programs
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
