'use client';
import { Dot } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const container = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 w-full py-6 px-8 flex justify-center items-center"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex items-center justify-center gap-2 border-[2px] border-[#3d3d3d8f] rounded-full p-2 px-3 backdrop-blur-sm"
      >
        {['Docs', 'Pricing', 'Github', 'About', 'Login'].map((text) => (
          <motion.button
            key={text}
            variants={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-0 border-[2px] border-transparent group hover:border-[#3b3b3bd5] transition-all duration-200 rounded-full py-1 pr-5"
          >
            <motion.span
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="text-gray-500 text-2xl group-hover:text-green-500 transition-all duration-300 delay-100"
            >
              <Dot size={36} />
            </motion.span>
            <motion.h1 className="text-gray-300 transition-all duration-300 group-hover:text-white font-medium font-[system-ui] hover:text-black text-[14px] line-height-[24px] flex items-start justify-start mb-1">
              {text}
            </motion.h1>
          </motion.button>
        ))}
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
