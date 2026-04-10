<div align="center">

<!-- Animated Header Banner -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=C9963A&height=200&section=header&text=ArtCommission%20Studio&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Digital%20Art%20Commission%20Management%20System&descAlignY=60&descAlign=50&descSize=18" />

<!-- Badges Row 1 -->
<p>
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/REST-API-C9963A?style=for-the-badge&logo=fastapi&logoColor=white" />
</p>

<!-- Badges Row 2 -->
<p>
  <img src="https://img.shields.io/badge/Sessions-Cookies-blueviolet?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" />
</p>

<br/>

> **A full-stack web application** to search, display, and update digital art commission records — built with business-rule enforcement, dual-key authentication, and real-time validation.

<br/>

</div>

---

## ◈ Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [System Workflow](#-system-workflow)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Business Rules](#-business-rules)
- [Getting Started](#-getting-started)
- [Sample Records](#-sample-records)
- [Screenshots](#-screenshots)

---

## ◈ Overview

**ArtCommission Studio** is a web-based management application that enables clients to track and update their digital art commission records. The system enforces strict business rules — only commissions with status `in_progress` can be modified, and only specific permitted fields are editable.

Built as part of the **Digital Application Development Case Study** — Domain 5: Digital Art Commission Management.

---

## ◈ Live Demo

```
Frontend  →  http://localhost:3000
Backend   →  http://localhost:5000
API Base  →  http://localhost:5000/api
Health    →  http://localhost:5000/api/health
```

**Quick Test Pairs:**

| Commission ID | Client ID   | Status      |
|---------------|-------------|-------------|
| COM-001001    | CLT-10001   | in_progress |
| COM-001002    | CLT-10002   | completed   |
| COM-001003    | CLT-10003   | in_progress |
| COM-001004    | CLT-10004   | on_hold     |
| COM-001005    | CLT-10005   | in_progress |
| COM-001006    | CLT-10006   | cancelled   |

---

## ◈ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Axios, date-fns, react-hot-toast |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Auth/Session** | express-session, cookie-parser |
| **Validation** | Client-side JS + Server-side middleware |
| **Dev Tools** | nodemon, create-react-app |

</div>

---

## ◈ Features

```
✦  Dual-Key Record Search     →  Commission ID + Client ID required together
✦  Smart Field Control        →  Only permitted fields shown/editable
✦  Status-Gated Updates       →  Only in_progress commissions are editable
✦  Client-Side Validation     →  Real-time format checking with regex
✦  Server-Side Validation     →  Express middleware with exception handling
✦  Session Tracking           →  Cookies store last viewed/updated commission
✦  Success & Failure Pages    →  Contextual feedback for every operation
✦  Milestone Tracking         →  Progress bar with completion tracking
✦  Responsive Design          →  Mobile-first dark luxury UI
✦  RESTful API                →  Clean endpoint structure with error codes
```

---

## ◈ System Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User enters Commission ID + Client ID                   │
│              ↓                                              │
│  2. Client-side JS validates format (COM-XXXXXX / CLT-XXXXX)│
│              ↓                                              │
│  3. POST /api/commissions/search → MongoDB lookup           │
│              ↓                                              │
│  4. If found → Details Page displayed                       │
│     If not   → Not Found Page with reason                   │
│              ↓                                              │
│  5. System checks commission.status === "in_progress"       │
│              ↓                                              │
│  6. If editable → Update form unlocked                      │
│     If locked   → Restriction banner shown                  │
│              ↓                                              │
│  7. PUT /api/commissions/:id/:clientId → Server validates   │
│              ↓                                              │
│  8. Success Page  OR  Failure Page                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ◈ Project Structure

```
digital-art-commission-frontend/
│
├── 📁 src/
│   ├── 📁 components/
│   │   └── Navbar.jsx              # Fixed nav with scroll effect
│   ├── 📁 context/
│   │   └── CommissionContext.jsx   # Global state with useReducer
│   ├── 📁 pages/
│   │   ├── HomePage.jsx            # Landing + demo records
│   │   ├── SearchPage.jsx          # Dual-key search form
│   │   ├── DetailsPage.jsx         # Full commission display
│   │   ├── UpdatePage.jsx          # Editable fields form
│   │   ├── SuccessPage.jsx         # Update confirmation
│   │   └── NotFoundPage.jsx        # Error/failure display
│   ├── 📁 utils/
│   │   ├── api.js                  # Axios instance + interceptors
│   │   └── validators.js           # Regex + form validation
│   ├── 📁 styles/
│   │   └── global.css              # CSS variables + base styles
│   └── App.jsx                     # Router + Provider setup
│
└── 📁 backend/
    ├── 📁 config/
    │   └── db.js                   # MongoDB connection
    ├── 📁 models/
    │   └── Commission.js           # Mongoose schema
    ├── 📁 middleware/
    │   └── validate.js             # ID + body validation
    ├── 📁 routes/
    │   └── commissions.js          # All API routes
    ├── server.js                   # Express app + middleware
    ├── seed.js                     # Sample data seeder
    └── .env                        # Environment variables
```

---

## ◈ Database Schema

```js
Commission {
  // Identifiers (non-editable)
  commission_id:       String   // COM-XXXXXX
  client_id:           String   // CLT-XXXXX
  artist_id:           String

  // Project Info (non-editable)
  project_title:       String
  project_description: String
  commission_type:     Enum [ character_design | illustration | concept_art | logo_design | animation | portrait ]
  style_tags:          [String]
  canvas_resolution:   String
  file_formats:        [String]

  // Status (non-editable)
  status:              Enum [ in_progress | completed | on_hold | cancelled | pending_review ]

  // ✎ EDITABLE FIELDS (only when status = in_progress)
  delivery_date:       Date
  revision_count:      Number   // 0–20
  priority_level:      Enum [ standard | express | rush ]
  client_notes:        String   // max 500 chars

  // Pricing (non-editable)
  total_price:         Number
  currency:            String

  // People
  artist_name:         String
  client_name:         String
  client_email:        String
  client_country:      String

  // Progress
  milestones:          [{ title, due_date, completed }]
  reference_links:     [String]

  // Auto
  created_at:          Date
  updated_at:          Date
}
```

---

## ◈ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/commissions/search` | Dual-key commission lookup |
| `GET` | `/api/commissions/:commission_id/:client_id` | Get commission by IDs |
| `PUT` | `/api/commissions/:commission_id/:client_id` | Update editable fields |
| `GET` | `/api/commissions` | List all commissions (dev) |
| `GET` | `/api/commissions/meta/session` | Get session info |

**Example Request — Search:**
```json
POST /api/commissions/search
{
  "commission_id": "COM-001001",
  "client_id": "CLT-10001"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "commission": { ... },
    "meta": {
      "is_editable": true,
      "days_remaining": 10,
      "editable_fields": ["delivery_date", "revision_count", "priority_level", "client_notes"],
      "session_id": "abc123"
    }
  }
}
```

---

## ◈ Business Rules

```
✦  Only commissions with status = "in_progress" can be updated
⊘  completed   → locked, no edits allowed
⊘  on_hold     → locked, no edits allowed
⊘  cancelled   → locked, no edits allowed

✎  Editable fields (in_progress only):
   → delivery_date   (must be future date)
   → revision_count  (integer, 0–20)
   → priority_level  (standard | express | rush)
   → client_notes    (max 500 characters)

⊘  Non-editable fields (always locked):
   → commission_id, client_id, status
   → total_price, artist_name, artist_id
   → commission_type, canvas_resolution
```

---

## ◈ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/sourodeepkundu2025-hub/digital-art-commission.git
cd digital-art-commission
```

### 2. Setup Frontend
```bash
npm install
```

Create `.env` in root:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/artcommissions
SESSION_SECRET=artcommission_super_secret_key
CLIENT_URL=http://localhost:3000
```

### 4. Seed the Database
```bash
cd backend
npm run seed
```

### 5. Run the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd ..
npm start
```

Open **http://localhost:3000** 🎉

---

## ◈ Sample Records

| Commission ID | Client ID | Project | Status | Price |
|---------------|-----------|---------|--------|-------|
| COM-001001 | CLT-10001 | Celestial Warrior | 🟡 in_progress | $350 |
| COM-001002 | CLT-10002 | Neon Dystopia | ✅ completed | $500 |
| COM-001003 | CLT-10003 | PixelBrew Logo | 🟡 in_progress | $200 |
| COM-001004 | CLT-10004 | Family Portrait | ⏸ on_hold | $280 |
| COM-001005 | CLT-10005 | Platformer Sprite Sheet | 🟡 in_progress | $420 |
| COM-001006 | CLT-10006 | The Glass Meridian | ❌ cancelled | $600 |

---

## ◈ Validation Rules

```
Commission ID  →  COM-XXXXXX  (COM- + 6 digits)
Client ID      →  CLT-XXXXX   (CLT- + 5 digits)
Delivery Date  →  Must be a future date
Revision Count →  Integer between 0 and 20
Client Notes   →  Maximum 500 characters
Priority Level →  standard | express | rush only
```

---

<div align="center">

<!-- Footer Wave -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=C9963A&height=120&section=footer&animation=fadeIn" />

<p>
  <img src="https://img.shields.io/badge/Made%20with-React%20%2B%20Node.js-C9963A?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
</p>

**Digital Art Commission Management System**
*Case Study — Domain 5 | Full Stack Web Application*

</div>
