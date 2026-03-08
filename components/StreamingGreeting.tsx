"use client";

import { useEffect, useState, useCallback } from "react";

interface StreamingGreetingProps {
  onComplete: () => void;
}

export default function StreamingGreeting({ onComplete }: StreamingGreetingProps) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  const handleComplete = useCallback(() => {
    setDone(true);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGreeting() {
      try {
        const response = await fetch("/api/greeting", {
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          setText("Hello.");
          handleComplete();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;
          const chunk = decoder.decode(value, { stream: true });
          setText((prev) => prev + chunk);
        }

        handleComplete();
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setText("Hello.");
        handleComplete();
      }
    }

    fetchGreeting();

    return () => controller.abort();
  }, [handleComplete]);

  return (
    <h1 className="greeting">
      {text}
      {!done && <span className="cursor" />}
    </h1>
  );
}
