import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Clock, Mail, MapPin, Navigation, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TextEffect from "@/components/TextEffect";

interface ContactDetail {
  icon: LucideIcon;
  label: string;
  content: ReactNode;
}

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const contactDetails: ContactDetail[] = [
    {
      icon: Mail,
      label: "Email",
      content: (
        <a
          href="mailto:info@projectpremier.org"
          className="text-premier-white/80 hover:text-premier-white transition-colors duration-300"
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
          <p className="text-premier-white/80">130 Queens Quay East,</p>
          <p className="text-premier-white/80">Toronto, ON, Canada</p>
        </>
      ),
    },
    {
      icon: Clock,
      label: "Hours Of Operation",
      content: (
        <>
          <p className="text-premier-white/80">Sun – Thu — Closed</p>
          <p className="text-premier-white/80">Friday — 5 PM to 9 PM</p>
          <p className="text-premier-white/80">Saturday — 12 PM to 5 PM</p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-premier-white text-premier-black pt-32 md:pt-40 pb-20 md:pb-28">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-10">
              <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
                — Contact
              </span>
            </div>
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
              <TextEffect
                as="h1"
                immediate
                className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
                highlightClassName="bg-premier-black text-premier-white px-3 py-1"
                segments={[{ text: "Let's start a " }, { text: "conversation.", highlight: true }]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
                Questions about our programs, partnership ideas, or just saying hi — we'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        <section ref={sectionRef} className="bg-premier-black text-premier-white py-24 md:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div
              className={`mb-12 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="inline-block border border-premier-white/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-white/80">
                — Reach Out
              </span>
            </div>
            <div
              className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 transition-all duration-500 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <TextEffect
                className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl"
                highlightClassName="bg-premier-white text-premier-black px-3 py-1"
                segments={[{ text: "Get In " }, { text: "Touch", highlight: true }]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-white/80 leading-relaxed">
                Connect with us through any of the channels below — we typically respond within 1–2 business days.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
              {contactDetails.map((detail, index) => {
                const Icon = detail.icon;
                return (
                  <div
                    key={detail.label}
                    className={`group p-8 md:p-10 border border-premier-white/15 rounded-2xl bg-premier-white/5 transition-all duration-500 hover:border-premier-white hover:-translate-y-1 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${150 + index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-8">
                      <Icon className="w-7 h-7 text-premier-white" />
                      <span className="text-xs uppercase tracking-widest text-premier-white/60">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tighter mb-4 leading-tight">
                      {detail.label}
                    </h3>
                    <div className="leading-relaxed space-y-1">{detail.content}</div>
                  </div>
                );
              })}
            </div>
            <div
              className={`mt-12 transition-all duration-300 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <a
                href="mailto:info@projectpremier.org"
                className="inline-flex items-center gap-2 bg-premier-white text-premier-black rounded-full px-7 py-3.5 text-base font-medium transition-all duration-300 hover:bg-premier-gray-200 hover:scale-105"
              >
                Send Us A Message
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-premier-gray-100 py-24 md:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12">
              <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
                — Find Us
              </span>
            </div>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12">
              <TextEffect
                className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
                highlightClassName="bg-premier-black text-premier-white px-3 py-1"
                segments={[{ text: "Visit our " }, { text: "studio", highlight: true }]}
              />
              <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
                Located on the Toronto waterfront — drop by during open hours.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden max-w-4xl mx-auto">
              <img
                src="/lovable-uploads/49dfc3cf-39fa-42c9-b75f-0d3ff5743c90.png"
                alt="Map showing Project Premier location at 130 Queens Quay East, Toronto"
                className="w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                loading="lazy"
              />
              <a
                href="https://maps.google.com/?q=130+Queens+Quay+East,+Toronto,+ON,+Canada"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in Google Maps"
                className="absolute bottom-5 right-5 inline-flex items-center gap-2 bg-premier-black text-premier-white rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 hover:bg-premier-gray-800 hover:scale-105"
              >
                <Navigation className="w-4 h-4" />
                Open In Maps
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
