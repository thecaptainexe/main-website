import { useEffect, useState } from "react";
import { SITE_CONFIG } from "../../config/site";
import { fetchGithubProjectRepos } from "../../services/github";

function Navbar({ navigate }) {
  return (
    <nav className="navbar section-container" aria-label="Primary navigation">
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>CAPTAIN<span>.</span></a>
      <div className="nav-links">
        <a href="/#about">About</a>
        <a href="/#stats">Stats</a>
        <a href="/project" aria-current="page">Projects</a>
      </div>
      <a className="nav-contact" href="/contact" onClick={(event) => { event.preventDefault(); navigate("/contact"); }}>Contact</a>
    </nav>
  );
}

export default function ProjectsPage({ navigate }) {
  const [projects, setProjects] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let ignore = false;
    fetchGithubProjectRepos()
      .then((items) => {
        if (!ignore) {
          setProjects(items);
          setState("ready");
        }
      })
      .catch(() => {
        if (!ignore) setState("error");
      });
    return () => { ignore = true; };
  }, []);

  return (
    <main>
      <Navbar navigate={navigate} />
      <section className="section-container section project-page">
        <div className="section-heading">
          <p className="eyebrow">Projects</p>
          <h1>Everything I&apos;ve shipped.</h1>
          <p className="page-lead">Public GitHub repositories tagged with the <strong>{SITE_CONFIG.githubProjectsTopic}</strong> topic.</p>
        </div>

        {state === "loading" && <div className="message-card">Loading projects…</div>}
        {state === "error" && <div className="message-card error-card">Unable to load this content from our servers.</div>}
        {state === "ready" && !projects.length && <div className="message-card">No projects to display yet.</div>}
        {state === "ready" && projects.length > 0 && (
          <div className="projects-grid projects-grid-all">
            {projects.map((project, index) => (
              <a className="project-card" href={project.html_url} target="_blank" rel="noreferrer" key={project.id || project.name}>
                <div className="project-card-top"><span className="project-index">{String(index + 1).padStart(2, "0")}</span><span className="project-arrow">↗</span></div>
                <div><h2>{project.name}</h2><p>{project.description}</p></div>
                <div className="project-stats"><span>{project.language}</span><span>★ {project.stars}</span><span>⎇ {project.forks}</span></div>
                <div className="project-tags">{(project.topics || []).filter((topic) => topic.toLowerCase() !== SITE_CONFIG.githubProjectsTopic.toLowerCase()).slice(0, 4).map((tag) => <span key={`${project.name}-${tag}`}>{tag}</span>)}</div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
