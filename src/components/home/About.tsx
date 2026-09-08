import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { TextEffect } from "@/components/TextEffect";

const About = () => (
  <section
    id="about"
    className="bg-premier-black text-premier-white py-24 md:py-32 relative"
  >
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

          <p className="text-lg md:text-xl text-premier-white/80 leading-relaxed mb-10 max-w-2xl">
            At Project Premier, we are committed to transforming the lives of
            marginalized youth across the Greater Toronto Area (GTA) by
            providing them with the tools, mentorship, and opportunities they
            need to succeed. Through the power of music, creativity, and
            business education, we equip young individuals with essential
            skills, real-world experience, and a supportive community that
            fosters growth.
          </p>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 bg-premier-white text-premier-black rounded-full px-7 py-3.5 text-base font-medium transition-all duration-300 hover:bg-premier-gray-200 hover:scale-105"
          >
            More Info
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="lg:col-span-5 overflow-hidden rounded-2xl">
          <img
            src="/lovable-uploads/73b6ed2c-95da-4197-b8d2-ebefa8ca07ab.png"
            alt="Project Premier community"
            className="w-full h-[360px] sm:h-[440px] md:h-[520px] lg:h-[560px] xl:h-[620px] object-cover transition-transform duration-700 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);

export default About;
