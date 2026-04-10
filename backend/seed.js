const mongoose = require("mongoose");
const Commission = require("./models/Commission");
require("dotenv").config();

const samples = [
  {
    commission_id: "COM-001001", client_id: "CLT-10001",
    artist_id: "ART-001", artist_name: "Yuki Tanaka", artist_specialization: "Character Design",
    project_title: "Celestial Warrior", project_description: "A fantasy warrior character with celestial armor and glowing runes.",
    commission_type: "character_design", style_tags: ["fantasy", "armor", "glowing"],
    canvas_resolution: "4000x4000px", file_formats: ["PNG", "PSD"],
    status: "in_progress", priority_level: "express",
    delivery_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    revision_count: 2, total_price: 350, currency: "USD",
    client_name: "Arjun Mehta", client_email: "arjun@example.com", client_country: "India",
    client_notes: "Please use deep blue and gold tones.",
    milestones: [
      { title: "Sketch & Concept", completed: true },
      { title: "Line Art", completed: true },
      { title: "Base Colors", completed: false },
      { title: "Final Render", completed: false },
    ],
    reference_links: ["https://pinterest.com", "https://artstation.com"],
  },
  {
    commission_id: "COM-001002", client_id: "CLT-10002",
    artist_id: "ART-002", artist_name: "Sofia Reyes", artist_specialization: "Illustration",
    project_title: "Neon Dystopia", project_description: "Cyberpunk cityscape at night with neon reflections.",
    commission_type: "illustration", style_tags: ["cyberpunk", "neon", "cityscape"],
    canvas_resolution: "6000x4000px", file_formats: ["PNG", "TIFF"],
    status: "completed", priority_level: "standard",
    delivery_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    revision_count: 3, total_price: 500, currency: "USD",
    client_name: "Lena Hoffmann", client_email: "lena@example.com", client_country: "Germany",
    milestones: [
      { title: "Concept Sketch", completed: true },
      { title: "Composition", completed: true },
      { title: "Color & Lighting", completed: true },
      { title: "Final Export", completed: true },
    ],
  },
  {
    commission_id: "COM-001003", client_id: "CLT-10003",
    artist_id: "ART-003", artist_name: "Marcus Webb", artist_specialization: "Logo Design",
    project_title: "PixelBrew Logo", project_description: "Minimalist logo for a craft coffee brand.",
    commission_type: "logo_design", style_tags: ["minimalist", "branding", "coffee"],
    canvas_resolution: "2000x2000px", file_formats: ["SVG", "PNG"],
    status: "in_progress", priority_level: "rush",
    delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    revision_count: 1, total_price: 200, currency: "USD",
    client_name: "Carlos Diaz", client_email: "carlos@example.com", client_country: "Mexico",
    milestones: [
      { title: "Brief & Moodboard", completed: true },
      { title: "Initial Concepts", completed: false },
      { title: "Refinement", completed: false },
    ],
  },
  {
    commission_id: "COM-001004", client_id: "CLT-10004",
    artist_id: "ART-001", artist_name: "Yuki Tanaka", artist_specialization: "Portrait",
    project_title: "Family Portrait", project_description: "Digital portrait of a family of four in watercolor style.",
    commission_type: "portrait", style_tags: ["portrait", "watercolor", "family"],
    canvas_resolution: "3000x4000px", file_formats: ["PNG"],
    status: "on_hold", priority_level: "standard",
    delivery_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    revision_count: 0, total_price: 280, currency: "USD",
    client_name: "Priya Sharma", client_email: "priya@example.com", client_country: "India",
    milestones: [
      { title: "Photo Reference Review", completed: true },
      { title: "Sketch Draft", completed: false },
    ],
  },
  {
    commission_id: "COM-001005", client_id: "CLT-10005",
    artist_id: "ART-004", artist_name: "Ryo Nakamura", artist_specialization: "Concept Art",
    project_title: "Platformer Sprite Sheet", project_description: "Full sprite sheet for a 2D platformer game hero.",
    commission_type: "concept_art", style_tags: ["pixel", "game", "sprite"],
    canvas_resolution: "1024x1024px", file_formats: ["PNG", "GIF"],
    status: "in_progress", priority_level: "standard",
    delivery_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    revision_count: 4, total_price: 420, currency: "USD",
    client_name: "Tom Fischer", client_email: "tom@example.com", client_country: "USA",
    milestones: [
      { title: "Character Design", completed: true },
      { title: "Idle Animation", completed: true },
      { title: "Run & Jump Frames", completed: false },
      { title: "Attack Animations", completed: false },
    ],
  },
  {
    commission_id: "COM-001006", client_id: "CLT-10006",
    artist_id: "ART-002", artist_name: "Sofia Reyes", artist_specialization: "Illustration",
    project_title: "The Glass Meridian", project_description: "Book cover illustration for a sci-fi novel.",
    commission_type: "illustration", style_tags: ["sci-fi", "book-cover", "space"],
    canvas_resolution: "2500x4000px", file_formats: ["PNG", "PDF"],
    status: "cancelled", priority_level: "express",
    delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    revision_count: 0, total_price: 600, currency: "USD",
    client_name: "Anika Bauer", client_email: "anika@example.com", client_country: "Germany",
    milestones: [
      { title: "Thumbnail Compositions", completed: false },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Commission.deleteMany({});
    console.log("Cleared existing commissions");

    await Commission.insertMany(samples);
    console.log(`Seeded ${samples.length} commissions`);

    mongoose.disconnect();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();