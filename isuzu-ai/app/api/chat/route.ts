import { NextRequest, NextResponse } from "next/server";
import { AIMode } from "../../types";

export async function POST(request: NextRequest) {
  try {
    const { mode, text }: { mode: AIMode; text: string } = await request.json();

    if (!text || !mode) {
      return NextResponse.json(
        { error: "Missing text or mode" },
        { status: 400 }
      );
    }

    let url: string;
    if (mode === "chatgpt") {
      url = `https://api.synoxcloud.xyz/ai-chat/gpt-5.5?text=${encodeURIComponent(text)}`;
    } else if (mode === "claude") {
      url = `https://api.xvortex.my.id/api/ai/claude?message=${encodeURIComponent(text)}`;
    } else if (mode === "gemini") {
      url = `https://api.xvortex.my.id/api/ai/gemini?text=${encodeURIComponent(text)}`;
    } else {
      return NextResponse.json(
        { error: "Invalid AI mode" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `API returned ${response.status}: ${response.statusText}`,
        },
        { status: 502 }
      );
    }

    const rawText = await response.text();
    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: "Empty response from AI server" },
        { status: 502 }
      );
    }

    let content = rawText.trim();
    try {
      const json = JSON.parse(rawText);
      if (typeof json === "string") {
        content = json;
      } else if (json && typeof json === "object") {
        content =
          json.result ||
          json.response ||
          json.answer ||
          json.data ||
          json.content ||
          json.message ||
          json.text ||
          JSON.stringify(json);
      }
    } catch {
      // Not valid JSON, keep raw text
    }

    return NextResponse.json({ content });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out after 30 seconds" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
