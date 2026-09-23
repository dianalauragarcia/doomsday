import { loadEnv } from "./env.js";
import app from "./app.js";

loadEnv();

const port = Number(process.env.PORT || 5050);
app.listen(port, () => {
  console.log(`Fan Variance Authority demo on http://localhost:${port}`);
});
