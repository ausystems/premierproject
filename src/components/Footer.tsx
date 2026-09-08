import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-premier-black text-premier-white">
    <div className="container mx-auto px-6 lg:px-12 py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10">
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
          <Link to="/" className="inline-flex" aria-label="Project Premier — home">
            <img
              src="/lovable-uploads/4bf7339d-93aa-401c-960e-c32ebe22e59a.png"
              alt="Project Premier"
              className="h-16 sm:h-20 md:h-24 w-auto"
              loading="lazy"
            />
          </Link>
          <p className="mt-6 max-w-sm text-sm md:text-base text-premier-white/70 leading-relaxed">
            Empowering youth across the GTA through music, creativity, and business.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.instagram.com/projectpremierx/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-full border border-premier-white/15 flex items-center justify-center transition-all duration-300 hover:border-premier-white hover:bg-premier-white hover:text-premier-black"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-premier-white/60 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm md:text-base text-premier-white/80 hover:text-premier-white transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm md:text-base text-premier-white/80 hover:text-premier-white transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-premier-white/60 mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/programs"
                  className="text-sm md:text-base text-premier-white/80 hover:text-premier-white transition-colors duration-300"
                >
                  Our Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/referral"
                  className="text-sm md:text-base text-premier-white/80 hover:text-premier-white transition-colors duration-300"
                >
                  Refer a Youth
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-premier-white/60 mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-sm md:text-base text-premier-white/80 hover:text-premier-white transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@projectpremier.org"
                  className="text-sm md:text-base text-premier-white/80 hover:text-premier-white transition-colors duration-300"
                >
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 flex md:justify-end items-start">
          <Link
            to="/referral"
            className="inline-flex items-center gap-1.5 bg-premier-white text-premier-black rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-premier-gray-200 hover:scale-105"
          >
            Refer a Youth
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-premier-white/10 mt-12 md:mt-16 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-premier-white/60 text-center sm:text-left">
        <p>© Copyright 2026. Project Premier. All Rights Reserved.</p>
        <p>
          Built by{" "}
          <a
            href="https://www.audesigns.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-premier-white/80 hover:text-premier-white underline-offset-4 hover:underline transition-colors duration-300"
          >
            AuDesigns.co
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
