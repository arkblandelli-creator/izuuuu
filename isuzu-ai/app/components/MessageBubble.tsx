"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { User, Bot, Copy, Check, RotateCcw, Pencil, Clock } from "lucide-react";
import { Message, AIMode, AI_MODES } from "../types";
import { formatTimestamp } from "../lib/utils";
import { CodeBlock } from "./CodeBlock";

interface MessageBubbleProps {
  message: Message;
  onCopy: (text: string) => void;
  onRegenerate: (messageId: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  isLoading?: boolean;
}

export function MessageBubble({
  message,
  onCopy,
  onRegenerate,
  onEdit,
  isLoading,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  const isUser = message.role === "user";
  const modeConfig = AI_MODES.find((m) => m.id === message.model);

  const handleCopy = useCallback(() => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content, onCopy]);

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== message.content) {
      onEdit(message.id, editValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`group flex gap-3 px-4 md:px-6 py-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-isuzu-violet text-white"
            : "bg-isuzu-gold/10 text-isuzu-gold border border-isuzu-gold/20"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] md:max-w-[75%] ${isUser ? "text-right" : "text-left"}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-isuzu-violet text-white rounded-tr-sm"
              : message.isError
              ? "bg-red-50 text-red-700 border border-red-200 rounded-tl-sm"
              : "bg-white border border-isuzu-gold/10 text-isuzu-dark rounded-tl-sm shadow-sm"
          }`}
        >
          {/* Model badge for assistant */}
          {!isUser && modeConfig && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className={`w-1.5 h-1.5 rounded-full ${modeConfig.badgeColor}`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {modeConfig.name}
              </span>
              {message.isStreaming && (
                <span className="text-[10px] text-isuzu-violet animate-pulse">typing...</span>
              )}
            </div>
          )}

          {isEditing ? (
            <div className="text-left">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full min-w-[200px] px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white text-sm focus:outline-none focus:border-white/60 resize-none"
                rows={3}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === "Escape") {
                    setIsEditing(false);
                    setEditValue(message.content);
                  }
                }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 rounded bg-white/20 text-white text-xs hover:bg-white/30 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditValue(message.content);
                  }}
                  className="px-3 py-1 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={`markdown-body ${isUser ? "text-white" : ""}`}>
              {isUser ? (
                <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
              ) : (
                <ReactMarkdown
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");
                      if (match) {
                        return <CodeBlock language={match[1]} code={codeString} />;
                      }
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={`flex gap-2 mt-3 flex-wrap ${isUser ? "justify-end" : "justify-start"}`}>
              {message.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/5 border border-black/5 text-xs"
                >
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions and timestamp */}
        <div
          className={`flex items-center gap-2 mt-1 ${isUser ? "justify-end" : "justify-start"}`}
        >
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimestamp(message.timestamp)}
          </span>

          {!isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 opacity-100">
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-isuzu-bg text-gray-400 hover:text-isuzu-violet transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>

              {isUser && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded hover:bg-isuzu-bg text-gray-400 hover:text-isuzu-violet transition-colors"
                  title="Edit message"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              )}

              {!isUser && !message.isError && (
                <button
                  onClick={() => onRegenerate(message.id)}
                  disabled={isLoading}
                  className="p-1 rounded hover:bg-isuzu-bg text-gray-400 hover:text-isuzu-violet transition-colors disabled:opacity-50"
                  title="Regenerate response"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
