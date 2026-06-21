"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Message } from "../types";
import { MessageBubble } from "./MessageBubble";
import { WelcomeScreen } from "./WelcomeScreen";
import { Loader2 } from "lucide-react";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onCopy: (text: string) => void;
  onRegenerate: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onSuggestionClick: (prompt: string) => void;
}

export function ChatArea({
  messages,
  isLoading,
  onCopy,
  onRegenerate,
  onEdit,
  onSuggestionClick,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return <WelcomeScreen onSuggestionClick={onSuggestionClick} />;
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
      <div className="max-w-3xl mx-auto py-6 space-y-1">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={onCopy}
            onRegenerate={onRegenerate}
            onEdit={onEdit}
            isLoading={isLoading}
          />
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 md:px-6 py-4"
          >
            <div className="w-8 h-8 rounded-full bg-isuzu-gold/10 flex items-center justify-center border border-isuzu-gold/20">
              <Loader2 className="w-4 h-4 text-isuzu-gold animate-spin" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-isuzu-gold/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-isuzu-gold/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-isuzu-gold/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
