import React from "react";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import aboutUsImage from "../assets/bg-image.jpg";
import aboutimg from "../assets/about-img.jpg";
import ourteam from "../assets/ourteam.jpg";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="bg-[#F8F5F2]">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10"></div>
        <img
          className="object-cover w-full h-full max-w-full opacity-90"
          style={{ imageRendering: "crisp-edges" }}
          src={aboutUsImage}
          alt="Elixa About Us"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif tracking-tight">
              <span className="block mb-2 text-[#D4AF37]">Discover</span>
              The Elixa Story
            </h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Where passion for fashion meets a commitment to individuality and
              timeless style.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="border-t border-[#D4AF37] w-24 mx-auto my-8"
            ></motion.div>
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4B3832] via-[#D4AF37] to-[#4B3832]"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="px-4"
          >
            <h2 className="text-4xl font-bold font-serif text-[#4B3832] mb-8 relative">
              <span className="absolute -left-4 top-0 h-full w-1 bg-[#D4AF37]"></span>
              Our Story
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Founded with a vision to redefine fashion, Elixa is more than just
              a clothing brand—it's a celebration of individuality. We believe
              that style is a form of self-expression, and every piece we create
              is designed to empower you to tell your unique story.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              From our carefully curated collections to our commitment to
              quality craftsmanship, Elixa blends modern trends with timeless
              elegance. Our designs are crafted to make you feel confident,
              bold, and unapologetically you.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-px bg-[#D4AF37]"></div>
              <span className="text-[#4B3832] uppercase tracking-wider text-sm">
                Est. 2025
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96"
          >
            <div className="absolute inset-0 border-2 border-[#D4AF37] ml-8 mt-8 z-0"></div>
            <div className="absolute inset-0 bg-[#4B3832] z-10 flex items-center justify-center">
              <img
                src={aboutimg}
                alt="Elixa craftsmanship"
                className="object-cover w-full h-full opacity-90"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-24 bg-[#4B3832] text-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]"></div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-serif mb-12 relative inline-block">
              Our Mission
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#D4AF37]"></span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12 text-left">
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm border border-white/20">
                <h3 className="text-2xl font-serif mb-4 text-[#D4AF37]">
                  Craftsmanship
                </h3>
                <p className="leading-relaxed">
                  We dedicate ourselves to impeccable craftsmanship, where every
                  stitch tells a story of passion and precision.
                </p>
              </div>
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm border border-white/20">
                <h3 className="text-2xl font-serif mb-4 text-[#D4AF37]">
                  Sustainability
                </h3>
                <p className="leading-relaxed">
                  Committed to ethical production, we minimize our environmental
                  impact while maximizing style and quality.
                </p>
              </div>
            </div>
            <p className="text-lg leading-relaxed mt-12 max-w-3xl mx-auto">
              At Elixa, our mission is to inspire confidence and creativity
              through fashion. We strive to create clothing that not only looks
              good but feels meaningful—pieces that resonate with your soul and
              elevate your style.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-serif text-[#4B3832] mb-4">
                The Visionaries Behind Elixa
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <div className="overflow-hidden rounded-lg shadow-xl">
                  <img
                    src={ourteam}
                    alt="Elixa Team"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#4B3832] text-white p-4 w-3/4 shadow-lg">
                  <h3 className="font-serif text-xl">Our Creative Family</h3>
                </div>
              </div>

              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Our team is a passionate group of designers, artisans, and
                  visionaries dedicated to bringing Elixa's vision to life. From
                  sketching the first designs to perfecting every stitch, we
                  pour our hearts into creating clothing that inspires and
                  empowers.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-l-2 border-[#D4AF37] pl-4">
                    <h4 className="font-serif text-[#4B3832] text-lg">
                      Design
                    </h4>
                    <p className="text-gray-600">Innovative & Timeless</p>
                  </div>
                  <div className="border-l-2 border-[#D4AF37] pl-4">
                    <h4 className="font-serif text-[#4B3832] text-lg">
                      Quality
                    </h4>
                    <p className="text-gray-600">Uncompromising Standards</p>
                  </div>
                  <div className="border-l-2 border-[#D4AF37] pl-4">
                    <h4 className="font-serif text-[#4B3832] text-lg">
                      Ethics
                    </h4>
                    <p className="text-gray-600">Sustainable Practices</p>
                  </div>
                  <div className="border-l-2 border-[#D4AF37] pl-4">
                    <h4 className="font-serif text-[#4B3832] text-lg">
                      Passion
                    </h4>
                    <p className="text-gray-600">Driven by Creativity</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AboutUs;
