// Links from what we know about a microbe to everyday English words, used by the dictionary's
// "Suggested" view to find words (in any community's language) that fit the current microbe.
// Shared by every community. Each hint: when = a regex (case-insensitive) tested against the
// microbe's own text (nickname, story, functions, tags); words = English words looked for in
// dictionary glosses; why = the short reason shown next to each suggested word.
// Habitat and season hints come from the data (habitat, and the months it was found), not text.
window.WORD_HINTS = {
 "habitat": {
  "marine":     {"why": "lives in the sea", "words": ["sea", "salt", "harbour", "inlet", "shore", "seaweed", "seal", "fish", "whale", "tide", "waves", "swells"]},
  "freshwater": {"why": "lives in lakes", "words": ["lake", "river", "fresh water", "drinking water", "trout", "water", "pond"]}
 },
 "season": {
  "spring": {"why": "found in spring", "words": ["spring", "melt", "melting"]},
  "summer": {"why": "found in summer", "words": ["summer"]},
  "autumn": {"why": "found in autumn", "words": ["autumn", "fall", "freeze-up"]},
  "winter": {"why": "found in winter", "words": ["winter"]}
 },
 "traits": [
  {"when": "\\bice\\b|sea ice|frozen|freez|cold|arctic", "why": "cold and ice", "words": ["ice", "cold", "snow", "frozen", "freeze"]},
  {"when": "sun|light|rhodopsin|photosynth", "why": "uses sunlight", "words": ["sun", "light", "bright", "shine"]},
  {"when": "carbon dioxide|rubisco|makes? its own food|carbon catch|fix(es|ing)? carbon", "why": "makes its own food", "words": ["food", "air", "breath"]},
  {"when": "hunt|predator|prey|attack", "why": "a hunter", "words": ["hunt", "hunter", "catch", "caught", "harpoon", "fast"]},
  {"when": "swim|flagell|commut|travel", "why": "swims and travels", "words": ["swim", "paddle", "kayak", "boat", "travel", "fast"]},
  {"when": "glid", "why": "glides along surfaces", "words": ["slide", "sled", "slippery", "smooth"]},
  {"when": "sulfur|sulphur|rotten", "why": "uses sulfur", "words": ["smell", "stink", "rotten"]},
  {"when": "\\boil\\b|alkane|hydrocarbon|fuel|diesel", "why": "can break down oil", "words": ["oil", "blubber", "fuel", "gas", "lamp", "fat"]},
  {"when": "vitamin", "why": "makes vitamins", "words": ["healthy", "health", "strong"]},
  {"when": "tiny|small|minimal|dwarf|pint|nano|streamlin", "why": "very small", "words": ["small", "little", "tiny"]},
  {"when": "giant|\\bbig\\b|large genome|huge", "why": "big for a microbe", "words": ["big", "large", "giant"]},
  {"when": "abundant|crowd|plentiful|common|most of", "why": "there are lots of them", "words": ["many", "lots", "crowd"]},
  {"when": "mystery|unknown|arcane|baffl|new species|never been", "why": "a mystery to science", "words": ["new", "unknown", "strange", "secret"]},
  {"when": "round|ball|sphere|coccus|globus", "why": "round shape", "words": ["round", "ball", "circle"]},
  {"when": "rod-shaped|\\brod\\b|rods", "why": "rod shape", "words": ["stick", "rod", "long"]},
  {"when": "bud", "why": "grows buds", "words": ["bud", "baby", "child", "grow"]},
  {"when": "wax|coat|mantle|armou?r|mycolic|shield", "why": "a tough coat", "words": ["coat", "parka", "skin", "clothing", "shell"]},
  {"when": "ammonia|nitr", "why": "recycles nitrogen", "words": ["urine", "waste", "clean"]},
  {"when": "seaweed|kelp|alginate|frond", "why": "eats seaweed", "words": ["seaweed", "kelp"]},
  {"when": "\\bmud\\b|sediment", "why": "found near mud", "words": ["mud"]},
  {"when": "chitin|shell", "why": "eats shells and crusts", "words": ["shell", "shrimp", "crab"]},
  {"when": "sugar|starch|munch|feast|eat|nibbl|peckish|hungry", "why": "a good eater", "words": ["eat", "food", "hungry"]},
  {"when": "persist|surviv|tough|hardy", "why": "a survivor", "words": ["strong", "tough"]},
  {"when": "fast|bullet|quick", "why": "fast", "words": ["fast", "quick"]}
 ]
};
