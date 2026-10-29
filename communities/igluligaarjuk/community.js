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
  habitats: {marine: 'harbour, Itivia, inlet', freshwater: 'Puirsuk, Akulliit and Amaruqtalik (1st, 2nd and 3rd Lake)'},
  language: 'Inuktitut',
  languageNative: 'ᐃᓄᒃᑎᑐᑦ',                 // the language's name in its own script (labels the syllabics line on the sheets)
  scriptName: 'syllabics',                  // leave empty if the language is written in roman letters only
  wordExamples: ['ice', 'siku', 'ᓯᑯ'],
  meaningExample: 'Chesterfield Inlet',
  dictionarySourceFilter: '^Tusaalanga',    // regex on dictionary entry `source`; empty = show every entry
  dictionaryCreditHtml: 'Words from the <a href="https://tusaalanga.ca/glossary" target="_blank">Inuktut Tusaalanga</a> glossary, Aivilingmiutut dialect.',
  // rod-shape genes found in each MAG (shown as a hint when picking a shape ending)
  shapeGenes: {
    'dastool-lorbin_055':'mreBCD rodA pbp2', 'W02_polaribacter':'mreBCD rodA', 'dastool-metabat_11223':'mreB rodA',
    'dastool-semibin_075':'mreB', 'dastool-lorbin_002':'mreB rodA pbp2', 'W06_methylophilid':'mreB',
    'dastool-comebin_6520':'mreBCD', 'dastool-comebin_832':'', 'W09_polynucleobacter':'mreBCD rodA pbp2',
    'dastool-lorbin_069':'mreB', 'W11_nitrotoga':'mreBCD rodA pbp2', 'dastool-lorbin_054':'', 'A2_planktophila':'mreBCD', 'N3_peredibacter':'mreB rodA', 'N4_bdellovibrio':'mreBCD rodA', 'N5_uba845':'mreB', 'N1_amylibacter':'mreB rodA', 'N2_caivzm01':'mreB', 'N6_k1':'mreBCD rodA pbp2',
    'N7_marimicrobium':'mreBCD rodA pbp2', 'N8_uba9145':'rodA pbp2', 'N9_uba10364':'mreBC', 'N10_uba9320':'mreB', 'N12_nitrosopumilus':'',
    'N11_caisji01':'', 'N13_mycobacterium':'', 'N14_atzt02':'mreB',
    'I1_pseudoalteromonas':'mreBCD rodA pbp2', 'I2_shewanella':'mreBCD rodA pbp2',
    'N15_camcqy01':'', 'N16_qwop01':'', 'N17_camcqy01':'',
  },
  // grammatical gender of existing genera not in narratives.js GENERA (m/f/n)
  knownGenusGender: {Aurantibacillus: 'm'},
};
