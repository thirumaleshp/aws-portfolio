/* ============================================================
   main.js — renders the page from CONTENT, plus nav/theme/reveal.
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  /* ---------- simple text bindings ---------- */
  $$("[data-bind]").forEach((n) => {
    const v = CONTENT[n.dataset.bind];
    if (v) n.textContent = v;
  });
  document.title = `${CONTENT.name} — ${CONTENT.role}`;

  /* ---------- hero: typed role ---------- */
  (function typeRole() {
    const target = $("#typedRole");
    if (!target) return;
    const text = CONTENT.role;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.textContent = text;
      return;
    }
    let i = 0;
    (function tick() {
      target.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 48);
    })();
  })();

  /* ---------- hero stats ---------- */
  (function stats() {
    const host = $("#heroStats");
    if (!host) return;
    const data = [
      { k: "projects", v: CONTENT.projects.length },
      { k: "skill areas", v: CONTENT.superpowers.length },
      { k: "aws services", v: CONTENT.awsStack.length },
      { k: "frameworks used", v: "0" },
    ];
    data.forEach(({ k, v }) => {
      const d = el("div", "hero__stat");
      d.append(el("dt", null, esc(k)), el("dd", null, esc(v)));
      host.append(d);
    });
  })();

  /* ---------- about ---------- */
  (function about() {
    const text = $("#aboutText");
    if (text) CONTENT.about.forEach((p) => text.append(el("p", null, esc(p))));

    const kv = $("#aboutKv");
    if (!kv) return;
    const rows = [
      ["name", CONTENT.fullName],
      ["role", CONTENT.role],
      ["study", CONTENT.course],
      ["school", CONTENT.school],
      ["based", CONTENT.location],
      ["email", `<a href="mailto:${esc(CONTENT.email)}">${esc(CONTENT.email)}</a>`],
    ];
    rows.forEach(([k, v]) => {
      if (!v) return;
      const d = el("div");
      d.append(el("dt", null, esc(k)), el("dd", null, v));
      kv.append(d);
    });
  })();

  /* ---------- superpowers ---------- */
  (function powers() {
    const host = $("#powers");
    if (!host) return;
    CONTENT.superpowers.forEach((p) => {
      const bars = Array.from({ length: 5 }, (_, i) =>
        `<span class="power__bar${i < p.level ? " is-on" : ""}"></span>`
      ).join("");

      host.append(
        el(
          "article",
          "power reveal",
          `<div class="power__head">
             <span class="power__icon" aria-hidden="true">${esc(p.icon)}</span>
             <h3 class="power__name">${esc(p.name)}</h3>
             <span class="power__bars" role="img" aria-label="Confidence ${p.level} out of 5">${bars}</span>
           </div>
           <p class="power__blurb">${esc(p.blurb)}</p>
           <ul class="power__items">${p.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
        )
      );
    });
  })();

  /* ---------- experience ---------- */
  (function experience() {
    const host = $("#experience-list");
    if (!host || !CONTENT.experience) return;

    CONTENT.experience.forEach((x) => {
      const org = x.url
        ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.org)}</a>`
        : esc(x.org);

      host.append(
        el(
          "li",
          "xp__item reveal",
          `<div class="xp__head">
             <h3 class="xp__role">${esc(x.title)}</h3>
             <span class="xp__date">${esc(x.date)}</span>
           </div>
           <p class="xp__org">${org}</p>
           <ul class="xp__bullets">${x.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
        )
      );
    });
  })();

  /* ---------- projects ---------- */
  (function projects() {
    const host = $("#projects-grid");
    if (!host) return;

    CONTENT.projects.forEach((p) => {
      const links = (p.links || [])
        .map((l) => `<a class="proj__link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
        .join("");

      const card = el(
        "article",
        "proj reveal",
        `<div class="proj__top">
           <h3 class="proj__name">${esc(p.name)}</h3>
           <span class="proj__status">${esc(p.status)}</span>
           <span class="proj__year">${esc(p.year)}</span>
         </div>
         <p class="proj__summary">${esc(p.summary)}</p>
         <ul class="proj__stack">${(p.stack || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
         <div class="proj__foot">
           ${links}
           <button class="proj__cat" type="button" data-cat="${esc(p.id)}">cat ${esc(p.id)}</button>
           ${p.highlight ? `<span class="proj__hl">${esc(p.highlight)}</span>` : ""}
         </div>`
      );
      host.append(card);
    });

    // "cat <project>" buttons hand off to the terminal — ties the feature to the page
    host.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      window.dispatchEvent(
        new CustomEvent("terminal:run", { detail: `cat ${btn.dataset.cat}` })
      );
    });
  })();

  /* ---------- achievements ---------- */
  (function achievements() {
    const host = $("#achievements");
    if (!host) return;
    CONTENT.achievements.forEach((a) => host.append(el("li", "reveal", esc(a))));
  })();

  /* ---------- aws stack ---------- */
  (function aws() {
    const host = $("#awsStack");
    if (!host) return;
    CONTENT.awsStack.forEach((a) =>
      host.append(
        el(
          "article",
          "awsc reveal",
          `<h3 class="awsc__name">${esc(a.service)}</h3><p class="awsc__use">${esc(a.use)}</p>`
        )
      )
    );
  })();

  /* ---------- contact ---------- */
  (function contact() {
    const host = $("#contactLinks");
    if (!host) return;
    const links = [
      { icon: "@", label: "Email", url: `mailto:${CONTENT.email}` },
      { icon: "{}", label: "GitHub", url: CONTENT.github },
      { icon: "in", label: "LinkedIn", url: CONTENT.linkedin },
      { icon: "x", label: "X / Twitter", url: CONTENT.twitter },
    ];
    links.forEach((l) => {
      if (!l.url) return;
      const a = el("a", "contact__link", `<span>${esc(l.icon)}</span><span>${esc(l.label)}</span>`);
      a.href = l.url;
      if (!l.url.startsWith("mailto:")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      host.append(a);
    });
  })();

  /* ---------- nav: stuck shadow, burger, active link ---------- */
  (function nav() {
    const bar = $("#nav");
    const burger = $("#navBurger");
    const links = $(".nav__links");

    const onScroll = () => bar.classList.toggle("is-stuck", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    burger?.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    links?.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        burger?.setAttribute("aria-expanded", "false");
      }
    });

    // highlight the section you're looking at
    const anchors = $$(".nav__links a");
    const sections = anchors
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            anchors.forEach((a) =>
              a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`)
            );
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((s) => io.observe(s));
    }
  })();

  /* ---------- theme ---------- */
  const THEMES = ["dark", "neon", "light"];

  function setTheme(name, persist = true) {
    if (!THEMES.includes(name)) return false;
    document.documentElement.dataset.theme = name;
    const label = $("#themeName");
    if (label) label.textContent = name;
    if (persist) {
      try { localStorage.setItem("theme", name); } catch (_) {}
    }
    return true;
  }

  try {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved, false);
  } catch (_) {}
  $("#themeName") && ($("#themeName").textContent = document.documentElement.dataset.theme);

  $("#themeToggle")?.addEventListener("click", () => {
    const i = THEMES.indexOf(document.documentElement.dataset.theme);
    setTheme(THEMES[(i + 1) % THEMES.length]);
  });

  // the terminal's `theme` command reaches the live site through this
  window.PORTFOLIO = { setTheme, THEMES, CONTENT };

  /* ---------- reveal on scroll ---------- */
  (function reveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, idx) => {
          if (!en.isIntersecting) return;
          setTimeout(() => en.target.classList.add("is-in"), idx * 70);
          io.unobserve(en.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((i) => io.observe(i));
  })();
})();
