"use client";

import { useEffect, useState } from "react";
import RollingNumber from "@/components/RollingNumber";
import { FALLBACK_STATS, formatCompact, type NetworkStats as Stats } from "@/lib/darkbloom";

// Keep the spin visible briefly even when the call returns instantly.
const MIN_SPIN_MS = 700;

export default function NetworkStats() {
  const [stats, setStats] = useState<Stats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const started = performance.now();

    async function load() {
      let next = FALLBACK_STATS;
      try {
        const res = await fetch("/api/darkbloom", { signal: controller.signal });
        if (res.ok) next = await res.json();
      } catch {
        // Fall back to the snapshot numbers.
      }
      const wait = Math.max(0, MIN_SPIN_MS - (performance.now() - started));
      setTimeout(() => {
        setStats(next);
        setLoading(false);
      }, wait);
    }

    load();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <>
      <strong>
        <RollingNumber text={`${formatCompact(stats.tokens)}+`} spinning={loading} /> tokens ·{" "}
        <RollingNumber text={`${formatCompact(stats.requests)}+`} spinning={loading} delay={250} />{" "}
        requests
      </strong>{" "}
      since launch. Providers in{" "}
      <strong>
        <RollingNumber text={`${stats.countries}+`} spinning={loading} delay={500} /> countries
      </strong>
      .
    </>
  );
}
