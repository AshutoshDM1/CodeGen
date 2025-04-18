'use client';
import { motion } from 'framer-motion';
import { Box, Image, CheckCircle } from 'lucide-react';

export default function FeatureSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full min-h-fit bg-black text-white py-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        {/* Feature Label */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <span className="px-4 py-2 rounded-full bg-[#111] border border-[#333] text-sm text-gray-400">
            Our features
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          variants={item}
          className="text-4xl md:text-6xl lg:text-7xl text-center font-light mb-20 text-gray-200"
        >
          Your creativity, unlocked with AI
        </motion.h2>

        {/* Feature Cards */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {/* Videos & Images */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111] to-[#222] p-8 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <Image className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl text-gray-200">Code Generation</h3>
            </div>
          </motion.div>

          {/* 3D & Realtime */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111] to-[#222] p-8 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Box className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl text-gray-200">Realtime Interaction</h3>
            </div>
          </motion.div>

          {/* Audio */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111] to-[#222] p-8 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl text-gray-200">Code Review</h3>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
