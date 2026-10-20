import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CHARACTERS, FRANCHISES } from "./catalog.js";
import { extractSignals } from "./signals.js";


function hasToken(value) {
  return /[\p{L}\p{N}]/u.test(String(value ?? ""));
}

export function isEmptyProfile(profile) {
  const bio = hasToken(profile?.description);
  const name = hasToken(profile?.name);
  const posts = (profile?.posts ?? []).some((post) => hasToken(post?.text));
  const follows = (profile?.follows ?? []).some((handle) => hasToken(handle));
  return !bio && !posts && !follows && !name;
}

const LIFE_WORD =
  /\b(student|study|studying|school|college|university|work|working|job|lavoro|engineer|advertising|music|song|band|anime|manga|game|gaming|gamer|football|soccer|basketball|gym|artist|draw|drawing|writer|writing|travel|traveling|travelling|wife|husband|mom|dad|blue|bread|cook|chef|nurse|teacher|player|fan|team|art|play|playing|guitar|piano|read|reading|book|books|movie|movies|film)\b/iu;

const SUPPORTING_CAST =
  /\b(karen page|foggy nelson|matt murdock|pepper potts|happy hogan|jane foster|darcy lewis|mj watson|aunt may|ned leeds|betty ross|wanda|peter quill|scott lang|hope van dyne|bucky|natasha|clint|tony stark|steve rogers|logan|wade wilson)\b/iu;

function countItems(value, read) {
  if (typeof value === "number") return value;
  if (!Array.isArray(value)) return 0;
  return value.filter((item) => hasToken(read(item))).length;
}

function lettersOnly(value) {
  return String(value || "")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/www\.\S+/gi, " ")
    .replace(/@\w+/g, " ")
    .replace(/\p{Extended_Pictographic}/gu, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasHero(text) {
  const hay = String(text || "");
  for (const franchise of FRANCHISES) {
    for (const character of franchise.characters) {
      const phrases = [character.name, ...(character.keywords || [])];
      for (const phrase of phrases) {
        if (String(phrase).length < 4) continue;
        const escaped = String(phrase).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "iu");
        if (re.test(hay)) return true;
      }
    }
  }
  return false;
}

function isPrayer(original) {
  return (
    /\b(allah|allahu|alhamdulillah|subhanallah|bismillah|inshallah|mashallah|mohammad|muhammad|rasulullah|prophet)\b/i.test(
      original,
    ) ||
    /مسلم|اللهم|اللَّهُمَّ|الصبر|صلى/.test(original) ||
    /\b(proud muslim|muslim)\b/i.test(original)
  );
}

function isSpam(original, stripped) {
  if (!stripped && /https?:\/\/|www\./i.test(original)) return true;
  if ((original.match(/https?:\/\//gi) || []).length >= 2) return true;
  return /\b(subscribe|follow me|please follow|follow us|check out my|i follow people|follow in twitter|follow on tiktok|on tiktok)\b/i.test(
    original,
  ) || /\b(instagram|insta|tiktok|youtube)\s*:/i.test(original) || /\b(insta id|tt\s*:)\b/i.test(original) || /\bbot\b/i.test(original);
}

function isEmojiOrJunk(stripped) {
  if (!stripped) return true;
  if (/^[\d\s]+$/u.test(stripped)) return true;
  if (/^(?:\p{L}\s*){1,3}$/u.test(stripped)) return true;
  if (/^\p{L}{1,2}\s+\d+$/u.test(stripped)) return true;
  return false;
}

function isGreeting(original, stripped) {
  if (/^(hi|hello|hey|hola|welcome|yo|sup|alo|howdy|hiya|hayyie)\b/i.test(stripped)) return true;
  return /こんにちは|よろしく|很荣幸|hola soy|hello dear|hayyie welcome|dmどうぞ/i.test(original);
}

function isLocation(original, stripped) {
  if (/📍|\bplace\s*:/i.test(original) || /\p{Regional_Indicator}{2}/u.test(original)) return true;
  if (/\b(rest in peace|r\.?i\.?p\.?)\b/i.test(original)) return true;
  const words = stripped.split(/\s+/).filter(Boolean);
  if (words.length > 8) return false;
  return /\b(iran|iraq|venezuela|brazil|brasil|france|england|india|italia|italy|réunion|reunion|socal|newcastle|dehradun|philippines|hong kong|minab|australia)\b/i.test(
    stripped,
  );
}

function isPlaceholder(original, stripped) {
  const text = stripped.toLowerCase();
  if (
    /^(who|what|why|hmm+|huh|idk|ok+|bruh|hehe|lol+|lmao|nah+|yep|yes|si|no|none|nothing|bio|show|xxx|shh|sup|good|shit|human|man|whatever|idc|tba|tbd|fuck|fuckme|biatch|xdxdxd)[\s!.?]*$/i.test(
      text,
    )
  ) {
    return true;
  }
  if (/^(im|i'm)\s+\d{1,2}$/i.test(text)) return true;
  if (/^\d{1,4}([./-]\d{1,2}){1,2}$/.test(text.replace(/\s/g, ""))) return true;
  return /\b(don.?t know|do not know|nothing to (see|put)|no se|bilgim yok|i.?m me|i.?m new here|i am new here|new acc|new account|never on this app|no longer active|news feed|might delete|don.?t use social media|check my email|here for stuff|just reposting|to speak|manusia biasa|閲覧垢|よろしく|こんにちは|很荣幸|義務いいね|只是一个)\b/i.test(
    original,
  ) || /\b(account|priv)\b/i.test(text) && text.split(/\s+/).length <= 6 || /\b(status|bahasa)\b/i.test(text);
}

export function noiseBioKind(bio) {
  const original = String(bio || "").replace(/\s+/g, " ").trim();
  if (!original) return null;
  if (isPrayer(original)) return "prayer";
  const stripped = lettersOnly(original);
  if (isSpam(original, stripped)) return "spam";
  if (hasHero(original) || LIFE_WORD.test(stripped)) return null;
  if (isEmojiOrJunk(stripped)) return "emoji";
  if (isGreeting(original, stripped)) return "greeting";
  if (isLocation(original, stripped)) return "location";
  if (isPlaceholder(original, stripped)) return "placeholder";
  return null;
}

export function isThinGhostProfile(profile) {
  const posts = countItems(profile?.posts, (post) => (typeof post === "string" ? post : post?.text));
  const follows = countItems(profile?.follows, (handle) =>
    typeof handle === "string" ? handle : handle?.username || handle?.handle,
  );
  if (posts > 0 || follows > 0) return false;
  if (!hasToken(profile?.description)) {
    // Only a display name, no bio, posts, or follows: Ghost unless the name itself is a hero.
    const name = String(profile?.name ?? "");
    return !hasHero(name) && !SUPPORTING_CAST.test(name);
  }
  return noiseBioKind(profile?.description) != null;
}

function thinGhostDecision() {
  const reason = "No posts or follows, and the bio is only a greeting, place, emoji, placeholder, spam, or prayer";
  return {
    fandom: {
      ...marvelFanFandom(),
      evidence: [reason],
    },
    viaGrok: false,
    grokStatus: "default",
    reason,
    confidence: 1,
  };
}

export function marvelFanFandom() {
  return {
    id: "ghost",
    name: "Ghost",
    franchiseId: "thunderbolts",
    franchiseName: "Thunderbolts",
    points: 0,
    evidence: ["No bio, posts, follows, or display name to read"],
    viaDefault: true,
  };
}

function defaultDecision() {
  return {
    fandom: marvelFanFandom(),
    viaGrok: false,
    grokStatus: "default",
    reason: "No bio, posts, follows, or display name to read",
    confidence: 1,
  };
}

const NAMED = [];

const BY_ID = new Map();
for (const franchise of FRANCHISES) {
  for (const character of franchise.characters) {
    BY_ID.set(character.id, {
      id: character.id,
      name: character.name,
      franchiseId: franchise.id,
      franchiseName: franchise.name,
    });
  }
}
for (const named of NAMED) BY_ID.set(named.id, named);

const LEGAL_IDS = new Set(BY_ID.keys());
const MIN_CONFIDENCE = 0.2;

const SYSTEM = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'fanalyzer-report-prompt.txt'), 'utf8');

export function fandomFromCategory(categoryId, reason) {
  const key = String(categoryId ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const row = BY_ID.get(key);
  if (!row) return null;
  const character = CHARACTERS[row.id];
  return {
    id: character ? row.id : null,
    name: row.name,
    franchiseId: row.franchiseId,
    franchiseName: row.franchiseName,
    points: 0,
    evidence: reason ? [reason] : [],
    viaGrok: true,
  };
}

function clip(text, max) {
  const value = String(text ?? "").replace(/\s+/g, " ").trim();
  return value.length <= max ? value : value.slice(0, max - 1) + "…";
}

export function categoryIdFor(fandom) {
  if (!fandom) return null;
  if (fandom.id && BY_ID.has(fandom.id)) return fandom.id;
  const name = String(fandom.name ?? "")
    .trim()
    .toLowerCase();
  for (const row of BY_ID.values()) {
    if (row.name.toLowerCase() === name || row.id === name.replace(/\s+/g, "-")) return row.id;
  }
  return null;
}

function profileBrief(profile, rulesFandom, mustPick = false) {
  const posts = (profile.posts ?? [])
    .map((post) => clip(post.text, 140))
    .filter(Boolean)
    .slice(0, 60);
  const follows = (profile.follows ?? [])
    .map((handle) => String(handle).replace(/^@/, ""))
    .filter(Boolean)
    .slice(0, 80);
  const rulesId = categoryIdFor(rulesFandom);
  const behavior = extractSignals(profile).behavior;
  return {
    name: clip(profile.name, 80),
    handle: clip(profile.username, 40),
    bio: clip(profile.description, 500),
    posts,
    follows,
    behavior: {
      posts28d: behavior.posts28d,
      originals28d: behavior.originals28d,
      replies28d: behavior.replies28d,
      quotes28d: behavior.quotes28d,
      reposts28d: behavior.reposts28d,
      avgLikes: Number(behavior.avgLikes.toFixed(2)),
      avgRepostsReceived: Number(behavior.avgRepostsReceived.toFixed(2)),
      followers: behavior.followers,
      following: behavior.following,
      followerFollowingRatio: behavior.ratio == null ? null : Number(behavior.ratio.toFixed(2)),
      likesGiven: behavior.likesGiven,
      profileUpdatedWeekOverWeek: behavior.profileUpdatedWeekOverWeek,
    },
    deterministic: rulesId ? { categoryId: rulesId, name: rulesFandom.name } : null,
    ...(mustPick
      ? {
          retry:
            "Your previous answer was null. This profile is NOT blank. Apply FORCED MATCH and the ANALOGICAL LIFE MAP. Return a legal topFandom.categoryId at confidence 0.20-0.39 and quote the life token you used.",
        }
      : {}),
  };
}

function parsePayload(raw) {
  const text = String(raw ?? "");
  const arrayAt = text.indexOf("[");
  const objectAt = text.indexOf("{");
  const start = arrayAt === -1 ? objectAt : objectAt === -1 ? arrayAt : Math.min(arrayAt, objectAt);
  if (start === -1) return null;
  const end = text[start] === "[" ? text.lastIndexOf("]") : text.lastIndexOf("}");
  if (end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function askGrok(content, maxTokens) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { ok: false, status: "no-key" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.XAI_FANDOM_MODEL || "grok-4.5",
        temperature: 0,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: JSON.stringify(content) },
        ],
      }),
    });
    if (response.status === 429) return { ok: false, status: "rate-limit" };
    if (!response.ok) return { ok: false, status: `http-${response.status}` };
    const body = await response.json();
    const parsed = parsePayload(body.choices?.[0]?.message?.content ?? "");
    if (!parsed) return { ok: false, status: "bad-json" };
    return { ok: true, parsed };
  } catch {
    return { ok: false, status: "error" };
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function reportFrom(parsed) {
  const top = parsed?.topFandom && typeof parsed.topFandom === "object" ? parsed.topFandom : parsed ?? {};
  const power = parsed?.superpower && typeof parsed.superpower === "object" ? parsed.superpower : null;
  const alchemy = parsed?.alchemy && typeof parsed.alchemy === "object" ? parsed.alchemy : null;
  const diehard = parsed?.diehard && typeof parsed.diehard === "object" ? parsed.diehard : null;
  const score = Number(diehard?.score);
  return {
    categoryId: top?.categoryId,
    topLabel: top?.label ?? null,
    confidence: top?.confidence,
    reason: top?.reason,
    diehardTier: diehard?.tier ?? null,
    diehardScore: Number.isFinite(score) ? score : null,
    diehardReason: clip(diehard?.reason, 400),
    powerId: power?.id ?? null,
    powerLabel: power?.label ?? null,
    powerCharacter: power?.character ?? null,
    powerMeaning: power?.meaning ?? null,
    powerReason: clip(power?.reason, 400),
    alchemyId: alchemy?.categoryId ?? null,
    alchemyLabel: alchemy?.label ?? null,
    alchemyReason: clip(alchemy?.reason, 400),
  };
}

function decide(rulesFandom, parsed) {
  const rulesId = categoryIdFor(rulesFandom);
  const report = reportFrom(parsed);
  if (!parsed) {
    return { fandom: rulesFandom ?? null, viaGrok: false, grokStatus: "null", reason: "", confidence: null, ...report };
  }
  const confidence = Number(report.confidence);
  const reason = clip(report.reason, 400);
  const rawId = String(report.categoryId ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const fields = { ...report, reason, confidence: Number.isFinite(confidence) ? confidence : null };
  if (rawId && rawId !== "null" && !LEGAL_IDS.has(rawId)) {
    return { fandom: rulesFandom ?? null, viaGrok: false, grokStatus: "null", ...fields };
  }
  const picked = fandomFromCategory(report.categoryId, reason);
  const pickedId = categoryIdFor(picked);
  if (!picked || !Number.isFinite(confidence) || confidence < MIN_CONFIDENCE) {
    return { fandom: rulesFandom ?? null, viaGrok: false, grokStatus: "null", ...fields };
  }
  if (rulesId && pickedId === rulesId) {
    return { fandom: rulesFandom, viaGrok: false, grokStatus: "kept", ...fields };
  }
  return { fandom: picked, viaGrok: true, grokStatus: rulesId ? "changed" : "assigned", ...fields };
}

async function askWithRetry(content, maxTokens) {
  let asked = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    asked = await askGrok(content, maxTokens);
    if (asked.ok || (asked.status !== "rate-limit" && asked.status !== "error")) break;
    await sleep(1000 * (attempt + 1));
  }
  return asked;
}

function ghostBefore(profile, rulesFandom) {
  if (rulesFandom) return null;
  if (isEmptyProfile(profile)) return defaultDecision();
  if (isThinGhostProfile(profile)) return thinGhostDecision();
  return null;
}

function stillUnmatched(decision) {
  return !decision.fandom && decision.grokStatus !== "default";
}

async function forcePick(profile, rulesFandom) {
  const asked = await askWithRetry(profileBrief(profile, rulesFandom, true), 1400);
  if (!asked?.ok) return null;
  const decision = decide(rulesFandom, asked.parsed);
  return decision.fandom ? decision : null;
}

export async function classifyFandom(profile, rulesFandom) {
  const early = ghostBefore(profile, rulesFandom);
  if (early) return early;
  const asked = await askWithRetry(profileBrief(profile, rulesFandom), 1400);
  if (!asked?.ok) {
    return { fandom: rulesFandom ?? null, viaGrok: false, grokStatus: asked?.status || "error", reason: "", confidence: null };
  }
  const decision = decide(rulesFandom, asked.parsed);
  if (stillUnmatched(decision)) return (await forcePick(profile, rulesFandom)) ?? decision;
  return decision;
}

export async function classifyMany(entries) {
  const pending = entries.filter((entry) => !ghostBefore(entry.profile, entry.rulesFandom));
  const payload = pending.map((entry) => ({
    id: entry.id,
    ...profileBrief(entry.profile, entry.rulesFandom),
  }));
  const asked = pending.length ? await askWithRetry(payload, 900 * pending.length) : null;
  const byId = new Map();
  if (asked?.ok && Array.isArray(asked.parsed)) {
    for (const item of asked.parsed) byId.set(String(item.id), item);
  }
  if (pending.length > 0 && byId.size === 0) {
    const singles = [];
    for (const entry of entries) singles.push(await classifyFandom(entry.profile, entry.rulesFandom));
    return singles;
  }
  const first = entries.map((entry) => {
    const early = ghostBefore(entry.profile, entry.rulesFandom);
    if (early) return early;
    const item = byId.get(String(entry.id));
    if (!item) return { fandom: entry.rulesFandom ?? null, viaGrok: false, grokStatus: "missing", reason: "", confidence: null };
    return decide(entry.rulesFandom, item);
  });
  const retry = [];
  first.forEach((decision, index) => {
    if (stillUnmatched(decision) && decision.grokStatus !== "error") retry.push(index);
  });
  const queue = [...retry];
  const forced = new Map();
  const runners = Array.from({ length: Math.min(4, queue.length) }, async () => {
    while (queue.length) {
      const index = queue.shift();
      const entry = entries[index];
      const picked = await forcePick(entry.profile, entry.rulesFandom);
      if (picked) forced.set(index, picked);
    }
  });
  await Promise.all(runners);
  return first.map((decision, index) => forced.get(index) ?? decision);
}

export async function inferFandom(profile) {
  const judged = await classifyFandom(profile, null);
  if (judged.viaGrok || judged.grokStatus === "default") return judged.fandom;
  return null;
}
