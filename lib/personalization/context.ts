import { VisitorContext } from "./types";

export function buildVisitorContext(headers: Headers): VisitorContext {
  return {
    city: headers.get("x-vercel-ip-city") ?? undefined,
    country: headers.get("x-vercel-ip-country") ?? undefined,
    region: headers.get("x-vercel-ip-country-region") ?? undefined,
    latitude: headers.get("x-vercel-ip-latitude") ?? undefined,
    longitude: headers.get("x-vercel-ip-longitude") ?? undefined,
    timezone: headers.get("x-vercel-ip-timezone") ?? undefined,
    locale: headers.get("accept-language")?.split(",")[0]?.trim() ?? undefined,
    timestamp: Date.now(),
  };
}
