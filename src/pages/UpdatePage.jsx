import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCommission } from "../context/CommissionContext";
import { validateUpdateForm, validators } from "../utils/validators";

const PRIORITY_OPTIONS = [
  { value: "standard", label: "Standard", desc: "Regular turnaround" },
  { value: "express", label: "Express", desc: "Faster delivery" },
  { value: "rush", label: "Rush ⚡", desc: "Highest priority" },
];

export default function UpdatePage() {
  const navigate = useNavigate();
  const { commission, meta, updateCommission, loading } = useCommission();

  useEffect(() => {
    if (!commission) navigate("/search");
    else if (!meta?.is_editable) navigate("/details");
  }, [commission, meta, navigate]);

  const [formData, setFormData] = useState({
    delivery_date: commission?.delivery_date
      ? new Date(commission.delivery_date).toISOString().split("T")[0]
      : "",
    revision_count: commission?.revision_count ?? "",
    priority_level: commission?.priority_level || "standard",
    client_notes: commission?.client_notes || "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  if (!commission || !meta?.is_editable) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const err = validators[name]?.(value);
      setFieldErrors((p) => ({ ...p, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const err = validators[name]?.(value);
    setFieldErrors((p) => ({ ...p, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ delivery_date: true, revision_count: true, priority_level: true, client_notes: true });

    const { errors, isValid } = validateUpdateForm(formData);
    setFieldErrors(errors);
    if (!isValid) return;

    const result = await updateCommission(
      commission.commission_id,
      commission.client_id,
      formData
    );

    if (result.success) {
      navigate("/success");
    } else {
      navigate("/not-found", {
        state: {
          commission_id: commission.commission_id,
          client_id: commission.client_id,
          error: result.error,
          from: "update",
        },
      });
    }
  };

  const notesLen = formData.client_notes?.length || 0;

  return (
    <div className="update-page">
      <div className="update-page__bg"><div className="up-orb" /></div>

      <div className="container container--narrow update-page__container">

        {/* Breadcrumb */}
        <nav className="breadcrumb animate-fade">
          <Link to="/" className="breadcrumb__item">Home</Link>
          <span className="breadcrumb__sep">›</span>
          <Link to="/search" className="breadcrumb__item">Search</Link>
          <span className="breadcrumb__sep">›</span>
          <Link to="/details" className="breadcrumb__item">{commission.commission_id}</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__current">Edit</span>
        </nav>

        {/* Header */}
        <div className="update-header animate-fade-up">
          <div className="update-header__eyebrow">
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--gold-bright)", boxShadow: "0 0 8px var(--gold-bright)" }} />
            Edit Commission
          </div>
          <h1 className="update-header__title">{commission.project_title}</h1>
          <p className="update-header__sub">
            Modifying <code style={{ fontFamily: "var(--font-mono)", color: "var(--gold-mid)", fontSize: "0.85em" }}>{commission.commission_id}</code>
            {" "}— only permitted fields are shown below.
          </p>
        </div>

        {/* Form Card */}
        <div className="card update-card animate-fade-up" style={{ animationDelay: "0.08s" }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* Delivery Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="delivery_date">Delivery Date</label>
              <input
                id="delivery_date"
                name="delivery_date"
                type="date"
                className={`form-input ${fieldErrors.delivery_date ? "error" : touched.delivery_date && !fieldErrors.delivery_date && formData.delivery_date ? "success" : ""}`}
                value={formData.delivery_date}
                onChange={handleChange}
                onBlur={handleBlur}
                min={new Date().toISOString().split("T")[0]}
              />
              {fieldErrors.delivery_date
                ? <span className="form-error">⚠ {fieldErrors.delivery_date}</span>
                : <span className="form-hint">Leave unchanged to keep current date</span>}
            </div>

            {/* Revision Count */}
            <div className="form-group">
              <label className="form-label" htmlFor="revision_count">Revision Count</label>
              <input
                id="revision_count"
                name="revision_count"
                type="number"
                className={`form-input ${fieldErrors.revision_count ? "error" : touched.revision_count && !fieldErrors.revision_count && formData.revision_count !== "" ? "success" : ""}`}
                value={formData.revision_count}
                onChange={handleChange}
                onBlur={handleBlur}
                min={0}
                max={20}
                step={1}
              />
              {fieldErrors.revision_count
                ? <span className="form-error">⚠ {fieldErrors.revision_count}</span>
                : <span className="form-hint">Maximum 20 revisions allowed</span>}
            </div>

            {/* Priority Level */}
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div className="priority-options">
                {PRIORITY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`priority-option ${formData.priority_level === opt.value ? "priority-option--selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="priority_level"
                      value={opt.value}
                      checked={formData.priority_level === opt.value}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    <span className="priority-option__label">{opt.label}</span>
                    <span className="priority-option__desc">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Client Notes */}
            <div className="form-group">
              <label className="form-label" htmlFor="client_notes">
                Client Notes
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: notesLen > 450 ? "var(--accent-red)" : "var(--text-ghost)", marginLeft: 8 }}>
                  {notesLen}/500
                </span>
              </label>
              <textarea
                id="client_notes"
                name="client_notes"
                className={`form-input form-textarea ${fieldErrors.client_notes ? "error" : ""}`}
                value={formData.client_notes}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={500}
                rows={4}
                placeholder="Add any notes or special requests for the artist…"
              />
              {fieldErrors.client_notes && (
                <span className="form-error">⚠ {fieldErrors.client_notes}</span>
              )}
            </div>

            {/* Actions */}
            <div className="update-actions">
              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? (
                  <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving…</>
                ) : "Save Changes →"}
              </button>
              <Link to="/details" className="btn btn--ghost btn--lg" style={{ textDecoration: "none" }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Notice */}
        <div className="update-notice animate-fade-up" style={{ animationDelay: "0.16s" }}>
          <span style={{ color: "var(--gold-dim)" }}>⊘</span>
          <p>Commission ID, status, total price, and artist details are <strong>locked</strong> and cannot be changed here.</p>
        </div>
      </div>

      <style>{`
        .update-page {
          min-height: 100vh;
          padding: 120px 0 80px;
          position: relative;
        }
        .update-page__bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .up-orb {
          position: absolute;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,150,58,0.06), transparent 70%);
          top: 30%; left: 50%; transform: translate(-50%, -50%);
          filter: blur(100px);
        }
        .update-page__container { position: relative; z-index: 1; }
        .update-header { margin-bottom: 36px; }
        .update-header__eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--gold-bright); margin-bottom: 14px;
        }
        .update-header__title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: var(--text-primary); margin-bottom: 10px;
        }
        .update-header__sub { font-size: 0.9rem; color: var(--text-secondary); }
        .update-card { padding: 48px; }
        .update-card .form-group { margin-bottom: 28px; }
        .form-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: var(--font-body);
          line-height: 1.6;
        }
        .priority-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .priority-option {
          border: var(--border-dim);
          border-radius: var(--r-md);
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; flex-direction: column; gap: 4px;
        }
        .priority-option:hover { border-color: var(--gold-dim); background: var(--bg-raised); }
        .priority-option--selected {
          border-color: var(--gold-bright);
          background: rgba(201,150,58,0.07);
        }
        .priority-option__label { font-size: 0.9rem; color: var(--text-primary); font-weight: 500; }
        .priority-option__desc { font-size: 0.75rem; color: var(--text-muted); }
        .update-actions { display: flex; gap: 12px; margin-top: 8px; }
        .update-notice {
          display: flex; gap: 12px; align-items: flex-start;
          background: var(--bg-raised); border: var(--border-subtle);
          border-radius: var(--r-md); padding: 16px 20px;
          margin-top: 20px;
          font-size: 0.82rem; color: var(--text-muted);
        }
        .update-notice strong { color: var(--text-secondary); }
        @media (max-width: 600px) {
          .update-card { padding: 28px 20px; }
          .priority-options { grid-template-columns: 1fr; }
          .update-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
