# Avengers: Doomsday — Fan Variance Authority

Pitch demo and blueprint for the Fan Variance Authority profile analyzer.

Markets in scope: EMEA, Japan, Canada, LATAM, APAC.

## Demo

```bash
npm install
npm start
```

Open http://localhost:5050 and pick a sample profile. Each sample is a different MCU read: diehard band, top fandom, X superpower, and alchemy.

```bash
npm run check
```

That reruns the seven sample profiles and checks the assignments.

Optional, for a live handle:

- `X_BEARER_TOKEN` in `.env` reads the public X profile: bio, name, metrics, and the last 100 posts, plus follows and likes when the token allows. The server loads `.env` on startup.
- `XAI_API_KEY` lets Grok write the @reply only. The four assignments stay deterministic. If Grok is absent or fails, the template reply is used.

No image is generated. The report card is a composition. In production that composition is a Shotstack render of brand artwork plus the four fields. A profile frame, if used, sits on the fan’s existing photo via oAuth.

Reply prompt used by the server: `Avengers_Doomsday_Fanalyzer_system_prompt_v0.txt`

## Vercel

Import [dianalauragarcia/doomsday](https://github.com/dianalauragarcia/doomsday). Framework preset: **Other**. No build command. Output is the `public` folder, which Vercel serves as-is. `/api/samples` and `/api/analyze` run as one Node function.

Set these environment variables on the project:

- `X_BEARER_TOKEN` — required for live handles
- `XAI_API_KEY` — optional; Grok writes the reply only
- `XAI_MODEL` — optional

Sample profiles work without either key.
