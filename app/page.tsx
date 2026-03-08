"use client";

import { useState, useMemo } from "react";
import StreamingGreeting from "@/components/StreamingGreeting";
import TypewriterText from "@/components/TypewriterText";
import ContentList from "@/components/ContentList";
import { tagline, bio, investing } from "@/content/bio";
import { affiliations } from "@/content/affiliations";
import { articles } from "@/content/articles";
import { reflections } from "@/content/reflections";
import type { Article, Reflection, Affiliation } from "@/content/types";

const sections = [
  { id: "bio", speed: 30 },
  { id: "affiliations", speed: 200 },
  { id: "writing", speed: 200 },
  { id: "investing", speed: 200 },
];

export default function Home() {
  const [greetingDone, setGreetingDone] = useState(false);

  const currentAffiliations = useMemo(
    () => affiliations.filter((a) => a.status === "current"),
    []
  );

  return (
    <main>
      <StreamingGreeting onComplete={() => setGreetingDone(true)} />

      <TypewriterText startRevealing={greetingDone} sections={sections}>
        <section className="section bio" data-section="bio">
          <p>
            <strong>{tagline}</strong>
          </p>
          {bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </section>

        <section className="section" data-section="affiliations">
          <h2 className="section-title">Affiliations</h2>
          <ContentList<Affiliation>
            items={currentAffiliations}
            getUrl={(a) => a.url}
            getKey={(a) => a.name}
            renderItem={(a) => (
              <>
                <span className="item-title">{a.name}</span>
                <span className="meta">{a.title}</span>
              </>
            )}
          />
        </section>

        <section className="section" data-section="writing">
          <h2 className="section-title">Writing</h2>
          <ContentList<Article>
            items={articles}
            getUrl={(a) => a.url}
            getKey={(a) => a.title}
            renderItem={(a) => (
              <>
                <span className="item-title">
                  {a.featured ? "\u2605 " : ""}
                  {a.title}
                </span>
                {(a.publisher || a.date) && (
                  <span className="meta">
                    {[a.publisher, a.date].filter(Boolean).join(" \u00B7 ")}
                  </span>
                )}
              </>
            )}
          />

          <h2 className="section-title" style={{ marginTop: "1.5rem" }}>
            Reflections
          </h2>
          <ContentList<Reflection>
            items={reflections}
            getUrl={(r) => r.url}
            getKey={(r) => r.title}
            renderItem={(r) => (
              <span className="item-title">
                {r.emoji ? `${r.emoji} ` : ""}
                {r.title}
              </span>
            )}
          />
        </section>

        <section className="section" data-section="investing">
          <h2 className="section-title">Investing</h2>
          <p>{investing}</p>
        </section>
      </TypewriterText>

      <footer className="footer">
        <p>kydo.sh</p>
      </footer>
    </main>
  );
}
