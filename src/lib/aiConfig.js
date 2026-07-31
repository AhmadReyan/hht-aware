// Ask-HHT AI configuration.
//
// AI_WORKER_URL is the URL of your deployed Cloudflare Worker (the free
// "Ask HHT" backend). Paste it here after `wrangler deploy` — see
// CLOUDFLARE_AI_SETUP.md. While it is empty the assistant runs in a friendly
// "not configured yet" mode and never crashes; the rest of the app is unaffected.
export const AI_WORKER_URL = 'https://hht-ai.riyanwarr.workers.dev';

// Free tier: number of assistant questions per day before the premium upsell.
// Premium unlocks unlimited (and also caps your Worker cost). 0 = unlimited free.
export const AI_FREE_DAILY_LIMIT = 5;
