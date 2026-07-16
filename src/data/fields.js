export const FIELDS = [
  // ─────────────────────────────────────────────
  // 1. FRONTEND DEV
  // ─────────────────────────────────────────────
  {
    id: "frontend",
    name: "Frontend Dev",
    icon: "💻",
    desc: "Build web UIs with HTML, CSS, JavaScript and modern frameworks.",
    phases: [
      {
        id: "frontend_p1",
        label: "Phase 1",
        level: "beginner",
        name: "HTML & CSS fundamentals",
        duration: "3–5 weeks",
        desc: "The skeleton and skin of every webpage. Master these before touching JS.",
        topics: [
          { name: "HTML semantics", detail: "Tags, forms, tables, accessibility (aria), SEO basics" },
          { name: "CSS core", detail: "Selectors, box model, positioning, units (rem/em/vw)" },
          { name: "Flexbox & Grid", detail: "Modern layout systems — most used in real jobs" },
          { name: "Responsive design", detail: "Media queries, mobile-first thinking" },
        ],
        resources: [
          { label: "HTML Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=kUMe1FH4CHE", type: "yt" },
          { label: "CSS Full Course – Dave Gray", url: "https://www.youtube.com/watch?v=n4R2E7O-Ngo", type: "yt" },
          { label: "Flexbox in 15 mins – Web Dev Simplified", url: "https://www.youtube.com/watch?v=fYq5PXgSsbE", type: "yt" },
          { label: "CSS Grid Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=0xMQfnTU6oo", type: "yt" },
        ],
      },
      {
        id: "frontend_p2",
        label: "Phase 2",
        level: "beginner",
        name: "JavaScript essentials",
        duration: "5–7 weeks",
        desc: "The language that makes pages interactive. Learn vanilla JS before any framework.",
        topics: [
          { name: "JS basics", detail: "Variables, functions, arrays, objects, loops, conditionals" },
          { name: "DOM manipulation", detail: "querySelector, events, classList, innerHTML" },
          { name: "ES6+ features", detail: "Arrow functions, destructuring, spread, promises, async/await" },
          { name: "Fetch API", detail: "HTTP requests, JSON, error handling" },
        ],
        resources: [
          { label: "JS Full Course for Beginners – Dave Gray", url: "https://www.youtube.com/watch?v=EfAl9bwzVZk", type: "yt" },
          { label: "JavaScript DOM Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=0ik6X4DJKCc", type: "yt" },
          { label: "Async JS / Promises – Web Dev Simplified", url: "https://www.youtube.com/watch?v=DHvZLI7Db8E", type: "yt" },
          { label: "JavaScript in 100 Seconds – Fireship", url: "https://www.youtube.com/watch?v=DHjqpvDnNGE", type: "yt" },
        ],
      },
      {
        id: "frontend_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "React",
        duration: "6–8 weeks",
        desc: "Most in-demand frontend framework. Build component-driven UIs.",
        topics: [
          { name: "Components & JSX", detail: "Functional components, props, rendering lists" },
          { name: "State & hooks", detail: "useState, useEffect, useRef, custom hooks" },
          { name: "React Router", detail: "Client-side routing, dynamic routes, nested routes" },
          { name: "Data fetching", detail: "useEffect + fetch, React Query basics" },
        ],
        resources: [
          { label: "React Full Course 2024 – Dave Gray", url: "https://www.youtube.com/watch?v=RVFAyFWO4go", type: "yt" },
          { label: "React Hooks Explained – Web Dev Simplified", url: "https://www.youtube.com/watch?v=O6P86uwfdR0", type: "yt" },
          { label: "React in 100 Seconds – Fireship", url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM", type: "yt" },
          { label: "React Router Tutorial – Net Ninja", url: "https://www.youtube.com/watch?v=aZGzwEjZrXc", type: "yt" },
        ],
      },
      {
        id: "frontend_p4",
        label: "Phase 4",
        level: "intermediate",
        name: "Tooling & styling",
        duration: "3–4 weeks",
        desc: "Real-world dev workflow — bundlers, Tailwind, Git.",
        topics: [
          { name: "Vite & npm", detail: "Project setup, scripts, package.json, build process" },
          { name: "Tailwind CSS", detail: "Utility-first classes, responsive variants, dark mode" },
          { name: "Git & GitHub", detail: "Commits, branches, PRs, merge conflicts" },
          { name: "ESLint & Prettier", detail: "Code formatting and linting automation" },
        ],
        resources: [
          { label: "Tailwind CSS Full Course – Dave Gray", url: "https://www.youtube.com/watch?v=lCxcTsOHrjo", type: "yt" },
          { label: "Git & GitHub Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=SWYqp7iY_Tc", type: "yt" },
          { label: "Vite Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=89NJdbYTgJ8", type: "yt" },
        ],
      },
      {
        id: "frontend_p5",
        label: "Phase 5",
        level: "advanced",
        name: "Performance & advanced patterns",
        duration: "4–5 weeks",
        desc: "Ship production-grade apps that are fast, accessible, and maintainable.",
        topics: [
          { name: "Performance optimization", detail: "Lazy loading, code splitting, memoization, Lighthouse" },
          { name: "Advanced React patterns", detail: "Context, compound components, render props, Zustand" },
          { name: "Testing", detail: "Jest, React Testing Library, unit + integration tests" },
          { name: "Deployment", detail: "Vercel, Netlify, env vars, CI/CD with GitHub Actions" },
        ],
        resources: [
          { label: "React Performance – Jack Herrington", url: "https://www.youtube.com/watch?v=shFUVGUaN7Y", type: "yt" },
          { label: "React Testing Library – Web Dev Simplified", url: "https://www.youtube.com/watch?v=7dTTFW7yACQ", type: "yt" },
          { label: "Deploy React App – Fireship", url: "https://www.youtube.com/watch?v=0m6AN-tA3YQ", type: "yt" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. BACKEND DEV
  // ─────────────────────────────────────────────
  {
    id: "backend",
    name: "Backend Dev",
    icon: "⚙️",
    desc: "Build servers, APIs, and databases that power applications.",
    phases: [
      {
        id: "backend_p1",
        label: "Phase 1",
        level: "beginner",
        name: "Python or Node.js basics",
        duration: "4–6 weeks",
        desc: "Pick one language and go deep. Python for data-adjacent work, Node for JS ecosystem.",
        topics: [
          { name: "Language fundamentals", detail: "Variables, functions, OOP, error handling, modules" },
          { name: "File & I/O", detail: "Reading/writing files, JSON parsing, environment variables" },
          { name: "Package managers", detail: "pip (Python) or npm (Node) — installing and using libraries" },
          { name: "Basic algorithms", detail: "Sorting, searching, Big-O basics" },
        ],
        resources: [
          { label: "Python for Beginners – Mosh", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", type: "yt" },
          { label: "Node.js Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", type: "yt" },
          { label: "Python Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", type: "yt" },
          { label: "Node.js Tutorial – Net Ninja", url: "https://www.youtube.com/watch?v=zb3Qk8SG5Ms", type: "yt" },
        ],
      },
      {
        id: "backend_p2",
        label: "Phase 2",
        level: "beginner",
        name: "Databases & SQL",
        duration: "4–5 weeks",
        desc: "Every backend stores data. Learn relational databases first.",
        topics: [
          { name: "SQL fundamentals", detail: "SELECT, INSERT, UPDATE, DELETE, JOINs, indexes" },
          { name: "PostgreSQL", detail: "Most popular production database — setup and queries" },
          { name: "MongoDB basics", detail: "Document model, CRUD, when to use NoSQL" },
          { name: "ORM / ODM", detail: "Prisma (Node) or SQLAlchemy (Python) — DB without raw SQL" },
        ],
        resources: [
          { label: "SQL Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", type: "yt" },
          { label: "MongoDB Crash Course – Web Dev Simplified", url: "https://www.youtube.com/watch?v=ofme2o29ngU", type: "yt" },
          { label: "Prisma Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=CYH04BJzamo", type: "yt" },
          { label: "PostgreSQL Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", type: "yt" },
        ],
      },
      {
        id: "backend_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "REST APIs",
        duration: "4–5 weeks",
        desc: "Build APIs that frontend and mobile apps consume.",
        topics: [
          { name: "Express.js or FastAPI", detail: "Routes, middleware, request/response cycle" },
          { name: "Authentication", detail: "JWT tokens, bcrypt passwords, session vs token auth" },
          { name: "REST principles", detail: "HTTP methods, status codes, versioning, error handling" },
          { name: "API docs", detail: "Swagger / OpenAPI — document your APIs" },
        ],
        resources: [
          { label: "Express.js Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=L72fhGm1tfE", type: "yt" },
          { label: "FastAPI Tutorial – Tech With Tim", url: "https://www.youtube.com/watch?v=tLKKmouUams", type: "yt" },
          { label: "JWT Auth – Web Dev Simplified", url: "https://www.youtube.com/watch?v=7Q17ubqLfaM", type: "yt" },
          { label: "REST API Design – freeCodeCamp", url: "https://www.youtube.com/watch?v=lsMQRaeKNDk", type: "yt" },
        ],
      },
      {
        id: "backend_p4",
        label: "Phase 4",
        level: "advanced",
        name: "System design & deployment",
        duration: "4–6 weeks",
        desc: "Scale and ship real applications.",
        topics: [
          { name: "Docker", detail: "Containers, images, docker-compose for local dev" },
          { name: "Cloud basics", detail: "Deploy to AWS/GCP/Railway — EC2, S3, env config" },
          { name: "Caching", detail: "Redis basics, when and why to cache" },
          { name: "System design basics", detail: "Load balancing, queues, microservices intro" },
        ],
        resources: [
          { label: "Docker Full Course – TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", type: "yt" },
          { label: "Redis Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=Hbt56gFj998", type: "yt" },
          { label: "System Design Primer – freeCodeCamp", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0", type: "yt" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. MACHINE LEARNING / AI
  // ─────────────────────────────────────────────
  {
    id: "ml",
    name: "ML / AI",
    icon: "🤖",
    desc: "Train models, build data pipelines, and deploy intelligent systems.",
    phases: [
      {
        id: "ml_p1",
        label: "Phase 1",
        level: "beginner",
        name: "Math & Python foundations",
        duration: "6–8 weeks",
        desc: "You cannot skip this. ML is applied math. Understand the tools.",
        topics: [
          { name: "Linear algebra", detail: "Vectors, matrices, dot product, eigenvalues — visual intuition" },
          { name: "Calculus basics", detail: "Derivatives, chain rule, gradient — why it matters for training" },
          { name: "Statistics & probability", detail: "Distributions, mean/variance, Bayes theorem, hypothesis testing" },
          { name: "Python for data", detail: "NumPy, Pandas, Matplotlib — bread and butter of ML" },
        ],
        resources: [
          { label: "Linear Algebra – 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "yt" },
          { label: "Statistics – StatQuest with Josh Starmer", url: "https://www.youtube.com/channel/UCtYLUTtgS3k1Fg4y5tAhLbw", type: "yt" },
          { label: "NumPy Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", type: "yt" },
          { label: "Pandas Tutorial – Corey Schafer", url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA", type: "yt" },
        ],
      },
      {
        id: "ml_p2",
        label: "Phase 2",
        level: "beginner",
        name: "Classical machine learning",
        duration: "6–8 weeks",
        desc: "Understand models before jumping to neural networks.",
        topics: [
          { name: "Supervised learning", detail: "Linear/logistic regression, decision trees, SVMs, k-NN" },
          { name: "Unsupervised learning", detail: "K-means clustering, PCA, anomaly detection" },
          { name: "Model evaluation", detail: "Train/test split, cross-validation, accuracy, F1, ROC-AUC" },
          { name: "Scikit-learn", detail: "The standard Python ML library — pipelines, preprocessing" },
        ],
        resources: [
          { label: "ML with Python – Sentdex", url: "https://www.youtube.com/playlist?list=PLQVvvaa0QuDfKTOs3Keq_kaG2P55YRn5v", type: "yt" },
          { label: "Scikit-learn Tutorial – Data School", url: "https://www.youtube.com/playlist?list=PL5-da3qGB5ICeMbQuqys6An_e3nErAEep", type: "yt" },
          { label: "ML Course – Andrew Ng (freeCodeCamp)", url: "https://www.youtube.com/watch?v=jGwO_UgTS7I", type: "yt" },
          { label: "ML Fundamentals – StatQuest", url: "https://www.youtube.com/watch?v=Gv9_4yMHFhI", type: "yt" },
        ],
      },
      {
        id: "ml_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "Deep learning",
        duration: "8–10 weeks",
        desc: "Neural networks and modern architectures that power AI today.",
        topics: [
          { name: "Neural networks", detail: "Perceptrons, backpropagation, activation functions, optimizers" },
          { name: "CNNs", detail: "Convolutional networks for image tasks" },
          { name: "RNNs & LSTMs", detail: "Sequence models for text and time series" },
          { name: "Transformers", detail: "Attention mechanism, BERT, GPT architecture basics" },
        ],
        resources: [
          { label: "Neural Networks – 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "yt" },
          { label: "Deep Learning with PyTorch – freeCodeCamp", url: "https://www.youtube.com/watch?v=V_xro1bcAuA", type: "yt" },
          { label: "Transformers Explained – Andrej Karpathy", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", type: "yt" },
          { label: "TensorFlow Tutorial – Tech With Tim", url: "https://www.youtube.com/watch?v=tPYj3fFJGjk", type: "yt" },
        ],
      },
      {
        id: "ml_p4",
        label: "Phase 4",
        level: "advanced",
        name: "MLOps & deployment",
        duration: "4–6 weeks",
        desc: "Get models out of notebooks and into production.",
        topics: [
          { name: "Experiment tracking", detail: "MLflow, Weights & Biases — track runs, compare models" },
          { name: "Model serving", detail: "FastAPI + model, BentoML, ONNX export" },
          { name: "Data versioning", detail: "DVC — version datasets like code" },
          { name: "End-to-end projects", detail: "Kaggle competitions, real datasets, building a portfolio" },
        ],
        resources: [
          { label: "MLOps Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=-dJPoLm_gtE", type: "yt" },
          { label: "Krish Naik – End to End ML Projects", url: "https://www.youtube.com/@krishnaik06", type: "yt" },
          { label: "Weights & Biases Tutorial – W&B", url: "https://www.youtube.com/watch?v=EeqhOSvNX-A", type: "yt" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. DEVOPS
  // ─────────────────────────────────────────────
  {
    id: "devops",
    name: "DevOps",
    icon: "🚀",
    desc: "Automate infrastructure, deployments, and operations at scale.",
    phases: [
      {
        id: "devops_p1",
        label: "Phase 1",
        level: "beginner",
        name: "Linux & scripting",
        duration: "4–5 weeks",
        desc: "Servers run Linux. You need to command them without fear.",
        topics: [
          { name: "Linux CLI", detail: "Navigation, file permissions, processes, networking tools" },
          { name: "Bash scripting", detail: "Variables, conditionals, loops, cron jobs, automation scripts" },
          { name: "SSH & networking", detail: "Remote access, TCP/IP, DNS, firewalls, ports" },
          { name: "Package management", detail: "apt, yum, installing and managing services" },
        ],
        resources: [
          { label: "Linux Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", type: "yt" },
          { label: "Bash Scripting – NetworkChuck", url: "https://www.youtube.com/watch?v=SPwyp2NG-bE", type: "yt" },
          { label: "Linux for Hackers – NetworkChuck", url: "https://www.youtube.com/watch?v=VbEx7B_PTOE", type: "yt" },
          { label: "SSH Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=hQWRp-FdTpc", type: "yt" },
        ],
      },
      {
        id: "devops_p2",
        label: "Phase 2",
        level: "beginner",
        name: "Docker & containers",
        duration: "4–5 weeks",
        desc: "Modern apps ship in containers. Docker is the standard.",
        topics: [
          { name: "Docker fundamentals", detail: "Images, containers, Dockerfile, volumes, networking" },
          { name: "Docker Compose", detail: "Multi-container apps, local dev environments" },
          { name: "Container registries", detail: "Docker Hub, pushing/pulling images" },
          { name: "Container best practices", detail: "Layer caching, multi-stage builds, slim images" },
        ],
        resources: [
          { label: "Docker Full Course – TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", type: "yt" },
          { label: "Docker Compose – TechWorld with Nana", url: "https://www.youtube.com/watch?v=SXwC9fSwct8", type: "yt" },
          { label: "Docker in 100 Seconds – Fireship", url: "https://www.youtube.com/watch?v=Gjnup-PuquQ", type: "yt" },
          { label: "Docker Deep Dive – KodeKloud", url: "https://www.youtube.com/watch?v=fqMOX6JJhGo", type: "yt" },
        ],
      },
      {
        id: "devops_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "Kubernetes & cloud",
        duration: "6–7 weeks",
        desc: "Orchestrate containers and deploy to real cloud infrastructure.",
        topics: [
          { name: "Kubernetes basics", detail: "Pods, services, deployments, namespaces, kubectl" },
          { name: "Helm", detail: "Package manager for Kubernetes — charts and releases" },
          { name: "Cloud provider", detail: "AWS/GCP/Azure — compute, storage, networking, IAM" },
          { name: "Terraform", detail: "Infrastructure as code — provision cloud resources declaratively" },
        ],
        resources: [
          { label: "Kubernetes Full Course – TechWorld with Nana", url: "https://www.youtube.com/watch?v=X48VuDVv0do", type: "yt" },
          { label: "Kubernetes for Beginners – KodeKloud", url: "https://www.youtube.com/watch?v=l7gC4SgHEhU", type: "yt" },
          { label: "Terraform Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", type: "yt" },
          { label: "AWS Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", type: "yt" },
        ],
      },
      {
        id: "devops_p4",
        label: "Phase 4",
        level: "advanced",
        name: "CI/CD & monitoring",
        duration: "3–4 weeks",
        desc: "Automate delivery pipelines and observe systems in production.",
        topics: [
          { name: "GitHub Actions", detail: "Workflows, triggers, jobs, deploy on push" },
          { name: "Prometheus & Grafana", detail: "Metrics collection, dashboards, alerting" },
          { name: "ELK stack / Loki", detail: "Centralised logging, log queries" },
          { name: "SLOs & incident response", detail: "Defining reliability targets, runbooks, on-call" },
        ],
        resources: [
          { label: "GitHub Actions Full Course – TechWorld with Nana", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", type: "yt" },
          { label: "Prometheus & Grafana – TechWorld with Nana", url: "https://www.youtube.com/watch?v=QoDqxm7ybLc", type: "yt" },
          { label: "DevOps Zero to Hero – Abhishek Veeramalla", url: "https://www.youtube.com/watch?v=a9__D53WsUs", type: "yt" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. CYBERSECURITY
  // ─────────────────────────────────────────────
  {
    id: "cyber",
    name: "Cybersecurity",
    icon: "🔐",
    desc: "Protect systems, find vulnerabilities, and defend against attackers.",
    phases: [
      {
        id: "cyber_p1",
        label: "Phase 1",
        level: "beginner",
        name: "Networking & OS fundamentals",
        duration: "5–6 weeks",
        desc: "Break things later. Understand them first.",
        topics: [
          { name: "Networking", detail: "OSI model, TCP/IP, DNS, HTTP/S, Wireshark, packet analysis" },
          { name: "Linux for security", detail: "CLI, file permissions, processes, logs, Kali Linux intro" },
          { name: "Windows security basics", detail: "Active Directory, NTFS permissions, registry, event logs" },
          { name: "Python scripting", detail: "Automate recon, write simple tools, parse output" },
        ],
        resources: [
          { label: "Networking Basics – NetworkChuck", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", type: "yt" },
          { label: "Linux for Ethical Hackers – TCM Security", url: "https://www.youtube.com/watch?v=lZAoFs75_cs", type: "yt" },
          { label: "CompTIA Network+ – Professor Messer", url: "https://www.youtube.com/@professormesser", type: "yt" },
          { label: "Python for Hackers – David Bombal", url: "https://www.youtube.com/watch?v=byHi7hGMjGA", type: "yt" },
        ],
      },
      {
        id: "cyber_p2",
        label: "Phase 2",
        level: "intermediate",
        name: "Ethical hacking & pen testing",
        duration: "6–8 weeks",
        desc: "Learn to attack so you can defend. Practise on legal lab environments.",
        topics: [
          { name: "Recon & OSINT", detail: "Passive recon, Shodan, theHarvester, Maltego" },
          { name: "Scanning & enumeration", detail: "Nmap, Nessus, service fingerprinting" },
          { name: "Exploitation", detail: "Metasploit framework, manual exploits, CVEs" },
          { name: "Web app hacking", detail: "OWASP Top 10 — SQLi, XSS, IDOR, SSRF, broken auth" },
        ],
        resources: [
          { label: "Ethical Hacking Full Course – TCM Security", url: "https://www.youtube.com/watch?v=3FNYvj2U0HM", type: "yt" },
          { label: "Web App Hacking – PortSwigger Academy (free)", url: "https://portswigger.net/web-security", type: "docs" },
          { label: "HackerSploit – Ethical Hacking Course", url: "https://www.youtube.com/@HackerSploit", type: "yt" },
          { label: "John Hammond – CTF Walkthroughs", url: "https://www.youtube.com/@_JohnHammond", type: "yt" },
        ],
      },
      {
        id: "cyber_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "Defensive security",
        duration: "5–6 weeks",
        desc: "Blue team skills — detect, respond, investigate.",
        topics: [
          { name: "SIEM", detail: "Splunk or Elastic — log aggregation, correlation rules, dashboards" },
          { name: "Incident response", detail: "IR lifecycle, containment, eradication, forensics" },
          { name: "Threat intelligence", detail: "IOCs, TTPs, MITRE ATT&CK framework, threat hunting" },
          { name: "Malware analysis basics", detail: "Static vs dynamic analysis, sandboxing, strings" },
        ],
        resources: [
          { label: "SOC Analyst Course – TCM Security", url: "https://www.youtube.com/@TCMSecurityAcademy", type: "yt" },
          { label: "Splunk Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=SSA_L-mQ0Os", type: "yt" },
          { label: "MITRE ATT&CK – freeCodeCamp", url: "https://www.youtube.com/watch?v=5CTG_bMjP28", type: "yt" },
          { label: "Null Byte – Security Tutorials", url: "https://www.youtube.com/@NullByteWHT", type: "yt" },
        ],
      },
      {
        id: "cyber_p4",
        label: "Phase 4",
        level: "advanced",
        name: "Certifications & specialization",
        duration: "ongoing",
        desc: "Prove your skills. Go deep in a niche.",
        topics: [
          { name: "CompTIA Security+", detail: "Entry-level cert, widely recognized, good starting point" },
          { name: "CEH / OSCP", detail: "CEH = theoretical, OSCP = hands-on practical (harder, more respected)" },
          { name: "Cloud security", detail: "AWS Security Specialty, Azure Security Engineer" },
          { name: "CTF competitions", detail: "HackTheBox, TryHackMe, PicoCTF — practise constantly" },
        ],
        resources: [
          { label: "CompTIA Security+ – Professor Messer", url: "https://www.youtube.com/watch?v=9Hd8QJmZykc", type: "yt" },
          { label: "TryHackMe Walkthroughs – John Hammond", url: "https://www.youtube.com/@_JohnHammond", type: "yt" },
          { label: "OSCP Prep – TCM Security", url: "https://www.youtube.com/@TCMSecurityAcademy", type: "yt" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6. UX / UI DESIGN
  // ─────────────────────────────────────────────
  {
    id: "uxdesign",
    name: "UX / UI Design",
    icon: "🎨",
    desc: "Design digital products that are intuitive, beautiful, and human-centred.",
    phases: [
      {
        id: "ux_p1",
        label: "Phase 1",
        level: "beginner",
        name: "Design fundamentals",
        duration: "3–4 weeks",
        desc: "Visual language first. Everything else builds on this.",
        topics: [
          { name: "Visual principles", detail: "Typography, color theory, spacing, contrast, hierarchy" },
          { name: "Gestalt principles", detail: "Proximity, similarity, closure — how eyes read interfaces" },
          { name: "Figma basics", detail: "Frames, shapes, text, layers, constraints" },
          { name: "Design systems intro", detail: "Components, styles, tokens — thinking systematically" },
        ],
        resources: [
          { label: "UI Design for Beginners – DesignCourse", url: "https://www.youtube.com/watch?v=_Hp_dI0DzY4", type: "yt" },
          { label: "Figma Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=jwCmIBJ8Jtc", type: "yt" },
          { label: "Typography – DesignCourse", url: "https://www.youtube.com/watch?v=QrNi9FmdlxY", type: "yt" },
          { label: "Color Theory – DesignCourse", url: "https://www.youtube.com/watch?v=AvgCkHrcj8w", type: "yt" },
        ],
      },
      {
        id: "ux_p2",
        label: "Phase 2",
        level: "beginner",
        name: "UX research & process",
        duration: "4–5 weeks",
        desc: "Design FOR people. Research is how you find out what they need.",
        topics: [
          { name: "User research", detail: "Interviews, surveys, contextual inquiry, personas" },
          { name: "Information architecture", detail: "Sitemaps, user flows, card sorting, navigation patterns" },
          { name: "Wireframing", detail: "Low-fi → mid-fi → high-fi progression" },
          { name: "Usability testing", detail: "Testing with real users, think-aloud protocol" },
        ],
        resources: [
          { label: "UX Design Full Course – Google on Coursera (free audit)", url: "https://www.youtube.com/watch?v=uL2ZB7XXIgg", type: "yt" },
          { label: "User Research Methods – AJ&Smart", url: "https://www.youtube.com/@AJSmart", type: "yt" },
          { label: "Wireframing Tutorial – Figma", url: "https://www.youtube.com/watch?v=6t_dYhXyYjI", type: "yt" },
        ],
      },
      {
        id: "ux_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "Prototyping & interaction design",
        duration: "3–4 weeks",
        desc: "Bring your designs to life with realistic interactive prototypes.",
        topics: [
          { name: "Figma prototyping", detail: "Interactions, transitions, overlays, smart animate" },
          { name: "Micro-interactions", detail: "Feedback states, loading, hover, error, success" },
          { name: "Accessibility", detail: "WCAG 2.1, color contrast, keyboard nav, screen readers" },
          { name: "Design system creation", detail: "Component library, auto layout, variants" },
        ],
        resources: [
          { label: "Figma Prototyping – Figma Official", url: "https://www.youtube.com/watch?v=iBkXf6u8htI", type: "yt" },
          { label: "Advanced Figma – DesignCourse", url: "https://www.youtube.com/watch?v=31wzhvz0vsw", type: "yt" },
          { label: "Web Accessibility – Kevin Powell", url: "https://www.youtube.com/watch?v=qdB8SRhqvFc", type: "yt" },
        ],
      },
      {
        id: "ux_p4",
        label: "Phase 4",
        level: "advanced",
        name: "Portfolio & handoff",
        duration: "3–4 weeks",
        desc: "Get hired. Show your process, not just pretty screens.",
        topics: [
          { name: "Case studies", detail: "Problem → research → process → solution → outcome" },
          { name: "Dev handoff", detail: "Figma inspect, annotations, redlines, Zeplin" },
          { name: "Portfolio site", detail: "Personal site or Notion — present work professionally" },
          { name: "Freelancing basics", detail: "Finding clients, pricing, contracts for designers" },
        ],
        resources: [
          { label: "UX Portfolio – AJ&Smart", url: "https://www.youtube.com/watch?v=vFO1D5upB0s", type: "yt" },
          { label: "Figma to Dev Handoff – Figma", url: "https://www.youtube.com/watch?v=B242nuM3y2s", type: "yt" },
          { label: "Design Case Study – DesignCourse", url: "https://www.youtube.com/watch?v=m3W0BNlox2k", type: "yt" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7. DATA SCIENCE
  // ─────────────────────────────────────────────
  {
    id: "datascience",
    name: "Data Science",
    icon: "📊",
    desc: "Extract insights from data using statistics, Python, and visualisation.",
    phases: [
      {
        id: "ds_p1",
        label: "Phase 1",
        level: "beginner",
        name: "Python & statistics",
        duration: "5–6 weeks",
        desc: "Python is the language of data. Stats is the brain behind it.",
        topics: [
          { name: "Python basics", detail: "Syntax, functions, loops, file I/O, list comprehensions" },
          { name: "Statistics", detail: "Descriptive stats, distributions, hypothesis testing, p-values" },
          { name: "NumPy & Pandas", detail: "Arrays, DataFrames, data cleaning, groupby, merge" },
          { name: "Matplotlib & Seaborn", detail: "Plots, histograms, heatmaps, communicating findings" },
        ],
        resources: [
          { label: "Python for Data Science – freeCodeCamp", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", type: "yt" },
          { label: "Statistics Fundamentals – StatQuest", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9", type: "yt" },
          { label: "Pandas Tutorial – Corey Schafer", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS", type: "yt" },
          { label: "Data Analysis with Python – freeCodeCamp", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", type: "yt" },
        ],
      },
      {
        id: "ds_p2",
        label: "Phase 2",
        level: "beginner",
        name: "Data wrangling & EDA",
        duration: "4–5 weeks",
        desc: "80% of data work is cleaning. Master it.",
        topics: [
          { name: "Data cleaning", detail: "Handling nulls, duplicates, outliers, type conversion" },
          { name: "Exploratory Data Analysis", detail: "Distributions, correlations, feature relationships" },
          { name: "SQL for data", detail: "Querying databases, window functions, CTEs" },
          { name: "Feature engineering", detail: "Creating meaningful features from raw data" },
        ],
        resources: [
          { label: "EDA Tutorial – Ken Jee", url: "https://www.youtube.com/@KenJee_ds", type: "yt" },
          { label: "SQL for Data Science – Alex The Analyst", url: "https://www.youtube.com/watch?v=9URM1_2S0ho", type: "yt" },
          { label: "Data Cleaning – Corey Schafer", url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA", type: "yt" },
        ],
      },
      {
        id: "ds_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "Machine learning for data",
        duration: "6–7 weeks",
        desc: "Apply ML to real datasets. Build models that answer business questions.",
        topics: [
          { name: "Regression", detail: "Linear, polynomial, regularisation (Ridge, Lasso)" },
          { name: "Classification", detail: "Logistic, trees, random forest, XGBoost" },
          { name: "Model evaluation", detail: "Cross-validation, confusion matrix, ROC, feature importance" },
          { name: "Scikit-learn pipelines", detail: "Preprocessing + model in clean, reusable pipeline" },
        ],
        resources: [
          { label: "ML with Scikit-learn – Data School", url: "https://www.youtube.com/playlist?list=PL5-da3qGB5ICeMbQuqys6An_e3nErAEep", type: "yt" },
          { label: "XGBoost Tutorial – Krish Naik", url: "https://www.youtube.com/@krishnaik06", type: "yt" },
          { label: "Kaggle ML Course – Kaggle", url: "https://www.youtube.com/watch?v=HW29067qVWk", type: "yt" },
        ],
      },
      {
        id: "ds_p4",
        label: "Phase 4",
        level: "advanced",
        name: "Dashboards & communication",
        duration: "3–4 weeks",
        desc: "Insights are useless if you can't communicate them. Visualise and present.",
        topics: [
          { name: "Tableau / Power BI", detail: "Business dashboards, interactive charts, publishing" },
          { name: "Plotly & Dash", detail: "Python-based interactive charts and web dashboards" },
          { name: "Storytelling with data", detail: "Choosing the right chart, annotation, narrative arc" },
          { name: "Portfolio projects", detail: "End-to-end Kaggle or real dataset projects" },
        ],
        resources: [
          { label: "Tableau Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=TPMlZxRRaBQ", type: "yt" },
          { label: "Plotly Dash – Charming Data", url: "https://www.youtube.com/@CharmingData", type: "yt" },
          { label: "Data Science Projects – Ken Jee", url: "https://www.youtube.com/@KenJee_ds", type: "yt" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8. MOBILE DEV (React Native)
  // ─────────────────────────────────────────────
  {
    id: "mobile",
    name: "Mobile Dev",
    icon: "📱",
    desc: "Build cross-platform iOS and Android apps with React Native.",
    phases: [
      {
        id: "mobile_p1",
        label: "Phase 1",
        level: "beginner",
        name: "React Native fundamentals",
        duration: "4–5 weeks",
        desc: "React skills transfer. Learn the mobile-specific parts.",
        topics: [
          { name: "Setup & Expo", detail: "Expo CLI, simulator, physical device testing" },
          { name: "Core components", detail: "View, Text, Image, ScrollView, FlatList, TouchableOpacity" },
          { name: "Styling in RN", detail: "StyleSheet API, Flexbox on mobile, dimensions" },
          { name: "Navigation", detail: "React Navigation — stack, tab, drawer navigators" },
        ],
        resources: [
          { label: "React Native Full Course – Mosh", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc", type: "yt" },
          { label: "React Native Crash Course – Traversy Media", url: "https://www.youtube.com/watch?v=Hf4MJH0jDb4", type: "yt" },
          { label: "React Navigation Tutorial – Net Ninja", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPyVjf7", type: "yt" },
        ],
      },
      {
        id: "mobile_p2",
        label: "Phase 2",
        level: "intermediate",
        name: "State & data",
        duration: "4–5 weeks",
        desc: "Manage app state and connect to APIs and device features.",
        topics: [
          { name: "State management", detail: "Context API, Zustand or Redux Toolkit" },
          { name: "API calls", detail: "Fetch / Axios, loading states, error handling" },
          { name: "Async Storage", detail: "Persisting data locally on device" },
          { name: "Device APIs", detail: "Camera, GPS, notifications, permissions" },
        ],
        resources: [
          { label: "React Native + Firebase – freeCodeCamp", url: "https://www.youtube.com/watch?v=ubHoB47bfOM", type: "yt" },
          { label: "Expo APIs – Expo Docs YouTube", url: "https://www.youtube.com/@expo-io", type: "yt" },
          { label: "Redux Toolkit – Dave Gray", url: "https://www.youtube.com/watch?v=NqzdVN2tyvQ", type: "yt" },
        ],
      },
      {
        id: "mobile_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "UI polish & animations",
        duration: "3–4 weeks",
        desc: "Mobile users expect smooth, native-feeling interactions.",
        topics: [
          { name: "Gesture handling", detail: "React Native Gesture Handler, swipe, pan, pinch" },
          { name: "Reanimated", detail: "60fps animations with React Native Reanimated v3" },
          { name: "NativeWind", detail: "Tailwind classes in React Native" },
          { name: "Platform-specific code", detail: "Platform.OS, .ios.js / .android.js files" },
        ],
        resources: [
          { label: "React Native Animations – William Candillon", url: "https://www.youtube.com/@wcandillon", type: "yt" },
          { label: "NativeWind Tutorial – notJust.dev", url: "https://www.youtube.com/@notjustdev", type: "yt" },
          { label: "Reanimated Crash Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=yz6LCerZOE4", type: "yt" },
        ],
      },
      {
        id: "mobile_p4",
        label: "Phase 4",
        level: "advanced",
        name: "Publishing & backend",
        duration: "3–4 weeks",
        desc: "Ship to the App Store and Google Play.",
        topics: [
          { name: "App Store & Google Play", detail: "Build process, signing, App Store Connect, Play Console" },
          { name: "Firebase", detail: "Auth, Firestore, storage, push notifications" },
          { name: "OTA updates", detail: "Expo Updates — push fixes without app store review" },
          { name: "Performance profiling", detail: "Flipper, Hermes engine, JS thread vs native thread" },
        ],
        resources: [
          { label: "React Native Firebase – Net Ninja", url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jm_DzLpM9MoYqpFDpqQVt6", type: "yt" },
          { label: "Publish to App Stores – Expo Docs", url: "https://www.youtube.com/watch?v=oBWBDaqx0ro", type: "yt" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9. CLOUD ENGINEERING
  // ─────────────────────────────────────────────
  {
    id: "cloud",
    name: "Cloud Engineering",
    icon: "☁️",
    desc: "Design, build, and manage scalable cloud infrastructure on AWS, GCP, or Azure.",
    phases: [
      {
        id: "cloud_p1",
        label: "Phase 1",
        level: "beginner",
        name: "Cloud fundamentals",
        duration: "4–5 weeks",
        desc: "Understand what the cloud is and how to navigate AWS/GCP/Azure.",
        topics: [
          { name: "Cloud concepts", detail: "IaaS, PaaS, SaaS, shared responsibility model, regions, AZs" },
          { name: "Compute", detail: "EC2 / Compute Engine / VMs — launch, configure, SSH" },
          { name: "Storage", detail: "S3 / GCS / Blob Storage — objects, buckets, lifecycle" },
          { name: "Networking basics", detail: "VPC, subnets, security groups, load balancers" },
        ],
        resources: [
          { label: "AWS Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", type: "yt" },
          { label: "AWS for Beginners – TechWorld with Nana", url: "https://www.youtube.com/watch?v=k1RI5locZE4", type: "yt" },
          { label: "GCP Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=jpno8FSqpc8", type: "yt" },
          { label: "Azure Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=NKEFWyqJ5XA", type: "yt" },
        ],
      },
      {
        id: "cloud_p2",
        label: "Phase 2",
        level: "beginner",
        name: "IAM & security",
        duration: "3–4 weeks",
        desc: "Security is not optional. Lock things down from day one.",
        topics: [
          { name: "IAM", detail: "Users, roles, policies, least privilege, service accounts" },
          { name: "Secrets management", detail: "AWS Secrets Manager, HashiCorp Vault, env vars vs secrets" },
          { name: "Compliance basics", detail: "CloudTrail, audit logs, encryption at rest and in transit" },
          { name: "Cost management", detail: "Billing alerts, cost explorer, right-sizing" },
        ],
        resources: [
          { label: "AWS IAM Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=iF9fs8Rw4Uo", type: "yt" },
          { label: "AWS Security – TechWorld with Nana", url: "https://www.youtube.com/@TechWorldwithNana", type: "yt" },
          { label: "HashiCorp Vault – DevOps Directive", url: "https://www.youtube.com/@DevOpsDirective", type: "yt" },
        ],
      },
      {
        id: "cloud_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "Serverless & managed services",
        duration: "4–5 weeks",
        desc: "Use managed services — less infra to manage, more focus on product.",
        topics: [
          { name: "Lambda / Cloud Functions", detail: "Event-driven functions, triggers, cold start" },
          { name: "Managed databases", detail: "RDS, Aurora, Cloud SQL, DynamoDB, Firestore" },
          { name: "API Gateway", detail: "Build serverless REST APIs without managing servers" },
          { name: "Message queues", detail: "SQS, Pub/Sub, SNS — async decoupled architectures" },
        ],
        resources: [
          { label: "AWS Lambda Tutorial – freeCodeCamp", url: "https://www.youtube.com/watch?v=eOBq__h4OJ4", type: "yt" },
          { label: "Serverless Framework – Traversy Media", url: "https://www.youtube.com/watch?v=71cd5XerKss", type: "yt" },
          { label: "DynamoDB Deep Dive – freeCodeCamp", url: "https://www.youtube.com/watch?v=2k2GINpO308", type: "yt" },
        ],
      },
      {
        id: "cloud_p4",
        label: "Phase 4",
        level: "advanced",
        name: "Certifications & architecture",
        duration: "ongoing",
        desc: "Validate skills with cloud certs. Design real architectures.",
        topics: [
          { name: "AWS Solutions Architect Associate", detail: "Most valuable cloud cert — design scalable systems" },
          { name: "Well-Architected Framework", detail: "5 pillars: operational excellence, security, reliability, performance, cost" },
          { name: "Multi-cloud strategy", detail: "When and why to use multiple providers" },
          { name: "FinOps", detail: "Cloud cost optimisation as a discipline" },
        ],
        resources: [
          { label: "AWS SAA-C03 Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=c3Cn4xEfRos", type: "yt" },
          { label: "AWS Solutions Architect – TechWorld with Nana", url: "https://www.youtube.com/@TechWorldwithNana", type: "yt" },
          { label: "Cloud Architecture Patterns – freeCodeCamp", url: "https://www.youtube.com/watch?v=0rc5FgTQMqY", type: "yt" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10. BLOCKCHAIN / WEB3
  // ─────────────────────────────────────────────
  {
    id: "blockchain",
    name: "Blockchain / Web3",
    icon: "⛓️",
    desc: "Build decentralised apps, smart contracts, and Web3 protocols.",
    phases: [
      {
        id: "blockchain_p1",
        label: "Phase 1",
        level: "beginner",
        name: "Blockchain fundamentals",
        duration: "3–4 weeks",
        desc: "Understand the tech before writing code. Lots of hype — cut through it.",
        topics: [
          { name: "How blockchains work", detail: "Consensus, hashing, blocks, chains, nodes, mining vs staking" },
          { name: "Ethereum basics", detail: "Accounts, transactions, gas, EVM, wallets (MetaMask)" },
          { name: "Cryptography basics", detail: "Public/private keys, digital signatures, hashing (SHA-256)" },
          { name: "DeFi & NFT concepts", detail: "Tokens, smart contracts, DAOs, use cases vs speculation" },
        ],
        resources: [
          { label: "Blockchain Full Course – freeCodeCamp", url: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", type: "yt" },
          { label: "Ethereum in 100 Seconds – Fireship", url: "https://www.youtube.com/watch?v=jxLkbJozKbY", type: "yt" },
          { label: "Web3 Explained – Whiteboard Crypto", url: "https://www.youtube.com/@WhiteboardCrypto", type: "yt" },
        ],
      },
      {
        id: "blockchain_p2",
        label: "Phase 2",
        level: "beginner",
        name: "Solidity & smart contracts",
        duration: "5–6 weeks",
        desc: "Solidity is the language of Ethereum smart contracts.",
        topics: [
          { name: "Solidity syntax", detail: "Types, functions, modifiers, events, mappings, structs" },
          { name: "Smart contract patterns", detail: "Ownable, pausable, reentrancy guard, upgradeable" },
          { name: "Testing contracts", detail: "Hardhat / Foundry — unit tests for Solidity" },
          { name: "Security basics", detail: "Reentrancy, overflow, access control, front-running" },
        ],
        resources: [
          { label: "Solidity Full Course – freeCodeCamp (Patrick Collins)", url: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", type: "yt" },
          { label: "Hardhat Tutorial – EatTheBlocks", url: "https://www.youtube.com/watch?v=9Qpi80dQsGU", type: "yt" },
          { label: "Smart Contract Security – Secureum", url: "https://www.youtube.com/@SecureumBootcamp", type: "yt" },
        ],
      },
      {
        id: "blockchain_p3",
        label: "Phase 3",
        level: "intermediate",
        name: "dApp development",
        duration: "5–6 weeks",
        desc: "Connect smart contracts to a frontend. Build full Web3 apps.",
        topics: [
          { name: "Ethers.js / Wagmi", detail: "Connect frontend to blockchain, read/write contracts" },
          { name: "IPFS & decentralised storage", detail: "Store files off-chain, content addressing" },
          { name: "The Graph", detail: "Index and query blockchain data efficiently" },
          { name: "Wallet connect", detail: "Rainbow Kit, WalletConnect — onboard users" },
        ],
        resources: [
          { label: "dApp Development – freeCodeCamp", url: "https://www.youtube.com/watch?v=8rhueOcTu8k", type: "yt" },
          { label: "Ethers.js Tutorial – EatTheBlocks", url: "https://www.youtube.com/@EatTheBlocks", type: "yt" },
          { label: "Web3 React App – Patrick Collins", url: "https://www.youtube.com/@PatrickAlphaC", type: "yt" },
        ],
      },
      {
        id: "blockchain_p4",
        label: "Phase 4",
        level: "advanced",
        name: "Protocols & auditing",
        duration: "ongoing",
        desc: "Go deep — build DeFi protocols or audit contracts for security flaws.",
        topics: [
          { name: "DeFi protocols", detail: "AMMs (Uniswap), lending (Aave), yield strategies" },
          { name: "Smart contract auditing", detail: "Manual review, Slither, MythX, bug bounties" },
          { name: "Layer 2 solutions", detail: "Optimism, Arbitrum, zkSync — scaling Ethereum" },
          { name: "Cross-chain", detail: "Bridges, CCIP, multi-chain deployment" },
        ],
        resources: [
          { label: "DeFi Deep Dive – freeCodeCamp", url: "https://www.youtube.com/watch?v=M576WGiDBdQ", type: "yt" },
          { label: "Smart Contract Auditing – Patrick Collins", url: "https://www.youtube.com/@PatrickAlphaC", type: "yt" },
          { label: "Cyfrin Updraft (free audit course)", url: "https://www.youtube.com/watch?v=pUWmJ86X_do", type: "yt" },
        ],
      },
    ],
  },
];