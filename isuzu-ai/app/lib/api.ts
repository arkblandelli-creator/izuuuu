import { AIMode } from "../types";

export interface AIResponse {
  content: string;
  error?: string;
}

export async function sendMessageToAI(
  mode: AIMode,
  text: string
): Promise<AIResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mode, text }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errMsg = `Server error ${response.status}`;
      try {
        const err = await response.json();
        if (err.error) errMsg = err.error;
      } catch {
        // ignore
      }
      return { content: "", error: errMsg };
    }

    const data = await response.json();
    if (data.error) {
      return { content: "", error: data.error };
    }
    return { content: data.content || "" };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { content: "", error: "Request timed out after 30 seconds" };
    }
    return {
      content: "",
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export function simulateStreamingResponse(
  fullText: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
): () => void {
  let index = 0;
  const chunkSize = 3;
  const intervalMs = 25;

  const interval = setInterval(() => {
    if (index >= fullText.length) {
      clearInterval(interval);
      onComplete();
      return;
    }
    const end = Math.min(index + chunkSize, fullText.length);
    onChunk(fullText.slice(index, end));
    index = end;
  }, intervalMs);

  return () => clearInterval(interval);
}
