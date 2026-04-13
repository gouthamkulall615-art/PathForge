# PathForge - AI-Powered Interactive Learning Roadmap Generator

A stunning, fully client-side React + Tailwind CSS application that leverages the Anthropic API to dynamically generate personalized learning roadmaps for 17+ learning fields.

## ✨ Features

- **AI-Powered Roadmap Generation**: Uses Claude 3.5 Sonnet to generate comprehensive, personalized learning paths
- **17 Learning Fields**: Web Development, AI/ML, Data Science, Cloud & DevOps, and more
- **Dark/Light Mode Toggle**: Beautiful theme switching with localStorage persistence
- **Interactive Roadmap Visualization**: Phase-based organization with color-coded learning nodes
- **Progress Tracking**: Mark completed topics and visualize your learning progress
- **Detailed Modal Views**: Deep dive into each learning topic with descriptions, resources, and pro tips
- **Fully Client-Side**: No backend server required—all processing happens in your browser
- **Responsive Design**: Mobile-first approach with asymmetric masonry grid layout
- **Premium Aesthetic**: Industrial-futuristic design with electric cyan accents, smooth animations, and scanline textures

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Anthropic API key (get one free at [console.anthropic.com](https://console.anthropic.com/keys))

### Installation

1. **Navigate to the project directory**

```bash
cd e:\roadmap
```

2. **Dependencies are already installed**, but if needed:

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**

- Navigate to `http://localhost:5173/`
- Enter your Anthropic API key when prompted
- Your key is stored only in your browser's localStorage

5. **Select a learning field and explore!**

## 🎨 Design System

### Color Tokens (Dark Mode)

- **Background Primary**: `#0A0E1A` (deep slate black)
- **Background Card**: `#1A2035` (lighter slate)
- **Accent Cyan**: `#00D4FF` (electric blue)
- **Accent Amber**: `#FFB347` (warm gold)
- **Accent Red**: `#FF6B6B` (vibrant red)
- **Accent Green**: `#4ADE80` (success green)

### Typography

- **Headings**: JetBrains Mono (monospaced, technical feel)
- **Body**: Plus Jakarta Sans (humanist, readable)

### Interactive Elements

- Cards have glowing borders on hover (`box-shadow: 0 0 30px rgba(0, 212, 255, 0.3)`)
- Smooth 300ms transitions throughout
- Spring-like animations (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Subtle scanline texture overlay

## 📁 Project Structure

```
src/
├── App.jsx                 # Main app component with routing logic
├── index.css              # Tailwind + custom styles
├── App.css                # Minimal app-specific styles
└── components/
    ├── ApiKeyGate.jsx     # Initial API key input screen
    ├── HomePage.jsx       # Field selector with masonry grid
    ├── RoadmapPage.jsx    # Main roadmap display
    ├── NodeDetailModal.jsx # Deep-dive modal for topics
    ├── FieldCard.jsx      # Individual field card component
    └── NodeCard.jsx       # Individual roadmap node component
```

## 🧠 How It Works

1. **API Key Management**:
   - First-time users see a secure input screen
   - API key stored in `localStorage` (client-side only)
   - Can be changed anytime via the app

2. **Roadmap Generation**:
   - When you select a field, the app calls `POST https://api.anthropic.com/v1/messages`
   - Claude generates a structured learning roadmap in JSON format
   - Includes 4-5 phases, each with 4-6 learning nodes
   - Each node includes type (core/optional/advanced), estimated time, description, resources, etc.

3. **Data Structure**:

   ```json
   {
     "field": "Web Development",
     "tagline": "Build the web, shape the world",
     "phases": [
       {
         "id": "phase-1",
         "title": "Foundation",
         "color": "#00D4FF",
         "nodes": [
           {
             "id": "node-1-1",
             "title": "HTML Basics",
             "type": "core",
             "estimatedTime": "1-2 weeks",
             "children": [],
             "details": {
               "description": "...",
               "keyTopics": [...],
               "resources": [...],
               "tips": "...",
               "prerequisites": []
             }
           }
         ]
       }
     ]
   }
   ```

4. **Progress Tracking**:
   - Check off completed topics (stored in component state)
   - Progress bar shows completion percentage
   - Completed nodes display with strikethrough text and green highlight

## 🎯 Learning Fields

1. 🌐 Web Development
2. 📱 App Development
3. 🛡️ Cybersecurity
4. 🤖 AI / Machine Learning
5. 📊 Data Science
6. 💻 Core CS Fundamentals
7. 🧩 DSA & Competitive Programming
8. ☁️ Cloud & DevOps
9. 🎮 Game Development
10. 🔗 Blockchain & Web3
11. 🐧 Linux & Systems Programming
12. 🔒 Embedded & IoT
13. 🎨 UI/UX Design
14. 🏗️ Software Architecture
15. 📡 Networking & Protocols
16. 🧪 QA & Testing
17. 🔬 Quantum Computing

## 🎬 Animation Showcase

- **Card Reveal**: Staggered fade + slide animations on page load (50ms stagger)
- **Hover Effects**: Scale + glow transformations on interactive elements
- **Theme Toggle**: Smooth morphing sun/moon icon with 300ms color transitions
- **Loading State**: Pulsing animated dots with "Forging your path..." message
- **Modal Entry**: Slide-up animation with blur background
- **Progress Bar**: Smooth width transition on node completion

## 🔒 Security & Privacy

- **Zero Backend**: All processing happens in your browser
- **API Key Storage**: Stored only in browser localStorage (not sent anywhere except to Anthropic)
- **No Data Collection**: No analytics, no tracking, no data persistence
- **HTTPS Only**: Communication with Anthropic API is encrypted

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

```bash
npm run preview
```

Preview the production build locally.

## 🛠️ Tech Stack

- **React 19**: UI framework with hooks
- **Tailwind CSS 4**: Utility-first styling
- **Vite 8**: Lightning-fast build tool
- **Lucide React**: Beautiful icon library
- **PostCSS + Autoprefixer**: CSS processing
- **Anthropic API**: Claude 3.5 Sonnet for AI features

## 🎓 Customization

### Add a New Field

Edit `src/components/HomePage.jsx` and add to the `FIELDS` array:

```javascript
{ name: 'Your Field', tagline: 'Your tagline', icon: '🔥' }
```

### Modify Colors

Update CSS variables in `src/index.css`:

```css
:root {
  --accent-cyan: #00d4ff;
  /* ... */
}
```

### Change Animation Timing

Modify keyframe speeds in `tailwind.config.js`:

```javascript
animation: {
  'draw-in': 'drawIn 0.6s ease-out forwards',
}
```

## 🐛 Troubleshooting

- **"Invalid API Key" error**: Ensure your API key is valid and active at [console.anthropic.com](https://console.anthropic.com/keys)
- **"Failed to parse JSON" error**: This might be a temporary API issue. Click "Regenerate" to try again
- **Styles not loading**: Clear browser cache and reload (Ctrl+Shift+Del)
- **Components not appearing**: Check browser console (F12) for errors

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

---

**Made with ❤️ using React, Tailwind, and Anthropic's Claude API**

Happy learning! 🚀
