/**
 * hht-ai-worker.js — Cloudflare Worker backend for the "Ask HHT" assistant (AURA).
 *
 * All on Cloudflare Workers AI at the edge — no external API key to leak, free
 * within the daily Neuron allowance. Three POST endpoints (routed by path):
 *   POST /            (or anything else) → CHAT: { question, history } -> { ok, answer }  (Llama)
 *   POST /tts         → TEXT-TO-SPEECH:   { text } -> audio/mpeg (MeloTTS neural voice)
 *   POST /stt         → SPEECH-TO-TEXT:   raw audio body -> { ok, text }  (Whisper)
 *
 * Voice: if the DEEPGRAM_API_KEY secret is set, /tts and /stt call the Deepgram
 * REST API directly (Aura-2 TTS + Nova-3 STT) — the most lifelike voice, billed
 * to the owner's own Deepgram account/credit. If the key is absent or Deepgram
 * errors, it falls back to the FREE Workers AI models (MeloTTS + Whisper), so
 * voice always works. Set the key with: npx wrangler@3 secret put DEEPGRAM_API_KEY
 *
 * PRIVACY: receives only the user's question / spoken audio for GENERAL HHT
 * questions. No personal health data is sent by the app. Nothing is stored here.
 */

const SYSTEM_PROMPT = `You are "HHT Assistant", a warm, plain-language educational guide about Hereditary Hemorrhagic Telangiectasia (HHT, also called Osler-Weber-Rendu syndrome).

Answer general questions about HHT clearly and supportively: nosebleeds (epistaxis), telangiectasias, iron deficiency and anemia, arteriovenous malformations (lungs, liver, brain, GI), genetics and inheritance, screening and diagnosis (Curaçao criteria), everyday self-care, and what to raise with a doctor.

Rules:
- Keep answers concise: a short paragraph or a few bullets.
- You are NOT a doctor. Never diagnose, prescribe, or give personalized medical advice. For anything about the user's own case, or anything urgent, tell them to contact their HHT specialist or emergency services.
- You do not have access to the user's personal data — never imply you do.
- If asked about something unrelated to HHT, gently steer back to HHT.`;

const ALLOWED_ORIGINS = [
  'https://ahmadreyan.github.io',
  'capacitor://localhost',
  'https://localhost',
  'http://localhost',
  'http://localhost:4173',
  'http://localhost:5173',
];

// Deepgram Aura-2 voice (warm, natural, healthcare-tuned). Swap the name to any
// other Aura-2 voice, e.g. aura-2-andromeda-en, aura-2-apollo-en, aura-2-luna-en.
const AURA_VOICE = 'aura-2-thalia-en';

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// Base64 helpers (chunked so large audio buffers don't overflow the call stack).
function abToBase64(ab) {
  const bytes = new Uint8Array(ab);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}
function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);
    const path = new URL(request.url).pathname;

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: cors });

    // ---------- TEXT-TO-SPEECH ----------
    if (path.endsWith('/tts')) {
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const text = body && typeof body.text === 'string' ? body.text.slice(0, 1200).trim() : '';
      if (!text) return Response.json({ ok: false, error: 'empty' }, { status: 400, headers: cors });

      // 1) Deepgram Aura-2 (lifelike; uses the owner's Deepgram credit).
      if (env.DEEPGRAM_API_KEY) {
        try {
          const dg = await fetch(`https://api.deepgram.com/v1/speak?model=${AURA_VOICE}&encoding=mp3`, {
            method: 'POST',
            headers: { Authorization: `Token ${env.DEEPGRAM_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          });
          if (dg.ok && dg.body) {
            return new Response(dg.body, { headers: { ...cors, 'Content-Type': 'audio/mpeg' } });
          }
        } catch {
          /* fall back to the free voice below */
        }
      }

      // 2) Free MeloTTS fallback.
      try {
        const out = await env.AI.run('@cf/myshell-ai/melotts', { prompt: text, lang: 'en' });
        // MeloTTS returns raw WAV audio bytes (RIFF/WAVE); some variants wrap it
        // as { audio: <base64> }. Handle both, label as audio/wav.
        if (out && typeof out === 'object' && typeof out.audio === 'string') {
          return new Response(base64ToBytes(out.audio), { headers: { ...cors, 'Content-Type': 'audio/wav' } });
        }
        return new Response(out, { headers: { ...cors, 'Content-Type': 'audio/wav' } });
      } catch (e) {
        return Response.json({ ok: false, error: 'tts_failed', detail: String((e && e.message) || e) }, { status: 502, headers: cors });
      }
    }

    // ---------- SPEECH-TO-TEXT ----------
    if (path.endsWith('/stt')) {
      try {
        const ab = await request.arrayBuffer();
        if (!ab || ab.byteLength < 200) return Response.json({ ok: false, error: 'no_audio' }, { status: 400, headers: cors });

        // 1) Deepgram Nova-3 (most accurate; uses the owner's Deepgram credit).
        if (env.DEEPGRAM_API_KEY) {
          try {
            const ct = request.headers.get('Content-Type') || 'audio/webm';
            const dg = await fetch('https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&punctuate=true', {
              method: 'POST',
              headers: { Authorization: `Token ${env.DEEPGRAM_API_KEY}`, 'Content-Type': ct },
              body: ab,
            });
            if (dg.ok) {
              const j = await dg.json();
              const t =
                (j && j.results && j.results.channels && j.results.channels[0]
                  && j.results.channels[0].alternatives && j.results.channels[0].alternatives[0]
                  && j.results.channels[0].alternatives[0].transcript) || '';
              return Response.json({ ok: true, text: String(t).trim() }, { headers: cors });
            }
          } catch {
            /* fall back to free Whisper below */
          }
        }

        // 2) Free Whisper fallback.
        const b64 = abToBase64(ab);
        let res;
        try {
          res = await env.AI.run('@cf/openai/whisper-large-v3-turbo', { audio: b64 });
        } catch {
          res = await env.AI.run('@cf/openai/whisper-large-v3-turbo', { audio: [...new Uint8Array(ab)] });
        }
        const text = (res && (res.text || res.transcription)) || '';
        return Response.json({ ok: true, text: String(text).trim() }, { headers: cors });
      } catch (e) {
        return Response.json({ ok: false, error: 'stt_failed', detail: String((e && e.message) || e) }, { status: 502, headers: cors });
      }
    }

    // ---------- CHAT (default) ----------
    let body;
    try { body = await request.json(); } catch { body = {}; }

    const question = body && typeof body.question === 'string' ? body.question.slice(0, 1000).trim() : '';
    if (!question) return Response.json({ ok: false, error: 'empty' }, { status: 400, headers: cors });

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
      const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', { messages, max_tokens: 600 });
      const answer = (result && (result.response || (result.result && result.result.response))) || '';
      if (!answer) return Response.json({ ok: false, error: 'empty_answer' }, { status: 502, headers: cors });
      return Response.json({ ok: true, answer: String(answer).trim() }, { headers: cors });
    } catch {
      return Response.json({ ok: false, error: 'ai_failed' }, { status: 502, headers: cors });
    }
  },
};
