/**
 * hht-ai-worker.js — Cloudflare Worker backend for the "Ask HHT" assistant.
 *
 * Runs a chat model on Cloudflare Workers AI (Llama) at the edge — there is NO
 * external API key to hold or leak, and it's free within the daily Neuron
 * allowance. The app calls this Worker; the Worker injects the HHT system
 * prompt and returns the answer. No user login required.
 *
 * Deploy: see CLOUDFLARE_AI_SETUP.md (npx wrangler deploy). Needs the [ai]
 * binding named "AI" (configured in wrangler.toml).
 *
 * PRIVACY: this backend receives only the user's typed question + recent chat
 * turns. The app never sends personal health data. Nothing is stored here.
 */

const SYSTEM_PROMPT = `You are "HHT Assistant", a warm, plain-language educational guide about Hereditary Hemorrhagic Telangiectasia (HHT, also called Osler-Weber-Rendu syndrome).

Answer general questions about HHT clearly and supportively: nosebleeds (epistaxis), telangiectasias, iron deficiency and anemia, arteriovenous malformations (lungs, liver, brain, GI), genetics and inheritance, screening and diagnosis (Curaçao criteria), everyday self-care, and what to raise with a doctor.

Rules:
- Keep answers concise: a short paragraph or a few bullets.
- You are NOT a doctor. Never diagnose, prescribe, or give personalized medical advice. For anything about the user's own case, or anything urgent, tell them to contact their HHT specialist or emergency services.
- You do not have access to the user's personal data — never imply you do.
- If asked about something unrelated to HHT, gently steer back to HHT.`;

// Origins allowed to call this Worker. Add your production domain(s).
const ALLOWED_ORIGINS = [
  'https://ahmadreyan.github.io',
  'capacitor://localhost',
  'https://localhost',
  'http://localhost',
  'http://localhost:4173',
  'http://localhost:5173',
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: cors });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const question = body && typeof body.question === 'string' ? body.question.slice(0, 1000).trim() : '';
    if (!question) {
      return Response.json({ ok: false, error: 'empty' }, { status: 400, headers: cors });
    }

    const history = Array.isArray(body.history)
      ? body.history
          .filter((m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
          .slice(-6)
          .map((m) => ({ role: m.role, content: String(m.content).slice(0, 1500) }))
      : [];

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: question },
    ];

    try {
      const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages,
        max_tokens: 600,
      });
      const answer = (result && (result.response || (result.result && result.result.response))) || '';
      if (!answer) {
        return Response.json({ ok: false, error: 'empty_answer' }, { status: 502, headers: cors });
      }
      return Response.json({ ok: true, answer: String(answer).trim() }, { headers: cors });
    } catch {
      return Response.json({ ok: false, error: 'ai_failed' }, { status: 502, headers: cors });
    }
  },
};
