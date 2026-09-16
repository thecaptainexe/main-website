import { useEffect, useState } from "react";
import Home from "./pages/Home/Home";
import DiscordCard from "./components/DiscordCard";
import { SITE_CONFIG } from "./config/site";
import ProjectsPage from "./pages/Projects/ProjectsPage";
import { installCursorEffects } from "@captainexe/shared/cursor-effects";
import redirects from "../public/redirects.json";

function CursorEffects() {
  useEffect(() => {
    return installCursorEffects();
  }, []);

  return null;
}

function Contact({ navigate }) {
  const contactLinks = [
    { label: "Gmail", icon: "gmail.svg", href: `mailto:${SITE_CONFIG.contactEmail}` },
    { label: "Roblox", icon: "roblox.svg", href: SITE_CONFIG.social.roblox },
    { label: "X", icon: "x.svg", href: SITE_CONFIG.social.x },
    { label: "Google Developer Profile", icon: "google.svg", href: SITE_CONFIG.social.googleDeveloper },
    { label: "GitHub", icon: "github.svg", href: SITE_CONFIG.social.github },
  ];

  return (
    <main>
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

      <section className="contact-page section-container">
        <div className="contact-intro">
          <p className="eyebrow">Let&apos;s connect</p>
          <h1>
            Say hello<span>.</span>
          </h1>
          <p>
            Find me where I&apos;m building, or use one of the links below.
          </p>

          <div className="contact-actions">
            <a className="button button-primary" href={SITE_CONFIG.social.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="button button-secondary" href={SITE_CONFIG.social.googleDeveloper} target="_blank" rel="noreferrer">
              Google Dev
            </a>
            <a className="button button-secondary" href={`mailto:${SITE_CONFIG.contactEmail}`}>
              Email
            </a>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-card-wrap">
            <DiscordCard />
          </div>

          <div className="contact-links-panel" aria-label="Contact links">
            {contactLinks.map((link) => (
              <a
                className="contact-link"
                href={link.href || "#"}
                target={link.href && !link.href.startsWith("mailto:") ? "_blank" : undefined}
                rel={link.href && !link.href.startsWith("mailto:") ? "noreferrer" : undefined}
                aria-disabled={link.placeholder}
                onClick={(event) => {
                  if (link.placeholder) event.preventDefault();
                }}
                key={link.label}
              >
                <span className="contact-link-label">
                  <img src={`/assets/${link.icon}`} alt="" width="22" height="22" />
                  {link.label}{link.placeholder ? " — coming soon" : ""}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function RedirectPage({ target }) {
  useEffect(() => {
    const timer = window.setTimeout(() => { window.location.assign(target); }, 3000);
    return () => window.clearTimeout(timer);
  }, [target]);
  return <main className="redirect-page section-container"><p className="eyebrow">External link</p><h1>Redirecting<span>.</span></h1><p>Taking you to GitHub in a few seconds.</p><a className="button button-primary" href={target}>Continue now ↗</a></main>;
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const page = (() => {
    if (path === "/contact") return <Contact navigate={navigate} />;
    if (path === "/project") return <ProjectsPage navigate={navigate} />;
    const redirect = redirects[path.replace(/^\/+/, "")];
    if (redirect) return <RedirectPage target={redirect} />;
    return <Home navigate={navigate} />;
  })();

  return <><CursorEffects />{page}</>;
}
