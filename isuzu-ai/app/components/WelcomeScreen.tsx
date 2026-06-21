"use client";

import { motion } from "framer-motion";
import { MessageSquare, Image as ImageIcon, FileText, Code, PenLine, Wand2 } from "lucide-react";
import { AvatarDisplay } from "./AvatarDisplay";

const SUGGESTIONS = [
  { icon: MessageSquare, label: "General chat", prompt: "Let's have a conversation about anything" },
  { icon: ImageIcon, label: "Describe an image", prompt: "Help me describe what I might see in an image" },
  { icon: FileText, label: "Summarize text", prompt: "Summarize a long article or document for me" },
  { icon: Code, label: "Write code", prompt: "Write a Python function to sort a list of numbers" },
  { icon: PenLine, label: "Creative writing", prompt: "Help me write a short story about a futuristic city" },
  { icon: Wand2, label: "Brainstorm ideas", prompt: "Brainstorm 10 ideas for a mobile app" },
];

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
}

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <AvatarDisplay />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-2xl mt-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SUGGESTIONS.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(item.prompt)}
              className="flex items-center gap-3 p-4 rounded-xl bg-white border border-isuzu-gold/10 hover:border-isuzu-gold/30 hover:shadow-md hover:shadow-isuzu-gold/5 transition-all duration-300 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-isuzu-bg flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-isuzu-violet" />
              </div>
              <span className="text-sm text-isuzu-dark font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
