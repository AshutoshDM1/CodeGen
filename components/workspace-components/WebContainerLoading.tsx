"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimatedSvg } from "../ui/animated-svg";

interface WebContainerLoadingProps {
  message?: string;
}

const WebContainerLoading = ({
  message = "Building the Web Container...",
}: WebContainerLoadingProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 flex flex-col items-center justify-start h-full px-4 pt-20 text-center max-w-xl"
      >
        <div className="relative">
          {/* Container icon with animation */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base container shape */}
            <motion.rect
              x="20"
              y="30"
              width="80"
              height="70"
              rx="4"
              fill="#111111"
              stroke="#2DD4BF"
              strokeWidth="2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />

            {/* Container lid */}
            <motion.path
              d="M24 30H96C98.2091 30 100 28.2091 100 26V24C100 21.7909 98.2091 20 96 20H24C21.7909 20 20 21.7909 20 24V26C20 28.2091 21.7909 30 24 30Z"
              fill="#111111"
              stroke="#2DD4BF"
              strokeWidth="2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* Code blocks inside container */}
            <motion.rect
              x="30"
              y="40"
              width="40"
              height="6"
              rx="2"
              fill="#34D399"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />

            <motion.rect
              x="30"
              y="52"
              width="60"
              height="6"
              rx="2"
              fill="#0EA5E9"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            />

            <motion.rect
              x="30"
              y="64"
              width="50"
              height="6"
              rx="2"
              fill="#A78BFA"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            />

            <motion.rect
              x="30"
              y="76"
              width="45"
              height="6"
              rx="2"
              fill="#F472B6"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            />

            {/* Processing dots */}
            <motion.circle
              cx="30"
              cy="90"
              r="3"
              fill="#FFFFFF"
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0,
              }}
            />

            <motion.circle
              cx="40"
              cy="90"
              r="3"
              fill="#FFFFFF"
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.3,
              }}
            />

            <motion.circle
              cx="50"
              cy="90"
              r="3"
              fill="#FFFFFF"
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.6,
              }}
            />
          </svg>

          {/* Background animation */}
          <div className="absolute top-0 left-0 -z-10 opacity-40">
            <AnimatedSvg
              variant="morph"
              width={200}
              height={160}
              primaryColor="rgba(45, 212, 191, 0.5)"
              secondaryColor="rgba(16, 185, 129, 0.3)"
            />
          </div>
        </div>

        {/* Message with typing animation */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-lg text-gray-300 md:text-xl"
        >
          {message}
        </motion.p>

        {/* Progress bar */}
        <motion.div
          className="h-1 bg-gray-700 rounded-full mt-6 w-64 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-green-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        {/* Status text */}
        <motion.div
          className="mt-4 text-sm text-gray-400 font-mono"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          Initializing environment...
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WebContainerLoading;
