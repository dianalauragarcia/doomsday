import {
  AXIS_CAPS,
  CHARACTER_HANDLES,
  CHARACTERS,
  EXTRA_FRANCHISE_HANDLES,
  FRANCHISES,
  NAMED_HANDLES,
  WIDE_HANDLES,
  WIDE_KEYWORDS,
  percentileLabel,
} from "./catalog.js";

const DAY = 24 * 60 * 60 * 1000;
const SPECIFIC_NAME = {
  ghost: ["ava starr"],
  beast: ["hank mccoy"],
  sentry: ["bob reynolds", "the void"],
  storm: ["ororo munroe", "ororo", "x-men", "xmen"],
  logan: ["wolverine", "adamantium", "james howlett"],
  wong: ["kamar-taj", "doctor strange", "stephen strange"],
  nebula: ["gamora", "guardians of the galaxy", "gotg", "star-lord", "star lord", "peter quill"],
  mantis: ["guardians of the galaxy", "gotg", "drax", "gamora"],
};

function specificNamePresent(keyword, bioHits, postHits) {
  const names = SPECIFIC_NAME[keyword];
  if (!names) return true;
  const hits = bioHits.concat(...postHits);
  return hits.some((hit) => names.includes(hit.keyword));
}

export function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function boundaryPattern(keyword) {
  const escaped = normalize(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i");
}

const INDEX = buildIndex();

function buildIndex() {
  const entries = [];
  const push = (keyword, target) => {
    const normalized = normalize(keyword);
    if (!normalized) return;
    entries.push({ keyword: normalized, ...target, pattern: boundaryPattern(normalized) });
  };

  for (const keyword of WIDE_KEYWORDS) push(keyword, { scope: "wide" });
  for (const franchise of FRANCHISES) {
    for (const keyword of franchise.keywords) {
      push(keyword, { scope: "franchise", franchiseId: franchise.id });
    }
    for (const character of franchise.characters) {
      for (const keyword of character.keywords) {
        push(keyword, {
          scope: "character",
          franchiseId: franchise.id,
          characterId: character.id,
        });
      }
    }
  }

  entries.sort((a, b) => b.keyword.length - a.keyword.length);
  return entries;
}

function matchText(text) {
  let working = ` ${normalize(text)} `;
  const hits = [];
  for (const entry of INDEX) {
    if (!entry.pattern.test(working)) continue;
    hits.push(entry);
    working = working.replace(new RegExp(entry.pattern.source, "gi"), " ");
  }
  return hits;
}

function blankScores() {
  const franchises = {};
  const characters = {};
  for (const franchise of FRANCHISES) {
    franchises[franchise.id] = { points: 0, terms: new Set(), termCounts: {} };
    for (const character of franchise.characters) {
      characters[character.id] = { points: 0, terms: new Set() };
    }
  }
  return { franchises, characters, wideTerms: new Set() };
}

function addHit(scores, hit, points) {
  if (hit.scope === "wide") {
    scores.wideTerms.add(hit.keyword);
    return;
  }
  if (hit.scope === "franchise") {
    const bucket = scores.franchises[hit.franchiseId];
    bucket.points += points;
    bucket.terms.add(hit.keyword);
    bucket.termCounts[hit.keyword] = (bucket.termCounts[hit.keyword] || 0) + 1;
    return;
  }
  const bucket = scores.characters[hit.characterId];
  bucket.points += points;
  bucket.terms.add(hit.keyword);
}

// Fandom spread: franchise points (franchise keywords and handles, plus each franchise's characters)
// and how evenly they are split. A chameleon has points in 3+ franchises and no franchise on top.
export function fandomSpread(scores) {
  const perFranchise = {};
  for (const franchise of FRANCHISES) perFranchise[franchise.id] = scores.franchises[franchise.id].points;
  for (const [characterId, bucket] of Object.entries(scores.characters)) {
    perFranchise[CHARACTERS[characterId].franchiseId] += bucket.points;
  }
  const values = Object.values(perFranchise).filter((points) => points > 0);
  const total = values.reduce((sum, points) => sum + points, 0);
  const top = values.reduce((max, points) => Math.max(max, points), 0);
  return { franchises: values.length, topShare: total > 0 ? top / total : 1, total };
}

export function extractSignals(profile, now = Date.now()) {
  const scores = blankScores();
  const bioHits = matchText(profile.description);
  const postHits = (profile.posts ?? []).map((post) => matchText(post.text));
  const followed = new Set(
    (profile.follows ?? []).map((handle) => normalize(handle).replace(/^@/, "")),
  );
  const followedMonitored = [];
  for (const franchise of FRANCHISES) {
    const handles = franchise.handles.concat(EXTRA_FRANCHISE_HANDLES[franchise.id] ?? []);
    for (const handle of handles) {
      if (!followed.has(handle)) continue;
      followedMonitored.push(handle);
    }
  }
  const keep = (hit) =>
    hit.scope !== "character" || specificNamePresent(hit.keyword, bioHits, postHits);

  const bioTerms = new Set();
  for (const hit of bioHits.filter(keep)) {
    bioTerms.add(hit.keyword);
    addHit(scores, hit, 4);
  }

  for (const handle of followedMonitored) {
    const franchise = FRANCHISES.find((item) =>
      item.handles.concat(EXTRA_FRANCHISE_HANDLES[item.id] ?? []).includes(handle),
    );
    if (!franchise) continue;
    scores.franchises[franchise.id].points += 6;
    scores.franchises[franchise.id].terms.add(`@${handle}`);
  }
  for (const [characterId, handles] of Object.entries(CHARACTER_HANDLES)) {
    for (const handle of handles) {
      if (!followed.has(handle)) continue;
      if (!followedMonitored.includes(handle)) followedMonitored.push(handle);
      const bucket = scores.characters[characterId];
      bucket.points += 6;
      bucket.terms.add(`@${handle}`);
    }
  }
  for (const named of NAMED_HANDLES) {
    if (!followed.has(named.handle)) continue;
    if (!followedMonitored.includes(named.handle)) followedMonitored.push(named.handle);
    const bucket = scores.franchises[named.franchiseId];
    bucket.points += 7;
    bucket.terms.add(`@${named.handle}`);
    bucket.termCounts[named.keyword] = (bucket.termCounts[named.keyword] || 0) + 1;
  }
  const wideFollows = WIDE_HANDLES.filter((handle) => followed.has(handle));

  let postKeywordPosts = 0;
  let mcuReposts = 0;
  const windowStart = now - 28 * DAY;
  const behavior = {
    originals28d: 0,
    replies28d: 0,
    quotes28d: 0,
    reposts28d: 0,
    likesReceived: 0,
    originalsWithMetrics: 0,
    repostsReceived: 0,
  };

  for (const [postIndex, post] of (profile.posts ?? []).entries()) {
    const created = new Date(post.createdAt).getTime();
    const inWindow = Number.isFinite(created) && created >= windowStart;
    const kind = post.kind || "original";
    const hits = postHits[postIndex].filter(keep);
    const franchiseOrCharacter = hits.some(
      (hit) => hit.scope === "franchise" || hit.scope === "character",
    );

    if (kind === "repost") {
      if (franchiseOrCharacter || hits.length > 0) {
        mcuReposts += 1;
        for (const hit of hits) addHit(scores, hit, 3);
      }
      if (inWindow) behavior.reposts28d += 1;
      continue;
    }

    if (franchiseOrCharacter) {
      postKeywordPosts += 1;
      for (const hit of hits) addHit(scores, hit, 2);
    } else if (hits.length > 0) {
      for (const hit of hits) addHit(scores, hit, 0);
    }

    if (!inWindow) continue;
    if (kind === "reply") behavior.replies28d += 1;
    else if (kind === "quote") behavior.quotes28d += 1;
    else {
      behavior.originals28d += 1;
      behavior.originalsWithMetrics += 1;
      behavior.likesReceived += Number(post.likeCount ?? 0);
      behavior.repostsReceived += Number(post.repostCount ?? 0);
    }
  }

  const recentActivity = behavior.originals28d + behavior.replies28d + behavior.quotes28d + behavior.reposts28d;
  if (recentActivity === 0 && (profile.posts ?? []).length > 0) {
    behavior.originals28d = 0;
    behavior.replies28d = 0;
    behavior.quotes28d = 0;
    behavior.reposts28d = 0;
    behavior.likesReceived = 0;
    behavior.originalsWithMetrics = 0;
    behavior.repostsReceived = 0;
    for (const post of profile.posts ?? []) {
      const kind = post.kind || "original";
      if (kind === "repost") {
        behavior.reposts28d += 1;
        continue;
      }
      if (kind === "reply") behavior.replies28d += 1;
      else if (kind === "quote") behavior.quotes28d += 1;
      else {
        behavior.originals28d += 1;
        behavior.originalsWithMetrics += 1;
        behavior.likesReceived += Number(post.likeCount ?? 0);
        behavior.repostsReceived += Number(post.repostCount ?? 0);
      }
    }
  }

  const posts28d = behavior.originals28d + behavior.replies28d + behavior.quotes28d;
  const avgLikes =
    behavior.originalsWithMetrics > 0
      ? behavior.likesReceived / behavior.originalsWithMetrics
      : 0;
  const avgRepostsReceived =
    behavior.originalsWithMetrics > 0
      ? behavior.repostsReceived / behavior.originalsWithMetrics
      : 0;

  const followers = profile.publicMetrics?.followers ?? 0;
  const following = profile.publicMetrics?.following ?? 0;
  const ratio = following > 0 ? followers / following : null;

  const axesRaw = {
    bio: bioTerms.size,
    follows: followedMonitored.length + wideFollows.length,
    posts: postKeywordPosts,
    reposts: mcuReposts,
  };
  const axes = {
    bio: Math.min(1, axesRaw.bio / AXIS_CAPS.bio),
    follows: Math.min(1, axesRaw.follows / AXIS_CAPS.follows),
    posts: Math.min(1, axesRaw.posts / AXIS_CAPS.posts),
    reposts: Math.min(1, axesRaw.reposts / AXIS_CAPS.reposts),
  };
  const blended = (axes.bio + axes.follows + axes.posts + axes.reposts) / 4;

  return {
    scores,
    bioTerms: [...bioTerms],
    followedMonitored,
    wideFollows,
    axesRaw,
    axes,
    blended,
    percentile: percentileLabel(blended),
    behavior: {
      ...behavior,
      posts28d,
      avgLikes,
      avgRepostsReceived,
      followers,
      following,
      ratio,
      likesGiven: profile.likesGiven ?? null,
      profileUpdatedWeekOverWeek: profile.profileUpdatedWeekOverWeek ?? null,
      fandomSpread: fandomSpread(scores),
    },
    postsRead: (profile.posts ?? []).length,
    followsRead: (profile.follows ?? []).length,
    aboveFloor:
      axesRaw.bio > 0 ||
      axesRaw.posts > 0 ||
      axesRaw.reposts > 0 ||
      followedMonitored.length > 0,
  };
}

export function rankCohort(rows) {
  const total = rows.length;
  const cuts = [
    { label: "Top 5%", limit: Math.round(total * 0.05) },
    { label: "Top 10%", limit: Math.round(total * 0.1) },
    { label: "Top 25%", limit: Math.round(total * 0.25) },
    { label: "Top 50%", limit: Math.round(total * 0.5) },
  ];
  const order = rows
    .map((row, index) => ({ index, row }))
    .sort(
      (a, b) =>
        b.row.blended - a.row.blended ||
        (b.row.posts28d || 0) - (a.row.posts28d || 0) ||
        (b.row.postsRead || 0) - (a.row.postsRead || 0) ||
        a.index - b.index,
    );
  const labels = rows.map(() => "Outside Top 50%");
  order.forEach((item, rank) => {
    const band = cuts.find((cut) => rank < cut.limit);
    if (band) labels[item.index] = band.label;
  });
  return labels;
}

const NAMED_FRANCHISE_TERMS = [
  ["spider-man", "Spider-Man"],
  ["spider man", "Spider-Man"],
  ["spiderman", "Spider-Man"],
  ["iron man", "Iron Man"],
  ["hulk", "Hulk"],
  ["wolverine", "Wolverine"],
  ["deadpool", "Deadpool"],
  ["thanos", "Thanos"],
];

function namedFranchiseLabel(termCounts = {}) {
  const totals = new Map();
  for (const [keyword, label] of NAMED_FRANCHISE_TERMS) {
    const count = termCounts[keyword] || 0;
    if (count <= 0) continue;
    totals.set(label, (totals.get(label) || 0) + count);
  }
  let best = null;
  for (const [label, count] of totals) {
    if (!best || count > best.count) best = { label, count };
  }
  return best?.label ?? null;
}

export function pickFandom(scores) {
  let bestCharacter = null;
  for (const [characterId, bucket] of Object.entries(scores.characters)) {
    if (bucket.points <= 0) continue;
    if (!bestCharacter || bucket.points > bestCharacter.points) {
      bestCharacter = { characterId, points: bucket.points, terms: [...bucket.terms] };
    }
  }
  if (bestCharacter) {
    const character = CHARACTERS[bestCharacter.characterId];
    return {
      id: character.id,
      name: character.name,
      franchiseId: character.franchiseId,
      franchiseName: character.franchiseName,
      points: bestCharacter.points,
      evidence: bestCharacter.terms.slice(0, 4),
    };
  }

  let bestFranchise = null;
  for (const franchise of FRANCHISES) {
    const bucket = scores.franchises[franchise.id];
    if (bucket.points <= 0) continue;
    if (!bestFranchise || bucket.points > bestFranchise.points) {
      bestFranchise = {
        franchise,
        points: bucket.points,
        terms: [...bucket.terms],
        termCounts: bucket.termCounts,
      };
    }
  }
  if (!bestFranchise) return null;
  const named = namedFranchiseLabel(bestFranchise.termCounts);
  if (named) {
    return {
      id: null,
      name: named,
      franchiseId: bestFranchise.franchise.id,
      franchiseName: bestFranchise.franchise.name,
      points: bestFranchise.points,
      evidence: bestFranchise.terms.slice(0, 4),
      viaFranchise: false,
    };
  }
  return {
    id: null,
    name: bestFranchise.franchise.name,
    franchiseId: bestFranchise.franchise.id,
    franchiseName: bestFranchise.franchise.name,
    points: bestFranchise.points,
    evidence: bestFranchise.terms.slice(0, 4),
    viaFranchise: true,
  };
}
