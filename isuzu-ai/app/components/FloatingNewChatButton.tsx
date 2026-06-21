"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface FloatingNewChatButtonProps {
  onClick: () => void;
}

export function FloatingNewChatButton({ onClick }: FloatingNewChatButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-isuzu-violet text-white shadow-xl shadow-isuzu-violet/25 flex items-center justify-center hover:bg-isuzu-violet/90 transition-colors duration-300"
      title="New Chat"
    >
      <Plus className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-isuzu-gold border-2 border-white animate-pulse" />
    </motion.button>
  );
}
