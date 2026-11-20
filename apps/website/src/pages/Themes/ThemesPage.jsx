import { useEffect, useMemo, useState } from "react";
import { categories, themes } from "./themeData";

function Icon({ name }) {
  if (name === "grid") return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" /></svg>
  );
  if (name === "shuffle") return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3h4v4M3 7h4c5 0 5 10 10 10h4M17 17h4v4M3 17h4c2 0 3-2 4-4M14 10c1-2 2-3 4-3h3" /></svg>
  );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Zm8 14 .7 2.3L23 19l-2.3.7L20 22l-.7-2.3L17 19l2.3-.7L20 16Z" /></svg>
  );
}

function ThemeVisual({ theme, compact = false }) {
  return (
    <div className={`theme-visual visual-${theme.slug} ${compact ? "is-compact" : ""}`}>
      <div className="visual-grid" />
      <div className="visual-orbit" />
      <div className="visual-scanline" />
      <span className="visual-chip">LIVE / {theme.category.toUpperCase()}</span>
      <div className="visual-copy">
        <span>CAPTAIN.EXE / THEME PREVIEW</span>
        <strong>{theme.title}</strong>
        {!compact && <small>{theme.description}</small>}
      </div>
      {theme.slug === "duck-pond-chaos" && (
        <div className="ducks" aria-hidden="true"><span>DUCK</span><span>DUCK</span><span>DUCK</span></div>
      )}
      {theme.slug === "dmv-waiting-line-ticket" && (
        <div className="dmv-board"><b>NOW SERVING A184</b><span>YOUR NUMBER B927</span><small>EST. WAIT 4 HOURS</small></div>
      )}
      {theme.slug === "matrix-terminal" && (
        <div className="matrix-rain" aria-hidden="true">101011<br />00110<br />11001<br />01010<br />10011</div>
      )}
      {theme.slug === "floor-is-lava" && (
        <div className="lava-lake" aria-hidden="true"><i /><i /><i /></div>
      )}
    </div>
  );
}

function Navbar({ navigate }) {
  return (
    <nav className="navbar section-container" aria-label="Primary navigation">
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>CAPTAIN<span>.</span></a>
      <div className="nav-links">
        <a href="/#about">About</a>
        <a href="/#projects">Projects</a>
        <a href="/themes" aria-current="page">Themes</a>
      </div>
      <a className="nav-contact" href="/contact" onClick={(event) => { event.preventDefault(); navigate("/contact"); }}>Contact</a>
    </nav>
  );
}

export default function ThemesPage({ navigate }) {
  const saved = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem("captain-themes") || "{}");
    } catch {
      return {};
    }
  }, []);
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [randomMode, setRandomMode] = useState(Boolean(saved.randomMode));
  const [interval, setInterval] = useState(saved.interval || "refresh");
  const [screensaver, setScreensaver] = useState(false);

  const visible = themes.filter((theme) =>
    (category === "All" || theme.category === category) &&
    `${theme.title} ${theme.description}`.toLowerCase().includes(query.toLowerCase())
  );
  const selected = themes.find((theme) => theme.id === selectedId) || themes[0];

  useEffect(() => {
    window.localStorage.setItem("captain-themes", JSON.stringify({ randomMode, interval }));
  }, [randomMode, interval]);

  useEffect(() => {
    if (!randomMode || interval === "refresh") return undefined;
    const timer = window.setInterval(() => setSelectedId(Math.floor(Math.random() * themes.length) + 1), Number(interval));
    return () => window.clearInterval(timer);
  }, [randomMode, interval]);

  useEffect(() => {
    if (!screensaver) return undefined;
    const exit = (event) => {
      if (event.key === "Escape") setScreensaver(false);
    };
    window.addEventListener("keydown", exit);
    return () => window.removeEventListener("keydown", exit);
  }, [screensaver]);

  const surprise = () => setSelectedId(Math.floor(Math.random() * themes.length) + 1);
  const toggleRandomMode = () => {
    const nextRandomMode = !randomMode;
    setRandomMode(nextRandomMode);
    if (nextRandomMode) surprise();
  };

  return (
    <main className="themes-page">
      <Navbar navigate={navigate} />
      <section className="themes-shell section-container">
        <header className="themes-heading">
          <div>
            <p className="eyebrow">The internet&apos;s weird little wardrobe</p>
            <h1>Pick a vibe<span>.</span></h1>
            <p>Browse tiny worlds made for procrastinating beautifully. Leave one running like a screensaver, or let chaos pick for you.</p>
          </div>
          <div className="theme-count"><strong>{themes.length}</strong><span>visual experiments</span></div>
        </header>

        <div className="themes-layout">
          <aside className="theme-sidebar">
            <div className="sidebar-heading"><span>Theme index</span><b>{String(visible.length).padStart(3, "0")}</b></div>
            <label className="theme-search">
              <span className="sr-only">Search themes</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the weirdness..." />
              <span aria-hidden="true">⌕</span>
            </label>
            <div className="category-list">
              {categories.map((item) => (
                <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>
                  <span>{item}</span>
                  <small>{item === "All" ? themes.length : themes.filter((theme) => theme.category === item).length}</small>
                </button>
              ))}
            </div>
            <div className="sidebar-note"><Icon name="spark" /><span>Leave random mode running. Your monitor deserves some drama.</span></div>
          </aside>

          <div className="themes-main">
            <div className="themes-toolbar">
              <div className="mode-toggle" role="group" aria-label="Theme mode">
                <button className={!randomMode ? "active" : ""} onClick={() => setRandomMode(false)}><Icon name="grid" />Browse</button>
                <button className={randomMode ? "active" : ""} onClick={toggleRandomMode}><Icon name="shuffle" />Random mode</button>
              </div>
              <div className="toolbar-actions">
                {randomMode && (
                  <select value={interval} onChange={(event) => setInterval(event.target.value)} aria-label="Random interval">
                    <option value="refresh">Every refresh</option>
                    <option value="30000">Every 30 seconds</option>
                    <option value="60000">Every minute</option>
                  </select>
                )}
                <button className="screensaver-button" onClick={() => setScreensaver(true)}><Icon name="spark" />Screensaver</button>
              </div>
            </div>

            <div className="feature-preview">
              <ThemeVisual theme={selected} />
              <div className="feature-copy">
                <span className="feature-label">Currently viewing / {String(selected.id).padStart(3, "0")}</span>
                <h2>{selected.title}</h2>
                <p>{selected.description}</p>
                <button className="button button-primary" onClick={surprise}>Surprise me ↗</button>
              </div>
            </div>

            <div className="theme-grid">
              {visible.map((theme) => (
                <button className={`theme-card ${theme.id === selectedId ? "selected" : ""}`} onClick={() => setSelectedId(theme.id)} key={theme.id}>
                  <ThemeVisual theme={theme} compact />
                  <span className="theme-card-copy"><b>{theme.title}</b><small>{theme.description}</small></span>
                  <i>↗</i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {screensaver && (
        <div className="screensaver-overlay" role="dialog" aria-modal="true" aria-label="Theme screensaver">
          <ThemeVisual theme={selected} />
          <div className="screensaver-hud">
            <span>CAPTAIN.EXE / SCREENSAVER</span>
            <strong>{selected.title}</strong>
            <small>Move the mouse or press Escape to exit</small>
          </div>
          <button onClick={() => setScreensaver(false)}>Exit ↗</button>
        </div>
      )}
    </main>
  );
}
