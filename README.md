# VolunteerHub — University Innovation Center

A production-ready volunteer management system built with React + Vite, Tailwind CSS, and Firebase.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   React (Vite)                   │
│                                                  │
│  Public Routes          Admin Routes (protected) │
│  ├─ / (Volunteer List)  ├─ /admin (Dashboard)   │
│  └─ /volunteer/:id      ├─ /admin/volunteer/new  │
│                         └─ /admin/volunteer/edit │
│                                                  │
│  src/                                            │
│  ├─ services/      ← Firebase logic (pure JS)    │
│  │   ├─ firebase.js   (init)                     │
│  │   ├─ volunteers.js (Firestore CRUD)           │
│  │   ├─ storage.js    (CV uploads)               │
│  │   └─ auth.js       (login/logout)             │
│  ├─ hooks/         ← Reusable React state        │
│  │   ├─ useAuth.js                               │
│  │   └─ useVolunteers.js                         │
│  ├─ pages/         ← Route-level components      │
│  └─ components/    ← Reusable UI pieces          │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│                    Firebase                      │
│                                                  │
│  Firestore          Storage         Auth         │
│  ─────────          ───────         ────         │
│  /volunteers        /cvs/           Email +      │
│    {id}               {studentId}_  Password     │
│    firstName          {filename}    (admin only) │
│    lastName                                      │
│    faculty                                       │
│    studentId                                     │
│    role                                          │
│    skills[]                                      │
│    bio                                           │
│    cvUrl                                         │
│    cvFileName                                    │
│    storagePath                                   │
│    createdAt                                     │
│    updatedAt                                     │
└─────────────────────────────────────────────────┘
```

**Key design decisions:**
- Filtering is done **client-side** after fetching all volunteers — avoids complex Firestore composite indexes and makes search instant.
- CV files are stored in Firebase Storage under `cvs/` with `{studentId}_{filename}` naming to avoid collisions.
- Admin panel is fully protected by Firebase Auth; unauthenticated users are redirected to `/admin/login`.

---

## Step 1 — Prerequisites

- Node.js 18+ installed
- A Google account (for Firebase)
- Git (optional but recommended)

---

## Step 2 — Firebase Project Setup

### 2.1 Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it (e.g. `volunteer-hub`) → Continue → Disable Google Analytics (optional) → Create project

### 2.2 Enable Firestore

1. In sidebar: **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** → Next
4. Select your region (e.g. `us-central`) → Enable

### 2.3 Enable Firebase Storage

1. In sidebar: **Build → Storage**
2. Click **"Get started"**
3. Choose **"Start in production mode"** → Next → Done

### 2.4 Enable Firebase Authentication

1. In sidebar: **Build → Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** → Save

### 2.5 Create your admin user

1. In **Authentication → Users** tab
2. Click **"Add user"**
3. Enter your admin email + password → Add user
4. ✅ This is the only account that can access the admin panel

### 2.6 Get your Firebase config

1. In Firebase Console → **Project Settings** (gear icon ⚙️)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → choose **Web** (`</>`)
4. Register app (no Firebase Hosting needed here) → Register app
5. Copy the `firebaseConfig` object values

---

## Step 3 — Local Setup

```bash
# Clone or download the project
cd volunteer-hub

# Install dependencies
npm install

# Create your environment file
cp .env.example .env.local
```

Now open `.env.local` and fill in your Firebase values:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

```bash
# Start development server
npm run dev
```

Visit **http://localhost:5173** — you'll see the public volunteer list (empty for now).

---

## Step 4 — Deploy Firebase Security Rules

Install Firebase CLI if you haven't:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

When asked during `firebase init`:
- Select **Firestore** and **Storage**
- Use the existing project you created
- Use the existing `firestore.rules`, `firestore.indexes.json`, `storage.rules` files

Deploy the rules:

```bash
firebase deploy --only firestore:rules,storage
```

**What the rules do:**
- `firestore.rules`: Anyone can **read** volunteers; only authenticated users can **write**
- `storage.rules`: Anyone can **read** CV files (download links work publicly); only authenticated users can upload; max 10MB per file

---

## Step 5 — Test the App

1. Visit `http://localhost:5173/admin/login`
2. Log in with the admin email/password you created in Firebase Auth
3. Add a volunteer with a CV file
4. Visit `http://localhost:5173` to see them on the public page

---

## Step 6 — Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
npm run build
vercel
```

Follow the prompts. When asked about environment variables, add each `VITE_FIREBASE_*` variable.

### Option B — Vercel Dashboard (recommended)

1. Push your code to GitHub (make sure `.env.local` is in `.gitignore` ✅)
2. Go to [https://vercel.com](https://vercel.com) → Import project → Select your repo
3. Framework: **Vite** (auto-detected)
4. Go to **Settings → Environment Variables** and add:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Click **Deploy**

The `vercel.json` file included in the project ensures React Router works correctly (all routes redirect to `index.html`).

### Post-deploy: Add your domain to Firebase Auth

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Add your Vercel domain (e.g. `volunteer-hub.vercel.app`)

---

## Project Structure

```
volunteer-hub/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx     # Admin shell with nav
│   │   │   ├── CVDropzone.jsx      # Drag & drop file upload
│   │   │   └── SkillTagInput.jsx   # Multi-tag skill input
│   │   └── public/
│   │       ├── PublicLayout.jsx    # Public shell with header/footer
│   │       ├── VolunteerCard.jsx   # Card component for list view
│   │       └── FilterBar.jsx       # Search + filter dropdowns
│   ├── hooks/
│   │   ├── useAuth.js              # Firebase auth state
│   │   └── useVolunteers.js        # Fetch all volunteers
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── LoginPage.jsx       # Admin login
│   │   │   ├── AdminDashboard.jsx  # Manage volunteers table
│   │   │   └── VolunteerForm.jsx   # Add / Edit form
│   │   └── public/
│   │       ├── VolunteerListPage.jsx  # Browse + filter
│   │       └── VolunteerDetailPage.jsx # Full profile + CV
│   ├── services/
│   │   ├── firebase.js             # Firebase init
│   │   ├── volunteers.js           # Firestore CRUD + filtering
│   │   ├── storage.js              # CV upload/delete
│   │   └── auth.js                 # Login/logout/subscribe
│   ├── App.jsx                     # Routes + guards
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Tailwind + global styles
├── firestore.rules                 # Security rules
├── firestore.indexes.json          # Firestore indexes
├── storage.rules                   # Storage security rules
├── firebase.json                   # Firebase config
├── vercel.json                     # SPA routing for Vercel
├── tailwind.config.js
├── vite.config.js
├── .env.example                    # Environment template
└── package.json
```

---

## Volunteer Data Model

Each document in the `volunteers` Firestore collection:

```js
{
  firstName: "Ada",
  lastName: "Lovelace",
  faculty: "Engineering",
  studentId: "STU20240001",
  role: "Tech Lead",              // optional
  skills: ["Python", "React"],    // array of strings
  bio: "Passionate about...",     // optional
  cvUrl: "https://firebasestorage.googleapis.com/...",
  cvFileName: "ada_lovelace_cv.pdf",
  storagePath: "cvs/STU20240001_ada_lovelace_cv.pdf",
  createdAt: Timestamp,
  updatedAt: Timestamp            // set on edits
}
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| "Firebase: Error (auth/invalid-credential)" | Check email/password in Firebase Auth console |
| CV upload fails | Check Storage rules are deployed; check file is PDF/DOC/DOCX |
| Volunteers don't appear | Check Firestore rules allow public read; check project ID in `.env.local` |
| React Router 404 on Vercel | Ensure `vercel.json` is present and deployed |
| CORS errors | Add your domain to Firebase Auth authorized domains |

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + custom design tokens |
| Routing | React Router v6 |
| Database | Firebase Firestore |
| File Storage | Firebase Storage |
| Authentication | Firebase Auth (Email/Password) |
| Notifications | react-hot-toast |
| File Upload UI | react-dropzone |
| Deployment | Vercel |
