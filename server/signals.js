import {
  AXIS_CAPS,
  CHARACTERS,
  FRANCHISES,
  WIDE_HANDLES,
  WIDE_KEYWORDS,
  percentileLabel,
} from "./catalog.js";

const DAY = 24 * 60 * 60 * 1000;

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
    franchises[franchise.id] = { points: 0, terms: new Set() };
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
    return;
  }
  const bucket = scores.characters[hit.characterId];
  bucket.points += points;
  bucket.terms.add(hit.keyword);
}

export function extractSignals(profile, now = Date.now()) {
  const scores = blankScores();
  const bioHits = matchText(profile.description);
  const bioTerms = new Set();
  for (const hit of bioHits) {
    bioTerms.add(hit.keyword);
    addHit(scores, hit, 4);
  }

  const followed = new Set(
    (profile.follows ?? []).map((handle) => normalize(handle).replace(/^@/, "")),
  );
  const followedMonitored = [];
  for (const franchise of FRANCHISES) {
    for (const handle of franchise.handles) {
      if (!followed.has(handle)) continue;
      followedMonitored.push(handle);
      scores.franchises[franchise.id].points += 6;
      scores.franchises[franchise.id].terms.add(`@${handle}`);
    }
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

  for (const post of profile.posts ?? []) {
    const created = new Date(post.createdAt).getTime();
    const inWindow = Number.isFinite(created) && created >= windowStart;
    const kind = post.kind || "original";
    const hits = matchText(post.text);
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
    },
    postsRead: (profile.posts ?? []).length,
    followsRead: (profile.follows ?? []).length,
  };
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
      bestFranchise = { franchise, points: bucket.points, terms: [...bucket.terms] };
    }
  }
  if (!bestFranchise) return null;
  const lead = bestFranchise.franchise.characters[0];
  return {
    id: lead.id,
    name: lead.name,
    franchiseId: bestFranchise.franchise.id,
    franchiseName: bestFranchise.franchise.name,
    points: bestFranchise.points,
    evidence: bestFranchise.terms.slice(0, 4),
    viaFranchise: true,
  };
}
