# Hackathon submission draft

Paste this into the **Your project** form on the AWS Builder Center hackathon page.
Anything in **[brackets]** still needs your input.

---

## Project title

`>_` — a portfolio you can type into

## Live URL

https://main.d2kch2pensq2r2.amplifyapp.com

## GitHub repository

**[your repo URL once pushed]**

---

## The creative feature

Most portfolios tell you about the person. I wanted mine to let you *interrogate* it.

There's a pill in the bottom-right corner that reads `` press ` to open terminal ``. It pulses on load so you can't miss it, and on phones it reads "tap to open terminal" instead — because phones don't have a backtick key. Open it and you get a shell.

It isn't an animation pretending to be a terminal. It's a real command parser with an argv split, a command table, error handling, and "did you mean…?" suggestions for unknown commands:

| Command | What it does |
|---|---|
| `help` | Lists every public command |
| `whoami` | Identity card — name, role, school, contact |
| `about` | The longer story |
| `skills`, `skills <area>` | Confidence bars per area; drill into one |
| `experience` | Roles, dates, and what I shipped at each |
| `ls projects` | Directory listing |
| `cat <project>` | Reads a project in full |
| `superpower` | Dispenses one random thing you wouldn't guess about me |
| `aws` | The AWS services actually serving the page you're reading |
| `theme dark\|neon\|light` | **Re-skins the whole live site** |
| `open <section>` | Scrolls the page and closes the terminal |
| `history`, `clear`, `exit` | What you'd expect |

Real shell behaviour too: **↑/↓** walks history, **Tab** completes command names *and* project IDs, **Ctrl+L** clears, **Esc** closes. A few commands are deliberately missing from `help` — there are easter eggs for anyone who pokes around.

**The two decisions I'm most pleased with:**

1. **`theme neon` re-skins the entire site, not just the terminal.** The feature reaches outside its own window, so it reads as part of the site rather than a widget sitting on top of it.
2. **Every project card has a `cat <project>` button** that opens the terminal and runs the command for you. A hidden feature nobody finds is the same as no feature — this hands visitors who'd never type into a terminal straight into it.

**It never blocks navigation.** The terminal is entirely opt-in, closes on Esc or a click outside, and the site is fully usable without ever opening it.

---

## AWS services used

| Service | How I used it |
|---|---|
| **AWS Amplify Hosting** | Hosts and serves the site globally over HTTPS. I used Amplify's manual (zip) deployment API from the CLI rather than the console's GitHub connection. |
| **Amazon CloudFront** | The CDN behind Amplify — caches the site at edge locations so it loads fast wherever a judge opens it. |
| **AWS IAM** | The credentials authorising app creation and every deployment. |
| **AWS CLI** | The app, the branch and all eight deployments were driven from the command line: `amplify create-app`, `create-branch`, `create-deployment`, `start-deployment`, `get-job`. |

Region: **ap-south-1 (Mumbai)**. App ID: `d2kch2pensq2r2`.

The whole pipeline is scripted in [`deploy.ps1`](deploy.ps1): package, upload to the presigned URL, start the deployment, poll until the job reports `SUCCEED`.

---

## Technical approach

**No framework, no build step, zero dependencies.** Five files, about 55 KB of source:

```
index.html        semantic markup, six sections
css/styles.css    design tokens + three complete themes
js/content.js     ALL personal data — one file controls the whole site
js/main.js        renders the page from content.js, nav, themes, reveals
js/terminal.js    the creative feature
```

Skipping React was deliberate. A static portfolio doesn't need a virtual DOM, and with no build step there's no toolchain that can break between a change and a live page. It also means anyone who opens DevTools reads actual source instead of a bundle.

`js/content.js` is the single source of truth. The page sections *and* the terminal commands both read from it, so `cat haptic` can never disagree with the Haptic.js card next to it — a class of bug designed out rather than tested for.

---

## What I learned

**Deploying from the CLI taught me more than the console would have.** Clicking through Amplify hides what's happening. Calling `create-deployment`, uploading a zip to a presigned S3 URL, then `start-deployment` and polling `get-job` made the pipeline concrete — Amplify Hosting is, underneath, an artifact store plus a CloudFront distribution. Having previously done static hosting on GCP with Cloud Storage and Cloud CDN, the parallels were obvious and the differences instructive.

**Discoverability is a design problem, not a coding one.** My first version hid the terminal behind a keyboard shortcut and nothing else. Nobody would have found it. The hint pill, the hero button and the `cat` buttons on project cards are all answers to "how does someone who isn't me find this?"

**Mobile broke things I didn't anticipate.** The ASCII banner was hard-coded to 46 columns and overflowed a 375px screen, so I made the output width-aware — it measures the pane and either draws the box or falls back to a plain header. The hint pill had the same bug wearing a different hat: it said "press ` to open terminal" on a device with no backtick key.

---

## Challenges I hit

1. **`const` at the top level of a classic script doesn't attach to `window`.** The page rendered perfectly while every single terminal command returned `Cannot read properties of undefined`. Two files reaching the same data two different ways, and only one of them worked. Fixed with one explicit `window.CONTENT = CONTENT`.

2. **PowerShell's `Compress-Archive` writes backslash path separators into zip entries.** Amplify unpacked my first deployment as flat files literally named `css\styles.css`, so `index.html` returned 200 while every stylesheet and script 404'd — a site that looked deployed and was completely broken. Switching to `tar`, which writes forward slashes, fixed it. The deploy script carries a comment so I never lose that hour again.

3. **Fast typing silently lost commands.** A `busy` flag blocked input while output was still drawing, so anyone typing quickly after opening the terminal had their first command swallowed. I was also focusing the input on a 40ms timer, which dropped the first keystrokes. Output is now queued and focus is synchronous.

4. **I relied on implicit form submission.** The terminal form has no submit button, so Enter depended on browser implicit-submission behaviour, which didn't fire reliably. Handling the Enter key explicitly is one line and has no edge cases.

5. **Flex items don't wrap like text.** The location pill in the hero broke into two awkward columns on mobile because its parts were separate flex items rather than one run of text. Wrapping them in a single span fixed it.

---

## Screenshots

In [`screenshots/`](screenshots/):

| File | Shows |
|---|---|
| `01-hero.jpg` | Landing view with the terminal hint pill visible |
| `02-experience.jpg` | The Experience timeline |
| `03-projects.jpg` | Project cards, each with its own `cat` button |
| `04-terminal-help.jpg` | The terminal open, `help` listing every command |
| `05-terminal-cat-project.jpg` | Clicking `cat haptic` on a card opens the terminal and runs it |
| `06-mobile-hero.jpg` | Responsive landing view at 375px |
| `07-theme-neon.jpg` | After `theme neon` — the whole site re-skinned from the terminal |

**[Still to add: a screenshot of your AWS Amplify console showing the app and its deployment history.]**

---

## Before you submit — checklist

- [ ] Push the repo to GitHub, make it public, and add the URL above
- [ ] Screenshot the Amplify console and drop it in `screenshots/`
- [ ] Read through the `secrets` array in `js/content.js` — those lines get dispensed by `superpower`, so make sure they sound like you
- [ ] Open the live URL on your actual phone and click through it once
- [ ] Decide whether to mention thirumalesh.me anywhere (currently it isn't linked)
- [ ] Confirm the site stays reachable through both judging windows (w/c 9 Nov and w/c 16 Nov)
