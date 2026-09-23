const X_API = "https://api.x.com/2";

export class XApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "XApiError";
  }
}

function authHeaders() {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) {
    throw new XApiError(
      400,
      "Live handles need X_BEARER_TOKEN. Pick a sample profile to run the demo without it.",
    );
  }
  return { Authorization: `Bearer ${token}` };
}

async function xFetch(path) {
  const response = await fetch(`${X_API}${path}`, { headers: authHeaders() });
  if (response.status === 429) {
    throw new XApiError(429, "X API rate limit reached. Try a sample profile or wait a few minutes.");
  }
  if (response.status === 404) throw new XApiError(404, "X user not found");
  if (response.status === 401) throw new XApiError(401, "X API authentication failed.");
  if (response.status === 403) throw new XApiError(403, "X API forbidden for this token or account.");
  if (!response.ok) {
    const body = await response.text();
    throw new XApiError(502, `X API error ${response.status}: ${body.slice(0, 180)}`);
  }
  return response.json();
}

function kindOf(tweet) {
  const refs = Array.isArray(tweet.referenced_tweets) ? tweet.referenced_tweets : [];
  if (refs.some((ref) => ref.type === "retweeted")) return "repost";
  if (refs.some((ref) => ref.type === "quoted")) return "quote";
  if (refs.some((ref) => ref.type === "replied_to")) return "reply";
  return "original";
}

export async function fetchXProfile(username) {
  const clean = username.replace(/^@/, "");
  const userResp = await xFetch(
    `/users/by/username/${encodeURIComponent(clean)}?user.fields=description,public_metrics,profile_image_url`,
  );
  if (!userResp.data) throw new XApiError(404, `X user @${clean} not found`);

  const user = userResp.data;
  const metrics = user.public_metrics;
  let posts = [];
  let next = null;
  for (let page = 0; page < 2; page += 1) {
    const token = next ? `&pagination_token=${encodeURIComponent(next)}` : "";
    try {
      const tweets = await xFetch(
        `/users/${user.id}/tweets?max_results=100&tweet.fields=text,created_at,public_metrics,referenced_tweets${token}`,
      );
      if (Array.isArray(tweets.data)) {
        posts = posts.concat(
          tweets.data.map((tweet) => ({
            text: String(tweet.text ?? ""),
            kind: kindOf(tweet),
            createdAt: tweet.created_at,
            likeCount: tweet.public_metrics?.like_count ?? 0,
            repostCount: tweet.public_metrics?.retweet_count ?? 0,
          })),
        );
      }
      next = tweets.meta?.next_token;
      if (!next) break;
    } catch (error) {
      if (error instanceof XApiError && error.status === 429) throw error;
      break;
    }
  }

  let follows = [];
  let followsUnavailable = false;
  try {
    const followResp = await xFetch(
      `/users/${user.id}/following?max_results=1000&user.fields=username`,
    );
    if (Array.isArray(followResp.data)) {
      follows = followResp.data.map((account) => String(account.username ?? "")).filter(Boolean);
    } else {
      followsUnavailable = true;
    }
  } catch (error) {
    if (error instanceof XApiError && error.status === 429) throw error;
    followsUnavailable = true;
  }

  let likesGiven = null;
  try {
    const likes = await xFetch(`/users/${user.id}/liked_tweets?max_results=100`);
    if (Array.isArray(likes.data)) likesGiven = likes.data.length;
  } catch {
    likesGiven = null;
  }

  return {
    username: user.username,
    name: user.name,
    description: user.description ?? "",
    profileImageUrl: user.profile_image_url
      ? String(user.profile_image_url).replace("_normal", "_400x400")
      : null,
    publicMetrics: metrics
      ? {
          followers: metrics.followers_count ?? 0,
          following: metrics.following_count ?? 0,
          tweets: metrics.tweet_count ?? 0,
        }
      : { followers: 0, following: 0, tweets: 0 },
    posts: posts.slice(0, 200),
    follows,
    followsUnavailable,
    likesGiven,
    profileUpdatedWeekOverWeek: null,
    source: "live",
  };
}
