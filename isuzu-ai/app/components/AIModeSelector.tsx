"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, Sparkles, Bot } from "lucide-react";
import { AIMode, AI_MODES } from "../types";

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Bot: <Bot className="w-4 h-4" />,
};

interface AIModeSelectorProps {
  currentMode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

export function AIModeSelector({ currentMode, onModeChange }: AIModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentConfig = AI_MODES.find((m) => m.id === currentMode) || AI_MODES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-isuzu-gold/30 hover:border-isuzu-gold/60 transition-all duration-300 shadow-sm hover:shadow-md gold-glow"
      >
        <span className={`w-2 h-2 rounded-full ${currentConfig.badgeColor}`} />
        <span className="text-sm font-medium text-isuzu-dark">{currentConfig.name}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl border border-isuzu-gold/20 shadow-xl shadow-isuzu-violet/5 z-50 overflow-hidden"
          >
            {AI_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  onModeChange(mode.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-isuzu-bg transition-colors ${
                  currentMode === mode.id ? "bg-isuzu-violet/5" : ""
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${mode.badgeColor}`} />
                <span className="text-isuzu-gold">{ICON_MAP[mode.icon]}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-isuzu-dark">{mode.name}</p>
                  <p className="text-xs text-gray-500">{mode.provider}</p>
                </div>
                {currentMode === mode.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-isuzu-violet"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
