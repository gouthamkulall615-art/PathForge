# PathForge

PathForge is a curated learning-roadmap platform for aspiring engineers. It brings together hand-picked, phase-by-phase roadmaps across ten engineering tracks, with vetted learning resources, progress tracking, search and filtering, and Google sign-in.

**Live demo:** https://path-forge-amber.vercel.app

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Career Tracks](#career-tracks)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Google Authentication Setup](#google-authentication-setup)
- [Available Scripts](#available-scripts)
- [Data Model](#data-model)
- [Customization Guide](#customization-guide)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author](#author)

---

## Overview

Learning engineering skills online is rarely a problem of too little content, but of too much. PathForge addresses this by organizing each career path into clear phases, each with a defined difficulty level, estimated duration, focused topics, and a short list of high-quality resources (videos and official documentation).

The application is a fully client-side single-page app. All curriculum data lives in a single data file, which makes the content easy to review, extend, and maintain.

## Features

- **Ten curated career tracks** with 41 phases and 160+ vetted resources
- **Phase-based timeline** with numbered milestones, durations, and difficulty badges (beginner, intermediate, advanced)
- **Topic progress tracking** with per-topic checkboxes, per-phase and per-track completion bars, and a continue-where-you-left-off shortcut
- **Search and filters** across tracks, phases, topics, and resources, with filters for difficulty, resource type, and progress status
- **Google sign-in** with progress stored per user
- **Dark and light themes** with system-preference detection and persistence
- **Responsive design** with a mobile navigation drawer
- **Accessible interface** with keyboard-operable controls, visible focus states, and semantic markup
- **Fast builds** powered by Vite

## Career Tracks

| Track | ID | Phases |
|---|---|---|
| Frontend Development | `frontend` | 5 |
| Backend Development | `backend` | 4 |
| Machine Learning / AI | `ml` | 4 |
| DevOps | `devops` | 4 |
| Cybersecurity | `cyber` | 4 |
| UX / UI Design | `uxdesign` | 4 |
| Data Science | `datascience` | 4 |
| Mobile Development | `mobile` | 4 |
| Cloud Engineering | `cloud` | 4 |
| Blockchain / Web3 | `blockchain` | 4 |

## Tech Stack

| Area | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 with custom `@theme` tokens |
| Icons | Lucide React |
| Authentication | Google Identity Services (`@react-oauth/google`) |
| State management | React Context and hooks |
| Persistence | `localStorage` behind a storage abstraction layer |
| Hosting | Vercel |

## Project Structure

```
roadmap/
├── index.html
├── package.json
├── vite.config.js
├── .env                       # local environment variables (not committed)
└── src/
    ├── App.jsx                # App shell and view switching
    ├── main.jsx               # Entry point and providers
    ├── index.css              # Tailwind theme tokens and global styles
    ├── data/
    │   └── fields.js          # Curriculum data: tracks, phases, topics, resources
    ├── components/
    │   ├── Navbar.jsx
    │   ├── HeroSection.jsx
    │   ├── FieldCard.jsx
    │   ├── FieldIcon.jsx
    │   ├── RoadmapView.jsx
    │   ├── PhaseCard.jsx
    │   └── SearchFilters.jsx
    ├── contexts/
    │   ├── ThemeContext.jsx
    │   ├── ProgressContext.jsx
    │   └── AuthContext.jsx
    └── lib/
        ├── progressStorage.js # Single access point for progress persistence
        └── searchFields.js    # Pure search and filter logic
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/gouthamkulall615-art/<repository-name>.git
cd <repository-name>

# Install dependencies
npm install

# Create your environment file
cp .env.example .env    # or create .env manually (see below)

# Start the development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Environment Variables

Create a `.env` file in the project root:

```
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

| Variable | Required | Description |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Yes, for sign-in | OAuth 2.0 Web client ID from Google Cloud Console |

**Security note:** Variables prefixed with `VITE_` are embedded in the public JavaScript bundle. Never place a client secret or any private credential in a `VITE_` variable. The OAuth client secret is not required by this frontend and must only be used by a backend service.

If the variable is not set, the sign-in interface is hidden and the rest of the application continues to work normally.

## Google Authentication Setup

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and select or create a project.
2. Configure the OAuth consent screen under **APIs & Services**.
3. Go to **Credentials**, choose **Create Credentials**, then **OAuth client ID**, and set the application type to **Web application**.
4. Add the following **Authorized JavaScript origins** (no trailing slashes, no paths):

   ```
   http://localhost:5173
   http://localhost
   https://path-forge-amber.vercel.app
   ```

5. Leave **Authorized redirect URIs** empty. They are only required when a server handles the OAuth callback.
6. Copy the generated **Client ID** into `VITE_GOOGLE_CLIENT_ID`.
7. Allow a few minutes for Google to apply the changes.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot module replacement |
| `npm run build` | Create an optimized production build in `/dist` |
| `npm run preview` | Serve the production build locally |

## Data Model

All curriculum content is defined in `src/data/fields.js` as an array of track objects.

```javascript
{
  id: "frontend",
  name: "Frontend Development",
  desc: "Short description of the track.",
  phases: [
    {
      id: "frontend_p1",
      label: "Phase 1",
      level: "beginner",          // "beginner" | "intermediate" | "advanced"
      name: "Web Fundamentals",
      duration: "4-6 weeks",
      desc: "What this phase covers.",
      topics: [
        { name: "Semantic HTML", detail: "Elements, structure, and accessibility basics" }
      ],
      resources: [
        {
          label: "Resource Title - Creator",
          url: "https://example.com",
          type: "yt"              // "yt" for video, "docs" for documentation
        }
      ]
    }
  ]
}
```

Topic identifiers used for progress tracking are generated from the phase ID and topic name (`phaseId:topic-slug`). Renaming a topic will reset its completion state.

## Customization Guide

### Add or edit content

Edit `src/data/fields.js`. To add a new track, append an object to the `FIELDS` array following the data model above.

### Add an icon for a new track

Map the track ID to a Lucide icon in `src/components/FieldIcon.jsx`:

```javascript
import { Gamepad2 } from 'lucide-react'

const ICON_MAP = {
  // existing tracks
  gamedev: Gamepad2,
}
```

### Change colors and fonts

Theme tokens are defined in `src/index.css`:

```css
@theme {
  --color-accent: #0A66C2;
  --color-accent-dark: #004182;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Modify the interface

| Goal | File |
|---|---|
| Hero copy and statistics | `src/components/HeroSection.jsx` |
| Navigation links and branding | `src/components/Navbar.jsx` |
| Phase card layout and badges | `src/components/PhaseCard.jsx` |
| About page content | `AboutSection` in `src/App.jsx` |

## Deployment

The project is deployed on Vercel.

1. Push the repository to GitHub.
2. Import the repository in Vercel. The Vite framework preset is detected automatically.
3. Add `VITE_GOOGLE_CLIENT_ID` under **Project Settings, Environment Variables**.
4. Deploy. Redeploy after any environment variable change, since Vite reads variables at build time.
5. Ensure the production URL is listed in the Google OAuth **Authorized JavaScript origins**.

Note that Google sign-in works on the main production domain. Vercel preview deployment URLs must be added individually to the authorized origins to support sign-in.

## Roadmap

- Backend service (Node.js, Express, MongoDB) that verifies Google ID tokens and syncs progress across devices
- Study planner with target dates and reminders
- Per-phase quizzes and spaced-repetition review
- Interactive node-graph view of roadmaps with prerequisites
- Community-contributed roadmaps and resource voting
- Progressive Web App support with offline access
- Markdown and PDF export of roadmaps as study checklists

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with clear messages.
4. Push the branch and open a pull request describing the change.

When proposing new resources, prefer official documentation and well-regarded, up-to-date courses, and verify that every link works.

## Author

**Goutham**

- GitHub: [gouthamkulall615-art](https://github.com/gouthamkulall615-art)
- LinkedIn: [Goutham M](https://www.linkedin.com/in/goutham-m-ba2224385/)