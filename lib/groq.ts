const GROQ_BASE_URL =
  process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

export const GROQ_MODELS = {
  CODE_COMPLETION: process.env.GROQ_CODE_MODEL || "qwen/qwen3.8-27b",
  CHAT_DEFAULT: process.env.GROQ_CHAT_MODEL || "openai/gpt-oss-120b",
  CHAT_ADVANCED: "openai/gpt-oss-120b",
  CHAT_FAST: "openai/gpt-oss-20b",
} as const;

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqChatOptions {
  messages: GroqMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callGroqChat({
  messages,
  model = GROQ_MODELS.CHAT_DEFAULT,
  temperature = 0.7,
  maxTokens,
}: GroqChatOptions): Promise<string> {
  const apiKey = GROQ_API_KEY || process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Please add your key in .env or .env.local"
    );
  }

  // Smart token limits:
  // - Models with 8,000 token limit (openai/gpt-oss-120b, openai/gpt-oss-20b): allow up to 2,500 tokens for full code generation.
  // - Preview models with 1,000 OTPM ceiling (qwen/qwen3.8-27b): cap safely at 800 tokens.
  const isQwen = model.includes("qwen");
  const defaultTokens = isQwen ? 800 : 2500;
  const safeTokens = maxTokens ? Math.min(maxTokens, isQwen ? 800 : 3000) : defaultTokens;

  let response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: safeTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    // If Groq OTPM rate limit exceeded, retry with lower token limit (500)
    if (response.status === 429 && (errorText.includes("OTPM") || errorText.includes("reduce max_tokens"))) {
      console.warn("Groq OTPM limit hit, retrying with max_tokens: 500...");
      response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const retryData = await response.json();
        return (retryData.choices?.[0]?.message?.content || "").trim();
      }
    }

    throw new Error(
      `Groq API error (${response.status} ${response.statusText}): ${errorText}`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("Invalid response format received from Groq API");
  }

  return content.trim();
}

export async function callGroqCodeCompletion({
  systemPrompt,
  userPrompt,
  model = GROQ_MODELS.CODE_COMPLETION,
  temperature = 0.2,
  maxTokens = 250,
}: {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const messages: GroqMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const rawSuggestion = await callGroqChat({
    messages,
    model,
    temperature,
    maxTokens,
  });

  // Clean markdown fences if any are returned
  let cleaned = rawSuggestion.trim();
  if (cleaned.startsWith("```")) {
    const match = cleaned.match(/```[\w]*\n?([\s\S]*?)```/);
    if (match) {
      cleaned = match[1].trim();
    } else {
      cleaned = cleaned.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
    }
  }

  return cleaned;
}
