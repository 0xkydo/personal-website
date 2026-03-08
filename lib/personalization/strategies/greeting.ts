import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});
import { VisitorContext, PersonalizationStrategy } from "../types";

const CACHE_TTL_SECONDS = 3600; // 1 hour

function buildPrompt(context: VisitorContext): string {
  const parts: string[] = [];

  if (context.country) {
    parts.push(`The visitor is from ${context.country}${context.city ? `, ${context.city}` : ""}.`);
  }
  if (context.timezone) {
    parts.push(`Their timezone is ${context.timezone}.`);
  }
  if (context.locale) {
    parts.push(`Their preferred language is ${context.locale}.`);
  }

  const locationInfo = parts.length > 0 ? parts.join(" ") : "No location information is available.";

  return `You are generating a one-sentence greeting for a personal website (kydo.sh). ${locationInfo}

Write a warm, brief greeting (1 sentence, under 15 words). If you know their language, greet them in that language. Be natural and friendly, not robotic. Do not use emojis. Do not mention the website or yourself. Just the greeting.`;
}

function cacheKey(country: string): string {
  return `greeting:${country.toLowerCase()}`;
}

async function getCachedGreeting(country: string): Promise<string | null> {
  try {
    return await redis.get<string>(cacheKey(country));
  } catch {
    return null;
  }
}

async function cacheGreeting(country: string, greeting: string): Promise<void> {
  try {
    await redis.set(cacheKey(country), greeting, { ex: CACHE_TTL_SECONDS });
  } catch {
    // Cache write failure is non-critical
  }
}

export const greetingStrategy: PersonalizationStrategy<ReadableStream> = {
  name: "greeting",
  mode: "stream",

  execute(context: VisitorContext): ReadableStream {
    const { country } = context;

    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Check cache first
          if (country) {
            const cached = await getCachedGreeting(country);
            if (cached) {
              controller.enqueue(encoder.encode(cached));
              controller.close();
              return;
            }
          }

          // Stream from Claude
          const result = streamText({
            model: anthropic("claude-haiku-4-5-20251001"),
            prompt: buildPrompt(context),
            maxOutputTokens: 50,
          });

          let fullText = "";
          for await (const chunk of result.textStream) {
            fullText += chunk;
            controller.enqueue(encoder.encode(chunk));
          }

          // Cache the result
          if (country && fullText) {
            await cacheGreeting(country, fullText);
          }

          controller.close();
        } catch {
          // Fallback on any error
          controller.enqueue(encoder.encode("Hello."));
          controller.close();
        }
      },
    });
  },
};

// Export for testing
export { buildPrompt, getCachedGreeting, cacheGreeting, cacheKey };
