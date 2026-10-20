(function () {
  "use strict";
  const tern = window.tern;

  // Numbered, on one counter: Definition 1, Theorem 2, Example 3.
  // .stmt: the statement is set in italic, as amsthm's plain style does.
  const numbered = (label, kind, stmt) => ({
    tag: "section",
    class: stmt ? `${kind} stmt` : kind,
    counter: "item",
    label,
    ref: "{label} {n}",
  });
  tern.block("definition", numbered("Definition", "defn"));
  tern.block("theorem", numbered("Theorem", "thm", true));
  tern.block("lemma", numbered("Lemma", "thm", true));
  tern.block("proposition", numbered("Proposition", "thm", true));
  tern.block("corollary", numbered("Corollary", "thm", true));
  tern.block("law", numbered("Law", "thm", true));
  tern.block("example", numbered("Example", "eg"));

  // Unnumbered, run in with the text. A title follows the label, as amsthm's
  // optional argument does: :::proof[of (a)] reads "Proof of (a)."
  tern.block("remark", { tag: "section", class: "rmk", label: "Remark" });
  tern.block("proof", {
    tag: "section",
    class: "pf",
    label: "Proof",
    end: "∎",
  });
  tern.block("disproof", {
    tag: "section",
    class: "pf",
    label: "Disproof",
    end: "∎",
  });

  // Callouts: what to remember, what trips you up, what is still open.
  const callout = (label) => ({ tag: "aside", class: "callout", label });
  tern.block("summary", callout("Summary"));
  tern.block("note", callout("Note"));
  tern.block("caution", callout("Caution"));
  tern.block("question", callout("Question"));
  // An earlier result restated where it is used, folded: :::recall[Law of Distribution]
  tern.block("recall", {
    tag: "details",
    class: "callout fold",
    label: "Recall",
  });

  tern.block("figure", { tag: "figure", counter: "figure", label: "Figure" });
  tern.block("table", { tag: "table", counter: "table", label: "Table" });

  tern.leaf("toc", {
    tag: "nav",
    transform: "toc",
    depth: "2-3",
    label: "Contents",
    attrs: { "aria-label": "Contents" },
  });

  // A term at the place that defines it is :dfn[integral function], and a use
  // of one :term[…], both from Tern (addons/glossary.js gives :term its
  // link). A titled :::definition block defines its title as a term too.

  // Options for the KaTeX add-on, which reads them when it loads: list math.js
  // before addons/katex.js in data-use.
  const use = tern.config.use || (tern.config.use = {});
  const katex = use.katex || (use.katex = {});
  katex.macros = Object.assign(
    {
      "\\abs": "\\lvert #1 \\rvert",
      "\\set": "\\{ #1 \\}",
      "\\gr": "^{\\mathrm{g}}",
      "\\cmin": "^{\\backprime}",
      "\\csec": "^{\\backprime\\backprime}",
      "\\rad": "^{\\mathrm{c}}",
      "\\lcm": "\\operatorname{lcm}",
      "\\MoveEqLeft": "\\kern2em & \\kern-2em",
    },
    katex.macros,
  );
})();
