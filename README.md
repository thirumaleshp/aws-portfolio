# `>_` Portfolio — AWS Student Builder Challenge

A personal portfolio site with a **working terminal** built into it, deployed globally on **AWS Amplify Hosting**.

**Live site:** https://main.d2kch2pensq2r2.amplifyapp.com

---

## The creative feature: an interactive terminal

A pill in the bottom-right corner reads `` press ` to open terminal `` — that's the visible hint. Pressing the backtick key (or clicking the pill, or the **Open terminal** button in the hero) opens a shell overlay.

It isn't a canned animation. It's a real command parser:

| Command | What it does |
|---|---|
| `help` | Lists every public command |
| `whoami` | Identity card — name, role, school, contact |
| `about` | The longer story |
| `skills` / `skills <area>` | Tech superpowers with confidence bars; drill into one area |
| `experience` | Roles, dates, and what I shipped at each |
| `ls projects` | Directory listing of projects |
| `cat <project>` | Reads a project in full — summary, detail, stack, links |
| `superpower` | Dispenses one random thing you wouldn't guess about me |
| `aws` | The AWS services actually serving the page you're on |
| `achievements` | Things worth mentioning |
| `contact` | Email, GitHub, LinkedIn |
| `theme dark\|neon\|light` | **Re-skins the entire live site**, not just the terminal |
| `open <section>` | Scrolls the page to a section and closes the terminal |
| `history` | Everything typed this session |
| `clear` | Wipes the screen |
| `exit` | Closes the terminal |

Plus real shell behaviour: **↑/↓** walks command history, **Tab** completes command names *and* project IDs, **Ctrl+L** clears, **Esc** closes. A handful of commands are deliberately missing from `help` — there are easter eggs for anyone who pokes around.

**Two details that tie it to the page rather than floating on top of it:**

1. `theme neon` changes the colours of the whole site behind the terminal — the feature has reach beyond its own window.
2. Every project card on the page has a `cat <project>` button that opens the terminal and runs that command for you — so visitors who'd never type into a terminal still discover it.

**It never gets in the way.** The terminal is opt-in, closes on Esc or a click outside, and the site is completely navigable without ever opening it.

---

## AWS services used

| Service | How it's used |
|---|---|
| **AWS Amplify Hosting** | Builds and serves the site globally over HTTPS, with CI/CD on push |
| **Amazon CloudFront** | The CDN behind Amplify — caches the site at edge locations worldwide |
| **AWS IAM** | Credentials used to create and deploy the Amplify app |
| **AWS CLI** | The app was created and deployed from the command line |

---

## Tech choices

**No framework, no build step, zero dependencies.** Four files do the whole job:

```
index.html        semantic markup, six sections
css/styles.css    design tokens + three full themes
js/content.js     ALL personal data — edit this one file to change the site
js/main.js        renders the page from content.js, nav, themes, scroll reveals
js/terminal.js    the creative feature
```

This was a deliberate call. A static site needs no React, and skipping the build step means there is no toolchain that can fail between a `git push` and a live page. It also loads fast and stays readable for anyone who opens DevTools.

`js/content.js` is the single source of truth — the page sections *and* the terminal commands both read from it, so there's no way for the two to drift out of sync.

---

## Accessibility & responsiveness

- Semantic landmarks, a skip link, and visible focus rings throughout
- The terminal is a proper `role="dialog"` with `aria-modal`, focus trapping and focus restoration on close
- Confidence bars carry text alternatives rather than being colour-only
- Respects `prefers-reduced-motion` — typing animations and reveals turn off
- Tested at desktop and 375px mobile widths; the terminal goes full-screen on small viewports

---

## Run it locally

```bash
node dev-server.js
```

Then open http://localhost:4173. `dev-server.js` is a local convenience only — Amplify serves the static files directly and never runs it.

---

## What I learned

Written up in the hackathon submission — the short version: deploying from the CLI taught me far more about what Amplify actually does than clicking through the console would have, and building the terminal forced me to think about discoverability. A hidden feature nobody finds is the same as no feature, which is why the hint pill pulses on load and why the project cards hand you into the terminal.
