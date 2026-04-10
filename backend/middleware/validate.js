// ─── Regex patterns (mirror frontend validators.js) ───────────────────────────
const COMMISSION_ID_REGEX = /^COM-\d{6}$/i;
const CLIENT_ID_REGEX     = /^CLT-\d{5}$/i;

// Validates commission_id and client_id format on every request
exports.validateIds = (req, res, next) => {
  const commission_id = req.params.commission_id || req.body.commission_id;
  const client_id     = req.params.client_id     || req.body.client_id;

  if (!commission_id || !COMMISSION_ID_REGEX.test(commission_id.trim())) {
    return res.status(400).json({
      error: { code: "INVALID_COMMISSION_ID", message: "Commission ID must follow format COM-XXXXXX" },
    });
  }
  if (!client_id || !CLIENT_ID_REGEX.test(client_id.trim())) {
    return res.status(400).json({
      error: { code: "INVALID_CLIENT_ID", message: "Client ID must follow format CLT-XXXXX" },
    });
  }
  next();
};

// Validates update body fields
exports.validateUpdateBody = (req, res, next) => {
  const { delivery_date, revision_count, priority_level, client_notes } = req.body;
  const errors = {};

  if (delivery_date) {
    const d = new Date(delivery_date);
    if (isNaN(d.getTime())) {
      errors.delivery_date = "Invalid date format";
    } else if (d < new Date()) {
      errors.delivery_date = "Delivery date cannot be in the past";
    }
  }

  if (revision_count !== undefined && revision_count !== "") {
    const n = Number(revision_count);
    if (!Number.isInteger(n))   errors.revision_count = "Must be a whole number";
    else if (n < 0)             errors.revision_count = "Cannot be negative";
    else if (n > 20)            errors.revision_count = "Cannot exceed 20 revisions";
  }

  if (priority_level && !["standard", "express", "rush"].includes(priority_level)) {
    errors.priority_level = "Invalid priority level";
  }

  if (client_notes && client_notes.length > 500) {
    errors.client_notes = `Too long — ${client_notes.length}/500 characters`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Validation failed", fields: errors } });
  }

  next();
};