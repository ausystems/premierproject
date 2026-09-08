import { Link } from "react-router-dom";
import { ArrowUpRight, User } from "lucide-react";
import { TextEffect } from "@/components/TextEffect";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => (
  <section className="relative min-h-screen bg-premier-black text-premier-white overflow-hidden pt-24 md:pt-28">
    <div className="absolute inset-0 z-0">
      <img
        src={heroBg}
        alt="Project Premier youth community gathered in a creative studio"
        className="w-full h-full object-cover object-center opacity-60"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-premier-black/70 via-premier-black/40 to-premier-black" />
    </div>

    <div className="relative z-10 container mx-auto px-6 lg:px-12 min-h-[calc(100vh-7rem)] flex flex-col justify-between py-12">
      <div className="max-w-5xl">
        <TextEffect
          as="h1"
          immediate
          className="font-display font-bold tracking-tighter leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
          highlightClassName="bg-premier-white text-premier-black px-3 py-1"
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
        <p className="text-base md:text-lg text-premier-white/80 max-w-md leading-relaxed">
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

          <p className="text-xs uppercase tracking-wider text-premier-white/60 mb-1">
            Greater Toronto Area
          </p>

          <Link
            to="/about"
            className="group inline-flex items-center gap-2 text-2xl md:text-3xl font-display font-bold tracking-tight"
          >
            Project Premier
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
