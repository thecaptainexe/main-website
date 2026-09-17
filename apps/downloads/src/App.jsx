import { useEffect, useMemo, useState } from "react";

const genericError = "Unable to load this content from our servers.";
const versionLabel = (value = "") => value.replace(/^stable_/, "");
const dateLabel = (value) => value ? new Date(value).toLocaleDateString() : "Not published";

function Header() {
  return <header><a className="brand" href="https://thecaptainexe.me">CAPTAIN<span>.</span></a><nav><a href="https://thecaptainexe.me">Home</a><a href="https://changelog.thecaptainexe.me">Changelog</a><a href="https://status.thecaptainexe.me">Status</a><a href="https://labs.thecaptainexe.me">Labs</a></nav></header>;
}

function Details({ repo, onBack }) {
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");
  useEffect(() => {
    fetch(`/api/downloads?repo=${encodeURIComponent(repo)}`).then((response) => {
      if (!response.ok) throw new Error();
      return response.json();
    }).then((value) => { setData(value); setState("ready"); }).catch(() => setState("error"));
  }, [repo]);
  useEffect(() => {
    document.title = `${repo} Downloads | CaptainEXE`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `${window.location.origin}/${encodeURIComponent(repo)}`;
    return () => { document.title = "Official Downloads | CaptainEXE"; if (canonical) canonical.href = `${window.location.origin}/`; };
  }, [repo]);
  return <><button className="back-link" onClick={onBack}>← All downloads</button>{state === "loading" && <div className="message">Loading release details…</div>}{state === "error" && <div className="message">{genericError}</div>}{state === "ready" && data && <section className="detail">
    <div className="detail-heading"><p className="eyebrow">Verified stable build</p><h1>{data.repository || repo}</h1><p className="lead">{data.description || "No description provided."}</p></div>
    <div className="detail-meta"><span className="badge">Stable</span><span>Last updated {dateLabel(data.updatedAt)}</span></div>
    <h2 className="section-title">Releases</h2>
    {!data.releases?.length && <div className="message">No stable releases are currently available.</div>}
    {data.releases?.length > 0 && <div className="release-table">{data.releases.map((release) => <div className="release-row" key={release.tagName || release.version}><div><strong>{versionLabel(release.tagName || release.version)}</strong><span>{dateLabel(release.publishedAt)}</span></div><a className="button-small" href={release.url} target="_blank" rel="noreferrer">View on GitHub ↗</a></div>)}</div>}
  </section>}</>;
}

export default function App() {
  const [items, setItems] = useState([]); const [query, setQuery] = useState(""); const [state, setState] = useState("loading");
  const [repo, setRepo] = useState(() => window.location.pathname.slice(1));
  useEffect(() => { if (repo) return; fetch("/api/downloads").then((response) => { if (!response.ok) throw new Error(); return response.json(); }).then((data) => { setItems(data.items || []); setState("ready"); }).catch(() => setState("error")); }, [repo]);
  const filtered = useMemo(() => items.filter((item) => `${item.repository} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const open = (name) => { window.history.pushState({}, "", `/${encodeURIComponent(name)}`); setRepo(name); window.scrollTo(0, 0); };
  useEffect(() => { const handler = () => setRepo(window.location.pathname.slice(1)); window.addEventListener("popstate", handler); return () => window.removeEventListener("popstate", handler); }, []);
  return <main className="shell"><Header />{repo ? <Details repo={decodeURIComponent(repo)} onBack={() => { window.history.pushState({}, "", "/"); setRepo(""); }} /> : <><p className="eyebrow">Stable software</p><h1>Official Downloads <img className="verified-inline" src="https://cdn.thecaptainexe.me/assets/verified.gif" alt="Verified" /></h1><p className="lead">Stable releases for CaptainEXE applications. GitHub handles release downloads.</p><div className="toolbar"><input aria-label="Search downloads" placeholder="Search applications…" value={query} onChange={(event) => setQuery(event.target.value)} /></div>{state === "loading" && <div className="message">Loading applications…</div>}{state === "error" && <div className="message">{genericError}</div>}{state === "ready" && !items.length && <div className="message">No applications are currently available.</div>}{state === "ready" && items.length > 0 && !filtered.length && <div className="message">No applications match your search.</div>}<div className="grid">{filtered.map((item) => <article className="card" key={item.repository}><div className="meta"><strong>{item.repository}</strong><span className="badge">Stable</span></div><p>{item.description || "No description provided."}</p><h2>{versionLabel(item.version) || "No stable release available"}</h2><button className="button-small" onClick={() => open(item.repository)}>Learn more →</button></article>)}</div></>}</main>;
}
