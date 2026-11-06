/* ============================================================
   content.js — EVERY piece of personal data on this site.
   Edit this one file to change the whole portfolio.
   Lines marked TODO are placeholders waiting on real details.
   ============================================================ */

const CONTENT = {
  // ---------- Identity ----------
  name: "Thirumalesh",
  // TODO: confirm full name
  fullName: "Thirumalesh",
  handle: "thiru",
  role: "Student Developer & Cloud Builder",
  tagline: "I build things on the internet and take them apart to see how they work.",
  location: "India", // TODO: city
  school: "TODO: your college / university",
  course: "TODO: your degree & year",
  email: "thirumalesh9182@gmail.com",
  github: "https://github.com/", // TODO: your GitHub profile URL
  githubUser: "TODO-github-username",
  linkedin: "", // TODO: LinkedIn URL (leave "" to hide)

  // ---------- About Me ----------
  about: [
    "I'm a student developer who learns by shipping. Most of what I know came from breaking something, reading the error, and trying again until it worked.",
    "Right now I'm deep in cloud and web development — figuring out how real applications get built, deployed, and kept alive once actual people start using them.",
    "This site is part of that: built from scratch with no framework, deployed on AWS, and hiding a terminal that you can actually type into.",
  ],

  // ---------- Tech Superpowers ----------
  // level: 1-5, used for the signal bars
  superpowers: [
    {
      name: "Frontend",
      icon: "◆",
      level: 4,
      items: ["HTML5", "CSS3", "JavaScript (ES6+)", "Responsive design", "Accessibility"],
      blurb: "Hand-written, framework-free when the job doesn't need one.",
    },
    {
      name: "Cloud & AWS",
      icon: "▲",
      level: 3,
      items: ["AWS Amplify Hosting", "IAM", "S3", "CloudFront", "AWS CLI"],
      blurb: "Deploying real things to real infrastructure, not just localhost.",
    },
    {
      name: "Languages",
      icon: "■",
      level: 4,
      items: ["Python", "JavaScript", "Java", "SQL"],
      blurb: "Python for thinking, JavaScript for shipping.",
    },
    {
      name: "Tooling",
      icon: "●",
      level: 4,
      items: ["Git & GitHub", "VS Code", "CLI / PowerShell", "npm"],
      blurb: "The terminal is where the work actually happens.",
    },
  ],

  // ---------- Projects & Achievements ----------
  // id is what `cat <id>` uses in the terminal — keep it lowercase, no spaces
  projects: [
    {
      id: "portfolio",
      name: "This Portfolio",
      year: "2026",
      status: "live",
      summary:
        "A framework-free portfolio with a working terminal built in, deployed globally on AWS Amplify Hosting.",
      detail:
        "Zero dependencies, zero build step, one page. The terminal is a real command parser with history, tab completion and themes that re-skin the live site. Built for the AWS Student Builder Challenge.",
      stack: ["HTML", "CSS", "JavaScript", "AWS Amplify"],
      links: [],
      highlight: "Try the terminal — press the backtick key.",
    },
    {
      id: "TODO-project-2",
      name: "TODO: Project Two",
      year: "2026",
      status: "shipped",
      summary: "TODO: one line on what it does and who it's for.",
      detail: "TODO: what you built, what was hard, what you'd do differently.",
      stack: ["TODO", "TODO"],
      links: [],
      highlight: "",
    },
    {
      id: "TODO-project-3",
      name: "TODO: Project Three",
      year: "2025",
      status: "learning project",
      summary: "TODO: one line on what it does.",
      detail: "TODO: the story of building it.",
      stack: ["TODO"],
      links: [],
      highlight: "",
    },
  ],

  achievements: [
    "TODO: a certification, award, hackathon, or course you finished",
    "TODO: something you're proud of that isn't code",
  ],

  // ---------- `superpower` command: random reveals ----------
  secrets: [
    "I debug best at 2am. No idea why. The bugs seem friendlier.",
    "TODO: a genuinely surprising fact about you",
    "TODO: a hobby nobody expects",
    "TODO: the weirdest thing you've ever built",
    "My first program was a calculator that got the answers wrong. I kept it.",
  ],

  // ---------- AWS services used (for the judges) ----------
  awsStack: [
    { service: "AWS Amplify Hosting", use: "Builds and serves the site globally over HTTPS with CI/CD on every git push." },
    { service: "Amazon CloudFront", use: "The CDN behind Amplify — caches the site at edge locations worldwide." },
    { service: "AWS IAM", use: "Scoped credentials used to create and deploy the Amplify app from the CLI." },
    { service: "AWS CLI", use: "Created the app and shipped the deployment without touching the console." },
  ],
};

// top-level `const` doesn't attach to window — the terminal reads it from there.
window.CONTENT = CONTENT;
