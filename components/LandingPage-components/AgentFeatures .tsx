'use client';
import { motion } from 'framer-motion';

export default function AgentFeatures () {
  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Generate random heights for the bars
  const bars = Array.from({ length: 12 }, () => Math.floor(Math.random() * 200) + 50);

  return (
    <section className="w-full min-h-screen bg-black text-white py-24 relative overflow-hidden">
      {/* Background animated bars */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10">
        <div className="flex items-end h-96 gap-6 mx-auto">
          {bars.map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                repeatDelay: Math.random() * 0.5,
              }}
              className="w-8 bg-gray-300 rounded-t-md"
            ></motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center text-center"
      >
        <motion.h2
          variants={item}
          className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 max-w-5xl mx-auto leading-tight"
        >
          Fully Automatic workflow with custom Agent
        </motion.h2>

        <motion.p variants={item} className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
          Many of the most popular capabilities in CodeGen AI are written as Automatic Workflow by
          the Team which are capable of generating code , debugging code , reviewing code , and
          more.
        </motion.p>

        <motion.div variants={item}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
          >
            Learn more
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
