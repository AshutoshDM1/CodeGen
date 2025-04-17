'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative w-full min-h-[100vh] bg-gradient-to-br from-blue-400 to-cyan-400 flex items-end">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative w-full container mx-auto px-6 py-12"
      >
        <div className="flex flex-col gap-32">
          {/* Logo Section */}
          <motion.div variants={item}>
            <h1 className="text-[60px] sm:text-[120px] md:text-[150px] lg:text-[200px] font-bold text-black/80">
              CodeGen AI
            </h1>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            variants={container}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8"
          >
            {/* Left Side - Location and Copyright */}
            <motion.div
              variants={item}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8"
            >
              <span className="text-black/70 text-lg">New Delhi, India</span>
              <span className="text-black/70 text-lg">© 2024 CodeGen AI</span>
            </motion.div>

            {/* Right Side - Links */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-4">
              <Link
                href="mailto:hello@comfy.org"
                className="px-6 py-2.5 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300 text-black/70 hover:text-black/90 text-lg backdrop-blur-sm"
              >
                hello@codegen.ai
              </Link>
              <Link
                href="https://discord.com/invite/mvZAABKw9J"
                className="px-6 py-2.5 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300 text-black/70 hover:text-black/90 text-lg backdrop-blur-sm"
              >
                Discord
              </Link>
              <Link
                href="https://x.com/AshutoshDM_1"
                className="px-6 py-2.5 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300 text-black/70 hover:text-black/90 text-lg backdrop-blur-sm"
              >
                Forum
              </Link>
              <Link
                href="https://x.com/AshutoshDM_1"
                className="px-6 py-2.5 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300 text-black/70 hover:text-black/90 text-lg backdrop-blur-sm"
              >
                Twitter
              </Link>
              <Link
                href="https://github.com/AshutoshDM1/CodeGen"
                className="px-6 py-2.5 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300 text-black/70 hover:text-black/90 text-lg backdrop-blur-sm"
              >
                Github
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}
