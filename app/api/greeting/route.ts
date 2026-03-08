import { buildVisitorContext } from "@/lib/personalization/context";
import { greetingStrategy } from "@/lib/personalization/strategies/greeting";

export async function GET(request: Request) {
  try {
    const context = buildVisitorContext(request.headers);
    const stream = greetingStrategy.execute(context);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch {
    return new Response("Hello.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
