"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingAnimationProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  text?: string;
}

const LoadingAnimation = ({
  size = 80,
  primaryColor = "#06B6D4", // cyan-500
  secondaryColor = "#22C55E", // green-500
  tertiaryColor = "#FFFFFF", // white
  text = "Loading",
}: LoadingAnimationProps) => {
  const center = size / 2;
  const strokeWidth = size * 0.05;
  const outerRadius = size * 0.4;
  const middleRadius = size * 0.3;
  const innerRadius = size * 0.2;

  // Animation variants
  const outerCircleVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  const middleCircleVariants = {
    animate: {
      rotate: -360,
      transition: {
        duration: 4,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  const innerCircleVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2.5,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  const dotVariants = {
    animate: {
      y: [-3, 0, -3],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Outer animated circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${outerRadius * 0.8} ${outerRadius * 0.3}`}
            variants={outerCircleVariants}
            animate="animate"
            style={{ transformOrigin: "center" }}
          />

          {/* Middle animated circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={middleRadius}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${middleRadius * 0.6} ${middleRadius * 0.4}`}
            variants={middleCircleVariants}
            animate="animate"
            style={{ transformOrigin: "center" }}
          />

          {/* Inner animated circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke={tertiaryColor}
            strokeWidth={strokeWidth * 0.8}
            strokeDasharray={`${innerRadius * 0.5} ${innerRadius * 0.5}`}
            strokeLinecap="round"
            variants={innerCircleVariants}
            animate="animate"
            style={{ transformOrigin: "center" }}
          />

          {/* Shimmering effect in the center */}
          <motion.circle
            cx={center}
            cy={center}
            r={innerRadius * 0.6}
            fill={`url(#gradient-${size})`}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Gradient definition */}
          <defs>
            <radialGradient
              id={`gradient-${size}`}
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.8" />
              <stop offset="80%" stopColor={primaryColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Add some accent dots that pop in and out */}
        <motion.div
          className="absolute"
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            backgroundColor: primaryColor,
            left: `calc(50% + ${outerRadius * 0.7}px)`,
            top: `calc(50% - ${outerRadius * 0.7}px)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        <motion.div
          className="absolute"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: secondaryColor,
            left: `calc(50% - ${outerRadius * 0.8}px)`,
            top: `calc(50% + ${outerRadius * 0.6}px)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
      </div>

      {text && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-xl font-medium bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
            {text}
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i < 2 ? primaryColor : secondaryColor,
                }}
                variants={dotVariants}
                animate="animate"
                transition={{
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingAnimation;
