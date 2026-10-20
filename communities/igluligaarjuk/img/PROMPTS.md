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
