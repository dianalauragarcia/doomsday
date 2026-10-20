import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CHARACTERS, SUPERPOWER_BY_ID } from "./catalog.js";
import { classifyFandom } from "./grokFandom.js";
import { extractSignals, pickFandom } from "./signals.js";

const PROMPT_FILE = "Avengers_Doomsday_Fanalyzer_system_prompt_v0.txt";

function readPrompt() {
  const candidates = [
    join(dirname(fileURLToPath(import.meta.url)), "..", PROMPT_FILE),
    join(process.cwd(), PROMPT_FILE),
  ];
  for (const path of candidates) {
    try {
      return readFileSync(path, "utf8");
    } catch {
      // try the next location (local repo root, or the Vercel function bundle)
    }
  }
  throw new Error(`Missing ${PROMPT_FILE}`);
}

const SYSTEM_PROMPT = readPrompt();

// public_metrics.like_count is a lifetime total. 5,000+ is the top ~10% of the 15k opt-in cohort.
const LIKES_STRENGTH_MIN = 5000;

function scoreSuperpower(behavior) {
  const {
    posts28d,
    originals28d,
    replies28d,
    quotes28d,
    reposts28d,
    avgLikes,
    avgRepostsReceived,
    followers,
    following,
    ratio,
    likesGiven,
    profileUpdatedWeekOverWeek,
  } = behavior;

  // First matching clear trigger wins (order matches the judge POWER TABLE).
  if (posts28d === 0 && reposts28d === 0) {
    return { id: "phasing", points: 100, because: "No posts or reposts in the last 28 days" };
  }
  if (posts28d >= 1 && posts28d <= 3 && reposts28d < 3 && quotes28d < 2) {
    return { id: "pym", points: 26, because: "Only a few posts, then silence" };
  }
  if (profileUpdatedWeekOverWeek === true) {
    return { id: "shapeshift", points: 85, because: "Profile changed week over week" };
  }
  if (originals28d >= 12) {
    return { id: "optic", points: 50 + originals28d, because: `${originals28d} original posts in the read timeline` };
  }
  if (reposts28d >= 8) {
    return { id: "kinetic", points: 45 + reposts28d, because: `${reposts28d} reposts in 28 days` };
  }
  if (likesGiven != null && likesGiven >= LIKES_STRENGTH_MIN) {
    return {
      id: "strength",
      points: 40 + Math.min(Math.floor(likesGiven / 1000), 40),
      because: `${likesGiven.toLocaleString("en-US")} total likes given (public like count)`,
    };
  }
  if (avgRepostsReceived >= 8) {
    return { id: "telepathy", points: 60, because: "Original posts are heavily reposted" };
  }
  if (following > 0 && ratio >= 10) {
    return { id: "magnetism", points: 80, because: "Followers are at least 10× following" };
  }
  if (replies28d >= 6 && replies28d > originals28d * 1.5) {
    return { id: "teleport", points: 60 + replies28d, because: "Replies far outnumber original posts" };
  }
  if (quotes28d >= 2 && quotes28d > originals28d) {
    return { id: "illusions", points: 65 + quotes28d, because: "Quote posts outnumber original posts" };
  }

  // Dash-trigger rows: keep existing thresholds only; no new numeric bands.
  if (
    replies28d >= 4 &&
    replies28d > originals28d &&
    replies28d <= originals28d * 1.5
  ) {
    return { id: "bite", points: 55 + replies28d, because: "Replies lead, without disappearing under the post" };
  }
  if (posts28d > 3 && replies28d <= 1 && originals28d >= 2 && originals28d < 20) {
    return { id: "shield", points: 36, because: "Posts in public while staying out of reply threads" };
  }
  if (followers >= 2500 && (ratio == null || ratio < 10)) {
    return { id: "elasticity", points: 42, because: "A wide follower reach" };
  }
  if (followers >= 1000 && originals28d >= 8 && originals28d < 20) {
    return { id: "mjolnir", points: 34, because: "A visible audience and a steady run of posts" };
  }
  if (avgLikes >= 25) {
    return { id: "pyro", points: 38, because: "Original posts draw a flare of likes" };
  }
  if (originals28d >= 4 && originals28d < 20 && replies28d <= originals28d) {
    return { id: "water", points: 28, because: "A steady cadence of original posts" };
  }
  return { id: "serum", points: 15, because: "No single behavior dominates" };
}

function pickPowerCharacter(power, fandom, profile) {
  if (power.id === "phasing") {
    return fandom?.id === "ghost" ? "ghost" : "invisible-woman";
  }
  if (power.id === "strength") {
    if (fandom && power.characters.includes(fandom.id)) return fandom.id;
    const text = `${profile?.description ?? ""} ${(profile?.posts ?? []).map((p) => p.text).join(" ")}`.toLowerCase();
    if (/\b(book|books|read|reading|scientist|lab|library|scholar|phd|study|studying)\b/.test(text)) {
      return "beast";
    }
    if (/\b(warrior|fight|fighting|loud|roar|jabari|war)\b/.test(text)) {
      return "mbaku";
    }
    return "the-thing";
  }
  if (fandom && power.characters.includes(fandom.id)) return fandom.id;
  if (fandom) {
    const sameFranchise = power.characters.find(
      (id) => CHARACTERS[id].franchiseId === fandom.franchiseId,
    );
    if (sameFranchise) return sameFranchise;
  }
  return power.characters[0];
}

function templateCopy(username) {
  const copy = `@${username} The Authority read your timeline. Swipe the carousel for your percentile, top fandom, and X superpower.`;
  return copy.length <= 280 ? copy : copy.slice(0, 277) + "...";
}

async function grokCopy(payload, fallback) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { text: fallback, source: "template" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.XAI_MODEL || "grok-4-1-fast-non-reasoning",
        temperature: 0.5,
        max_tokens: 200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(payload) },
        ],
      }),
    });
    if (!response.ok) return { text: fallback, source: "template" };
    const body = await response.json();
    const raw = body.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
    const text = String(parsed.post_copy ?? "");
    const mention = `@${payload.username}`;
    const valid =
      text.startsWith(mention) &&
      text.length <= 280 &&
      !text.slice(mention.length).includes("@");
    return valid ? { text, source: "grok" } : { text: fallback, source: "template" };
  } catch {
    return { text: fallback, source: "template" };
  } finally {
    clearTimeout(timer);
  }
}

export function assignCategories(profile) {
  const signals = extractSignals(profile);
  const fandom = pickFandom(signals.scores);
  const picked = scoreSuperpower(signals.behavior);
  if (!picked) return { signals, fandom, picked: null, power: null, character: null };
  const power = SUPERPOWER_BY_ID[picked.id];
  const characterId = pickPowerCharacter(power, fandom, profile);
  const character = CHARACTERS[characterId];
  return { signals, fandom, picked, power, character, profile };
}

function withFandom(assigned, fandom) {
  if (!fandom || !assigned.picked) return { ...assigned, fandom };
  const characterId = pickPowerCharacter(assigned.power, fandom, assigned.profile);
  const character = CHARACTERS[characterId];
  return { ...assigned, fandom, character };
}

export function withJudgedFandom(assigned, judged) {
  if (!judged?.viaGrok && judged?.grokStatus !== "default") return assigned;
  return withFandom(assigned, judged.fandom);
}

export async function analyzeProfile(profile) {
  let { signals, fandom, picked, power, character } = assignCategories(profile);
  const judged = await classifyFandom(profile, fandom);
  if (judged.viaGrok || judged.grokStatus === "default") {
    ({ fandom, character } = withFandom(
      { picked, power, character, profile },
      judged.fandom,
    ));
  }

  const fandomName = fandom?.name ?? null;
  const copy = templateCopy(profile.username);
  const flavor = await grokCopy(
    {
      username: profile.username,
      percentile: signals.percentile,
      fandom: fandomName,
      superpower: power?.ability ?? power?.name ?? null,
      evidence: {
        fandomTerms: fandom?.evidence ?? [],
        superpowerBecause: picked?.because ?? null,
      },
    },
    copy,
  );

  return {
    handle: profile.username,
    displayName: profile.name || profile.username,
    profileImageUrl: profile.profileImageUrl ?? null,
    percentile: signals.percentile,
    percentileNote:
      "Ranked against the 15,000 @MarvelStudios opt-in baseline (blended ≥ 0.25 / 0.1875 / 0.0625 / 1⁄48).",
    blended: Number(signals.blended.toFixed(3)),
    axes: {
      bio: signals.axesRaw.bio,
      follows: signals.axesRaw.follows,
      postKeywords: signals.axesRaw.posts,
      mcuReposts: signals.axesRaw.reposts,
    },
    axisScores: signals.axes,
    fandom: fandom
      ? {
          name: fandom.name,
          franchise: fandom.franchiseName,
          evidence: fandom.evidence,
          viaFranchise: Boolean(fandom.viaFranchise),
          viaGrok: Boolean(fandom.viaGrok),
        }
      : null,
    superpower: power
      ? {
          name: power.name,
          ability: power.ability,
          means: power.means,
          character: character.name,
          because: picked.because,
          status: power.status,
        }
      : null,
    postCopy: flavor.text,
    copySource: flavor.source,
    shareText: flavor.text,
    slides: [
      {
        id: "diehard",
        label: "Diehard",
        title: signals.percentile,
        body: "Ranked against the 15,000-follower opt-in baseline from bio keywords, follows, post keywords, and MCU reposts.",
      },
      {
        id: "fandom",
        label: "Top fandom",
        title: fandomName ?? "Unranked",
        body: fandom
          ? `${fandom.franchiseName}${fandom.viaGrok ? ", from the rest of the profile" : ""}${fandom.evidence?.length ? ". " + fandom.evidence.join(", ") : ""}`
          : "Not enough MCU signal yet.",
      },
      {
        id: "superpower",
        label: "X superpower",
        title: power?.ability ?? power?.name ?? "Unscored",
        body: power
          ? `${power.means}. ${picked.because}.`
          : "Not enough behavior signal for a superpower.",
      },
    ],
    postsRead: signals.postsRead,
    followsRead: signals.followsRead,
    followsUnavailable: Boolean(profile.followsUnavailable),
    likesUnavailable: profile.likesGiven == null,
    profileHistoryUnavailable: profile.profileUpdatedWeekOverWeek == null,
    source: profile.source || "live",
    media: {
      mode: "carousel",
      note: "One reply. Three composed slides, one category each. Shotstack in production. No image is generated.",
    },
  };
}
