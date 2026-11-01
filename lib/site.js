/* site.js: the chrome every page of ozkr.ac shares. On render it puts the
   masthead (the mark, the name, the sections) before the note and the footer
   (credits and the scheme switch) after it; the home page gets the footer
   only, since it carries its own mark.

   Assumes one `main.luccet` per page and this file at `lib/` under the site
   root, so every link is made from that root. Options come from
   `window.LUCCET.use.site`: `repo`, the URL the footer's Source link points
   to. The scheme: the reader's choice is kept in localStorage as `theme` and
   applied as `data-theme` on the root before the note renders; no choice
   follows the system. */

(function () {
  "use strict";

  // ---------------------------------------------------------- the guards
  // Loaded under node by `luccet check` as well as in the browser; nothing
  // to do without the engine or without a document.
  const L = window.luccet;
  if (!L) return;
  if (
    typeof document !== "object" ||
    document === null ||
    document.nodeType !== 9
  )
    return;

  // --------------------------------------------------------- the options
  const o = Object.assign(
    { repo: "https://github.com/OzkrAC/ozkrac.github.io" },
    L.config && L.config.use && L.config.use.site,
  );

  // ------------------------------------------------------------ the site
  const SECTIONS = [
    // ["Erudition", "erudition/"],
    // ["Lucubration", "lucubration/"],
    // ["Projects", "projects/"],
  ];
  const CREDITS = [
    ["OzkrAC", ""],
    ["Source", o.repo],
    ["License", "license.html"],
  ];
  const LUCCET = "https://luccet.dev";

  // ----------------------------------------------------------- where am I
  const own = document.currentScript && document.currentScript.src;
  const root = new URL("..", own || location.href);
  const here = location.pathname;
  const under = (p) => here.startsWith(root.pathname + p);
  const home = here === root.pathname || here === `${root.pathname}index.html`;

  // ------------------------------------------------------------ the icons
  // The favicon, the home-screen icon and the manifest, once per page, so
  // no page's first line has to carry them. A page that names its own icon
  // is left alone.
  const ICONS = [
    { rel: "icon", href: "lib/favicon.ico", sizes: "any" },
    {
      rel: "icon",
      href: "lib/favicon-32x32.png",
      type: "image/png",
      sizes: "32x32",
    },
    { rel: "apple-touch-icon", href: "lib/apple-touch-icon.png" },
    { rel: "manifest", href: "lib/site.webmanifest" },
  ];

  // ----------------------------------------------------------- the scheme
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const stored = () => {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  };
  const isDark = () => {
    const s = stored();
    return s ? s === "dark" : dark.matches;
  };
  const apply = () => {
    document.documentElement.dataset.theme = isDark() ? "dark" : "light";
  };
  const choose = (next) => {
    try {
      // A choice that agrees with the system is no choice: follow the system again.
      if ((next === "dark") === dark.matches) localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch {
      /* no storage: the page still switches */
    }
    document.documentElement.dataset.theme = next;
  };
  apply();
  dark.addEventListener("change", apply);

  // --------------------------------------------------------- the helpers
  const el = (tag, props, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const k of kids) if (k != null) e.append(k);
    return e;
  };
  const href = (p) => new URL(p, root).href;
  const link = (text, p, props) => el("a", { href: href(p), text, ...props });

  const icons = () => {
    if (document.head.querySelector('link[rel~="icon"]')) return;
    for (const { href: p, ...rest } of ICONS)
      document.head.append(el("link", { ...rest, href: href(p) }));
  };
  icons();

  // ---------------------------------------------------------- the pieces
  const masthead = () =>
    el(
      "header",
      { class: "site-head" },
      el(
        "a",
        { class: "site-brand", href: href("") },
        el("img", {
          class: "site-mark",
          src: href("lib/ozkrac-128.png"),
          alt: "",
          width: 36,
          height: 36,
        }),
        el("span", { text: "ozkr.ac" }),
      ),
      el(
        "nav",
        { class: "site-nav", "aria-label": "Site" },
        ...SECTIONS.map(([text, p]) =>
          link(text, p, { "aria-current": under(p) ? "page" : null }),
        ),
      ),
    );

  const themeSwitch = () => {
    const button = el("button", { class: "site-theme", type: "button" });
    const label = () => {
      const d = document.documentElement.dataset.theme === "dark";
      button.textContent = d ? "Light" : "Dark";
      button.title = `Switch to ${d ? "light" : "dark"} mode`;
    };
    button.addEventListener("click", () => {
      choose(
        document.documentElement.dataset.theme === "dark" ? "light" : "dark",
      );
      label();
    });
    dark.addEventListener("change", label);
    label();
    return button;
  };

  const footer = () =>
    el(
      "footer",
      { class: "site-foot" },
      el(
        "p",
        null,
        ...CREDITS.flatMap(([text, p]) => [link(text, p), " · "]),
        "Made with ",
        el("a", { href: LUCCET, text: "Luccet" }),
      ),
      themeSwitch(),
    );

  // ------------------------------------------------------------ the page
  // The one place the page is changed, once per page.
  L.on("render", (main) => {
    if (main !== document.querySelector("main.luccet")) return;
    if (document.querySelector(".site-foot")) return;
    if (!home) main.before(masthead());
    main.after(footer());
  });
})();
