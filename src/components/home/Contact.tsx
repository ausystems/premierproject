import { ReactNode, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Clock, LucideIcon, Mail, MapPin } from "lucide-react";
import { TextEffect } from "@/components/TextEffect";

interface ContactDetail {
  icon: LucideIcon;
  label: string;
  content: ReactNode;
}

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
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

  const contactDetails: ContactDetail[] = [
    {
      icon: Mail,
      label: "Email",
      content: (
        <a
          href="mailto:info@projectpremier.org"
          className="text-premier-gray-700 hover:text-premier-black transition-colors duration-300"
        >
          info@projectpremier.org
        </a>
      ),
    },
    {
      icon: MapPin,
      label: "Address",
      content: (
        <>
          <p className="text-premier-gray-700">130 Queens Quay East,</p>
          <p className="text-premier-gray-700">Toronto, ON, Canada</p>
        </>
      ),
    },
    {
      icon: Clock,
      label: "Hours Of Operation",
      content: (
        <>
          <p className="text-premier-gray-700">Sun – Thu — Closed</p>
          <p className="text-premier-gray-700">Friday — 5 PM to 9 PM</p>
          <p className="text-premier-gray-700">Saturday — 12 PM to 5 PM</p>
        </>
      ),
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section bg-premier-white py-24 md:py-32"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div
          className={`mb-12 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
            — Reach Out
          </span>
        </div>

        <div
          className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 transition-all duration-500 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <TextEffect
            className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
            highlightClassName="bg-premier-black text-premier-white px-3 py-1"
            segments={[{ text: "Get In " }, { text: "Touch", highlight: true }]}
          />
          <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
            Questions, partnerships, or just saying hi — we'd love to hear from
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {contactDetails.map((detail, index) => {
            const Icon = detail.icon;

            return (
              <div
                key={detail.label}
                className={`group p-8 md:p-10 border border-premier-black/15 rounded-2xl bg-premier-white transition-all duration-500 hover:border-premier-black hover:-translate-y-1 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${150 + index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-8">
                  <Icon className="w-7 h-7 text-premier-black" />
                  <span className="text-xs uppercase tracking-widest text-premier-gray-600">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tighter mb-4 leading-tight">
                  {detail.label}
                </h3>
                <div className="leading-relaxed space-y-1">
                  {detail.content}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`mt-16 transition-all duration-300 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <a
            href="mailto:info@projectpremier.org"
            className="inline-flex items-center gap-2 bg-premier-black text-premier-white rounded-full px-7 py-3.5 text-base font-medium transition-all duration-300 hover:bg-premier-gray-800 hover:scale-105"
          >
            Send Us A Message
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
