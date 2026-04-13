import { useState, useEffect, useCallback, useMemo } from "react";

// ─── HARDCODED ROADMAP DATA ───────────────────────────────────────────────────
const ROADMAP_DATA = {
  "Web Development": {
    field: "Web Development",
    tagline: "Build the web, shape the world",
    phases: [
      {
        id: "phase-1", title: "Foundation", color: "#00D4FF",
        nodes: [
          { id: "n1-1", title: "HTML Basics", type: "core", estimatedTime: "1-2 weeks", children: ["n1-2"], details: { description: "HTML is the backbone of every webpage. Learn semantic elements, forms, tables, and accessibility best practices to build well-structured documents.", keyTopics: ["Semantic HTML5", "Forms & Inputs", "Tables", "Accessibility (a11y)", "Meta tags"], resources: [{ name: "MDN Web Docs", type: "free" }, { name: "The Odin Project", type: "free" }, { name: "HTML & CSS by Jon Duckett", type: "paid" }], tips: "Always write semantic HTML — use <article>, <section>, <nav> instead of div soup.", prerequisites: [] } },
          { id: "n1-2", title: "CSS Fundamentals", type: "core", estimatedTime: "2-3 weeks", children: ["n1-3"], details: { description: "CSS controls the visual presentation of your HTML. Master the box model, flexbox, grid, and responsive design to create beautiful layouts.", keyTopics: ["Box Model", "Flexbox", "CSS Grid", "Responsive Design", "CSS Variables"], resources: [{ name: "CSS-Tricks", type: "free" }, { name: "Flexbox Froggy", type: "free" }, { name: "Grid Garden", type: "free" }], tips: "Learn Flexbox and Grid together — they complement each other perfectly for modern layouts.", prerequisites: ["n1-1"] } },
          { id: "n1-3", title: "JavaScript Basics", type: "core", estimatedTime: "3-4 weeks", children: ["n2-1", "n2-2"], details: { description: "JavaScript brings interactivity to the web. Start with variables, functions, DOM manipulation, and event handling to make pages dynamic.", keyTopics: ["Variables & Types", "Functions", "DOM Manipulation", "Events", "ES6+ Features"], resources: [{ name: "javascript.info", type: "free" }, { name: "Eloquent JavaScript", type: "free" }, { name: "You Don't Know JS", type: "free" }], tips: "Build small projects like a todo list or calculator before moving to frameworks.", prerequisites: ["n1-2"] } },
          { id: "n1-4", title: "Git & Version Control", type: "core", estimatedTime: "1 week", children: [], details: { description: "Git is essential for tracking code changes and collaborating with others. Learn commits, branches, merging, and working with GitHub.", keyTopics: ["Git Basics", "Branching & Merging", "GitHub", "Pull Requests", "Git Flow"], resources: [{ name: "Pro Git Book", type: "free" }, { name: "GitHub Learning Lab", type: "free" }], tips: "Commit early and often with meaningful messages. Think of commits as a diary of your work.", prerequisites: [] } },
        ]
      },
      {
        id: "phase-2", title: "Frontend Mastery", color: "#FFB347",
        nodes: [
          { id: "n2-1", title: "React.js", type: "core", estimatedTime: "4-6 weeks", children: ["n2-3"], details: { description: "React is the most popular frontend library. Learn components, props, state, hooks, and the virtual DOM to build modern UIs.", keyTopics: ["Components & Props", "useState & useEffect", "React Router", "Context API", "Custom Hooks"], resources: [{ name: "React Docs (react.dev)", type: "free" }, { name: "Scrimba React Course", type: "free" }, { name: "Epic React by Kent C. Dodds", type: "paid" }], tips: "Understand the mental model of 'UI as a function of state' before diving into complex patterns.", prerequisites: ["n1-3"] } },
          { id: "n2-2", title: "TypeScript", type: "optional", estimatedTime: "2-3 weeks", children: ["n2-3"], details: { description: "TypeScript adds static typing to JavaScript, catching bugs at compile time. It's become an industry standard for large-scale applications.", keyTopics: ["Types & Interfaces", "Generics", "Type Narrowing", "Utility Types", "TSConfig"], resources: [{ name: "TypeScript Handbook", type: "free" }, { name: "Total TypeScript", type: "free" }, { name: "Programming TypeScript (O'Reilly)", type: "paid" }], tips: "Start by adding TypeScript to an existing JS project rather than learning in isolation.", prerequisites: ["n1-3"] } },
          { id: "n2-3", title: "Tailwind CSS", type: "core", estimatedTime: "1-2 weeks", children: ["n3-1"], details: { description: "Tailwind is a utility-first CSS framework that speeds up UI development. Learn to compose complex designs without leaving your HTML.", keyTopics: ["Utility Classes", "Responsive Prefixes", "Dark Mode", "Custom Config", "Component Patterns"], resources: [{ name: "Tailwind CSS Docs", type: "free" }, { name: "Tailwind UI", type: "paid" }], tips: "Use the Tailwind IntelliSense VS Code extension — it's a game changer for productivity.", prerequisites: ["n1-2"] } },
          { id: "n2-4", title: "State Management", type: "advanced", estimatedTime: "2-3 weeks", children: ["n3-2"], details: { description: "As apps scale, managing state becomes complex. Learn Zustand or Redux Toolkit for global state, and React Query for server state.", keyTopics: ["Zustand", "Redux Toolkit", "React Query / TanStack Query", "Context vs External State", "Optimistic Updates"], resources: [{ name: "Zustand Docs", type: "free" }, { name: "Redux Toolkit Docs", type: "free" }, { name: "TanStack Query Docs", type: "free" }], tips: "Don't reach for global state immediately. Try lifting state and Context first.", prerequisites: ["n2-1"] } },
        ]
      },
      {
        id: "phase-3", title: "Backend & APIs", color: "#FF6B6B",
        nodes: [
          { id: "n3-1", title: "Node.js & Express", type: "core", estimatedTime: "3-4 weeks", children: ["n3-3"], details: { description: "Node.js lets you run JavaScript on the server. Express simplifies building REST APIs with routes, middleware, and request handling.", keyTopics: ["Node.js Runtime", "Express Routes", "Middleware", "REST API Design", "Error Handling"], resources: [{ name: "Node.js Docs", type: "free" }, { name: "The Odin Project Backend", type: "free" }, { name: "Node.js Design Patterns", type: "paid" }], tips: "Understand the event loop deeply — it explains why Node.js is great for I/O-heavy tasks.", prerequisites: ["n1-3"] } },
          { id: "n3-2", title: "Databases (SQL & NoSQL)", type: "core", estimatedTime: "3-4 weeks", children: ["n3-3"], details: { description: "Learn to persist data with PostgreSQL for relational data and MongoDB for document-based storage. Understand when to use each.", keyTopics: ["SQL Queries", "PostgreSQL", "MongoDB", "ORMs (Prisma)", "Indexing & Performance"], resources: [{ name: "PostgreSQL Tutorial", type: "free" }, { name: "MongoDB University", type: "free" }, { name: "Prisma Docs", type: "free" }], tips: "Learn SQL first — it teaches you to think relationally, which helps even when using NoSQL.", prerequisites: [] } },
          { id: "n3-3", title: "Authentication & Security", type: "core", estimatedTime: "2-3 weeks", children: ["n4-1"], details: { description: "Secure your applications with JWT, OAuth, session management, and common security practices to prevent XSS, CSRF, and SQL injection.", keyTopics: ["JWT Tokens", "OAuth 2.0", "bcrypt Hashing", "HTTPS & CORS", "OWASP Top 10"], resources: [{ name: "Auth0 Blog", type: "free" }, { name: "OWASP Cheat Sheets", type: "free" }], tips: "Never roll your own crypto. Use well-tested libraries like bcrypt and established auth providers.", prerequisites: ["n3-1"] } },
          { id: "n3-4", title: "REST & GraphQL APIs", type: "optional", estimatedTime: "2 weeks", children: ["n4-1"], details: { description: "Master REST API design principles and explore GraphQL for flexible data fetching. Both are essential in modern web development.", keyTopics: ["REST Principles", "HTTP Methods", "GraphQL Schema", "Apollo Client", "API Documentation"], resources: [{ name: "RESTful API Design Guide", type: "free" }, { name: "GraphQL.org", type: "free" }, { name: "Apollo Docs", type: "free" }], tips: "Design your API for the consumers first — think about what data they need, not how it's stored.", prerequisites: ["n3-1"] } },
        ]
      },
      {
        id: "phase-4", title: "DevOps & Deployment", color: "#4ADE80",
        nodes: [
          { id: "n4-1", title: "Docker & Containers", type: "core", estimatedTime: "2-3 weeks", children: ["n4-3"], details: { description: "Docker packages applications into containers for consistent deployment across environments. Learn Dockerfiles, images, containers, and Docker Compose.", keyTopics: ["Dockerfile", "Docker Images", "Docker Compose", "Volumes & Networks", "Multi-stage Builds"], resources: [{ name: "Docker Docs", type: "free" }, { name: "Play with Docker", type: "free" }], tips: "Start with Docker Compose for local development — it makes multi-service setups trivial.", prerequisites: [] } },
          { id: "n4-2", title: "CI/CD Pipelines", type: "advanced", estimatedTime: "2 weeks", children: ["n4-3"], details: { description: "Automate testing and deployment with GitHub Actions or similar tools. CI/CD ensures code is always in a deployable state.", keyTopics: ["GitHub Actions", "Automated Testing", "Build Pipelines", "Environment Secrets", "Deployment Strategies"], resources: [{ name: "GitHub Actions Docs", type: "free" }, { name: "CircleCI Blog", type: "free" }], tips: "Start with a simple pipeline: lint → test → build → deploy. Add complexity only when needed.", prerequisites: ["n1-4"] } },
          { id: "n4-3", title: "Cloud Deployment", type: "core", estimatedTime: "2-3 weeks", children: [], details: { description: "Deploy your applications to the cloud using platforms like Vercel, Railway, or AWS. Understand domains, SSL, environment variables, and scaling.", keyTopics: ["Vercel / Netlify", "Railway / Render", "AWS EC2 Basics", "Environment Variables", "Domain & SSL"], resources: [{ name: "Vercel Docs", type: "free" }, { name: "AWS Free Tier", type: "free" }, { name: "Cloud Guru", type: "paid" }], tips: "Use Vercel for frontend and Railway for backend to get started — both have generous free tiers.", prerequisites: ["n4-1"] } },
        ]
      },
    ]
  },
  "App Development": {
    field: "App Development",
    tagline: "From idea to app store in record time",
    phases: [
      {
        id: "phase-1", title: "Mobile Foundations", color: "#00D4FF",
        nodes: [
          { id: "n1-1", title: "JavaScript / TypeScript", type: "core", estimatedTime: "3-4 weeks", children: ["n1-2"], details: { description: "Mobile app development with React Native requires solid JavaScript fundamentals. TypeScript adds type safety critical for large mobile codebases.", keyTopics: ["ES6+ Features", "Async/Await", "TypeScript Basics", "Functional Programming", "Modules"], resources: [{ name: "javascript.info", type: "free" }, { name: "TypeScript Handbook", type: "free" }], tips: "Master async patterns early — mobile apps rely heavily on asynchronous data fetching.", prerequisites: [] } },
          { id: "n1-2", title: "React Native Basics", type: "core", estimatedTime: "4-5 weeks", children: ["n2-1", "n2-2"], details: { description: "React Native lets you build native iOS and Android apps using React. Learn core components, StyleSheet, and the bridge architecture.", keyTopics: ["Core Components", "StyleSheet API", "Flexbox Layout", "Platform-specific Code", "Expo Setup"], resources: [{ name: "React Native Docs", type: "free" }, { name: "Expo Docs", type: "free" }, { name: "React Native by Example", type: "paid" }], tips: "Start with Expo for faster development — you can always eject to bare React Native later.", prerequisites: ["n1-1"] } },
          { id: "n1-3", title: "Mobile UI/UX Principles", type: "optional", estimatedTime: "1-2 weeks", children: ["n2-1"], details: { description: "Mobile design differs significantly from web. Learn touch targets, navigation patterns, gestures, and platform-specific design guidelines.", keyTopics: ["iOS HIG", "Material Design", "Touch Targets", "Navigation Patterns", "Gestures"], resources: [{ name: "Apple HIG", type: "free" }, { name: "Material Design Docs", type: "free" }], tips: "Always design for thumbs first — most users interact with their phone one-handed.", prerequisites: [] } },
        ]
      },
      {
        id: "phase-2", title: "Core App Features", color: "#FFB347",
        nodes: [
          { id: "n2-1", title: "Navigation & Routing", type: "core", estimatedTime: "2 weeks", children: ["n3-1"], details: { description: "React Navigation is the standard for mobile navigation. Learn stack, tab, and drawer navigators to create intuitive app flows.", keyTopics: ["Stack Navigator", "Tab Navigator", "Drawer Navigator", "Deep Linking", "Navigation Params"], resources: [{ name: "React Navigation Docs", type: "free" }, { name: "Expo Router", type: "free" }], tips: "Design your navigation structure before coding — changing it later is painful.", prerequisites: ["n1-2"] } },
          { id: "n2-2", title: "State Management", type: "core", estimatedTime: "2-3 weeks", children: ["n3-1"], details: { description: "Mobile apps need robust state management. Learn Zustand for simple state and React Query for server state with caching.", keyTopics: ["Zustand", "React Query", "AsyncStorage", "Context API", "Redux Toolkit"], resources: [{ name: "Zustand Docs", type: "free" }, { name: "TanStack Query", type: "free" }], tips: "Separate UI state from server state — they have different lifecycles and requirements.", prerequisites: ["n1-2"] } },
          { id: "n2-3", title: "Animations & Gestures", type: "advanced", estimatedTime: "2-3 weeks", children: ["n3-2"], details: { description: "Smooth animations are key to great mobile UX. Learn Reanimated 2 and Gesture Handler for 60fps native animations.", keyTopics: ["Reanimated 2", "Gesture Handler", "Shared Values", "Animated Styles", "Layout Animations"], resources: [{ name: "Reanimated Docs", type: "free" }, { name: "William Candillon (YouTube)", type: "free" }], tips: "Run animations on the UI thread with Reanimated 2's worklets for butter-smooth 60fps.", prerequisites: ["n2-1"] } },
        ]
      },
      {
        id: "phase-3", title: "Native Features", color: "#FF6B6B",
        nodes: [
          { id: "n3-1", title: "Camera & Media", type: "optional", estimatedTime: "1-2 weeks", children: ["n4-1"], details: { description: "Access device camera, photo library, and media features. Essential for social, e-commerce, and productivity apps.", keyTopics: ["expo-camera", "expo-image-picker", "Video Playback", "Audio Recording", "File System"], resources: [{ name: "Expo Camera Docs", type: "free" }, { name: "React Native Vision Camera", type: "free" }], tips: "Always request permissions gracefully with explanations — users are more likely to grant them.", prerequisites: [] } },
          { id: "n3-2", title: "Push Notifications", type: "core", estimatedTime: "1-2 weeks", children: ["n4-1"], details: { description: "Push notifications re-engage users. Learn Expo Notifications or Firebase Cloud Messaging to send targeted messages.", keyTopics: ["Expo Notifications", "FCM", "APNs", "Notification Channels", "Background Handlers"], resources: [{ name: "Expo Notifications Docs", type: "free" }, { name: "Firebase Docs", type: "free" }], tips: "Always let users opt into notifications with a clear value proposition — don't spam.", prerequisites: [] } },
          { id: "n3-3", title: "Offline & Storage", type: "core", estimatedTime: "2 weeks", children: ["n4-1"], details: { description: "Great apps work offline. Learn AsyncStorage, SQLite with Expo, and sync strategies to provide seamless offline experiences.", keyTopics: ["AsyncStorage", "Expo SQLite", "WatermelonDB", "Optimistic Updates", "Sync Strategies"], resources: [{ name: "AsyncStorage Docs", type: "free" }, { name: "WatermelonDB Docs", type: "free" }], tips: "Design for offline first, then add sync — retrofitting offline support is much harder.", prerequisites: [] } },
        ]
      },
      {
        id: "phase-4", title: "Publishing & Growth", color: "#4ADE80",
        nodes: [
          { id: "n4-1", title: "App Store Submission", type: "core", estimatedTime: "1-2 weeks", children: [], details: { description: "Publishing to the App Store and Google Play requires certificates, screenshots, metadata, and compliance with platform guidelines.", keyTopics: ["Apple Developer Account", "Google Play Console", "App Signing", "Store Screenshots", "App Review"], resources: [{ name: "Apple App Store Guidelines", type: "free" }, { name: "Google Play Policy", type: "free" }, { name: "EAS Build (Expo)", type: "free" }], tips: "Use EAS Build from Expo to handle the complex build and submission process automatically.", prerequisites: [] } },
          { id: "n4-2", title: "Analytics & Crash Reporting", type: "optional", estimatedTime: "1 week", children: [], details: { description: "Understand how users use your app with analytics, and fix crashes quickly with error reporting tools.", keyTopics: ["Firebase Analytics", "Sentry", "Mixpanel", "Funnel Analysis", "Crash Reports"], resources: [{ name: "Firebase Analytics", type: "free" }, { name: "Sentry React Native", type: "free" }], tips: "Set up crash reporting before launch — you'll want to know immediately when things break in production.", prerequisites: [] } },
        ]
      },
    ]
  },
  "Cybersecurity": {
    field: "Cybersecurity",
    tagline: "Defend the digital frontier",
    phases: [
      {
        id: "phase-1", title: "Security Foundations", color: "#00D4FF",
        nodes: [
          { id: "n1-1", title: "Networking Fundamentals", type: "core", estimatedTime: "3-4 weeks", children: ["n1-2"], details: { description: "Security starts with understanding how networks work. Learn TCP/IP, DNS, HTTP, firewalls, and packet analysis.", keyTopics: ["TCP/IP Model", "DNS & HTTP", "Firewalls", "Wireshark", "Subnetting"], resources: [{ name: "Professor Messer (CompTIA)", type: "free" }, { name: "Networking All-in-One (Mike Meyers)", type: "paid" }], tips: "Set up Wireshark and capture your own traffic — watching real packets is the best way to learn.", prerequisites: [] } },
          { id: "n1-2", title: "Linux & Command Line", type: "core", estimatedTime: "2-3 weeks", children: ["n2-1"], details: { description: "Most security tools run on Linux. Master the command line, scripting, file permissions, and process management.", keyTopics: ["Bash Scripting", "File Permissions", "Process Management", "SSH", "Log Analysis"], resources: [{ name: "OverTheWire: Bandit", type: "free" }, { name: "Linux Journey", type: "free" }], tips: "Install Kali Linux in a VM and use it daily — hands-on practice is everything in security.", prerequisites: [] } },
          { id: "n1-3", title: "Python for Security", type: "core", estimatedTime: "3 weeks", children: ["n2-1", "n2-2"], details: { description: "Python is the scripting language of security professionals. Learn to automate tasks, build tools, and interact with APIs.", keyTopics: ["Scripting Basics", "Socket Programming", "Requests Library", "Scapy", "Automation"], resources: [{ name: "Automate the Boring Stuff", type: "free" }, { name: "Black Hat Python", type: "paid" }], tips: "Build a port scanner from scratch — it teaches networking and Python simultaneously.", prerequisites: [] } },
        ]
      },
      {
        id: "phase-2", title: "Offensive Security", color: "#FF6B6B",
        nodes: [
          { id: "n2-1", title: "Web Application Hacking", type: "core", estimatedTime: "4-6 weeks", children: ["n3-1"], details: { description: "Web apps are the most common attack surface. Learn OWASP Top 10, SQL injection, XSS, CSRF, and broken authentication.", keyTopics: ["OWASP Top 10", "SQL Injection", "XSS & CSRF", "Burp Suite", "IDOR"], resources: [{ name: "PortSwigger Web Academy", type: "free" }, { name: "DVWA", type: "free" }, { name: "Bug Bounty Bootcamp", type: "paid" }], tips: "Complete every PortSwigger lab — it's the gold standard for web security training.", prerequisites: ["n1-2"] } },
          { id: "n2-2", title: "Network Penetration Testing", type: "core", estimatedTime: "4-5 weeks", children: ["n3-1"], details: { description: "Learn to identify and exploit network vulnerabilities using tools like Nmap, Metasploit, and Nessus.", keyTopics: ["Nmap Scanning", "Metasploit", "Nessus", "Privilege Escalation", "Lateral Movement"], resources: [{ name: "TryHackMe", type: "free" }, { name: "HackTheBox", type: "free" }, { name: "PWK / OSCP Course", type: "paid" }], tips: "TryHackMe is perfect for beginners. Move to HackTheBox once you're comfortable with the basics.", prerequisites: ["n1-1"] } },
          { id: "n2-3", title: "Cryptography", type: "optional", estimatedTime: "2-3 weeks", children: ["n3-2"], details: { description: "Understand the cryptographic primitives that secure modern systems — symmetric encryption, public key cryptography, and hash functions.", keyTopics: ["Symmetric & Asymmetric Encryption", "TLS/SSL", "Hash Functions", "PKI", "Common Attacks"], resources: [{ name: "Cryptopals Challenges", type: "free" }, { name: "Crypto 101", type: "free" }], tips: "Do the Cryptopals challenges — they teach cryptographic attacks hands-on, not just theory.", prerequisites: [] } },
        ]
      },
      {
        id: "phase-3", title: "Defensive Security", color: "#FFB347",
        nodes: [
          { id: "n3-1", title: "SOC & Incident Response", type: "core", estimatedTime: "3-4 weeks", children: ["n4-1"], details: { description: "Learn to detect, analyze, and respond to security incidents using SIEM tools, threat hunting, and incident response frameworks.", keyTopics: ["SIEM (Splunk)", "Log Analysis", "Threat Hunting", "Incident Response", "MITRE ATT&CK"], resources: [{ name: "Splunk Free Training", type: "free" }, { name: "SANS Reading Room", type: "free" }], tips: "Learn the MITRE ATT&CK framework — it's the universal language of threat intelligence.", prerequisites: [] } },
          { id: "n3-2", title: "Cloud Security", type: "advanced", estimatedTime: "3-4 weeks", children: ["n4-1"], details: { description: "Cloud environments have unique security challenges. Learn IAM, cloud-native threats, and security posture management for AWS/Azure/GCP.", keyTopics: ["IAM & Least Privilege", "Cloud Trail / Audit Logs", "S3 Bucket Misconfigs", "Container Security", "CSPM"], resources: [{ name: "AWS Security Learning Path", type: "free" }, { name: "CloudGoat (Rhino Security)", type: "free" }], tips: "Misconfigured S3 buckets and overpermissive IAM roles are the most common cloud vulnerabilities.", prerequisites: [] } },
        ]
      },
      {
        id: "phase-4", title: "Certifications & Career", color: "#4ADE80",
        nodes: [
          { id: "n4-1", title: "CompTIA Security+", type: "core", estimatedTime: "6-8 weeks", children: [], details: { description: "Security+ is the industry-standard entry-level certification. It validates core security knowledge and is required by many employers.", keyTopics: ["Threats & Attacks", "Cryptography", "Network Security", "Identity Management", "Risk Management"], resources: [{ name: "Professor Messer Security+ Course", type: "free" }, { name: "CompTIA CertMaster", type: "paid" }], tips: "Professor Messer's free course plus his practice exams is all you need to pass Security+.", prerequisites: [] } },
          { id: "n4-2", title: "OSCP Certification", type: "advanced", estimatedTime: "3-6 months", children: [], details: { description: "OSCP (Offensive Security Certified Professional) is the most respected penetration testing certification. It requires completing a 24-hour practical exam.", keyTopics: ["PWK Course", "Buffer Overflows", "Active Directory", "Report Writing", "Exam Strategy"], resources: [{ name: "Offensive Security PWK", type: "paid" }, { name: "HackTheBox OSCP Prep", type: "free" }], tips: "Root 50+ HackTheBox machines before attempting OSCP — experience is everything for this cert.", prerequisites: ["n4-1"] } },
        ]
      },
    ]
  },
  "AI / Machine Learning": {
    field: "AI / Machine Learning",
    tagline: "Teach machines to think",
    phases: [
      {
        id: "phase-1", title: "Math & Programming Foundations", color: "#00D4FF",
        nodes: [
          { id: "n1-1", title: "Python for Data Science", type: "core", estimatedTime: "3-4 weeks", children: ["n1-2"], details: { description: "Python is the lingua franca of ML. Master NumPy, Pandas, and Matplotlib for data manipulation and visualization.", keyTopics: ["NumPy Arrays", "Pandas DataFrames", "Matplotlib & Seaborn", "Jupyter Notebooks", "Data Cleaning"], resources: [{ name: "Kaggle Python Course", type: "free" }, { name: "Python for Data Analysis (Wes McKinney)", type: "paid" }], tips: "Spend extra time on Pandas — 80% of ML work is data cleaning and preparation.", prerequisites: [] } },
          { id: "n1-2", title: "Statistics & Probability", type: "core", estimatedTime: "3-4 weeks", children: ["n2-1"], details: { description: "ML is applied statistics. Understand probability distributions, hypothesis testing, Bayesian thinking, and statistical inference.", keyTopics: ["Probability Distributions", "Hypothesis Testing", "Bayes Theorem", "Central Limit Theorem", "Correlation vs Causation"], resources: [{ name: "StatQuest (YouTube)", type: "free" }, { name: "Think Stats", type: "free" }], tips: "StatQuest by Josh Starmer is the best statistics resource — his visual explanations are unmatched.", prerequisites: [] } },
          { id: "n1-3", title: "Linear Algebra & Calculus", type: "core", estimatedTime: "4-5 weeks", children: ["n2-1"], details: { description: "Matrices, vectors, and derivatives are the language of neural networks. You don't need a PhD, but solid intuition is essential.", keyTopics: ["Vectors & Matrices", "Matrix Multiplication", "Eigenvalues", "Gradients", "Chain Rule"], resources: [{ name: "3Blue1Brown (YouTube)", type: "free" }, { name: "MIT 18.06 Linear Algebra", type: "free" }], tips: "Watch 3Blue1Brown's 'Essence of Linear Algebra' series first — it builds perfect intuition.", prerequisites: [] } },
        ]
      },
      {
        id: "phase-2", title: "Classical Machine Learning", color: "#FFB347",
        nodes: [
          { id: "n2-1", title: "Supervised Learning", type: "core", estimatedTime: "4-5 weeks", children: ["n2-3", "n3-1"], details: { description: "Learn the core algorithms: linear regression, logistic regression, decision trees, random forests, and SVMs. Understand when to use each.", keyTopics: ["Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests", "SVM"], resources: [{ name: "Scikit-learn Docs", type: "free" }, { name: "Hands-On ML (Aurélien Géron)", type: "paid" }, { name: "Andrew Ng's ML Course", type: "free" }], tips: "Always start with a simple baseline model before trying complex algorithms.", prerequisites: ["n1-2"] } },
          { id: "n2-2", title: "Unsupervised Learning", type: "core", estimatedTime: "2-3 weeks", children: ["n3-1"], details: { description: "Discover patterns without labeled data using clustering (K-Means), dimensionality reduction (PCA), and anomaly detection.", keyTopics: ["K-Means Clustering", "DBSCAN", "PCA", "t-SNE", "Autoencoders"], resources: [{ name: "Scikit-learn User Guide", type: "free" }, { name: "Kaggle ML Courses", type: "free" }], tips: "Visualize your clusters — PCA or t-SNE plots reveal whether your clustering makes intuitive sense.", prerequisites: ["n1-2"] } },
          { id: "n2-3", title: "Feature Engineering", type: "advanced", estimatedTime: "2-3 weeks", children: ["n3-1"], details: { description: "Good features beat complex models. Learn to create, select, and transform features to dramatically improve model performance.", keyTopics: ["Feature Selection", "Encoding Categoricals", "Handling Missing Data", "Feature Scaling", "Feature Creation"], resources: [{ name: "Feature Engineering for ML (Casari)", type: "paid" }, { name: "Kaggle Feature Engineering", type: "free" }], tips: "In competitions, feature engineering usually matters more than model choice. Master it.", prerequisites: ["n2-1"] } },
        ]
      },
      {
        id: "phase-3", title: "Deep Learning", color: "#FF6B6B",
        nodes: [
          { id: "n3-1", title: "Neural Networks & PyTorch", type: "core", estimatedTime: "5-6 weeks", children: ["n3-3"], details: { description: "Deep learning powers modern AI. Learn neural network architecture, backpropagation, and implement everything in PyTorch.", keyTopics: ["Feedforward Networks", "Backpropagation", "PyTorch Tensors", "Autograd", "Training Loop"], resources: [{ name: "fast.ai Course", type: "free" }, { name: "PyTorch Docs", type: "free" }, { name: "Deep Learning (Goodfellow)", type: "free" }], tips: "fast.ai's top-down approach is brilliant — build working models first, then understand the math.", prerequisites: ["n1-3"] } },
          { id: "n3-2", title: "CNNs & Computer Vision", type: "optional", estimatedTime: "4-5 weeks", children: ["n3-3"], details: { description: "Convolutional Neural Networks revolutionized computer vision. Learn image classification, object detection, and segmentation.", keyTopics: ["Convolutional Layers", "ResNet & VGG", "Transfer Learning", "Object Detection", "YOLO"], resources: [{ name: "CS231n (Stanford)", type: "free" }, { name: "fast.ai Vision", type: "free" }], tips: "Transfer learning from ImageNet-pretrained models is almost always better than training from scratch.", prerequisites: ["n3-1"] } },
          { id: "n3-3", title: "Transformers & LLMs", type: "advanced", estimatedTime: "6-8 weeks", children: ["n4-1"], details: { description: "Transformers and Large Language Models are the frontier of AI. Learn attention mechanisms, BERT, GPT architectures, and fine-tuning.", keyTopics: ["Attention Mechanism", "BERT & GPT", "Hugging Face", "Fine-tuning", "RAG Systems"], resources: [{ name: "Hugging Face Course", type: "free" }, { name: "Andrej Karpathy (YouTube)", type: "free" }, { name: "Illustrated Transformer", type: "free" }], tips: "Implement a small transformer from scratch following Karpathy's nanoGPT — it demystifies everything.", prerequisites: ["n3-1"] } },
        ]
      },
      {
        id: "phase-4", title: "MLOps & Production", color: "#4ADE80",
        nodes: [
          { id: "n4-1", title: "ML Engineering & MLOps", type: "core", estimatedTime: "4-5 weeks", children: [], details: { description: "Getting models to production requires MLOps. Learn model serving, experiment tracking, monitoring, and CI/CD for ML pipelines.", keyTopics: ["MLflow", "Model Serving (FastAPI)", "Feature Stores", "A/B Testing", "Model Monitoring"], resources: [{ name: "Made With ML", type: "free" }, { name: "MLOps Zoomcamp", type: "free" }], tips: "A model in production beats a perfect model in a notebook. Ship early, improve continuously.", prerequisites: [] } },
        ]
      },
    ]
  },
  "Data Science": {
    field: "Data Science",
    tagline: "Turn raw data into golden insights",
    phases: [
      { id: "phase-1", title: "Data Foundations", color: "#00D4FF", nodes: [{ id: "n1-1", title: "Python & Statistics", type: "core", estimatedTime: "4 weeks", children: ["n1-2"], details: { description: "Master Python data tools and statistical thinking to form the bedrock of data science work.", keyTopics: ["Pandas", "NumPy", "Descriptive Statistics", "Probability", "Hypothesis Testing"], resources: [{ name: "Kaggle Python", type: "free" }, { name: "StatQuest", type: "free" }], tips: "Practice statistics with real datasets — apply concepts immediately after learning.", prerequisites: [] } }, { id: "n1-2", title: "SQL & Databases", type: "core", estimatedTime: "3 weeks", children: ["n2-1"], details: { description: "Most company data lives in SQL databases. Master querying, aggregation, joins, and window functions.", keyTopics: ["SELECT & JOINs", "Aggregations", "Window Functions", "CTEs", "Query Optimization"], resources: [{ name: "SQLZoo", type: "free" }, { name: "Mode Analytics SQL", type: "free" }], tips: "Window functions are where SQL gets truly powerful — invest extra time learning them.", prerequisites: [] } }] },
      { id: "phase-2", title: "Analysis & Visualization", color: "#FFB347", nodes: [{ id: "n2-1", title: "Exploratory Data Analysis", type: "core", estimatedTime: "3 weeks", children: ["n2-2"], details: { description: "EDA is the process of exploring data to find patterns, anomalies, and insights before modeling.", keyTopics: ["Distribution Analysis", "Correlation", "Outlier Detection", "Data Cleaning", "Feature Understanding"], resources: [{ name: "Kaggle EDA Notebooks", type: "free" }], tips: "Never skip EDA — surprises found here prevent disasters in modeling.", prerequisites: ["n1-1"] } }, { id: "n2-2", title: "Data Visualization", type: "core", estimatedTime: "2 weeks", children: ["n3-1"], details: { description: "Tell compelling stories with data using Matplotlib, Seaborn, and interactive tools like Plotly and Tableau.", keyTopics: ["Matplotlib", "Seaborn", "Plotly", "Tableau", "Storytelling with Data"], resources: [{ name: "Data Visualization with Python", type: "free" }, { name: "Tableau Public", type: "free" }], tips: "Choose chart types that serve the insight, not the ones that look impressive.", prerequisites: ["n2-1"] } }] },
      { id: "phase-3", title: "Machine Learning for DS", color: "#FF6B6B", nodes: [{ id: "n3-1", title: "Predictive Modeling", type: "core", estimatedTime: "5 weeks", children: ["n4-1"], details: { description: "Apply ML algorithms to business problems. Focus on model selection, validation, and interpretation for stakeholders.", keyTopics: ["Scikit-learn", "Cross-validation", "Hyperparameter Tuning", "Model Interpretation (SHAP)", "Business Metrics"], resources: [{ name: "Hands-On ML (Géron)", type: "paid" }, { name: "Kaggle Competitions", type: "free" }], tips: "Enter Kaggle competitions — the feedback loop from leaderboards accelerates learning dramatically.", prerequisites: ["n2-1"] } }] },
      { id: "phase-4", title: "Business Impact", color: "#4ADE80", nodes: [{ id: "n4-1", title: "Communication & Stakeholders", type: "core", estimatedTime: "2 weeks", children: [], details: { description: "Data scientists who can't communicate insights create no value. Learn to present findings to non-technical stakeholders.", keyTopics: ["Executive Presentations", "Dashboard Design", "A/B Testing", "Business Metrics", "Data Storytelling"], resources: [{ name: "Storytelling with Data (Cole)", type: "paid" }, { name: "Google Data Studio", type: "free" }], tips: "Lead with the business impact, not the methodology. Executives want answers, not algorithms.", prerequisites: [] } }] },
    ]
  },
  "DSA & Competitive Programming": {
    field: "DSA & Competitive Programming",
    tagline: "Master the art of algorithmic thinking",
    phases: [
      { id: "phase-1", title: "Core Data Structures", color: "#00D4FF", nodes: [{ id: "n1-1", title: "Arrays & Strings", type: "core", estimatedTime: "2-3 weeks", children: ["n1-2"], details: { description: "Arrays and strings are the most fundamental data structures. Master two-pointer, sliding window, and prefix sum techniques.", keyTopics: ["Two Pointers", "Sliding Window", "Prefix Sums", "String Manipulation", "Hashing"], resources: [{ name: "LeetCode", type: "free" }, { name: "NeetCode.io", type: "free" }], tips: "Solve 50+ array problems before moving on — these patterns appear in 60% of interview questions.", prerequisites: [] } }, { id: "n1-2", title: "Linked Lists, Stacks & Queues", type: "core", estimatedTime: "2 weeks", children: ["n2-1"], details: { description: "Understand pointer-based structures and their applications. Master reversal, cycle detection, and monotonic stack patterns.", keyTopics: ["Linked List Reversal", "Cycle Detection (Floyd's)", "Monotonic Stack", "Queue with Stack", "LRU Cache"], resources: [{ name: "NeetCode 150", type: "free" }, { name: "CTCI", type: "paid" }], tips: "Draw pointer diagrams on paper when solving linked list problems — it prevents mistakes.", prerequisites: ["n1-1"] } }] },
      { id: "phase-2", title: "Trees & Graphs", color: "#FFB347", nodes: [{ id: "n2-1", title: "Binary Trees & BSTs", type: "core", estimatedTime: "3 weeks", children: ["n2-2"], details: { description: "Trees power databases, file systems, and compilers. Master DFS, BFS, tree construction, and BST operations.", keyTopics: ["DFS & BFS", "Tree Construction", "BST Operations", "Balanced Trees", "Tree DP"], resources: [{ name: "LeetCode Trees", type: "free" }, { name: "Visualgo.net", type: "free" }], tips: "Recursive DFS on trees follows three patterns: preorder, inorder, postorder. Know all three.", prerequisites: ["n1-2"] } }, { id: "n2-2", title: "Graph Algorithms", type: "core", estimatedTime: "4 weeks", children: ["n3-1"], details: { description: "Graphs model real-world relationships. Learn DFS/BFS, shortest paths (Dijkstra's), MST, and topological sort.", keyTopics: ["DFS & BFS", "Dijkstra's Algorithm", "Union-Find", "Topological Sort", "Bellman-Ford"], resources: [{ name: "CP-Algorithms.com", type: "free" }, { name: "Graph Theory by William Fiset (YouTube)", type: "free" }], tips: "Model problems as graphs before coding — most graph problems are just variations of BFS/DFS.", prerequisites: ["n2-1"] } }] },
      { id: "phase-3", title: "Dynamic Programming", color: "#FF6B6B", nodes: [{ id: "n3-1", title: "DP Fundamentals", type: "core", estimatedTime: "4-6 weeks", children: ["n3-2"], details: { description: "Dynamic programming is the hardest and most valuable skill in competitive programming. Master memoization and tabulation.", keyTopics: ["Memoization", "Tabulation", "1D & 2D DP", "Knapsack Variants", "DP on Trees"], resources: [{ name: "Atcoder Educational DP", type: "free" }, { name: "Dynamic Programming Patterns", type: "free" }], tips: "Learn the 15 DP patterns (Atcoder DP contest) — most problems are variations of these.", prerequisites: ["n2-2"] } }, { id: "n3-2", title: "Advanced Algorithms", type: "advanced", estimatedTime: "4-6 weeks", children: ["n4-1"], details: { description: "Segment trees, binary search on answers, and advanced graph algorithms for competitive programming.", keyTopics: ["Segment Trees", "Binary Search on Answer", "Advanced Graph", "Number Theory", "Bit Manipulation"], resources: [{ name: "Codeforces", type: "free" }, { name: "USACO Guide", type: "free" }], tips: "Participate in Codeforces rounds regularly — contests force you to think under pressure.", prerequisites: ["n3-1"] } }] },
      { id: "phase-4", title: "Interview Mastery", color: "#4ADE80", nodes: [{ id: "n4-1", title: "System Design + Mock Interviews", type: "core", estimatedTime: "4-6 weeks", children: [], details: { description: "Combine your DSA knowledge with system design and communication skills to ace technical interviews at top companies.", keyTopics: ["Coding Interviews", "System Design", "Behavioral Interviews", "Time Complexity", "Code Quality"], resources: [{ name: "NeetCode 150", type: "free" }, { name: "System Design Primer", type: "free" }, { name: "Interviewing.io", type: "paid" }], tips: "Talk through your thought process out loud during practice — interviewers evaluate your thinking, not just the answer.", prerequisites: [] } }] },
    ]
  },
  "Cloud & DevOps": {
    field: "Cloud & DevOps",
    tagline: "Scale infrastructure at the speed of code",
    phases: [
      { id: "phase-1", title: "Linux & Scripting", color: "#00D4FF", nodes: [{ id: "n1-1", title: "Linux Administration", type: "core", estimatedTime: "3-4 weeks", children: ["n1-2"], details: { description: "Linux powers 95% of servers. Master the command line, file systems, process management, and system configuration.", keyTopics: ["Bash", "File Systems", "Process Management", "Systemd", "Networking"], resources: [{ name: "Linux Journey", type: "free" }, { name: "LPIC-1 Study Guide", type: "paid" }], tips: "Set up a Linux VM and break it on purpose — learning to fix broken systems is invaluable.", prerequisites: [] } }, { id: "n1-2", title: "Networking Fundamentals", type: "core", estimatedTime: "2-3 weeks", children: ["n2-1"], details: { description: "Cloud is fundamentally networking. Understand VPCs, subnets, routing, load balancers, and DNS.", keyTopics: ["TCP/IP", "DNS & HTTP", "Load Balancers", "VPC & Subnets", "Firewalls"], resources: [{ name: "Networking Fundamentals (YouTube)", type: "free" }], tips: "Draw network diagrams for every architecture you study — visual thinking is key for networking.", prerequisites: [] } }] },
      { id: "phase-2", title: "Containers & IaC", color: "#FFB347", nodes: [{ id: "n2-1", title: "Docker", type: "core", estimatedTime: "2-3 weeks", children: ["n2-2"], details: { description: "Containers are the foundation of modern deployments. Master Docker, images, containers, networking, and Docker Compose.", keyTopics: ["Dockerfile", "Images & Layers", "Docker Compose", "Networking", "Multi-stage Builds"], resources: [{ name: "Docker Docs", type: "free" }, { name: "Docker & Kubernetes (Udemy)", type: "paid" }], tips: "Learn how layers work in Docker images — understanding this makes your images much smaller.", prerequisites: ["n1-1"] } }, { id: "n2-2", title: "Kubernetes", type: "core", estimatedTime: "4-6 weeks", children: ["n3-1"], details: { description: "Kubernetes orchestrates containers at scale. Learn pods, deployments, services, ingress, and Helm for production workloads.", keyTopics: ["Pods & Deployments", "Services & Ingress", "ConfigMaps & Secrets", "Helm Charts", "RBAC"], resources: [{ name: "Kubernetes Docs", type: "free" }, { name: "KodeKloud", type: "paid" }], tips: "Use minikube or kind locally, then practice with killer.sh for the CKA exam environment.", prerequisites: ["n2-1"] } }, { id: "n2-3", title: "Terraform", type: "core", estimatedTime: "3 weeks", children: ["n3-1"], details: { description: "Infrastructure as Code with Terraform lets you provision cloud resources reproducibly and safely.", keyTopics: ["HCL Syntax", "Resources & Modules", "State Management", "Remote Backend", "Workspace"], resources: [{ name: "Terraform Docs", type: "free" }, { name: "HashiCorp Learn", type: "free" }], tips: "Always use remote state with locking in production — local state files will cause team conflicts.", prerequisites: [] } }] },
      { id: "phase-3", title: "Cloud Platforms", color: "#FF6B6B", nodes: [{ id: "n3-1", title: "AWS Core Services", type: "core", estimatedTime: "6-8 weeks", children: ["n4-1"], details: { description: "AWS has 200+ services. Focus on the core: EC2, S3, RDS, Lambda, VPC, IAM, and CloudFormation.", keyTopics: ["EC2 & S3", "RDS & DynamoDB", "Lambda & API Gateway", "IAM", "CloudFormation"], resources: [{ name: "AWS Free Tier", type: "free" }, { name: "A Cloud Guru", type: "paid" }], tips: "Build a real project on AWS using free tier resources — hands-on beats any course.", prerequisites: ["n1-2"] } }] },
      { id: "phase-4", title: "CI/CD & Monitoring", color: "#4ADE80", nodes: [{ id: "n4-1", title: "CI/CD Pipelines", type: "core", estimatedTime: "3 weeks", children: [], details: { description: "Automate build, test, and deployment pipelines with GitHub Actions, Jenkins, or GitLab CI.", keyTopics: ["GitHub Actions", "Jenkins", "GitLab CI", "Deployment Strategies", "Rollback Plans"], resources: [{ name: "GitHub Actions Docs", type: "free" }], tips: "Pipeline as code in version control means you can audit, review, and rollback pipeline changes.", prerequisites: [] } }] },
    ]
  },
  "Core CS Fundamentals": {
    field: "Core CS Fundamentals",
    tagline: "Build on rock-solid computer science",
    phases: [
      { id: "phase-1", title: "Programming Foundations", color: "#00D4FF", nodes: [{ id: "n1-1", title: "A Programming Language", type: "core", estimatedTime: "6-8 weeks", children: ["n1-2"], details: { description: "Master one language deeply: Python for simplicity or C/C++ for systems understanding. Learn syntax, memory, and idioms.", keyTopics: ["Variables & Types", "Control Flow", "Functions", "OOP", "Memory Model"], resources: [{ name: "CS50x (Harvard)", type: "free" }, { name: "Python Docs", type: "free" }], tips: "CS50 by David Malan is the best intro CS course ever made — take it regardless of your background.", prerequisites: [] } }, { id: "n1-2", title: "Discrete Mathematics", type: "core", estimatedTime: "4-6 weeks", children: ["n2-1"], details: { description: "Logic, sets, graphs, and combinatorics form the mathematical foundation of computer science.", keyTopics: ["Logic & Proofs", "Set Theory", "Graph Theory", "Combinatorics", "Modular Arithmetic"], resources: [{ name: "Discrete Math by Rosen", type: "paid" }, { name: "Coursera Discrete Math", type: "free" }], tips: "Focus on proofs — the ability to reason rigorously transfers to debugging and algorithm design.", prerequisites: [] } }] },
      { id: "phase-2", title: "Systems", color: "#FFB347", nodes: [{ id: "n2-1", title: "Operating Systems", type: "core", estimatedTime: "6-8 weeks", children: ["n2-2"], details: { description: "Understand how operating systems manage processes, memory, files, and I/O. This knowledge makes you a 10x better programmer.", keyTopics: ["Processes & Threads", "Memory Management", "File Systems", "Scheduling", "Concurrency"], resources: [{ name: "OSTEP (Free Online)", type: "free" }, { name: "CS162 Berkeley", type: "free" }], tips: "OSTEP (Operating Systems: Three Easy Pieces) is free and outstanding — it's the best OS textbook.", prerequisites: ["n1-1"] } }, { id: "n2-2", title: "Computer Architecture", type: "core", estimatedTime: "4-6 weeks", children: ["n3-1"], details: { description: "Understand how CPUs work: instruction sets, caches, pipelines, and how high-level code becomes machine instructions.", keyTopics: ["CPU Architecture", "Instruction Sets", "Cache Hierarchy", "Pipelining", "Assembly Basics"], resources: [{ name: "nand2tetris (Coursera)", type: "free" }, { name: "CS:APP (Bryant & O'Hallaron)", type: "paid" }], tips: "nand2tetris is magical — you build a computer from logic gates up to running Tetris.", prerequisites: ["n2-1"] } }] },
      { id: "phase-3", title: "Algorithms & Theory", color: "#FF6B6B", nodes: [{ id: "n3-1", title: "Algorithms & Complexity", type: "core", estimatedTime: "6-8 weeks", children: ["n4-1"], details: { description: "Understand time/space complexity, sorting, searching, graph algorithms, and NP-completeness.", keyTopics: ["Big-O Analysis", "Sorting Algorithms", "Graph Algorithms", "Dynamic Programming", "NP-Completeness"], resources: [{ name: "CLRS (Introduction to Algorithms)", type: "paid" }, { name: "Algorithm Design (Kleinberg)", type: "paid" }, { name: "MIT 6.006", type: "free" }], tips: "Implement every algorithm from scratch at least once — reading about quicksort and coding it are very different.", prerequisites: ["n2-1"] } }] },
      { id: "phase-4", title: "Advanced Topics", color: "#4ADE80", nodes: [{ id: "n4-1", title: "Compilers & Programming Languages", type: "advanced", estimatedTime: "6-8 weeks", children: [], details: { description: "Understanding how compilers work makes you a profoundly better programmer. Learn lexing, parsing, semantic analysis, and code generation.", keyTopics: ["Lexing & Parsing", "ASTs", "Type Systems", "Code Generation", "Optimization"], resources: [{ name: "Crafting Interpreters (Nystrom)", type: "free" }, { name: "Dragon Book", type: "paid" }], tips: "Crafting Interpreters is free online and is one of the best programming books ever written.", prerequisites: ["n3-1"] } }] },
    ]
  },
  "Game Development": {
    field: "Game Development",
    tagline: "Create worlds from imagination",
    phases: [
      { id: "phase-1", title: "Game Dev Foundations", color: "#00D4FF", nodes: [{ id: "n1-1", title: "Choose Your Engine", type: "core", estimatedTime: "1 week", children: ["n1-2"], details: { description: "Unity (C#) is best for beginners and mobile. Unreal Engine (C++) for AAA-quality graphics. Godot (GDScript/C#) for open-source indie games.", keyTopics: ["Unity vs Unreal vs Godot", "Engine Architecture", "Editor Interface", "Asset Pipeline", "Scene System"], resources: [{ name: "Unity Learn", type: "free" }, { name: "Godot Docs", type: "free" }, { name: "Unreal Online Learning", type: "free" }], tips: "Start with Unity or Godot — both have excellent free resources and large communities.", prerequisites: [] } }, { id: "n1-2", title: "C# / GDScript Basics", type: "core", estimatedTime: "4-5 weeks", children: ["n2-1"], details: { description: "Game scripting requires solid programming fundamentals. Learn variables, functions, classes, and OOP in your engine's language.", keyTopics: ["Variables & Functions", "Classes & OOP", "Coroutines", "Events & Delegates", "Interfaces"], resources: [{ name: "Unity C# Tutorials", type: "free" }, { name: "Brackeys (YouTube)", type: "free" }], tips: "Brackeys' YouTube channel is the best free Unity learning resource ever created.", prerequisites: [] } }] },
      { id: "phase-2", title: "Core Game Systems", color: "#FFB347", nodes: [{ id: "n2-1", title: "Physics & Collision", type: "core", estimatedTime: "2-3 weeks", children: ["n2-2"], details: { description: "Games live or die by their feel. Learn rigidbodies, colliders, raycasting, and physics materials for responsive gameplay.", keyTopics: ["Rigidbodies", "Colliders & Triggers", "Raycasting", "Physics Materials", "Character Controllers"], resources: [{ name: "Unity Physics Docs", type: "free" }], tips: "Tune physics values empirically — there's no formula, just iterating until it feels right.", prerequisites: ["n1-2"] } }, { id: "n2-2", title: "Game AI & Pathfinding", type: "core", estimatedTime: "3-4 weeks", children: ["n3-1"], details: { description: "Give your NPCs intelligence with state machines, A* pathfinding, behavior trees, and NavMesh navigation.", keyTopics: ["State Machines", "A* Pathfinding", "NavMesh", "Behavior Trees", "Steering Behaviors"], resources: [{ name: "Game AI Pro", type: "free" }, { name: "AI Game Dev Wiki", type: "free" }], tips: "Finite state machines handle 90% of game AI needs — don't over-engineer with complex systems.", prerequisites: ["n2-1"] } }] },
      { id: "phase-3", title: "Polish & Graphics", color: "#FF6B6B", nodes: [{ id: "n3-1", title: "Shaders & Visual Effects", type: "advanced", estimatedTime: "4-6 weeks", children: ["n4-1"], details: { description: "Shaders transform how your game looks. Learn HLSL/GLSL basics, Unity's Shader Graph, or Unreal's Material Editor.", keyTopics: ["Shader Basics", "Shader Graph", "Particle Systems", "Post-Processing", "Lighting"], resources: [{ name: "The Book of Shaders", type: "free" }, { name: "Catlike Coding (Unity)", type: "free" }], tips: "The Book of Shaders is the best introduction to shader programming — beautifully written.", prerequisites: [] } }] },
      { id: "phase-4", title: "Shipping & Monetization", color: "#4ADE80", nodes: [{ id: "n4-1", title: "Publishing Your Game", type: "core", estimatedTime: "2-3 weeks", children: [], details: { description: "Finish and ship your game on itch.io, Steam, or mobile stores. Learn build pipelines, marketing, and community building.", keyTopics: ["Build Pipelines", "itch.io & Steam", "Marketing", "Monetization Models", "Community Building"], resources: [{ name: "itch.io", type: "free" }, { name: "Steamworks Docs", type: "free" }], tips: "Ship a small finished game before making your dream game — completing projects is a skill.", prerequisites: [] } }] },
    ]
  },
  "UI/UX Design": {
    field: "UI/UX Design",
    tagline: "Design experiences humans love",
    phases: [
      { id: "phase-1", title: "Design Fundamentals", color: "#00D4FF", nodes: [{ id: "n1-1", title: "Visual Design Principles", type: "core", estimatedTime: "3-4 weeks", children: ["n1-2"], details: { description: "Learn the timeless principles: contrast, alignment, repetition, proximity, hierarchy, and color theory.", keyTopics: ["Typography", "Color Theory", "Grid Systems", "White Space", "Visual Hierarchy"], resources: [{ name: "Refactoring UI (book)", type: "paid" }, { name: "Google Material Design", type: "free" }], tips: "Refactoring UI by the Tailwind CSS creators is the best practical design book for developers.", prerequisites: [] } }, { id: "n1-2", title: "Figma Mastery", type: "core", estimatedTime: "3-4 weeks", children: ["n2-1"], details: { description: "Figma is the industry-standard design tool. Master components, auto-layout, prototyping, and design systems.", keyTopics: ["Components & Variants", "Auto Layout", "Prototyping", "Design Systems", "Handoff"], resources: [{ name: "Figma YouTube Channel", type: "free" }, { name: "Figma for Beginners (Coursera)", type: "free" }], tips: "Master Auto Layout first — it's the single most powerful feature in Figma for creating responsive designs.", prerequisites: [] } }] },
      { id: "phase-2", title: "User Research", color: "#FFB347", nodes: [{ id: "n2-1", title: "UX Research Methods", type: "core", estimatedTime: "3-4 weeks", children: ["n2-2"], details: { description: "Design without research is guessing. Learn user interviews, usability testing, surveys, and how to synthesize insights.", keyTopics: ["User Interviews", "Usability Testing", "Surveys", "Affinity Mapping", "Personas"], resources: [{ name: "Nielsen Norman Group", type: "free" }, { name: "Just Enough Research", type: "paid" }], tips: "Even 5 user interviews reveal 85% of usability problems — you don't need large samples.", prerequisites: [] } }, { id: "n2-2", title: "Information Architecture", type: "core", estimatedTime: "2 weeks", children: ["n3-1"], details: { description: "Organize content so users can find what they need. Learn card sorting, tree testing, and navigation design.", keyTopics: ["Card Sorting", "Tree Testing", "Navigation Patterns", "Sitemaps", "User Flows"], resources: [{ name: "IA Institute", type: "free" }], tips: "Conduct card sorting sessions with real users — your intuitions about organization are often wrong.", prerequisites: ["n2-1"] } }] },
      { id: "phase-3", title: "Interaction Design", color: "#FF6B6B", nodes: [{ id: "n3-1", title: "Prototyping & Testing", type: "core", estimatedTime: "3 weeks", children: ["n4-1"], details: { description: "Build interactive prototypes to test ideas before development. Learn fidelity levels and when to use each.", keyTopics: ["Low-fi Wireframes", "High-fi Prototypes", "Usability Testing", "A/B Testing", "Iteration"], resources: [{ name: "Figma Prototyping", type: "free" }, { name: "Maze Testing", type: "free" }], tips: "Test early and often with low-fidelity wireframes — cheap to change ideas before they're coded.", prerequisites: ["n2-2"] } }] },
      { id: "phase-4", title: "Design Systems", color: "#4ADE80", nodes: [{ id: "n4-1", title: "Design Systems & Portfolio", type: "advanced", estimatedTime: "4-6 weeks", children: [], details: { description: "Build a design system with components, tokens, and documentation. Create a portfolio showcasing your process and impact.", keyTopics: ["Design Tokens", "Component Library", "Documentation", "Case Studies", "Portfolio"], resources: [{ name: "Design Systems (Alla Kholmatova)", type: "paid" }, { name: "design.systems", type: "free" }], tips: "Case studies in your portfolio should show your thinking process, not just final screens.", prerequisites: [] } }] },
    ]
  },
  "Blockchain & Web3": {
    field: "Blockchain & Web3",
    tagline: "Build the decentralized future",
    phases: [
      { id: "phase-1", title: "Blockchain Fundamentals", color: "#00D4FF", nodes: [{ id: "n1-1", title: "How Blockchain Works", type: "core", estimatedTime: "2-3 weeks", children: ["n1-2"], details: { description: "Understand the mechanics of blockchain: distributed ledgers, consensus mechanisms, cryptographic hashing, and immutability.", keyTopics: ["Distributed Ledgers", "Consensus Mechanisms", "Cryptographic Hashing", "Merkle Trees", "PoW vs PoS"], resources: [{ name: "Bitcoin Whitepaper", type: "free" }, { name: "Blockchain by Example", type: "paid" }], tips: "Read the original Bitcoin whitepaper — it's surprisingly readable and builds the right mental model.", prerequisites: [] } }, { id: "n1-2", title: "Ethereum & Solidity", type: "core", estimatedTime: "6-8 weeks", children: ["n2-1"], details: { description: "Ethereum is the leading smart contract platform. Solidity is its programming language for writing contracts that run on-chain.", keyTopics: ["Solidity Syntax", "Smart Contracts", "ABI & Bytecode", "Gas & Fees", "EVM"], resources: [{ name: "CryptoZombies", type: "free" }, { name: "Solidity Docs", type: "free" }, { name: "Alchemy University", type: "free" }], tips: "CryptoZombies is the most fun way to learn Solidity — you build a zombie game while learning.", prerequisites: ["n1-1"] } }] },
      { id: "phase-2", title: "DApp Development", color: "#FFB347", nodes: [{ id: "n2-1", title: "Web3.js & Ethers.js", type: "core", estimatedTime: "3-4 weeks", children: ["n2-2"], details: { description: "Connect frontends to the blockchain with Web3.js or Ethers.js. Learn to read contract state, send transactions, and handle events.", keyTopics: ["Providers & Signers", "Contract Interaction", "Transaction Management", "Event Listening", "Wallet Integration"], resources: [{ name: "Ethers.js Docs", type: "free" }, { name: "Hardhat Docs", type: "free" }], tips: "Use Ethers.js over Web3.js for new projects — it has a better API and is actively maintained.", prerequisites: ["n1-2"] } }, { id: "n2-2", title: "DeFi Protocols", type: "advanced", estimatedTime: "4-6 weeks", children: ["n3-1"], details: { description: "DeFi reimagines finance on-chain. Learn AMMs, lending protocols, yield farming, and how protocols like Uniswap and Aave work.", keyTopics: ["AMMs (Uniswap)", "Lending (Aave)", "Yield Farming", "Flash Loans", "Token Standards"], resources: [{ name: "DeFi Developer Roadmap", type: "free" }, { name: "Finematics (YouTube)", type: "free" }], tips: "Study protocol exploits — they teach you both how protocols work and how to secure yours.", prerequisites: ["n2-1"] } }] },
      { id: "phase-3", title: "Smart Contract Security", color: "#FF6B6B", nodes: [{ id: "n3-1", title: "Smart Contract Auditing", type: "advanced", estimatedTime: "6-8 weeks", children: ["n4-1"], details: { description: "Bugs in smart contracts are permanent and expensive. Learn common vulnerabilities, audit techniques, and formal verification.", keyTopics: ["Reentrancy", "Integer Overflow", "Access Control", "Slither & Mythril", "Audit Reports"], resources: [{ name: "SWC Registry", type: "free" }, { name: "Damn Vulnerable DeFi", type: "free" }], tips: "Damn Vulnerable DeFi is the best hands-on smart contract security practice platform.", prerequisites: ["n2-2"] } }] },
      { id: "phase-4", title: "Web3 Career", color: "#4ADE80", nodes: [{ id: "n4-1", title: "Building & Deploying", type: "core", estimatedTime: "3-4 weeks", children: [], details: { description: "Deploy your DApp to mainnet or L2s. Learn IPFS for decentralized storage, deployment pipelines, and gas optimization.", keyTopics: ["Hardhat Deployment", "IPFS & Filecoin", "Layer 2 (Polygon, Arbitrum)", "Gas Optimization", "Upgradeable Contracts"], resources: [{ name: "Hardhat Docs", type: "free" }, { name: "L2Beat.com", type: "free" }], tips: "Deploy to a testnet first, then an L2 like Polygon before mainnet — lower cost for experimentation.", prerequisites: [] } }] },
    ]
  },
};

// Fill in remaining fields with condensed data
const EXTRA_FIELDS = ["Linux & Systems Programming", "Embedded & IoT", "Software Architecture", "Networking & Protocols", "QA & Testing", "Quantum Computing"];

EXTRA_FIELDS.forEach(field => {
  ROADMAP_DATA[field] = {
    field,
    tagline: {
      "Linux & Systems Programming": "Go deep into the machine",
      "Embedded & IoT": "Bridge software and hardware",
      "Software Architecture": "Design systems that scale",
      "Networking & Protocols": "Connect the digital world",
      "QA & Testing": "Guarantee quality at every step",
      "Quantum Computing": "Harness quantum mechanics for computing"
    }[field],
    phases: [
      { id: "phase-1", title: "Foundations", color: "#00D4FF", nodes: [
        { id: "n1-1", title: `${field} Basics`, type: "core", estimatedTime: "4-6 weeks", children: ["n1-2"], details: { description: `Master the foundational concepts of ${field} including core tools, technologies, and best practices used in the industry.`, keyTopics: ["Core Concepts", "Key Tools", "Best Practices", "Industry Standards", "Hands-on Projects"], resources: [{ name: "Official Documentation", type: "free" }, { name: "Coursera / edX Courses", type: "free" }], tips: "Build projects from day one — passive learning without building leads to shallow understanding.", prerequisites: [] } },
        { id: "n1-2", title: "Core Skills", type: "core", estimatedTime: "4-6 weeks", children: ["n2-1"], details: { description: `Develop the essential practical skills required for ${field} work in professional environments.`, keyTopics: ["Practical Skills", "Problem Solving", "Debugging", "Documentation", "Collaboration"], resources: [{ name: "GitHub Learning", type: "free" }, { name: "Relevant textbooks", type: "paid" }], tips: "Find a mentor or community early — the right guidance saves months of confusion.", prerequisites: ["n1-1"] } }
      ]},
      { id: "phase-2", title: "Intermediate Concepts", color: "#FFB347", nodes: [
        { id: "n2-1", title: "Advanced Techniques", type: "core", estimatedTime: "6-8 weeks", children: ["n3-1"], details: { description: `Deepen your understanding of ${field} with advanced techniques and real-world application patterns.`, keyTopics: ["Advanced Patterns", "Performance", "Security", "Testing", "Scalability"], resources: [{ name: "Advanced Courses", type: "paid" }, { name: "Industry Blogs", type: "free" }], tips: "Read source code of popular open-source projects in this field — it reveals professional patterns.", prerequisites: ["n1-2"] } }
      ]},
      { id: "phase-3", title: "Professional Skills", color: "#FF6B6B", nodes: [
        { id: "n3-1", title: "Real-World Projects", type: "core", estimatedTime: "8-12 weeks", children: ["n4-1"], details: { description: `Apply your knowledge by building real-world projects that demonstrate professional-level ${field} competence.`, keyTopics: ["Project Planning", "Architecture", "Implementation", "Testing", "Deployment"], resources: [{ name: "Open Source Projects", type: "free" }, { name: "Hackathons", type: "free" }], tips: "Contribute to open source — it gives you real code review experience and builds your portfolio.", prerequisites: ["n2-1"] } }
      ]},
      { id: "phase-4", title: "Career & Mastery", color: "#4ADE80", nodes: [
        { id: "n4-1", title: "Certifications & Portfolio", type: "core", estimatedTime: "4-8 weeks", children: [], details: { description: "Validate your expertise with industry certifications and build a compelling portfolio that showcases your best work.", keyTopics: ["Certifications", "Portfolio Building", "Resume", "Networking", "Job Search"], resources: [{ name: "LinkedIn Learning", type: "paid" }, { name: "Certification Prep Guides", type: "free" }], tips: "Your portfolio should show the problem you solved, not just the technology you used.", prerequisites: ["n3-1"] } }
      ]},
    ]
  };
});

// ─── FIELD DEFINITIONS ────────────────────────────────────────────────────────
const FIELDS = [
  { id: "Web Development", icon: "🌐", tagline: "HTML to full-stack mastery", color: "#00D4FF" },
  { id: "App Development", icon: "📱", tagline: "iOS & Android with React Native", color: "#FFB347" },
  { id: "Cybersecurity", icon: "🛡️", tagline: "Defend the digital frontier", color: "#FF6B6B" },
  { id: "AI / Machine Learning", icon: "🤖", tagline: "Teach machines to think", color: "#A78BFA" },
  { id: "Data Science", icon: "📊", tagline: "Turn raw data into golden insights", color: "#4ADE80" },
  { id: "Core CS Fundamentals", icon: "💻", tagline: "Rock-solid computer science base", color: "#00D4FF" },
  { id: "DSA & Competitive Programming", icon: "🧩", tagline: "Master algorithmic thinking", color: "#FFB347" },
  { id: "Cloud & DevOps", icon: "☁️", tagline: "Scale infrastructure at speed", color: "#60A5FA" },
  { id: "Game Development", icon: "🎮", tagline: "Create worlds from imagination", color: "#F472B6" },
  { id: "Blockchain & Web3", icon: "🔗", tagline: "Build the decentralized future", color: "#FB923C" },
  { id: "Linux & Systems Programming", icon: "🐧", tagline: "Go deep into the machine", color: "#4ADE80" },
  { id: "Embedded & IoT", icon: "🔒", tagline: "Bridge software and hardware", color: "#A78BFA" },
  { id: "UI/UX Design", icon: "🎨", tagline: "Design experiences humans love", color: "#F472B6" },
  { id: "Software Architecture", icon: "🏗️", tagline: "Design systems that scale", color: "#00D4FF" },
  { id: "Networking & Protocols", icon: "📡", tagline: "Connect the digital world", color: "#FFB347" },
  { id: "QA & Testing", icon: "🧪", tagline: "Guarantee quality at every step", color: "#4ADE80" },
  { id: "Quantum Computing", icon: "🔬", tagline: "Harness quantum mechanics", color: "#A78BFA" },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pathforge_theme");
      return saved ? saved === "dark" : true;
    }
    return true;
  });
  const [page, setPage] = useState("home"); // "home" | "roadmap"
  const [selectedField, setSelectedField] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [completedNodes, setCompletedNodes] = useState({});

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("pathforge_theme", dark ? "dark" : "light");
  }, [dark]);

  const handleFieldClick = useCallback((fieldId) => {
    setSelectedField(fieldId);
    setPage("roadmap");
    setSelectedNode(null);
  }, []);

  const handleBack = useCallback(() => {
    setPage("home");
    setSelectedField(null);
    setSelectedNode(null);
  }, []);

  const toggleNode = useCallback((nodeId) => {
    setCompletedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }, []);

  const roadmapData = useMemo(() => selectedField ? ROADMAP_DATA[selectedField] : null, [selectedField]);

  const totalNodes = useMemo(() => {
    if (!roadmapData) return 0;
    return roadmapData.phases.reduce((acc, p) => acc + p.nodes.length, 0);
  }, [roadmapData]);

  const completedCount = useMemo(() => {
    if (!roadmapData) return 0;
    return roadmapData.phases.reduce((acc, p) =>
      acc + p.nodes.filter(n => completedNodes[n.id]).length, 0
    );
  }, [roadmapData, completedNodes]);

  const progress = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && selectedNode) setSelectedNode(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedNode]);

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: dark ? "#0A0E1A" : "#F5F0E8", color: dark ? "#E8EDF5" : "#1A1A2E" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .scanlines { background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); }
        .glow-cyan { box-shadow: 0 0 20px rgba(0,212,255,0.3), 0 0 40px rgba(0,212,255,0.1); }
        .glow-amber { box-shadow: 0 0 20px rgba(255,179,71,0.3), 0 0 40px rgba(255,179,71,0.1); }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: scale(1.03) translateY(-4px); }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-glow { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes drawLine { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity:0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity:1; } }
        .animate-fade-in { animation: fadeSlideIn 0.5s ease forwards; }
        .animate-slide-up { animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-pop { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .line-animate { stroke-dasharray: 1000; animation: drawLine 1s ease forwards; }
        .node-complete { text-decoration: line-through; opacity: 0.6; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {page === "home" ? (
        <HomePage dark={dark} onDarkToggle={() => setDark(d => !d)} onFieldClick={handleFieldClick} />
      ) : (
        <RoadmapPage
          dark={dark}
          onDarkToggle={() => setDark(d => !d)}
          onBack={handleBack}
          roadmapData={roadmapData}
          selectedField={selectedField}
          completedNodes={completedNodes}
          onToggleNode={toggleNode}
          onNodeClick={setSelectedNode}
          progress={progress}
          completedCount={completedCount}
          totalNodes={totalNodes}
        />
      )}

      {selectedNode && (
        <NodeDetailModal
          node={selectedNode}
          dark={dark}
          onClose={() => setSelectedNode(null)}
          completed={completedNodes[selectedNode.id]}
          onToggleComplete={() => toggleNode(selectedNode.id)}
        />
      )}
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ dark, onDarkToggle, onFieldClick }) {
  return (
    <div className="scanlines min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b"
        style={{ borderColor: dark ? "#2A3350" : "#D4CEC4" }}>
        <div>
          <h1 className="mono text-2xl font-bold" style={{ color: "#00D4FF" }}>
            ⚡ PathForge
          </h1>
          <p className="text-xs mt-0.5" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
            AI-powered learning roadmaps
          </p>
        </div>
        <ThemeToggle dark={dark} onToggle={onDarkToggle} />
      </header>

      {/* Hero */}
      <div className="text-center py-16 px-6 animate-fade-in">
        <div className="mono text-xs tracking-widest mb-4" style={{ color: "#00D4FF" }}>
          ── SELECT YOUR PATH ──
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: dark ? "#E8EDF5" : "#1A1A2E" }}>
          Where do you want<br />
          <span className="mono" style={{ color: "#00D4FF" }}>to go?</span>
        </h2>
        <p className="text-lg max-w-lg mx-auto" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
          Choose a field below and get a complete step-by-step roadmap with resources, timelines, and tips.
        </p>
      </div>

      {/* Field Grid */}
      <div className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FIELDS.map((field, i) => (
            <FieldCard
              key={field.id}
              field={field}
              dark={dark}
              index={i}
              onClick={() => onFieldClick(field.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FieldCard({ field, dark, index, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card-hover text-left rounded-xl p-5 border cursor-pointer w-full"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: `fadeSlideIn 0.5s ease ${index * 50}ms both`,
        background: dark ? (hovered ? "#1f2b45" : "#111827") : (hovered ? "#f0ebe0" : "#ffffff"),
        borderColor: hovered ? field.color : (dark ? "#2A3350" : "#D4CEC4"),
        boxShadow: hovered ? `0 0 20px ${field.color}40, 0 8px 32px ${field.color}20` : "none",
        transition: "all 0.2s ease",
      }}
    >
      <div className="text-3xl mb-3">{field.icon}</div>
      <h3 className="font-bold text-sm mb-1" style={{ color: dark ? "#E8EDF5" : "#1A1A2E" }}>
        {field.id}
      </h3>
      <p className="text-xs" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
        {field.tagline}
      </p>
      <div className="mt-3 flex items-center gap-1 text-xs mono"
        style={{ color: field.color, opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
        View Roadmap →
      </div>
    </button>
  );
}

// ─── ROADMAP PAGE ─────────────────────────────────────────────────────────────
function RoadmapPage({ dark, onDarkToggle, onBack, roadmapData, selectedField, completedNodes, onToggleNode, onNodeClick, progress, completedCount, totalNodes }) {
  const fieldInfo = FIELDS.find(f => f.id === selectedField);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 px-6 py-4 border-b"
        style={{
          borderColor: dark ? "#2A3350" : "#D4CEC4",
          background: dark ? "rgba(10,14,26,0.95)" : "rgba(245,240,232,0.95)",
          backdropFilter: "blur(12px)"
        }}>
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onBack}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors"
              style={{ borderColor: dark ? "#2A3350" : "#D4CEC4", color: dark ? "#8B9DC3" : "#5A6480" }}>
              ← Back
            </button>
            <div>
              <div className="text-xs mono" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
                Home → {selectedField}
              </div>
              <h2 className="font-bold text-sm" style={{ color: dark ? "#E8EDF5" : "#1A1A2E" }}>
                {fieldInfo?.icon} {selectedField}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs mono mb-1" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
                {completedCount}/{totalNodes} completed
              </div>
              <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: dark ? "#2A3350" : "#D4CEC4" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: progress === 100 ? "#4ADE80" : "#00D4FF" }} />
              </div>
            </div>
            <ThemeToggle dark={dark} onToggle={onDarkToggle} />
          </div>
        </div>
      </header>

      {/* Roadmap Content */}
      <div className="max-w-3xl mx-auto px-4 py-10 pb-20">
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-5xl mb-4">{fieldInfo?.icon}</div>
          <h1 className="mono text-3xl font-bold mb-2" style={{ color: fieldInfo?.color }}>
            {selectedField}
          </h1>
          <p style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>{roadmapData?.tagline}</p>
          <div className="mt-4 mono text-sm" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
            {totalNodes} topics across {roadmapData?.phases?.length} phases · {progress}% complete
          </div>
        </div>

        {/* Phases */}
        {roadmapData?.phases?.map((phase, phaseIdx) => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            phaseIdx={phaseIdx}
            dark={dark}
            completedNodes={completedNodes}
            onToggleNode={onToggleNode}
            onNodeClick={onNodeClick}
          />
        ))}
      </div>
    </div>
  );
}

function PhaseSection({ phase, phaseIdx, dark, completedNodes, onToggleNode, onNodeClick }) {
  return (
    <div className="mb-10" style={{ animationDelay: `${phaseIdx * 100}ms`, animation: `fadeSlideIn 0.6s ease ${phaseIdx * 100}ms both` }}>
      {/* Phase Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: phase.color, opacity: 0.4 }} />
        <div className="px-4 py-1.5 rounded-full mono text-xs font-bold border"
          style={{ color: phase.color, borderColor: phase.color, background: `${phase.color}15` }}>
          Phase {phaseIdx + 1}: {phase.title}
        </div>
        <div className="flex-1 h-px" style={{ background: phase.color, opacity: 0.4 }} />
      </div>

      {/* Nodes */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-8 bottom-8 w-0.5 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${phase.color}80, transparent)` }} />

        <div className="space-y-4">
          {phase.nodes.map((node, nodeIdx) => (
            <NodeCard
              key={node.id}
              node={node}
              nodeIdx={nodeIdx}
              phaseIdx={phaseIdx}
              phaseColor={phase.color}
              dark={dark}
              completed={completedNodes[node.id]}
              onToggle={() => onToggleNode(node.id)}
              onClick={() => onNodeClick(node)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const TYPE_COLORS = { core: "#00D4FF", optional: "#FFB347", advanced: "#FF6B6B" };
const TYPE_LABELS = { core: "CORE", optional: "OPTIONAL", advanced: "ADVANCED" };

function NodeCard({ node, nodeIdx, phaseIdx, phaseColor, dark, completed, onToggle, onClick }) {
  const [hovered, setHovered] = useState(false);
  const delay = phaseIdx * 100 + nodeIdx * 80;
  const typeColor = TYPE_COLORS[node.type] || "#00D4FF";

  return (
    <div
      className="relative pl-12"
      style={{ animation: `fadeSlideIn 0.5s ease ${delay}ms both` }}
    >
      {/* Circle on line */}
      <button
        onClick={onToggle}
        className="absolute left-3 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10"
        style={{
          borderColor: completed ? "#4ADE80" : phaseColor,
          background: completed ? "#4ADE80" : "transparent",
          boxShadow: completed ? "0 0 12px rgba(74,222,128,0.5)" : "none",
        }}
        title="Mark complete"
      >
        {completed && <span className="text-white text-xs font-bold">✓</span>}
      </button>

      {/* Card */}
      <div
        className="rounded-xl border p-4 cursor-pointer transition-all duration-200"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        style={{
          background: dark ? (hovered ? "#1f2b45" : "#111827") : (hovered ? "#f0ebe0" : "#ffffff"),
          borderColor: hovered ? typeColor : (dark ? "#2A3350" : "#D4CEC4"),
          boxShadow: hovered ? `0 0 16px ${typeColor}30` : "none",
          opacity: completed ? 0.7 : 1,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className={`font-bold text-sm mb-1 ${completed ? "line-through" : ""}`}
              style={{ color: dark ? "#E8EDF5" : "#1A1A2E" }}>
              {node.title}
              {completed && <span className="ml-2 text-xs" style={{ color: "#4ADE80" }}>✓</span>}
            </h3>
            <p className="text-xs line-clamp-1" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
              {node.details.description.split(".")[0]}.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="mono text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ color: typeColor, background: `${typeColor}20` }}>
              {TYPE_LABELS[node.type]}
            </span>
            <span className="mono text-xs" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
              ⏱ {node.estimatedTime}
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: typeColor, opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
          Click for details →
        </div>
      </div>
    </div>
  );
}

// ─── NODE DETAIL MODAL ────────────────────────────────────────────────────────
function NodeDetailModal({ node, dark, onClose, completed, onToggleComplete }) {
  const typeColor = TYPE_COLORS[node.type] || "#00D4FF";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="animate-slide-up w-full md:max-w-xl rounded-t-2xl md:rounded-2xl p-6 max-h-[85vh] overflow-y-auto scrollbar-hide"
        onClick={e => e.stopPropagation()}
        style={{ background: dark ? "#111827" : "#ffffff", border: `1px solid ${typeColor}40` }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="mono text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ color: typeColor, background: `${typeColor}20` }}>
                {TYPE_LABELS[node.type]}
              </span>
              <span className="mono text-xs" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
                ⏱ {node.estimatedTime}
              </span>
            </div>
            <h2 className="mono text-xl font-bold" style={{ color: dark ? "#E8EDF5" : "#1A1A2E" }}>
              {node.title}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors flex-shrink-0"
            style={{ background: dark ? "#2A3350" : "#E8E3D8", color: dark ? "#8B9DC3" : "#5A6480" }}>
            ×
          </button>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-5" style={{ color: dark ? "#8B9DC3" : "#5A6480" }}>
          {node.details.description}
        </p>

        {/* Key Topics */}
        <div className="mb-5">
          <h4 className="mono text-xs font-bold mb-2" style={{ color: typeColor }}>KEY TOPICS</h4>
          <div className="flex flex-wrap gap-2">
            {node.details.keyTopics.map(topic => (
              <span key={topic} className="text-xs px-3 py-1 rounded-full"
                style={{ background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}40` }}>
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-5">
          <h4 className="mono text-xs font-bold mb-2" style={{ color: typeColor }}>RESOURCES</h4>
          <div className="space-y-2">
            {node.details.resources.map(r => (
              <div key={r.name} className="flex items-center justify-between text-sm px-3 py-2 rounded-lg"
                style={{ background: dark ? "#1A2035" : "#F5F0E8" }}>
                <span style={{ color: dark ? "#E8EDF5" : "#1A1A2E" }}>{r.name}</span>
                <span className={`mono text-xs px-2 py-0.5 rounded-full font-bold ${r.type === "free" ? "" : ""}`}
                  style={{
                    color: r.type === "free" ? "#4ADE80" : "#FFB347",
                    background: r.type === "free" ? "rgba(74,222,128,0.15)" : "rgba(255,179,71,0.15)"
                  }}>
                  {r.type === "free" ? "FREE" : "PAID"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mb-5 p-4 rounded-xl border"
          style={{ background: "rgba(255,179,71,0.08)", borderColor: "rgba(255,179,71,0.3)" }}>
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0 mt-0.5">💡</span>
            <div>
              <div className="mono text-xs font-bold mb-1" style={{ color: "#FFB347" }}>PRO TIP</div>
              <p className="text-sm" style={{ color: dark ? "#E8EDF5" : "#1A1A2E" }}>{node.details.tips}</p>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        {node.details.prerequisites && node.details.prerequisites.length > 0 && (
          <div className="mb-5">
            <h4 className="mono text-xs font-bold mb-2" style={{ color: typeColor }}>PREREQUISITES</h4>
            <div className="flex flex-wrap gap-2">
              {node.details.prerequisites.map(p => (
                <span key={p} className="mono text-xs px-2 py-1 rounded"
                  style={{ background: dark ? "#2A3350" : "#E8E3D8", color: dark ? "#8B9DC3" : "#5A6480" }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Complete Button */}
        <button onClick={onToggleComplete}
          className="w-full py-3 rounded-xl mono text-sm font-bold transition-all duration-200"
          style={{
            background: completed ? "rgba(74,222,128,0.15)" : `${typeColor}20`,
            color: completed ? "#4ADE80" : typeColor,
            border: `1px solid ${completed ? "#4ADE80" : typeColor}40`,
          }}>
          {completed ? "✓ Completed! Click to undo" : "Mark as Complete"}
        </button>
      </div>
    </div>
  );
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
function ThemeToggle({ dark, onToggle }) {
  return (
    <button onClick={onToggle}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border"
      style={{
        background: dark ? "#1A2035" : "#E8E3D8",
        borderColor: dark ? "#2A3350" : "#D4CEC4",
        fontSize: "18px"
      }}
      title="Toggle theme"
    >
      <span style={{ transition: "transform 0.3s ease", transform: dark ? "rotate(0deg)" : "rotate(180deg)", display: "block" }}>
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
