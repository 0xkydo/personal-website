import { STATS_URL, parseStats } from "@/lib/darkbloom";

// Darkbloom's stats endpoint doesn't allow cross-origin browser calls, so the
// page calls this route instead. It returns only the numbers the page shows.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(STATS_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    const stats = parseStats(await res.json());
    if (!stats) throw new Error("Unexpected payload");

    return Response.json(stats, {
      headers: {
        // A short shared cache keeps numbers live without hitting Darkbloom
        // (a ~1.3MB response) on every single page view.
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
