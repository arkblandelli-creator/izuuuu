"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import {
  Sidebar,
  Header,
  ChatArea,
  InputArea,
  GlowParticles,
  LoadingScreen,
  FloatingNewChatButton,
} from "./components";
import { useChatHistory } from "./hooks/useChatHistory";
import { sendMessageToAI, simulateStreamingResponse } from "./lib/api";
import { generateId } from "./lib/utils";
import { AIMode, Message, Attachment } from "./types";

export default function Home() {
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<AIMode>("chatgpt");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const streamingAbortRef = useRef<(() => void) | null>(null);

  const {
    sessions,
    createSession,
    updateSession,
    addMessage,
    updateMessage,
    deleteSession,
    deleteAllSessions,
    renameSession,
  } = useChatHistory();

  const currentSession = sessions.find((s) => s.id === currentSessionId) || null;

  // App loading screen
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingApp(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Close sidebar on mobile when session selected
  const handleSelectSession = useCallback(
    (sessionId: string) => {
      setCurrentSessionId(sessionId);
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setCurrentMode(session.model);
      }
      setSidebarOpen(false);
    },
    [sessions]
  );

  const handleNewChat = useCallback(() => {
    const session = createSession(currentMode);
    setCurrentSessionId(session.id);
    setSidebarOpen(false);
  }, [createSession, currentMode]);

  const handleModeChange = useCallback(
    (mode: AIMode) => {
      setCurrentMode(mode);
      if (currentSessionId) {
        updateSession(currentSessionId, { model: mode });
      }
    },
    [currentSessionId, updateSession]
  );

  const handleSendMessage = useCallback(
    async (text: string, attachments: Attachment[]) => {
      let sessionId = currentSessionId;
      if (!sessionId) {
        const session = createSession(currentMode);
        sessionId = session.id;
        setCurrentSessionId(sessionId);
      }

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: text,
        timestamp: Date.now(),
        model: currentMode,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      addMessage(sessionId, userMessage);
      setIsResponding(true);

      const attachmentContext =
        attachments.length > 0
          ? `\n\n[Attached files: ${attachments.map((a) => a.name).join(", ")}]`
          : "";

      const fullPrompt = text + attachmentContext;

      try {
        const response = await sendMessageToAI(currentMode, fullPrompt);

        const assistantMessageId = generateId();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          model: currentMode,
          isStreaming: true,
        };

        addMessage(sessionId, assistantMessage);

        if (response.error) {
          updateMessage(sessionId, assistantMessageId, {
            content: `**Error:** ${response.error}`,
            isError: true,
            isStreaming: false,
          });
          setIsResponding(false);
          return;
        }

        // Simulate streaming effect
        let streamedContent = "";
        streamingAbortRef.current = simulateStreamingResponse(
          response.content,
          (chunk) => {
            streamedContent += chunk;
            updateMessage(sessionId, assistantMessageId, {
              content: streamedContent,
            });
          },
          () => {
            updateMessage(sessionId, assistantMessageId, {
              content: streamedContent,
              isStreaming: false,
            });
            setIsResponding(false);
            streamingAbortRef.current = null;
          }
        );
      } catch (error) {
        const errorMessageId = generateId();
        addMessage(sessionId, {
          id: errorMessageId,
          role: "assistant",
          content: `**Error:** ${error instanceof Error ? error.message : "Failed to get response"}`,
          timestamp: Date.now(),
          model: currentMode,
          isError: true,
        });
        setIsResponding(false);
      }
    },
    [currentSessionId, currentMode, createSession, addMessage, updateMessage]
  );

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }, []);

  const handleRegenerate = useCallback(
    async (messageId: string) => {
      if (!currentSessionId || isResponding) return;
      const session = sessions.find((s) => s.id === currentSessionId);
      if (!session) return;

      const messageIndex = session.messages.findIndex((m) => m.id === messageId);
      if (messageIndex <= 0) return;

      const userMessage = session.messages[messageIndex - 1];
      if (userMessage.role !== "user") return;

      // Remove the assistant message and subsequent messages
      const newMessages = session.messages.slice(0, messageIndex);
      updateSession(currentSessionId, { messages: newMessages });
      setIsResponding(true);

      const attachmentContext =
        userMessage.attachments && userMessage.attachments.length > 0
          ? `\n\n[Attached files: ${userMessage.attachments.map((a) => a.name).join(", ")}]`
          : "";
      const fullPrompt = userMessage.content + attachmentContext;

      try {
        const response = await sendMessageToAI(currentMode, fullPrompt);
        const assistantMessageId = generateId();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          model: currentMode,
          isStreaming: true,
        };

        addMessage(currentSessionId, assistantMessage);

        if (response.error) {
          updateMessage(currentSessionId, assistantMessageId, {
            content: `**Error:** ${response.error}`,
            isError: true,
            isStreaming: false,
          });
          setIsResponding(false);
          return;
        }

        let streamedContent = "";
        streamingAbortRef.current = simulateStreamingResponse(
          response.content,
          (chunk) => {
            streamedContent += chunk;
            updateMessage(currentSessionId, assistantMessageId, {
              content: streamedContent,
            });
          },
          () => {
            updateMessage(currentSessionId, assistantMessageId, {
              content: streamedContent,
              isStreaming: false,
            });
            setIsResponding(false);
            streamingAbortRef.current = null;
          }
        );
      } catch (error) {
        const errorMessageId = generateId();
        addMessage(currentSessionId, {
          id: errorMessageId,
          role: "assistant",
          content: `**Error:** ${error instanceof Error ? error.message : "Failed to get response"}`,
          timestamp: Date.now(),
          model: currentMode,
          isError: true,
        });
        setIsResponding(false);
      }
    },
    [currentSessionId, isResponding, sessions, currentMode, updateSession, addMessage, updateMessage]
  );

  const handleEdit = useCallback(
    async (messageId: string, newContent: string) => {
      if (!currentSessionId || isResponding) return;
      const session = sessions.find((s) => s.id === currentSessionId);
      if (!session) return;

      const messageIndex = session.messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return;

      // Update the edited message and remove all subsequent messages
      const updatedMessages = session.messages
        .slice(0, messageIndex + 1)
        .map((m) => (m.id === messageId ? { ...m, content: newContent } : m));

      updateSession(currentSessionId, { messages: updatedMessages });
      setIsResponding(true);

      const originalAttachments = session.messages[messageIndex].attachments || [];
      const attachmentContext =
        originalAttachments.length > 0
          ? `\n\n[Attached files: ${originalAttachments.map((a) => a.name).join(", ")}]`
          : "";
      const fullPrompt = newContent + attachmentContext;

      try {
        const response = await sendMessageToAI(currentMode, fullPrompt);
        const assistantMessageId = generateId();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          model: currentMode,
          isStreaming: true,
        };

        addMessage(currentSessionId, assistantMessage);

        if (response.error) {
          updateMessage(currentSessionId, assistantMessageId, {
            content: `**Error:** ${response.error}`,
            isError: true,
            isStreaming: false,
          });
          setIsResponding(false);
          return;
        }

        let streamedContent = "";
        streamingAbortRef.current = simulateStreamingResponse(
          response.content,
          (chunk) => {
            streamedContent += chunk;
            updateMessage(currentSessionId, assistantMessageId, {
              content: streamedContent,
            });
          },
          () => {
            updateMessage(currentSessionId, assistantMessageId, {
              content: streamedContent,
              isStreaming: false,
            });
            setIsResponding(false);
            streamingAbortRef.current = null;
          }
        );
      } catch (error) {
        const errorMessageId = generateId();
        addMessage(currentSessionId, {
          id: errorMessageId,
          role: "assistant",
          content: `**Error:** ${error instanceof Error ? error.message : "Failed to get response"}`,
          timestamp: Date.now(),
          model: currentMode,
          isError: true,
        });
        setIsResponding(false);
      }
    },
    [currentSessionId, isResponding, sessions, currentMode, updateSession, addMessage, updateMessage]
  );

  const handleClearChat = useCallback(() => {
    if (!currentSessionId) return;
    const session = sessions.find((s) => s.id === currentSessionId);
    if (!session) return;
    updateSession(currentSessionId, { messages: [] });
  }, [currentSessionId, sessions, updateSession]);

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      deleteSession(sessionId);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
    },
    [deleteSession, currentSessionId]
  );

  const handleDeleteAll = useCallback(() => {
    deleteAllSessions();
    setCurrentSessionId(null);
  }, [deleteAllSessions]);

  const handleSuggestionClick = useCallback(
    (prompt: string) => {
      handleSendMessage(prompt, []);
    },
    [handleSendMessage]
  );

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-isuzu-bg">
      <LoadingScreen isLoading={isLoadingApp} />

      <GlowParticles />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={renameSession}
        onDeleteAll={handleDeleteAll}
      />

      <div className="flex-1 flex flex-col h-full relative z-10">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentMode={currentMode}
          onModeChange={handleModeChange}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatArea
            messages={currentSession?.messages || []}
            isLoading={isResponding}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
            onEdit={handleEdit}
            onSuggestionClick={handleSuggestionClick}
          />

          <InputArea
            onSend={handleSendMessage}
            onClearChat={handleClearChat}
            isLoading={isResponding}
            hasMessages={(currentSession?.messages.length || 0) > 0}
          />
        </main>

        <FloatingNewChatButton
          onClick={handleNewChat}
        />
      </div>
    </div>
  );
}
