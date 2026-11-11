// Plain-language text for each microbe, keyed by MAG id. Audience: high-school students
// and community members, so short sentences and no jargon in the main text.
//   nickname       overrides candidates.js
//   eco            Story tab: one or two paragraphs about where it lives and why
//   ecoMore        [question, answer] pairs in collapsed 🔍 boxes, for the curious
//   fn             Function tab: what it eats, breathes and makes
//   fnMore         [gene or pathway, plain explanation] pairs
// Rules: every fact must match site_data.js (sites, seasons, abundance, same-species
// checks). Don't mention the other tabs, the naming process or "Candidatus".
window.NARRATIVES = {
  "dastool-example_001": {
    nickname: "Example Microbe",
    eco: "",
    ecoMore: [],
    fn: "",
    fnMore: [],
  },
};

// Existing genera the microbes belong to (only for species in a genus that already has a
// name). From LPSN (https://lpsn.dsmz.de); shown on the Naming tab and used for gender.
window.GENERA = {
  // Polaribacter: {
  //   full: "Polaribacter Gosink et al. 1998",
  //   etym: "Po.la.ri.bac'ter. ... N.L. masc. n. Polaribacter, rod-shaped bacterium from a polar region",
  //   gloss: "rod from a polar region",
  //   status: "validly published under the ICNP",
  //   gender: "masculine", type: "Polaribacter filamentus",
  //   ref: "Gosink JJ et al. (1998) Int J Syst Bacteriol 48:223–235.",
  // },
};
