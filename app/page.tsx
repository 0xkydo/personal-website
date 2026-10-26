import { lastUpdated } from "@/content/bio";
import { socials } from "@/content/links";
import SocialIcon from "@/components/SocialIcon";
import NetworkStats from "@/components/NetworkStats";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <main className="page">
      <header className="page-header">
        <h1 className="page-title">Kydo</h1>
      </header>

      <section>
        <p>
          Co-creator of <strong>Darkbloom</strong> - own and share local AI.
        </p>
        <p>
          <NetworkStats />{" "}
          <ExternalLink href="https://console.darkbloom.dev/stats">Network stats</ExternalLink>.
        </p>
        <p>
          I worked on the executive team at{" "}
          <ExternalLink href="https://eigenlabs.org/">Eigen Labs</ExternalLink>, leading product
          strategy and partnerships. Backed by a16z and others; <strong>$200M+ raised</strong>.
        </p>
      </section>

      <section>
        <h2>Past work</h2>
        <ul>
          <li>
            <strong>Commit Boost</strong>: started the HFT Ethereum validator sidecar, now used
            by <strong>50% of validators ($50B+)</strong>.
          </li>
          <li>
            <strong>EigenCloud</strong>: worked on verifiable compute infrastructure securing{" "}
            <strong>$20B+ in assets</strong>.
          </li>
          <li>
            <strong>Yukon</strong>: worked on open research whose results{" "}
            <ExternalLink href="https://spectrum.ieee.org/google-quantum-cryptography-zero-knowledge">
              surpassed Google&rsquo;s quantum-circuit benchmark
            </ExternalLink>
            , accelerated open-weight AI models{" "}
            <ExternalLink href="https://www.yukon.org/mlxfast">up to 3.3× on Apple Silicon</ExternalLink>
            , and delivered a{" "}
            <ExternalLink href="https://www.yukon.org/lighter">9.5× zero-knowledge prover speedup</ExternalLink>
            .
          </li>
        </ul>

        <p>
          Fellow at the{" "}
          <ExternalLink href="https://thedrcenter.org/">Decentralization Research Center</ExternalLink>
          . Occasional guest lecturer at{" "}
          <ExternalLink href="https://law.stanford.edu/">Stanford Law School</ExternalLink>.
        </p>
      </section>

      <section>
        <h2>Investing</h2>
        <p>
          I invest in founders working at the frontier and help with positioning and
          go-to-market. Co-investments alongside{" "}
          <strong>Paradigm, a16z crypto, and Polychain</strong>.
        </p>
      </section>

      <footer className="footer">
        <span>Last updated: {lastUpdated}</span>
        <nav className="socials" aria-label="Social links">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              <SocialIcon name={s.label} />
            </a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
