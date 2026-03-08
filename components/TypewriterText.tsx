"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterSection {
  id: string;
  speed: number; // chars per second
}

interface TypewriterTextProps {
  startRevealing: boolean;
  sections: TypewriterSection[];
  children: React.ReactNode;
}

export default function TypewriterText({
  startRevealing,
  sections,
  children,
}: TypewriterTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!startRevealing || !containerRef.current) return;

    const container = containerRef.current;
    const sectionElements = sections.map((s) => ({
      el: container.querySelector(`[data-section="${s.id}"]`),
      speed: s.speed,
    }));

    // Collect all text nodes within each section
    type CharInfo = { node: Text; index: number; sectionIdx: number };
    const chars: CharInfo[] = [];

    sectionElements.forEach(({ el }, sectionIdx) => {
      if (!el) return;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        for (let i = 0; i < node.textContent!.length; i++) {
          chars.push({ node, index: i, sectionIdx });
        }
      }
    });

    if (chars.length === 0) {
      setRevealed(true);
      return;
    }

    // Hide all section content using a clip approach
    // We'll use a span-wrapping approach: wrap each character
    // Actually, simpler: use CSS clip-path on each section and animate via a counter

    // Simplest approach: set all sections to have a wrapper with overflow hidden
    // and reveal by setting a CSS variable for character count
    // But the simplest reliable approach: use visibility on a per-section basis
    // and reveal section by section with timing based on char count

    let charIndex = 0;
    let lastTime = 0;
    let currentSectionIdx = 0;
    let charsInCurrentSection = 0;
    let frameId: number;

    // Count chars per section
    const charsPerSection: number[] = [];
    let sIdx = 0;
    let count = 0;
    for (const c of chars) {
      if (c.sectionIdx !== sIdx) {
        charsPerSection.push(count);
        count = 0;
        sIdx = c.sectionIdx;
      }
      count++;
    }
    charsPerSection.push(count);

    // Initially hide all sections
    sectionElements.forEach(({ el }) => {
      if (el) (el as HTMLElement).style.clipPath = "inset(0 100% 0 0)";
    });

    // Animation: reveal sections progressively
    // For each section, transition clipPath from "inset(0 100% 0 0)" to "inset(0 0% 0 0)"
    // over (charCount / speed) seconds

    // Use a simpler char-by-char approach with a wrapper
    // Actually, the cleanest approach that works with arbitrary HTML:
    // Set each section to visibility:visible and use a stepped animation

    // Let's use a progressive approach: accumulate time, determine how many chars
    // should be visible, and set clip-path percentage per section accordingly
    sectionElements.forEach(({ el }) => {
      if (el) {
        (el as HTMLElement).style.clipPath = "inset(0 100% 0 0)";
        (el as HTMLElement).style.visibility = "visible";
      }
    });

    function animate(time: number) {
      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (currentSectionIdx >= sectionElements.length) {
        setRevealed(true);
        return;
      }

      const { el, speed } = sectionElements[currentSectionIdx];
      if (!el) {
        currentSectionIdx++;
        charsInCurrentSection = 0;
        frameId = requestAnimationFrame(animate);
        return;
      }

      const totalChars = charsPerSection[currentSectionIdx] || 1;
      charsInCurrentSection += delta * speed;

      const progress = Math.min(charsInCurrentSection / totalChars, 1);
      (el as HTMLElement).style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;

      if (progress >= 1) {
        (el as HTMLElement).style.clipPath = "none";
        currentSectionIdx++;
        charsInCurrentSection = 0;
      }

      charIndex++;
      if (currentSectionIdx < sectionElements.length) {
        frameId = requestAnimationFrame(animate);
      } else {
        setRevealed(true);
      }
    }

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [startRevealing, sections]);

  return (
    <div
      ref={containerRef}
      className={`typewriter-container ${revealed ? "revealed" : ""}`}
    >
      {children}
      {startRevealing && !revealed && <span className="cursor cursor-typewriter" />}
    </div>
  );
}
