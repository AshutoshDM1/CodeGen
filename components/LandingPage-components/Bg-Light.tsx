'use client';
import { motion } from 'framer-motion';
import { AuroraBackground } from '../ui/aurora-background';

const BgLight = ({ blur }: { blur: boolean }) => {
  return (
    <>
      <div className="relative z-0 flex min-h-[100vh] w-full flex-col items-end justify-center overflow-hidden rounded-md bg-background">
        <div className="absolute top-0 isolate z-[-100] flex w-screen flex-1 items-start justify-center">
          {blur && (
            <div className="absolute top-0 z-50 h-48 w-screen bg-transparent opacity-10 backdrop-blur-md" />
          )}

          {/* Main glow */}
          <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-[-30%] rounded-full bg-purple-500 opacity-80 blur-3xl" />

          {/* Lamp effect */}
          <motion.div
            initial={{ width: '8rem' }}
            viewport={{ once: true }}
            transition={{ ease: 'easeInOut', delay: 0.3, duration: 0.8 }}
            whileInView={{ width: '16rem' }}
            className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-purple-500 blur-2xl"
          />

          {/* Top line */}
          <motion.div
            initial={{ width: '15rem' }}
            viewport={{ once: true }}
            transition={{ ease: 'easeInOut', delay: 0.3, duration: 0.8 }}
            whileInView={{ width: '30rem' }}
            className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-purple-500"
          />

          {/* Left gradient cone */}
          <motion.div
            initial={{ opacity: 0.5, width: '15rem' }}
            whileInView={{ opacity: 1, width: '30rem' }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: 'easeInOut',
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-purple-500/60 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-[100%] left-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-40 h-[100%] left-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </motion.div>

          {/* Right gradient cone */}
          <motion.div
            initial={{ opacity: 0.5, width: '15rem' }}
            whileInView={{ opacity: 1, width: '30rem' }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: 'easeInOut',
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-purple-500/60 [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute w-40 h-[100%] right-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute w-[100%] right-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BgLight;
