(function () {
  "use strict";
  const T = window.tern;
  if (!T) return;

  if (!(
    typeof document === "object" &&
    document !== null &&
    document.nodeType === 9
  ))
    return;

  const o = Object.assign(
    { repo: "https://github.com/OzkrAC/ozkrac.github.io" },
    T.config && T.config.use && T.config.use.site,
  );

  const own = document.currentScript && document.currentScript.src;
  const root = new URL("..", own || location.href);
  const here = location.pathname;
  const under = (p) => here.startsWith(root.pathname + p);
  const home = here === root.pathname || here === `${root.pathname}index.html`;

  /**
   * Theme
   */
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const stored = () => {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  };
  const apply = () => {
    const s = stored();
    const isDark = s ? s === "dark" : dark.matches;
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    return isDark;
  };
  apply();
  dark.addEventListener("change", apply);

  // ---------------------------------------------------------------- the chrome

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

  const masthead = () => {
    const nav = el("nav", { class: "site-nav", "aria-label": "Site" });
    for (const [text, p] of [
      ["Wiki", "wiki/"],
      ["Projects", "projects/"],
      ["Blog", "blog/"],
    ]) {
      nav.append(
        el("a", {
          href: href(p),
          "aria-current": under(p) ? "page" : null,
          text,
        }),
      );
    }
    return el(
      "header",
      { class: "site-head" },
      el(
        "a",
        { class: "site-brand", href: href("") },
        el("img", {
          class: "site-mark",
          src: href("lib/ozkrac.png"),
          alt: "",
          width: 32,
          height: 32,
        }),
        el("span", { text: "ozkr.ac" }),
      ),
      nav,
    );
  };

  const footer = () => {
    const button = el("button", { class: "site-theme", type: "button" });
    const label = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      button.textContent = isDark ? "Light mode" : "Dark mode";
      button.title = `Switch to ${isDark ? "light" : "dark"} mode`;
    };
    button.addEventListener("click", () => {
      const next =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try {
        // A choice that agrees with the system is no choice: follow the system again.
        if ((next === "dark") === dark.matches)
          localStorage.removeItem("theme");
        else localStorage.setItem("theme", next);
      } catch {
        /* no storage: the page still switches */
      }
      if (!stored()) document.documentElement.dataset.theme = next;
      apply();
      label();
    });
    dark.addEventListener("change", label);
    label();
    return el(
      "footer",
      { class: "site-foot" },
      el(
        "p",
        null,
        el("a", { href: href(""), text: "OzkrAC" }),
        " · ",
        el("a", { href: o.repo, text: "Source" }),
        " · ",
        el("a", { href: href("license.html"), text: "License" }),
        " · Made with ",
        el("a", { href: "https://github.com/OzkrAC/tern", text: "Tern" }),
      ),
      button,
    );
  };

  /**
   * Render the site
   */
  T.on("render", (main) => {
    if (main !== document.querySelector("main.tern")) return;
    if (document.querySelector(".site-foot")) return; // already there
    if (!home) main.before(masthead());
    main.after(footer());
  });
})();
