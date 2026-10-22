// ScIQ tab content for Igluligaarjuk, read by site/iq_tab.js (renderIQ).
// ScIQ is the idea Inuit youth of Ikaarvik developed for combining science and Inuit
// Qaujimajatuqangit (IQ), using the IQ principles as a guide (Pedersen et al. 2020, Arctic
// Science 6:326-339). Sources and design notes: docs/iq_research.md.
// Each microbe gets a one-sentence hook and one or two cards. A card is one IQ principle; turned
// over it shows a clue from the genes and one question for the whole workshop (youth, Elders
// and scientists) to talk about.
// Rules: ask, don't tell. Never state what Inuit knowledge "says" about a microbe and never
// invent traditional knowledge or Inuktitut words. Clues must agree with narratives.js and
// site_data.js. Principle names and glosses are copied from the Government of Nunavut list
// (Education Act).
window.IQ_CONTENT = {
  labels: {
    tab: "🧭 ScIQ",
    kicker: "ScIQ: science + Inuit Qaujimajatuqangit",
    prompt: "Tap a card to turn it over. Talk about it together. There are no wrong answers.",
    flipHint: "Tap to see the question",
    answerPlaceholder: "Notes from the discussion",
    aboutTitle: "About ScIQ, the principles and the sources",
    allPrinciples: "The eight Inuit Qaujimajatuqangit guiding principles",
  },

  // shown inside the collapsed "about" box
  intro: {
    title: "What is ScIQ?",
    text: "ScIQ (say it 'sigh-cue') is an idea from Inuit youth in Nunavut: science and Inuit Qaujimajatuqangit (IQ) working together. Science brings tools and methods, like reading a microbe's DNA. IQ brings knowledge, customs and values, and it guides how research is done, not only what is found.",
    more: [
      ["Where does it come from?", "Jonathan Pitseolak of Pond Inlet made up the word in 2015 at a workshop of Ikaarvik, a program where Inuit youth lead research on questions that matter to their communities. In 2018, youth from Pond Inlet, Gjoa Haven, Cambridge Bay and Kugluktuk met in Cambridge Bay with Elder Piita Irniq. They used the eight IQ principles as their guide and wrote 45 recommendations for researchers, such as: start with questions the community cares about, be a person first and a researcher second, and involve the community in deciding what results mean."],
      ["Why these cards?", "Each card puts one IQ principle next to something the microbe's genes suggest. The question on the back is for everyone in the room. Some comparisons will fit and some will not: talking about where they stop fitting is part of it."],
      ["Are there other ideas like this?", "Yes. For example, Two-Eyed Seeing, from Mi'kmaw Elder Albert Marshall, is about using the strengths of Indigenous knowledge and of science together. ScIQ was made by Inuit youth for Nunavut."],
    ],
  },

  // one picture per card, drawn from the text on its back (img/iq/PROMPTS.md)
  cardImages: "img/iq/{id}_{n}.jpg",

  principlesSource: "Names and English meanings as written in the Nunavut Education Act, listed in Government of Nunavut (2013), Incorporating Inuit Societal Values. Spellings can differ between dialects: how do people in Igluligaarjuk say and write them?",
  principles: [
    {key: "inuuqatigiitsiarniq", iu: "Inuuqatigiitsiarniq", en: "respecting others, relationships and caring for people"},
    {key: "tunnganarniq", iu: "Tunnganarniq", en: "fostering good spirit by being open, welcoming and inclusive"},
    {key: "pijitsirniq", iu: "Pijitsirniq", en: "serving and providing for family or community, or both"},
    {key: "aajiiqatigiinniq", iu: "Aajiiqatigiinniq", en: "decision making through discussion and consensus"},
    {key: "pilimmaksarniq", iu: "Pilimmaksarniq", en: "development of skills through practice, effort and action", note: "also Pijariuqsarniq"},
    {key: "piliriqatigiinniq", iu: "Piliriqatigiinniq", en: "working together for a common cause", note: "also Ikajuqtigiinniq"},
    {key: "qanuqtuurniq", iu: "Qanuqtuurniq", en: "being innovative and resourceful"},
    {key: "avatittinnik", iu: "Avatittinnik Kamatsiarniq", en: "respect and care for the land, animals and the environment"},
  ],

  references: [
    {cite: "Pedersen C, Otokiak M, Koonoo I, Milton J, Maktar E, Anaviapik A, Milton M, Porter G, Scott A, Newman C, Porter C, Aaluk T, Tiriraniaq B, Pedersen A, Riffi M, Solomon E, Elverum S (2020) ScIQ: an invitation and recommendations to combine science and Inuit Qaujimajatuqangit for meaningful engagement of Inuit communities in research. Arctic Science 6:326–339.", url: "https://doi.org/10.1139/as-2020-0015"},
    {cite: "Government of Nunavut (2013) Incorporating Inuit Societal Values.", url: "https://gov.nu.ca/sites/default/files/publications/2022-01/incorporating_inuit_societal_values_report.pdf"},
    {cite: "Nunavut Department of Education (2007) Inuit Qaujimajatuqangit: Education Framework for Nunavut Curriculum.", url: "https://prod.gov.nu.ca/sites/default/files/publications/2024-01/Inuit%20Qaujimajatuqangit%20ENG.pdf"},
    {cite: "Karetak J, Tester F, Tagalik S, eds. (2017) Inuit Qaujimajatuqangit: What Inuit Have Always Known to Be True. Fernwood Publishing.", url: "https://fernwoodpublishing.ca/book/inuit-qaujimajatuqangit"},
    {cite: "Wenzel GW (2004) From TEK to IQ: Inuit Qaujimajatuqangit and Inuit cultural ecology. Arctic Anthropology 41(2):238–250.", url: "https://doi.org/10.1353/arc.2011.0067"},
    {cite: "Tester FJ, Irniq P (2008) Inuit Qaujimajatuqangit: social history, politics and the practice of resistance. Arctic 61(Suppl. 1):48–61.", url: "https://doi.org/10.14430/arctic101"},
    {cite: "Inuit Tapiriit Kanatami (2018) National Inuit Strategy on Research.", url: "https://www.itk.ca/national-inuit-strategy-on-research/"},
    {cite: "Nowosad DSJ, Beattie M, Segal R, Wilson K (2025) Inuit Qaujimajatuqangit and Western science: examples of research that demonstrate sovereignty and self-determination in the face of complex impacts from climate change. Arctic Science 11:1–10.", url: "https://doi.org/10.1139/as-2023-0081"},
    {cite: "Bartlett C, Marshall M, Marshall A (2012) Two-Eyed Seeing and other lessons learned within a co-learning journey of bringing together indigenous and mainstream knowledges and ways of knowing. Journal of Environmental Studies and Sciences 2:331–340.", url: "https://doi.org/10.1007/s13412-012-0086-8"},
  ],

  // One entry per microbe id in candidates.js.
  //   hook    one or two plain sentences: the most striking thing about this microbe
  //   items   one or two cards: {key: principle key (or [keys]), clue: from the genes, q: the question}
  microbes: {
    "dastool-lorbin_055": {
      hook: "It lives off the rotten-egg smell at low tide: it pulls energy from sulfur and builds its body from carbon dioxide, even in the dark under the ice. Its stronghold seems to be right here in Chesterfield.",
      items: [
        {key: "pijitsirniq", clue: "It makes B-vitamins that algae and plankton need but cannot make for themselves.", q: "Who in Igluligaarjuk provides for others without anyone noticing? Is this microbe doing something like that, or is that stretching the idea?"},
        {key: "avatittinnik", clue: "Here a litre of seawater held up to about 55 million of its cells. Near Churchill it turned up in only a few samples, and among the High Arctic islands not at all.", q: "If something special lives in our harbour mud, what would caring for the harbour look like?"},
      ],
    },

    "W02_polaribacter": {
      hook: "In spring it feasts on the algae that grow on the underside of the sea ice, and it makes its own golden sunscreen against the glare off the snow and ice.",
      items: [
        {key: "qanuqtuurniq", clue: "Its genes make golden pigments that work like sunscreen against bright spring light.", q: "How have people here protected their eyes and skin from spring glare on the ice, using what was at hand?"},
        {key: "avatittinnik", clue: "It eats the sugars in kelp and in the ice algae that bloom when the ice breaks up.", q: "Does caring for the sea ice include the tiny life that lives with it? Why or why not?"},
      ],
    },

    "dastool-metabat_11223": {
      hook: "It rides 'marine snow', flakes of dead algae and slime that drift down through the water, and helps decide how much food sinks to the sea floor.",
      items: [
        {key: "piliriqatigiinniq", clue: "Many different microbes break down one flake of marine snow, each doing one part of the job.", q: "What jobs in Igluligaarjuk only work when everyone does a part? Do microbes really 'work together', or does it only look that way?"},
        {key: "tunnganarniq", clue: "In late May there were millions of its cells in every litre of water; by September only a few hundred thousand were left.", q: "When one season's group gives way to the next, how is a place handed over? What does it take to make room for someone new?"},
      ],
    },

    "dastool-semibin_075": {
      hook: "Scientists know almost nothing about it. It has one of the smallest genomes on this site: only the essentials for cold water with little food.",
      items: [
        {key: "qanuqtuurniq", clue: "It carries only the genes it needs to get by.", q: "On a fall trip on the land, what do people always bring and what do they leave behind? How do they decide?"},
        {key: "pilimmaksarniq", clue: "Its CRISPR system remembers viruses it has fought before, so it is ready next time.", q: "How do people learn from hard experiences so they are ready the next time?"},
      ],
    },

    "dastool-lorbin_002": {
      hook: "A survivor: it can switch to a different food when one runs short, and it makes vitamins that the algae around it depend on.",
      items: [
        {key: "pijitsirniq", clue: "Many algae need vitamin B12 but cannot make it. This microbe makes parts of it, and vitamins B2, B5 and B7.", q: "Who do you depend on for things you cannot make yourself, and who depends on you?"},
        {key: "qanuqtuurniq", clue: "Its genes hold complete pathways for many different foods and ways of getting energy.", q: "What do people do when the animal or plant they are looking for is not there this year?"},
      ],
    },

    "W06_methylophilid": {
      hook: "A clean-up crew: it eats tiny leftovers, like methanol, that algae release, so the carbon stays in the food web instead of going to waste.",
      items: [
        {key: "avatittinnik", clue: "It uses up small leftovers that would otherwise build up or escape to the air.", q: "After a harvest, how are the different parts of an animal used? Is using everything a way of caring for the land and animals?"},
        {key: "pilimmaksarniq", clue: "It catches sunlight with a rhodopsin, a light-catching protein related to the one in our eyes, for extra energy on bright days.", q: "Spring brings long days of light. What do people get ready for and practise as the light comes back, and how is that learned?"},
      ],
    },

    "dastool-comebin_6520": {
      hook: "Every summer, plant bits from the land and the empty shells of midges and mosquitoes end up in the lakes. A close cousin of this microbe lives in our lakes, and microbes like it turn that material back into food for others.",
      items: [
        {key: "avatittinnik", clue: "It digests plant fibre and chitin (insect shells), linking the land to the lakes.", q: "Where do people get fresh water in summer and in winter, and how do they know it is good? How does what happens on the land reach the water?"},
        {key: "inuuqatigiitsiarniq", clue: "Its genome came mostly from lakes in Manitoba; in our lakes lives a very close cousin.", q: "What do our lakes share with lakes far to the south, and what makes ours different? Who here would know?"},
      ],
    },

    "W09_polynucleobacter": {
      hook: "Dip a cup into 2nd Lake in the fall and you scoop up millions of these tiny cells, feeding on what washes in from the land.",
      items: [
        {key: "inuuqatigiitsiarniq", clue: "Its relatives were first found living as partners inside a single-celled pond creature.", q: "Where do you see living things, or people, depending on partners to get by here?"},
        {key: "pijitsirniq", clue: "It feeds on simple molecules washed in from the land, passing that carbon on into the lake's food web.", q: "What does the land give the lakes, and what do the lakes give back to the animals and people around them?"},
      ],
    },

    "W11_nitrotoga": {
      hook: "It turns nitrite, which can harm fish, into nitrate, which feeds algae and plants. We found it only in 3rd Lake in late May, when the lake was still cold and probably still under ice.",
      items: [
        {key: "pilimmaksarniq", clue: "Nitrite can harm fish if it builds up. This microbe's genes suggest it clears nitrite away.", q: "How do people who fish tell whether a lake or its fish are healthy? How is that skill learned?"},
        {key: "piliriqatigiinniq", clue: "It does one step of the nitrogen cycle; other microbes do the steps before and after it.", q: "Think of a job here that passes from person to person, each doing one step. What happens when one step is missing?"},
      ],
    },

    "A2_planktophila": {
      hook: "A tiny lake bacterium: hundreds could line up across a hair. As far as anyone knows, the lakes behind town are its home: everywhere else we looked, we found it only once.",
      items: [
        {key: "aajiiqatigiinniq", clue: "In hundreds of lake and river samples from Manitoba and Hudson Bay we found this species only once, in the Churchill River estuary.", q: "If it lives almost nowhere else, who should decide what it is called, and how should that decision be made?"},
        {key: "qanuqtuurniq", clue: "It has one of the smallest genomes on this site, so it wastes little energy in lakes where food is scarce.", q: "When there is not much to go around, how do people make a little go a long way? What do times of having less teach?"},
      ],
    },

    "N1_amylibacter": {
      hook: "A small sea bacterium with two ways to get energy, sunlight and sulfur. It was most common at Itivia in September, and it also lives near Churchill, across Hudson Bay, and among the High Arctic islands.",
      items: [
        {key: "inuuqatigiitsiarniq", clue: "The same species lives here, in the Churchill River estuary, out in Hudson Bay and even among the High Arctic islands.", q: "What connects Igluligaarjuk with other communities around Hudson Bay? What travels along the coast: people, animals, ice, water?"},
        {key: "tunnganarniq", clue: "To learn more, scientists would need samples from both sides of Hudson Bay.", q: "If researchers came to Igluligaarjuk to study the water, how should they be welcomed, and how should they behave as guests?"},
      ],
    },

    "N2_caivzm01": {
      hook: "The 2nd Lake mystery: it lives in 2nd Lake but hardly at all in 1st or 3rd Lake, and two out of three of its genes look like nothing scientists have studied.",
      items: [
        {key: ["aajiiqatigiinniq", "qanuqtuurniq"], clue: "Each lake has its own depth, water chemistry and plants, and small differences can decide which microbes do well.", q: "Why only 2nd Lake? Put together what everyone in the room knows about the three lakes. Can you agree on a best explanation?"},
        {key: "tunnganarniq", clue: "Scientists know very little about its group, and two of every three of its genes are a mystery.", q: "How should a group approach something nobody understands yet? What makes it easy to say 'I don't know' out loud?"},
      ],
    },

    "N3_peredibacter": {
      hook: "A hunter: its relatives swim into a bigger bacterium, eat it from the inside and burst out as new cells. In one 1st Lake sample there were about 140 million of them in a litre of water.",
      items: [
        {key: "avatittinnik", clue: "Hunters like this keep other bacteria in check, a little like wolves and caribou.", q: "How do people know when there are too many or too few of an animal? Does caring for the land include the hunters as well as the hunted?"},
        {key: "pilimmaksarniq", clue: "To hunt, it swims and steers toward chemical signals until it finds its prey.", q: "How do young hunters learn to read signs and find their way? Who teaches them, and how?"},
      ],
    },

    "N4_bdellovibrio": {
      hook: "Its relatives are among the fastest swimmers for their size. They crash into other bacteria, drill in and eat them from the inside. Scientists are studying hunters like this as a living medicine against infections.",
      items: [
        {key: "pijitsirniq", clue: "Its genes include a grappling hook like the one its relatives use to grab prey.", q: "If a medicine one day came from a microbe found in Igluligaarjuk, who should have a say in how it is used, and how should it serve the community?"},
        {key: "avatittinnik", clue: "Scientists are testing hunters like this as living medicines that attack harmful bacteria and leave our own cells alone.", q: "A good hunter takes what is needed and leaves the rest. Is that a fair way to describe this microbe, or not?"},
      ],
    },

    "N5_uba845": {
      hook: "A harbour hunter that lives at Tuktuttaa and the Dock. In Hudson Bay near Churchill and in the High Arctic we found only its cousins.",
      items: [
        {key: "pijitsirniq", clue: "When its relatives burst out of their prey, the leftovers become food for other microbes.", q: "What happens to what is left after a hunt, and who gets a share? Where does the comparison with this microbe stop working?"},
        {key: "inuuqatigiitsiarniq", clue: "Its cousins live in Hudson Bay near Churchill and in the High Arctic, but this species we found only here.", q: "What ties you to this place, and to relatives who live somewhere else?"},
      ],
    },

    "N6_k1": {
      hook: "It makes its own food from carbon dioxide, like a plant, and lives all the way from Hudson Bay to the High Arctic islands.",
      items: [
        {key: "aajiiqatigiinniq", clue: "Our copy of its genome is only about 90% complete, so scientists have to decide what it does with part of the information missing.", q: "When the ice or weather gives only some of the signs, how do people decide together whether it is safe to go?"},
        {key: "piliriqatigiinniq", clue: "It lives all the way from Hudson Bay to the High Arctic islands, in water shared by many communities.", q: "The same water connects many communities. How should they work together to look after it?"},
      ],
    },
  },
};
