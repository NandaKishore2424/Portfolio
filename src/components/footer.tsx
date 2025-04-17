"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="py-12 relative overflow-hidden border-t border-violet-700/20">
      {/* Decorative cosmic elements */}
      <div className="absolute bottom-0 left-20 w-80 h-80 rounded-full bg-violet-400/5 blur-3xl -z-10" />
      <div className="absolute top-0 right-20 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl -z-10" />
      
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo & Scroll to Top */}
          <div className="flex items-center mb-8 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-white mr-auto">
              NK<span className="text-violet-400">.</span>
            </Link>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-6 mb-8 md:mb-0">
            <motion.a
              href="https://github.com/NandaKishore2424"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-violet-900/30 backdrop-blur-sm flex items-center justify-center rounded-full text-violet-200 hover:bg-violet-600/50 hover:text-white transition-colors"
              whileHover={{ y: -3 }}
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </motion.a>
            
            <motion.a
              href="https://www.linkedin.com/in/nanda-kishore-7290551b8/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-violet-900/30 backdrop-blur-sm flex items-center justify-center rounded-full text-violet-200 hover:bg-violet-600/50 hover:text-white transition-colors"
              whileHover={{ y: -3 }}
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </motion.a>
            
            <motion.a
              href="mailto:r.nandakishore24@gmail.com"
              className="h-10 w-10 bg-violet-900/30 backdrop-blur-sm flex items-center justify-center rounded-full text-violet-200 hover:bg-violet-600/50 hover:text-white transition-colors"
              whileHover={{ y: -3 }}
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </motion.a>
          </div>
          
          {/* Scroll to top button */}
          <motion.button
            onClick={scrollToTop}
            className="h-10 w-10 bg-violet-600/50 backdrop-blur-sm flex items-center justify-center rounded-full text-white hover:bg-violet-500 transition-colors"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="border-t border-violet-700/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-violet-300 text-sm mb-4 md:mb-0">
              &copy; 2025 Nanda Kishore. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <Link href="/#about" className="text-sm text-violet-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/#projects" className="text-sm text-violet-300 hover:text-white transition-colors">
                Projects
              </Link>
              <Link href="/#skills" className="text-sm text-violet-300 hover:text-white transition-colors">
                Skills
              </Link>
              <Link href="/#contact" className="text-sm text-violet-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}