'use client';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Connect() {
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full bg-black text-white py-32">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto px-4 text-center"
      >
        <motion.div variants={item} className="inline-flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium">Contact</span>
        </motion.div>

        <motion.h2
          variants={item}
          className="text-5xl md:text-7xl font-normal mb-16 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent"
        >
          Join our community.
        </motion.h2>

        <motion.div variants={container} className="flex justify-center gap-6 flex-wrap">
          <motion.div variants={item}>
            <Link
              href="https://discord.com"
              className="flex items-center justify-center px-8 py-2 rounded-full bg-[#111] border border-[#333] hover:border-[#555] transition-all duration-300 gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Discord
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link
              href="https://twitter.com"
              className="flex items-center justify-center px-8 py-2 rounded-full bg-[#111] border border-[#333] hover:border-[#555] transition-all duration-300 gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link
              href="https://github.com"
              className="flex items-center justify-center px-8 py-2 rounded-full bg-[#111] border border-[#333] hover:border-[#555] transition-all duration-300 gap-2"
            >
              <Github className="w-5 h-5" />
              Github
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
