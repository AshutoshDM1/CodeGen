"use client";

import React from "react";
import { AnimatedSvg } from "./ui/animated-svg";

const AnimationDemo = () => {
  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
        SVG Animation Showcase
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl p-6 border border-gray-800 bg-gray-900/30 backdrop-blur-xl">
          <h2 className="text-xl font-medium mb-4 text-cyan-300">
            Morphing Blob
          </h2>
          <div className="flex justify-center items-center h-48 bg-gradient-to-b from-gray-900 to-black rounded-lg">
            <AnimatedSvg
              variant="morph"
              width={250}
              height={150}
              primaryColor="rgba(0, 206, 209, 0.9)"
              secondaryColor="rgba(64, 224, 208, 0.5)"
              duration={8}
              pathsCount={4}
            />
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Smooth morphing blobs with gradient effects and subtle transitions.
          </p>
        </div>

        <div className="rounded-xl p-6 border border-gray-800 bg-gray-900/30 backdrop-blur-xl">
          <h2 className="text-xl font-medium mb-4 text-green-300">
            Pulsing Circles
          </h2>
          <div className="flex justify-center items-center h-48 bg-gradient-to-b from-gray-900 to-black rounded-lg">
            <AnimatedSvg
              variant="pulse"
              width={200}
              height={150}
              primaryColor="rgba(72, 187, 120, 0.8)"
              secondaryColor="rgba(56, 161, 105, 0.6)"
            />
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Concentric circles with pulsing animation effects that create a
            calm, rhythmic motion.
          </p>
        </div>

        <div className="rounded-xl p-6 border border-gray-800 bg-gray-900/30 backdrop-blur-xl">
          <h2 className="text-xl font-medium mb-4 text-indigo-300">
            Flowing Waves
          </h2>
          <div className="flex justify-center items-center h-48 bg-gradient-to-b from-gray-900 to-black rounded-lg">
            <AnimatedSvg
              variant="wave"
              width={300}
              height={150}
              primaryColor="rgba(102, 126, 234, 0.8)"
              secondaryColor="rgba(118, 75, 162, 0.6)"
            />
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Flowing wave patterns with smooth easing that create a soothing,
            oceanic effect.
          </p>
        </div>

        <div className="rounded-xl p-6 border border-gray-800 bg-gray-900/30 backdrop-blur-xl">
          <h2 className="text-xl font-medium mb-4 text-rose-300">
            Loading Animation
          </h2>
          <div className="flex justify-center items-center h-48 bg-gradient-to-b from-gray-900 to-black rounded-lg">
            <AnimatedSvg
              variant="loader"
              width={180}
              height={150}
              primaryColor="rgba(244, 114, 182, 0.9)"
              secondaryColor="rgba(236, 72, 153, 0.7)"
            />
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Circular loader with continuous rotation and dash offset animations
            for loading states.
          </p>
        </div>
      </div>

      <div className="mt-12 p-6 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-xl">
        <h2 className="text-xl font-medium mb-4 text-center text-yellow-300">
          Custom Colors Example
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <AnimatedSvg
            variant="morph"
            width={150}
            height={100}
            primaryColor="rgba(250, 204, 21, 0.7)"
            secondaryColor="rgba(234, 179, 8, 0.5)"
            pathsCount={3}
          />

          <AnimatedSvg
            variant="pulse"
            width={120}
            height={100}
            primaryColor="rgba(249, 115, 22, 0.8)"
            secondaryColor="rgba(234, 88, 12, 0.6)"
          />

          <AnimatedSvg
            variant="wave"
            width={150}
            height={100}
            primaryColor="rgba(236, 72, 153, 0.8)"
            secondaryColor="rgba(219, 39, 119, 0.6)"
          />

          <AnimatedSvg
            variant="loader"
            width={100}
            height={100}
            primaryColor="rgba(124, 58, 237, 0.9)"
            secondaryColor="rgba(109, 40, 217, 0.7)"
          />
        </div>
      </div>
    </div>
  );
};

export default AnimationDemo;
