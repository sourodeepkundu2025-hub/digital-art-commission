import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCommission } from "../context/CommissionContext";

export default function Navbar() {
  const location = useLocation();
  const { commission, reset } = useCommission();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        {/* Wordmark */}
        <Link to="/" className="navbar__brand" onClick={reset}>
          <span className="navbar__brand-icon">◈</span>
          <span className="navbar__brand-text">
            <span className="navbar__brand-primary">ArtCommission</span>
            <span className="navbar__brand-suffix"> Studio</span>
          </span>
        </Link>

        {/* Nav links */}
        <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          <li>
            <Link to="/" className={`navbar__link ${isActive("/") ? "navbar__link--active" : ""}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/search" className={`navbar__link ${isActive("/search") ? "navbar__link--active" : ""}`}>
              Search
            </Link>
          </li>
          {commission && (
            <li>
              <Link to="/details" className={`navbar__link ${isActive("/details") ? "navbar__link--active" : ""}`}>
                {commission.commission_id}
              </Link>
            </li>
          )}
        </ul>

        {/* CTA */}
        <div className="navbar__actions">
          <Link to="/search" className="btn btn--primary btn--sm">
            Track Commission
          </Link>
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 20px 0;
          transition: all 0.3s ease;
          background: transparent;
        }
        .navbar--scrolled {
          padding: 12px 0;
          background: rgba(8,8,8,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #1a1a1a;
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }
        .navbar__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }
        .navbar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar__brand-icon {
          color: var(--gold-bright);
          font-size: 1.3rem;
          line-height: 1;
        }
        .navbar__brand-text { display: flex; align-items: baseline; gap: 2px; }
        .navbar__brand-primary {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }
        .navbar__brand-suffix {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 300;
        }
        .navbar__links {
          display: flex;
          list-style: none;
          gap: 8px;
          align-items: center;
        }
        .navbar__link {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s;
          font-weight: 400;
          letter-spacing: 0.01em;
        }
        .navbar__link:hover {
          color: var(--text-primary);
          background: var(--bg-raised);
        }
        .navbar__link--active {
          color: var(--gold-bright);
          background: rgba(201,150,58,0.08);
        }
        .navbar__actions { display: flex; align-items: center; gap: 12px; }
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .navbar__hamburger span {
          display: block;
          width: 22px;
          height: 1.5px;
          background: var(--text-secondary);
          transition: all 0.2s;
        }
        @media (max-width: 768px) {
          .navbar__inner { padding: 0 20px; }
          .navbar__links {
            display: none;
            position: absolute;
            top: 100%; left: 0; right: 0;
            flex-direction: column;
            background: var(--bg-surface);
            border-bottom: var(--border-dim);
            padding: 16px;
          }
          .navbar__links--open { display: flex; }
          .navbar__hamburger { display: flex; }
          .btn--sm { display: none; }
        }
      `}</style>
    </nav>
  );
}
