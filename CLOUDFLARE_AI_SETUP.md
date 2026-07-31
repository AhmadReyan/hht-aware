# Ask-HHT Assistant — Cloudflare Worker setup

The "Ask HHT" assistant is powered by a tiny **Cloudflare Worker** running
**Workers AI** (a Llama model on Cloudflare's edge). It's **free** within the
daily allowance, needs **no external API key**, and requires **no user login**.

Until you deploy the Worker and paste its URL, the assistant shows a friendly
"coming soon" state — nothing else in the app is affected.

## One-time setup (~10 minutes)

### 1. Create a free Cloudflare account
Go to <https://dash.cloudflare.com/sign-up> and sign up. **No credit card is
required** for the Workers free tier.

### 2. Deploy the Worker
From this repo's `cloudflare/` folder:

```bash
cd cloudflare
npx wrangler login        # opens a browser to authorize (one time)
npx wrangler deploy
```

`wrangler` reads `wrangler.toml` (which already declares the `AI` binding) and
deploys `hht-ai-worker.js`. On success it prints your Worker URL, e.g.:

```
https://hht-ai.<your-subdomain>.workers.dev
```

> Workers AI is enabled automatically by the `[ai]` binding — you don't need to
> turn anything on in the dashboard.

### 3. Point the app at your Worker
Open `src/lib/aiConfig.js` and paste the URL:

```js
export const AI_WORKER_URL = 'https://hht-ai.<your-subdomain>.workers.dev';
```

Commit and push — CI redeploys the site, and the assistant goes live. Done.

### 4. (Optional) lock down the origins
In `cloudflare/hht-ai-worker.js`, `ALLOWED_ORIGINS` already lists the GitHub
Pages URL, Capacitor, and localhost. If you use a custom domain, add it there
and `npx wrangler deploy` again.

## Cost & limits
- **Free:** 10,000 Workers AI "Neurons"/day and 100,000 Worker requests/day —
  far more than a niche app needs. No credit card.
- **Beyond free:** ~$0.011 per 1,000 Neurons (pennies). The in-app free-tier
  cap (`AI_FREE_DAILY_LIMIT` in `aiConfig.js`, default 5 questions/day per user,
  unlimited for Premium) keeps usage — and cost — bounded.

## Privacy
The Worker receives only the user's typed question and recent chat turns — the
app **never** sends tracked health data, the emergency card, or any personal
record. The assistant answers general HHT questions only and is labelled
"educational, not medical advice." Nothing is stored on the Worker.

## Want higher answer quality later?
Swap the model in `hht-ai-worker.js` (`env.AI.run('@cf/...')`) for another
Workers AI model, or change the Worker to call Google Gemini / Anthropic with a
key stored via `npx wrangler secret put` — the app side doesn't change.
