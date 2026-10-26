export const STATS_URL = "https://console.darkbloom.dev/api/stats";

export interface NetworkStats {
  tokens: number;
  requests: number;
  countries: number;
}

// Shown if the live call fails. Snapshot from October 25, 2026.
export const FALLBACK_STATS: NetworkStats = {
  tokens: 986e9,
  requests: 314e6,
  countries: 55,
};

const UNITS = [
  { value: 1e12, suffix: "T" },
  { value: 1e9, suffix: "B" },
  { value: 1e6, suffix: "M" },
  { value: 1e3, suffix: "K" },
];

// Rounds down so the number never overstates: 986_585_172_688 -> "986B", 1_234e9 -> "1.2T".
export function formatCompact(n: number): string {
  const unit = UNITS.find((u) => n >= u.value);
  if (!unit) return Math.floor(n).toLocaleString("en-US");
  const scaled = n / unit.value;
  const digits = scaled < 10 ? 1 : 0;
  const factor = 10 ** digits;
  const floored = Math.floor(scaled * factor) / factor;
  return `${floored.toFixed(digits).replace(/\.0$/, "")}${unit.suffix}`;
}

// Pulls the three numbers we show out of the (large) Darkbloom stats payload.
// Returns null if anything looks off.
export function parseStats(data: unknown): NetworkStats | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const tokens = Number(d.total_tokens);
  const requests = Number(d.total_requests);

  // Same method as the Darkbloom console: distinct countries across provider regions.
  const regions = Array.isArray(d.provider_regions) ? d.provider_regions : [];
  const codes = new Set<string>();
  for (const r of regions) {
    const code = (r as { country_code?: unknown })?.country_code;
    if (typeof code === "string" && code) codes.add(code.toUpperCase());
  }
  const countries = codes.size;

  if (![tokens, requests, countries].every((n) => Number.isFinite(n) && n > 0)) return null;
  return { tokens, requests, countries };
}
