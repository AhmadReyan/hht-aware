// src/components/research/researchText.js
//
// Small, dependency-free helpers shared by the swipe stack and the feed
// cards: the emoji-reaction options, and a graceful "explain simply"
// summary that derives a shorter, friendlier sentence from an update even
// when the data has no dedicated "simple" field. Never throws on missing
// or malformed data.

export const REACTIONS = [
  { key: 'hopeful', emoji: '💙', label: 'Hopeful' },
  { key: 'curious', emoji: '🤔', label: 'Curious' },
  { key: 'encouraged', emoji: '✨', label: 'Encouraged' },
];

/**
 * Returns a short, "like I'm 5" version of an update's summary.
 * Prefers an explicit `update.simple` field if the data ever provides one;
 * otherwise derives a shorter lead sentence from `plain`. Always returns a
 * safe string, even if `update` is null/undefined or fields are missing.
 */
export const deriveSimpleSummary = (update) => {
  if (!update) return "We don't have a simple version of this one yet.";

  if (typeof update.simple === 'string' && update.simple.trim()) {
    return update.simple.trim();
  }

  const text = typeof update.plain === 'string' ? update.plain.trim() : '';
  if (!text) return "We don't have a simple version of this one yet.";

  const firstSentence = (text.split(/(?<=[.!?])\s+/)[0] || text).trim();
  const clean = firstSentence.replace(/\s+/g, ' ');
  return `In short: ${clean}`;
};
