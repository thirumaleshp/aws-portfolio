# Hackathon submission draft

Paste this into the **Your project** form on the AWS Builder Center hackathon page.
Anything in **[brackets]** still needs your input.

---

## Project title

`>_` — a portfolio with a terminal inside it

## Live URL

https://main.d2kch2pensq2r2.amplifyapp.com

## GitHub repository

**[your repo URL once pushed]**

---

## The creative feature

Most portfolios tell you about the person. I wanted mine to let you *interrogate* it.

There's a pill in the bottom-right corner that reads `` press ` to open terminal ``. It pulses once on load so you can't miss it, and on phones it says "tap to open terminal" instead, since phones have no backtick key. Press it and a shell overlay opens.

It isn't an animation pretending to be a terminal. It's a real command parser with an argv split, a command table, error handling and unknown-command suggestions:

| Command | What it does |
|---|---|
| `help` | Lists every public command |
| `whoami` | Identity card — name, role, school, contact |
| `about` | The longer story |
| `skills`, `skills <area>` | Confidence bars per area; drill into one |
| `ls projects` | Directory listing |
| `cat <project>` | Reads a project in full |
| `superpower` | Dispenses one random thing you wouldn't guess about me |
| `aws` | The AWS services actually serving the page you're reading |
| `theme dark\|neon\|light` | **Re-skins the whole live site** |
| `open <section>` | Scrolls the page and closes the terminal |
| `history`, `clear`, `exit` | What you'd expect |

Real shell behaviour too: **↑/↓** walks history, **Tab** completes command names *and* project IDs, **Ctrl+L** clears, **Esc** closes. A few commands are deliberately left out of `help` — there are easter eggs for anyone who pokes around.

**Two decisions I'm most pleased with:**

1. **`theme neon` re-skins the entire site, not just the terminal.** The feature reaches outside its own window, so it reads as part of the site rather than a widget dropped on top of it.
2. **Every project card on the page has a `cat <project>` button** that opens the terminal and runs the command for you. A hidden feature nobody finds is the same as no feature — this hands non-technical visitors into it without them having to type anything.

**It never blocks navigation.** The terminal is entirely opt-in, closes on Esc or a click outside, and the site is fully usable without ever opening it.

---

## AWS services used

| Service | How I used it |
|---|---|
| **AWS Amplify Hosting** | Hosts and serves the site globally over HTTPS. I used Amplify's manual (zip) deployment API via the CLI rather than the console's GitHub connection. |
| **Amazon CloudFront** | The CDN behind Amplify — caches the site at edge locations so it loads fast regardless of where a judge opens it. |
| **AWS IAM** | The credentials used to create the app and authorise deployments. |
| **AWS CLI** | The app, the branch and every deployment were created from the command line — `amplify create-app`, `create-branch`, `create-deployment`, `start-deployment`, `get-job`. |

Region: **ap-south-1 (Mumbai)**. App ID: `d2kch2pensq2r2`.

The whole deploy is scripted in [`deploy.ps1`](deploy.ps1) — package, upload, start, poll until the job reports `SUCCEED`.

---

## Technical approach

**No framework, no build step, zero dependencies.** Five files:

```
index.html        semantic markup, five sections
css/styles.css    design tokens + three complete themes
js/content.js     ALL personal data — one file controls the whole site
js/main.js        renders the page from content.js, nav, themes, reveals
js/terminal.js    the creative feature
```

Skipping React was deliberate. A static portfolio doesn't need a virtual DOM, and with no build step there is no toolchain that can break between a change and a live page. The whole site is under 55 KB of source.

`js/content.js` is the single source of truth. The page sections *and* the terminal commands both read from it, so `cat portfolio` can never disagree with the project card next to it — a class of bug I designed out rather than tested for.

---

## What I learned

**Deploying from the CLI taught me far more than the console would have.** Clicking through Amplify hides what's happening; calling `create-deployment`, uploading a zip to a presigned S3 URL, then `start-deployment` and polling `get-job` made the pipeline concrete. I now understand that Amplify Hosting is, underneath, an artifact store plus a CloudFront distribution.

**Discoverability is a design problem, not a coding one.** My first version had the terminal behind a keyboard shortcut and nothing else. Nobody would ever have found it. The hint pill, the hero button, and the `cat` buttons on project cards are all answers to "how does someone who isn't me find this?"

**Mobile broke things I didn't expect.** The terminal's ASCII banner was hard-coded to 46 columns, which overflowed on a 375px screen. I made the output width-aware — it measures the pane and either draws the box or falls back to a plain header. The hint pill had the same problem in a different form: it said "press ` to open terminal" on a device with no backtick key.

---

## Challenges I hit

1. **`const` at the top level of a script doesn't attach to `window`.** My page rendered perfectly while every terminal command returned `Cannot read properties of undefined`. Two files, two different ways of reaching the same data, and only one of them worked. One explicit `window.CONTENT = CONTENT` fixed it.

2. **PowerShell's `Compress-Archive` writes backslash path separators into zip entries.** Amplify unpacked my first deployment as flat files named `css\styles.css`, so `index.html` returned 200 while every stylesheet and script 404'd. Switching to `tar`, which writes forward slashes, fixed it — and the deploy script now carries a comment so I don't repeat it.

3. **Fast typing lost commands.** I had a `busy` flag blocking input while output was still drawing, so anyone typing quickly after opening the terminal had their first command silently swallowed. I also focused the input on a 40ms timer, which lost the first keystrokes. Both are gone — output is queued, and focus is synchronous.

4. **Relying on implicit form submission.** The terminal form had no submit button, so Enter depended on the browser's implicit-submission behaviour, which didn't fire reliably. Handling the Enter key explicitly is one line and has no edge cases.

---

## Screenshots

Attached in [`screenshots/`](screenshots/):

| File | Shows |
|---|---|
| `01-hero-dark.jpg` | The landing view with the terminal hint pill visible |
| `02-terminal-help.jpg` | The terminal open, `help` listing every command |
| `03-theme-neon.jpg` | After `theme neon` — the whole site re-skinned from the terminal |
| `04-mobile-terminal.jpg` | The terminal full-screen at 375px |
| `05-mobile-hero.jpg` | The responsive landing view on mobile |

**[Still to add: a screenshot of your AWS Amplify console showing the app and its successful deployments.]**

---

## Before you submit — checklist

- [ ] Fill in every `TODO` in `js/content.js` (school, course, real projects, achievements, secrets, GitHub/LinkedIn URLs)
- [ ] Re-run `.\deploy.ps1` after editing content
- [ ] Push the repo to GitHub and make it public
- [ ] Add the GitHub URL above
- [ ] Screenshot the Amplify console and add it to `screenshots/`
- [ ] Open the live URL on your actual phone and click through it once
- [ ] Confirm the site is reachable and stays up through the judging window
