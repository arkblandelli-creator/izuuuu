"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] loading-gradient flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-isuzu-gold/20 blur-3xl animate-pulse-glow" />
            <div className="relative w-24 h-24 rounded-full bg-white border-2 border-isuzu-gold/50 flex items-center justify-center gold-glow">
              <Sparkles className="w-10 h-10 text-isuzu-gold" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <h1 className="text-2xl font-semibold text-isuzu-dark tracking-wide shimmer-text">
              Izusu ai
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-2 text-sm text-gray-500"
            >
              Initializing your premium experience
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1.5, ease: "easeInOut" }}
            className="mt-8 w-48 h-1 bg-gradient-to-r from-transparent via-isuzu-gold to-transparent rounded-full origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
