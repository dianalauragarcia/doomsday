import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALCHEMY, CHARACTERS, SUPERPOWER_BY_ID } from "./catalog.js";
import { extractSignals, pickFandom } from "./signals.js";

const SYSTEM_PROMPT = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "Avengers_Doomsday_Fanalyzer_system_prompt_v0.txt"),
  "utf8",
);

function scoreSuperpower(behavior) {
  const scored = [];
  const add = (id, points, because) => {
    if (points > 0) scored.push({ id, points, because });
  };

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

  if (posts28d === 0 && reposts28d === 0) {
    add("phasing", 100, "No posts and no reposts in the last 28 days");
  }
  if (posts28d >= 1 && posts28d <= 3 && reposts28d < 3 && quotes28d < 2) {
    add("pym", 70, "Only a few posts in 28 days, then silence");
  }
  if (profileUpdatedWeekOverWeek === true) {
    add("shapeshift", 85, "Profile changed week over week");
  }
  if (following > 0 && ratio >= 10) {
    add("magnetism", 80, "Followers are at least 10× following");
  }
  if (followers >= 2500 && (ratio == null || ratio < 10)) {
    add("elasticity", 42, "A wide follower reach");
  }
  if (originals28d >= 20) {
    add("optic", 50 + originals28d, `${originals28d} original posts in 28 days`);
  }
  if (reposts28d >= 8) {
    add("kinetic", 45 + reposts28d, `${reposts28d} reposts in 28 days`);
  }
  if (likesGiven != null && likesGiven >= 25) {
    add("strength", 40 + Math.min(likesGiven, 40), `${likesGiven} likes given in the recent sample`);
  }
  if (avgRepostsReceived >= 8) {
    add("telepathy", 60, "Original posts are heavily reposted");
  }
  if (replies28d >= 6 && replies28d > originals28d * 1.5) {
    add("teleport", 60 + replies28d, "Replies far outnumber original posts");
  }
  if (
    replies28d >= 6 &&
    replies28d > originals28d &&
    replies28d <= originals28d * 1.5
  ) {
    add("bite", 55 + replies28d, "Replies lead, without disappearing under the post");
  }
  if (quotes28d >= 4 && quotes28d > originals28d) {
    add("illusions", 65 + quotes28d, "Quote posts outnumber original posts");
  }
  if (posts28d > 3 && replies28d <= 1 && originals28d >= 2 && originals28d < 20) {
    add("shield", 36, "Posts in public while staying out of reply threads");
  }
  if (followers >= 1000 && originals28d >= 8 && originals28d < 20) {
    add("mjolnir", 34, "A visible audience and a steady run of posts");
  }
  if (originals28d >= 4 && originals28d < 20 && replies28d <= originals28d) {
    add("water", 28, "A steady cadence of original posts");
  }
  if (avgLikes >= 25) {
    add("pyro", 38, "Original posts draw a flare of likes");
  }
  add("serum", 15, "No single behavior dominates");

  scored.sort((a, b) => b.points - a.points);
  return scored[0];
}

function pickPowerCharacter(power, fandom) {
  if (fandom && power.characters.includes(fandom.id)) return fandom.id;
  if (fandom) {
    const sameFranchise = power.characters.find(
      (id) => CHARACTERS[id].franchiseId === fandom.franchiseId,
    );
    if (sameFranchise) return sameFranchise;
  }
  return power.characters[0];
}

function templateCopy(username, percentile, fandomName, powerName, alchemyName) {
  const fandomLine = fandomName
    ? `Top fandom: ${fandomName}.`
    : "Not enough MCU signal for a fandom yet.";
  const band =
    percentile === "Outside Top 50%"
      ? "outside the top half of MCU fans"
      : `in the ${percentile} of MCU fans`;
  const copy = `@${username} Your X timeline puts you ${band}. ${fandomLine} X superpower: ${powerName}. Alchemy: ${alchemyName}.`;
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

export async function analyzeProfile(profile) {
  const signals = extractSignals(profile);
  const fandom = pickFandom(signals.scores);
  const picked = scoreSuperpower(signals.behavior);
  const power = SUPERPOWER_BY_ID[picked.id];
  const characterId = pickPowerCharacter(power, fandom);
  const character = CHARACTERS[characterId];
  const alchemy = ALCHEMY[characterId];
  const partner = CHARACTERS[alchemy.partnerId];

  const fandomName = fandom?.name ?? null;
  const copy = templateCopy(
    profile.username,
    signals.percentile,
    fandomName,
    power.name,
    partner.name,
  );
  const flavor = await grokCopy(
    {
      username: profile.username,
      percentile: signals.percentile,
      fandom: fandomName,
      superpower: power.name,
      alchemy: partner.name,
      evidence: {
        fandomTerms: fandom?.evidence ?? [],
        superpowerBecause: picked.because,
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
      "Demo curve. Production ranks this blended score against the baseline audience.",
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
        }
      : null,
    superpower: {
      name: power.name,
      ability: power.ability,
      means: power.means,
      character: character.name,
      because: picked.because,
      status: power.status,
    },
    alchemy: {
      name: partner.name,
      reason: alchemy.reason,
    },
    postCopy: flavor.text,
    copySource: flavor.source,
    shareText: flavor.text,
    postsRead: signals.postsRead,
    followsRead: signals.followsRead,
    followsUnavailable: Boolean(profile.followsUnavailable),
    likesUnavailable: profile.likesGiven == null,
    profileHistoryUnavailable: profile.profileUpdatedWeekOverWeek == null,
    source: profile.source || "live",
    media: {
      mode: "composition",
      note: "Composed card. Production renders this with Shotstack from brand artwork plus these four fields. No image is generated.",
    },
  };
}
