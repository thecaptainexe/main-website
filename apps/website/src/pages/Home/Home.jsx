import { useEffect, useState } from "react";
import DiscordCard from "../../components/DiscordCard";
import Testimonials from "../../components/Testimonials";
import { SITE_CONFIG } from "../../config/site";
import { fetchGithubProjectRepos, fetchGithubStats } from "../../services/github";

const CDN_ASSET_BASE_URL = "https://cdn.thecaptainexe.me/assets";

const techStack = [
  ["Android", "android.svg"],
  ["CSS", "css.svg"],
  ["Git", "git.svg"],
  ["Discord.js", "discordjs.svg"],
  ["Node.js", "nodedotjs.svg"],
  ["TypeScript", "typescript.svg"],
  ["JavaScript", "javascript.svg"],
  ["React", "react.svg"],
  ["Python", "python.svg"],
  ["Lua", "roblox.svg"],
  ["Go", "go.svg"],
];

function SocialIcon({ type }) {
  if (type === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.9-.7 2.3-1.1.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.7 1.1.7 2.2v3.3c0 .3.2.7.8.6A11.3 11.3 0 0 0 12 .7Z"
        />
      </svg>
    );
  }

  if (type === "x") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.4L2.8 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4.1H6.5l11.3 15.7Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.7 3.1-4.2 3.1-7.4Z" />
      <path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.4l-3.2-2.5c-.9.6-2.1 1-3.7 1-2.9 0-5.3-2-6.2-4.7H2.5v2.6A10.4 10.4 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M5.8 13.4a6.2 6.2 0 0 1 0-3.9V6.9H2.5a10.4 10.4 0 0 0 0 9l3.3-2.5Z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.8l3.3-3.3C17.2 1.7 14.8 1 12 1A10.4 10.4 0 0 0 2.5 6.9l3.3 2.6C6.7 6.8 9.1 4.8 12 4.8Z" />
    </svg>
  );
}

void SocialIcon;

function Navbar({ navigate }) {
  return (
    <nav className="navbar section-container" aria-label="Primary navigation">
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>
        CAPTAIN<span>.</span>
      </a>
      <div className="nav-links">
        <a href="/#about">About</a>
        <a href="/#stats">Stats</a>
        <a href="/#projects">Projects</a>
      </div>
      <a className="nav-contact" href="/contact" onClick={(event) => { event.preventDefault(); navigate("/contact"); }}>
        Contact
      </a>
    </nav>
  );
}

function Hero({ navigate }) {
  return (
    <section className="hero section-container" id="home">
      <div className="hero-copy">
        <p className="eyebrow">Developer / Builder / Creator</p>
        <h1>
          HEY, I&apos;M
          <span> CAPTAIN</span>
        </h1>
        <p className="hero-description">
          I build websites, tools, and communities that are actually useful and fun to use.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            View my work
          </a>
          <a
            className="button button-secondary"
            href="/contact"
            onClick={(event) => {
              event.preventDefault();
              navigate("/contact");
            }}
          >
            Say hi
          </a>
        </div>

        <div className="social-links" aria-label="Social links">
          {[
            ["roblox", "Roblox", "roblox.svg"],
            ["x", "X", "x.svg"],
            ["googleDeveloper", "Google Developers", "google.svg"],
            ["github", "GitHub", "github.svg"],
          ].map(([type, label, icon]) => (
            <a
              href={SITE_CONFIG.social[type] || "#"}
              target={SITE_CONFIG.social[type] ? "_blank" : undefined}
              rel={SITE_CONFIG.social[type] ? "noreferrer" : undefined}
              aria-label={SITE_CONFIG.social[type] ? label : `${label} link coming soon`}
              aria-disabled={!SITE_CONFIG.social[type]}
              onClick={(event) => {
                if (!SITE_CONFIG.social[type]) event.preventDefault();
              }}
              key={type}
            >
              <img src={`${CDN_ASSET_BASE_URL}/${icon}`} alt="" width="21" height="21" />
            </a>
          ))}
        </div>
      </div>

      <div className="hero-orbit" aria-label="Rotating three-dimensional wireframe geometry" role="img">
        <div className="geometry-scene">
          <div className="geometry-layer geometry-layer-outer">
            <span className="geometry-face face-a" />
            <span className="geometry-face face-b" />
            <span className="geometry-edge edge-a" />
            <span className="geometry-edge edge-b" />
          </div>
          <div className="geometry-layer geometry-layer-middle">
            <span className="geometry-ring ring-x" />
            <span className="geometry-ring ring-y" />
            <span className="geometry-ring ring-z" />
          </div>
          <div className="geometry-layer geometry-layer-inner">
            <span className="inner-poly inner-poly-front" />
            <span className="inner-poly inner-poly-back" />
            <span className="inner-core" />
          </div>
          <div className="geometry-points" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <i key={index} className={`geometry-point point-${index + 1}`} />
            ))}
          </div>
        </div>
        <span className="globe-caption">BUILD / SHIP / REPEAT</span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section-container section" id="about">
      <div className="section-heading">
        <p className="eyebrow">01 / About</p>
        <h2>Building with intent.</h2>
      </div>

      <div className="about-layout">
        <DiscordCard />

        <div className="about-content">
          <p>
            I&apos;m a developer who loves turning ideas into real projects. I build websites, tools, and other things that are useful, look good, and have a bit of personality.
          </p>

          <div className="tech-grid" aria-label="Technology stack">
            {techStack.map(([technology, icon]) => (
              <span className="tech-pill" key={technology}>
                <img className="pill-icon" src={`${CDN_ASSET_BASE_URL}/${icon}`} alt="" width="18" height="18" loading="lazy" />
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUpValue({ value, targetId }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = document.getElementById(targetId);
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [targetId]);

  useEffect(() => {
    if (!started || !Number.isFinite(value)) {
      return undefined;
    }

    let frameId = 0;
    const startedAt = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startedAt) / 1100, 1);
      const nextValue = Math.round(value * (1 - Math.pow(1 - progress, 3)));
      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [started, value]);

  return started ? displayValue.toLocaleString() : "0";
}

function Stats() {
  const [stats, setStats] = useState([0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadStats() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchGithubStats();
        if (ignore) return;

        setStats([
          result.yearsExperience,
          result.projectsDone,
          result.ongoingProjects,
          result.githubCommits,
        ]);
      } catch {
        if (!ignore) {
          setError("Unable to load this content from our servers.");
          setStats([0, 0, 0, 0]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadStats();
    return () => {
      ignore = true;
    };
  }, []);

  const labels = ["Years Experience", "Projects Done", "Ongoing Projects", "GitHub Commits"];

  return (
    <section className="section-container section stats-section" id="stats">
      <div className="section-heading">
        <p className="eyebrow">02 / Numbers</p>
        <h2>Built over time.</h2>
      </div>

      {loading && <div className="message-card">Loading statistics…</div>}
      {error && !loading && <div className="message-card error-card">{error}</div>}

      {!loading && !error && (
        <div className="stats-grid">
          {labels.map((label, index) => (
            <article className="stat-card" id={`stat-${label}`} key={label}>
              <strong>
                <CountUpValue value={stats[index]} targetId={`stat-${label}`} />
              </strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Projects({ navigate }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      setLoading(true);
      setError("");

      try {
        const items = await fetchGithubProjectRepos();
        if (!ignore) {
          setProjects(items);
        }
      } catch {
        if (!ignore) {
          setError("Unable to load this content from our servers.");
          setProjects([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProjects();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="section-container section" id="projects">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">03 / Selected Work</p>
            <h2>Things I&apos;ve shipped.</h2>
          </div>
        </div>
        <div className="message-card">Loading projects…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-container section" id="projects">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">03 / Selected Work</p>
            <h2>Things I&apos;ve shipped.</h2>
          </div>
        </div>
        <div className="message-card error-card">{error}</div>
      </section>
    );
  }

  return (
    <section className="section-container section" id="projects">
      <div className="section-heading section-heading-row">
        <div>
          <p className="eyebrow">03 / Selected Work</p>
          <h2>Things I&apos;ve shipped.</h2>
        </div>

        <button className="button button-secondary button-small" type="button" onClick={() => navigate("/project")}>
          View more
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="message-card">No projects to display yet.</div>
      ) : (
        <div className="projects-grid">
          {projects.slice(0, 3).map((project, index) => (
            <a className="project-card" href={project.html_url} target="_blank" rel="noreferrer" key={project.id || project.name}>
              <div className="project-card-top">
                <span className="project-index">0{index + 1}</span>
                <span className="project-arrow">↗</span>
              </div>

              <div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>

              <div className="project-stats">
                <span>{project.language}</span>
                <span>★ {project.stars}</span>
                <span>⎇ {project.forks}</span>
              </div>

              <div className="project-tags">
                {(project.topics || []).slice(0, 4).map((tag) => (
                  <span key={`${project.name}-${tag}`}>{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Home({ navigate }) {
  return (
    <main>
      <Navbar navigate={navigate} />
      <Hero navigate={navigate} />
      <div className="neon-rule" aria-hidden="true" />
      <About />
      <Testimonials />
      <Projects navigate={navigate} />
      <Stats />
      <div className="site-footer">
        <span>© {new Date().getFullYear()} Captain</span>
        <span>Designed & built with intention</span>
      </div>
    </main>
  );
}
