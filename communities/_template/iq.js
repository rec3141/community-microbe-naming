// Optional: content for the knowledge tab, read by site/iq_tab.js. Keep it simple: for each
// microbe, one hook sentence and one or two cards. A card is one of the community's guiding
// principles; turned over it shows a clue from the genes and one question for everyone in the
// workshop to talk about. For Igluligaarjuk the tab is framed as ScIQ (science and Inuit
// Qaujimajatuqangit, Pedersen et al. 2020); use the framing and words the community itself
// uses. Delete this file if the community does not want the tab.
// Rules: ask, don't tell. Never state what the community's knowledge "says" about a microbe
// and never invent traditional knowledge or words. Clues must agree with narratives.js and
// site_data.js. Use principle names only as the community or its government publishes them.
// See docs/iq_research.md for the sources behind the Igluligaarjuk version.
window.IQ_CONTENT = {
  // optional: override any text in site/iq_tab.js:
  // tab, kicker, prompt, flipHint, flipBack, answerPlaceholder, privacy, studentPlaceholder,
  // dlOne, dlAll, aboutTitle, allPrinciples, refsTitle, missing
  labels: {
    tab: "🧭 <Name of the tab>",
    kicker: "",                       // one line above the hook
    prompt: "Tap a card to turn it over. Talk about it together. There are no wrong answers.",
  },

  // shown inside the collapsed "about" box
  intro: {
    title: "",
    text: "",
    more: [ /* ["Question?", "Answer."] */ ],
  },

  principlesSource: "",               // where the principle names and glosses come from
  principles: [
    // {key: "short_key", iu: "Name in the language", en: "published English meaning", note: "optional"},
  ],

  references: [
    // {cite: "Author (year) Title. Journal.", url: "https://doi.org/..."},
  ],

  // one entry per microbe id in candidates.js
  microbes: {
    "dastool-example_001": {
      hook: "",                       // one or two plain sentences: the most striking thing about it
      items: [                        // one or two cards
        // {key: "short_key", clue: "what the genes suggest", q: "one open question for the room"},
      ],
    },
  },
};
