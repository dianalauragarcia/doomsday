const form = document.querySelector("#form");
const handleInput = document.querySelector("#handle");
const samplesEl = document.querySelector("#samples");
const errorEl = document.querySelector("#error");
const emptyEl = document.querySelector("#empty");
const loadingEl = document.querySelector("#loading");
const reportEl = document.querySelector("#report");

let lastCopy = "";

function showError(message) {
  errorEl.hidden = !message;
  errorEl.textContent = message || "";
}

function setBusy(busy) {
  loadingEl.hidden = !busy;
  if (busy) {
    emptyEl.hidden = true;
    reportEl.hidden = true;
  }
}

function meter(label, raw, score) {
  const row = document.createElement("div");
  row.className = "meter";
  const width = Math.round(Math.max(0, Math.min(1, score)) * 100);
  row.innerHTML = `<span>${label}</span><div class="bar"><span style="width:${width}%"></span></div><span>${raw}</span>`;
  return row;
}

function render(result) {
  emptyEl.hidden = true;
  loadingEl.hidden = true;
  reportEl.hidden = false;
  lastCopy = result.shareText;

  const avatar = document.querySelector("#avatar");
  if (result.profileImageUrl) {
    avatar.style.backgroundImage = `url("${result.profileImageUrl}")`;
    avatar.textContent = "";
  } else {
    avatar.style.backgroundImage = "";
    avatar.textContent = result.handle.slice(0, 2).toUpperCase();
  }

  document.querySelector("#who").textContent = `@${result.handle}`;
  document.querySelector("#percentile").textContent = result.percentile;
  document.querySelector("#percentile-note").textContent = result.percentileNote;
  document.querySelector("#fandom").textContent = result.fandom?.name ?? "Unranked";
  document.querySelector("#fandom-meta").textContent = result.fandom
    ? `${result.fandom.franchise}${result.fandom.evidence?.length ? " · " + result.fandom.evidence.join(", ") : ""}`
    : "Not enough MCU signal yet";
  document.querySelector("#power").textContent = result.superpower.name;
  document.querySelector("#power-meta").textContent = `${result.superpower.means}. ${result.superpower.because}.`;
  document.querySelector("#alchemy").textContent = result.alchemy.name;
  document.querySelector("#reason").textContent = result.alchemy.reason;

  const meters = document.querySelector("#meters");
  meters.replaceChildren(
    meter("Bio keywords", result.axes.bio, result.axisScores.bio),
    meter("Follows", result.axes.follows, result.axisScores.follows),
    meter("Post keywords", result.axes.postKeywords, result.axisScores.posts),
    meter("MCU reposts", result.axes.mcuReposts, result.axisScores.reposts),
  );

  document.querySelector("#copy").textContent = result.postCopy;
  const bits = [
    `${result.postsRead} posts read`,
    result.followsUnavailable ? "follows unavailable" : `${result.followsRead} follows read`,
    result.copySource === "grok" ? "reply written by Grok" : "reply from the template",
    "card composed, not generated",
  ];
  document.querySelector("#meta").textContent = bits.join(" · ");
}

async function analyze(body) {
  showError("");
  setBusy(true);
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Could not read that timeline");
    render(payload);
  } catch (error) {
    setBusy(false);
    emptyEl.hidden = false;
    showError(error.message);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  analyze({ xHandle: handleInput.value });
});

document.querySelector("#share").addEventListener("click", () => {
  if (!lastCopy) return;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(lastCopy)}`;
  window.open(url, "_blank", "noopener");
});

const samples = await fetch("/api/samples").then((response) => response.json());
for (const sample of samples) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chip";
  button.innerHTML = `<strong>${sample.label}</strong><span>${sample.blurb}</span>`;
  button.addEventListener("click", () => {
    handleInput.value = `@${sample.handle}`;
    analyze({ sampleId: sample.id });
  });
  samplesEl.append(button);
}
