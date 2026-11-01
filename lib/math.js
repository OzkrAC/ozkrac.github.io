/* math.js: the vocabulary of the entries. Definitions, theorems and kin,
   examples (numbered on one counter), proofs, remarks, the callouts, a
   folded recall, figures and tables, a contents leaf. Styled in site.css.
   Math is Luccet's own MathML; macros for every formula go in a
   `:::macros` block of the note, or here as `luccet.config.macros`. */

(function () {
  "use strict";
  const luccet = window.luccet;
  if (!luccet) return;

  // Numbered, on one counter: Definition 1, Theorem 2, Example 3.
  // .stmt: the statement is set in italic, as amsthm's plain style does.
  const numbered = (label, kind, stmt) => ({
    tag: "section",
    class: stmt ? `${kind} stmt` : kind,
    counter: "item",
    label,
    ref: "{label} {n}",
  });
  luccet.block("definition", numbered("Definition", "defn"));
  luccet.block("theorem", numbered("Theorem", "thm", true));
  luccet.block("lemma", numbered("Lemma", "thm", true));
  luccet.block("proposition", numbered("Proposition", "thm", true));
  luccet.block("corollary", numbered("Corollary", "thm", true));
  luccet.block("law", numbered("Law", "thm", true));
  luccet.block("example", numbered("Example", "eg"));

  // Unnumbered, run in with the text. A title follows the label, as amsthm's
  // optional argument does: :::proof[of (a)] reads "Proof of (a)."
  luccet.block("remark", { tag: "section", class: "rmk", label: "Remark" });
  luccet.block("proof", { tag: "section", class: "pf", label: "Proof", end: "∎" });
  luccet.block("disproof", { tag: "section", class: "pf", label: "Disproof", end: "∎" });

  // Callouts: what to remember, what trips you up, what is still open.
  const callout = (label) => ({ tag: "aside", class: "callout", label });
  luccet.block("summary", callout("Summary"));
  luccet.block("note", callout("Note"));
  luccet.block("caution", callout("Caution"));
  luccet.block("question", callout("Question"));
  // An earlier result restated where it is used, folded: :::recall[Law of Distribution]
  luccet.block("recall", { tag: "details", class: "callout fold", label: "Recall" });

  luccet.block("figure", { tag: "figure", counter: "figure", label: "Figure" });
  luccet.block("table", { tag: "table", counter: "table", label: "Table" });

  luccet.leaf("toc", {
    tag: "nav",
    transform: "toc",
    depth: "2-3",
    label: "Contents",
    attrs: { "aria-label": "Contents" },
  });

  // A term is defined by :dfn[word] or a titled :::definition, and used by
  // :term[word], which the wiki's glossary add-on links to the glossary.

  // Macros every formula may use.
  luccet.config.macros = Object.assign(
    {
      abs: "\\lvert #1 \\rvert",
      set: "\\{ #1 \\}",
      lcm: "\\operatorname{lcm}",
    },
    luccet.config.macros,
  );
})();
