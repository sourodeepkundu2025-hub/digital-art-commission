// ─── Client-Side Validation (JavaScript) ──────────────────────────────────────

export const COMMISSION_ID_REGEX = /^COM-\d{6}$/i;
export const CLIENT_ID_REGEX     = /^CLT-\d{5}$/i;

// ─── Search Form Validation ────────────────────────────────────────────────────
export const validateSearchForm = ({ commission_id, client_id }) => {
  const errors = {};

  // Commission ID
  if (!commission_id || !commission_id.trim()) {
    errors.commission_id = "Commission ID is required";
  } else if (!COMMISSION_ID_REGEX.test(commission_id.trim())) {
    errors.commission_id = "Must follow format COM-XXXXXX (e.g. COM-001001)";
  }

  // Client ID
  if (!client_id || !client_id.trim()) {
    errors.client_id = "Client ID is required";
  } else if (!CLIENT_ID_REGEX.test(client_id.trim())) {
    errors.client_id = "Must follow format CLT-XXXXX (e.g. CLT-10001)";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

// ─── Update Form Validation ────────────────────────────────────────────────────
export const validateUpdateForm = ({ delivery_date, revision_count, priority_level, client_notes }) => {
  const errors = {};

  // Delivery date
  if (delivery_date) {
    const d = new Date(delivery_date);
    if (isNaN(d.getTime())) {
      errors.delivery_date = "Invalid date format";
    } else if (d < new Date()) {
      errors.delivery_date = "Delivery date cannot be in the past";
    }
  }

  // Revision count
  if (revision_count !== undefined && revision_count !== "") {
    const n = Number(revision_count);
    if (!Number.isInteger(n)) {
      errors.revision_count = "Must be a whole number";
    } else if (n < 0) {
      errors.revision_count = "Cannot be negative";
    } else if (n > 20) {
      errors.revision_count = "Cannot exceed 20 revisions";
    }
  }

  // Priority
  if (priority_level && !["standard", "express", "rush"].includes(priority_level)) {
    errors.priority_level = "Invalid priority level";
  }

  // Client notes
  if (client_notes && client_notes.length > 500) {
    errors.client_notes = `Too long — ${client_notes.length}/500 characters`;
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

// ─── Real-time field validators ────────────────────────────────────────────────
export const validators = {
  commission_id: (val) => {
    if (!val) return "Required";
    if (!COMMISSION_ID_REGEX.test(val)) return "Format: COM-XXXXXX";
    return null;
  },
  client_id: (val) => {
    if (!val) return "Required";
    if (!CLIENT_ID_REGEX.test(val)) return "Format: CLT-XXXXX";
    return null;
  },
  delivery_date: (val) => {
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return "Invalid date";
    if (d < new Date()) return "Date cannot be in the past";
    return null;
  },
  revision_count: (val) => {
    if (val === "" || val === undefined) return null;
    const n = Number(val);
    if (!Number.isInteger(n)) return "Whole number only";
    if (n < 0) return "Cannot be negative";
    if (n > 20) return "Max 20 revisions";
    return null;
  },
  client_notes: (val) => {
    if (!val) return null;
    if (val.length > 500) return `${val.length}/500 — too long`;
    return null;
  },
};
