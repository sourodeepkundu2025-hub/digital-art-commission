const express  = require("express");
const router   = express.Router();
const Commission = require("../models/Commission");
const { validateIds, validateUpdateBody } = require("../middleware/validate");

// ─── Helper: build meta object ────────────────────────────────────────────────
function buildMeta(commission, req) {
  const isEditable = commission.status === "in_progress";
  const daysRemaining = commission.delivery_date
    ? Math.ceil((new Date(commission.delivery_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  // Store last viewed in session
  req.session.last_viewed = commission.commission_id;

  return {
    is_editable: isEditable,
    update_restriction_reason: !isEditable
      ? `Commission is '${commission.status.replace(/_/g, " ")}' — only in-progress commissions can be edited.`
      : null,
    days_remaining: daysRemaining,
    editable_fields: isEditable
      ? ["delivery_date", "revision_count", "priority_level", "client_notes"]
      : [],
    session_id: req.session.id,
  };
}

// ─── POST /api/commissions/search ─────────────────────────────────────────────
// Search by commission_id + client_id (dual-key lookup)
router.post("/search", validateIds, async (req, res) => {
  try {
    const { commission_id, client_id } = req.body;

    const commission = await Commission.findOne({
      commission_id: commission_id.toUpperCase(),
      client_id:     client_id.toUpperCase(),
    });

    if (!commission) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "No commission found with the provided IDs. Please check your details.",
        },
      });
    }

    res.json({ success: true, data: { commission, meta: buildMeta(commission, req) } });
  } catch (err) {
    console.error("[SEARCH ERROR]", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Search failed." } });
  }
});

// ─── GET /api/commissions/meta/session ────────────────────────────────────────
// Returns current session info
router.get("/meta/session", (req, res) => {
  res.json({
    success: true,
    data: {
      session_id:  req.session.id,
      last_viewed: req.session.last_viewed || null,
    },
  });
});

// ─── GET /api/commissions/:commission_id/:client_id ───────────────────────────
router.get("/:commission_id/:client_id", validateIds, async (req, res) => {
  try {
    const { commission_id, client_id } = req.params;

    const commission = await Commission.findOne({
      commission_id: commission_id.toUpperCase(),
      client_id:     client_id.toUpperCase(),
    });

    if (!commission) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Commission not found." },
      });
    }

    res.json({ success: true, data: { commission, meta: buildMeta(commission, req) } });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Fetch failed." } });
  }
});

// ─── PUT /api/commissions/:commission_id/:client_id ───────────────────────────
router.put("/:commission_id/:client_id", validateIds, validateUpdateBody, async (req, res) => {
  try {
    const { commission_id, client_id } = req.params;

    const commission = await Commission.findOne({
      commission_id: commission_id.toUpperCase(),
      client_id:     client_id.toUpperCase(),
    });

    if (!commission) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Commission not found." },
      });
    }

    // ── Business Rule: only in_progress commissions are editable ──────────────
    if (commission.status !== "in_progress") {
      return res.status(403).json({
        error: {
          code: "UPDATE_RESTRICTED",
          message: `Commission is '${commission.status.replace(/_/g, " ")}' — updates are not permitted.`,
        },
      });
    }

    // ── Only update permitted fields ──────────────────────────────────────────
    const { delivery_date, revision_count, priority_level, client_notes } = req.body;
    if (delivery_date  !== undefined) commission.delivery_date  = delivery_date;
    if (revision_count !== undefined) commission.revision_count = revision_count;
    if (priority_level !== undefined) commission.priority_level = priority_level;
    if (client_notes   !== undefined) commission.client_notes   = client_notes;

    await commission.save();

    // Store update event in session
    req.session.last_updated = commission.commission_id;

    res.json({ success: true, data: { commission, meta: buildMeta(commission, req) } });
  } catch (err) {
    console.error("[UPDATE ERROR]", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Update failed." } });
  }
});

// ─── GET /api/commissions (list all — dev/debug) ──────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { status, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const commissions = await Commission.find(filter).limit(Number(limit));
    res.json({ success: true, data: commissions });
  } catch (err) {
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Fetch failed." } });
  }
});

module.exports = router;