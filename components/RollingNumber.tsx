"use client";

import type { CSSProperties } from "react";

// Each digit column holds 0-9 three times, so a digit can spin through a full
// turn before landing on its value.
const STRIP = Array.from({ length: 30 }, (_, i) => i % 10);

interface RollingNumberProps {
  /** Text to show, e.g. "986B+". Digits roll; other characters stay put. */
  text: string;
  /** While true, digits spin in place. When it flips to false they roll to their value. */
  spinning: boolean;
  /** Delay (ms) before the first digit settles; later digits follow one by one. */
  delay?: number;
}

export default function RollingNumber({ text, spinning, delay = 0 }: RollingNumberProps) {
  let digitIndex = 0;

  return (
    <span className={`roll${spinning ? " is-spinning" : ""}`}>
      <span className="sr-only">{spinning ? "Loading" : text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((char, i) => {
          if (!/\d/.test(char)) {
            return (
              <span key={i} className="roll-char">
                {char}
              </span>
            );
          }
          const n = digitIndex++;
          const style = {
            "--target": 10 + Number(char),
            "--settle-delay": `${delay + n * 90}ms`,
            "--spin-speed": `${520 + ((n * 137) % 5) * 60}ms`,
          } as CSSProperties;
          return (
            <span key={i} className="roll-digit" style={style}>
              <span className="roll-strip">
                {STRIP.map((d, j) => (
                  <span key={j}>{d}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
