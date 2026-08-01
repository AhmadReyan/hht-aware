import { AI_WORKER_URL } from '../lib/aiConfig';

/**
 * askHht — streaming client for the Ask-HHT Worker.
 *
 * Requests a token stream (SSE) so text and voice start almost immediately:
 *  - onChunk(fullSoFar): called as tokens arrive (real streaming, not a fake typer).
 *  - onSentence(sentence): called each time a complete sentence is ready, so the
 *    caller can speak it aloud while the rest still generates (snappy voice).
 * Falls back to a single JSON answer if the Worker doesn't stream.
 *
 * PRIVACY: only the typed/spoken question (+ recent turns) is sent — never
 * tracked health data. Never throws; returns { ok, answer } or { ok:false, error }.
 */

export const isAiConfigured = () => typeof AI_WORKER_URL === 'string' && /^https?:\/\//.test(AI_WORKER_URL);

// Drains complete sentences from an accumulating string for sentence-by-sentence TTS.
const makeSentenceEmitter = (onSentence) => {
  let at = 0;
  return (full, force) => {
    if (!onSentence) return;
    for (;;) {
      const seg = full.slice(at);
      const m = seg.match(/[.!?…]["')\]]?\s/); // punctuation followed by whitespace = sentence end
      if (!m) break;
      const end = at + m.index + m[0].length;
      const sentence = full.slice(at, end).trim();
      at = end;
      if (sentence.length > 1) onSentence(sentence);
    }
    if (force) {
      const tail = full.slice(at).trim();
      at = full.length;
      if (tail.length > 1) onSentence(tail);
    }
  };
};

export const askHHT = async (question, history = [], onChunk = null, onSentence = null) => {
  if (!isAiConfigured()) return { ok: false, error: 'unconfigured' };
  const q = typeof question === 'string' ? question.trim() : '';
  if (!q) return { ok: false, error: 'empty' };

  const safeHistory = Array.isArray(history)
    ? history
        .filter((m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }))
    : [];

  try {
    const res = await fetch(AI_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q.slice(0, 1000), history: safeHistory, stream: true }),
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };

    const ct = (res.headers.get('content-type') || '').toLowerCase();

    // ---- Streaming (SSE) ----
    if (ct.includes('text/event-stream') && res.body && res.body.getReader) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const emit = makeSentenceEmitter(onSentence);
      let buffer = '';
      let full = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;
          try {
            const obj = JSON.parse(payload);
            const delta =
              obj.response
              || (obj.choices && obj.choices[0] && obj.choices[0].delta && obj.choices[0].delta.content)
              || '';
            if (delta) {
              full += delta;
              if (onChunk) onChunk(full);
              emit(full, false);
            }
          } catch {
            /* ignore a partial JSON line */
          }
        }
      }
      emit(full, true); // speak any trailing sentence
      const answer = full.trim();
      if (!answer) return { ok: false, error: 'empty_answer' };
      return { ok: true, answer };
    }

    // ---- Non-streaming fallback (JSON) ----
    const data = await res.json();
    if (data && data.ok && typeof data.answer === 'string' && data.answer.trim()) {
      const answer = data.answer.trim();
      if (onChunk) onChunk(answer);
      if (onSentence) onSentence(answer);
      return { ok: true, answer };
    }
    return { ok: false, error: (data && data.error) || 'bad_response' };
  } catch {
    return { ok: false, error: 'network' };
  }
};

export default askHHT;
