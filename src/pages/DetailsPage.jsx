import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCommission } from "../context/CommissionContext";
import { format } from "date-fns";

const fmt = (date) => (date ? format(new Date(date), "dd MMM yyyy") : "—");
const fmtCurrency = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

const statusLabel = (s) => s?.replace(/_/g, " ");

const COMMISSION_TYPE_LABELS = {
  character_design: "Character Design",
  illustration: "Illustration",
  concept_art: "Concept Art",
  logo_design: "Logo Design",
  animation: "Animation",
  portrait: "Portrait",
};

const PRIORITY_LABELS = {
  standard: { label: "Standard", color: "var(--text-muted)" },
  express: { label: "Express", color: "var(--accent-amber)" },
  rush: { label: "Rush ⚡", color: "var(--accent-red)" },
};

export default function DetailsPage() {
  const navigate = useNavigate();
  const { commission, meta } = useCommission();

  useEffect(() => {
    if (!commission) navigate("/search");
  }, [commission, navigate]);

  if (!commission) return null;

  const c = commission;
  const completedMilestones = c.milestones?.filter((m) => m.completed).length || 0;
  const totalMilestones = c.milestones?.length || 0;
  const progressPct = totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  const priority = PRIORITY_LABELS[c.priority_level] || PRIORITY_LABELS.standard;

  return (
    <div className="details-page">
      <div className="container details-page__inner">

        {/* ── Breadcrumb ── */}
        <nav className="breadcrumb animate-fade">
          <Link to="/" className="breadcrumb__item">Home</Link>
          <span className="breadcrumb__sep">›</span>
          <Link to="/search" className="breadcrumb__item">Search</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">{c.commission_id}</span>
        </nav>

        {/* ── Page Header ── */}
        <div className="details-header animate-fade-up">
          <div className="details-header__left">
            <div className="details-header__ids">
              <code className="details-id">{c.commission_id}</code>
              <span className="details-sep">×</span>
              <code className="details-id details-id--client">{c.client_id}</code>
            </div>
            <h1 className="details-header__title">{c.project_title}</h1>
            <div className="details-header__meta">
              <span className={`badge badge--${c.status.replace(/_/g, "-")}`}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                {statusLabel(c.status)}
              </span>
              <span className="details-sep-dot" />
              <span className="details-type">{COMMISSION_TYPE_LABELS[c.commission_type] || c.commission_type}</span>
              <span className="details-sep-dot" />
              <span className="details-artist">by {c.artist_name}</span>
            </div>
          </div>
          <div className="details-header__right">
            <div className="details-price">
              <span className="details-price__amount">{fmtCurrency(c.total_price, c.currency)}</span>
              <span className="details-price__label">Total Value</span>
            </div>
          </div>
        </div>

        {/* ── Edit restriction notice ── */}
        {!meta?.is_editable && (
          <div className="restriction-banner animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <span className="restriction-banner__icon">⊘</span>
            <div>
              <strong>Updates Restricted</strong>
              <p>{meta?.update_restriction_reason}</p>
            </div>
          </div>
        )}

        {/* ── Editable notice ── */}
        {meta?.is_editable && (
          <div className="editable-banner animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <span>✎</span>
            <div>
              <strong>This commission is editable</strong>
              <p>You may update: delivery date, revision count, priority level, and client notes.</p>
            </div>
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="details-grid stagger">

          {/* Left column */}
          <div className="details-col-main">

            {/* Project Overview */}
            <div className="card animate-fade-up">
              <h3 className="card-section-title">Project Overview</h3>
              <div className="gold-line" style={{ margin: "16px 0 24px" }} />
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>
                {c.project_description || "No description provided."}
              </p>
              <div className="info-grid">
                <InfoRow label="Commission Type" value={COMMISSION_TYPE_LABELS[c.commission_type]} />
                <InfoRow label="Canvas Resolution" value={c.canvas_resolution} />
                <InfoRow label="File Formats" value={c.file_formats?.join(", ") || "—"} />
                <InfoRow label="Style Tags">
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {c.style_tags?.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                </InfoRow>
                <InfoRow label="Priority Level">
                  <span style={{ color: priority.color, fontWeight: 500 }}>{priority.label}</span>
                </InfoRow>
                <InfoRow label="Revisions Allocated" value={`${c.revision_count} revisions`} />
              </div>
            </div>

            {/* Dates */}
            <div className="card animate-fade-up">
              <h3 className="card-section-title">Timeline</h3>
              <div className="gold-line" style={{ margin: "16px 0 24px" }} />
              <div className="info-grid">
                <InfoRow label="Commission Created" value={fmt(c.created_at)} />
                <InfoRow label="Delivery Date" value={fmt(c.delivery_date)} />
                <InfoRow label="Days Remaining">
                  <DaysChip days={meta?.days_remaining} />
                </InfoRow>
                <InfoRow label="Last Updated" value={fmt(c.updated_at)} />
              </div>
            </div>

            {/* Milestones */}
            {c.milestones?.length > 0 && (
              <div className="card animate-fade-up">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 className="card-section-title">Project Milestones</h3>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--gold-bright)" }}>
                    {completedMilestones}/{totalMilestones} done
                  </span>
                </div>
                <div className="progress-bar-outer">
                  <div className="progress-bar-inner" style={{ width: `${progressPct}%` }} />
                </div>
                {c.milestones.map((m, i) => (
                  <div key={i} className="milestone">
                    <span className={`milestone__dot milestone__dot--${m.completed ? "done" : "pending"}`} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "0.9rem", color: m.completed ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        {m.completed && <span style={{ textDecoration: "line-through", opacity: 0.5 }} />}
                        {m.title}
                      </span>
                      {m.due_date && (
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: 8, fontFamily: "var(--font-mono)" }}>
                          {fmt(m.due_date)}
                        </span>
                      )}
                    </div>
                    {m.completed && <span style={{ fontSize: "0.75rem", color: "var(--accent-green)" }}>✓</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Client Notes */}
            {c.client_notes && (
              <div className="card animate-fade-up">
                <h3 className="card-section-title">Client Notes</h3>
                <div className="gold-line" style={{ margin: "16px 0 20px" }} />
                <blockquote className="client-notes-quote">
                  {c.client_notes}
                </blockquote>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="details-col-side">

            {/* Artist */}
            <div className="card animate-fade-up">
              <h3 className="card-section-title">Artist</h3>
              <div className="gold-line" style={{ margin: "16px 0 20px" }} />
              <div className="artist-card">
                <div className="artist-avatar">{c.artist_name[0]}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", color: "var(--text-primary)" }}>{c.artist_name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{c.artist_specialization}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gold-dim)", marginTop: 4 }}>{c.artist_id}</div>
                </div>
              </div>
            </div>

            {/* Client */}
            <div className="card animate-fade-up">
              <h3 className="card-section-title">Client</h3>
              <div className="gold-line" style={{ margin: "16px 0 20px" }} />
              <div className="info-grid">
                <InfoRow label="Name" value={c.client_name} />
                <InfoRow label="Email" value={c.client_email} />
                <InfoRow label="Country" value={c.client_country} />
              </div>
            </div>

            {/* Reference links */}
            {c.reference_links?.length > 0 && (
              <div className="card animate-fade-up">
                <h3 className="card-section-title">Reference Links</h3>
                <div className="gold-line" style={{ margin: "16px 0 20px" }} />
                {c.reference_links.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" className="ref-link">
                    ↗ {new URL(url).hostname}
                  </a>
                ))}
              </div>
            )}

            {/* Editable fields panel */}
            <div className="card animate-fade-up editable-fields-panel">
              <h3 className="card-section-title">Field Permissions</h3>
              <div className="gold-line" style={{ margin: "16px 0 20px" }} />
              {[
                ["delivery_date", "Delivery Date", meta?.is_editable],
                ["revision_count", "Revision Count", meta?.is_editable],
                ["priority_level", "Priority Level", meta?.is_editable],
                ["client_notes", "Client Notes", meta?.is_editable],
                ["commission_id", "Commission ID", false],
                ["status", "Status", false],
                ["total_price", "Total Price", false],
                ["artist_name", "Artist Name", false],
              ].map(([field, label, editable]) => (
                <div key={field} className="field-perm-row">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: editable ? "var(--text-secondary)" : "var(--text-muted)" }}>{label}</span>
                  <span className={`field-perm-badge ${editable ? "field-perm-badge--edit" : "field-perm-badge--lock"}`}>
                    {editable ? "✎ editable" : "⊘ locked"}
                  </span>
                </div>
              ))}
            </div>

            {/* Action button */}
            {meta?.is_editable ? (
              <Link to="/update" className="btn btn--primary btn--full btn--lg" style={{ textDecoration: "none", textAlign: "center" }}>
                ✎ Edit Commission →
              </Link>
            ) : (
              <button className="btn btn--ghost btn--full" disabled>
                ⊘ Editing Not Available
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .details-page { padding: 100px 0 80px; min-height: 100vh; }
        .details-page__inner { padding-top: 20px; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; }
        .breadcrumb__item { font-size: 0.82rem; color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
        .breadcrumb__item:hover { color: var(--gold-bright); }
        .breadcrumb__sep { color: var(--text-ghost); font-size: 0.85rem; }
        .breadcrumb__current { font-size: 0.82rem; color: var(--gold-bright); font-family: var(--font-mono); }
        .details-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; margin-bottom: 28px; flex-wrap: wrap; }
        .details-id { font-family: var(--font-mono); font-size: 0.82rem; color: var(--gold-mid); letter-spacing: 0.05em; }
        .details-id--client { color: var(--text-muted); }
        .details-sep { color: var(--text-ghost); margin: 0 8px; font-size: 0.85rem; }
        .details-header__ids { display: flex; align-items: center; margin-bottom: 12px; }
        .details-header__title { font-size: clamp(1.6rem, 4vw, 2.4rem); color: var(--text-primary); margin-bottom: 12px; }
        .details-header__meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .details-sep-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--text-ghost); display: inline-block; }
        .details-type { font-size: 0.85rem; color: var(--text-secondary); }
        .details-artist { font-size: 0.85rem; color: var(--text-muted); font-style: italic; }
        .details-price { text-align: right; }
        .details-price__amount { font-family: var(--font-display); font-size: 2rem; color: var(--gold-bright); display: block; }
        .details-price__label { font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }

        .restriction-banner {
          display: flex; gap: 16px; align-items: flex-start;
          background: rgba(192,57,43,0.08); border: 1px solid rgba(192,57,43,0.25);
          border-radius: var(--r-lg); padding: 20px 24px; margin-bottom: 28px;
        }
        .restriction-banner__icon { font-size: 1.2rem; color: var(--accent-red); flex-shrink: 0; padding-top: 2px; }
        .restriction-banner strong { font-size: 0.9rem; color: var(--accent-red); display: block; margin-bottom: 4px; }
        .restriction-banner p { font-size: 0.82rem; color: var(--text-muted); }

        .editable-banner {
          display: flex; gap: 16px; align-items: flex-start;
          background: rgba(201,150,58,0.06); border: 1px solid rgba(201,150,58,0.2);
          border-radius: var(--r-lg); padding: 20px 24px; margin-bottom: 28px;
          font-size: 1rem; color: var(--gold-bright);
        }
        .editable-banner strong { font-size: 0.9rem; color: var(--gold-bright); display: block; margin-bottom: 4px; }
        .editable-banner p { font-size: 0.82rem; color: var(--text-muted); }

        .details-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
        .details-col-main { display: flex; flex-direction: column; gap: 20px; }
        .details-col-side { display: flex; flex-direction: column; gap: 20px; }
        .card-section-title { font-family: var(--font-display); font-size: 1.05rem; color: var(--text-primary); }
        .info-grid { display: flex; flex-direction: column; }

        .progress-bar-outer { background: var(--bg-raised); border-radius: 4px; height: 4px; margin: 16px 0 20px; overflow: hidden; }
        .progress-bar-inner { height: 100%; background: linear-gradient(90deg, var(--gold-dim), var(--gold-bright)); border-radius: 4px; transition: width 0.6s ease; }

        .artist-card { display: flex; gap: 16px; align-items: center; }
        .artist-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, var(--gold-dim), var(--gold-mid));
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 1.1rem; font-weight: 600;
          color: var(--bg-void); flex-shrink: 0;
        }

        .ref-link {
          display: block; font-size: 0.82rem; color: var(--gold-bright);
          padding: 6px 0; border-bottom: var(--border-subtle);
          text-decoration: none; transition: color 0.2s;
        }
        .ref-link:last-child { border-bottom: none; }
        .ref-link:hover { color: var(--gold-light); }

        .field-perm-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: var(--border-subtle); }
        .field-perm-row:last-child { border-bottom: none; }
        .field-perm-badge { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.05em; padding: 2px 8px; border-radius: 100px; }
        .field-perm-badge--edit { color: var(--gold-bright); background: rgba(201,150,58,0.1); border: 1px solid rgba(201,150,58,0.2); }
        .field-perm-badge--lock { color: var(--text-ghost); background: var(--bg-raised); border: var(--border-subtle); }

        .client-notes-quote {
          border-left: 2px solid var(--gold-dim);
          padding-left: 16px;
          font-style: italic;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .details-grid { grid-template-columns: 1fr; }
          .details-header { flex-direction: column; }
          .details-price { text-align: left; }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ label, value, children }) {
  return (
    <div className="info-row">
      <span className="info-row__label">{label}</span>
      {children ? children : <span className="info-row__value">{value || "—"}</span>}
    </div>
  );
}

function DaysChip({ days }) {
  if (days === null || days === undefined) return <span>—</span>;
  const color = days < 0 ? "var(--accent-red)" : days <= 7 ? "var(--accent-amber)" : "var(--accent-green)";
  const label = days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? "Due today!" : `${days} days left`;
  return <span style={{ color, fontWeight: 500 }}>{label}</span>;
}
