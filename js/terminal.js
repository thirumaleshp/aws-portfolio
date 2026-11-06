/* ============================================================
   terminal.js — the creative feature.

   A real-ish shell: command parsing, argv, history (↑/↓),
   tab completion, line-by-line typed output, and commands that
   reach out and change the live page.
   ============================================================ */
(function () {
  "use strict";

  const term    = document.getElementById("terminal");
  const body    = document.getElementById("termBody");
  const form    = document.getElementById("termForm");
  const input   = document.getElementById("termInput");
  const hint    = document.getElementById("hintPill");
  if (!term || !body || !form || !input) return;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- output plumbing ---------------- */

  let queue = [];
  let draining = false;

  function line(text = "", cls = "") {
    queue.push({ text, cls });
    drain();
  }
  const sp = () => line("", "tl--sp");

  function writeNow({ text, cls }) {
    const p = document.createElement("p");
    p.className = "tl" + (cls ? " " + cls : "");
    p.innerHTML = text === "" ? "&nbsp;" : text;
    body.append(p);
    body.scrollTop = body.scrollHeight;
  }

  function drain() {
    if (draining) return;
    draining = true;

    const step = () => {
      const item = queue.shift();
      if (!item) {
        draining = false;
        return;
      }
      writeNow(item);
      if (reduceMotion) step();
      else setTimeout(step, 14);
    };
    step();
  }

  /* ---------------- helpers for pretty output ---------------- */

  const C = () => window.CONTENT || {};

  function kv(k, v, pad = 12) {
    return `<span class="tl--acc">${esc(k.padEnd(pad))}</span>${esc(v)}`;
  }

  // how many monospace columns fit in the output pane right now
  function cols() {
    const w = (body.clientWidth || 600) - 32;
    return Math.max(22, Math.min(54, Math.floor(w / 8.3)));
  }

  function rule(label) {
    const dash = "─".repeat(Math.max(2, cols() - label.length - 4));
    return `<span class="tl--box">── ${esc(label)} ${dash}</span>`;
  }

  function bars(level) {
    return `<span class="tl--acc">${"█".repeat(level)}</span><span class="tl--dim">${"░".repeat(5 - level)}</span>`;
  }

  function findProject(id) {
    if (!id) return null;
    const q = id.toLowerCase();
    return (
      C().projects.find((p) => p.id.toLowerCase() === q) ||
      C().projects.find((p) => p.name.toLowerCase() === q) ||
      C().projects.find((p) => p.id.toLowerCase().includes(q)) ||
      null
    );
  }

  /* ---------------- commands ---------------- */

  const commands = {
    help: {
      desc: "list everything you can type here",
      run() {
        line(rule("available commands"));
        const names = Object.keys(commands).filter((n) => !commands[n].hidden).sort();
        names.forEach((n) => line(`  ${kv(n, commands[n].desc, 14)}`));
        sp();
        line(`<span class="tl--dim">  ↑/↓ history · Tab completes · Esc closes · a few commands aren't on this list</span>`);
      },
    },

    whoami: {
      desc: "who is behind this site",
      run() {
        const c = C();
        line(rule("identity"));
        line(kv("name", c.fullName));
        line(kv("role", c.role));
        if (c.course) line(kv("studying", c.course));
        if (c.school) line(kv("school", c.school));
        line(kv("based in", c.location));
        line(kv("email", c.email));
        sp();
        line(`<span class="tl--dim">${esc(c.tagline)}</span>`);
      },
    },

    about: {
      desc: "the longer version",
      run() {
        line(rule("about"));
        C().about.forEach((p) => {
          line(`  ${esc(p)}`, "tl--dim");
          sp();
        });
      },
    },

    skills: {
      desc: "tech superpowers, with confidence levels",
      run(args) {
        const c = C();
        if (args[0]) {
          const q = args[0].toLowerCase();
          const s = c.superpowers.find((x) => x.name.toLowerCase().includes(q));
          if (!s) return line(`skills: no area matching "${esc(args[0])}"`, "tl--err");
          line(rule(s.name.toLowerCase()));
          line(`  ${bars(s.level)} <span class="tl--dim">${s.level}/5</span>`);
          line(`  ${esc(s.blurb)}`, "tl--dim");
          sp();
          s.items.forEach((i) => line(`  <span class="tl--acc">·</span> ${esc(i)}`));
          return;
        }
        line(rule("tech superpowers"));
        c.superpowers.forEach((s) => {
          line(`  ${bars(s.level)}  <span class="tl--acc2">${esc(s.name)}</span>`);
          line(`           <span class="tl--dim">${esc(s.items.join(", "))}</span>`);
        });
        sp();
        line(`<span class="tl--dim">  try: skills cloud</span>`);
      },
    },

    ls: {
      desc: "list projects",
      run(args) {
        const what = (args[0] || "projects").replace(/^\.?\//, "").replace(/\/$/, "");
        if (what === "skills") return commands.skills.run([]);
        if (what !== "projects" && what !== "." && what !== "~") {
          return line(`ls: cannot access '${esc(what)}': No such directory`, "tl--err");
        }
        line(rule("~/projects"));
        C().projects.forEach((p) => {
          line(
            `  <span class="tl--acc">${esc(p.id.padEnd(18))}</span>` +
            `<span class="tl--dim">${esc(p.year)}  ${esc(p.status)}</span>`
          );
        });
        sp();
        line(`<span class="tl--dim">  ${C().projects.length} items · read one with: cat &lt;name&gt;</span>`);
      },
    },

    cat: {
      desc: "read a project in full",
      run(args) {
        if (!args[0]) {
          line("cat: missing operand", "tl--err");
          return line(`<span class="tl--dim">usage: cat &lt;project&gt;   (see: ls projects)</span>`);
        }
        const p = findProject(args[0]);
        if (!p) {
          line(`cat: ${esc(args[0])}: No such project`, "tl--err");
          return line(`<span class="tl--dim">known: ${esc(C().projects.map((x) => x.id).join(", "))}</span>`);
        }
        line(rule(p.id));
        line(`  <span class="tl--acc2">${esc(p.name)}</span> <span class="tl--dim">· ${esc(p.year)} · ${esc(p.status)}</span>`);
        sp();
        line(`  ${esc(p.summary)}`);
        sp();
        if (p.detail) {
          line(`  ${esc(p.detail)}`, "tl--dim");
          sp();
        }
        line(`  ${kv("stack", (p.stack || []).join(" · "), 8)}`);
        (p.links || []).forEach((l) =>
          line(`  ${kv(l.label.toLowerCase(), "", 8)}<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.url)}</a>`)
        );
        if (p.highlight) {
          sp();
          line(`  <span class="tl--warn">→ ${esc(p.highlight)}</span>`);
        }
      },
    },

    projects: { desc: "same as: ls projects", run: () => commands.ls.run(["projects"]) },

    superpower: {
      desc: "dispense one thing you wouldn't guess about me",
      run() {
        const pool = C().secrets || [];
        if (!pool.length) return line("superpower: nothing loaded", "tl--err");
        const pick = pool[Math.floor(Math.random() * pool.length)];
        line(rule("superpower dispensed"));
        line(`  <span class="tl--acc">◆</span>  ${esc(pick)}`);
        sp();
        line(`<span class="tl--dim">  run it again — there are ${pool.length} in the machine.</span>`);
      },
    },

    aws: {
      desc: "the infrastructure serving this page",
      run() {
        line(rule("aws services in use"));
        C().awsStack.forEach((a) => {
          line(`  <span class="tl--acc2">▲ ${esc(a.service)}</span>`);
          line(`    <span class="tl--dim">${esc(a.use)}</span>`);
        });
        sp();
        line(`<span class="tl--dim">  this page was fetched from a CloudFront edge near you.</span>`);
      },
    },

    experience: {
      desc: "where I've worked and what I shipped",
      run() {
        line(rule("experience"));
        (C().experience || []).forEach((x) => {
          line(`  <span class="tl--acc2">${esc(x.title)}</span>`);
          line(`  <span class="tl--acc">${esc(x.org)}</span> <span class="tl--dim">· ${esc(x.date)}</span>`);
          x.bullets.forEach((b) => line(`    <span class="tl--dim">- ${esc(b)}</span>`));
          sp();
        });
      },
    },

    achievements: {
      desc: "things worth mentioning",
      run() {
        line(rule("achievements"));
        C().achievements.forEach((a) => line(`  <span class="tl--acc">✦</span> ${esc(a)}`));
      },
    },

    contact: {
      desc: "how to reach me",
      run() {
        const c = C();
        line(rule("contact"));
        line(`  ${kv("email", "", 10)}<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`);
        if (c.github) line(`  ${kv("github", "", 10)}<a href="${esc(c.github)}" target="_blank" rel="noopener">${esc(c.github)}</a>`);
        if (c.linkedin) line(`  ${kv("linkedin", "", 10)}<a href="${esc(c.linkedin)}" target="_blank" rel="noopener">${esc(c.linkedin)}</a>`);
        if (c.twitter) line(`  ${kv("x", "", 10)}<a href="${esc(c.twitter)}" target="_blank" rel="noopener">${esc(c.twitter)}</a>`);
        sp();
        line(`<span class="tl--dim">  open to internships — say hi.</span>`);
      },
    },

    theme: {
      desc: "re-skin this entire site: dark | neon | light",
      run(args) {
        const api = window.PORTFOLIO;
        if (!api) return line("theme: site api unavailable", "tl--err");
        if (!args[0]) {
          line(`  ${kv("current", document.documentElement.dataset.theme)}`);
          return line(`  ${kv("available", api.THEMES.join(" · "))}`);
        }
        const ok = api.setTheme(args[0].toLowerCase());
        if (!ok) {
          line(`theme: unknown theme '${esc(args[0])}'`, "tl--err");
          return line(`<span class="tl--dim">available: ${esc(api.THEMES.join(", "))}</span>`);
        }
        line(`  theme set to <span class="tl--acc">${esc(args[0].toLowerCase())}</span> — look behind this window.`);
      },
    },

    open: {
      desc: "jump the page to a section",
      run(args) {
        const map = {
          about: "#about", skills: "#superpowers", superpowers: "#superpowers",
          experience: "#experience", projects: "#projects",
          aws: "#aws", contact: "#contact", top: "#top",
        };
        const key = (args[0] || "").toLowerCase();
        if (!map[key]) {
          line(`open: unknown section '${esc(args[0] || "")}'`, "tl--err");
          return line(`<span class="tl--dim">sections: ${Object.keys(map).join(", ")}</span>`);
        }
        line(`  navigating to <span class="tl--acc">${esc(key)}</span>…`);
        document.querySelector(map[key])?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        setTimeout(close, 480);
      },
    },

    history: {
      desc: "what you've typed this session",
      run() {
        if (!history.length) return line("  (nothing yet)", "tl--dim");
        line(rule("history"));
        history.forEach((h, i) => line(`  <span class="tl--dim">${String(i + 1).padStart(3)}</span>  ${esc(h)}`));
      },
    },

    clear: { desc: "wipe the screen", run() { queue = []; body.innerHTML = ""; } },

    echo: { desc: "say it back", hidden: true, run: (a) => line("  " + esc(a.join(" "))) },

    date: {
      desc: "current time, your clock",
      hidden: true,
      run: () => line("  " + esc(new Date().toString())),
    },

    exit: { desc: "close the terminal", run() { line("  logout"); setTimeout(close, 260); } },

    /* ---- easter eggs (deliberately not in help) ---- */

    sudo: {
      hidden: true,
      desc: "nice try",
      run(args) {
        if (args.join(" ").includes("rm -rf")) {
          line("  <span class='tl--err'>sudo: absolutely not.</span>");
          return line("  <span class='tl--dim'>this portfolio took effort.</span>");
        }
        line("  <span class='tl--warn'>[sudo] password for visitor:</span> <span class='tl--dim'>··········</span>");
        line("  <span class='tl--err'>visitor is not in the sudoers file. This incident has been reported.</span>");
        sp();
        line("  <span class='tl--dim'>(reported to me. I'm flattered.)</span>");
      },
    },

    vim: {
      hidden: true,
      desc: "",
      run() {
        line("  <span class='tl--warn'>you're in vim now.</span>");
        line("  <span class='tl--dim'>just kidding. :q works here, unlike real life.</span>");
      },
    },

    coffee: {
      hidden: true,
      desc: "",
      run() {
        line("  <span class='tl--acc'>brewing…</span>");
        line("  <span class='tl--err'>HTTP 418 — I'm a teapot.</span>");
      },
    },

    hire: {
      hidden: true,
      desc: "",
      run() {
        line(rule("availability"));
        line("  <span class='tl--acc'>STATUS: open to internships ✓</span>");
        line(`  <span class="tl--dim">fastest route:</span> <a href="mailto:${esc(C().email)}">${esc(C().email)}</a>`);
      },
    },

    ":q": { hidden: true, desc: "", run() { line("  nothing to quit. try: exit", "tl--dim"); } },
  };

  /* ---------------- banner ---------------- */

  function banner() {
    const c = C();
    const who = (c.name || "portfolio").toLowerCase();
    const title = `${who} :: interactive shell v1.0`;
    const w = cols();

    if (w >= 46) {
      // wide enough for the boxed banner
      const inner = w - 4;
      const pad = Math.max(1, inner - title.length - 3);
      line(`<span class="tl--acc">  ╭${"─".repeat(inner)}╮</span>`);
      line(
        `<span class="tl--acc">  │</span>   <span class="tl--acc2">${esc(who)}</span> :: interactive shell v1.0` +
        `${" ".repeat(pad)}<span class="tl--acc">│</span>`
      );
      line(`<span class="tl--acc">  ╰${"─".repeat(inner)}╯</span>`);
    } else {
      // narrow screens: no box art, it just overflows
      line(`<span class="tl--acc2">${esc(who)}</span> <span class="tl--dim">:: shell v1.0</span>`);
      line(`<span class="tl--acc">${"─".repeat(w)}</span>`);
    }
    sp();
    line(`  Welcome. This is a real command parser, not a gimmick.`, "tl--dim");
    sp();
    line(`  Start with <span class="tl--acc">help</span>, or try <span class="tl--acc">whoami</span> · <span class="tl--acc">ls projects</span> · <span class="tl--acc">superpower</span> · <span class="tl--acc">theme neon</span>`);
    sp();
  }

  /* ---------------- open / close ---------------- */

  let lastFocus = null;

  function open() {
    if (!term.hidden) return;
    lastFocus = document.activeElement;
    term.hidden = false;
    document.body.style.overflow = "hidden";
    hint?.classList.add("is-hidden");
    input.focus();
    if (!body.childElementCount) banner();
  }

  function close() {
    if (term.hidden) return;
    term.hidden = true;
    document.body.style.overflow = "";
    hint?.classList.remove("is-hidden");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  document.querySelectorAll("[data-open-terminal]").forEach((b) =>
    b.addEventListener("click", open)
  );
  document.querySelectorAll("[data-close-terminal]").forEach((b) =>
    b.addEventListener("click", close)
  );

  /* ---------------- history + completion ---------------- */

  const history = [];
  let hIndex = -1;

  function completions(prefix) {
    const p = prefix.toLowerCase();
    const words = prefix.split(/\s+/);

    // completing an argument of cat → project ids
    if (words.length > 1 && words[0] === "cat") {
      const frag = words[words.length - 1].toLowerCase();
      return C()
        .projects.map((x) => x.id)
        .filter((id) => id.toLowerCase().startsWith(frag))
        .map((id) => words.slice(0, -1).concat(id).join(" "));
    }
    if (words.length > 1 && words[0] === "theme") {
      const frag = words[words.length - 1].toLowerCase();
      return (window.PORTFOLIO?.THEMES || [])
        .filter((t) => t.startsWith(frag))
        .map((t) => "theme " + t);
    }
    return Object.keys(commands).filter((n) => n.startsWith(p) && !n.startsWith(":"));
  }

  /* ---------------- the prompt loop ---------------- */

  function runLine(raw) {
    const text = raw.trim();

    line(
      `<span class="p">thiru@portfolio</span><span class="tl--dim">:~$</span> ${esc(text)}`,
      "tl--cmd"
    );

    if (!text) return;

    history.push(text);
    hIndex = history.length;

    const [name, ...args] = text.split(/\s+/);
    const cmd = commands[name.toLowerCase()];

    if (!cmd) {
      const near = Object.keys(commands).filter(
        (n) => !commands[n].hidden && n.startsWith(name.toLowerCase()[0] || "")
      );
      line(`${esc(name)}: command not found`, "tl--err");
      line(
        `<span class="tl--dim">try <span class="tl--acc">help</span>${
          near.length ? ` — or did you mean: ${esc(near.slice(0, 3).join(", "))}?` : ""
        }</span>`
      );
      return;
    }

    try {
      cmd.run(args);
    } catch (err) {
      line(`${esc(name)}: ${esc(err.message)}`, "tl--err");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    runLine(v);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = input.value;
      input.value = "";
      runLine(v);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex] || "";
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = hIndex === history.length ? "" : history[hIndex];
    } else if (e.key === "Tab") {
      e.preventDefault();
      const list = completions(input.value.trim());
      if (list.length === 1) {
        input.value = list[0] + " ";
      } else if (list.length > 1) {
        line(`<span class="tl--dim">  ${esc(list.join("   "))}</span>`);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      commands.clear.run([]);
    } else if (e.key === "c" && e.ctrlKey && !input.selectionEnd) {
      input.value = "";
    }
  });

  /* ---------------- global keys ---------------- */

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !term.hidden) {
      close();
      return;
    }
    if (term.hidden && (e.key === "`" || e.key === "~")) {
      const t = e.target;
      const typing =
        t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (typing) return;
      e.preventDefault();
      open();
    }
  });

  // keep focus inside the dialog
  term.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && e.target !== input) {
      e.preventDefault();
      input.focus();
    }
  });

  body.addEventListener("click", (e) => {
    if (e.target.tagName !== "A") input.focus();
  });

  /* ---------------- page → terminal bridge ---------------- */

  window.addEventListener("terminal:run", (e) => {
    open();
    const cmd = e.detail;
    setTimeout(() => runLine(cmd), term.hidden ? 0 : 120);
  });

  /* hide the hint pill once the visitor has clearly found it */
  try {
    if (localStorage.getItem("term-seen")) hint?.style.setProperty("animation", "hintIn .4s both");
    document.querySelectorAll("[data-open-terminal]").forEach((b) =>
      b.addEventListener("click", () => {
        try { localStorage.setItem("term-seen", "1"); } catch (_) {}
      })
    );
  } catch (_) {}
})();
