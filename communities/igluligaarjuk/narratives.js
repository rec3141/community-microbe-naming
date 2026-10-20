// Plain-language nicknames and stories for each microbe, written for a community
// audience (kids and adults). `eco` / `fn` are the short "explain it simply" text on
// the Ecology and Function tabs; `ecoMore` / `fnMore` are [question, answer] pairs
// shown in collapsed boxes for anyone who wants the jargon explained.
// Facts here should match the data on the page (sites, seasons, same-species checks).
window.NARRATIVES = {
  "dastool-lorbin_055": {
    nickname: "Tidal Thioglobus",
    eco: "Chesterfield Inlet sits where a long inlet meets Hudson Bay, and for much of the year its water lies under sea ice. In the harbour, mud and rotting seaweed slowly release sulfur compounds, the source of that rotten-egg smell you sometimes notice at low tide. This microbe makes its living from that sulfur: it pulls energy out of it and uses the energy to build its body from carbon dioxide dissolved in the water, the way plants do with sunlight, except it works in the dark. Its close relatives, called the SUP05 group, are some of the most common bacteria in low-oxygen parts of the world's oceans, where they clean up sulfur and help control how much nitrogen is lost from the sea. Finding this one thriving in shallow harbour water is unusual, and it seems to have its stronghold right here in Igluligaarjuk. It also makes B-vitamins that algae and other plankton need but cannot make for themselves, so it quietly supports the food web around it.",
    ecoMore: [
      ["Why is Chesterfield Inlet special for it?", "We compared more than 300 seawater samples from Chesterfield, Hudson Bay near Churchill and the High Arctic islands. Most of this microbe's DNA in all of those comes from the Chesterfield samples, and the reads here match its genome at 96–97%, so it is the same species. Its relatives (the SUP05 group) usually live where there is little oxygen, like deep fjords."],
      ["What does 'sulfur-oxidizing' mean?", "Sulfur compounds such as hydrogen sulfide (the rotten-egg smell) and thiosulfate hold chemical energy. The microbe pulls electrons off them, which chemists call oxidizing, turning them into harmless sulfate and keeping the energy. Its genes for this are called dsr, apr and sat."],
      ["What is 'carbon fixation'?", "Turning carbon dioxide gas into sugar and cell material. Plants do it with sunlight; this microbe does it with chemical energy, using the same key enzyme plants use (RuBisCO, in the Calvin cycle). Microbes that live this way are called chemolithoautotrophs: 'chemical, rock-eating self-feeders'."]
    ],
    fn: "It breathes a little oxygen, eats sulfur for energy and builds itself out of carbon dioxide. It also makes B-vitamins that many other sea creatures cannot make for themselves, and it carries antifreeze-like molecules that protect it from cold, salty water.",
    fnMore: [
      ["Sulfur energy (Dsr, Apr, Sat, rhodanese)", "A set of enzymes that work like an assembly line, stripping energy from sulfide and thiosulfate step by step until only sulfate is left."],
      ["Breathing with very little oxygen (cytochrome cbb3)", "Most cells use oxygen to finish making energy. The cbb3 enzyme grabs oxygen even when there is very little of it, so the microbe can live where oxygen runs low."],
      ["Vitamins (biotin B7, folate B9, thiamine B1)", "Many microbes and animals need these vitamins but cannot make them. When cells like this one leak or die, the vitamins become food for the rest of the food web."],
      ["Grabbing iron (siderophores)", "Iron is scarce in seawater. Siderophores are molecules the cell releases to catch iron and bring it back inside."],
      ["Antifreeze molecules (proline, glycine betaine)", "Small molecules that balance salt and cold, so the cell doesn't shrivel or freeze in salty brine."]
    ]
  },
  "dastool-lorbin_162": {
    nickname: "Peckish Polaribacter",
    eco: "When the sun returns in spring, algae start growing on the underside of the sea ice and then in the open water as the ice breaks up. These algae, along with kelp along the shore, are the base of the Arctic food web, but much of what they make is locked up in tough sugars that most animals cannot digest. That is where Polaribacter comes in. Bacteria in this group are among the first to grow when algae bloom and die, and they break the sugars down into pieces that other microbes, and eventually small animals, can use. Scientists care about this step because it decides how much of the algae's carbon sinks to the sea floor and how much goes back into the water and air as carbon dioxide. This particular Polaribacter is a new species, found at the Dock, Itivia and Tuktuttaa. It is gold-coloured because it makes its own sunscreen pigments to cope with bright spring light reflecting off the ice.",
    ecoMore: [
      ["What makes it new?", "Its DNA is less than 95% the same as any species scientists have described, so it is a new species in a genus that already has a name."],
      ["Where do we find it?", "At Tuktuttaa, the Dock and Itivia, in spring and fall. The reads from most of those samples match its genome at 96–97%, so it is the same species. Polaribacter are often among the first microbes to bloom when algae grow."],
      ["What's a 'polysaccharide'?", "A long chain of sugars, like the slimy alginate in kelp or the laminarin stored inside algae. Most animals can't digest them; microbes like this one can."]
    ],
    fn: "It eats seaweed and algae sugars, grabs scarce iron, makes golden sunscreen pigments and keeps working at freezing temperatures.",
    fnMore: [
      ["Seaweed-sugar scissors (alginate lyases PL6, PL7)", "Enzymes that cut alginate, the slimy sugar in brown seaweed, into small pieces the cell can eat."],
      ["Sugar catchers (TonB-dependent receptors)", "Doorways in the outer wall that pull big sugar pieces and iron into the cell. This genome has dozens of them, a sign of a big eater."],
      ["Golden sunscreen (carotenoids and terpenes)", "Pigments that protect the cell from strong spring sunlight bouncing off snow and ice."],
      ["Cold tools (cold-shock proteins)", "Proteins that keep the cell's machinery working near 0°C."]
    ]
  },
  "dastool-metabat_11223": {
    nickname: "Snow-Surfing Schleifer",
    eco: "Out in the water column, dead algae, waste and slime clump together into fluffy flakes that drift slowly down, a process scientists call 'marine snow'. Marine snow carries a large share of the ocean's carbon from the surface down to the sea floor, which is one reason the ocean helps take carbon dioxide out of the atmosphere. This microbe lives on those flakes. It holds on with sticky patches on its surface and nibbles the sugars stored inside the algae, so it helps decide how much of that carbon is recycled near the surface and how much keeps sinking. Its genus has only a code name, TMED14. In Chesterfield Inlet it is common in the spring samples, while in the fall a close cousin seems to take its place, a small sign of how the microbial community changes through the year.",
    ecoMore: [
      ["What is marine snow?", "Sinking clumps of dead plankton, waste and slime. It is one of the main ways carbon travels from the sea surface down to the sea floor."],
      ["Why 'Schleifer'?", "Its family, the Schleiferiaceae, is named after the microbiologist Karl-Heinz Schleifer. Its genus has no name yet, only the code TMED14."],
      ["Where do we find it?", "In the May samples from Tuktuttaa, the Dock and Itivia, where the reads match this genome at 96–97%. In September and October the reads are much less similar (78–86%), so a cousin takes its place in the fall."]
    ],
    fn: "It sticks to particles, digests the sugars algae store, and makes folate (vitamin B9).",
    fnMore: [
      ["Algae-sugar cutters (GH16 laminarinases, GH3, GH92)", "Laminarin is the main sugar store in kelp and diatoms, like starch in potatoes. These enzymes cut it and similar sugars apart."],
      ["Sticky patches (PKD and MAM domains)", "Protein pieces on the cell surface that help it cling to particles."],
      ["Folate (vitamin B9) and terpenes", "Folate is a vitamin that cells need to copy DNA; terpenes are a big family of natural chemicals, including many pigments."],
      ["Water-quality score (EcoSSDB)", "A score for how much its genes might help keep seawater chemistry healthy. It scores high for this microbe."]
    ]
  },
  "dastool-semibin_075": {
    nickname: "Gutsy Gamma",
    eco: "Most of the bacteria living in the ocean have never been grown in a lab, and many have never been given a name; scientists sometimes call them 'microbial dark matter'. This microbe is a good example. It belongs to a big, well-known class of bacteria, the Gammaproteobacteria, but every group below that, from its order down to its species, has only a code name. It also has one of the smallest genomes in our set. In cold, low-nutrient water, carrying extra genes is costly, so some microbes have trimmed their DNA down to the essentials. Even so, this one keeps a kit for getting energy from sulfur, factories for vitamins, and a CRISPR immune system, a record of viruses it has fought off before. Viruses infect huge numbers of ocean bacteria every day, so that defence matters. We find it in small amounts around the Dock and Itivia, mostly in the fall.",
    ecoMore: [
      ["Why 'Gamma'?", "It belongs to the Gammaproteobacteria, a huge class of bacteria. Every rank below that has only a code name (GCA-2705445)."],
      ["What is a 'streamlined' genome?", "Where food is scarce, carrying extra genes costs energy, so some microbes lose every gene they don't need. Small genome, big job."],
      ["Where do we find it?", "In small amounts at the Dock and Itivia, mostly in the September and October samples, where the reads match its genome at about 96%."]
    ],
    fn: "It gets energy from sulfur, grabs iron, makes biotin and NAD, and uses CRISPR to remember and fight off viruses.",
    fnMore: [
      ["Sulfur energy (Dsr, Apr, Sat)", "The same sulfur-processing assembly line used by Tidal Thioglobus."],
      ["Iron grabbing (siderophore transport)", "It takes up iron-catching molecules made by its neighbours."],
      ["Biotin (B7) and NAD", "Biotin is a vitamin; NAD is a helper molecule every cell uses to move energy around."],
      ["CRISPR-Cas immune system", "A genetic memory. The cell saves short pieces of virus DNA and uses them to recognise and cut that virus if it attacks again."]
    ]
  },
  "dastool-lorbin_002": {
    nickname: "Busy Balneatrix",
    eco: "Some microbes are specialists that do one job very well. This one is a generalist: its genome contains a long list of complete chemical pathways, so it can switch between many different foods and ways of getting energy, including using sulfur. One of its most useful habits is making vitamins. Many algae need vitamin B12 to grow but cannot make it; they depend on bacteria nearby to supply it. By making B12 parts along with vitamins B2, B5 and B7, a microbe like this one can help algae grow, which in turn feeds everything else in the inlet. It also makes natural antifreeze molecules that protect it in cold, salty water. Its genus has only a code name (ASP10-02a), and its family is named after a bacterium called Balneatrix. It is one of the cleanest, most complete genomes we found, found at all three seawater sites in both spring and fall.",
    ecoMore: [
      ["Why 'Balneatrix'?", "Its family, the Balneatricaceae, is named after the genus Balneatrix, Latin for 'bather'. Its own genus has only a code (ASP10-02a)."],
      ["What's a 'metabolic pathway'?", "A chain of chemical steps, like an assembly line, that turns one molecule into another. This genome has many complete ones, more than most microbes here."],
      ["How good is this genome?", "About 98% complete with almost no contamination, one of the cleanest genomes in the set."]
    ],
    fn: "It eats a wide menu, gets energy from sulfur, makes vitamins and antifreeze molecules, and carries instructions for a few special chemicals.",
    fnMore: [
      ["Energy roundabout (TCA cycle)", "The cell's main loop for burning food into energy."],
      ["Sulfur energy (Sox)", "A different set of sulfur enzymes from Tidal Thioglobus, also turning thiosulfate into sulfate."],
      ["Vitamins (B2, B5, B7, B12 parts)", "Riboflavin, pantothenate, biotin and pieces of cobalamin, which many plankton need but can't make."],
      ["Antifreeze molecules (glycine betaine, proline)", "Small molecules that protect the cell from cold and salt."],
      ["Special chemicals (biosynthetic gene clusters)", "Groups of genes that build unusual molecules, here a terpene, a betalactone and others. Some of these act as signals or antibiotics."]
    ]
  },
  "dastool-lorbin_051": {
    nickname: "Methanol-Munching Methylophilid",
    eco: "When algae grow and when they die, they release very small carbon molecules into the water, things like methanol, formate and methylamines. These one-carbon compounds are easy to overlook, but there is a lot of them, and if nobody used them some would build up or escape to the air. This microbe specialises in eating exactly these leftovers, so the carbon stays in the food web. It belongs to a family of bacteria called the 'methyl-lovers' (Methylophilaceae) because of that taste. It also carries a light-catching protein called a rhodopsin, related to the one in our own eyes, that works like a tiny solar panel and gives it extra energy on sunny days. Scientists first discovered these light pumps in ocean bacteria about 25 years ago and have since found them almost everywhere in sunlit seawater. Here it is found around the Dock, Itivia and Tuktuttaa in spring and fall.",
    ecoMore: [
      ["Why 'Methylophilid'?", "Its family, the Methylophilaceae, means 'methyl-lovers', after their taste for one-carbon (methyl) compounds. Its genus has only a code (BACL14)."],
      ["What is a rhodopsin?", "A light-catching protein, the same kind of molecule that lets our eyes see. In microbes it pumps charged particles across the cell's skin, working like a tiny solar panel."],
      ["Where do we find it?", "Around the Dock, Itivia and Tuktuttaa in spring and fall, where the reads match its genome at 96–98%."]
    ],
    fn: "It eats one-carbon leftovers, catches sunlight, makes B-vitamins and makes small antimicrobial peptides.",
    fnMore: [
      ["One-carbon food (methanol, formate, methylamines)", "The simplest carbon foods there are. Algae and decaying plankton release them."],
      ["Light pump (proteorhodopsin)", "Turns sunlight into a little extra energy."],
      ["Vitamins (B1, B7, B9)", "Thiamine, biotin and folate."],
      ["Lanthipeptides", "Small protein-like molecules that can stop other bacteria from growing, a kind of natural antibiotic."]
    ]
  },
  "dastool-comebin_6520": {
    nickname: "Fibre-Feasting Ferruginibacter",
    eco: "The lakes behind Chesterfield Inlet sit in tundra and stay frozen for much of the year. When the snow melts, water carries dead plant material from the land into the lakes, and every summer insects such as midges and mosquitoes hatch and shed their tough outer shells. Somebody has to recycle all of that, and bacteria like Ferruginibacter are among the main recyclers. This one glides along surfaces at the bottom and edges of the lakes and digests plant fibre and chitin, the hard material in insect shells, turning them back into nutrients that algae and other microbes can use. The genome comes mostly from lake samples further south in Manitoba; in Chesterfield's lakes we find a very close cousin, right on the line between being the same species and a different one.",
    ecoMore: [
      ["Is it really from here?", "The genome was built mostly from lake samples further south in Manitoba. In Chesterfield's lakes we find a very close cousin: its reads match at about 93–96%, right on the border between 'same species' and 'different species'."],
      ["What is chitin?", "The hard material in insect and crustacean shells. After cellulose, it is the most common natural material made by living things."],
      ["How does it glide?", "Without any tail, using a conveyor-belt system in its outer wall (the type IX secretion system) that also pushes out its enzymes."]
    ],
    fn: "It digests plant fibre and chitin, glides over surfaces, makes protective pigments and helps keep lake water clean.",
    fnMore: [
      ["Sugar enzymes (CAZymes: GH, GT and PL families)", "Families of enzymes that build or cut sugar chains. GH means 'glycoside hydrolase', a sugar cutter."],
      ["Sugar catchers and gliding (TonB receptors, type IX secretion)", "Doorways that pull food in, and the conveyor belt it moves and secretes with."],
      ["Protective pigments (carotenoids)", "Coloured molecules that protect against sunlight damage."],
      ["Water-quality score (EcoSSDB)", "A score for how much its genes might help filter wastes and keep lake water healthy."]
    ]
  },
  "dastool-comebin_4228": {
    nickname: "Plentiful Polynucleobacter",
    eco: "If you took a glass of water from 1st or 2nd Lake, Polynucleobacter would be one of the most common bacteria in it. Members of this genus are tiny, free-floating cells found in lakes and ponds all over the world. Tundra lakes are often slightly tea-coloured because water from the surrounding land carries dissolved organic matter into them. Polynucleobacter feeds on the small, simple molecules in that mix, such as acetate and citrate, and in doing so it passes carbon from the land into the lake's food web. Interestingly, the genus was first described not from lake water but from inside a single-celled pond animal (the ciliate Euplotes), where its relatives live as partners; free-living cousins like this one were found later. This species is already known from other lakes, but only by a code number. It is found in all three lakes, in spring and fall.",
    ecoMore: [
      ["Why so common?", "Polynucleobacter are among the most widespread freshwater bacteria in the world, and this species is one of the most abundant microbes in 1st and 2nd Lake."],
      ["Is it new?", "Scientists have found this species in other lakes but only gave it a code (sp037139315)."],
      ["What are 'organic acids'?", "Small molecules like acetate and citrate that come from decaying plants. For this microbe they are food."]
    ],
    fn: "It eats dissolved organic acids, runs a full energy cycle, gets energy from sulfur and makes vitamins B5, B7 and B9.",
    fnMore: [
      ["Energy roundabout (TCA cycle)", "The cell's main loop for burning food into energy."],
      ["Food pumps (ABC and TTT transporters)", "Molecular pumps that pull organic acids into the cell."],
      ["Sulfur energy (Sox)", "Turns thiosulfate into sulfate for a little extra energy."],
      ["Vitamins (B5, B7, B9)", "Pantothenate, biotin and folate."]
    ]
  },
  "dastool-comebin_3630": {
    nickname: "Northern Nitrotoga",
    eco: "Every lake has a nitrogen cycle. Animal waste and dead organisms release ammonia, other microbes turn ammonia into nitrite, and nitrite can harm fish if it builds up. Nitrotoga does the next step: it turns nitrite into nitrate, which algae and plants can use as fertilizer. What makes Nitrotoga special is that it keeps working in the cold. Scientists first grew it from frozen soil in Siberia in 2007, and it is often the main nitrite cleaner in cold lakes and soils where other microbes slow down. In Chesterfield Inlet we found it only in the late-May samples from 1st and 3rd Lake, when the lakes were still cold and probably still ice-covered, which fits its cold-loving lifestyle.",
    ecoMore: [
      ["What is the nitrogen cycle?", "Nitrogen moves from animal waste (ammonia) to nitrite to nitrate, which plants and algae can use. Nitrotoga does the nitrite → nitrate step."],
      ["Why 'toga'?", "Under the microscope Nitrotoga cells have a wide, loose outer layer, as if wrapped in a toga."],
      ["Where did we find it?", "Only in the late-May samples from 1st Lake and 3rd Lake, when the lakes were still cold, where the reads match its genome at about 96%."]
    ],
    fn: "It turns toxic nitrite into nitrate for energy, makes vitamins, grabs iron and helps keep the water clean.",
    fnMore: [
      ["Nitrite oxidoreductase (Nxr)", "The enzyme that does the nitrite-to-nitrate trick."],
      ["Cytochromes c", "Electron-carrying proteins that work like wires, passing energy along inside the cell."],
      ["Vitamins (B7, B9) and iron", "Biotin and folate, plus tools for taking up iron."],
      ["Water-quality score (EcoSSDB)", "A score for how much its genes might help keep freshwater and climate in balance."]
    ]
  }
};

// Published genus names for microbes whose genus already exists, from LPSN
// (https://lpsn.dsmz.de), fetched 2026-10-20. Etymologies are quoted as published.
window.GENERA = {
  Thioglobus: {
    full: "\"Candidatus Thioglobus\" Marshall and Morris 2013",
    etym: "Thi.o'glo.bus. Gr. neut. n. theîon, sulfur; L. masc. n. globus, ball, sphere, globe; N.L. masc. n. Thioglobus",
    gloss: "sulfur ball",
    status: "Candidatus name, not validly published",
    gender: "masculine", type: "\"Ca. Thioglobus singularis\"",
    ref: "Marshall KT, Morris RM (2013) Isolation of an aerobic sulfur oxidizer from the SUP05/Arctic96BD-19 clade. ISME J 7:452–455."
  },
  Polaribacter: {
    full: "Polaribacter Gosink et al. 1998",
    etym: "Po.la.ri.bac'ter. M.L. masc./fem. adj. polaris, pertaining to the geographic poles; N.L. masc. n. bacter, rod; from Gr. neut. n. baktron, for rod or staff; N.L. masc. n. Polaribacter, rod-shaped bacterium from a polar region",
    gloss: "rod from a polar region",
    status: "validly published under the ICNP",
    gender: "masculine", type: "Polaribacter filamentus",
    ref: "Gosink JJ, Woese CR, Staley JT (1998) Polaribacter gen. nov., with three new species, P. irgensii sp. nov., P. franzmannii sp. nov. and P. filamentus sp. nov., gas vacuolate polar marine bacteria of the Cytophaga-Flavobacterium-Bacteroides group and reclassification of 'Flectobacillus glomeratus' as Polaribacter glomeratus comb. nov. Int J Syst Bacteriol 48:223–235.",
    doi: "10.1099/00207713-48-1-223"
  },
  Ferruginibacter: {
    full: "Ferruginibacter Lim et al. 2009",
    etym: "Fer.ru.gi.ni.bac'ter. L. fem. n. ferrugo (gen. ferruginis), colour of iron rust; N.L. masc. n. bacter, a rod; N.L. masc. n. Ferruginibacter, rust-coloured rod",
    gloss: "rust-coloured rod",
    status: "validly published under the ICNP",
    gender: "masculine", type: "Ferruginibacter alkalilentus",
    ref: "Lim JH, Baek SH, Lee ST (2009) Ferruginibacter alkalilentus gen. nov., sp. nov. and Ferruginibacter lapsinanis sp. nov., novel members of the family 'Chitinophagaceae' in the phylum Bacteroidetes, isolated from freshwater sediment. Int J Syst Evol Microbiol 59:2394–2399.",
    doi: "10.1099/ijs.0.009480-0"
  },
  Polynucleobacter: {
    full: "Polynucleobacter Heckmann and Schmidt 1987",
    etym: "Po.ly.nu.cle.o.bac'ter. Gr. masc. adj. polys, numerous; L. masc. n. nucleus, nut, kernel; N.L. masc. n. bacter, rod; from Gr. neut. n. baktron, a rod; N.L. masc. n. Polynucleobacter, rod with many nucleoids",
    gloss: "rod with many nucleoids",
    status: "validly published under the ICNP",
    gender: "masculine", type: "Polynucleobacter necessarius",
    ref: "Heckmann K, Schmidt HJ (1987) Polynucleobacter necessarius gen. nov., sp. nov., an obligately endosymbiotic bacterium living in the cytoplasm of Euplotes aediculatus. Int J Syst Bacteriol 37:456–457."
  },
  Nitrotoga: {
    full: "\"Candidatus Nitrotoga\" Alawi et al. 2007",
    etym: "Ni.tro'to.ga. L. neut. n. nitrum, nitrate; L. fem. n. toga, Roman outer garment; N.L. fem. n. Nitrotoga",
    gloss: "nitrate toga",
    status: "Candidatus name, not validly published",
    gender: "feminine", type: "\"Ca. Nitrotoga arctica\"",
    ref: "Alawi M, Lipski A, Sanders T, Pfeiffer EM, Spieck E (2007) Cultivation of a novel cold-adapted nitrite oxidizing betaproteobacterium from the Siberian Arctic. ISME J 1:256–264.",
    doi: "10.1038/ismej.2007.34"
  }
};
