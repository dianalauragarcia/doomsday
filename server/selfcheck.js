import { analyzeProfile } from "./analyze.js";
import { SAMPLES, sampleProfile } from "./samples.js";

let failed = 0;
for (const sample of SAMPLES) {
  const result = await analyzeProfile(sampleProfile(sample.id));
  const got = {
    fandom: result.fandom?.name ?? null,
    power: result.superpower.name,
    alchemy: result.alchemy.name,
    percentile: result.percentile,
  };
  const ok =
    got.fandom === sample.expect.fandom &&
    got.power === sample.expect.power &&
    got.alchemy === sample.expect.alchemy &&
    got.percentile === sample.expect.percentile;
  if (!ok) failed += 1;
  console.log(
    `${ok ? "ok" : "FAIL"} ${sample.id}: ${got.percentile} | ${got.fandom} | ${got.power} | ${got.alchemy}`,
  );
  if (!ok) console.log("  expected", sample.expect);
}

if (failed) {
  console.error(`${failed} sample(s) failed`);
  process.exit(1);
}
console.log(`All ${SAMPLES.length} samples matched.`);
