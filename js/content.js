/* ============================================================
   content.js — EVERY piece of personal data on this site.
   Edit this one file to change the whole portfolio.
   ============================================================ */

const CONTENT = {
  // ---------- Identity ----------
  name: "Thirumalesh",
  fullName: "Thirumalesh Pinninti",
  handle: "thiru",
  role: "Cloud & DevOps Engineer",
  tagline:
    "I build things that run in production — cloud infrastructure, full-stack apps, and the occasional compiler.",
  location: "Hyderabad, Telangana",
  school: "Marri Laxman Reddy Institute of Technology and Management",
  course: "B.Tech, Computer Science (AI & ML) · 2023–2027",
  email: "thirumaleshpinninti@gmail.com",
  github: "https://github.com/thirumaleshp",
  githubUser: "thirumaleshp",
  linkedin: "https://www.linkedin.com/in/thirumalesh-pinninti/",
  twitter: "https://x.com/Thirumaleshx",

  // ---------- About Me ----------
  about: [
    "I'm a final-stretch CS undergrad in Hyderabad who spends most of his time on the infrastructure side of software — the part that decides whether a thing actually stays up.",
    "That's taken me from deploying FastAPI services on Google Cloud for a home-inspection platform, to orchestrating per-user Docker containers on AWS EC2, to writing a compiler for a tactile-feedback language because I wanted one string to make a phone buzz and a gamepad rumble the same way.",
    "I'm an AWS Cloud Captain at my college's AWS Cloud Club, a Google Student Ambassador, and I have two pull requests merged into openclaw. I like problems where the answer isn't in the docs yet.",
  ],

  // ---------- Tech Superpowers ----------
  superpowers: [
    {
      name: "Cloud & DevOps",
      icon: "▲",
      level: 4,
      items: ["AWS (EC2, S3, Amplify, IAM)", "Google Cloud Platform", "Terraform", "Docker", "Jenkins", "GitHub Actions"],
      blurb: "Infrastructure that survives contact with real users.",
    },
    {
      name: "Full-Stack",
      icon: "◆",
      level: 5,
      items: ["Next.js", "React", "TypeScript", "FastAPI", "Flutter", "PostgreSQL", "Supabase"],
      blurb: "Shipped production apps on both web and mobile.",
    },
    {
      name: "Languages",
      icon: "■",
      level: 4,
      items: ["TypeScript", "Python", "C", "Dart", "Bash"],
      blurb: "Python to think in, TypeScript to ship in, C to understand why.",
    },
    {
      name: "Systems & Open Source",
      icon: "●",
      level: 4,
      items: ["Compiler design", "Linux (Ubuntu, CentOS)", "Monorepos", "Turborepo", "Vitest"],
      blurb: "Tokenizers, ASTs, and 383 tests I wrote on purpose.",
    },
  ],

  // ---------- Experience ----------
  experience: [
    {
      title: "Full-Stack AI Intern",
      org: "Vidh Labs",
      date: "Sep 2026 — Present",
      url: "https://vidh.co/",
      bullets: [
        "Architected an interactive Challenges CMS in Next.js and TypeScript, letting educators build and publish gamified quests for the learner mobile app.",
        "Built real-time authoring workflows with TanStack Query optimistic caching and Cloud Run microservices integration.",
      ],
    },
    {
      title: "Full-Stack Developer (Intern)",
      org: "Handover Expert",
      date: "Nov 2025 — Jun 2026",
      url: "https://handoverexpert.com/",
      bullets: [
        "Built a full-stack home inspection platform with Flutter and Python FastAPI, deployed on Google Cloud Platform.",
        "Engineered a GCS signed-URL media upload pipeline, Alembic-managed PostgreSQL migrations, and branded multi-page PDF report generation.",
      ],
    },
    {
      title: "AWS Cloud Captain",
      org: "AWS Cloud Club, MLRITM",
      date: "Nov 2025 — Present",
      url: "",
      bullets: [
        "Running sessions on AWS foundations and AI services, from Bedrock to developer tooling, for students on campus.",
      ],
    },
    {
      title: "Summer of AI Intern",
      org: "Swecha Telangana",
      date: "May 2024 — Jul 2024",
      url: "",
      bullets: [
        "Trained an ML model to recognise and describe images and text covering local flora and fauna.",
      ],
    },
  ],

  // ---------- Projects ----------
  projects: [
    {
      id: "haptic",
      name: "Haptic.js",
      year: "2026",
      status: "open source",
      summary:
        "A universal haptics engine for the web, with its own pattern language and a real compiler behind it.",
      detail:
        "HPL is a custom DSL with a genuine tokenizer, parser and compiler pipeline. One pattern string drives Android vibration, an iOS audio fallback and dual-motor gamepad rumble. Nine npm packages across React, Vue, Svelte, Angular, Web Components and React Native. 63+ presets, physics-based patterns, 383 tests, zero dependencies.",
      stack: ["TypeScript", "Compiler Design", "Turborepo", "Vitest", "Web Audio API", "Gamepad API"],
      links: [{ label: "Docs", url: "https://thirumaleshp.github.io/hapticjs/" }],
      highlight: "Six months of compiler work for one line of API.",
    },
    {
      id: "myclaw",
      name: "My-Claw",
      year: "2026",
      status: "shipped",
      summary:
        "A SaaS platform that deploys personal AI assistants to Telegram, WhatsApp, Slack and Discord.",
      detail:
        "Per-user Docker container orchestration on AWS EC2, with a subdomain reverse proxy through Caddy, Cloudflare DNS, Firebase auth and automatic config management. The interesting problem was isolation: every user gets their own container and their own subdomain, provisioned without manual steps.",
      stack: ["AWS EC2", "Docker", "TypeScript", "Python", "Caddy", "Firebase", "Cloudflare DNS"],
      links: [{ label: "GitHub", url: "https://github.com/thirumaleshp/My-Claw" }],
      highlight: "",
    },
    {
      id: "pixume",
      name: "Pixume",
      year: "2026",
      status: "live",
      summary:
        "Turns a PDF résumé into a personal website in seconds — AI extraction, custom URLs, privacy-first.",
      detail:
        "Upload a PDF, get a hosted site. AI-powered extraction with Groq and Llama Guard 3 for content safety, AWS S3 for storage, Redis for caching, Clerk for auth, and Zod schemas holding the parsing honest.",
      stack: ["Next.js", "AWS S3", "Groq", "Redis", "Clerk", "Zod", "TanStack"],
      links: [{ label: "Live", url: "https://pixume.me" }],
      highlight: "",
    },
    {
      id: "shiftlab",
      name: "Shiftlab",
      year: "2026",
      status: "freelance",
      summary:
        "An AI personal-aesthetics app that reads facial features and body proportions to suggest styling.",
      detail:
        "Built end to end as a freelance project: React and Vite on the front, Gemini for the analysis, Firebase and Cloud Firestore behind it. The hard part was turning a model's output into advice that sounded like a person rather than a confidence score.",
      stack: ["React", "TypeScript", "Vite", "Gemini AI", "Firebase", "Cloud Firestore"],
      links: [{ label: "Live", url: "https://shiftlab.pages.dev/" }],
      highlight: "",
    },
    {
      id: "portfolio",
      name: "This Portfolio",
      year: "2026",
      status: "live",
      summary:
        "A framework-free portfolio with a working terminal built in, deployed globally on AWS Amplify Hosting.",
      detail:
        "Zero dependencies, zero build step, one page. The terminal is a real command parser with history, tab completion and themes that re-skin the live site. Deployed from the CLI using Amplify's manual deployment API.",
      stack: ["HTML", "CSS", "JavaScript", "AWS Amplify", "CloudFront"],
      links: [],
      highlight: "You're in it. Press the backtick key.",
    },
  ],

  achievements: [
    "Two pull requests merged into openclaw — one stopping unbounded session-file growth after compaction, one raising the agent-to-agent turn ceiling, both with regression tests.",
    "AWS Cloud Captain, AWS Cloud Club MLRITM — running AWS foundations and AI sessions on campus.",
    "Google Student Ambassador — mentoring peers on multimodal prompt design and responsible AI.",
    "Co-Lead at AlgoBharat MLRITM, driving blockchain adoption through workshops and real-world builds.",
    "Google Cloud Computing Foundations Certificate, Google AI Essentials, and NVIDIA's Transformer-Based NLP certification.",
    "Author of Haptic.js — nine published npm packages and a DSL compiler, built in the open.",
  ],

  // ---------- `superpower` command ----------
  // These are drawn from your real work — edit the wording to sound like you.
  secrets: [
    "I wrote a compiler for a 200-line language so that one string could buzz a phone, rumble a gamepad, and fake it with audio on iPhone.",
    "Haptic.js has 383 tests and zero dependencies. The tests took longer than the compiler did.",
    "I'm an AWS Cloud Captain and a Google Student Ambassador at the same time. There's no rivalry. Mostly.",
    "Two of my pull requests are merged into openclaw. One of them stops session files growing forever.",
    "My daily driver is an 11th-gen i5 laptop running WSL2 and Docker. Constraints make you write leaner code.",
    "I've shipped on both GCP and AWS and I still argue with myself about which edge network is faster.",
  ],

  // ---------- AWS services used ----------
  awsStack: [
    { service: "AWS Amplify Hosting", use: "Builds and serves this site globally over HTTPS. Deployed via Amplify's manual deployment API from the CLI." },
    { service: "Amazon CloudFront", use: "The CDN behind Amplify — caches the site at edge locations worldwide." },
    { service: "AWS IAM", use: "Credentials authorising app creation and every deployment." },
    { service: "AWS CLI", use: "Created the app, the branch and each deployment without touching the console." },
  ],
};

// top-level `const` doesn't attach to window — the terminal reads it from there.
window.CONTENT = CONTENT;
