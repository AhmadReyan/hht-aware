import { AI_WORKER_URL } from '../lib/aiConfig';

/**
 * askHht — thin, guarded client for the Ask-HHT Cloudflare Worker.
 *
 * PRIVACY: only the user's typed question (+ recent chat turns) is sent — never
 * their tracked health data, emergency card, or any stored personal record.
 * The assistant answers GENERAL HHT questions only.
 *
 * Never throws. Returns { ok:true, answer } or { ok:false, error }.
 */

export const isAiConfigured = () => typeof AI_WORKER_URL === 'string' && /^https?:\/\//.test(AI_WORKER_URL);

export const askHHT = async (question, history = []) => {
  if (!isAiConfigured()) return { ok: false, error: 'unconfigured' };
  const q = typeof question === 'string' ? question.trim() : '';
  if (!q) return { ok: false, error: 'empty' };

  // Keep only the last few clean turns; strip anything unexpected.
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
      body: JSON.stringify({ question: q.slice(0, 1000), history: safeHistory }),
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    const data = await res.json();
    if (data && data.ok && typeof data.answer === 'string' && data.answer.trim()) {
      return { ok: true, answer: data.answer.trim() };
    }
    return { ok: false, error: (data && data.error) || 'bad_response' };
  } catch {
    return { ok: false, error: 'network' };
  }
};

export default askHHT;
