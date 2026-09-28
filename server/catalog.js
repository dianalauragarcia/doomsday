/**
 * Monitored accounts, keywords, superpowers, and alchemies from the
 * Avengers: Doomsday Fan Variance Authority brief.
 *
 * Handles stored without @, lowercase.
 * MCU-wide keywords raise the diehard score and do not assign a fandom
 * by themselves. Studio and cast handles assign a category.
 */

export const WIDE_HANDLES = [];

export const WIDE_KEYWORDS = ["mcu", "marvel cinematic universe"];

export const EXTRA_FRANCHISE_HANDLES = {
  avengers: ["marvel", "marvelstudios", "marvelbr", "marvellatam", "mcu_direct", "marvel_updat3s"],
};

export const CHARACTER_HANDLES = {
  thor: ["chrishemsworth"],
  loki: ["twhiddleston"],
  "steve-rogers": ["chrisevans"],
  "sam-wilson": ["anthonymackie"],
  "ant-man": ["paulrudd"],
  "doctor-strange": ["benedictcumberbatch"],
  "shang-chi": ["simuliu"],
  shuri: ["letitiawright"],
  "winter-soldier": ["sebastianstan"],
  yelena: ["florencepugh"],
  "invisible-woman": ["vanessakirby"],
  "spider-man": ["spiderman", "spidermanmovie", "tomholland1996", "zendaya"],
  "iron-man": ["iron_man", "robertdowneyjr"],
  hulk: ["markruffalo"],
  hawkeye: ["jeremyrenner"],
  "captain-marvel": ["captainmarvel", "brielarson"],
  "ms-marvel": ["msmarvel"],
  "kate-bishop": ["haileesteinfeld"],
  wolverine: ["realhughjackman", "wolverinemovie"],
  deadpool: ["vancityreynolds", "deadpool", "deadpoolmovie"],
  thanos: ["joshbrolin"],
  tchalla: ["chadwickboseman"],
  okoye: ["danaigurira"],
  gamora: ["zoesaldana"],
  nebula: ["karengillan"],
  mantis: ["pomklementieff"],
};

export const NAMED_HANDLES = [];

export const FRANCHISES = [
  {
    id: "fantastic-four",
    name: "Fantastic Four",
    handles: ["fantasticfour"],
    keywords: [
      "fantastic four",
      "fantastic 4",
      "the fantastic four: first steps",
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
      {
        id: "silver-surfer",
        name: "Silver Surfer",
        keywords: ["silver surfer", "shalla-bal", "shalla bal", "norrin radd"],
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
      "ramonda",
      "queen ramonda",
      "everett ross",
      "dora milaje",
      "vibranium",
      "wakanda forever",
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
      {
        id: "tchalla",
        name: "Black Panther (T'Challa)",
        keywords: ["t'challa", "t’challa", "tchalla"],
      },
      { id: "okoye", name: "Okoye", keywords: ["okoye"] },
      { id: "nakia", name: "Nakia", keywords: ["nakia"] },
      {
        id: "killmonger",
        name: "Killmonger",
        keywords: ["killmonger", "erik killmonger", "n'jadaka", "n’jadaka"],
      },
      {
        id: "ironheart",
        name: "Ironheart",
        keywords: ["riri williams", "ironheart"],
      },
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
        keywords: ["doctor strange", "stephen strange", "doctor stephen strange"],
      },
      {
        id: "spider-man",
        name: "Spider-Man",
        keywords: ["peter parker", "spider-man", "spider man", "spiderman", "spider-verse", "spider verse"],
      },
      {
        id: "iron-man",
        name: "Iron Man",
        keywords: ["tony stark", "iron man", "ironman", "i love you 3000"],
      },
      {
        id: "hulk",
        name: "Hulk",
        keywords: ["bruce banner", "the hulk", "hulk smash", "hulk"],
      },
      {
        id: "black-widow",
        name: "Black Widow",
        keywords: ["natasha romanoff", "natasha romanov", "black widow"],
      },
      {
        id: "hawkeye",
        name: "Hawkeye",
        keywords: ["clint barton", "hawkeye"],
      },
      {
        id: "scarlet-witch",
        name: "Scarlet Witch",
        keywords: ["wanda maximoff", "scarlet witch", "chaos magic"],
      },
      {
        id: "captain-marvel",
        name: "Captain Marvel",
        keywords: ["carol danvers", "captain marvel", "higher further faster"],
      },
      {
        id: "ms-marvel",
        name: "Ms. Marvel",
        keywords: ["kamala khan", "ms. marvel", "ms marvel"],
      },
      {
        id: "kate-bishop",
        name: "Hawkeye (Kate Bishop)",
        keywords: ["kate bishop"],
      },
      {
        id: "war-machine",
        name: "War Machine",
        keywords: ["james rhodes", "war machine", "rhodey"],
      },
      {
        id: "vision",
        name: "Vision",
        keywords: ["the vision", "white vision", "wandavision"],
      },
      {
        id: "wasp",
        name: "The Wasp",
        keywords: ["hope van dyne", "the wasp", "hope pym"],
      },
      {
        id: "wong",
        name: "Wong",
        keywords: ["wong", "kamar-taj"],
      },
      {
        id: "valkyrie",
        name: "Valkyrie",
        keywords: ["valkyrie", "king valkyrie", "brunnhilde"],
      },
      { id: "nick-fury", name: "Nick Fury", keywords: ["nick fury"] },
      {
        id: "daredevil",
        name: "Daredevil",
        keywords: ["daredevil", "matt murdock", "devil of hell's kitchen", "devil of hell’s kitchen"],
      },
      {
        id: "she-hulk",
        name: "She-Hulk",
        keywords: ["she-hulk", "she hulk", "jennifer walters"],
      },
      {
        id: "moon-knight",
        name: "Moon Knight",
        keywords: ["moon knight", "marc spector", "jake lockley", "mr. knight"],
      },
      { id: "jessica-jones", name: "Jessica Jones", keywords: ["jessica jones"] },
      { id: "luke-cage", name: "Luke Cage", keywords: ["luke cage"] },
      {
        id: "punisher",
        name: "The Punisher",
        keywords: ["the punisher", "frank castle", "punisher"],
      },
      { id: "echo", name: "Echo", keywords: ["maya lopez"] },
      {
        id: "agatha",
        name: "Agatha Harkness",
        keywords: ["agatha harkness", "agatha all along"],
      },
      { id: "america-chavez", name: "America Chavez", keywords: ["america chavez"] },
    ],
  },
  {
    id: "misc",
    name: "Misc",
    handles: ["lokiofficial", "shangchi"],
    keywords: [],
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
      {
        id: "peggy-carter",
        name: "Peggy Carter",
        keywords: ["peggy carter", "agent carter"],
      },
      {
        id: "cassie-lang",
        name: "Cassie Lang",
        keywords: ["cassie lang", "stature"],
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
      {
        id: "wolverine",
        name: "Wolverine",
        keywords: ["wolverine", "james howlett", "logan", "adamantium"],
      },
      {
        id: "deadpool",
        name: "Deadpool",
        keywords: ["deadpool", "wade wilson", "merc with a mouth"],
      },
      {
        id: "jean-grey",
        name: "Jean Grey",
        keywords: ["jean grey", "dark phoenix", "phoenix force"],
      },
      {
        id: "storm",
        name: "Storm",
        keywords: ["ororo munroe", "ororo", "storm"],
      },
    ],
  },
  {
    id: "villain",
    name: "Villain",
    handles: [],
    keywords: ["sentinels"],
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
      { id: "thanos", name: "Thanos", keywords: ["thanos", "the mad titan"] },
      { id: "ultron", name: "Ultron", keywords: ["ultron"] },
      {
        id: "red-skull",
        name: "Red Skull",
        keywords: ["red skull", "johann schmidt"],
      },
      {
        id: "zemo",
        name: "Baron Zemo",
        keywords: ["baron zemo", "helmut zemo", "zemo"],
      },
      { id: "galactus", name: "Galactus", keywords: ["galactus"] },
    ],
  },
  {
    id: "guardians",
    name: "Guardians of the Galaxy",
    handles: [],
    keywords: ["guardians of the galaxy", "gotg"],
    characters: [
      {
        id: "star-lord",
        name: "Star-Lord",
        keywords: ["star-lord", "star lord", "peter quill"],
      },
      { id: "gamora", name: "Gamora", keywords: ["gamora"] },
      { id: "nebula", name: "Nebula", keywords: ["nebula"] },
      { id: "mantis", name: "Mantis", keywords: ["mantis"] },
      { id: "drax", name: "Drax", keywords: ["drax the destroyer", "drax"] },
      {
        id: "rocket",
        name: "Rocket",
        keywords: ["rocket raccoon", "trash panda"],
      },
      { id: "groot", name: "Groot", keywords: ["i am groot", "groot"] },
      { id: "adam-warlock", name: "Adam Warlock", keywords: ["adam warlock"] },
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

/**
 * Empirical diehard bands from the 15,000 @MarvelStudios opt-in baseline
 * (blended scores recomputed on users.json + follows + tweets; cohort file
 * grok-15k-before-report.jsonl). Rank cutoffs at 750 / 1500 / 3750 / 7500.
 * The score at rank 7500 is 0 (9,521 profiles have no MCU signal), so Top 50%
 * uses the smallest positive blended score (one keyword-post axis unit = 1/48)
 * and Outside Top 50% means blended below that floor.
 */
export const PERCENTILE_BANDS = [
  { min: 0.25, label: "Top 5%" },
  { min: 0.1875, label: "Top 10%" },
  { min: 0.0625, label: "Top 25%" },
  { min: 1 / 48, label: "Top 50%" },
];

export const AXIS_CAPS = { bio: 3, follows: 4, posts: 12, reposts: 8 };

export function percentileLabel(blended) {
  for (const band of PERCENTILE_BANDS) {
    if (blended >= band.min) return band.label;
  }
  return "Outside Top 50%";
}
