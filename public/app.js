const form = document.querySelector("#form");
const handleInput = document.querySelector("#handle");
const samplesEl = document.querySelector("#samples");
const errorEl = document.querySelector("#error");
const emptyEl = document.querySelector("#empty");
const loadingEl = document.querySelector("#loading");
const reportEl = document.querySelector("#report");

let lastCopy = "";
let slides = [];
let slideIndex = 0;

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

function plate(slide, handle) {
  const el = document.createElement("section");
  el.className = `plate plate-${slide.id}`;
  el.setAttribute("aria-label", slide.label);
  const extra = slide.character ? `<p class="plate-extra">Power character · ${slide.character}</p>` : "";
  el.innerHTML = `
    <p class="plate-top"><span>${slide.step} of 3</span><span>Fan Variance Authority</span></p>
    <div class="plate-main">
      <p class="label">${slide.label}</p>
      <p class="slide-title"></p>
      <p class="reason"></p>
      ${extra}
    </div>
    <p class="plate-foot"><span>@${handle}</span><span>Avengers: Doomsday</span></p>`;
  el.querySelector(".slide-title").textContent = slide.title;
  el.querySelector(".reason").textContent = slide.body;
  return el;
}

function showSlide(index, smooth = true) {
  if (!slides.length) return;
  slideIndex = Math.max(0, Math.min(slides.length - 1, index));
  const track = document.querySelector("#track");
  track.scrollTo({ left: slideIndex * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
  syncDots();
}

function syncDots() {
  document.querySelectorAll(".dot").forEach((dot, dotIndex) => {
    const on = dotIndex === slideIndex;
    dot.classList.toggle("on", on);
    dot.setAttribute("aria-selected", String(on));
  });
  document.querySelector("#prev").disabled = slideIndex === 0;
  document.querySelector("#next").disabled = slideIndex === slides.length - 1;
}

function renderDots() {
  const dots = document.querySelector("#dots");
  dots.replaceChildren();
  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dot";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-label", slide.label);
    button.addEventListener("click", () => showSlide(index));
    dots.append(button);
  });
}

function render(result) {
  emptyEl.hidden = true;
  loadingEl.hidden = true;
  reportEl.hidden = false;
  lastCopy = result.shareText;
  slides = result.slides ?? [];
  slideIndex = 0;

  document.querySelector("#who").textContent = `@${result.handle}`;
  document.querySelector("#track").replaceChildren(...slides.map((slide) => plate(slide, result.handle)));
  renderDots();
  showSlide(0, false);

  document.querySelector("#copy").textContent = result.postCopy;
  const bits = [
    `${result.postsRead} posts read`,
    result.followsUnavailable ? "follows unavailable" : `${result.followsRead} follows read`,
    result.copySource === "grok" ? "reply written by Grok" : "reply from the template",
    "one carousel, three slides",
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

document.querySelector("#track").addEventListener("scroll", () => {
  const track = document.querySelector("#track");
  const next = Math.round(track.scrollLeft / track.clientWidth);
  if (next !== slideIndex) { slideIndex = next; syncDots(); }
});
document.querySelector("#prev").addEventListener("click", () => showSlide(slideIndex - 1));
document.querySelector("#next").addEventListener("click", () => showSlide(slideIndex + 1));

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
