// The microbes shown on the site, one object each, in display order.
// Taxonomy, quality, genes, trees and maps come from site_data.js (build_site_data.py);
// this file only holds what a person writes. narratives.js overrides nickname/story text.
//   id         MAG id exactly as in the binning output and build_config.json (e.g. dastool-lorbin_055)
//   img        file in img/ (placeholder.svg until a picture is made; see img/PROMPTS.md)
//   habitat    'marine' or 'freshwater'
//   nickname   friendly alliterative name ("Tidal Thioglobus")
//   story      fallback story if narratives.js has no `eco` text
//   activities fallback bullet list if narratives.js has no `fn` text
//   tags       short chips shown on the Function tab
//   whereInCI  fallback list of local sites, used only when the map data has none
window.CANDIDATES = [
  {
    id: "dastool-example_001",
    img: "placeholder.svg",
    habitat: "freshwater",
    nickname: "Example Microbe",
    story: "",
    activities: [],
    tags: [],
    whereInCI: "",
  },
];
