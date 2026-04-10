import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCommission } from "../context/CommissionContext";

export default function NotFoundPage() {
  const location = useLocation();
  const { reset } = useCommission();
  const state = location.state || {};

  const { commission_id, client_id, error, from } = state;
  const isUpdateFailure = from === "update";

  const errorCode = error?.code || (isUpdateFailure ? "UPDATE_RESTRICTED" : "NOT_FOUND");
  const errorMessage =
    error?.message ||
    (isUpdateFailure
      ? "The commission could not be updated due to a business rule restriction."
      : "No commission record matched the provided IDs.");

  return (
    <div className="notfound-page">
      <div className="notfound-page__bg"><div className="nf-orb" /></div>

      <div className="container container--narrow notfound-page__inner">

        {/* Icon */}
        <div className="nf-icon animate-fade-up">
          <div className="nf-icon__ring" />
          <span className="nf-icon__symbol">⊘</span>
        </div>

        {/* Heading */}
        <div className="nf-heading animate-fade-up" style={{ animationDelay: "0.06s" }}>
          <div className="nf-eyebrow">
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--accent-red)", boxShadow: "0 0 8px var(--accent-red)" }} />
            {isUpdateFailure ? "Update Failed" : "Not Found"}
          </div>
          <h1 className="nf-title">
            {isUpdateFailure ? "Update Not Permitted" : "Commission Not Found"}
          </h1>
          <p className="nf-subtitle">{errorMessage}</p>
        </div>

        {/* Detail card */}
        <div className="card nf-card animate-fade-up" style={{ animationDelay: "0.12s" }}>

          {/* Error code */}
          <div className="nf-code-row">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>Error Code</span>
            <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent-red)", background: "rgba(192,57,43,0.1)", padding: "3px 10px", borderRadius: 4 }}>
              {errorCode}
            </code>
          </div>

          {/* What was searched */}
          {(commission_id || client_id) && (
            <>
              <div className="gold-line" style={{ margin: "20px 0" }} />
              <p style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Searched With
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {commission_id && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--gold-mid)", background: "rgba(201,150,58,0.08)", padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(201,150,58,0.15)" }}>
                    {commission_id}
                  </span>
                )}
                {client_id && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-secondary)", background: "var(--bg-raised)", padding: "6px 14px", borderRadius: 6, border: "var(--border-dim)" }}>
                    {client_id}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Help */}
          <div className="gold-line" style={{ margin: "24px 0 20px" }} />
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 12 }}>
            {isUpdateFailure ? "Possible reasons:" : "Common reasons:"}
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {(isUpdateFailure
              ? [
                  "Commission status is not 'in_progress'",
                  "Completed or cancelled commissions cannot be modified",
                  "Server-side validation rejected the submitted values",
                ]
              : [
                  "Commission ID or Client ID was entered incorrectly",
                  "The record does not exist in the database",
                  "IDs belong to different commissions — they must be paired correctly",
                ]
            ).map((r) => (
              <li key={r} style={{ fontSize: "0.8rem", color: "var(--text-muted)", paddingLeft: 16, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "var(--gold-dim)" }}>—</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="nf-actions animate-fade-up" style={{ animationDelay: "0.18s" }}>
          {isUpdateFailure ? (
            <Link to="/details" className="btn btn--primary btn--lg" style={{ textDecoration: "none" }}>
              ← Back to Details
            </Link>
          ) : (
            <Link to="/search" className="btn btn--primary btn--lg" style={{ textDecoration: "none" }}>
              ← Try Again
            </Link>
          )}
          <Link to="/" className="btn btn--ghost btn--lg" style={{ textDecoration: "none" }} onClick={reset}>
            Home
          </Link>
        </div>
      </div>

      <style>{`
        .notfound-page {
          min-height: 100vh;
          display: flex; align-items: center;
          padding: 100px 0 80px;
          position: relative;
        }
        .notfound-page__bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .nf-orb {
          position: absolute;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(192,57,43,0.07), transparent 70%);
          top: 40%; left: 50%; transform: translate(-50%, -50%);
          filter: blur(100px);
        }
        .notfound-page__inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center; gap: 32px;
          text-align: center; width: 100%;
        }
        .nf-icon {
          position: relative; width: 80px; height: 80px;
          display: flex; align-items: center; justify-content: center;
        }
        .nf-icon__ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid var(--accent-red);
          box-shadow: 0 0 24px rgba(192,57,43,0.25);
        }
        .nf-icon__symbol { font-size: 2rem; color: var(--accent-red); }
        .nf-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--accent-red); margin-bottom: 14px;
        }
        .nf-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: var(--text-primary); margin-bottom: 12px;
        }
        .nf-subtitle { font-size: 0.95rem; color: var(--text-secondary); max-width: 440px; }
        .nf-card { padding: 40px; width: 100%; text-align: left; }
        .nf-code-row { display: flex; justify-content: space-between; align-items: center; }
        .nf-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
      `}</style>
    </div>
  );
}
