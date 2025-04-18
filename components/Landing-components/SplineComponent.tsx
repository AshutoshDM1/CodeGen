import SplineNext from '@splinetool/react-spline';
import { motion } from 'framer-motion';
//https://prod.spline.design/NtVDUmj8aaehbEAp/scene.splinecode
const SplineComponent = () => {
  return (
    <main>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
      >
        <SplineNext
          className="min-h-[100vh] w-full absolute top-20 z-[-10] overflow-hidden hidden md:block"
          scene="https://prod.spline.design/XAMw-bPTlleYGM07/scene.splinecode"
        />
      </motion.div>
    </main>
  );
};

export default SplineComponent;
