# ⚡ PathForge

> **Interactive Learning Roadmap Generator**

PathForge is a fully client-side React application that provides structured, phase-based learning roadmaps for 17+ tech fields — from Web Development to Quantum Computing. Pick a field, follow the path, track your progress.

🌐 **Live Demo**: [path-forge-amber.vercel.app](https://path-forge-amber.vercel.app)

---

## ✨ Features

- **17 Learning Fields** — Web Dev, AI/ML, Data Science, Cloud & DevOps, Cybersecurity, and more
- **Phase-Based Roadmaps** — Each field is broken into structured phases with 4–6 learning nodes each
- **Progress Tracking** — Mark topics as complete and watch your progress bar grow
- **Deep Dive Modals** — Each node includes descriptions, resources, time estimates, and pro tips
- **Dark / Light Mode** — Theme toggle with localStorage persistence
- **Fully Static** — No backend, no API calls, no login required
- **Industrial-Futuristic UI** — Electric cyan accents, scanline textures, JetBrains Mono headings, and smooth spring animations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Tailwind CSS 4 | Utility-first styling |
| Vite 8 | Build tool |
| Lucide React | Icon library |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+

### Installation

```bash
# Clone the repository
git clone https://github.com/gouthamkulall615-art/PathForge.git
cd PathForge

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open `http://localhost:5173` in your browser — no setup, no keys, no config needed.

---

## 📁 Project Structure

```
PathForge/
├── public/
└── src/
    ├── App.jsx                 # Root component and routing logic
    ├── index.css               # Tailwind + custom styles and CSS variables
    ├── App.css                 # App-specific styles
    └── components/
        ├── HomePage.jsx        # Field selector with masonry grid layout
        ├── RoadmapPage.jsx     # Main roadmap display with progress tracking
        ├── NodeDetailModal.jsx # Deep-dive modal for individual topics
        ├── FieldCard.jsx       # Learning field card component
        └── NodeCard.jsx        # Individual roadmap node component
```

---

## 🎯 Learning Fields

| | | |
|---|---|---|
| 🌐 Web Development | 📱 App Development | 🛡️ Cybersecurity |
| 🤖 AI / Machine Learning | 📊 Data Science | 💻 Core CS Fundamentals |
| 🧩 DSA & Competitive Programming | ☁️ Cloud & DevOps | 🎮 Game Development |
| 🔗 Blockchain & Web3 | 🐧 Linux & Systems Programming | 🔒 Embedded & IoT |
| 🎨 UI/UX Design | 🏗️ Software Architecture | 📡 Networking & Protocols |
| 🧪 QA & Testing | 🔬 Quantum Computing | |

---

## 🎨 Design System

**Color Palette (Dark Mode)**

| Token | Value | Usage |
|---|---|---|
| Background Primary | `#0A0E1A` | Deep slate black |
| Background Card | `#1A2035` | Lighter slate |
| Accent Cyan | `#00D4FF` | Primary interactive accent |
| Accent Amber | `#FFB347` | Warm highlights |
| Accent Green | `#4ADE80` | Completion/success states |

**Typography**
- Headings — `JetBrains Mono` (technical, monospaced)
- Body — `Plus Jakarta Sans` (humanist, readable)

**Animations**
- Card reveal with 50ms staggered fade + slide on load
- Spring-like hover scale with glow (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Smooth 300ms dark/light mode transitions

---

## 🔧 Customization

**Add a new learning field** — edit the `FIELDS` array in `src/components/HomePage.jsx`:
```js
{ name: 'Your Field', tagline: 'Your tagline here', icon: '🔥' }
```

**Change accent colors** — update CSS variables in `src/index.css`:
```css
:root {
  --accent-cyan: #00d4ff;
  --accent-amber: #ffb347;
}
```

**Adjust animation timing** — modify keyframes in `tailwind.config.js`:
```js
animation: {
  'draw-in': 'drawIn 0.6s ease-out forwards',
}
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|---|---|
| Styles not loading | Clear browser cache (`Ctrl+Shift+Del`) and reload |
| Components not appearing | Check browser console (`F12`) for errors |

---

## 📦 Build for Production

```bash
npm run build    # Creates optimized build in /dist
npm run preview  # Preview the production build locally
```


## 🤝 Contributing

Fork it, improve it, make it yours. PRs are welcome!

---

*Made with ❤️ using React and Tailwind CSS*
