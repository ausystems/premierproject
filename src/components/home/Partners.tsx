import { motion } from "framer-motion";
import { TextEffect } from "@/components/TextEffect";
import OptimizedImage from "@/components/OptimizedImage";
import remixProjectLogo from "@/assets/remix-project-logo.jpeg";
import ontarioTrilliumLogo from "@/assets/ontario-trillium-logo.jpeg";

const Partners = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="partners" className="py-24 bg-premier-white relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="inline-block border border-premier-black/30 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-premier-black/80">
            — Our Network
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16">
          <TextEffect
            className="lg:col-span-8 font-display font-bold tracking-tighter leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-premier-black"
            highlightClassName="bg-premier-black text-premier-white px-3 py-1"
            segments={[
              { text: "Partners & " },
              { text: "Collaborators", highlight: true },
            ]}
          />
          <p className="lg:col-span-4 text-base md:text-lg text-premier-gray-600 leading-relaxed">
            We're proud to work alongside these organizations to create meaningful impact in our community.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-56 flex items-start justify-center pt-4 mb-6">
                <OptimizedImage
                  src={remixProjectLogo}
                  alt="The Remix Project logo"
                  className="max-h-48 max-w-80 w-auto object-contain"
                  aspectRatio="auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-premier-black font-display">
                The Remix Project
              </h3>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-56 flex items-start justify-center pt-4 mb-6">
                <OptimizedImage
                  src={ontarioTrilliumLogo}
                  alt="Ontario Trillium Foundation logo"
                  className="max-h-48 max-w-80 w-auto object-contain"
                  aspectRatio="auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-premier-black font-display">
                Ontario Trillium Foundation
              </h3>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
