import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeProfile } from "./analyze.js";
import { SAMPLES, sampleProfile } from "./samples.js";
import { fetchXProfile, XApiError } from "./xData.js";

const root = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(join(root, "..", "public")));

function listSamples(_req, res) {
  res.json(
    SAMPLES.map((sample) => ({
      id: sample.id,
      label: sample.label,
      blurb: sample.blurb,
      handle: sample.profile.username,
    })),
  );
}

async function analyze(req, res) {
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
}

app.get(["/api/samples", "/samples"], listSamples);
app.post(["/api/analyze", "/analyze"], analyze);

export default app;
