"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { ChatSession, Message, AIMode } from "../types";

const STORAGE_KEY = "isuzu-ai-history";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useChatHistory() {
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>(STORAGE_KEY, []);

  const createSession = useCallback(
    (model: AIMode): ChatSession => {
      const newSession: ChatSession = {
        id: generateId(),
        title: "New Conversation",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        model,
      };
      setSessions((prev) => [newSession, ...prev]);
      return newSession;
    },
    [setSessions]
  );

  const updateSession = useCallback(
    (sessionId: string, updates: Partial<ChatSession>) => {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? { ...session, ...updates, updatedAt: Date.now() }
            : session
        )
      );
    },
    [setSessions]
  );

  const addMessage = useCallback(
    (sessionId: string, message: Message) => {
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== sessionId) return session;
          const newMessages = [...session.messages, message];
          let title = session.title;
          if (title === "New Conversation" && message.role === "user") {
            title = message.content.slice(0, 40) + (message.content.length > 40 ? "..." : "");
          }
          return {
            ...session,
            messages: newMessages,
            title,
            updatedAt: Date.now(),
          };
        })
      );
    },
    [setSessions]
  );

  const updateMessage = useCallback(
    (sessionId: string, messageId: string, updates: Partial<Message>) => {
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== sessionId) return session;
          return {
            ...session,
            messages: session.messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
            updatedAt: Date.now(),
          };
        })
      );
    },
    [setSessions]
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    },
    [setSessions]
  );

  const deleteAllSessions = useCallback(() => {
    setSessions([]);
  }, [setSessions]);

  const renameSession = useCallback(
    (sessionId: string, newTitle: string) => {
      updateSession(sessionId, { title: newTitle });
    },
    [updateSession]
  );

  const searchSessions = useCallback(
    (query: string): ChatSession[] => {
      if (!query.trim()) return sessions;
      const lowerQuery = query.toLowerCase();
      return sessions.filter(
        (session) =>
          session.title.toLowerCase().includes(lowerQuery) ||
          session.messages.some((msg) =>
            msg.content.toLowerCase().includes(lowerQuery)
          )
      );
    },
    [sessions]
  );

  return {
    sessions,
    createSession,
    updateSession,
    addMessage,
    updateMessage,
    deleteSession,
    deleteAllSessions,
    renameSession,
    searchSessions,
  };
}
