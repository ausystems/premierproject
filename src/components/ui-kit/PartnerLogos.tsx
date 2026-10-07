import remixLogo from "@/assets/remix-project-logo.webp";
import remix600 from "@/assets/remix-project-logo-600.webp";
import trilliumLogo from "@/assets/ontario-trillium-logo.webp";
import trillium600 from "@/assets/ontario-trillium-logo-600.webp";

const logo = "h-20 w-auto md:h-24 lg:h-28";

/**
 * The partners' own artwork in its true colours. Each mark is drawn 80, 96 or 112px tall; the
 * 600px copy covers that on most screens and the full artwork is there for denser ones.
 */
export const PartnerLogos = () => (
  <>
    <img
      src={remixLogo}
      srcSet={`${remix600} 600w, ${remixLogo} 1486w`}
      sizes="(min-width: 1024px) 234px, (min-width: 768px) 200px, 167px"
      alt="The Remix Project logo"
      width={1486}
      height={713}
      loading="lazy"
      decoding="async"
      className={logo}
    />
    <img
      src={trilliumLogo}
      srcSet={`${trillium600} 600w, ${trilliumLogo} 1261w`}
      sizes="(min-width: 1024px) 152px, (min-width: 768px) 130px, 108px"
      alt="Ontario Trillium Foundation logo"
      width={1261}
      height={932}
      loading="lazy"
      decoding="async"
      className={logo}
    />
  </>
);
