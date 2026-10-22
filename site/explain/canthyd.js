// Plain-language explainers (about grade 8) for the CANT-HYD hydrocarbon-degradation marker
// genes (Khot et al. 2022, Front. Microbiol. 12:764058, doi:10.3389/fmicb.2021.764058), keyed by the HMM name. Shared by every community.
// group: what the gene attacks and whether it needs oxygen; text: what it does.
window.CANTHYD_INFO = {
 "groups": {
  "aerobic_alkane":    {"title": "Alkanes, with oxygen", "text": "Alkanes are the simple chain-shaped molecules in oil, diesel, wax and natural gas (methane, propane, butane and longer ones). Aerobic bacteria start breaking them down by using oxygen to add an -OH group to the chain, turning a hard-to-eat fuel molecule into an alcohol they can digest. After oil spills, these are often the first bacteria to bloom."},
  "anaerobic_alkane":  {"title": "Alkanes, without oxygen", "text": "In mud and other places without oxygen, some bacteria still eat alkanes. Instead of oxygen they use a chemical trick, attaching the alkane to a small molecule called fumarate, then break it down slowly."},
  "aerobic_aromatic":  {"title": "Ring molecules, with oxygen", "text": "Aromatic hydrocarbons have ring-shaped molecules: benzene, toluene, ethylbenzene, xylene and naphthalene (mothballs) are examples. They are some of the most toxic parts of oil and gasoline. Aerobic bacteria use oxygenase enzymes to add oxygen to the ring, which is the first step to cracking it open."},
  "anaerobic_aromatic":{"title": "Ring molecules, without oxygen", "text": "Without oxygen, bacteria have other ways to attack benzene, toluene, ethylbenzene and naphthalene: they add a carboxyl group or a fumarate to the ring, or pull electrons off it. These slow pathways matter in oily sediments and groundwater."},
  "sulfur":            {"title": "Sulfur in oil", "text": "Oil contains sulfur-containing ring molecules such as dibenzothiophene. Some bacteria can pull the sulfur out, which also interests refineries because sulfur makes fuels dirtier to burn."}
 },
 "models": {
  "AlkB": {"group": "aerobic_alkane", "name": "AlkB alkane hydroxylase", "text": "The best-known alkane-eating enzyme. It sits in the cell membrane and adds oxygen to the end of a medium-length alkane chain, the first step in digesting diesel-like molecules."},
  "CYP153": {"group": "aerobic_alkane", "name": "CYP153 alkane hydroxylase", "text": "A cytochrome P450 enzyme that oxidizes the end of medium-length alkanes. It is common in bacteria that bloom after oil spills."},
  "AlmA_GroupI": {"group": "aerobic_alkane", "name": "AlmA long-chain alkane monooxygenase", "text": "A flavin enzyme that attacks long alkane chains, like those in wax and heavy oil, that most other enzymes cannot handle."},
  "AlmA_GroupIII": {"group": "aerobic_alkane", "name": "AlmA long-chain alkane monooxygenase", "text": "Another type of AlmA, for long, waxy alkane chains."},
  "LadA_alpha": {"group": "aerobic_alkane", "name": "LadA long-chain alkane hydroxylase", "text": "An enzyme for long alkane chains, first found in bacteria from oil fields."},
  "LadA_beta": {"group": "aerobic_alkane", "name": "LadA long-chain alkane hydroxylase", "text": "A second type of LadA enzyme for long alkane chains."},
  "LadB": {"group": "aerobic_alkane", "name": "LadB long-chain alkane hydroxylase", "text": "A relative of LadA that also works on long alkane chains."},
  "pBmoA": {"group": "aerobic_alkane", "name": "Membrane alkane monooxygenase (A)", "text": "Part of a copper enzyme in the membrane that oxidizes small gaseous alkanes such as ethane, propane and butane. It is related to the enzyme methane-eating bacteria use."},
  "pBmoB": {"group": "aerobic_alkane", "name": "Membrane alkane monooxygenase (B)", "text": "Another part of the copper enzyme that oxidizes small gaseous alkanes."},
  "pBmoC": {"group": "aerobic_alkane", "name": "Membrane alkane monooxygenase (C)", "text": "A third part of the copper enzyme that oxidizes small gaseous alkanes."},
  "sBmoX": {"group": "aerobic_alkane", "name": "Soluble alkane monooxygenase (X)", "text": "Part of an iron enzyme inside the cell that oxidizes small gaseous alkanes like butane."},
  "sBmoY": {"group": "aerobic_alkane", "name": "Soluble alkane monooxygenase (Y)", "text": "Another part of the soluble enzyme for small gaseous alkanes."},
  "sBmoZ": {"group": "aerobic_alkane", "name": "Soluble alkane monooxygenase (Z)", "text": "A third part of the soluble enzyme for small gaseous alkanes."},
  "PrmA": {"group": "aerobic_alkane", "name": "Propane monooxygenase (large part)", "text": "Part of an enzyme that oxidizes propane, a gas found in natural gas seeps."},
  "PrmC": {"group": "aerobic_alkane", "name": "Propane monooxygenase (small part)", "text": "The smaller part of the propane-oxidizing enzyme."},
  "AssA": {"group": "anaerobic_alkane", "name": "Alkylsuccinate synthase", "text": "The key enzyme for eating alkanes without oxygen: it glues the alkane to fumarate so the cell can break it down in mud and oily sediments."},
  "AhyA": {"group": "anaerobic_alkane", "name": "Alkane C2 hydroxylase (molybdenum)", "text": "A molybdenum enzyme that some bacteria may use to attack alkanes without oxygen."},
  "MAH_alpha": {"group": "aerobic_aromatic", "name": "Ring dioxygenase (large part)", "text": "Part of an enzyme that adds two oxygen atoms to benzene, toluene or naphthalene rings, the first step to breaking them open."},
  "MAH_beta": {"group": "aerobic_aromatic", "name": "Ring dioxygenase (small part)", "text": "The smaller part of the ring-attacking dioxygenase."},
  "NdoB": {"group": "aerobic_aromatic", "name": "Naphthalene dioxygenase (large part)", "text": "Part of the enzyme that attacks naphthalene, the two-ring molecule in mothballs and crude oil."},
  "NdoC": {"group": "aerobic_aromatic", "name": "Naphthalene dioxygenase (small part)", "text": "The smaller part of the naphthalene dioxygenase."},
  "non_NdoB_type": {"group": "aerobic_aromatic", "name": "Ring dioxygenase (other type)", "text": "Similar to the ring-attacking dioxygenases, but from a group whose exact food is less certain. It may attack aromatic rings or related molecules."},
  "DmpO": {"group": "aerobic_aromatic", "name": "Phenol/toluene monooxygenase", "text": "An enzyme that adds oxygen to phenol or toluene rings so they can be broken down."},
  "TmoA_BmoA": {"group": "aerobic_aromatic", "name": "Toluene monooxygenase (A)", "text": "Part of an enzyme that oxidizes toluene and benzene, common in gasoline."},
  "TmoB_BmoB": {"group": "aerobic_aromatic", "name": "Toluene monooxygenase (B)", "text": "Another part of the toluene-oxidizing enzyme."},
  "TmoE": {"group": "aerobic_aromatic", "name": "Toluene monooxygenase (E)", "text": "Another part of the toluene-oxidizing enzyme."},
  "TomA1": {"group": "aerobic_aromatic", "name": "Phenol/toluene hydroxylase (A1)", "text": "Part of an enzyme that oxidizes phenol and toluene rings."},
  "TomA3": {"group": "aerobic_aromatic", "name": "Phenol/toluene hydroxylase (A3)", "text": "Another part of the phenol/toluene hydroxylase."},
  "TomA4": {"group": "aerobic_aromatic", "name": "Phenol/toluene hydroxylase (A4)", "text": "Another part of the phenol/toluene hydroxylase."},
  "AbcA_1": {"group": "anaerobic_aromatic", "name": "Benzene carboxylase", "text": "Attacks benzene without oxygen by adding a carboxyl group to the ring."},
  "AbcA_2": {"group": "anaerobic_aromatic", "name": "Benzene carboxylase (type 2)", "text": "A second type of the enzyme that attacks benzene without oxygen."},
  "K27540": {"group": "anaerobic_aromatic", "name": "Naphthalene carboxylase", "text": "Attacks naphthalene without oxygen by adding a carboxyl group."},
  "BssA": {"group": "anaerobic_aromatic", "name": "Benzylsuccinate synthase", "text": "The key enzyme for eating toluene without oxygen: it joins toluene to fumarate."},
  "NmsA": {"group": "anaerobic_aromatic", "name": "Naphthylmethylsuccinate synthase", "text": "Joins methylnaphthalene to fumarate, the first step in eating it without oxygen."},
  "EbdA": {"group": "anaerobic_aromatic", "name": "Ethylbenzene dehydrogenase", "text": "A molybdenum enzyme that attacks ethylbenzene without oxygen."},
  "CmdA": {"group": "anaerobic_aromatic", "name": "Ethylbenzene dehydrogenase (CmdA type)", "text": "A related molybdenum enzyme for ethylbenzene and similar rings."},
  "DszC": {"group": "sulfur", "name": "Dibenzothiophene monooxygenase", "text": "Starts pulling sulfur out of dibenzothiophene, a sulfur-containing ring molecule in crude oil."}
 }
};
