// Igluligaarjuk (Chesterfield Inlet, Nunavut): everything the page needs to know about
// this community. The page reads window.COMMUNITY; see communities/_template/community.js
// for what each field does.
window.COMMUNITY = {
  id: 'igluligaarjuk',                      // folder name; also the CSV download name
  title: 'Igluligaarjuk Microbes · Naming Workshop',
  brand: 'Igluligaarjuk Microbes',
  placeName: 'Igluligaarjuk',               // used in "Microbes of ..."
  nativeName: 'ᐃᒡᓗᓕᒑᕐᔪᒃ',                  // place name in the community's own writing system
  englishName: 'Chesterfield Inlet',
  localLabel: 'Chesterfield',               // short name used in tables: "an average Chesterfield sample"
  foundWhere: 'in the inlet and the lakes behind town',
  habitats: {marine: 'harbour, Itivia, inlet', freshwater: '1st, 2nd and 3rd Lake'},
  language: 'Inuktitut',
  scriptName: 'syllabics',                  // leave empty if the language is written in roman letters only
  wordExamples: ['ice', 'siku', 'ᓯᑯ'],
  meaningExample: 'Chesterfield Inlet',
  dictionarySourceFilter: '^Tusaalanga',    // regex on dictionary entry `source`; empty = show every entry
  dictionaryCreditHtml: 'Words from the <a href="https://tusaalanga.ca/glossary" target="_blank">Inuktut Tusaalanga</a> glossary, Aivilingmiutut dialect.',
  // rod-shape genes found in each MAG (shown as a hint when picking a shape ending)
  shapeGenes: {
    'dastool-lorbin_055':'mreBCD rodA pbp2', 'dastool-lorbin_162':'mreBCD rodA', 'dastool-metabat_11223':'mreB rodA',
    'dastool-semibin_075':'mreB', 'dastool-lorbin_002':'mreB rodA pbp2', 'dastool-lorbin_051':'mreB',
    'dastool-comebin_6520':'mreBCD', 'dastool-comebin_832':'', 'dastool-comebin_4228':'mreBCD rodA pbp2',
    'dastool-lorbin_069':'mreB', 'dastool-comebin_3630':'mreBCD rodA pbp2', 'dastool-lorbin_054':'',
  },
  // grammatical gender of existing genera not in narratives.js GENERA (m/f/n)
  knownGenusGender: {Aurantibacillus: 'm'},
};
