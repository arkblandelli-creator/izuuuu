"use client";

import { motion } from "framer-motion";

export function AvatarDisplay() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center py-8"
    >
      {/* Ambient glow layers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-isuzu-violet/10 blur-3xl animate-pulse-glow" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 rounded-full bg-isuzu-gold/10 blur-2xl" />
      </div>

      {/* Avatar container */}
      <div className="relative">
        {/* Outer gold ring */}
        <div className="absolute -inset-3 rounded-full border border-isuzu-gold/30" />
        <div className="absolute -inset-1.5 rounded-full border border-isuzu-gold/20" />

        {/* Soft gold glow */}
        <div className="absolute -inset-2 rounded-full bg-isuzu-gold/20 blur-xl" />
        <div className="absolute -inset-1 rounded-full bg-isuzu-champagne/10 blur-lg" />

        {/* Violet ambient ring */}
        <div className="absolute -inset-4 rounded-full bg-isuzu-violet/5 blur-2xl" />

        {/* Avatar image */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-isuzu-gold/40 shadow-lg shadow-isuzu-gold/20"
        >
          <img
            src="https://files.catbox.moe/5p0ct8.jpg"
            alt="Izusu ai Avatar"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Online indicator */}
        <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
      </div>

      {/* Welcome text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-6 text-center"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-isuzu-dark tracking-tight">
          Izusu ai
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-500 max-w-md px-4">
          Is there anything you want to do? Just say it.
        </p>
      </motion.div>
    </motion.div>
  );
}
