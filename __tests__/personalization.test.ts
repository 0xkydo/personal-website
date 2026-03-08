import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildVisitorContext } from "@/lib/personalization/context";

describe("buildVisitorContext", () => {
  it("extracts all Vercel geo headers", () => {
    const headers = new Headers({
      "x-vercel-ip-city": "San Francisco",
      "x-vercel-ip-country": "US",
      "x-vercel-ip-country-region": "CA",
      "x-vercel-ip-latitude": "37.7749",
      "x-vercel-ip-longitude": "-122.4194",
      "x-vercel-ip-timezone": "America/Los_Angeles",
      "accept-language": "en-US,en;q=0.9",
    });

    const context = buildVisitorContext(headers);

    expect(context.city).toBe("San Francisco");
    expect(context.country).toBe("US");
    expect(context.region).toBe("CA");
    expect(context.latitude).toBe("37.7749");
    expect(context.longitude).toBe("-122.4194");
    expect(context.timezone).toBe("America/Los_Angeles");
    expect(context.locale).toBe("en-US");
    expect(context.timestamp).toBeGreaterThan(0);
  });

  it("handles missing headers gracefully", () => {
    const headers = new Headers();
    const context = buildVisitorContext(headers);

    expect(context.city).toBeUndefined();
    expect(context.country).toBeUndefined();
    expect(context.region).toBeUndefined();
    expect(context.latitude).toBeUndefined();
    expect(context.longitude).toBeUndefined();
    expect(context.timezone).toBeUndefined();
    expect(context.locale).toBeUndefined();
    expect(context.timestamp).toBeGreaterThan(0);
  });

  it("parses accept-language to first locale", () => {
    const headers = new Headers({
      "accept-language": "fr-FR, en-US;q=0.9, de;q=0.8",
    });

    const context = buildVisitorContext(headers);
    expect(context.locale).toBe("fr-FR");
  });
});

describe("greeting strategy", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("buildPrompt includes country info", async () => {
    // Dynamic import to allow mocking
    const { buildPrompt } = await import(
      "@/lib/personalization/strategies/greeting"
    );

    const prompt = buildPrompt({
      country: "JP",
      city: "Tokyo",
      locale: "ja",
      timezone: "Asia/Tokyo",
      timestamp: Date.now(),
    });

    expect(prompt).toContain("JP");
    expect(prompt).toContain("Tokyo");
    expect(prompt).toContain("ja");
    expect(prompt).toContain("Asia/Tokyo");
  });

  it("buildPrompt handles empty context", async () => {
    const { buildPrompt } = await import(
      "@/lib/personalization/strategies/greeting"
    );

    const prompt = buildPrompt({ timestamp: Date.now() });

    expect(prompt).toContain("No location information is available");
  });

  it("cacheKey normalizes country code", async () => {
    const { cacheKey } = await import(
      "@/lib/personalization/strategies/greeting"
    );

    expect(cacheKey("US")).toBe("greeting:us");
    expect(cacheKey("JP")).toBe("greeting:jp");
  });
});
