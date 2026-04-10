import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCommission } from "../context/CommissionContext";
import { validateSearchForm, validators } from "../utils/validators";

export default function SearchPage() {
  const navigate = useNavigate();
  const { searchCommission, loading, searchInput, setSearchInput } = useCommission();

  const [formData, setFormData] = useState({
    commission_id: searchInput.commission_id || "",
    client_id: searchInput.client_id || "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const commissionRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const upper = ["commission_id", "client_id"].includes(name)
      ? value.toUpperCase()
      : value;

    setFormData((prev) => ({ ...prev, [name]: upper }));

    if (touched[name]) {
      const err = validators[name]?.(upper);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validators[name]?.(value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all touched
    setTouched({ commission_id: true, client_id: true });

    // Client-side validation
    const { errors, isValid } = validateSearchForm(formData);
    setFieldErrors(errors);

    if (!isValid) {
      // Focus first error field
      commissionRef.current?.focus();
      return;
    }

    setSearchInput(formData);
    const result = await searchCommission(formData.commission_id, formData.client_id);

    if (result.success) {
      navigate("/details");
    } else {
      navigate("/not-found", {
        state: {
          commission_id: formData.commission_id,
          client_id: formData.client_id,
          error: result.error,
        },
      });
    }
  };

  const handleClear = () => {
    setFormData({ commission_id: "", client_id: "" });
    setFieldErrors({});
    setTouched({});
    setSearchInput({ commission_id: "", client_id: "" });
    commissionRef.current?.focus();
  };

  const isFormValid = !validators.commission_id(formData.commission_id) && !validators.client_id(formData.client_id);

  return (
    <div className="search-page">
      {/* Background */}
      <div className="search-page__bg">
        <div className="sp-orb" />
      </div>

      <div className="container container--narrow search-page__container">
        {/* Header */}
        <div className="search-page__header animate-fade-up">
          <div className="search-page__eyebrow">
            <span className="hero__dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--gold-bright)", boxShadow: "0 0 8px var(--gold-bright)" }} />
            Commission Lookup
          </div>
          <h1 className="search-page__title">Track Your Commission</h1>
          <p className="search-page__subtitle">
            Enter your Commission ID and Client ID exactly as provided in your confirmation email.
          </p>
        </div>

        {/* Form Card */}
        <div className="card search-page__card animate-fade-up" style={{ animationDelay: "0.08s" }}>
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="search-form__grid">
              {/* Commission ID */}
              <div className="form-group">
                <label className="form-label" htmlFor="commission_id">
                  Commission ID <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">◈</span>
                  <input
                    ref={commissionRef}
                    id="commission_id"
                    name="commission_id"
                    type="text"
                    className={`form-input input--prefixed ${fieldErrors.commission_id ? "error" : touched.commission_id && !fieldErrors.commission_id ? "success" : ""}`}
                    placeholder="COM-001001"
                    value={formData.commission_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={10}
                    spellCheck={false}
                    autoCapitalize="characters"
                  />
                  {touched.commission_id && !fieldErrors.commission_id && (
                    <span className="input-check">✓</span>
                  )}
                </div>
                {fieldErrors.commission_id ? (
                  <span className="form-error">⚠ {fieldErrors.commission_id}</span>
                ) : (
                  <span className="form-hint">Format: COM-XXXXXX</span>
                )}
              </div>

              {/* Client ID */}
              <div className="form-group">
                <label className="form-label" htmlFor="client_id">
                  Client ID <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">◎</span>
                  <input
                    id="client_id"
                    name="client_id"
                    type="text"
                    className={`form-input input--prefixed ${fieldErrors.client_id ? "error" : touched.client_id && !fieldErrors.client_id ? "success" : ""}`}
                    placeholder="CLT-10001"
                    value={formData.client_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={9}
                    spellCheck={false}
                    autoCapitalize="characters"
                  />
                  {touched.client_id && !fieldErrors.client_id && (
                    <span className="input-check">✓</span>
                  )}
                </div>
                {fieldErrors.client_id ? (
                  <span className="form-error">⚠ {fieldErrors.client_id}</span>
                ) : (
                  <span className="form-hint">Format: CLT-XXXXX</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="search-form__actions">
              <button
                type="submit"
                className="btn btn--primary btn--full btn--lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Searching…
                  </>
                ) : (
                  "Search Commission →"
                )}
              </button>
              {(formData.commission_id || formData.client_id) && (
                <button type="button" className="btn btn--ghost btn--full" onClick={handleClear}>
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="gold-line" />

          {/* Hint panel */}
          <div className="search-hint-panel">
            <p className="search-hint-panel__title">🔍 Where to find your IDs</p>
            <ul className="search-hint-panel__list">
              <li>Check your commission confirmation email from ArtCommission Studio</li>
              <li>Both IDs are shown in your client dashboard</li>
              <li>IDs are case-insensitive — COM-001001 and com-001001 both work</li>
            </ul>
          </div>
        </div>

        {/* Quick test pairs */}
        <div className="search-page__quickfill animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <p className="quickfill__label">Quick fill — test records:</p>
          <div className="quickfill__pairs">
            {[
              { c: "COM-001001", k: "CLT-10001", status: "in_progress" },
              { c: "COM-001003", k: "CLT-10003", status: "in_progress" },
              { c: "COM-001002", k: "CLT-10002", status: "completed" },
            ].map((p) => (
              <button
                key={p.c}
                className="quickfill__btn"
                onClick={() => {
                  setFormData({ commission_id: p.c, client_id: p.k });
                  setTouched({});
                  setFieldErrors({});
                }}
              >
                <code>{p.c}</code>
                <span className={`badge badge--${p.status.replace("_", "-")}`} style={{ fontSize: "0.62rem", padding: "2px 7px" }}>
                  {p.status.replace("_", " ")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .search-page {
          min-height: 100vh;
          padding: 120px 0 80px;
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-page__bg {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden;
        }
        .sp-orb {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,150,58,0.07), transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          filter: blur(80px);
        }
        .search-page__container { position: relative; z-index: 1; width: 100%; }
        .search-page__header { text-align: center; margin-bottom: 40px; }
        .search-page__eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--gold-bright); margin-bottom: 16px;
        }
        .search-page__title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: var(--text-primary);
          margin-bottom: 12px;
        }
        .search-page__subtitle {
          color: var(--text-secondary); max-width: 420px; margin: 0 auto;
          font-size: 0.95rem;
        }
        .search-page__card { padding: 48px; }
        .search-form__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 28px;
        }
        .input-wrapper { position: relative; }
        .input-prefix {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: var(--gold-dim); font-size: 0.9rem;
          pointer-events: none; z-index: 1;
        }
        .input--prefixed { padding-left: 38px !important; }
        .input-check {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: var(--accent-green); font-size: 0.85rem;
        }
        .form-input.success { border-color: var(--accent-green) !important; }
        .required { color: var(--gold-bright); }
        .search-form__actions { display: flex; flex-direction: column; gap: 10px; }
        .search-hint-panel {
          background: var(--bg-raised);
          border: var(--border-subtle);
          border-radius: var(--r-md);
          padding: 20px 24px;
        }
        .search-hint-panel__title {
          font-size: 0.875rem;
          color: var(--text-primary);
          margin-bottom: 10px;
          font-weight: 500;
        }
        .search-hint-panel__list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .search-hint-panel__list li {
          font-size: 0.82rem;
          color: var(--text-muted);
          padding-left: 16px;
          position: relative;
        }
        .search-hint-panel__list li::before {
          content: '—';
          position: absolute; left: 0;
          color: var(--gold-dim);
        }
        .search-page__quickfill { margin-top: 28px; }
        .quickfill__label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 12px;
          text-align: center;
        }
        .quickfill__pairs { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .quickfill__btn {
          display: flex; align-items: center; gap: 8px;
          background: var(--bg-card);
          border: var(--border-dim);
          border-radius: var(--r-md);
          padding: 8px 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quickfill__btn:hover { border-color: var(--gold-dim); background: var(--bg-raised); }
        .quickfill__btn code {
          font-size: 0.78rem; color: var(--gold-mid);
        }
        @media (max-width: 600px) {
          .search-form__grid { grid-template-columns: 1fr; }
          .search-page__card { padding: 28px 20px; }
        }
      `}</style>
    </div>
  );
}
