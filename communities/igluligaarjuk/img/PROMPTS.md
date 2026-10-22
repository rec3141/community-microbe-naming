# Microbe Cartoon Prompts & Generation Metadata

This directory contains the 12 circular cartoon microbe illustrations created for the Chesterfield Inlet Bacterial Naming Workshop.

- **Generator Engine**: Google **Imagen 3** (via Google Vertex AI / GenAI `generate_image` endpoint)
- **Aspect Ratio**: `1:1` square, centered circular composition, cropped to circle

---

## Headless Image Generation with `agy`

You can generate images headlessly (non-interactively) in scripts or pipelines using the Antigravity CLI:

```bash
agy -p "Use the image-generator subagent to generate an image of: <prompt description>. Save the final image to /path/to/output.png." \
    --dangerously-skip-permissions
```

### Essential CLI Flags
- **`-p` / `--print`**: Runs the prompt non-interactively, executes tools, outputs results to stdout, and exits.
- **`--dangerously-skip-permissions`**: Auto-approves tool execution without requiring terminal TTY confirmation prompts.
- **`--output-format text|json|stream-json`**: Controls the stdout format.
- **`--effort low|medium|high`**: Controls reasoning effort.

### Example Script
```bash
#!/bin/bash
PROMPT="A plump, translucent cyan-blue spherical coccus bacterium floating in Arctic water with glowing yellow sulfur globules, centered circular composition, no text."

agy -p "Use the image-generator subagent to create: $PROMPT. Save to communities/igluligaarjuk/img/microbe_01.png" \
    --dangerously-skip-permissions \
    --output-format text
```

---

## microbe_01 — The Harbor Sulfur Eater
- **File**: [`microbe_01.png`](microbe_01.png)
- **Candidate MAG**: `dastool-lorbin_055`
- **Taxonomic Rank/Status**: *Thioglobus_A sp. nov.* (Marine)

**Generation Prompt:**
> Vibrant 2D scientific cartoon illustration, centered circular composition, no text, no words, no letters. A single plump, translucent cyan-blue spherical coccus bacterium floating in deep blue Arctic harbor water. The bacterium has NO arms, NO legs, NO hands, NO feet, NO monster limbs—it is purely a spherical bacterial cell body. Drawn directly on the cyan cell surface are big, expressive, goofy cartoon eyes and a happy grinning mouth. Visible inside its translucent cyan-blue cytoplasmic interior are several glowing bright-yellow spherical sulfur globules. A single delicate, slender, wavy flagellum extends gracefully from one side of the spherical cell body. The bacterium is cheerfully gulping small floating glowing yellow sulfur mineral crystals, while puffing out shiny, luminous golden spherical vitamin bubbles that drift upward toward the water surface. Cold atmospheric Chesterfield Inlet Arctic harbour background with dark blue ocean water, subtle wooden dock pilings in the misty distance, sparkling bioluminescent particles, rich underwater volumetric lighting.

---

## microbe_02 — The Ice-Shelf Grazer
- **File**: [`microbe_02.png`](microbe_02.png)
- **Candidate MAG**: `dastool-metabat_11223`
- **Taxonomic Rank/Status**: *Polaribacter sp. nov.* (Marine)

**Generation Prompt:**
> Vibrant 2D scientific cartoon illustration, centered circular composition, no text, no words, no letters. A bright, smooth golden-orange rod-shaped bacterium (bacillus cell shape) gliding upside-down along the glowing crystal-blue underside of Arctic sea ice. The bacterium has strictly NO arms, NO legs, NO hands, NO feet, NO flagella—it is a pill-shaped / cylinder-shaped bacterial cell body. Along its smooth golden-orange cell wall are tiny, neat cup-shaped receptor indentations and pores. Perched goofily and stylishly directly on the front of its rod-shaped body are cool little dark sunglasses shielding its eyes against the bright Arctic sea-ice glare, accompanied by a happy, goofy smiling mouth. The microbe is playfully munching on a string of olive-green and brown seaweed sugar-bead polysaccharide chains. Background features translucent turquoise-blue sea ice overhead with ice crystals and sunlight refracting through, floating green kelp fronds in Chesterfield Inlet's crisp cold ocean water, subtle glowing microscopic bubbles. Rich Arctic underwater lighting, crisp outlines, unified cartoon aesthetic matching the circular framing.

---

## microbe_03 — The Marine Snow Glider
- **File**: [`microbe_03.png`](microbe_03.png)
- **Candidate MAG**: `dastool-semibin_075`
- **Taxonomic Rank/Status**: *TMED14 / Schleiferiaceae gen. nov.* (Marine)

**Generation Prompt:**
> Vibrant 2D scientific cartoon illustration, centered circular composition, no text, no words, no letters. A sleek amber-gold slender rod-shaped bacterium (elongated bacillus cell body) clinging tightly to a large, fluffy, glowing organic marine snow aggregate particle. The bacterium has strictly NO arms, NO legs, NO hands, NO feet, NO limbs—it is purely an elongated bacterial rod. Its cell envelope is patterned with textured, velcro-like adhesive receptor patches and sticky surface micro-pads adhering it securely to the porous marine snow flake. On the front of its amber-gold bacterial body are big, expressive, goofy cartoon eyes and a wide, determined, goofy grin with gritted teeth or cheerful focus as rushing, swirling turquoise Arctic ocean tidal currents and speed lines stream past around it in Chesterfield Inlet. Cold deep turquoise and cyan marine waters, glowing suspended detritus particles, hydrodynamic water whorls, rich Arctic volumetric underwater lighting, crisp bold outlines matching the circular framing.

---

## microbe_04 — The Harbor Virus Defender
- **File**: [`microbe_04.png`](microbe_04.png)
- **Candidate MAG**: `dastool-lorbin_002`
- **Taxonomic Rank/Status**: *UBA4466 / Thioglobaceae gen. nov.* (Marine)

**Generation Prompt:**
> Vibrant 2D scientific cartoon illustration of a single bacterial cell candidate in a centered circular composition, suitable for circular cropping. The bacterium is a tiny, ultra-compact icy-blue curved rod or coccobacillus cell body with smooth edges and NO limbs, NO arms, NO legs, NO hands, NO feet. On its bacterial cell body are two big, expressive, slightly goofy cartoon eyes looking proud and determined. Inside its semi-translucent icy-blue cytoplasm, several glowing bright yellow spherical sulfur elemental granules are clearly visible. Surrounding the entire bacterial cell is a glowing cyan-blue geometric hexagonal forcefield aura representing a CRISPR viral defense shield. A tiny geometric icosahedral bacteriophage virus (with a multifaceted capsid head and tiny spindly legs) is bouncing harmlessly off the outer surface of the glowing hexagonal CRISPR shield. Tiny shimmering golden iron-siderophore sparkles swirl in the water and enter microscopic pores on the bacterial membrane. Deep freezing dark-teal Arctic marine water background with gentle caustic lighting and floating underwater micro-bubbles. Bold clean outlines, charming high-quality scientific cartoon style, rich bioluminescent glow, perfectly centered, no text, no letters, no watermark.

---

## microbe_05 — The Arctic Harbor Producer
- **File**: [`microbe_05.png`](microbe_05.png)
- **Candidate MAG**: `dastool-lorbin_051`
- **Taxonomic Rank/Status**: *Belliella sp. nov.* (Marine)

**Generation Prompt:**
> Vibrant 2D scientific cartoon illustration of a single bacterial cell candidate in a centered circular composition, suitable for circular cropping. The bacterium is an energetic, robust rod-shaped bacterium (bacillus) with a smooth emerald-green and cyan gradient cell body, and strictly NO arms, NO legs, NO hands, NO feet, NO mechanical parts. On its bacterial cell body are two big, cheerful, goofy cartoon eyes with a delighted wide smile. Attached to its posterior pole is a single long biological whip-like flagellum filament rotating rapidly in a corkscrew spiral, churning up a bubbly swirling vortex wake behind it in the water. Inside its semi-translucent green-cyan cytoplasm are glowing neon metabolic circular rings and concentric biochemical pathway loops in glowing yellow, cyan, and orange. Radiating outward from the bacterial membrane pores into the ocean water are glowing, unlabelled colorful nutrient orbs and spheres: luminous magenta-pink spheres, radiant golden beads, and glowing lime-green bubbles (completely blank, absolutely no text, no letters, no symbols on the spheres). Rich Arctic coastal seawater background with deep blue-green hues, caustic light rays from above, and floating micro-bubbles. Bold clean outlines, charming scientific cartoon style, perfectly centered, absolutely no text, no words, no numbers, no labels.

---

## microbe_06 — The Solar Carbon Recycler
- **File**: [`microbe_06.png`](microbe_06.png)
- **Candidate MAG**: `dastool-comebin_832`
- **Taxonomic Rank/Status**: *Pelagibacteraceae gen. nov.* (Marine)

**Generation Prompt:**
> Vibrant 2D scientific cartoon illustration of a single bacterial cell candidate in a centered circular composition, suitable for circular cropping. The bacterium is a compact oval coccobacillus (egg-shaped / oval bacterium) with smooth boundaries and strictly NO arms, NO legs, NO hands, NO feet, NO limbs of any kind. On its cell body is a delightful, goofy cartoon face squinting happily and blissfully upward with curved happy eyes and a joyful warm smile. Embedded neatly across its outer cell membrane are glowing magenta-purple bacteriorhodopsin solar-panel-like patches and tiles, radiating a vivid bioluminescent purple-pink light as they absorb sunlight. The bacterium is floating right near the sunlit water surface of Chesterfield Inlet, with bright golden Arctic sunbeams and caustic light rays streaming down through the clear surface water. Tiny effervescent single-carbon molecular micro-bubbles float through the water and enter small membrane pores. Pristine Arctic sub-surface marine lighting with turquoise water, shimmering golden sun rays, and a circular composition framing. Bold clean cartoon outlines, vibrant colors, charming scientific cartoon aesthetic, perfectly centered, strictly no text, no words, no letters.

---

## microbe_07 — The Lakebed Glider
- **File**: [`microbe_07.png`](microbe_07.png)
- **Candidate MAG**: `dastool-lorbin_006`
- **Taxonomic Rank/Status**: *Ferruginibacter sp. nov.* (Freshwater)

**Generation Prompt:**
> A charming, vibrant, slightly goofy 2D scientific cartoon illustration of a single bacterial cell, Ferruginibacter, centered inside a circular composition framed against a freshwater lakebed background. The bacterium is strictly a long, slender, flexible terracotta-orange filamentous rod (filamentous bacillus) with gently tapered, rounded ends, curving smoothly across the center. It has subtle embossed helical surface gliding grooves along its orange cell envelope. Expressive, cute, goofy cartoon eyes with shiny pupils and a friendly smile are located directly on the front surface of the orange cylindrical cell body itself. Strictly NO arms, NO legs, NO hands, NO feet, NO flagella, NO cilia, NO tentacles, NO limbs of any kind—only the pure bacterial rod cell body. It is gliding happily over smooth submerged grey granite pebbles, green aquatic tundra moss, and submerged brown sedge plant stems at the bottom of clear Arctic lake water. Around it float delicate, semi-translucent glowing chitin flakes and cellulose fiber strands that it is munching on. Rich Arctic underwater freshwater lighting with gentle caustics, crisp bold outlines, clean vector-like digital cartoon style. Perfect circular framing, centered subject, completely free of text, numbers, or labels.

---

## microbe_08 — The Moss-Dwelling Mother
- **File**: [`microbe_08.png`](microbe_08.png)
- **Candidate MAG**: `dastool-lorbin_030`
- **Taxonomic Rank/Status**: *Isosphaeraceae gen. nov.* (Freshwater)

**Generation Prompt:**
> A charming, vibrant, slightly goofy 2D scientific cartoon illustration of a planctomycete bacterium (Isosphaeraceae), centered inside a circular composition in clear Arctic tundra lake water. The main organism is a large spherical round bacterial cell (coccus) with a pearlescent rosy-coral or soft magenta-pink hue showing stylized gently folded internal membrane compartments inside its semi-translucent cell body. A distinct smaller, cute spherical baby daughter cell is budding directly off the top-right of the main mother sphere (classic planctomycete budding reproduction). Both the large mother cell and the small budding daughter cell have goofy, adorable cartoon eyes with bright highlights and cheerful smiles directly on their spherical round bodies. Strictly NO arms, NO legs, NO hands, NO feet, NO limbs, NO tentacles, NO flagella—only the pure spherical bacterial cell bodies! The bacterium is nestled snugly among underwater emerald-green Arctic sphagnum moss tufts and pale lichens at the bottom of a sunny, pristine freshwater lake. Surrounding the cell are magical, tiny glowing yellow and cyan sulfatase sparkle particles and floating sugar molecules that the bacterium is happily breaking down. Bold clean outlines, luminous Arctic underwater lighting, crisp vector-like cartoon style, perfectly centered in a circular composition suitable for circular cropping, with no text, numbers, or labels.

---

## microbe_09 — The C-Shaped Plankton
- **File**: [`microbe_09.png`](microbe_09.png)
- **Candidate MAG**: `dastool-metabat_4130`
- **Taxonomic Rank/Status**: *Polynucleobacter sp. nov.* (Freshwater)

**Generation Prompt:**
> A charming, vibrant, slightly goofy 2D scientific cartoon illustration of a Polynucleobacter ultramicrobacterium, centered inside a circular composition. The bacterium is strictly a classic smooth C-shaped curved rod (curved bacillus / vibrio shape) floating serenely in clear Arctic freshwater lake water. The cell envelope is semi-translucent sapphire-blue and turquoise, with a clearly visible glowing, intricate golden condensed DNA nucleoid coil radiating brightly from within the center of its cytoplasm. On the front of the curved rod body, it has large, goofy, proud cartoon eyes with joyful sparkle reflections and a beaming, triumphant smile right on the cell wall surface. Strictly NO arms, NO legs, NO hands, NO feet, NO flagella, NO cilia, NO tentacles, NO monster limbs whatsoever—strictly the authentic curved C-shaped bacterial cell body! It floats gracefully in the open sunlit, crystalline turquoise-blue water of an Arctic lake, surrounded by a soft golden radiant glow halo and floating amber-gold droplets of dissolved organic acids and nutrients. Bold clean outlines, beautiful refracted sunlight rays (lake caustics), crisp vector cartoon style, centered inside a circular composition suitable for circular cropping, with absolutely no text, numbers, or labels.

---

## microbe_10 — The Flagellated Grazer
- **File**: [`microbe_10.png`](microbe_10.png)
- **Candidate MAG**: `dastool-lorbin_069`
- **Taxonomic Rank/Status**: *Planctomycetaceae gen. nov.* (Freshwater)

**Generation Prompt:**
> Vibrant charming 2D scientific cartoon illustration of a single pear-shaped planctomycete bacterium (microbe dastool-lorbin_069, Planctomycetaceae) centered in a circular composition suitable for circular cropping. Morphological accuracy: an ovoid/pear-shaped bacterial cell body with strictly NO arms, NO legs, NO hands, NO feet, and NO limbs. At its narrow base is a small holdfast stalk; at its opposite end is a single long, elegant wavy polar flagellum trailing and whipping through the water. Inside its translucent cell body, glowing ruby-red cytochrome c granules and internal compartmentalized membrane folds are visible. Expressive, friendly, slightly goofy cartoon eyes and an excited smile are drawn directly on the cell body itself. The bacterium is swimming eagerly through clear sunlit Arctic tundra pond water near 3rd Lake, steering towards delicate floating marshmallow-like marsh polysaccharide sugar strands. Beautiful aquatic lighting with soft sun rays, clear Arctic freshwater atmosphere, bold clean outlines, vibrant saturated colors. Strictly no text, labels, words, or letters.

---

## microbe_11 — The Sub-Zero Nitrogen Purifier
- **File**: [`microbe_11.png`](microbe_11.png)
- **Candidate MAG**: `dastool-comebin_3630`
- **Taxonomic Rank/Status**: *Nitrotoga sp. nov.* (Freshwater)

**Generation Prompt:**
> Vibrant charming 2D scientific cartoon illustration of Nitrotoga bacterium (microbe dastool-comebin_3630, Nitrotoga sp. nov., 'The Sub-Zero Nitrogen Purifier') centered in a circular composition suitable for circular cropping. Morphological accuracy: a short, plump rod-shaped coccobacillus bacterium (strictly NO arms, NO legs, NO hands, NO feet, NO limbs!) enveloped in a distinctive wide, voluminous, puffy translucent outer periplasmic membrane that resembles a cozy puffy winter parka jacket or translucent toga coat wrapped snugly around the inner rod cell. Cute goofy expressive cartoon eyes and a happy proud smile are on the inner rod cell body. The bacterium is floating in crystal clear freezing Arctic freshwater beneath a thick glowing turquoise-blue winter ice ceiling of 3rd Lake. Cheerful action: it is absorbing small murky moss-green gaseous bubbles drifting toward its puffy jacket, while releasing sparkling clean crystalline sapphire-blue liquid bubbles that float upwards with magical glints and sparkles. In the deep background, an elegant shadowy silhouette of an Arctic char fish swims peacefully. Crisp frosty Arctic colors, bold clean outlines, 2D scientific cartoon art. ABSOLUTELY ZERO TEXT, no letters, no chemical symbols, no numbers, no words anywhere in the image. Every bubble is completely blank and free of text.

---

## microbe_12 — The Sun-Lit Tundra Lake Recycler
- **File**: [`microbe_12.png`](microbe_12.png)
- **Candidate MAG**: `dastool-lorbin_054`
- **Taxonomic Rank/Status**: *Aurantibacillus sp. nov.* (Freshwater)

**Generation Prompt:**
> Vibrant charming 2D scientific cartoon illustration of Aurantibacillus bacterium (microbe dastool-lorbin_054, Aurantibacillus sp. nov., 'The Sun-Lit Tundra Lake Recycler') centered in a circular composition suitable for circular cropping. Morphological accuracy: a smooth, sleek, bright tangerine-orange and radiant golden rod-shaped bacterium (bacillus) with strictly NO arms, NO legs, NO hands, NO feet, NO limbs! Its outer cell envelope shimmers with vibrant warm carotenoid pigments and glowing ruby-gold rhodopsin, with iridescent golden highlights. Expressive, joyful, goofy cartoon eyes and a big cheerful grin are drawn directly on the golden rod body. Scene and action: floating in clear, shallow sunlit tundra lake water near a rocky outlet under the warm golden Arctic midnight sun. Brilliant ultraviolet and golden sunbeams shine down through the water, bouncing playfully off its antioxidant golden cell wall in a spectacular shower of dazzling sunbursts, prismatic lens flares, and twinkling sparkles. In the background, smooth rounded Arctic pebbles and submerged tundra stones bathed in golden light. Bold clean outlines, saturated warm orange, yellow, and clear aquatic tones. ABSOLUTELY ZERO TEXT, no words, no letters, no labels.

---

---

## microbe_A2_planktophila — The Tiny Lake Sun-Sipper
- **File**: [`microbe_A2_planktophila.png`](microbe_A2_planktophila.png)
- **Candidate MAG**: `A2_Planktophila_semibin_003` (Chesterfield-only freshwater co-assembly, Flye reassembly from >=96%-identity reads)
- **Taxonomic Rank/Status**: *Planktophila sp. nov.* (Freshwater; Nanopelagicaceae, acI lineage)
- **Generated**: 2026-10-20 with `agy` headless (image-generator subagent)

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single Planktophila bacterium (a tiny freshwater acI actinobacterium) centered in a circular composition suitable for circular cropping. Morphological accuracy: a very small, slim, gently curved rod-shaped bacterial cell (tiny curved bacillus) with a smooth semi-translucent lavender-violet and soft sky-blue cell envelope, strictly NO arms, NO legs, NO hands, NO feet, NO flagella, NO tentacles, NO limbs of any kind - only the pure little curved bacterial cell body. Across its outer membrane are small glowing violet-pink light-harvesting patches (actinorhodopsin) shimmering as they catch sunlight. Big, expressive, goofy cartoon eyes and a delighted tiny smile are drawn directly on the cell body. Scale and scene: it is noticeably tiny, floating among a crowd of similar tiny cousins drifting in the clear, sunlit open water of an Arctic tundra lake near Chesterfield Inlet, with soft golden sunbeams and gentle lake caustics streaming down from the surface, distant blurry rounded granite boulders and green tundra shoreline in the background, and small glowing amber droplets of dissolved nutrients it is sipping. Crisp bold outlines, clean vector-like digital cartoon style, cool clear Arctic freshwater palette with warm sunlight accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N1_amylibacter — Amylibacter (Itivia, marine)
- **File**: [`microbe_N1_amylibacter.png`](microbe_N1_amylibacter.png)
- **Genome**: `N1_amylibacter` (community-only bin, mapped and annotated on its own)
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single Amylibacter bacterium (a marine Rhodobacteraceae) centered in a circular composition suitable for circular cropping. Morphological accuracy: a small, plump, short oval rod-shaped cell with smooth semi-translucent sunny-yellow and pale-green cell envelope, a few round pale storage granules visible inside, strictly NO arms, NO legs, NO hands, NO feet, NO flagella, NO tentacles, NO limbs of any kind - only the pure little oval bacterial cell body. Big, friendly cartoon eyes and a contented smile drawn directly on the cell body. Scene: it floats in cold, clear blue-green seawater of an Arctic Hudson Bay inlet, happily slurping tiny glowing droplets of dissolved sugars released by drifting diatoms and phytoplankton cells around it, with a rocky shoreline and pieces of sea ice blurred above the surface and soft sunbeams from above. Crisp bold outlines, clean vector-like digital cartoon style, cold marine palette with warm yellow accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N2_caivzm01 — CAIVZM01, Armatimonadota (2nd Lake)
- **File**: [`microbe_N2_caivzm01.png`](microbe_N2_caivzm01.png)
- **Genome**: `N2_caivzm01` (community-only bin, mapped and annotated on its own)
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single bacterium from the rare phylum Armatimonadota, centered in a circular composition suitable for circular cropping. Morphological accuracy: a medium-length, slightly irregular rod-shaped cell with smooth semi-translucent deep indigo and silver cell envelope, strictly NO arms, NO legs, NO hands, NO feet, NO flagella, NO tentacles, NO limbs of any kind - only the pure bacterial cell body. Big, curious cartoon eyes and a happy open-mouthed smile drawn directly on the cell body. Scene: it is nibbling on a tangle of long fibrous strands of plant and algal material (glowing chains of sugar beads breaking off) drifting in the brown-green water of a shallow Arctic tundra lake, with sedges, moss and rounded rocks blurred along the shore and soft golden light from above. Crisp bold outlines, clean vector-like digital cartoon style, freshwater palette with indigo and gold accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N3_peredibacter — Peredibacter, a predator (1st Lake)
- **File**: [`microbe_N3_peredibacter.png`](microbe_N3_peredibacter.png)
- **Genome**: `N3_peredibacter` (community-only bin, mapped and annotated on its own)
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single Peredibacter bacterium, a tiny predatory bacterium, centered in a circular composition suitable for circular cropping. Morphological accuracy: a small, plump, slightly curved comma-shaped rod cell with one long whip-like flagellum at one end, smooth semi-translucent teal-green cell envelope, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO teeth, NO limbs of any kind - only the pure little curved bacterial cell body and its single flagellum. Big, expressive, determined cartoon eyes and a cheeky grin drawn directly on the cell body. Scene: it is zooming like a tiny torpedo toward a much larger, surprised-looking plain rod-shaped bacterium in the cool clear water of an Arctic tundra lake, with a few empty deflated cell husks drifting nearby, soft green-blue lake light, gentle sunbeams from the surface, rounded boulders and tundra shoreline blurred in the background. Crisp bold outlines, clean vector-like digital cartoon style, cool freshwater palette, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N4_bdellovibrio — Bdellovibrio, a predator (2nd Lake)
- **File**: [`microbe_N4_bdellovibrio.png`](microbe_N4_bdellovibrio.png)
- **Genome**: `N4_bdellovibrio` (community-only bin, mapped and annotated on its own)
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single Bdellovibrio bacterium, a tiny predatory bacterium that swims into other bacteria, centered in a circular composition suitable for circular cropping. Morphological accuracy: a very small comma-shaped vibrio cell with a single thick sheathed flagellum at one end, smooth semi-translucent amber-orange cell envelope, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO teeth, NO limbs of any kind - only the pure little comma-shaped bacterial cell body and its flagellum. Big, expressive, mischievous cartoon eyes and a happy grin drawn directly on the cell body. Scene: next to it is a much larger, round, swollen prey bacterium (a rounded bdelloplast) with a small window showing a tiny copy of the comma cell curled up inside, in the cold clear water of an Arctic tundra lake under a thin sheet of ice, with pale blue light filtering through the ice above. Crisp bold outlines, clean vector-like digital cartoon style, cool freshwater palette with warm orange accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N5_uba845 — UBA845, a predator (Tuktuttaa/Dock, marine)
- **File**: [`microbe_N5_uba845.png`](microbe_N5_uba845.png)
- **Genome**: `N5_uba845` (community-only bin, mapped and annotated on its own)
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single small predatory marine bacterium from the Bacteriovoracaceae family, centered in a circular composition suitable for circular cropping. Morphological accuracy: a small, slim, gently curved rod cell with one long flagellum at one end, smooth semi-translucent coral-pink cell envelope, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO teeth, NO limbs of any kind - only the pure little curved bacterial cell body and its flagellum. Big, expressive, alert cartoon eyes and a sly little smile drawn directly on the cell body. Scene: it is hunting among a crowd of larger plain rod-shaped and round bacteria drifting near green seaweed fronds in the cold, deep blue water of an Arctic harbour on Hudson Bay, with rocky shore and floating sea-ice pieces blurred above the water surface. Crisp bold outlines, clean vector-like digital cartoon style, cold marine palette with warm coral accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N6_k1 — Pseudothioglobaceae sulfur oxidizer (Itivia, marine)
- **File**: [`microbe_N6_k1.png`](microbe_N6_k1.png)
- **Genome**: `N6_k1` (community-only bin, mapped and annotated on its own)
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single small sulfur-oxidizing marine bacterium of the SUP05 group, centered in a circular composition suitable for circular cropping. Morphological accuracy: a small, round to slightly oval coccoid cell with smooth semi-translucent pale lilac cell envelope, a few glowing yellow sulfur specks inside, strictly NO arms, NO legs, NO hands, NO feet, NO flagella, NO tentacles, NO limbs of any kind - only the pure little round bacterial cell body. Big, sleepy-happy cartoon eyes and a gentle smile drawn directly on the cell body. Scene: it drifts in dim, cold, deep blue water of an Arctic inlet near the muddy bottom, catching tiny glowing yellow sulfur crystals and small bubbles that rise from the mud below, with faint light from the surface far above. Crisp bold outlines, clean vector-like digital cartoon style, cold dark marine palette with glowing yellow accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N7_marimicrobium — Marimicrobium, alkane-degrading sea bacterium (Itivia/Dock, marine)
- **File**: [`microbe_N7_marimicrobium.png`](microbe_N7_marimicrobium.png)
- **Genome**: `N7_marimicrobium` (Marimicrobium sp. (Halieaceae, marine))
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single small marine bacterium from the Halieaceae family, centered in a circular composition suitable for circular cropping. Morphological accuracy: a short, plump rod-shaped cell with rounded ends and a smooth semi-translucent peach-coloured cell envelope with a faint purple shimmer from its light-catching rhodopsin pumps, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind, NO flagella - only the pure little rod-shaped bacterial cell body. Big, cheerful cartoon eyes and a contented little smile drawn directly on the cell body. Scene: it is nibbling tiny rainbow-sheened oily droplets near the surface of cold, dark autumn water in an Arctic inlet on Hudson Bay, turning them into small clean bubbles, with low golden autumn sunlight slanting in and a rocky shore blurred above the water line. Crisp bold outlines, clean vector-like digital cartoon style, cold marine palette with warm peach and gold accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N8_uba9145 — UBA9145, swimming Hudson Bay bacterium (Itivia/Dock, marine)
- **File**: [`microbe_N8_uba9145.png`](microbe_N8_uba9145.png)
- **Genome**: `N8_uba9145` (UBA9145 sp. (Pseudohongiellaceae, marine))
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single small swimming marine bacterium from the Pseudohongiellaceae family, centered in a circular composition suitable for circular cropping. Morphological accuracy: a slim straight rod-shaped cell with rounded ends and one long, wavy flagellum at one end, smooth semi-translucent sea-green cell envelope with a faint pink glow from a light-catching rhodopsin pump, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind - only the pure little rod-shaped bacterial cell body and its flagellum. Big, adventurous cartoon eyes and an eager grin drawn directly on the cell body. Scene: it is swimming fast through the open cold blue water of Hudson Bay, passing drifting sea-ice floes and a distant pod of white beluga whales, with a long low coastline on the horizon above the water surface. Crisp bold outlines, clean vector-like digital cartoon style, cold marine palette with sea-green and pink accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N9_uba10364 — UBA10364, gliding seaweed-sugar degrader (Itivia/Tuktuttaa/Dock, marine)
- **File**: [`microbe_N9_uba10364.png`](microbe_N9_uba10364.png)
- **Genome**: `N9_uba10364` (UBA10364 sp. (Schleiferiaceae, Flavobacteriales, marine))
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single small gliding marine bacterium from the Flavobacteriales, centered in a circular composition suitable for circular cropping. Morphological accuracy: a slender rod-shaped cell with rounded ends, smooth semi-translucent golden-yellow cell envelope tinted by carotenoid pigments, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind, NO flagella - only the pure little rod-shaped bacterial cell body, gliding along a surface. Big, happy cartoon eyes and a wide smile drawn directly on the cell body. Scene: it is gliding along a frond of brown kelp in cold, clear, shallow Arctic water, slicing the slimy kelp surface into small floating pieces, with a rocky shore, smooth pebbles and floating sea-ice pieces blurred above. Crisp bold outlines, clean vector-like digital cartoon style, cold marine palette with golden-yellow and kelp-brown accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N10_uba9320 — UBA9320, mysterious particle-dwelling bacterium (Tuktuttaa/Itivia/Dock, marine)
- **File**: [`microbe_N10_uba9320.png`](microbe_N10_uba9320.png)
- **Genome**: `N10_uba9320` (UBA9320 sp. (order NS11-12g, Bacteroidia, marine))
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single small mysterious marine bacterium from the Bacteroidia, centered in a circular composition suitable for circular cropping. Morphological accuracy: a rod-shaped cell with rounded ends, smooth semi-translucent rose-pink cell envelope from a light-catching rhodopsin pump, with several small sticky dots on its surface, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind, NO flagella - only the pure little rod-shaped bacterial cell body. Big, curious, slightly puzzled cartoon eyes and a small mysterious smile drawn directly on the cell body. Scene: it clings to a drifting green flake of algae under a sheet of late-spring sea ice in an Arctic inlet, with soft blue light filtering down through the ice and a few faint glowing particles drifting by. Crisp bold outlines, clean vector-like digital cartoon style, cold marine palette with rose-pink and algae-green accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N12_nitrosopumilus — Nitrosopumilus, ammonia-oxidizing archaeon (Dock/Tuktuttaa, marine)
- **File**: [`microbe_N12_nitrosopumilus.png`](microbe_N12_nitrosopumilus.png)
- **Genome**: `N12_nitrosopumilus` (Nitrosopumilus sp. (Nitrosopumilaceae, Thermoproteota; an archaeon, marine))
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single tiny ammonia-oxidizing marine archaeon (not a bacterium), centered in a circular composition suitable for circular cropping. Morphological accuracy: a very small, slender, straight rod-shaped cell with rounded ends, smooth semi-translucent pale aqua cell envelope with a fine, delicate textured surface layer, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind, NO flagella - only the pure tiny rod-shaped cell body. Big, bright, friendly cartoon eyes and a small happy smile drawn directly on the cell body. Scene: it floats in cold, deep blue Arctic harbour water in late spring, catching tiny glowing pale-green ammonia bubbles that rise from the sea floor and releasing small soft violet sparkles that drift up toward green algae cells, with broken sea ice floating on the surface far above. Crisp bold outlines, clean vector-like digital cartoon style, cold dark marine palette with pale aqua and violet accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N11_caisji01 — CAISJI01, budding Planctomycete (2nd Lake, freshwater)
- **File**: [`microbe_N11_caisji01.png`](microbe_N11_caisji01.png)
- **Genome**: `N11_caisji01` (CAISJI01 sp. nov. (UBA1268, Pirellulales, Planctomycetota, freshwater))
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single budding freshwater bacterium from the Planctomycetota, centered in a circular composition suitable for circular cropping. Morphological accuracy: a plump pear-shaped to oval cell with a smooth semi-translucent coral-pink cell envelope and a small round daughter bud growing from its narrow end, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind, NO flagella - only the pure bacterial cell body and its bud. Big, proud, gentle cartoon eyes and a warm smile drawn directly on the cell body, and tiny happy closed eyes on the little bud. Scene: it sits among water plants and pebbles in the clear, cold water of a tundra lake in autumn, snipping small tags off floating sugar pieces, with golden-brown tundra hills and a big pale sky blurred above the water surface. Crisp bold outlines, clean vector-like digital cartoon style, cool freshwater palette with coral-pink accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N13_mycobacterium — Mycobacterium, waxy-coated lake rod (1st Lake, freshwater)
- **File**: [`microbe_N13_mycobacterium.png`](microbe_N13_mycobacterium.png)
- **Genome**: `N13_mycobacterium` (Mycobacterium sp. nov. (Mycobacteriaceae, freshwater))
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single rod-shaped freshwater bacterium of the genus Mycobacterium, centered in a circular composition suitable for circular cropping. Morphological accuracy: a straight to very slightly curved rod-shaped cell with rounded ends, covered in a thick, glossy, waxy cream-white coat that makes small water droplets bead up and roll off it, with a faint purple shimmer from light-catching rhodopsin pumps, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind, NO flagella - only the pure rod-shaped bacterial cell body. Big, calm, friendly cartoon eyes and a relaxed smile drawn directly on the cell body. Scene: it floats in the clear, cold water of a tundra lake in September, with pale sunlight coming through the surface, a few sedges along the shore and low rocky tundra hills blurred above the water line. Crisp bold outlines, clean vector-like digital cartoon style, cool freshwater palette with glossy cream and soft purple accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_N14_atzt02 — ATZT02, tiny crowd-forming lake bacterium (3rd Lake, freshwater)
- **File**: [`microbe_N14_atzt02.png`](microbe_N14_atzt02.png)
- **Genome**: `N14_atzt02` (ATZT02 sp. (UBA5976, order S36-B12, Actinomycetota, freshwater))
- **Generator**: agy image-generator subagent

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single tiny freshwater bacterium from the Actinomycetota, centered in a circular composition suitable for circular cropping. Morphological accuracy: a very small, short rod-shaped cell with rounded ends and a smooth semi-translucent lilac cell envelope from a light-catching rhodopsin pump, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind, NO flagella - only the pure tiny rod-shaped bacterial cell body. Big, cheerful cartoon eyes and a big grin drawn directly on the cell body. Scene: it floats in the middle of a huge friendly crowd of identical tiny lilac rod-shaped cells, filling the cold clear water of a tundra lake in autumn, with low golden autumn light from the surface and dark rocky hills blurred above the water line. Crisp bold outlines, clean vector-like digital cartoon style, cool freshwater palette with lilac and warm gold accents, perfectly centered. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_I1_pseudoalteromonas — Pseudoalteromonas, lab-grown seaweed-cutting rod (Dock isolate, marine)
- **File**: [`microbe_I1_pseudoalteromonas.png`](microbe_I1_pseudoalteromonas.png)
- **Genome**: `I1_pseudoalteromonas` (Pseudoalteromonas sp000239855 (Alteromonadaceae, Gammaproteobacteria; isolate grown from Dock water, marine))
- **Generator**: OpenRouter `google/gemini-3.1-flash-image` (1:1), cropped to the circle and resized to 560x560 PNG

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single marine bacterium of the genus Pseudoalteromonas, centered in a circular composition suitable for circular cropping. Morphological accuracy: a short, plump, slightly curved rod-shaped cell with rounded ends and one long, wavy flagellum at one end, smooth semi-translucent warm golden-yellow cell envelope, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind - only the pure rod-shaped bacterial cell body and its single flagellum. Big, patient, half-closed contented cartoon eyes and a calm little smile drawn directly on the cell body. Scene: it waits quietly in cold green-blue harbour water beside a swaying frond of brown kelp, snipping off small pieces of the slimy seaweed, while a few other tiny sleepy golden cells drift far apart in the water around it, with broken sea ice floating on the surface far above. Crisp bold outlines, clean vector-like digital cartoon style, cold marine palette with warm golden-yellow accents, perfectly centered, the underwater scene filling the entire square canvas edge to edge, with no white background, no frame and no border. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.

---

## microbe_I2_shewanella — Shewanella, lab-grown metal-breathing rod (Dock isolate, marine)
- **File**: [`microbe_I2_shewanella.png`](microbe_I2_shewanella.png)
- **Genome**: `I2_shewanella` (Shewanella sp. nov. (Shewanellaceae, Gammaproteobacteria; isolate grown from Dock water, marine))
- **Generator**: OpenRouter `google/gemini-3.1-flash-image` (1:1), cropped to the circle and resized to 560x560 PNG

**Generation Prompt:**
> Vibrant charming, slightly goofy 2D scientific cartoon illustration of a single marine bacterium of the genus Shewanella, centered in a circular composition suitable for circular cropping. Morphological accuracy: a straight rod-shaped cell with rounded ends and one long, wavy flagellum at one end, smooth semi-translucent salmon-pink cell envelope with tiny glowing electric sparks crackling along its surface and a few small glowing orange oil droplets inside, strictly NO arms, NO legs, NO hands, NO feet, NO tentacles, NO limbs of any kind - only the pure rod-shaped bacterial cell body and its single flagellum. Big, wide, delighted cartoon eyes and an excited open grin drawn directly on the cell body. Scene: it rests on the dark muddy sea floor of a cold Arctic harbour, touching a rusty orange pebble and sending small bright electric sparks into it, with pale light filtering down through sea ice far above. Crisp bold outlines, clean vector-like digital cartoon style, cold dark marine palette with salmon-pink, rust-orange and electric-yellow accents, perfectly centered, the underwater scene filling the entire square canvas edge to edge, with no white background, no frame and no border. ABSOLUTELY ZERO TEXT, no words, no letters, no numbers, no labels.
