import { useEffect, useMemo, useState } from "react";
import { fetchApprovedTestimonials } from "../services/github";

const truncate = (value) => (value.length > 120 ? `${value.slice(0, 117).trimEnd()}…` : value);

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTestimonials() {
      setLoading(true);
      setError("");

      try {
        const items = await fetchApprovedTestimonials();
        if (!isMounted) return;

        setTestimonials(items);
        setActive(0);
      } catch {
        if (!isMounted) return;
        setError("Unable to load this content from our servers.");
        setTestimonials([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!modalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const item = useMemo(() => testimonials[active] || null, [active, testimonials]);

  const next = () => setActive((current) => (testimonials.length ? (current + 1) % testimonials.length : 0));
  const previous = () => setActive((current) => (testimonials.length ? (current - 1 + testimonials.length) % testimonials.length : 0));

  if (loading) {
    return (
      <section className="testimonials section-container section" id="testimonials">
        <div className="section-heading">
          <p className="eyebrow">04 / Kind words</p>
          <h2>Built with people.</h2>
        </div>
        <div className="message-card">Loading testimonials…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testimonials section-container section" id="testimonials">
        <div className="section-heading">
          <p className="eyebrow">04 / Kind words</p>
          <h2>Built with people.</h2>
        </div>
        <div className="message-card error-card">{error}</div>
      </section>
    );
  }

  if (!testimonials.length) {
    return (
      <section className="testimonials section-container section" id="testimonials">
        <div className="section-heading">
          <p className="eyebrow">04 / Kind words</p>
          <h2>Built with people.</h2>
        </div>
        <div className="message-card">No testimonials to display yet.</div>
      </section>
    );
  }

  return (
    <section className="testimonials section-container section" id="testimonials">
      <div className="section-heading">
        <p className="eyebrow">04 / Kind words</p>
        <h2>Built with people.</h2>
      </div>

      <div className="testimonial-shell">
        <button className="carousel-control" type="button" aria-label="Previous testimonial" onClick={previous}>←</button>

        <button
          key={item.id}
          className="testimonial-card testimonial-card-enter"
          type="button"
          onClick={() => setModalOpen(true)}
        >
          <span className="quote-mark">“</span>
          <p>{truncate(item.body || item.title)}</p>
          <strong>{item.author}</strong>
          <small>Community member</small>
          <span className="see-more">See more</span>
        </button>

        <button className="carousel-control" type="button" aria-label="Next testimonial" onClick={next}>→</button>
      </div>

      <div className="carousel-dots" aria-label="Testimonial slides">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            className={index === active ? "active" : ""}
            type="button"
            aria-label={`Show testimonial ${index + 1}`}
            onClick={() => setActive(index)}
          />
        ))}
      </div>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setModalOpen(false)}>
          <div
            className="testimonial-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="modal-hint">[ESC to close]</span>
            <button className="modal-close" type="button" aria-label="Close testimonial" onClick={() => setModalOpen(false)}>×</button>
            <span className="quote-mark">“</span>
            <h3 id="testimonial-title">{item.author}</h3>
            <p>{item.body || item.title}</p>
          </div>
        </div>
      )}
    </section>
  );
}
