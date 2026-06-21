"use client";

import { motion } from "framer-motion";
import { History } from "lucide-react";

interface FloatingHistoryButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function FloatingHistoryButton({ onClick, isOpen }: FloatingHistoryButtonProps) {
  if (isOpen) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-white border border-isuzu-gold/30 shadow-xl shadow-isuzu-gold/15 flex items-center justify-center text-isuzu-gold hover:text-isuzu-violet hover:border-isuzu-violet/30 transition-colors duration-300 gold-glow"
      title="Chat History"
    >
      <History className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-isuzu-violet border-2 border-white" />
    </motion.button>
  );
}
