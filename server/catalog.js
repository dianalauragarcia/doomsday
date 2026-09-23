/**
 * Monitored accounts, keywords, superpowers, and alchemies from the
 * Avengers: Doomsday Fan Variance Authority brief.
 *
 * Handles stored without @, lowercase.
 * MCU-wide handles and keywords raise the diehard score and do not
 * assign a fandom by themselves.
 */

export const WIDE_HANDLES = ["marvel", "marvelstudios"];

export const WIDE_KEYWORDS = ["mcu", "marvel cinematic universe"];

export const FRANCHISES = [
  {
    id: "fantastic-four",
    name: "Fantastic Four",
    handles: ["fantasticfour"],
    keywords: [
      "fantastic four",
      "fantastic 4",
      "the fantastic four: first steps",
      "galactus",
      "silver surfer",
      "shalla-bal",
      "shalla bal",
      "baxter building",
      "franklin richards",
      "valeria richards",
    ],
    characters: [
      {
        id: "invisible-woman",
        name: "The Invisible Woman",
        keywords: ["the invisible woman", "invisible woman", "sue storm", "susan storm"],
      },
      {
        id: "mister-fantastic",
        name: "Mister Fantastic",
        keywords: ["mister fantastic", "mr. fantastic", "mr fantastic", "reed richards"],
      },
      {
        id: "human-torch",
        name: "Human Torch",
        keywords: ["the human torch", "human torch", "johnny storm", "flame on"],
      },
      {
        id: "the-thing",
        name: "The Thing",
        keywords: [
          "the thing",
          "ben grimm",
          "it's clobberin' time",
          "its clobberin' time",
          "clobberin' time",
          "clobberin time",
        ],
      },
      {
        id: "herbie",
        name: "H.E.R.B.I.E.",
        keywords: ["h.e.r.b.i.e.", "h.e.r.b.i.e", "herbie"],
      },
    ],
  },
  {
    id: "black-panther",
    name: "Black Panther",
    handles: ["blackpanther", "theblackpanther"],
    keywords: [
      "wakanda",
      "talokan",
      "okoye",
      "nakia",
      "ramonda",
      "queen ramonda",
      "killmonger",
      "everett ross",
      "riri williams",
      "ironheart",
      "dora milaje",
      "vibranium",
      "wakanda forever",
      "t'challa",
      "t’challa",
    ],
    characters: [
      {
        id: "shuri",
        name: "Black Panther (Shuri)",
        keywords: ["shuri", "black panther"],
      },
      {
        id: "mbaku",
        name: "M'Baku",
        keywords: ["m'baku", "m’baku", "mbaku"],
      },
      { id: "namor", name: "Namor", keywords: ["namor"] },
      { id: "namora", name: "Namora", keywords: ["namora"] },
      { id: "attuma", name: "Attuma", keywords: ["attuma"] },
    ],
  },
  {
    id: "avengers",
    name: "Avengers",
    handles: ["avengers", "captainamerica", "antman", "thorofficial"],
    keywords: [
      "captain america",
      "earth's mightiest heroes",
      "earth’s mightiest heroes",
      "avengers",
      "avengers doomsday",
      "avengers: doomsday",
      "avengers endgame",
      "tony stark",
      "iron man",
      "bruce banner",
      "hulk",
      "natasha romanoff",
      "black widow",
      "clint barton",
      "hawkeye",
      "wanda maximoff",
      "scarlet witch",
      "carol danvers",
      "captain marvel",
      "peter parker",
      "spider-man",
      "spider man",
      "i love you 3000",
    ],
    characters: [
      {
        id: "steve-rogers",
        name: "Captain America (Steve Rogers)",
        keywords: ["steve rogers", "nomad"],
      },
      {
        id: "sam-wilson",
        name: "Captain America (Sam Wilson)",
        keywords: ["sam wilson"],
      },
      {
        id: "thor",
        name: "Thor",
        keywords: ["thor", "god of thunder"],
      },
      {
        id: "ant-man",
        name: "Ant-Man",
        keywords: ["ant-man", "ant man", "scott lang"],
      },
      {
        id: "falcon",
        name: "Falcon",
        keywords: ["falcon", "joaquin torres"],
      },
      {
        id: "doctor-strange",
        name: "Doctor Strange",
        keywords: ["doctor strange", "stephen strange"],
      },
    ],
  },
  {
    id: "misc",
    name: "Misc",
    handles: ["lokiofficial", "shangchi"],
    keywords: ["cassie lang", "peggy carter", "agent carter"],
    characters: [
      {
        id: "shang-chi",
        name: "Shang-Chi",
        keywords: ["shang-chi", "shang chi", "xu shang-chi", "master of the ten rings"],
      },
      {
        id: "loki",
        name: "Loki",
        keywords: ["loki", "god of mischief"],
      },
    ],
  },
  {
    id: "thunderbolts",
    name: "Thunderbolts",
    handles: [],
    keywords: [
      "new avengers",
      "thunderbolts*",
      "thunderbolts",
      "valentina allegra de fontaine",
      "antonia dreykov",
    ],
    characters: [
      {
        id: "yelena",
        name: "Black Widow (Yelena)",
        keywords: ["yelena belova", "yelena"],
      },
      {
        id: "winter-soldier",
        name: "Winter Soldier",
        keywords: [
          "bucky barnes",
          "james buchanan barnes",
          "the winter soldier",
          "winter soldier",
          "white wolf",
        ],
      },
      {
        id: "us-agent",
        name: "U.S. Agent",
        keywords: ["john walker", "u.s. agent", "us agent"],
      },
      {
        id: "sentry",
        name: "Sentry",
        keywords: ["bob reynolds", "the void", "sentry"],
      },
      {
        id: "red-guardian",
        name: "Red Guardian",
        keywords: ["alexei shostakov", "red guardian"],
      },
      {
        id: "ghost",
        name: "Ghost",
        keywords: ["ava starr", "ghost"],
      },
    ],
  },
  {
    id: "x-men",
    name: "X-Men",
    handles: ["xmenmovies"],
    keywords: [
      "x-men",
      "xmen",
      "xavier institute",
      "xavier's school",
      "xavier’s school",
      "x-mansion",
      "brotherhood of mutants",
      "cerebro",
      "to me my x-men",
      "to me, my x-men",
      "wolverine",
      "jean grey",
      "ororo munroe",
      "deadpool",
    ],
    characters: [
      {
        id: "mystique",
        name: "Mystique",
        keywords: ["raven darkhölme", "raven darkholme", "mystique"],
      },
      {
        id: "cyclops",
        name: "Cyclops",
        keywords: ["scott summers", "cyclops"],
      },
      {
        id: "gambit",
        name: "Gambit",
        keywords: ["remy etienne lebeau", "remy lebeau", "gambit"],
      },
      {
        id: "beast",
        name: "Beast",
        keywords: ["hank mccoy", "beast"],
      },
      {
        id: "professor-x",
        name: "Professor X",
        keywords: ["charles xavier", "professor x"],
      },
      {
        id: "magneto",
        name: "Magneto",
        keywords: ["max eisenhardt", "erik lehnsherr", "magneto"],
      },
      {
        id: "nightcrawler",
        name: "Nightcrawler",
        keywords: ["kurt wagner", "nightcrawler"],
      },
    ],
  },
  {
    id: "villain",
    name: "Villain",
    handles: [],
    keywords: ["sentinels", "thanos", "ultron", "red skull", "zemo"],
    characters: [
      {
        id: "doctor-doom",
        name: "Doctor Doom",
        keywords: [
          "doctor doom",
          "victor von doom",
          "latveria",
          "doombots",
          "i am doom",
        ],
      },
    ],
  },
];

export const CHARACTERS = Object.fromEntries(
  FRANCHISES.flatMap((franchise) =>
    franchise.characters.map((character) => [
      character.id,
      { ...character, franchiseId: franchise.id, franchiseName: franchise.name },
    ]),
  ),
);

export const ALCHEMY = {
  "doctor-doom": {
    partnerId: "herbie",
    reason:
      "The most arrogant monarch in the Marvel Universe and a cheerful little robot. H.E.R.B.I.E. handles the logistics, scanning, and “please don’t vaporize the civilians” duties while Doom focuses on world domination. Unexpected because Doom would never admit he needs a sidekick.",
  },
  herbie: {
    partnerId: "doctor-doom",
    reason:
      "The most arrogant monarch in the Marvel Universe and a cheerful little robot. H.E.R.B.I.E. handles the logistics, scanning, and “please don’t vaporize the civilians” duties while Doom focuses on world domination. Unexpected because Doom would never admit he needs a sidekick.",
  },
  mystique: {
    partnerId: "shang-chi",
    reason:
      "Master of disguise plus master of kung fu. She gets them in anywhere; he handles anyone who sees through the disguise. A perfect infiltration-and-extraction team that neither the X-Men nor the martial-arts world would see coming.",
  },
  "shang-chi": {
    partnerId: "mystique",
    reason:
      "Master of disguise plus master of kung fu. She gets them in anywhere; he handles anyone who sees through the disguise. A perfect infiltration-and-extraction team that neither the X-Men nor the martial-arts world would see coming.",
  },
  cyclops: {
    partnerId: "attuma",
    reason:
      "The disciplined field commander and the raging Atlantean warlord. Cyclops provides tactics and precise long-range fire; Attuma supplies overwhelming close-quarters power and underwater dominance. Land-and-sea leadership with zero shared history.",
  },
  attuma: {
    partnerId: "cyclops",
    reason:
      "The disciplined field commander and the raging Atlantean warlord. Cyclops provides tactics and precise long-range fire; Attuma supplies overwhelming close-quarters power and underwater dominance. Land-and-sea leadership with zero shared history.",
  },
  gambit: {
    partnerId: "loki",
    reason:
      "Two professional charmers and chaos agents. Charged playing cards plus god-level illusions and lies. They’d run the galaxy’s greatest con and argue about who gets credit the entire time.",
  },
  loki: {
    partnerId: "gambit",
    reason:
      "Two professional charmers and chaos agents. Charged playing cards plus god-level illusions and lies. They’d run the galaxy’s greatest con and argue about who gets credit the entire time.",
  },
  beast: {
    partnerId: "namora",
    reason:
      "Brilliant scientist and super-strong Atlantean princess. He analyzes the problem; she punches the solution, on land or in the deepest trench. Lab coat meets trident in a pairing no one would book.",
  },
  namora: {
    partnerId: "beast",
    reason:
      "Brilliant scientist and super-strong Atlantean princess. He analyzes the problem; she punches the solution, on land or in the deepest trench. Lab coat meets trident in a pairing no one would book.",
  },
  "professor-x": {
    partnerId: "sentry",
    reason:
      "The most powerful telepath on Earth and the most powerful (and unstable) being on Earth. Xavier can keep the Void in check long enough for Sentry to actually be useful. Terrifying potential, zero natural alliance.",
  },
  sentry: {
    partnerId: "professor-x",
    reason:
      "The most powerful telepath on Earth and the most powerful (and unstable) being on Earth. Xavier can keep the Void in check long enough for Sentry to actually be useful. Terrifying potential, zero natural alliance.",
  },
  magneto: {
    partnerId: "shuri",
    reason:
      "Master of magnetism and the foremost vibranium expert alive. Together they could turn any metal, especially Wakandan metal, into an unstoppable weapon or fortress. Mutant supremacist and Black Panther scientist is a combination that should never happen.",
  },
  shuri: {
    partnerId: "magneto",
    reason:
      "Master of magnetism and the foremost vibranium expert alive. Together they could turn any metal, especially Wakandan metal, into an unstoppable weapon or fortress. Mutant supremacist and Black Panther scientist is a combination that should never happen.",
  },
  nightcrawler: {
    partnerId: "ant-man",
    reason:
      "Teleportation plus shrinking. They can appear inside any location at any size. The ultimate “how did they even get in here?” duo.",
  },
  "ant-man": {
    partnerId: "nightcrawler",
    reason:
      "Teleportation plus shrinking. They can appear inside any location at any size. The ultimate “how did they even get in here?” duo.",
  },
  yelena: {
    partnerId: "mister-fantastic",
    reason:
      "Cynical spy and stretchy super-genius. She does the wetwork and the lying; he builds the gadgets and the exit strategy. Thunderbolts pragmatism meets Fantastic Four optimism.",
  },
  "mister-fantastic": {
    partnerId: "yelena",
    reason:
      "Cynical spy and stretchy super-genius. She does the wetwork and the lying; he builds the gadgets and the exit strategy. Thunderbolts pragmatism meets Fantastic Four optimism.",
  },
  "winter-soldier": {
    partnerId: "invisible-woman",
    reason:
      "Covert assassin and the woman who can turn the entire team invisible and wrap it in force fields. Stealth and protection taken to an extreme neither the Howling Commandos nor the Fantastic Four ever planned.",
  },
  "invisible-woman": {
    partnerId: "winter-soldier",
    reason:
      "Covert assassin and the woman who can turn the entire team invisible and wrap it in force fields. Stealth and protection taken to an extreme neither the Howling Commandos nor the Fantastic Four ever planned.",
  },
  "us-agent": {
    partnerId: "mbaku",
    reason:
      "Two loud, uncompromising warriors who think everyone else is too soft. They would argue constantly and still be the most effective front-line pair in any fight.",
  },
  mbaku: {
    partnerId: "us-agent",
    reason:
      "Two loud, uncompromising warriors who think everyone else is too soft. They would argue constantly and still be the most effective front-line pair in any fight.",
  },
  "red-guardian": {
    partnerId: "human-torch",
    reason:
      "Soviet super-soldier durability plus living firestorm. One tanks everything; the other burns everything. Cold-War relic and youngest Fantastic Four member is peak unexpected.",
  },
  "human-torch": {
    partnerId: "red-guardian",
    reason:
      "Soviet super-soldier durability plus living firestorm. One tanks everything; the other burns everything. Cold-War relic and youngest Fantastic Four member is peak unexpected.",
  },
  ghost: {
    partnerId: "doctor-strange",
    reason:
      "Phasing assassin and Sorcerer Supreme. She walks through any defense; he handles the mystic backlash. Thunderbolts tech-ghost and the guy who lives in the Sanctum Sanctorum.",
  },
  "doctor-strange": {
    partnerId: "ghost",
    reason:
      "Phasing assassin and Sorcerer Supreme. She walks through any defense; he handles the mystic backlash. Thunderbolts tech-ghost and the guy who lives in the Sanctum Sanctorum.",
  },
  "steve-rogers": {
    partnerId: "namor",
    reason:
      "The two most stubborn kings on the planet. Shield and trident, surface and sea. They’ve fought more than they’ve teamed, which makes the pairing even better.",
  },
  namor: {
    partnerId: "steve-rogers",
    reason:
      "The two most stubborn kings on the planet. Shield and trident, surface and sea. They’ve fought more than they’ve teamed, which makes the pairing even better.",
  },
  "sam-wilson": {
    partnerId: "thor",
    reason:
      "Wings and lightning. Aerial reconnaissance plus the God of Thunder. New Cap and the Odinson is a combination that just feels right once you picture it.",
  },
  thor: {
    partnerId: "sam-wilson",
    reason:
      "Wings and lightning. Aerial reconnaissance plus the God of Thunder. New Cap and the Odinson is a combination that just feels right once you picture it.",
  },
  "the-thing": {
    partnerId: "falcon",
    reason:
      "Unstoppable rocky tank and high-flying scout. Ben Grimm holds the line on the ground; Falcon tells him exactly where to smash from the air. Classic street-level brawler and classic Avenger support.",
  },
  falcon: {
    partnerId: "the-thing",
    reason:
      "Unstoppable rocky tank and high-flying scout. Ben Grimm holds the line on the ground; Falcon tells him exactly where to smash from the air. Classic street-level brawler and classic Avenger support.",
  },
};

/**
 * Behavior → superpower. `status: "specified"` comes straight from the brief.
 * `status: "proxy"` is a v0 stand-in for a row whose trigger was left blank.
 * `status: "workshop"` cannot win until a trigger is locked.
 */
export const SUPERPOWERS = [
  {
    id: "phasing",
    name: "Intangibility",
    ability: "Intangibility or Phasing",
    means: "You’re lurking in the shadows undetected",
    characters: ["ghost", "invisible-woman"],
    status: "specified",
  },
  {
    id: "pym",
    name: "Pym Particles",
    ability: "Pym Particles (Shrinking)",
    means: "You move undetected until it’s time to strike",
    characters: ["ant-man"],
    status: "proxy",
  },
  {
    id: "shapeshift",
    name: "Shapeshifting",
    ability: "Shapeshifting",
    means: "You’re always changing who you are or perceive to be",
    characters: ["mystique"],
    status: "specified",
  },
  {
    id: "shield",
    name: "Vibranium Shield",
    ability: "Vibranium Shield",
    means: "You keep a sturdy guard up",
    characters: ["shuri"],
    status: "proxy",
  },
  {
    id: "optic",
    name: "Optic Blasts",
    ability: "Optic Blasts",
    means: "You’re not afraid to fire at will",
    characters: ["cyclops"],
    status: "specified",
  },
  {
    id: "kinetic",
    name: "Kinetic Energy Charging",
    ability: "Kinetic Energy Charging",
    means: "You add a supercharge to what others are putting out there",
    characters: ["gambit"],
    status: "specified",
  },
  {
    id: "serum",
    name: "Super-Serum",
    ability: "Super-Serum",
    means: "A steady, enhanced presence when nothing else dominates",
    characters: ["steve-rogers", "sam-wilson", "red-guardian"],
    status: "proxy",
  },
  {
    id: "water",
    name: "Water Skills",
    ability: "Water Skills",
    means: "You keep things moving along like the flow of water",
    characters: ["namor", "namora", "attuma"],
    status: "proxy",
  },
  {
    id: "strength",
    name: "Superhuman Strength",
    ability: "Superhuman Strength",
    means: "You’re unafraid to smash that like button",
    characters: ["beast", "mbaku", "the-thing"],
    status: "specified",
  },
  {
    id: "mjolnir",
    name: "Mjolnir",
    ability: "Mjolnir",
    means: "Reach plus a steady public voice",
    characters: ["thor"],
    status: "proxy",
  },
  {
    id: "telepathy",
    name: "Telepathy",
    ability: "Telepathy",
    means: "You’re posting the words that people are already thinking",
    characters: ["professor-x"],
    status: "specified",
  },
  {
    id: "intelligence",
    name: "Super-intelligence",
    ability: "Super-intelligence",
    means: "Workshop trigger still open",
    characters: ["doctor-doom"],
    status: "workshop",
  },
  {
    id: "sorcery",
    name: "Sorcery",
    ability: "Sorcery",
    means: "Workshop trigger still open",
    characters: ["doctor-strange"],
    status: "workshop",
  },
  {
    id: "magnetism",
    name: "Magnetism Manipulation",
    ability: "Magnetism Manipulation",
    means: "You attract others",
    characters: ["magneto"],
    status: "specified",
  },
  {
    id: "elasticity",
    name: "Elasticity",
    ability: "Elasticity",
    means: "You’ve got quite the reach",
    characters: ["mister-fantastic"],
    status: "proxy",
  },
  {
    id: "teleport",
    name: "Teleportation",
    ability: "Teleportation",
    means: "You live under the main conversation",
    characters: ["nightcrawler"],
    status: "specified",
  },
  {
    id: "bite",
    name: "Widow’s Bite",
    ability: "Widow’s Bite",
    means: "You aren’t afraid to clap back",
    characters: ["yelena"],
    status: "proxy",
  },
  {
    id: "martial",
    name: "Martial Arts",
    ability: "Martial Arts",
    means: "You aren’t afraid of a little hand-to-hand combat",
    characters: ["shang-chi"],
    status: "workshop",
  },
  {
    id: "aerial",
    name: "Aerial Combat",
    ability: "Aerial Combat",
    means: "Workshop trigger still open",
    characters: ["falcon"],
    status: "workshop",
  },
  {
    id: "illusions",
    name: "Illusions",
    ability: "Illusions",
    means: "You reframe someone else’s posts",
    characters: ["loki"],
    status: "specified",
  },
  {
    id: "pyro",
    name: "Pyrokinesis",
    ability: "Pyrokinesis",
    means: "You know how to light a fire",
    characters: ["human-torch"],
    status: "proxy",
  },
];

export const SUPERPOWER_BY_ID = Object.fromEntries(
  SUPERPOWERS.map((power) => [power.id, power]),
);

/** Demo curve only. Production replaces this with rank vs. the baseline audience. */
export const PERCENTILE_BANDS = [
  { min: 0.72, label: "Top 5%" },
  { min: 0.48, label: "Top 10%" },
  { min: 0.28, label: "Top 25%" },
  { min: 0.12, label: "Top 50%" },
];

export const AXIS_CAPS = { bio: 3, follows: 4, posts: 12, reposts: 8 };

export function percentileLabel(blended) {
  for (const band of PERCENTILE_BANDS) {
    if (blended >= band.min) return band.label;
  }
  return "Outside Top 50%";
}
