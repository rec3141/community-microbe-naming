// Rules of the microbe card game, as HTML, shared by every community (cards.html shows them
// and prints the quick-rules sheet). docs/card_game.md has the same rules plus the design notes.
// Numbers come from MicrobeCards.TUNE so the text always matches the engine.
(function (root) {
'use strict';
const T = (root.MicrobeCards || {}).TUNE || {};
const GAME_NAME = 'Microbe Clash';

const QUICK = `
<h3>Goal</h3>
<p>Be the first to <b>wash out ${T.winScore || 3}</b> of your rival's microbes.</p>
<h3>Set up (about 3 minutes)</h3>
<ol>
  <li>Shuffle the microbe cards and lay <b>10</b> face up. Take turns picking: A, B, B, A, A, B, B, A, A, B. Each of you now has a team of ${T.teamSize || 5}.</li>
  <li>Shuffle the Event cards and deal each player ${T.handStart || 3}. Shuffle the Place cards and turn the top one face up between you.</li>
  <li>Each player puts 1 microbe in front as their <b>Active</b> and up to ${T.benchMax || 3} behind it as their <b>Bench</b>. Keep any others in your hand.</li>
  <li>Flip a coin. The winner goes first but cannot attack on that very first turn.</li>
</ol>
<h3>On your turn</h3>
<ol>
  <li><b>Draw</b> 1 Event card.</li>
  <li><b>Feed</b>: put 1 nutrient (a coin, bead or bean) on one of your microbes. If the Place card lists that microbe, put <b>2</b>.</li>
  <li>You <b>may</b>: put microbes from your hand on your Bench · play <b>1</b> Event card · <b>retreat</b> once (take nutrients off your Active equal to its retreat cost, then swap it with a Bench microbe).</li>
  <li><b>Attack</b>: if your Active has at least as many nutrients as an attack's cost (●), do that damage to your rival's Active. Nutrients stay on the card. Your turn ends.</li>
</ol>
<h3>Damage</h3>
<p><b>Weakness</b> ×${T.weakMult || 2} · <b>Resistance</b> −${T.resist || 20} · <b>Can't hurt</b>: 0 damage · <b>+${T.seasonBonus || 10}</b> if the Place's season matches the attacker's peak season (🌸 spring, 🍁 fall). Keep track with tokens or a pencil.</p>
<h3>Washed out</h3>
<p>When a microbe's damage reaches its HP, it is washed out: put it aside. Its owner picks a new Active, then looks at the top 2 Place cards and puts one in play (the old Place goes to the bottom).</p>
<h3>Wrong water</h3>
<p>At the start of your turn, a lake microbe Active in a salty Place, or a sea microbe Active in a lake, takes 10 damage. 🧂 microbes are fine in salt water.</p>`;

const FULL = `
<h3>What you need</h3>
<p>The microbe cards, the Place cards and the Event cards (one printed set is enough for 2 players), plus about 30 small tokens for nutrients (coins, beads, beans) and a pencil and paper or tokens for damage.</p>
<h3>The cards</h3>
<ul>
  <li><b>Microbe cards</b> are the real microbes from this workshop. Each has <b>HP</b> (how hard it is to wipe out), a <b>type</b> (how it makes a living), 2 <b>attacks</b>, sometimes an <b>ability</b>, a <b>weakness</b> or <b>resistance</b> from its cell wall, a <b>retreat cost</b>, and <b>badges</b> (☀ rhodopsin, ❄ cold-shock proteins, 🧂 salt protection, 🛡 CRISPR, 🔹 tiny). The bottom shows where it was found and its peak season.</li>
  <li><b>Place cards</b> are the sampling sites in a season. They say if the water is salty or fresh and list the microbes found there in that season (* = found there, date not recorded).</li>
  <li><b>Event cards</b> are things that happen in nature: viruses, grazers, ice, sunshine, spills and more.</li>
</ul>
<h3>Set up</h3>
<ol>
  <li><b>Draft.</b> Shuffle the microbe cards and lay 10 face up. Pick in this order: A, B, B, A, A, B, B, A, A, B, so each player gets ${T.teamSize || 5}. Put the rest back in the box. (Short on time? Deal 5 each at random.)</li>
  <li>Shuffle the Event cards and deal ${T.handStart || 3} to each player; keep them secret. The rest is the Event pile. When it runs out, shuffle the used Events to make a new pile.</li>
  <li>Shuffle the Place cards into a pile and turn the top one face up between the players.</li>
  <li>Each player puts 1 microbe face up as their Active and up to ${T.benchMax || 3} face up as their Bench. Microbes left in your hand can join the Bench later.</li>
  <li>Flip a coin to see who goes first. The first player cannot attack on their first turn.</li>
</ol>
<h3>A turn</h3>
<ol>
  <li><b>Draw</b> the top Event card.</li>
  <li><b>Feed once</b>: put 1 nutrient token on any one of your microbes in play (Active or Bench). If the current Place lists that microbe, put 2 instead.</li>
  <li><b>Any time before you attack</b>, in any order:
    <ul><li>put microbes from your hand on your Bench (no more than ${T.benchMax || 3} on the Bench);</li>
    <li>play <b>one</b> Event card, then put it on the used pile;</li>
    <li><b>retreat</b> once: remove nutrients from your Active equal to its retreat cost, then swap it with one of your Bench microbes. Damage and nutrients stay on each card.</li></ul></li>
  <li><b>Attack</b> with your Active (optional). Choose one attack whose cost (●) is no more than the nutrients on your Active. Nutrients are not spent. Deal its damage to your rival's Active unless the attack says otherwise. Your turn ends after you attack (or when you choose to stop).</li>
  <li>At the end of your turn, use any "end of your turn" abilities (Carbon Catcher).</li>
</ol>
<h3>Working out damage</h3>
<ol>
  <li>Start with the number on the attack.</li>
  <li>Add ${T.seasonBonus || 10} if the Place's season is the attacker's peak season (🌸 or 🍁 next to its name).</li>
  <li>Add any ability bonus (Mystery Genes, Quorum Sensing).</li>
  <li>If the defender is <b>weak</b> to the attack's kind (🎯 Hunt or 🧪 Toxin), multiply by ${T.weakMult || 2}. If it <b>resists</b> it, subtract ${T.resist || 20}. If it <b>can't be hurt</b> by that kind, the damage is 0.</li>
</ol>
<h3>Washing out</h3>
<p>A microbe whose damage reaches its HP is washed out: set it and its nutrients aside. The other player scores 1. The owner then (1) picks a new Active from their Bench, or from their hand if the Bench is empty, and (2) looks at the top 2 Place cards and puts one face up; the old Place and the other card go to the bottom of the Place pile. This lets the player who is behind pick the next Place.</p>
<h3>Wrong water</h3>
<p>At the start of your turn, if your Active is a freshwater (lake) microbe and the Place is salty, or a marine microbe and the Place is a lake, it takes 10 damage. Lake microbes with 🧂 (salt protectors) do not.</p>
<h3>Winning</h3>
<p>The first player to wash out ${T.winScore || 3} rival microbes wins. You also win if your rival has no microbes left in play or in hand.</p>
<h3>Fine print</h3>
<ul>
  <li>An ability works on its own; you do not choose to use it.</li>
  <li>Damage that hits a Bench microbe (Chemotaxis Chase) still uses weakness and resistance.</li>
  <li>Damage from Events and wrong water ignores weakness and resistance.</li>
  <li>If an Event makes two microbes tie (Phage Attack), the player who played it chooses.</li>
  <li>Seed Bank: the microbe goes back to your hand with no damage and no nutrients; it can come back later.</li>
</ul>`;

const API = {GAME_NAME, QUICK, FULL};
root.MicrobeRules = API;
if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
