import React from "react";
import { Link } from "react-router-dom";
import { useCommission } from "../context/CommissionContext";

const SAMPLE_PAIRS = [
  { commission_id: "COM-001001", client_id: "CLT-10001", status: "in_progress", title: "Celestial Warrior" },
  { commission_id: "COM-001003", client_id: "CLT-10003", status: "in_progress", title: "PixelBrew Logo" },
  { commission_id: "COM-001005", client_id: "CLT-10005", status: "in_progress", title: "Platformer Sprite Sheet" },
  { commission_id: "COM-001002", client_id: "CLT-10002", status: "completed", title: "Neon Dystopia" },
  { commission_id: "COM-001004", client_id: "CLT-10004", status: "on_hold", title: "Family Portrait" },
  { commission_id: "COM-001006", client_id: "CLT-10006", status: "cancelled", title: "The Glass Meridian" },
];

const FEATURES = [
  {
    icon: "◎",
    title: "Dual-Key Search",
    desc: "Secure record lookup using Commission ID and Client ID together — ensuring only you access your project.",
  },
  {
    icon: "✦",
    title: "Smart Field Control",
    desc: "Only permitted fields are editable. Delivery date and revision count can be modified for active commissions.",
  },
  {
    icon: "◈",
    title: "Status-Gated Updates",
    desc: "Business rules enforce that only in-progress commissions accept changes — protecting completed work.",
  },
  {
    icon: "⬡",
    title: "Real-Time Validation",
    desc: "Client and server-side validation with detailed error messages guide every interaction.",
  },
];

export default function HomePage() {
  const { setSearchInput } = useCommission();

  const fillSearch = (pair) => {
    setSearchInput({ commission_id: pair.commission_id, client_id: pair.client_id });
  };

  return (
    <div className="home">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__grid" />
        </div>
        <div className="container hero__content">
          <div className="hero__eyebrow animate-fade-up">
            <span className="hero__dot" />
            Digital Art Commission Management System
          </div>
          <h1 className="hero__title animate-fade-up" style={{ animationDelay: "0.05s" }}>
            Your Creative Work,<br />
            <em>Professionally Managed.</em>
          </h1>
          <p className="hero__subtitle animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Track, review, and update digital art commissions with precision.
            Full visibility. Controlled edits. Zero miscommunication.
          </p>
          <div className="hero__actions animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <Link to="/search" className="btn btn--primary btn--lg">
              Track Your Commission →
            </Link>
            <a href="#demo" className="btn btn--ghost btn--lg">
              View Demo Records
            </a>
          </div>
          <div className="hero__stats animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {[["10", "Sample Records"], ["5", "Status Types"], ["4", "Editable Fields"]].map(([n, l]) => (
              <div key={l} className="hero__stat">
                <span className="hero__stat-number">{n}</span>
                <span className="hero__stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__scroll-hint">scroll ↓</div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">System Design</span>
            <h2 className="section-title">Built Around Real Workflows</h2>
          </div>
          <div className="features__grid stagger">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card animate-fade-up">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO RECORDS ────────────────────────────────────────────────────── */}
      <section className="demo" id="demo">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Sample Data</span>
            <h2 className="section-title">Live Demo Records</h2>
            <p className="section-desc">
              Click any record below to auto-fill the search form. Then track and update the commission.
            </p>
          </div>
          <div className="demo__grid stagger">
            {SAMPLE_PAIRS.map((p) => (
              <Link
                to="/search"
                key={p.commission_id}
                className="demo-card animate-fade-up"
                onClick={() => fillSearch(p)}
              >
                <div className="demo-card__header">
                  <code className="demo-card__id">{p.commission_id}</code>
                  <span className={`badge badge--${p.status.replace("_", "-")}`}>
                    {p.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="demo-card__title">{p.title}</div>
                <div className="demo-card__client">Client: {p.client_id}</div>
                <div className="demo-card__cta">
                  {p.status === "in_progress" ? "✎ View & Edit →" : "◎ View Details →"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ────────────────────────────────────────────────────────── */}
      <section className="workflow">
        <div className="container container--narrow">
          <div className="section-header">
            <span className="section-tag">Application Flow</span>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="workflow__steps">
            {[
              ["01", "Enter IDs", "Input your Commission ID (COM-XXXXXX) and Client ID (CLT-XXXXX) in the search form."],
              ["02", "Validate", "Client-side JS checks format instantly. Server validates existence against MongoDB."],
              ["03", "View Record", "Full commission details displayed — project info, status, milestones, and artist."],
              ["04", "Check Status", "System checks if status is 'in_progress'. Only then are edit fields unlocked."],
              ["05", "Update Fields", "Modify delivery date, revision count, priority, or client notes as needed."],
              ["06", "Get Result", "A success page confirms the update, or a failure page explains the restriction."],
            ].map(([num, title, desc]) => (
              <div key={num} className="workflow__step">
                <div className="workflow__step-num">{num}</div>
                <div className="workflow__step-body">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ── Hero ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 0 80px;
          overflow: hidden;
        }
        .hero__bg { position: absolute; inset: 0; pointer-events: none; }
        .hero__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.12;
        }
        .hero__orb--1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #c9963a, transparent);
          top: -100px; right: -100px;
        }
        .hero__orb--2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #7a5c2e, transparent);
          bottom: 0; left: -50px;
        }
        .hero__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,150,58,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,150,58,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }
        .hero__content { position: relative; z-index: 1; }
        .hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold-bright);
          margin-bottom: 24px;
        }
        .hero__dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--gold-bright);
          box-shadow: 0 0 8px var(--gold-bright);
          animation: pulse-gold 2s ease-in-out infinite;
        }
        .hero__title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 24px;
          max-width: 800px;
        }
        .hero__title em {
          font-style: italic;
          background: linear-gradient(135deg, var(--gold-mid), var(--gold-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero__subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 40px;
        }
        .hero__actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 64px; }
        .hero__stats {
          display: flex;
          gap: 40px;
          padding-top: 32px;
          border-top: var(--border-subtle);
          width: fit-content;
        }
        .hero__stat { display: flex; flex-direction: column; gap: 2px; }
        .hero__stat-number {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 600;
          color: var(--gold-bright);
          line-height: 1;
        }
        .hero__stat-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .hero__scroll-hint {
          position: absolute;
          bottom: 40px; left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: var(--text-ghost);
          text-transform: uppercase;
        }

        /* ── Section shared ── */
        .section-header { text-align: center; margin-bottom: 56px; }
        .section-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold-bright);
          margin-bottom: 12px;
        }
        .section-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .section-desc { color: var(--text-secondary); max-width: 480px; margin: 0 auto; }

        /* ── Features ── */
        .features { padding: 100px 0; background: var(--bg-deep); }
        .features__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .feature-card {
          background: var(--bg-card);
          border: var(--border-dim);
          border-radius: var(--r-lg);
          padding: 32px 28px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(201,150,58,0.06), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover { border-color: var(--gold-dim); transform: translateY(-2px); }
        .feature-card:hover::before { opacity: 1; }
        .feature-card__icon {
          font-size: 1.5rem;
          color: var(--gold-bright);
          margin-bottom: 16px;
          display: block;
        }
        .feature-card__title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .feature-card__desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; }

        /* ── Demo records ── */
        .demo { padding: 100px 0; }
        .demo__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .demo-card {
          background: var(--bg-card);
          border: var(--border-dim);
          border-radius: var(--r-lg);
          padding: 24px;
          text-decoration: none;
          transition: all 0.25s;
          cursor: pointer;
          display: block;
        }
        .demo-card:hover {
          border-color: var(--gold-dim);
          background: var(--bg-raised);
          transform: translateY(-2px);
          box-shadow: var(--shadow-gold);
        }
        .demo-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .demo-card__id {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--gold-mid);
          letter-spacing: 0.05em;
        }
        .demo-card__title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .demo-card__client {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }
        .demo-card__cta {
          font-size: 0.8rem;
          color: var(--gold-bright);
          font-weight: 500;
        }

        /* ── Workflow ── */
        .workflow { padding: 100px 0; background: var(--bg-deep); }
        .workflow__steps { display: flex; flex-direction: column; gap: 0; }
        .workflow__step {
          display: flex;
          gap: 28px;
          padding: 28px 0;
          border-bottom: var(--border-subtle);
          align-items: flex-start;
        }
        .workflow__step:last-child { border-bottom: none; }
        .workflow__step-num {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--gold-bright);
          letter-spacing: 0.1em;
          padding-top: 4px;
          flex-shrink: 0;
          width: 28px;
        }
        .workflow__step-body h4 {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 6px;
          font-weight: 500;
        }
        .workflow__step-body p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; }
      `}</style>
    </div>
  );
}
