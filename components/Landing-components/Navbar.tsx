'use client';
import { Dot, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
const Navbar = () => {
  const session = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const container = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.3,
        duration: 0.5,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1, y: 0 },
  };

  const mobileMenuVariant = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const navItems = [
    { text: 'Docs', href: '/docs' },
    { text: 'Pricing', href: '/pricing' },
    { text: 'Github', href: 'https://github.com/AshutoshDM1/CodeGen' },
    { text: 'About', href: '/about' },
    { text: 'Login', href: '/auth/login' },
  ];

  const handleClick = (href: string) => {
    if (session.status === 'authenticated' && href === '/auth/login') {
      router.push('/workspace');
    } else {
      router.push(href);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-5 w-full py-6 px-8 justify-center items-center pointer-events-none flex flex-col z-50"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex items-center justify-center gap-2 border-[2px] border-[#3d3d3d8f] rounded-full p-2 px-3 backdrop-blur-sm pointer-events-auto"
      >
        {navItems.map((item, index) => (
          <motion.button
            onClick={() => handleClick(item.href)}
            key={index}
            variants={itemVariant}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-0 border-[2px] border-transparent group hover:border-[#3b3b3bd5] transition-all duration-200 rounded-full py-1 pr-5 "
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
              {item.text}
            </motion.h1>
          </motion.button>
        ))}
        <motion.button
          className="md:hidden pointer-events-auto"
          onClick={toggleMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={36} className="text-white" />
        </motion.button>
      </motion.div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          variants={mobileMenuVariant}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="md:hidden bg-black/80 backdrop-blur-md border border-[#3d3d3d8f] p-4 w-[100vw] pointer-events-auto min-h-[100vh] fixed top-0 left-0"
        >
          <div onClick={toggleMenu} className="flex items-center justify-center cursor-pointer">
            <X size={36} className="text-white" />
          </div>
          {navItems.map((item, index) => (
            <motion.button
              key={index}
              variants={itemVariant}
              onClick={() => handleClick(item.href)}
              className="w-full text-left py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center"
            >
              <Dot className="text-green-500 mr-2" />
              {item.text}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
