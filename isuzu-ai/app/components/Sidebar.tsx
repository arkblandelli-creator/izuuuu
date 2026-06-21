"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit3,
  Search,
  X,
  Check,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { ChatSession } from "../types";
import { formatTimestamp } from "../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onDeleteAll: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onDeleteAll,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const filteredSessions = searchQuery.trim()
    ? sessions.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : sessions;

  const handleRename = (sessionId: string) => {
    if (editValue.trim()) {
      onRenameSession(sessionId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const startEdit = (session: ChatSession) => {
    setEditingId(session.id);
    setEditValue(session.title);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-screen w-[300px] bg-white border-r border-isuzu-gold/10 z-50 flex flex-col shadow-xl"
      >
        <div className="p-4 border-b border-isuzu-gold/10">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-isuzu-dark text-white hover:bg-isuzu-dark/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>

        <div className="p-4 border-b border-isuzu-gold/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-isuzu-bg border border-transparent focus:border-isuzu-gold/40 focus:outline-none text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              {searchQuery ? "No matches found" : "No conversations yet"}
            </div>
          ) : (
            filteredSessions.map((session) => (
              <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group relative rounded-lg p-3 cursor-pointer transition-all ${
                  currentSessionId === session.id
                    ? "bg-isuzu-violet/10 border border-isuzu-violet/20"
                    : "hover:bg-isuzu-bg border border-transparent"
                }`}
                onClick={() => {
                  if (editingId !== session.id) onSelectSession(session.id);
                }}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-isuzu-gold mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editingId === session.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(session.id);
                            if (e.key === "Escape") {
                              setEditingId(null);
                              setEditValue("");
                            }
                          }}
                          autoFocus
                          className="w-full px-2 py-1 text-sm rounded border border-isuzu-gold/40 focus:outline-none bg-white"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(session.id);
                          }}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-isuzu-dark truncate">
                        {session.title}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(session.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {editingId !== session.id && (
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(session);
                      }}
                      className="p-1.5 rounded hover:bg-isuzu-gold/10 text-gray-500 hover:text-isuzu-gold transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {sessions.length > 0 && (
          <div className="p-4 border-t border-isuzu-gold/10">
            {showDeleteAllConfirm ? (
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Delete all history?</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteAllConfirm(false)}
                    className="flex-1 py-1.5 text-xs rounded bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDeleteAll();
                      setShowDeleteAllConfirm(false);
                    }}
                    className="flex-1 py-1.5 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Delete All
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteAllConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete All History
              </button>
            )}
          </div>
        )}
      </motion.aside>
    </>
  );
}
