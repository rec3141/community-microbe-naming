// Community settings read by site/index.html as window.COMMUNITY.
// Copy this folder to communities/<id>/ and fill in every field. Strings here appear on
// the page; agree the wording (place names, language name, spellings) with the community.
window.COMMUNITY = {
  id: 'example',                    // folder name, lowercase; also used for the CSV download name
  title: 'Example Microbes · Naming Workshop',   // browser tab title
  brand: 'Example Microbes',        // top-left of every page
  placeName: 'Example',             // home page heading: "Microbes of <placeName>"
  nativeName: '',                   // place name in the community's own language/script, if any
  englishName: 'Example Lake',      // English or official name, shown under the heading
  localLabel: 'Example',            // short adjective for tables: "an average Example sample"
  foundWhere: 'in the lake and the river nearby',  // "These bacteria were found <foundWhere>."
  // home-page legend; leave a habitat empty to hide it (e.g. an inland community has no marine)
  habitats: {marine: '', freshwater: 'the lake, the river'},
  language: 'Language',             // e.g. 'Cree', 'Anishinaabemowin'; used in labels and the API prompt
  scriptName: '',                   // a second writing system shown next to roman spelling, e.g. 'syllabics'
  wordExamples: ['water', 'nipiy'], // search placeholder: an English word, its translation (and script form)
  meaningExample: 'Example Lake',   // placeholder for the "meaning" box
  dictionarySourceFilter: '',       // regex on dictionary entries' `source`; '' shows every entry
  dictionaryCreditHtml: 'Words from <a href="https://example.org" target="_blank">Example dictionary</a>.',
  shapeGenes: {},                   // MAG id -> rod-shape genes found ('mreBCD rodA pbp2'); scripts/hpc/shape_genes.py
  knownGenusGender: {},             // genus -> 'm'|'f'|'n' for existing genera not described in narratives.js GENERA
};
