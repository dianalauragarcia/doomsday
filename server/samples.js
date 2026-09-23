function ago(days, index = 0) {
  return new Date(Date.now() - days * 86400000 - index * 3600000).toISOString();
}

function posts(specs) {
  return specs.flatMap((spec) =>
    Array.from({ length: spec.n }, (_, index) => ({
      text: spec.text,
      kind: spec.kind || "original",
      createdAt: ago(spec.daysAgo, index),
      likeCount: spec.likeCount ?? 1,
      repostCount: spec.repostCount ?? 0,
    })),
  );
}

export const SAMPLES = [
  {
    id: "thor",
    label: "Thor · posts a lot",
    blurb: "Heavy Avengers posting and a few MCU reposts.",
    expect: { fandom: "Thor", power: "Optic Blasts", alchemy: "Attuma", percentile: "Top 5%" },
    profile: {
      username: "godofthunder",
      name: "Odinson Hours",
      description: "God of Thunder. Earth's Mightiest Heroes.",
      publicMetrics: { followers: 900, following: 400, tweets: 2400 },
      follows: ["thorofficial", "Avengers", "CaptainAmerica"],
      likesGiven: 4,
      profileUpdatedWeekOverWeek: false,
      posts: posts([
        { n: 22, daysAgo: 3, text: "Thor bringing the God of Thunder energy. Avengers forever." },
        { n: 8, daysAgo: 2, kind: "repost", text: "RT @thorofficial: Thor. Avengers: Doomsday." },
      ]),
    },
  },
  {
    id: "sue",
    label: "Invisible Woman · lurking",
    blurb: "Bio and older posts, nothing in the last 28 days.",
    expect: {
      fandom: "The Invisible Woman",
      power: "Intangibility",
      alchemy: "Winter Soldier",
      percentile: "Top 25%",
    },
    profile: {
      username: "suekeeper",
      name: "Sue Keeper",
      description: "Sue Storm. The Invisible Woman. Baxter Building regular.",
      publicMetrics: { followers: 120, following: 80, tweets: 40 },
      follows: ["FantasticFour"],
      likesGiven: 0,
      profileUpdatedWeekOverWeek: false,
      posts: posts([
        { n: 6, daysAgo: 45, text: "Sue Storm and the Invisible Woman do not miss." },
      ]),
    },
  },
  {
    id: "loki",
    label: "Loki · quote posts",
    blurb: "Reframes other posts more than he posts his own.",
    expect: { fandom: "Loki", power: "Illusions", alchemy: "Gambit", percentile: "Top 25%" },
    profile: {
      username: "mischiefquotes",
      name: "Quote of Mischief",
      description: "God of Mischief.",
      publicMetrics: { followers: 300, following: 220, tweets: 800 },
      follows: ["LokiOfficial"],
      likesGiven: 2,
      profileUpdatedWeekOverWeek: false,
      posts: posts([
        { n: 2, daysAgo: 4, text: "Loki remains the God of Mischief." },
        { n: 8, daysAgo: 3, kind: "quote", text: "Loki would have phrased the timeline better." },
      ]),
    },
  },
  {
    id: "nightcrawler",
    label: "Nightcrawler · replies",
    blurb: "Lives in the replies under everyone else's posts.",
    expect: {
      fandom: "Nightcrawler",
      power: "Teleportation",
      alchemy: "Ant-Man",
      percentile: "Top 25%",
    },
    profile: {
      username: "bamfunder",
      name: "Bamf Under",
      description: "Nightcrawler. To me my X-Men.",
      publicMetrics: { followers: 210, following: 190, tweets: 1500 },
      follows: ["xmenmovies"],
      likesGiven: 3,
      profileUpdatedWeekOverWeek: false,
      posts: posts([
        { n: 2, daysAgo: 6, text: "Kurt Wagner. Nightcrawler. To me my X-Men." },
        { n: 12, daysAgo: 2, kind: "reply", text: "Nightcrawler would already be in this thread." },
      ]),
    },
  },
  {
    id: "gambit",
    label: "Gambit · reposts",
    blurb: "Charges up other people's MCU posts.",
    expect: {
      fandom: "Gambit",
      power: "Kinetic Energy Charging",
      alchemy: "Loki",
      percentile: "Top 10%",
    },
    profile: {
      username: "kineticfan",
      name: "Kinetic Fan",
      description: "Gambit. Remy LeBeau.",
      publicMetrics: { followers: 640, following: 500, tweets: 3200 },
      follows: ["xmenmovies"],
      likesGiven: 6,
      profileUpdatedWeekOverWeek: false,
      posts: posts([
        { n: 3, daysAgo: 5, text: "Gambit and the X-Men." },
        { n: 12, daysAgo: 2, kind: "repost", text: "RT @xmenmovies: Gambit. To me my X-Men." },
      ]),
    },
  },
  {
    id: "magneto",
    label: "Magneto · draws a crowd",
    blurb: "Followers outnumber following by more than 10 to 1.",
    expect: {
      fandom: "Magneto",
      power: "Magnetism Manipulation",
      alchemy: "Black Panther (Shuri)",
      percentile: "Top 25%",
    },
    profile: {
      username: "masterofmagnet",
      name: "Master of Magnet",
      description: "Magneto. Erik Lehnsherr.",
      publicMetrics: { followers: 5000, following: 200, tweets: 900 },
      follows: ["xmenmovies"],
      likesGiven: 1,
      profileUpdatedWeekOverWeek: false,
      posts: posts([{ n: 5, daysAgo: 4, text: "Magneto. Brotherhood of Mutants." }]),
    },
  },
  {
    id: "doom",
    label: "Doctor Doom · guarded posts",
    blurb: "Posts in public and stays out of the replies.",
    expect: {
      fandom: "Doctor Doom",
      power: "Vibranium Shield",
      alchemy: "Magneto",
      percentile: "Top 25%",
    },
    profile: {
      username: "latveria",
      name: "Latveria",
      description: "I am Doom. Latveria.",
      publicMetrics: { followers: 420, following: 300, tweets: 700 },
      follows: ["MarvelStudios"],
      likesGiven: 1,
      profileUpdatedWeekOverWeek: false,
      posts: posts([
        { n: 8, daysAgo: 3, text: "Doctor Doom. Victor Von Doom. Doombots on patrol." },
      ]),
    },
  },
];

export function getSample(id) {
  return SAMPLES.find((sample) => sample.id === id) ?? null;
}

export function sampleProfile(id) {
  const sample = getSample(id);
  if (!sample) return null;
  return { ...sample.profile, source: "sample", followsUnavailable: false };
}
