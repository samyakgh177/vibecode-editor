import { NextRequest, NextResponse } from "next/server";
import { callGroqChat, GROQ_MODELS, GroqMessage } from "@/lib/groq";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  model?: string;
  mode?: "chat" | "review" | "fix" | "optimize";
  activeFile?: {
    filename: string;
    content: string;
    language?: string;
  };
}

const SYSTEM_PROMPT = `You are a helpful and intelligent AI coding assistant inside the VibeCode web IDE.
You help developers with:
- Explaining code and debugging errors
- Architecture, clean code, and performance optimization
- Writing idiomatic code in TypeScript, JavaScript, Python, Go, Rust, etc.
- Providing refactored snippets and solutions

Formatting guidelines:
- Always use proper markdown formatting.
- When writing code examples, always specify the language in the code fence (e.g., \`\`\`tsx).
- Be direct, clear, and focused on working solutions.`;

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, history = [], model, activeFile } = body;

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate and sanitize history format
    const validHistory: GroqMessage[] = Array.isArray(history)
      ? history
          .filter(
            (msg) =>
              msg &&
              typeof msg === "object" &&
              typeof msg.role === "string" &&
              typeof msg.content === "string" &&
              ["user", "assistant"].includes(msg.role)
          )
          .map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          }))
      : [];

    const recentHistory = validHistory.slice(-10);

    let systemContent = SYSTEM_PROMPT;
    if (activeFile && activeFile.filename && typeof activeFile.content === "string") {
      const truncatedContent =
        activeFile.content.length > 12000
          ? activeFile.content.substring(0, 12000) + "\n... [content truncated for token limits]"
          : activeFile.content;

      systemContent += `\n\n--- CURRENT ACTIVE FILE IN EDITOR ---
File: ${activeFile.filename}
Language: ${activeFile.language || activeFile.filename.split(".").pop() || "text"}
Code:
\`\`\`${activeFile.language || activeFile.filename.split(".").pop() || "text"}
${truncatedContent}
\`\`\`
---
Use the active file code above as your immediate context. When the user asks to add features (like a button, state, handler), explain code, or fix errors, tailor your solution directly to this code and provide clean snippets that fit right in.`;
    }

    const messages: GroqMessage[] = [
      { role: "system", content: systemContent },
      ...recentHistory,
      { role: "user", content: message },
    ];

    const allowedModels = [
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
    ];

    const selectedModel =
      model && allowedModels.includes(model)
        ? model
        : GROQ_MODELS.CHAT_DEFAULT;

    const isQwen = selectedModel.includes("qwen");
    const aiResponse = await callGroqChat({
      messages,
      model: selectedModel,
      temperature: 0.7,
      maxTokens: isQwen ? 800 : 2500,
    });

    return NextResponse.json({
      response: aiResponse,
      model: selectedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal AI service error";

    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
