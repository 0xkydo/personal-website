import { describe, it, expect } from "vitest";
import { formatCompact, parseStats } from "@/lib/darkbloom";

describe("formatCompact", () => {
  it("rounds down to whole billions and millions", () => {
    expect(formatCompact(986_585_172_688)).toBe("986B");
    expect(formatCompact(314_507_527)).toBe("314M");
  });

  it("keeps one decimal below 10 of a unit", () => {
    expect(formatCompact(1_234_000_000_000)).toBe("1.2T");
    expect(formatCompact(1_000_000_000_000)).toBe("1T");
  });

  it("leaves small numbers as is", () => {
    expect(formatCompact(55)).toBe("55");
  });
});

describe("parseStats", () => {
  it("extracts totals and counts distinct countries", () => {
    const stats = parseStats({
      total_tokens: 10,
      total_requests: 5,
      provider_regions: [
        { country_code: "US" },
        { country_code: "us" },
        { country_code: "JP" },
        { country_code: "" },
        {},
      ],
    });
    expect(stats).toEqual({ tokens: 10, requests: 5, countries: 2 });
  });

  it("returns null for bad payloads", () => {
    expect(parseStats(null)).toBeNull();
    expect(parseStats({ total_tokens: "x", total_requests: 5, provider_regions: [] })).toBeNull();
  });
});
