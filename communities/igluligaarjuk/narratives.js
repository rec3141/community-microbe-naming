// Plain-language nicknames and stories for each microbe, written for a community
// audience (kids and adults). `eco` / `fn` are the short "explain it simply" text on
// the Ecology and Function tabs; `ecoMore` / `fnMore` are [question, answer] pairs
// shown in collapsed boxes for anyone who wants the jargon explained.
// Facts here should match the data on the page (sites, seasons, same-species checks).
window.NARRATIVES = {
  "dastool-lorbin_055": {
    nickname: "Tidal Thioglobus",
    eco: "Chesterfield Inlet sits where a long inlet meets Hudson Bay, and for much of the year its water lies under sea ice. In the harbour, mud and rotting seaweed slowly release sulfur compounds, the source of that rotten-egg smell you sometimes notice at low tide. This microbe makes its living from that sulfur: it pulls energy out of it and uses the energy to build its body from carbon dioxide dissolved in the water, the way plants do with sunlight, except it works in the dark. Its close relatives, called the SUP05 group, are some of the most common bacteria in low-oxygen parts of the world's oceans, where they clean up sulfur and help control how much nitrogen is lost from the sea. Finding this one thriving in shallow harbour water is unusual, and it seems to have its stronghold right here in Igluligaarjuk: at the Dock in late May there were about 55 million of its cells in a litre of water. It also makes B-vitamins that algae and other plankton need but cannot make for themselves, so it quietly supports the food web around it.",
    ecoMore: [
      ["Why is Chesterfield Inlet special for it?", "We compared nearly 300 seawater samples from Chesterfield, Hudson Bay near Churchill and the High Arctic islands. Here we found it at the Dock and Tuktuttaa in late May and at Itivia in September and October, with up to about 55 million cells in a litre. Near Churchill it turned up in only 6 of about 190 samples, never more than about 2 million in a litre, and we did not find it among the High Arctic islands. The reads here match its genome at 96–97%, so it is the same species. Its relatives (the SUP05 group) usually live where there is little oxygen, like deep fjords."],
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
  "W02_polaribacter": {
    nickname: "Peckish Polaribacter",
    eco: "When the sun returns in spring, algae start growing on the underside of the sea ice and then in the open water as the ice breaks up. These algae, along with kelp along the shore, are the base of the Arctic food web, but much of what they make is locked up in tough sugars that most animals cannot digest. That is where Polaribacter comes in. Bacteria in this group are among the first to grow when algae bloom and die, and they break the sugars down into pieces that other microbes, and eventually small animals, can use. Scientists care about this step because it decides how much of the algae's carbon sinks to the sea floor and how much goes back into the water and air as carbon dioxide. This particular Polaribacter is a new species. We found the most of it at Tuktuttaa in late May, about 12 million cells in a litre of water, and smaller numbers at the Dock and Itivia in spring and fall. It is not only a Chesterfield microbe: it also lives in most of our samples from the Churchill River estuary and in some from Hudson Bay and the High Arctic islands. Its genome has genes for golden pigments that work like sunscreen against bright spring light reflecting off the ice, and a light-catching pump that gives it a little extra energy.",
    ecoMore: [
      ["What makes it new?", "Its DNA is only about 94% the same as the closest species scientists have read. Scientists usually call two genomes the same species when they share 95% or more, so it is a new species in a genus that already has a name."],
      ["Where do we find it?", "At Tuktuttaa and the Dock in late May, and at Itivia and the Dock in September. The most was at Tuktuttaa, about 12 million cells in a litre; elsewhere there were 3 to 4 million. The reads match its genome at 96–98%, so it is the same species. Polaribacter are often among the first microbes to bloom when algae grow."],
      ["What's a 'polysaccharide'?", "A long chain of sugars, like the slimy alginate in kelp or the laminarin stored inside algae. Most animals can't digest them; microbes like this one can."]
    ],
    fn: "It eats seaweed and algae sugars, grabs scarce iron, makes golden sunscreen pigments, catches a little sunlight for energy and keeps working at freezing temperatures.",
    fnMore: [
      ["Seaweed-sugar scissors (alginate lyases PL6, PL7, PL17; laminarinase GH16)", "Enzymes that cut alginate, the slimy sugar in brown seaweed, and laminarin, the sugar algae store, into small pieces the cell can eat."],
      ["Sugar catchers (TonB-dependent receptors)", "Doorways in the outer wall that pull big sugar pieces and iron into the cell. This genome has about 20 of them, a sign of a big eater."],
      ["Golden sunscreen (carotenoids and terpenes)", "Pigments that protect the cell from strong spring sunlight bouncing off snow and ice."],
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery."],
      ["Cold tools (cold-shock proteins)", "Proteins that keep the cell's machinery working near 0°C."]
    ]
  },
  "dastool-metabat_11223": {
    nickname: "Snow-Surfing Schleifer",
    eco: "Out in the water column, dead algae, waste and slime clump together into fluffy flakes that drift slowly down, a process scientists call 'marine snow'. Marine snow carries a large share of the ocean's carbon from the surface down to the sea floor, which is one reason the ocean helps take carbon dioxide out of the atmosphere. This microbe lives on those flakes. It holds on with sticky patches on its surface and nibbles the sugars stored inside the algae, so it helps decide how much of that carbon is recycled near the surface and how much keeps sinking. Its genus has only a code name, TMED14. In Chesterfield Inlet it was common in late May, with about 10 to 15 million cells in a litre of water at Tuktuttaa and the Dock. By September only a few hundred thousand were left, a small sign of how the microbial community changes through the year.",
    ecoMore: [
      ["What is marine snow?", "Sinking clumps of dead plankton, waste and slime. It is one of the main ways carbon travels from the sea surface down to the sea floor."],
      ["Why 'Schleifer'?", "Its family, the Schleiferiaceae, is named after the microbiologist Karl-Heinz Schleifer. Its genus has no name yet, only the code TMED14."],
      ["Where do we find it?", "In the late-May samples from Tuktuttaa and the Dock, about 10 to 15 million cells in a litre, where the reads match this genome at about 97%. At Itivia in September it was still there, but only a few hundred thousand cells in a litre. Outside Chesterfield we also found it among the High Arctic islands and a few times near Churchill."]
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
    eco: "Most of the bacteria living in the ocean have never been grown in a lab, and many have never been given a name; scientists sometimes call them 'microbial dark matter'. This microbe is a good example. It belongs to a big, well-known class of bacteria, the Gammaproteobacteria, but its family, genus and species have only code names. Even its order only got a name recently: Poriferisulfidales, after sulfur bacteria that live inside sea sponges. It also has one of the smallest genomes in our set. In cold, low-nutrient water, carrying extra genes is costly, so some microbes have trimmed their DNA down to the essentials. Even so, this one keeps a kit for getting energy from sulfur, factories for vitamins, and a CRISPR immune system, a record of viruses it has fought off before. Viruses infect huge numbers of ocean bacteria every day, so that defence matters. We find it in small numbers around the Dock and Itivia, a few million cells in a litre at most, mostly in the fall.",
    ecoMore: [
      ["Why 'Gamma'?", "It belongs to the Gammaproteobacteria, a huge class of bacteria. Its order, Poriferisulfidales, is named after sulfur bacteria that live inside sea sponges. Its family, genus and species have only a code name (GCA-2705445)."],
      ["What is a 'streamlined' genome?", "Where food is scarce, carrying extra genes costs energy, so some microbes lose every gene they don't need. Small genome, big job."],
      ["Where do we find it?", "In small numbers at the Dock and Itivia in September and at the Dock in late May, up to about 4 million cells in a litre. The reads match its genome at about 95–96%."]
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
    eco: "Some microbes are specialists that do one job very well. This one is a generalist: its genome contains a long list of complete chemical pathways, so it can switch between many different foods and ways of getting energy, including using sulfur. One of its most useful habits is making vitamins. Many algae need vitamin B12 to grow but cannot make it; they depend on bacteria nearby to supply it. By making B12 parts along with vitamins B2, B5 and B7, a microbe like this one can help algae grow, which in turn feeds everything else in the inlet. It also makes natural antifreeze molecules that protect it in cold, salty water. Its genus, Njordibacter, was proposed in 2025 by scientists studying Arctic sea bacteria and is named after Njord, the Norse god of wind and the sea. Its family is named after a bacterium called Balneatrix. It is one of the cleanest, most complete genomes we found. We found it at all three seawater sites in spring and fall, with the most at Tuktuttaa in late May, about 11 million cells in a litre of water. It also lives in Hudson Bay near Churchill and among the High Arctic islands.",
    ecoMore: [
      ["Why 'Balneatrix'?", "Its family, the Balneatricaceae, is named after the genus Balneatrix, Latin for 'bather'. Its own genus, Njordibacter, is named after Njord, the Norse god of wind and the sea."],
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
  "W06_methylophilid": {
    nickname: "Methanol-Munching Methylophilid",
    eco: "When algae grow and when they die, they release very small carbon molecules into the water, things like methanol and formate. These one-carbon compounds are easy to overlook, but there is a lot of them, and if nobody used them some would build up or escape to the air. This microbe specialises in eating exactly these leftovers, so the carbon stays in the food web. It belongs to a family of bacteria called the 'methyl-lovers' (Methylophilaceae) because of that taste. It also carries a light-catching protein called a rhodopsin, related to the one in our own eyes, that works like a tiny solar panel and gives it extra energy on sunny days. Scientists first discovered these light pumps in ocean bacteria about 25 years ago and have since found them almost everywhere in sunlit seawater. Here we found it at all three seawater sites in spring and fall, up to about 9 million cells in a litre of water. It is just as much at home across Hudson Bay: it turned up in more than half of our samples from near Churchill, and in some from the High Arctic islands.",
    ecoMore: [
      ["Why 'Methylophilid'?", "Its family, the Methylophilaceae, means 'methyl-lovers', after their taste for one-carbon (methyl) compounds. Its genus has only a code (BACL14)."],
      ["What is a rhodopsin?", "A light-catching protein, the same kind of molecule that lets our eyes see. In microbes it pumps charged particles across the cell's skin, working like a tiny solar panel."],
      ["Where do we find it?", "At the Dock and Tuktuttaa in late May, at Itivia and the Dock in September, and at Itivia in October, with 3 to 9 million cells in a litre. The reads match its genome at 96–98%, so it is the same species."],
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, and our genome matches it at about 99%, but it has only a code name. Almost half of its genes look like nothing scientists have studied yet."]
    ],
    fn: "It eats one-carbon leftovers, catches sunlight, makes B-vitamins and makes small antimicrobial peptides.",
    fnMore: [
      ["One-carbon food (methanol, formate)", "The simplest carbon foods there are. Algae and decaying plankton release them. Its genome has a methanol-eating enzyme (XoxF) and the enzymes that break down formate."],
      ["Light pump (proteorhodopsin)", "Turns sunlight into a little extra energy."],
      ["Vitamins (B1, B7, B9)", "Thiamine, biotin and folate."],
      ["Lanthipeptides", "Small protein-like molecules that can stop other bacteria from growing, a kind of natural antibiotic."]
    ]
  },
  "dastool-comebin_6520": {
    nickname: "Fibre-Feasting Ferruginibacter",
    eco: "The lakes behind Chesterfield Inlet sit in tundra and stay frozen for much of the year. When the snow melts, water carries dead plant material from the land into the lakes, and every summer insects such as midges and mosquitoes hatch and shed their tough outer shells. Somebody has to recycle all of that, and bacteria like Ferruginibacter are among the main recyclers. This one glides along surfaces at the bottom and edges of the lakes and digests plant fibre and chitin, the hard material in insect shells, turning them back into nutrients that algae and other microbes can use. The genome comes mostly from lake samples further south in Manitoba; in Chesterfield's lakes we find a very close cousin, right on the line between being the same species and a different one.",
    ecoMore: [
      ["Is it really from here?", "The genome was built mostly from lake samples further south in Manitoba. In Chesterfield's lakes we find a very close cousin: its reads match at about 95–96%, right on the border between 'same species' and 'different species'. We found it in 1st and 2nd Lake in September and October, up to about 3 million cells in a litre of water."],
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
  "W09_polynucleobacter": {
    nickname: "Persistent Polynucleobacter",
    eco: "Members of this genus are tiny, free-floating cells found in lakes and ponds all over the world. Tundra lakes are often slightly tea-coloured because water from the surrounding land carries dissolved organic matter into them. Polynucleobacter feeds on the small, simple molecules in that mix, such as acetate and citrate, and in doing so it passes carbon from the land into the lake's food web. Interestingly, the genus was first described not from lake water but from inside a single-celled pond animal (the ciliate Euplotes), where its relatives live as partners; free-living cousins like this one were found later. This species is already known from other lakes, but only by a code number. Here it turns up again and again in 2nd Lake: in September and October there were about 5 to 10 million of its cells in a litre of water. We also found it in 1st Lake in the fall and a little in 3rd Lake in late May.",
    ecoMore: [
      ["Where do we find it?", "Mostly in 2nd Lake, in almost every sample from September and October. Once, in 1st Lake in early October, there were about 9 million cells in a litre. The reads match its genome at about 95–97%, so it is the same species. Polynucleobacter are among the most widespread freshwater bacteria in the world, and we also found this species in lakes across Manitoba, from Lake Winnipeg to the Boreal Shield."],
      ["Is it new?", "Scientists have found this species in other lakes but only gave it a code (sp037139315). Our genome matches theirs at about 98%."],
      ["How complete is the genome?", "Our checks say it is almost 100% complete (99.8%), with almost no DNA from other microbes mixed in, one of the most complete genomes on this site."],
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
  "W11_nitrotoga": {
    nickname: "Northern Nitrotoga",
    eco: "Every lake has a nitrogen cycle. Animal waste and dead organisms release ammonia, other microbes turn ammonia into nitrite, and nitrite can harm fish if it builds up. Nitrotoga does the next step: it turns nitrite into nitrate, which algae and plants can use as fertilizer. What makes Nitrotoga special is that it keeps working in the cold. Scientists first grew it from frozen soil in Siberia in 2007, and it is often the main nitrite cleaner in cold lakes and soils where other microbes slow down. In Chesterfield Inlet we found it only in 3rd Lake in late May, about 3 million cells in a litre of water, when the lake was still cold and probably still ice-covered, which fits its cold-loving lifestyle. Further south it lives in the Churchill River estuary and in rivers and lakes across Manitoba, especially in the north.",
    ecoMore: [
      ["What is the nitrogen cycle?", "Nitrogen moves from animal waste (ammonia) to nitrite to nitrate, which plants and algae can use. Nitrotoga does the nitrite → nitrate step."],
      ["Why 'toga'?", "Under the microscope Nitrotoga cells have a wide, loose outer layer, as if wrapped in a toga."],
      ["Where did we find it?", "Only in the late-May sample from 3rd Lake, when the lake was still cold, where the reads match its genome at about 96%. The 1st Lake sample from the same day had some matching reads too, but it was too small a sample to be sure. Scientists have read this species' DNA before (our genome matches at about 99%), but it has only a code name."]
    ],
    fn: "It turns toxic nitrite into nitrate for energy, builds its body from carbon dioxide, makes vitamins and grabs iron.",
    fnMore: [
      ["Nitrite oxidoreductase (Nxr)", "The enzyme that does the nitrite-to-nitrate trick."],
      ["Cytochromes c", "Electron-carrying proteins that work like wires, passing energy along inside the cell."],
      ["Carbon catcher (RuBisCO, Calvin cycle)", "The same enzyme plants use to turn carbon dioxide into sugar. Nitrotoga runs it on energy from nitrite instead of sunlight."],
      ["Vitamins (B1, B7, B9) and iron", "Thiamine, biotin and folate, plus tools for taking up iron."],
      ["Water-quality score (EcoSSDB)", "A score for how much its genes might help keep water chemistry and climate in balance. Its nitrite genes give it a high score."]
    ]
  },
  "A2_planktophila": {
    nickname: "Pint-sized Planktophila",
    eco: "Planktophila means 'plankton-loving'. Its relatives, called acI bacteria, are some of the most common bacteria in lakes all over the world, and they are tiny: hundreds of them could line up across the width of a hair. This one has one of the smallest genomes of any microbe on this site, about 1.2 million letters. Small cells with small genomes waste little energy, which helps in lakes where food is scarce. We found it in all three lakes behind town, in May, September and October. It was most common in 2nd and 3rd Lake in mid-September, about 50 to 60 million cells in a litre of water, and there were about 40 million in a litre in 3rd Lake in late May. In hundreds of samples from lakes and rivers across Manitoba and around Hudson Bay we found this species only once, in small numbers in the Churchill River estuary; everywhere else there were only its cousins. As far as we know, the lakes behind town are its home.",
    ecoMore: [
      ["Is it a new species?", "Yes. Its closest known relatives share only about 91% of their DNA letters with it. Scientists usually call two genomes the same species when they share 95% or more."],
      ["Does it live anywhere else?", "Almost nowhere that we know of. Reads that match its genome at 95% or more come mostly from 1st, 2nd and 3rd Lake. Outside Chesterfield it turned up in just one sample, from the Churchill River estuary, with less than a million cells in a litre. Samples from other places carry relatives, not this one."],
      ["How small is small?", "Its whole genome is about 1.2 million DNA letters. Most bacteria have 3 to 5 million, and E. coli has about 4.6 million."]
    ],
    fn: "It floats in open water, takes in small sugars and other bits of food, and burns them with a full set of energy pathways. A light-driven pump in its outer layer lets it use sunlight for extra energy. It also makes vitamin B2 and has defences against viruses.",
    fnMore: [
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery. It needs a colourful molecule called retinal, made from beta-carotene, and the genome has the gene for that step too."],
      ["Sugar burning (glycolysis and TCA cycle)", "The main pathways for turning sugars into energy. All the steps are there."],
      ["Vitamin B2 (riboflavin)", "It can build riboflavin from scratch."],
      ["Virus defence (CRISPR-Cas)", "A memory system that stores pieces of viruses it has met, so it can recognise and cut them next time."],
      ["Cold-shock proteins", "Small proteins that help the cell keep working when the water gets cold."]
    ]
  },
  "N1_amylibacter": {
    nickname: "Sun-sipping Amylibacter",
    eco: "Amylibacter means 'starch rod'. Its relatives are small rod-shaped bacteria that float in cold ocean water and live on tiny bits of food that algae and other living things leave behind. We found the most of it at Itivia in mid-September, about 25 million cells in a litre of water. It was also at the Dock in late May and September and at Itivia again in October. It travels widely: we also found it in most of our samples from the Churchill River estuary on Hudson Bay, in many from Hudson Bay near Churchill and in some from the High Arctic islands. Its genome is about 2.2 million DNA letters long, and our checks say we have all of its genes.",
    ecoMore: [
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, and our genome matches it at 99.7%. But nobody has ever described it or given it a name. As far as science is concerned, it is still a new species."],
      ["How complete is the genome?", "Our checks say 100% complete, with very little DNA from other microbes mixed in. It has two copies of its ribosome genes and all 20 kinds of tRNA."]
    ],
    fn: "It eats small bits of food in seawater and burns them for energy. A light-driven pump in its outer layer lets it use sunlight for extra energy, and it can also get energy from a sulfur compound called thiosulfate. It makes or brings in glycine betaine, a small molecule that protects cells from salty, cold water.",
    fnMore: [
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery. It needs a colourful molecule called retinal, and the genome has the gene that makes retinal from beta-carotene."],
      ["Sulfur energy (Sox)", "A full set of Sox genes, which take electrons from thiosulfate. The cell uses them for energy, a bit like a battery."],
      ["Salt and cold protection (glycine betaine)", "Pumps that bring glycine betaine into the cell and enzymes that make it from choline. Inside the cell it keeps water from leaving in salty or freezing conditions."],
      ["Vitamin B12", "It has most of the genes to build vitamin B12, which many algae need but cannot make themselves."]
    ]
  },
  "N2_caivzm01": {
    nickname: "The 2nd Lake Mystery",
    eco: "This bacterium belongs to a group called Armatimonadota. Scientists know very little about this group, and only a few of its members have ever been grown in a lab. In Chesterfield Inlet it lives in 2nd Lake. We found it in every sample from 2nd Lake in September and October, and in mid-September there were about 70 million of its cells in a litre of water, one of the highest counts for any microbe on this site. We found only a little of it in 1st Lake and almost none in 3rd Lake. In lake and river samples from Manitoba we found only its cousins, not this species.",
    ecoMore: [
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, from somewhere else, and our genome matches it at 98.9%. But nobody has ever described it or given it a name, and the same is true for the group of species it belongs to. As far as science is concerned, both its genus and its species are still new."],
      ["Why is it a mystery?", "About two out of every three of its genes look like nothing scientists have studied before, so we cannot tell what they do."],
      ["Why only 2nd Lake?", "We don't know yet. Each lake has its own water chemistry, depth and plants around it, and small differences like these can decide which microbes do well."]
    ],
    fn: "It burns sugars with a full set of energy pathways. It has enzymes that can break down tough fibres from plants (cellulose), insect and crustacean shells (chitin) and seaweed-like sugars (alginate). A light-driven pump gives it extra energy from sunlight. It also carries many CRISPR genes, so it has strong defences against viruses.",
    fnMore: [
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery. The genome also has the gene that makes retinal, the coloured molecule the pump needs."],
      ["Fibre breakers (cellulase, chitinase, alginate lyase)", "Enzymes that cut long chains of sugar into small pieces the cell can eat. Dead plants and insects that fall into the lake are full of these chains."],
      ["Virus defence (CRISPR-Cas)", "A memory system that stores pieces of viruses it has met, so it can recognise and cut them next time. This genome has more CRISPR genes than most."],
      ["Vitamin B2 (riboflavin)", "It can build riboflavin from scratch."]
    ]
  },
  "N3_peredibacter": {
    nickname: "Peckish Peredibacter",
    eco: "Peredibacter means 'bacterium-devourer'. Its relatives are hunters: they swim into a bigger bacterium, slip inside its outer wall, eat it from the inside and then burst out as several new cells. Hunters like this help keep other bacteria in check, a little like wolves and caribou. We found this one in 1st Lake, where one sample held about 140 million of its cells in a litre of water, a huge number for a hunter. Another 1st Lake sample had about 25 million, and we found almost none in the other lakes. We did not find it anywhere else we have samples from.",
    ecoMore: [
      ["Is it a new species?", "Yes. Its closest known relative shares only about 87% of its DNA letters with it. Scientists usually call two genomes the same species when they share 95% or more."],
      ["How does it find its prey?", "Its genome has many genes for a flagellum, a whip-like tail for swimming, and for sensors that tell the cell which way to swim. Its relatives swim very fast and crash into their prey."],
      ["What do most of its genes do?", "We don't know. About three out of every four of its genes look like nothing scientists have studied before."]
    ],
    fn: "Like its relatives, it probably hunts other bacteria and uses their insides as food. Its genome has the parts for a flagellum to swim with, sensors to steer by, and many enzymes that cut up proteins and fats, which is what a cell eating another cell needs. It also burns sugars with a full set of energy pathways.",
    fnMore: [
      ["Swimming (flagellum)", "More than 30 genes for building a flagellum, a long spinning tail that pushes the cell through water."],
      ["Steering (chemotaxis)", "Sensors that detect chemicals in the water so the cell can swim toward food."],
      ["Protein and fat cutters (peptidases, lipases)", "More than 100 enzymes that cut proteins and fats into small pieces. Hunters use enzymes like these to digest their prey."],
      ["Sugar burning (glycolysis and TCA cycle)", "The main pathways for turning sugars into energy. All the steps are there."]
    ]
  },
  "N4_bdellovibrio": {
    nickname: "Bullet-fast Bdellovibrio",
    eco: "Bdellovibrio means 'leech-like vibrio', a vibrio being a small curved rod. Its relatives are famous hunters: they are among the fastest swimmers for their size, crash into a bigger bacterium, drill through its wall, eat it from the inside and burst out as new cells. We found this one in 2nd Lake. In one sample there were about 180 million of its cells in a litre of water, a lot for a hunter. We found almost none in our other lake samples, and none anywhere else we have samples from.",
    ecoMore: [
      ["Is it a new species?", "Yes. No genome scientists have read so far is close enough for our tools to measure how similar it is, so it is quite far from every known Bdellovibrio."],
      ["Why would a hunter be so common?", "When its prey is plentiful, a hunter can multiply quickly. One sample catches one moment, so it may have been a time when there was lots to eat."],
      ["Can hunters like this help people?", "Scientists are studying Bdellovibrio as a living medicine that could kill bacteria that cause infections, because it does not need antibiotics to work."]
    ],
    fn: "Like its relatives, it probably hunts other bacteria and uses their insides as food. Its genome has the parts for a flagellum to swim with, more than 30 sensor genes to steer by, a short grappling hook (a pilus) like the one its relatives use to grab prey, and many enzymes that cut up proteins and fats.",
    fnMore: [
      ["Swimming (flagellum)", "More than 30 genes for building a flagellum, a long spinning tail that pushes the cell through water."],
      ["Steering (chemotaxis)", "Sensors that detect chemicals in the water so the cell can swim toward food."],
      ["Grappling hook (type IV pilus)", "A thin hair that can stick to a surface and pull. Bdellovibrio relatives use one to grab their prey and pull themselves inside."],
      ["Protein and fat cutters (peptidases, lipases)", "More than 100 enzymes that cut proteins and fats into small pieces, which is what digesting prey needs."],
      ["Rod shape (mreBCD, rodA)", "Genes that build the cell wall in a rod shape."]
    ]
  },
  "N5_uba845": {
    nickname: "The Harbour Hunter",
    eco: "This bacterium belongs to a family of hunters called Bacteriovoracaceae, which means 'bacteria-eaters'. Its relatives swim into a bigger bacterium, slip inside its outer wall, eat it from the inside and then burst out as several new cells. Many of them live in salty water. We found this one at the Dock and at Tuktuttaa, where one sample from each place held about 150 million of its cells in a litre of water, a lot for a hunter. There may be a trace at Itivia too. In our samples from Hudson Bay near Churchill and from the High Arctic islands we found only its cousins, not this species.",
    ecoMore: [
      ["Is it a new species?", "Yes, and it does not fit in any named genus either. Its closest known relative shares only about 86% of its DNA letters with it. Scientists usually call two genomes the same species when they share 95% or more."],
      ["Why do hunters matter?", "Hunters keep other bacteria in check, a little like wolves and caribou. When a hunter bursts out of its prey, the leftovers become food for other microbes."]
    ],
    fn: "Like its relatives, it probably hunts other bacteria and uses their insides as food. Its genome has the parts for a flagellum to swim with, sensors to steer by and many enzymes that cut up proteins and fats. It also makes and takes in glycine betaine, which protects cells from salty water.",
    fnMore: [
      ["Swimming (flagellum)", "More than 30 genes for building a flagellum, a long spinning tail that pushes the cell through water."],
      ["Steering (chemotaxis)", "Sensors that detect chemicals in the water so the cell can swim toward food."],
      ["Protein and fat cutters (peptidases, lipases)", "More than 100 enzymes that cut proteins and fats into small pieces, which is what digesting prey needs."],
      ["Salt protection (glycine betaine)", "Pumps and enzymes for glycine betaine, a small molecule that keeps water inside the cell in salty conditions."]
    ]
  },
  "N6_k1": {
    nickname: "The Carbon-Catching Sulfur Ball",
    eco: "Pseudothioglobus means 'false sulfur ball'. Its relatives are small round or curved cells that are common in the ocean, especially where the water holds little oxygen. Many of them get energy from sulfur and use it to turn carbon dioxide into food, the way plants do with sunlight. In Chesterfield Inlet we found it at Itivia, the Dock and Tuktuttaa. There were about 30 to 40 million of its cells in a litre of water at the Dock in late May and at Itivia in mid-September, so it is here in both spring and fall. It is not only a Chesterfield microbe: we also found it in about a third of our samples from Hudson Bay near Churchill and from the High Arctic islands.",
    ecoMore: [
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, and our genome matches it at about 98%. But nobody has ever described it or given it a name. As far as science is concerned, it is still a new species."],
      ["Is the Chesterfield one exactly the same?", "Almost. Reads from the inlet match our genome at about 95–96%, right on the border between 'same species' and 'different species'. The inlet may have its own close cousin."],
      ["How complete is the genome?", "Our checks say about 90% complete, so a few of its genes are probably missing from what we have."]
    ],
    fn: "It has RuBisCO, the same enzyme plants use to turn carbon dioxide from the air and water into sugar. It also has some of the genes its relatives use to get energy from sulfur compounds, and a light-driven pump for extra energy from sunlight. It makes vitamins B1 and B7 (biotin), and brings in glycine betaine to protect itself from salty, cold water.",
    fnMore: [
      ["Carbon catcher (RuBisCO)", "RuBisCO grabs carbon dioxide and turns it into sugar, so this microbe can make its own food instead of eating it."],
      ["Sulfur energy (Sat and Apr)", "Two of the three steps its relatives use to get energy from sulfur. The third step (Dsr) was not found. It may be in the part of the genome we are missing."],
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery."],
      ["Vitamins B1 and B7", "It can build thiamine (B1) and biotin (B7) from scratch. Many algae and other microbes need these vitamins but cannot make them."],
      ["Salt and cold protection (glycine betaine)", "Pumps that bring glycine betaine into the cell, where it keeps water from leaving in salty or freezing conditions."]
    ]
  },
  "N7_marimicrobium": {
    nickname: "The Autumn Oil-Nibbler",
    eco: "Marimicrobium means 'small marine microbe'. The first member of this genus to be described was found in sea sand, and its relatives live in seawater. In Chesterfield Inlet this one is a fall microbe. We found the most of it at Itivia in early October, about 36 million cells in a litre of water, and about 25 million at the Dock on the same day. In mid-September there were about 18 million in a litre at the Dock and about 13 million at Itivia. In late May we found only a few million at Tuktuttaa and the Dock. It is even more at home further south: we found it in every one of our samples from the Churchill River estuary on Hudson Bay, in about two out of three samples from the High Arctic islands and in many from Hudson Bay near Churchill.",
    ecoMore: [
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, and our genome matches it at about 96%. But nobody has ever described it or given it a name. As far as science is concerned, it is still a new species."],
      ["How complete is the genome?", "Our checks say about 96% complete, with very little DNA from other microbes mixed in. It has one copy of each ribosome gene (16S, 23S and 5S) and all 20 kinds of tRNA."],
      ["Why more in the fall?", "We don't know yet. By fall the water has had a whole summer of algae growing and dying, and many microbes that live on what algae leave behind become more common. Samples from more months would help tell."]
    ],
    fn: "It burns sugars and other food with a full set of energy pathways. It has an enzyme called CYP153 that can start breaking down alkanes, the oily chain molecules found in fuel and also made in small amounts by algae. Two light-driven pumps give it extra energy from sunlight. It makes glycine betaine to protect itself from salty, cold water, and it can build vitamins B2, B7 and B9.",
    fnMore: [
      ["Oil breaker (CYP153)", "An enzyme that adds oxygen to one end of an alkane chain, the first step in breaking it down. Our check found this gene with high confidence."],
      ["Light pumps (rhodopsin)", "Proteins in the cell membrane that use sunlight to push charged particles out of the cell, like charging a battery. This genome has two of them."],
      ["Salt and cold protection (glycine betaine)", "Enzymes that make glycine betaine from choline, and pumps that bring it in. Inside the cell it keeps water from leaving in salty or freezing conditions."],
      ["Taking sulfur from DMSP (dmdA)", "DMSP is a molecule many algae make. This microbe has the enzyme that pulls a piece off DMSP so the cell can keep its sulfur, instead of letting it turn into the gas that gives the seashore its smell."],
      ["Vitamins B2, B7 and B9", "It can build riboflavin (B2), biotin (B7) and folate (B9) from scratch."],
      ["Rod shape (mreBCD, rodA)", "Genes that build the cell wall in a rod shape."]
    ]
  },
  "N8_uba9145": {
    nickname: "The Hudson Bay Commuter",
    eco: "This bacterium belongs to a family called Pseudohongiellaceae, but its genus and species have only code names. In Chesterfield Inlet we found it in the fall: about 9 million of its cells in a litre of water at Itivia in mid-September, and about 5 million at Itivia in early October and at the Dock in mid-September. It is much more common out in Hudson Bay. It turned up in more than two out of three of our samples from Hudson Bay near Churchill, where one sample held about 74 million cells in a litre. We also found it in most of our samples from the Churchill River estuary and in some from the High Arctic islands.",
    ecoMore: [
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, and our genome matches it at about 97%. But nobody has ever described it or given it a name, and the same is true for the group of species it belongs to. As far as science is concerned, both its genus and its species are still new."],
      ["How complete is the genome?", "Our checks say about 90% complete, so a few of its genes are probably missing. It comes in 174 pieces, like a book with its pages torn out and only some of them put back in order."],
      ["Why is it more common near Churchill?", "We don't know yet. Hudson Bay near Churchill gets water from big rivers and has different ice and currents than the inlet. Comparing the water at both places through the year could help explain it."]
    ],
    fn: "It eats small bits of food in seawater and can swim with a flagellum, a whip-like tail. It has an enzyme called CYP153 that can start breaking down alkanes, the oily chain molecules in fuel that algae also make in small amounts. A light-driven pump gives it extra energy from sunlight. It stores spare phosphorus, and it has cold-shock proteins that help it keep working near freezing.",
    fnMore: [
      ["Swimming (flagellum)", "Genes for flagellin, the building block of the flagellum, and for the motor that spins it."],
      ["Oil breaker (CYP153)", "An enzyme that adds oxygen to one end of an alkane chain, the first step in breaking it down. Our check found this gene with high confidence."],
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery. The genome also has the gene that makes retinal, the coloured molecule the pump needs."],
      ["Phosphorus savings (polyphosphate kinase)", "Enzymes that store spare phosphorus as long chains, so the cell has some when phosphorus runs low."],
      ["Cold-shock proteins", "Small proteins that help the cell keep reading its genes when the water gets near freezing."]
    ]
  },
  "N9_uba10364": {
    nickname: "The Seaweed-Slicing Glider",
    eco: "This bacterium belongs to the Flavobacteriales, a big group of bacteria that are experts at breaking down the sugars in seaweed and algae. Its genus and species have only code names. We found it at all three seawater sites: about 14 million of its cells in a litre of water at Itivia in mid-September, about 12 million at Tuktuttaa and 11 million at the Dock in late May, and about 6 million at the Dock in mid-September. It is also at home in the High Arctic: it turned up in more than half of our samples from the High Arctic islands, where one sample held about 35 million cells in a litre. We also found it in about half of our samples from the Churchill River estuary and in some from Hudson Bay near Churchill.",
    ecoMore: [
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, and our genome matches it at about 98.5%. But nobody has ever described it or given it a name, and the same is true for the group of species it belongs to. As far as science is concerned, both its genus and its species are still new."],
      ["How complete is the genome?", "Our checks say 100% complete. It has one copy of each ribosome gene (16S, 23S and 5S) and 17 of the 20 kinds of tRNA."],
      ["How does a bacterium glide?", "It has no tail. Instead, proteins in its outer layer move along tracks around the cell, a little like the treads on a snowmobile, so it slides over surfaces such as seaweed or bits of algae."]
    ],
    fn: "It cuts long sugar chains from seaweed and algae into pieces, catches the pieces with 'grab-and-pull' proteins at its surface, and glides over surfaces to reach its food. A light-driven pump gives it extra energy from sunlight, and it makes carotenoids, the same kind of colourful molecules found in carrots.",
    fnMore: [
      ["Seaweed sugar cutters (alginate lyase, GH16)", "Eight genes from the alginate-lyase family, which cut alginate, the slimy sugar in brown seaweed, and two GH16 enzymes, which cut the sugars algae store for food."],
      ["Grab-and-pull proteins (SusC, SusD)", "SusD grabs a long sugar chain at the cell surface and SusC pulls it inside, like two people hauling in a net. This genome has three of each."],
      ["Gliding (Gld genes)", "Genes for the gliding machine (GldB, GldC, GldD, GldL, GldM and GldN) that lets the cell slide over surfaces without a tail."],
      ["Sticky patches (PKD domains)", "29 proteins with PKD parts, which often help proteins hold on to surfaces or to each other."],
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery."]
    ]
  },
  "N10_uba9320": {
    nickname: "The Three-Quarters Mystery",
    eco: "This bacterium belongs to a branch of the Bacteroidia called NS11-12. Its order, family, genus and species all have only code names. In Chesterfield Inlet it was most common in late May: there were about 14 million of its cells in a litre of water at Tuktuttaa, and about 9 million at Itivia and at the Dock. In mid-September there were still about 6 million in a litre at the Dock and 4 million at Itivia. It is not only a Chesterfield microbe: we found it in every one of our samples from the Churchill River estuary, in almost half of those from the High Arctic islands and in more than a third of those from Hudson Bay near Churchill.",
    ecoMore: [
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, and our genome matches it at about 96%. Only about half of our genome could be compared, so the match is less certain than usual. Nobody has ever described this species or its genus or given them names, so both are still new."],
      ["Why is it a mystery?", "About three out of every four of its genes look like nothing scientists have studied before, so we cannot tell what they do."],
      ["How complete is the genome?", "Our checks say about 99% complete, but it comes in 225 pieces. One gene is missing: we did not find its 16S rRNA gene, the gene scientists most often use to identify bacteria. It is probably in a piece we could not put together."]
    ],
    fn: "Most of its genes are a mystery, but the ones we can read tell part of the story. A light-driven pump gives it extra energy from sunlight, and the genome has the gene that makes retinal, the coloured molecule the pump needs. It has genes for gliding over surfaces, almost 50 proteins with sticky PKD parts and a few enzymes that cut sugar chains, so it probably lives on particles and bits of algae.",
    fnMore: [
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery. The genome also has the gene that makes retinal."],
      ["Gliding (Gld genes)", "Genes for the gliding machine (GldB, GldD, GldF, GldH, GldJ, GldK, GldL and GldM) that lets the cell slide over surfaces without a tail."],
      ["Sticky patches (PKD domains)", "47 proteins with PKD parts, which often help proteins hold on to surfaces or to each other."],
      ["Sugar cutters (GH16, GH18)", "A GH16 enzyme that cuts the sugars algae store, an enzyme with chitin-binding parts, and SusC and SusD proteins that grab sugar chains and pull them in."],
      ["Pigments (carotenoids)", "Genes for making carotenoids, colourful molecules that can protect cells from strong light."]
    ]
  },
  "N12_nitrosopumilus": {
    nickname: "The Ammonia-Powered Archaeon",
    eco: "Nitrosopumilus means 'a dwarf producing nitrite'. It is not a bacterium but an archaeon. Archaea look a lot like bacteria under a microscope, but they are a separate branch of life, with their own kind of cell membrane. Its relatives are tiny rod-shaped cells, and they are among the most common microbes in the ocean. They get their energy from ammonia, which comes from animal waste and dead things, and turn it into nitrite: the first step of the nitrogen cycle in the sea. In Chesterfield Inlet we found it mostly in late May: about 18 million of its cells in a litre of water at the Dock and about 11 million at Tuktuttaa. In mid-September there was only about 1 million in a litre at the Dock and at Itivia. We also found it in some of our samples from the Churchill River estuary, from Hudson Bay near Churchill and from the High Arctic islands.",
    ecoMore: [
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, and our genome matches it at about 95.4%, just above the 95% line for 'same species'. Only a bit less than half of our genome could be compared, so the match is not certain. Nobody has ever described this species or given it a name."],
      ["What is an archaeon?", "Living things are sorted into three big groups called domains: Bacteria, Archaea, and Eukarya (plants, animals, fungi and other cells with a nucleus). Many archaea were first found in hot springs and very salty ponds, but scientists now know they live almost everywhere, including in cold seawater."],
      ["How complete is the genome?", "Our checks say about 92% complete, in 237 pieces. We found only its 5S rRNA gene; its 16S and 23S genes are probably in pieces we could not put together. Many of the DNA pieces we sorted into this genome turned out to belong to viruses that were mixed in by mistake, which is why so many of its genes look unfamiliar."]
    ],
    fn: "It makes energy by turning ammonia into nitrite with an enzyme called ammonia monooxygenase, and our genome has all three of its parts (AmoA, AmoB and AmoC). It has five pumps for bringing ammonium into the cell. It also has a key gene of the cycle its relatives use to turn carbon dioxide into food, many genes for building vitamin B12, and genes for making vitamin B1 (thiamine).",
    fnMore: [
      ["Ammonia energy (amoA, amoB, amoC)", "Ammonia monooxygenase adds oxygen to ammonia, the first step in turning it into nitrite. Archaea like this one can work even when there is very little ammonia, which helps them live in the open ocean."],
      ["Ammonium pumps", "Five transporter proteins that pull ammonium into the cell, so it can collect its fuel even when there is very little around."],
      ["Carbon catcher (4-hydroxybutyryl-CoA dehydratase)", "A key enzyme of the carbon-fixing cycle its relatives use to turn carbon dioxide into food without sunlight."],
      ["Vitamin B12", "More than ten genes for building cobalamin (vitamin B12). Many algae need B12 but cannot make it themselves."],
      ["Food storage (PHA)", "Enzymes that make polyhydroxyalkanoate, a plastic-like material some cells store as a food reserve."]
    ]
  },
  "N11_caisji01": {
    nickname: "The Budding Giant of 2nd Lake",
    eco: "This bacterium belongs to the Planctomycetota, an unusual group of bacteria. Many of them do not have FtsZ, the protein most bacteria use to pinch in two. Instead they grow a bud that swells into a new cell, a bit like yeast. We did not find FtsZ in this genome either. Its genome is big, about 4.6 million DNA letters. In Chesterfield Inlet it lives in 2nd Lake. We found it in every dated sample from 2nd Lake in September and October, with about 137 million of its cells in a litre of water in early October and about 64 million in mid-September. We found smaller numbers in 1st Lake, up to about 6 million in a litre, and none in 3rd Lake. Further south we found it in small numbers in 3 of 5 freshwater samples from the Churchill River estuary, and not at all in our hundreds of lake samples from Manitoba.",
    ecoMore: [
      ["Is it a new species?", "Yes. Its closest known relative shares only about 91.5% of its DNA letters with it. Scientists usually call two genomes the same species when they share 95% or more. Its genus has only a code name, so both its genus and its species are new."],
      ["How big is its genome?", "About 4.6 million DNA letters with about 3,750 genes. About 60% of its genes look like nothing scientists have studied before."],
      ["Does it swim?", "Its genome has some of the genes for a flagellum and for sensors that tell a cell which way to swim. Some of its relatives have a swimming stage, so it might too."]
    ],
    fn: "It has 28 sulfatases, enzymes that cut sulfate tags off sugars. Many sugars made by algae and water plants carry these tags, and they must come off before the sugar can be eaten. A light-driven pump gives it extra energy from sunlight, and the genome has the gene that makes retinal, the coloured molecule the pump needs. It makes hopanoids, molecules that stiffen its membrane the way cholesterol does in our cells, and carotenoid pigments. Its genome also holds 12 clusters of genes for making special chemicals.",
    fnMore: [
      ["Sulfate cutters (sulfatases)", "28 enzymes that snip sulfate groups off sugars, so the cell can eat sugars that other microbes cannot."],
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery."],
      ["Membrane stiffeners (squalene-hopene cyclase)", "This enzyme folds a long oily molecule into hopanoids, ring-shaped molecules that work like cholesterol in our cells and keep the membrane firm."],
      ["Chitin cutters (GH18)", "Enzymes that cut chitin, the tough material in insect and crustacean shells."],
      ["Special chemicals (antiSMASH)", "12 gene clusters for making natural products such as terpenes and polyketides. Microbes use molecules like these to signal or defend themselves, and some have become medicines."]
    ]
  },
  "N13_mycobacterium": {
    nickname: "The Waxy-Coated Lake Rod",
    eco: "Mycobacterium means 'fungus rodlet'. These rod-shaped bacteria wrap themselves in a thick, waxy coat, which makes them tough and hard to dry out. Most kinds live in soil and water. In Chesterfield Inlet this one lives in 1st Lake. In mid-September there were about 23 to 31 million of its cells in a litre of water in all three samples from 1st Lake, and about 11 million in early October. We found only a little of it in 2nd Lake, and the DNA there matched a bit less closely, so it may be a cousin. Further south we found it in most of our samples from the Churchill River estuary and the Churchill River weir, and in some lakes in southern Manitoba and on the Boreal Shield.",
    ecoMore: [
      ["Is it a new species?", "Yes. Its closest known relative shares about 94% of its DNA letters with it, just under the 95% line scientists use for 'same species'."],
      ["Is it related to tuberculosis?", "It is in the same genus as the bacterium that causes tuberculosis (TB). But Mycobacterium is a big genus, and most of its members live in soil and water and do not make people sick. This one is a different, new species living free in lake water, not the TB species. A genome alone cannot prove a microbe is harmless, but mycobacteria that live in lakes and soil do not spread from person to person the way TB does. Studying species like it helps scientists understand the whole genus."],
      ["How complete is the genome?", "Our checks say about 91% complete. It has one 16S, two 23S and two 5S rRNA genes, and all 20 kinds of tRNA."]
    ],
    fn: "It builds the waxy coat its genus is known for, from long fatty molecules called mycolic acids. It has three light-driven pumps for extra energy from sunlight, and RuBisCO, the enzyme plants use to turn carbon dioxide into sugar. It makes trehalose, a sugar that helps protect cells from drying and freezing, and its genome holds nine clusters of genes for making special chemicals.",
    fnMore: [
      ["Waxy coat (pks13, fadD32, mmpL3)", "Pks13 joins two long fatty chains into a mycolic acid, FadD32 gets one of the chains ready, and MmpL3 carries the finished molecules out to the cell's surface."],
      ["Light pumps (rhodopsin)", "Proteins in the cell membrane that use sunlight to push charged particles out of the cell, like charging a battery. This genome has three of them."],
      ["Carbon catcher (RuBisCO)", "Both parts of RuBisCO (the large and the small piece) and most of the Calvin cycle. We do not know yet how much it uses them."],
      ["Secretion doorway (ESX)", "Genes for a type VII secretion system, a special doorway mycobacteria use to send small proteins out through the waxy coat."],
      ["Fat importers (Mce)", "18 Mce proteins, which its relatives use to bring fats and similar molecules into the cell."]
    ]
  },
  "N14_atzt02": {
    nickname: "The 3rd Lake Crowd",
    eco: "This bacterium belongs to the Actinomycetota, a big group of bacteria, but its order, family, genus and species have only code names. Its genome is small, about 1.4 million DNA letters. Small cells with small genomes waste little energy, which helps in lakes where food is scarce. In Chesterfield Inlet it lives in 3rd Lake, and in the fall there is a lot of it: in mid-September and early October there were about 110 to 180 million of its cells in a litre of water, one of the highest counts for any microbe on this site. It was already there in late May, about 7.5 million in a litre, and we found smaller numbers in 2nd Lake, up to about 10 million. Far to the south it lives in lakes near The Pas in Manitoba, where one sample held even more, and in a few samples from the Nelson River and other Manitoba lakes.",
    ecoMore: [
      ["Is it a new species?", "Not quite. Scientists have read the DNA of this species before, and our genome matches it at about 97.7%. But nobody has ever described it or given it a name, and the same is true for the group of species it belongs to. As far as science is concerned, both its genus and its species are still new."],
      ["Why so many in 3rd Lake?", "We don't know yet. Each lake has its own depth, water chemistry and plants around it. In 1st Lake we found only traces of its cousins. Comparing the three lakes through the year could help explain it."],
      ["How complete is the genome?", "Our checks say about 90% complete. It has one copy of each ribosome gene (16S, 23S and 5S) and all 20 kinds of tRNA."]
    ],
    fn: "It takes in small bits of food from the water. A light-driven pump gives it extra energy from sunlight. It brings in glycine betaine and proline, small molecules that protect cells when the water around them changes, for example when lake ice forms and squeezes salts into the water below, and it has genes that may make glycine betaine too. Its genome has the genes for a rod shape, and cold-shock proteins that help it keep working near freezing.",
    fnMore: [
      ["Light pump (rhodopsin)", "A protein in the cell membrane that uses sunlight to push charged particles out of the cell, like charging a battery."],
      ["Salt protection (glycine betaine and proline)", "A complete pump system that brings glycine betaine and proline into the cell, where they keep water from leaving."],
      ["Phosphorus pumps and savings", "A complete phosphate pump and an enzyme that stores spare phosphorus as long chains."],
      ["Rod shape (mreBCD, rodA)", "Genes that build the cell wall in a rod shape."],
      ["Cold-shock proteins", "Small proteins that help the cell keep reading its genes when the water gets near freezing."]
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
  },
  Planktophila: {
    full: "\"Candidatus Planktophila\" Jezbera et al. 2009",
    etym: "Plank.to'phi.la. Gr. masc. adj. planktos, wandering; German neut. n. Plankton, plankton; N.L. fem. adj. suff. -phila, friend, loving (from Gr. fem. adj. philê); N.L. fem. n. Planktophila, plankton-loving",
    gloss: "plankton-loving",
    status: "Candidatus name, not validly published",
    gender: "feminine",
    type: "\"Ca. Planktophila limnetica\"",
    ref: "Jezbera J, Sharma AK, Brandt U, Doolittle WF, Hahn MW (2009) 'Candidatus Planktophila limnetica', an actinobacterium representing one of the most numerically important taxa in freshwater bacterioplankton. Int J Syst Evol Microbiol 59:2864–2869.",
    doi: "10.1099/ijs.0.010199-0"
  },
  Amylibacter: {
    full: "Amylibacter Teramoto and Nishijima 2014",
    etym: "A.my.li.bac'ter. L. neut. n. amylum, starch; N.L. masc. n. bacter, rod; N.L. masc. n. Amylibacter, a rod growing well with starch",
    gloss: "starch rod",
    status: "validly published under the ICNP",
    gender: "masculine",
    type: "Amylibacter marinus",
    ref: "Teramoto M, Nishijima M (2014) Amylibacter marinus gen. nov., sp. nov., isolated from surface seawater. Int J Syst Evol Microbiol 64:4016–4020.",
    doi: "10.1099/ijs.0.065847-0"
  },
  Peredibacter: {
    full: "Peredibacter Davidov and Jurkevitch 2004",
    etym: "Per.e.di.bac'ter. L. inf. v. peredere, to eat up, to devour; N.L. masc. n. bacter, rod; N.L. masc. n. Peredibacter, bacterium-devourer",
    gloss: "bacterium-devourer",
    status: "validly published under the ICNP",
    gender: "masculine",
    type: "Peredibacter starrii",
    ref: "Davidov Y, Jurkevitch E (2004) Diversity and evolution of Bdellovibrio-and-like organisms (BALOs), reclassification of Bacteriovorax starrii as Peredibacter starrii gen. nov., comb. nov., and description of the Bacteriovorax-Peredibacter clade as Bacteriovoracaceae fam. nov. Int J Syst Evol Microbiol 54:1439–1452.",
    doi: "10.1099/ijs.0.02978-0"
  },
  Bdellovibrio: {
    full: "Bdellovibrio Stolp and Starr 1963 (Approved Lists 1980)",
    etym: "Bdel.lo.vi'bri.o. Gr. fem. n. bdella, leech, sucker; L. v. vibro, to set in tremulous motion, move to and fro, vibrate; N.L. masc. n. vibrio, that which vibrates, and also a bacterial genus name of bacteria possessing a curved rod shape (Vibrio); N.L. masc. n. Bdellovibrio, a leechlike vibrio",
    gloss: "leech-like vibrio",
    status: "validly published under the ICNP",
    gender: "masculine",
    type: "Bdellovibrio bacteriovorus",
    ref: "Stolp H, Starr MP (1963) Bdellovibrio bacteriovorus gen. et sp. n., a predatory, ectoparasitic, and bacteriolytic microorganism. Antonie van Leeuwenhoek 29:217–248.",
    doi: "10.1007/bf02046064"
  },
  Pseudothioglobus: {
    full: "\"Candidatus Pseudothioglobus\" van Vliet et al. 2021",
    etym: "Pseu.do.thi.o'glo.bus. Gr. neut. adj. pseudes, false; Gr. neut. n. theîon, sulfur; L. masc. n. globus, ball, sphere; N.L. masc. n. Pseudothioglobus, false sulfur-oxidizing sphere",
    gloss: "false sulfur ball",
    status: "Candidatus name, not validly published (LPSN lists it as a synonym of Thioglobus)",
    gender: "masculine",
    type: "\"Ca. Pseudothioglobus singularis\"",
    ref: "van Vliet DM, von Meijenfeldt FAB, Dutilh BE, Villanueva L, Sinninghe Damsté JS, Stams AJM, Sánchez-Andrea I (2021) The bacterial sulfur cycle in expanding dysoxic and euxinic marine waters. Environ Microbiol 23:2834–2857.",
    doi: "10.1111/1462-2920.15265"
  },
  Njordibacter: {
    full: "\"Njordibacter\" Sadler et al. 2025",
    etym: "Njor.di.bac'ter. N.L. masc. n. bacter, rod; N.L. masc. n. Njordibacter, a rod named after Njord, the Norse god of wind and seas",
    gloss: "Njord's rod",
    status: "proposed name, not validly published",
    gender: "masculine",
    type: "none designated yet",
    ref: "Sadler MC, Wietz M, Mino S, Morris RM (2025) Genomic diversity and adaptation in Arctic marine bacteria. mBio 16:e0155525.",
    doi: "10.1128/mbio.01555-25"
  },
  Marimicrobium: {
    full: "Marimicrobium Konkit et al. 2016",
    etym: "Ma.ri.mi.cro'bi.um. L. neut. n. mare, the sea; N.L. neut. n. microbium, microbe; N.L. neut. n. Marimicrobium, small, marine microbe",
    gloss: "small marine microbe",
    status: "validly published under the ICNP",
    gender: "neuter",
    type: "Marimicrobium arenosum",
    ref: "Konkit M, Kim JH, Kim W (2016) Marimicrobium arenosum gen. nov., sp. nov., a moderately halophilic bacterium isolated from sea sand. Int J Syst Evol Microbiol 66:856–861.",
    doi: "10.1099/ijsem.0.000803"
  },
  Nitrosopumilus: {
    full: "Nitrosopumilus Qin et al. 2017",
    etym: "Ni.tro.so.pu'mi.lus. L. masc. adj. nitrosus, full of natron, here intended to mean nitrous; L. masc. adj. pumilus, dwarf; N.L. masc. n. Nitrosopumilus, a dwarf producing nitrite",
    gloss: "a dwarf producing nitrite",
    status: "validly published under the ICNP (first proposed as \"Candidatus Nitrosopumilus\" Könneke et al. 2005)",
    gender: "masculine",
    type: "Nitrosopumilus maritimus",
    ref: "Qin W, Heal KR, Ramdasi R, Kobelt JN, Martens-Habbena W, Bertagnolli AD, Amin SA, Walker CB, Urakawa H, Könneke M, et al. (2017) Nitrosopumilus maritimus gen. nov., sp. nov., Nitrosopumilus cobalaminigenes sp. nov., Nitrosopumilus oxyclinae sp. nov., and Nitrosopumilus ureiphilus sp. nov., four marine ammonia-oxidizing archaea of the phylum Thaumarchaeota. Int J Syst Evol Microbiol 67:5067–5079.",
    doi: "10.1099/ijsem.0.002416"
  },
  Mycobacterium: {
    full: "Mycobacterium Lehmann and Neumann 1896 (Approved Lists 1980)",
    etym: "My.co.bac.te'ri.um. Gr. masc. n. mykês (gen. mykêtos), a mushroom, fungus; N.L. neut. n. bacterium, a rod; N.L. neut. n. Mycobacterium, a fungus rodlet",
    gloss: "fungus rodlet",
    status: "validly published under the ICNP",
    gender: "neuter",
    type: "Mycobacterium tuberculosis",
    ref: "Lehmann KB, Neumann R (1896) Atlas und Grundriss der Bakteriologie und Lehrbuch der speziellen bakteriologischen Diagnostik. Teil 2: Text, 1st ed. J.F. Lehmann, München."
  }
};
