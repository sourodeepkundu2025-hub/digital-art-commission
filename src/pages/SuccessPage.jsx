import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCommission } from "../context/CommissionContext";
import { format } from "date-fns";

const fmt = (d) => (d ? format(new Date(d), "dd MMM yyyy") : "—");

export default function SuccessPage() {
  const navigate = useNavigate();
  const { commission, updateResult, reset } = useCommission();

  useEffect(() => {
    if (!updateResult && !commission) navigate("/search");
  }, [updateResult, commission, navigate]);

  if (!commission) return null;

  const c = commission;

  return (
    <div className="success-page">
      <div className="success-page__bg">
        <div className="success-orb" />
      </div>

      <div className="container container--narrow success-page__inner">

        {/* Icon */}
        <div className="success-icon animate-fade-up">
          <div className="success-icon__ring" />
          <span className="success-icon__check">✓</span>
        </div>

        {/* Heading */}
        <div className="success-heading animate-fade-up" style={{ animationDelay: "0.06s" }}>
          <div className="success-eyebrow">
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", boxShadow: "0 0 8px var(--accent-green)" }} />
            Update Successful
          </div>
          <h1 className="success-title">Commission Updated</h1>
          <p className="success-subtitle">
            Your changes to <code style={{ fontFamily: "var(--font-mono)", color: "var(--gold-mid)", fontSize: "0.9em" }}>{c.commission_id}</code> have been saved successfully.
          </p>
        </div>

        {/* Summary card */}
        <div className="card success-card animate-fade-up" style={{ animationDelay: "0.12s" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--text-primary)", marginBottom: 20 }}>
            Updated Commission Details
          </h3>
          <div className="gold-line" style={{ marginBottom: 24 }} />

          <div className="success-detail-grid">
            <SuccessRow label="Commission ID" value={c.commission_id} mono />
            <SuccessRow label="Project" value={c.project_title} />
            <SuccessRow label="Status">
              <span className={`badge badge--${c.status.replace(/_/g, "-")}`} style={{ fontSize: "0.72rem" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block", marginRight: 4 }} />
                {c.status.replace(/_/g, " ")}
              </span>
            </SuccessRow>
            <SuccessRow label="Delivery Date" value={fmt(c.delivery_date)} />
            <SuccessRow label="Revision Count" value={`${c.revision_count} revisions`} />
            <SuccessRow label="Priority" value={c.priority_level} />
            {c.client_notes && (
              <SuccessRow label="Notes" value={c.client_notes} />
            )}
            <SuccessRow label="Last Updated" value={fmt(c.updated_at)} />
          </div>
        </div>

        {/* Actions */}
        <div className="success-actions animate-fade-up" style={{ animationDelay: "0.18s" }}>
          <Link to="/details" className="btn btn--primary btn--lg" style={{ textDecoration: "none" }}>
            ◎ View Commission →
          </Link>
          <Link to="/search" className="btn btn--ghost btn--lg" style={{ textDecoration: "none" }}>
            Search Another
          </Link>
          <Link to="/" className="btn btn--ghost btn--lg" style={{ textDecoration: "none" }} onClick={reset}>
            Home
          </Link>
        </div>
      </div>

      <style>{`
        .success-page {
          min-height: 100vh;
          display: flex; align-items: center;
          padding: 100px 0 80px;
          position: relative;
        }
        .success-page__bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .success-orb {
          position: absolute;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(39,174,96,0.07), transparent 70%);
          top: 40%; left: 50%; transform: translate(-50%, -50%);
          filter: blur(100px);
        }
        .success-page__inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center; gap: 32px;
          text-align: center; width: 100%;
        }
        .success-icon {
          position: relative; width: 80px; height: 80px;
          display: flex; align-items: center; justify-content: center;
        }
        .success-icon__ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid var(--accent-green);
          box-shadow: 0 0 24px rgba(39,174,96,0.3);
          animation: pulse-ring 2s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.06); }
        }
        .success-icon__check {
          font-size: 2rem; color: var(--accent-green);
          animation: check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }
        @keyframes check-pop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .success-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--accent-green); margin-bottom: 14px;
        }
        .success-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: var(--text-primary); margin-bottom: 12px;
        }
        .success-subtitle { font-size: 0.95rem; color: var(--text-secondary); max-width: 420px; }
        .success-card { padding: 40px; width: 100%; text-align: left; }
        .success-detail-grid { display: flex; flex-direction: column; }
        .success-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
      `}</style>
    </div>
  );
}

function SuccessRow({ label, value, mono, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>{label}</span>
      {children || (
        <span style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{value || "—"}</span>
      )}
    </div>
  );
}
