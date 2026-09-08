import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/programs", label: "Our Programs" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-premier-black/85 backdrop-blur-md shadow-lg" : "bg-premier-black"
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "container mx-auto px-6 lg:px-12 flex items-center justify-between transition-all duration-300",
          scrolled ? "py-2 md:py-3" : "py-3 md:py-4"
        )}
      >
        <Link to="/" className="flex items-center" aria-label="Project Premier — home">
          <img
            src="/lovable-uploads/58c29542-568b-4ddb-898d-7f3c77b14af4.png"
            alt="Project Premier"
            className={cn(
              "w-auto transition-all duration-300",
              scrolled ? "h-10 sm:h-11 md:h-12" : "h-12 sm:h-14 md:h-16 lg:h-20"
            )}
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative text-sm font-medium tracking-wide transition-colors duration-300",
                "after:absolute after:left-0 after:-bottom-1.5 after:h-px after:bg-premier-white after:transition-all after:duration-300",
                isActive(item.to)
                  ? "text-premier-white after:w-full"
                  : "text-premier-white/75 hover:text-premier-white after:w-0 hover:after:w-full"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/referral"
            className="inline-flex items-center gap-1.5 bg-premier-white text-premier-black rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-premier-gray-200 hover:scale-105"
          >
            Refer a Youth
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          className="lg:hidden text-premier-white p-2 -mr-2 rounded-full hover:bg-premier-white/10 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "lg:hidden fixed inset-x-0 top-[var(--mobile-menu-top,4rem)] bottom-0 bg-premier-black transition-all duration-300 origin-top",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"
        )}
        style={{ top: scrolled ? "60px" : "72px" }}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col h-full">
          <ul className="flex flex-col divide-y divide-premier-white/10">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center justify-between py-5 font-display text-3xl sm:text-4xl font-bold tracking-tight transition-colors duration-300",
                    isActive(item.to) ? "text-premier-white" : "text-premier-white/80 hover:text-premier-white"
                  )}
                >
                  {item.label}
                  <ArrowUpRight className="w-5 h-5 opacity-60" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <Link
              to="/referral"
              className="w-full inline-flex items-center justify-center gap-2 bg-premier-white text-premier-black rounded-full px-6 py-4 text-base font-medium transition-all duration-300 hover:bg-premier-gray-200"
            >
              Refer a Youth
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
