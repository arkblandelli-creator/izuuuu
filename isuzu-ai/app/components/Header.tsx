"use client";

import { motion } from "framer-motion";
import { Menu, Settings, Diamond, History } from "lucide-react";
import { AIModeSelector } from "./AIModeSelector";
import { AIMode } from "../types";

interface HeaderProps {
  onToggleSidebar: () => void;
  currentMode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

export function Header({ onToggleSidebar, currentMode, onModeChange }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-isuzu-gold/10 shadow-sm"
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-isuzu-bg text-gray-600 hover:text-isuzu-gold transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-isuzu-dark flex items-center justify-center">
              <Diamond className="w-4 h-4 text-isuzu-gold" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-isuzu-dark tracking-tight leading-tight">
                Izusu ai
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AIModeSelector currentMode={currentMode} onModeChange={onModeChange} />
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-isuzu-bg text-gray-600 hover:text-isuzu-violet transition-colors"
            title="History"
          >
            <History className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-isuzu-bg text-gray-600 hover:text-isuzu-violet transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
