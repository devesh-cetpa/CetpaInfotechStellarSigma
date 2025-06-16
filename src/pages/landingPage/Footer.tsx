import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#061C36] to-[#04162B] text-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D32F2F] via-[#004A89] to-[#D32F2F]"></div>

      <motion.div
        className="absolute top-40 right-10 w-80 h-80 rounded-full bg-[#D32F2F]/5 blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-[#004A89]/10 blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col gap-10 md:flex-row justify-between">
          {/* Logo and about section */}
          <div className="md:col-span-4">
            <div className="flex  mb-6 flex-col">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzM4Y6zmNiyNa0f6vpZp4Exm6uLv0y4I9Abg&s"
                alt="DFCCIL Logo"
                className="h-auto w-28 mr-3"
              />
              <h1 className="font-bold text-white">Stellar Sigma Villas</h1>
            </div>

            <p className="text-gray-300 mb-6">Welcome Seetlar Sigma Family</p>

            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D32F2F] transition-colors duration-300"
              >
                <Facebook size={16} className="text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D32F2F] transition-colors duration-300"
              >
                <Twitter size={16} className="text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D32F2F] transition-colors duration-300"
              >
                <Linkedin size={16} className="text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D32F2F] transition-colors duration-300"
              >
                <Instagram size={16} className="text-white" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D32F2F] transition-colors duration-300"
              >
                <Youtube size={16} className="text-white" />
              </a>
            </div>
          </div>

          {/* Contact information */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-bold mb-4 text-white relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#D32F2F]"></span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin
                  size={18}
                  className="text-[#D32F2F] mt-1 mr-3 flex-shrink-0"
                />
                <p className="text-gray-300">
                  Plot No 74, Sector, Stellar Sigma, Sigma IV, Greater Noida,
                  Uttar Pradesh 201310
                </p>
              </div>
              <div className="flex items-center">
                <Phone
                  size={18}
                  className="text-[#D32F2F] mr-3 flex-shrink-0"
                />
                <p className="text-gray-300">+91 -9654444252</p>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-[#D32F2F] mr-3 flex-shrink-0" />
                <p className="text-gray-300">as@cetpaInfotech.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Stellar Sigma Villas. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
