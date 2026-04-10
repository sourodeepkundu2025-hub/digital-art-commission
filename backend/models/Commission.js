const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  due_date:  { type: Date },
  completed: { type: Boolean, default: false },
});

const commissionSchema = new mongoose.Schema(
  {
    // ─── Identifiers ──────────────────────────────────────────────────────────
    commission_id:  { type: String, required: true, unique: true, uppercase: true, trim: true },
    client_id:      { type: String, required: true, uppercase: true, trim: true },
    artist_id:      { type: String, required: true },

    // ─── Project Info ─────────────────────────────────────────────────────────
    project_title:       { type: String, required: true },
    project_description: { type: String },
    commission_type: {
      type: String,
      enum: ["character_design", "illustration", "concept_art", "logo_design", "animation", "portrait"],
      required: true,
    },
    style_tags:       [String],
    canvas_resolution: String,
    file_formats:     [String],

    // ─── Status & Priority ────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["in_progress", "completed", "on_hold", "cancelled", "pending_review"],
      default: "in_progress",
    },
    priority_level: {
      type: String,
      enum: ["standard", "express", "rush"],
      default: "standard",
    },

    // ─── Editable Fields ──────────────────────────────────────────────────────
    delivery_date:  { type: Date },
    revision_count: { type: Number, default: 0, min: 0, max: 20 },
    client_notes:   { type: String, maxlength: 500 },

    // ─── Pricing ──────────────────────────────────────────────────────────────
    total_price: { type: Number, required: true },
    currency:    { type: String, default: "USD" },

    // ─── Artist Info ──────────────────────────────────────────────────────────
    artist_name:           String,
    artist_specialization: String,

    // ─── Client Info ──────────────────────────────────────────────────────────
    client_name:    String,
    client_email:   String,
    client_country: String,

    // ─── Milestones & References ──────────────────────────────────────────────
    milestones:      [milestoneSchema],
    reference_links: [String],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Commission", commissionSchema);