import express from "express";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeProfile } from "./analyze.js";
import { SAMPLES, sampleProfile } from "./samples.js";
import { fetchXProfile, XApiError } from "./xData.js";

const root = dirname(fileURLToPath(import.meta.url));
const envPath = join(root, "..", ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === "") process.env[key] = value;
  }
}

const app = express();
const port = Number(process.env.PORT || 5050);

app.use(express.json());
app.use(express.static(join(root, "..", "public")));

app.get("/api/samples", (_req, res) => {
  res.json(
    SAMPLES.map((sample) => ({
      id: sample.id,
      label: sample.label,
      blurb: sample.blurb,
      handle: sample.profile.username,
    })),
  );
});

app.post("/api/analyze", async (req, res) => {
  try {
    const sampleId = String(req.body?.sampleId ?? "");
    const handle = String(req.body?.xHandle ?? "").trim();
    let profile = null;

    if (sampleId) {
      profile = sampleProfile(sampleId);
      if (!profile) return res.status(404).json({ error: "Unknown sample profile" });
    } else if (handle) {
      profile = await fetchXProfile(handle);
    } else {
      return res.status(400).json({ error: "Enter a handle or pick a sample profile." });
    }

    const result = await analyzeProfile(profile);
    res.json(result);
  } catch (error) {
    if (error instanceof XApiError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

app.listen(port, () => {
  console.log(`Fan Variance Authority demo on http://localhost:${port}`);
});
