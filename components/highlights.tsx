"use client"

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { Variants } from "framer-motion";

export default function Highlights() {
  const [count, setCount] = useState(77); // starting at 77+
  const duration = 30_000; // 30 sec
  const target = 100;
  const intervalTime = 100;
  const increment = (target / duration) * intervalTime;
  const sentence =
    "D0LT delivers smarter maintenance with AI automation and real-time monitoring";

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });
  const y = useTransform(smoothProgress, [0, 1], ["-5vh", "5vh"]);
  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0.7, 1, 1, 0.7]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev + increment >= target ? 77 : prev + increment));
    }, intervalTime);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
    >
      {/* Background Video */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          src="/videos/promo.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => (e.currentTarget.currentTime = 0)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Left side: Counter */}
      <div className="absolute bottom-24 left-6 flex flex-col items-start z-10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold"
        >
          {Math.floor(count)}+
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl"
        >
          Real-time Support
        </motion.p>
      </div>

      {/* Right side: Animated sentence */}
      <div className="absolute bottom-24 right-6 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-5xl z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
        >
          {sentence.split(" ").map((word, wordIndex) => (
            <span
              key={wordIndex}
              className={`whitespace-nowrap mr-2 flex ${
                word === "D0LT" ? "text-orange-500 font-bold" : ""
              }`}
            >
              {word.split("").map((char, charIndex) => (
                <motion.span key={charIndex} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>
      {/* Top-right line + text */}
      <div className="flex flex-wrap absolute top-12 right-6 items-center z-10">
        <span className="inline-block w-64 h-1 bg-white mr-4" />
        <span className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl">
          Experience the Real Support
        </span>
      </div>
    </div>
  );
}