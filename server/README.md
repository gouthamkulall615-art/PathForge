# PathForge Backend Server

Express.js + MongoDB backend for the PathForge learning roadmap platform.
Handles Google OAuth 2.0 token verification, user persistence, roadmap checklist progress, and personalized onboarding quiz profiles.

---

## 📁 Directory Structure

```
server/
├── package.json              # Server dependencies and run scripts
├── .env.example              # Template environment variables
├── .env                      # Local environment configuration
├── .gitignore                # Git exclusions (node_modules, .env)
├── README.md                 # Server documentation
└── src/
    ├── server.js             # Express app setup, middleware & HTTP listener
    ├── config/
    │   └── db.js             # Mongoose connection & graceful fallback
    ├── models/               # Mongoose data schemas
    │   ├── User.js           # Google user profile schema
    │   ├── Progress.js       # Completed topic IDs & last visited track
    │   ├── Profile.js        # Onboarding quiz answers & personalized roadmap
    │   └── UiPrefs.js        # UI preferences (map/list view, focus mode)
    ├── middleware/
    │   ├── authMiddleware.js # Google ID Token verifier via google-auth-library
    │   └── errorHandler.js   # Centralized JSON error responder
    ├── controllers/          # Business logic handlers
    │   ├── authController.js
    │   ├── progressController.js
    │   ├── profileController.js
    │   └── uiPrefsController.js
    └── routes/               # Express API route endpoints
        ├── authRoutes.js     # /api/auth
        ├── progressRoutes.js # /api/progress
        ├── profileRoutes.js  # /api/profile
        └── uiPrefsRoutes.js  # /api/uiprefs
```

---

## 🚀 Quickstart

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Review and update `.env` if necessary:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pathforge
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=280372631104-20fut0td71q94l2efehb0pv9hjahqcbt.apps.googleusercontent.com
```

> **Note on MongoDB**: You can run MongoDB locally (`mongod`), use Docker (`docker run -p 27017:27017 mongo`), or paste a free cloud connection string from [MongoDB Atlas](https://www.mongodb.com/atlas). The server runs even if MongoDB is offline, logging a clear fallback warning.

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` with hot-reloading via `nodemon`.

### 4. Run Production Server

```bash
npm start
```

---

## 📡 API Endpoints Summary

### Health
- `GET /api/health` — Server uptime & status check.

### Authentication (`/api/auth`)
- `POST /api/auth/google` — Verifies Google ID token, creates or finds user, returns user object.
- `GET /api/auth/me` *(Protected)* — Returns current verified user profile.

### Progress (`/api/progress`)
- `GET /api/progress` *(Protected)* — Fetches completed topics and last visited track.
- `PUT /api/progress` *(Protected)* — Updates topic progress.
- `POST /api/progress/merge-guest` *(Protected)* — Merges unauthenticated guest progress into user account.
- `DELETE /api/progress` *(Protected)* — Resets progress (or for a specific `?fieldId=...`).

### Personalized Profile (`/api/profile`)
- `GET /api/profile` *(Protected)* — Fetches saved onboarding quiz answers and generated roadmap.
- `PUT /api/profile` *(Protected)* — Saves/updates quiz answers and generated roadmap.
- `DELETE /api/profile` *(Protected)* — Clears profile for quiz retakes.

### UI Preferences (`/api/uiprefs`)
- `GET /api/uiprefs` *(Protected)* — Fetches view mode (`map` | `list`) and focus mode.
- `PUT /api/uiprefs` *(Protected)* — Updates view mode and focus mode.

