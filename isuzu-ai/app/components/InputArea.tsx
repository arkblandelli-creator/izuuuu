"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Trash2, Loader2 } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { Attachment } from "../types";

interface InputAreaProps {
  onSend: (text: string, attachments: Attachment[]) => void;
  onClearChat: () => void;
  isLoading: boolean;
  hasMessages: boolean;
}

export function InputArea({ onSend, onClearChat, isLoading, hasMessages }: InputAreaProps) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;
    const SpeechRecognitionCtor = (win.SpeechRecognition || win.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
    if (SpeechRecognitionCtor) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setText((prev) => prev + transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSend(text.trim(), attachments);
    setText("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  }, [isListening]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="border-t border-isuzu-gold/10 bg-white/80 backdrop-blur-xl p-4"
    >
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-isuzu-bg rounded-2xl border border-isuzu-gold/10 focus-within:border-isuzu-gold/30 focus-within:shadow-md focus-within:shadow-isuzu-gold/5 transition-all duration-300">
          <div className="flex items-end gap-2 p-3">
            <FileUpload attachments={attachments} onAttachmentsChange={setAttachments} />

            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Is there anything you want to do? Just say it."
                rows={1}
                disabled={isLoading}
                className="w-full bg-transparent resize-none outline-none text-sm text-isuzu-dark placeholder:text-gray-400 py-2 max-h-[200px]"
              />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {voiceSupported && (
                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
                    isListening
                      ? "bg-red-50 text-red-500 animate-pulse"
                      : "hover:bg-isuzu-bg text-gray-400 hover:text-isuzu-violet"
                  }`}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              {hasMessages && (
                <button
                  onClick={onClearChat}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleSend}
                disabled={isLoading || (!text.trim() && attachments.length === 0)}
                className="p-2 rounded-lg bg-isuzu-dark text-white hover:bg-isuzu-dark/90 transition-all disabled:opacity-40 disabled:hover:bg-isuzu-dark shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-2">
          Izusu ai can make mistakes. Please verify important information.
        </p>
      </div>
    </motion.div>
  );
}
