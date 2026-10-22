// Plain-language ecosystem-service cards (about grade 8), keyed by the CICES code that
// EcoSSDB uses. Shared by every community. img is relative to the page (site/img/es/).
// {title, img, front: the story on the front of the card}; the back shows the EcoSSDB numbers.
// SERVICE_REVIEWS (below) are the joke star reviews on the front of each card.
window.SERVICE_INFO = {
 "2.1.1.1": {"title": "Cleaning up waste", "img": "img/es/waste.jpg",
  "front": "Every day, dead plankton, fish scraps, leaves and animal waste end up in the water. Without microbes, it would pile up. Microbes like this one break it down into simple nutrients that algae can use again. Some of the same enzymes can also break down pollutants like oil."},
 "2.1.1.2": {"title": "Trapping pollutants and metals", "img": "img/es/pollutants.jpg",
  "front": "Some microbes can grab metals like mercury, copper or arsenic, lock them away or change them into less harmful forms, and pump them out of their cells. That helps keep these toxic metals from moving up the food chain into fish, seals and people."},
 "2.3.3.2": {"title": "Keeping disease in check", "img": "img/es/disease.jpg",
  "front": "Microbes compete with each other all the time. Some make natural antibiotics, some fight viruses, and some simply take up the space and food that harmful germs would need. A healthy, diverse community of microbes makes it harder for disease-causing ones to take over."},
 "2.3.4.2": {"title": "Building healthy mud and soil", "img": "img/es/sediment.jpg",
  "front": "The mud at the bottom of lakes and the sea, and the soil on land, store huge amounts of carbon and nutrients. Microbes decide how much of it is kept and how much is released. They also glue particles together and feed worms and other bottom-dwellers."},
 "2.3.5.1": {"title": "Keeping fresh water clean", "img": "img/es/freshwater.jpg",
  "front": "Lakes and rivers stay clear and safe partly because of microbes. They remove extra nutrients that would cause algae blooms, turn toxic nitrite and ammonia into harmless forms, and break down dissolved organic matter from the land."},
 "2.3.5.2": {"title": "Keeping seawater healthy", "img": "img/es/saltwater.jpg",
  "front": "In the sea, microbes recycle nutrients so algae can keep growing, keep oxygen and sulfur chemistry in balance, and break down what falls from the sea ice and the surface. Healthy seawater chemistry supports everything from plankton to whales."},
 "2.3.6.1": {"title": "Shaping the climate", "img": "img/es/climate.jpg",
  "front": "Microbes take in and give off greenhouse gases like carbon dioxide, methane and nitrous oxide. Some lock carbon away in their bodies or in the mud, and others release it. Added up over all the world's oceans, lakes and soils, these tiny cells help set the temperature of the planet."},
 "2.3.6.2": {"title": "Keeping the air clean", "img": "img/es/air.jpg",
  "front": "Some gases made in the water, such as smelly sulfur gases, can escape into the air. Microbes that eat or change these gases affect the air we breathe, and some of these gases even help clouds form over the ocean."}
};
// what the role colours on the back of each card mean
window.SERVICE_ROLES = {
 "producer": "makes something that helps (for example, an enzyme that breaks down waste)",
 "transformer": "changes one substance into another (for example, nitrite into nitrate)",
 "consumer": "uses up or removes a substance",
 "inhibitor": "works against this service (for example, antibiotic resistance)"
};

// Joke "customer reviews" on the front of each card, keyed like SERVICE_INFO. The star rating
// comes from the EcoSSDB score (see SERVICE_STARS); the tier picks the review: high (4+ stars),
// mid (2.5-4) or low (under 2.5, including scores below zero). {name} = the microbe's nickname,
// {genes} = its number of genes for that service. Reviewers are animals, places and things.
window.SERVICE_STARS = {full: 0.75};  // a score of 0.75 or more = 5 stars; 0 or less = 1 star
window.SERVICE_REVIEWS = {
 "2.1.1.1": {
  "high": [{"text": "Left a whole fish skeleton on the lake bottom. By spring it was gone. {name} did not even leave a bill.", "by": "A tidy Arctic char"},
           {"text": "{genes} different ways to eat garbage?! This is the best clean-up crew on the coast.", "by": "Itivia beach"}],
  "mid":  [{"text": "Cleaned up most of my mess. Missed the oily bits. Would still recommend.", "by": "A seagull with bad manners"},
           {"text": "Solid work on the leftovers. A bit slow in the cold, but who isn't?", "by": "The bottom of 2nd Lake"}],
  "low":  [{"text": "I asked for a deep clean. It mostly just looked at the mess.", "by": "A grumpy old boot"},
           {"text": "Some of its genes actually work against clean-up. Two stars for showing up.", "by": "A suspicious clam"}]},
 "2.1.1.2": {
  "high": [{"text": "Grabbed every speck of metal out of my water and held on tight. Fish are safer, I am shinier.", "by": "A river rock"},
           {"text": "{genes} metal-handling genes. Basically a tiny magnet with a smile.", "by": "A worried scientist (now relaxed)"}],
  "mid":  [{"text": "Caught some of the bad metals. Let a few slip by. Friendly, though.", "by": "A sculpin"},
           {"text": "Good sponge. Not the best sponge. A medium sponge.", "by": "An actual sponge"}],
  "low":  [{"text": "I expected it to trap pollutants. It mostly trapped my attention.", "by": "A slightly rusty anchor"},
           {"text": "Not really its job. Respect for trying.", "by": "The town water truck"}]},
 "2.3.3.2": {
  "high": [{"text": "Bad germs showed up and {name} told them to leave. They left. Ten out of ten bodyguard.", "by": "A healthy young seal"},
           {"text": "Makes its own germ-fighting chemicals. I feel very protected in here.", "by": "A shy zooplankton"}],
  "mid":  [{"text": "Kept the troublemakers mostly in line. Mostly.", "by": "A sea urchin"},
           {"text": "Takes up the space bad germs want. Not flashy, but it works.", "by": "The Dock"}],
  "low":  [{"text": "Carries some antibiotic-resistance genes. Hmm. One star for honesty.", "by": "A nervous nurse shark (visiting)"},
           {"text": "Did not fight any germs while I was watching. Nice colour though.", "by": "A passing beluga"}]},
 "2.3.4.2": {
  "high": [{"text": "Packed carbon into my mud like a pro. My worms have never been happier.", "by": "The bottom of the inlet"},
           {"text": "{genes} genes for making mud better. Would let it redecorate my sediment again.", "by": "A very content worm"}],
  "mid":  [{"text": "Mud is nicer than before. Could be muddier. Honest work.", "by": "A clam who loves mud"},
           {"text": "Fine soil service. Arrived late in spring, left early in fall.", "by": "A tundra pond"}],
  "low":  [{"text": "Mostly floats around instead of helping the mud. Mud is disappointed.", "by": "The lake floor"},
           {"text": "It said it would help with the sediment. It did not.", "by": "A lonely snail"}]},
 "2.3.5.1": {
  "high": [{"text": "My water has never been this clear. I can see my own fins!", "by": "A lake trout"},
           {"text": "Removed the extra nutrients before the algae could party. Five stars, no green soup.", "by": "1st Lake"}],
  "mid":  [{"text": "Pretty good at cleaning. My water is a little tea-coloured, but that is how I like it.", "by": "3rd Lake"},
           {"text": "Does its job quietly. Like a good janitor.", "by": "A mosquito larva"}],
  "low":  [{"text": "Not much of a water cleaner. But a nice lodger.", "by": "A pebble"},
           {"text": "Some genes help, some do the opposite. It's complicated.", "by": "A confused duck"}]},
 "2.3.5.2": {
  "high": [{"text": "Recycles nutrients so fast my algae garden never runs out. Best neighbour on the coast.", "by": "Sea ice algae"},
           {"text": "Kept my seawater just right all summer. Would float with again.", "by": "A ringed seal"}],
  "mid":  [{"text": "Good seawater helper. Prefers lakes, honestly. Still showed up.", "by": "A visiting jellyfish"},
           {"text": "Did a decent job. Salty about the cold, like everyone else.", "by": "Tuktuttaa"}],
  "low":  [{"text": "Barely helped with the seawater. Probably a lake person.", "by": "A very salty wave"},
           {"text": "One star. It was not even in the sea.", "by": "A strict seagull"}]},
 "2.3.6.1": {
  "high": [{"text": "Grabbed carbon dioxide out of the water and turned it into food. The planet says thanks.", "by": "The sky above Hudson Bay"},
           {"text": "{genes} climate genes! Small cell, big job. Would trust with my weather.", "by": "A polar bear on thin ice"}],
  "mid":  [{"text": "Keeps some carbon in, lets some carbon out. Balanced, like a good diet.", "by": "A wise old iceberg"},
           {"text": "Helps the climate a little. Every little bit counts.", "by": "A snowflake"}],
  "low":  [{"text": "Breathes out more than it takes in. Not a climate hero, but not a villain either.", "by": "A cloud"},
           {"text": "It said 'climate' was not on its menu today.", "by": "A slightly warm breeze"}]},
 "2.3.6.2": {
  "high": [{"text": "Ate the stinky gas before it reached my nose. Fresh air, five stars.", "by": "A sled dog"},
           {"text": "Made the air over the inlet smell like nothing at all. Incredible.", "by": "A tourist from the south"}],
  "mid":  [{"text": "Air is mostly fresh. Occasional whiff. Acceptable.", "by": "A fussy fox"},
           {"text": "Handles a few smelly gases. Leaves the rest to its friends.", "by": "A raven"}],
  "low":  [{"text": "Did nothing about the smell. Still smells. One star.", "by": "A very honest nose"},
           {"text": "Not an air cleaner. Possibly made things worse. We are investigating.", "by": "The wind"}]}
};
