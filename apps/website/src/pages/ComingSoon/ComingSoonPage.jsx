import { useEffect } from "react";

export default function ComingSoonPage({ title, navigate }) {
  useEffect(() => {
    document.title = `${title} — Coming Soon | CaptainEXE`;
    return () => { document.title = "CaptainEXE — Developer, Builder, Creator"; };
  }, [title]);

  return (
    <main>
      <nav className="navbar section-container" aria-label="Primary navigation">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>
          CAPTAIN<span>.</span>
        </a>
        <a className="nav-contact" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>
          Back home
        </a>
      </nav>

      <section className="section-container coming-soon-page">
        <div className="section-heading">
          <p className="eyebrow">{title}</p>
          <h1>Coming soon<span>.</span></h1>
          <p className="page-lead">Something new is on its way. Check back soon.</p>
        </div>
      </section>
    </main>
  );
}
