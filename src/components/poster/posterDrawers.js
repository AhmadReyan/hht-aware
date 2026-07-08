// All poster layouts for the Poster Studio.
// Every drawer has the signature (ctx, data, theme, W, H, options) and positions
// content relative to W/H so a single function renders correctly at Square
// (1080x1080), Portrait (1080x1350) and Story (1080x1920). Width is always 1080,
// so `s = W/1080` is effectively 1; it is kept so the math reads intentionally
// and stays correct if a future width is introduced.

import {
  FONT_SERIF,
  FONT_SANS,
  wrapText,
  wrapTextCentered,
  countWrappedLines,
  drawPill,
  drawSoftCircle,
  applyPattern,
  drawAccentShape,
  drawRibbonShape,
  drawWaveBand,
  drawFooter,
  drawEmoji,
  hexToRgba,
} from './canvasHelpers';

// Fills the canvas with the theme's vertical gradient background.
const paintBackground = (ctx, W, H, theme) => {
  const g = ctx.createLinearGradient(0, 0, W * 0.6, H);
  g.addColorStop(0, theme.bgFrom);
  g.addColorStop(1, theme.bgTo);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
};

// Optional top-right ribbon accent (emoji or vector), gated by options.ribbon.
const maybeRibbon = (ctx, W, H, theme, options, s) => {
  if (!options.ribbon) return;
  if (options.ribbonStyle === 'emoji') {
    drawEmoji(ctx, '🎗️', W - 190 * s, H * 0.055, 70 * s);
  } else {
    drawRibbonShape(ctx, W - 150 * s, H * 0.075, 110 * s, theme.primary);
  }
};

// ---------------------------------------------------------------------------
// 1. AWARENESS (International HHT Awareness Day)
// ---------------------------------------------------------------------------
const drawAwareness = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const {
    headline = 'HHT is Real. HHT is Rare.',
    body = 'Hereditary Hemorrhagic Telangiectasia affects 1 in 5,000 people. Awareness saves lives.',
  } = data;

  paintBackground(ctx, W, H, theme);
  applyPattern(ctx, W, H, theme, options.pattern);
  maybeRibbon(ctx, W, H, theme, options, s);

  drawPill(ctx, M, H * 0.09, 'INTERNATIONAL HHT AWARENESS DAY', theme.primary, theme.onPrimary, 20 * s);

  ctx.fillStyle = theme.text;
  ctx.font = `italic bold ${64 * s}px ${FONT_SERIF}`;
  const hLines = wrapText(ctx, headline, M, H * 0.2, 76 * s, W - M * 2);

  ctx.fillStyle = theme.textSoft;
  ctx.font = `400 ${32 * s}px ${FONT_SANS}`;
  wrapText(ctx, body, M, H * 0.2 + hLines * 76 * s + 40 * s, 48 * s, W - M * 2);

  drawPill(ctx, M, H * 0.8, 'May 20  ·  #HHTAwareness', theme.secondary, theme.onSecondary, 20 * s);
  drawFooter(ctx, W, H, 'CUREHHT.ORG', theme.muted, 24 * s);
};

// ---------------------------------------------------------------------------
// 2. FACT
// ---------------------------------------------------------------------------
const drawFact = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const {
    stat = '1 in 5,000',
    body = 'people have HHT worldwide. Most cases remain undiagnosed due to low clinical awareness.',
  } = data;

  ctx.fillStyle = theme.surface;
  ctx.fillRect(0, 0, W, H);
  drawSoftCircle(ctx, W * 0.88, H * 0.14, W * 0.28, theme.circleSoft);
  applyPattern(ctx, W, H, theme, options.pattern);
  maybeRibbon(ctx, W, H, theme, options, s);

  drawPill(ctx, M, H * 0.09, '📊 HHT FACT', theme.secondary, theme.onSecondary, 20 * s);

  ctx.fillStyle = theme.accent;
  ctx.font = `italic bold ${130 * s}px ${FONT_SERIF}`;
  ctx.fillText(stat, M, H * 0.2);

  ctx.fillStyle = theme.text;
  ctx.font = `400 ${38 * s}px ${FONT_SANS}`;
  wrapText(ctx, body, M, H * 0.38, 58 * s, W - M * 2);

  drawFooter(ctx, W, H, '#HHT  ·  #HHTAwareness  ·  curehht.org', theme.muted, 24 * s);
};

// ---------------------------------------------------------------------------
// 3. STORY
// ---------------------------------------------------------------------------
const drawStory = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 120 * s;
  const {
    quote = 'Sharing my story makes an invisible vascular disease visible.',
    name = 'Anonymous',
    role = 'Patient',
  } = data;

  paintBackground(ctx, W, H, theme);
  applyPattern(ctx, W, H, theme, options.pattern);

  ctx.fillStyle = hexToRgba(theme.secondary, theme.dark ? 0.1 : 0.07);
  ctx.font = `italic bold ${520 * s}px ${FONT_SERIF}`;
  ctx.fillText('“', 40 * s, H * 0.02);

  drawPill(ctx, W - 260 * s, H * 0.09, 'MY STORY', theme.primary, theme.onPrimary, 20 * s);
  maybeRibbon(ctx, W, H, theme, options, s);

  ctx.fillStyle = theme.text;
  ctx.font = `italic ${44 * s}px ${FONT_SERIF}`;
  wrapText(ctx, `"${quote}"`, M, H * 0.22, 62 * s, W - M * 2);

  const avatarY = H * 0.78;
  const initials = name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase() || 'H';
  drawSoftCircle(ctx, M + 50 * s, avatarY, 50 * s, theme.primary);

  ctx.fillStyle = theme.onPrimary;
  ctx.font = `700 ${34 * s}px ${FONT_SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, M + 50 * s, avatarY);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.fillStyle = theme.textSoft;
  ctx.font = `bold ${36 * s}px ${FONT_SANS}`;
  ctx.fillText(name, M + 130 * s, avatarY - 34 * s);

  ctx.fillStyle = theme.muted;
  ctx.font = `500 ${26 * s}px ${FONT_SANS}`;
  ctx.fillText(role, M + 130 * s, avatarY + 6 * s);

  drawFooter(ctx, W, H, '#HHTAwareness  ·  curehht.org', theme.secondary, 24 * s);
};

// ---------------------------------------------------------------------------
// 4. BOLD STAT
// ---------------------------------------------------------------------------
const drawBoldStat = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const { stat = '90%', label = 'REMAIN UNDIAGNOSED', body = '' } = data;

  paintBackground(ctx, W, H, theme);
  applyPattern(ctx, W, H, theme, options.pattern);
  maybeRibbon(ctx, W, H, theme, options, s);

  // Giant number, auto-shrunk to fit width.
  let fontPx = 300 * s;
  ctx.font = `italic bold ${fontPx}px ${FONT_SERIF}`;
  while (ctx.measureText(stat).width > W - M * 2 && fontPx > 90 * s) {
    fontPx -= 8 * s;
    ctx.font = `italic bold ${fontPx}px ${FONT_SERIF}`;
  }
  const centerY = H * 0.42;
  ctx.fillStyle = theme.accent;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(stat, W / 2, centerY);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Accent underline bar.
  ctx.fillStyle = theme.primary;
  const barW = 160 * s;
  ctx.fillRect(W / 2 - barW / 2, centerY + fontPx * 0.42, barW, 8 * s);

  ctx.fillStyle = theme.text;
  ctx.font = `800 ${40 * s}px ${FONT_SANS}`;
  ctx.textAlign = 'center';
  wrapTextCentered(ctx, label.toUpperCase(), W / 2, centerY + fontPx * 0.42 + 40 * s, 50 * s, W - M * 2);

  ctx.fillStyle = theme.textSoft;
  ctx.font = `400 ${30 * s}px ${FONT_SANS}`;
  wrapTextCentered(ctx, body, W / 2, centerY + fontPx * 0.42 + 120 * s, 44 * s, W - M * 2.4);
  ctx.textAlign = 'left';

  drawFooter(ctx, W, H, 'curehht.org  ·  #HHTAwareness', theme.muted, 24 * s);
};

// ---------------------------------------------------------------------------
// 5. MINIMALIST
// ---------------------------------------------------------------------------
const drawMinimal = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 110 * s;
  const { headline = 'Know HHT.', body = '' } = data;

  ctx.fillStyle = theme.dark ? theme.surface : theme.bgFrom;
  ctx.fillRect(0, 0, W, H);
  applyPattern(ctx, W, H, theme, options.pattern);

  // Small accent shape top-left.
  drawAccentShape(ctx, options.accentShape || 'circle', M + 12 * s, H * 0.16, 44 * s, theme.primary);

  ctx.fillStyle = theme.text;
  ctx.font = `italic bold ${88 * s}px ${FONT_SERIF}`;
  const hLines = countWrappedLines(ctx, headline, W - M * 2);
  const blockTop = H / 2 - (hLines * 96 * s) / 2 - 30 * s;
  wrapText(ctx, headline, M, blockTop, 96 * s, W - M * 2);

  ctx.fillStyle = theme.muted;
  ctx.font = `400 ${34 * s}px ${FONT_SANS}`;
  wrapText(ctx, body, M, blockTop + hLines * 96 * s + 24 * s, 48 * s, W - M * 2);

  // Thin rule above footer.
  ctx.strokeStyle = hexToRgba(theme.primary, 0.5);
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(M, H - 130 * s);
  ctx.lineTo(M + 90 * s, H - 130 * s);
  ctx.stroke();

  drawFooter(ctx, W, H, 'CUREHHT.ORG', theme.muted, 22 * s);
  maybeRibbon(ctx, W, H, theme, options, s);
};

// ---------------------------------------------------------------------------
// 6. GRADIENT WAVE
// ---------------------------------------------------------------------------
const drawWave = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const { headline = 'Awareness flows further together', body = '' } = data;

  paintBackground(ctx, W, H, theme);
  applyPattern(ctx, W, H, theme, options.pattern);

  // Layered waves anchored to the bottom.
  drawWaveBand(ctx, W, H, H * 0.72, 46 * s, hexToRgba(theme.secondary, 0.35), 0.4);
  drawWaveBand(ctx, W, H, H * 0.78, 40 * s, hexToRgba(theme.primary, 0.5), 1.6);
  drawWaveBand(ctx, W, H, H * 0.84, 34 * s, theme.primary, 2.9);

  drawPill(ctx, M, H * 0.1, '🎗️ HHT AWARENESS', theme.secondary, theme.onSecondary, 20 * s);

  ctx.fillStyle = theme.text;
  ctx.font = `italic bold ${60 * s}px ${FONT_SERIF}`;
  const hLines = wrapText(ctx, headline, M, H * 0.24, 72 * s, W - M * 2);

  ctx.fillStyle = theme.textSoft;
  ctx.font = `400 ${32 * s}px ${FONT_SANS}`;
  wrapText(ctx, body, M, H * 0.24 + hLines * 72 * s + 30 * s, 46 * s, W - M * 2);

  ctx.fillStyle = theme.onPrimary;
  ctx.font = `700 ${26 * s}px ${FONT_SANS}`;
  ctx.fillText('curehht.org  ·  #HHTAwareness', M, H - 90 * s);
  maybeRibbon(ctx, W, H, theme, options, s);
};

// ---------------------------------------------------------------------------
// 7. RIBBON SPOTLIGHT
// ---------------------------------------------------------------------------
const drawRibbonSpotlight = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const { headline = 'Wear it. Share it. Cure HHT.', body = '' } = data;

  ctx.fillStyle = theme.dark ? theme.surface : theme.bgFrom;
  ctx.fillRect(0, 0, W, H);

  // Radial spotlight glow behind the ribbon.
  const glow = ctx.createRadialGradient(W / 2, H * 0.3, 20 * s, W / 2, H * 0.3, W * 0.5);
  glow.addColorStop(0, hexToRgba(theme.primary, theme.dark ? 0.4 : 0.22));
  glow.addColorStop(1, hexToRgba(theme.primary, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H * 0.62);
  applyPattern(ctx, W, H, theme, options.pattern);

  drawRibbonShape(ctx, W / 2, H * 0.28, 260 * s, theme.primary);

  ctx.fillStyle = theme.text;
  ctx.font = `italic bold ${58 * s}px ${FONT_SERIF}`;
  ctx.textAlign = 'center';
  const hLines = wrapTextCentered(ctx, headline, W / 2, H * 0.52, 70 * s, W - M * 2);

  ctx.fillStyle = theme.textSoft;
  ctx.font = `400 ${30 * s}px ${FONT_SANS}`;
  wrapTextCentered(ctx, body, W / 2, H * 0.52 + hLines * 70 * s + 24 * s, 44 * s, W - M * 2.2);
  ctx.textAlign = 'left';

  drawFooter(ctx, W, H, 'CUREHHT.ORG  ·  #HHTRIBBON', theme.muted, 24 * s);
};

// ---------------------------------------------------------------------------
// 8. QUOTE CARD
// ---------------------------------------------------------------------------
const drawQuote = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 130 * s;
  const { quote = 'Rare is not the same as alone.', author = 'The HHT Community' } = data;

  paintBackground(ctx, W, H, theme);
  applyPattern(ctx, W, H, theme, options.pattern);

  ctx.fillStyle = theme.primary;
  ctx.font = `italic bold ${220 * s}px ${FONT_SERIF}`;
  ctx.fillText('“', M - 20 * s, H * 0.16);

  ctx.fillStyle = theme.text;
  ctx.font = `italic ${58 * s}px ${FONT_SERIF}`;
  const qLines = countWrappedLines(ctx, quote, W - M * 2);
  const qTop = H / 2 - (qLines * 74 * s) / 2;
  wrapText(ctx, quote, M, qTop, 74 * s, W - M * 2);

  // Author with a short accent dash.
  const authY = qTop + qLines * 74 * s + 40 * s;
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 4 * s;
  ctx.beginPath();
  ctx.moveTo(M, authY + 16 * s);
  ctx.lineTo(M + 50 * s, authY + 16 * s);
  ctx.stroke();

  ctx.fillStyle = theme.secondary;
  ctx.font = `700 ${30 * s}px ${FONT_SANS}`;
  ctx.fillText(author.toUpperCase(), M + 70 * s, authY);

  drawFooter(ctx, W, H, 'curehht.org  ·  #HHTAwareness', theme.muted, 24 * s);
  maybeRibbon(ctx, W, H, theme, options, s);
};

// ---------------------------------------------------------------------------
// 9. DID YOU KNOW?
// ---------------------------------------------------------------------------
const drawDidYouKnow = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const { body = '' } = data;

  ctx.fillStyle = theme.dark ? theme.surface : theme.bgFrom;
  ctx.fillRect(0, 0, W, H);
  drawSoftCircle(ctx, W * 0.15, H * 0.85, W * 0.3, theme.circleSoft);
  applyPattern(ctx, W, H, theme, options.pattern);

  drawEmoji(ctx, '💡', M, H * 0.12, 96 * s);

  ctx.fillStyle = theme.primary;
  ctx.font = `italic bold ${64 * s}px ${FONT_SERIF}`;
  ctx.fillText('Did you know?', M, H * 0.24);

  ctx.fillStyle = theme.text;
  ctx.font = `500 ${44 * s}px ${FONT_SANS}`;
  wrapText(ctx, body, M, H * 0.38, 64 * s, W - M * 2);

  drawPill(ctx, M, H * 0.86, 'LEARN THE SIGNS · CUREHHT.ORG', theme.secondary, theme.onSecondary, 20 * s);
  maybeRibbon(ctx, W, H, theme, options, s);
};

// ---------------------------------------------------------------------------
// 10. WORLD HHT DAY
// ---------------------------------------------------------------------------
const drawWorldDay = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const { headline = 'World HHT Day', body = '' } = data;

  paintBackground(ctx, W, H, theme);
  applyPattern(ctx, W, H, theme, options.pattern);
  drawSoftCircle(ctx, W / 2, H * 0.3, W * 0.34, hexToRgba(theme.primary, 0.14));

  drawEmoji(ctx, '🌍', W / 2 - 60 * s, H * 0.14, 120 * s);

  ctx.fillStyle = theme.text;
  ctx.font = `italic bold ${88 * s}px ${FONT_SERIF}`;
  ctx.textAlign = 'center';
  const hLines = wrapTextCentered(ctx, headline, W / 2, H * 0.4, 96 * s, W - M * 2);

  // Big date pill (centered).
  ctx.font = `bold ${34 * s}px ${FONT_SANS}`;
  const dateText = 'MAY 20';
  const dpW = ctx.measureText(dateText).width + 80 * s;
  drawPill(ctx, W / 2 - dpW / 2, H * 0.4 + hLines * 96 * s + 30 * s, dateText, theme.primary, theme.onPrimary, 34 * s);

  ctx.fillStyle = theme.textSoft;
  ctx.font = `400 ${32 * s}px ${FONT_SANS}`;
  wrapTextCentered(ctx, body, W / 2, H * 0.4 + hLines * 96 * s + 140 * s, 46 * s, W - M * 2.2);
  ctx.textAlign = 'left';

  drawFooter(ctx, W, H, 'curehht.org  ·  #WorldHHTDay', theme.muted, 24 * s);
};

// ---------------------------------------------------------------------------
// 11. SUPPORT / DONATE
// ---------------------------------------------------------------------------
const drawSupport = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const { headline = 'Help us cure HHT', body = '', cta = 'DONATE AT CUREHHT.ORG' } = data;

  paintBackground(ctx, W, H, theme);
  applyPattern(ctx, W, H, theme, options.pattern);
  maybeRibbon(ctx, W, H, theme, options, s);

  drawEmoji(ctx, '🤝', M, H * 0.11, 88 * s);

  ctx.fillStyle = theme.text;
  ctx.font = `italic bold ${68 * s}px ${FONT_SERIF}`;
  const hLines = wrapText(ctx, headline, M, H * 0.24, 80 * s, W - M * 2);

  ctx.fillStyle = theme.textSoft;
  ctx.font = `400 ${34 * s}px ${FONT_SANS}`;
  wrapText(ctx, body, M, H * 0.24 + hLines * 80 * s + 30 * s, 50 * s, W - M * 2);

  // Prominent CTA button.
  const btnY = H * 0.82;
  ctx.font = `bold ${30 * s}px ${FONT_SANS}`;
  const btnW = ctx.measureText(cta.toUpperCase()).width + 90 * s;
  const btnH = 84 * s;
  ctx.fillStyle = theme.secondary;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(M, btnY, btnW, btnH, btnH / 2);
  ctx.fill();
  ctx.fillStyle = theme.onSecondary;
  ctx.textBaseline = 'middle';
  ctx.fillText(cta.toUpperCase(), M + 45 * s, btnY + btnH / 2);
  ctx.textBaseline = 'top';
};

// ---------------------------------------------------------------------------
// 12. NOSEBLEED MYTH-BUSTER
// ---------------------------------------------------------------------------
const drawMythBuster = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const { myth = '', fact = '' } = data;

  ctx.fillStyle = theme.dark ? theme.surface : theme.bgFrom;
  ctx.fillRect(0, 0, W, H);
  applyPattern(ctx, W, H, theme, options.pattern);

  drawPill(ctx, M, H * 0.08, '🩸 MYTH vs FACT', theme.primary, theme.onPrimary, 20 * s);

  // MYTH block.
  const mythTop = H * 0.2;
  ctx.fillStyle = theme.muted;
  ctx.font = `800 ${30 * s}px ${FONT_SANS}`;
  ctx.fillText('MYTH', M, mythTop);
  ctx.fillStyle = theme.textSoft;
  ctx.font = `italic ${40 * s}px ${FONT_SERIF}`;
  const mLines = wrapText(ctx, myth, M, mythTop + 46 * s, 54 * s, W - M * 2);

  // Divider.
  const divY = mythTop + 46 * s + mLines * 54 * s + 44 * s;
  ctx.strokeStyle = hexToRgba(theme.primary, 0.4);
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(M, divY);
  ctx.lineTo(W - M, divY);
  ctx.stroke();

  // FACT block (highlighted).
  const factTop = divY + 44 * s;
  ctx.fillStyle = theme.primary;
  ctx.font = `800 ${30 * s}px ${FONT_SANS}`;
  ctx.fillText('FACT', M, factTop);
  ctx.fillStyle = theme.text;
  ctx.font = `600 ${42 * s}px ${FONT_SANS}`;
  wrapText(ctx, fact, M, factTop + 46 * s, 58 * s, W - M * 2);

  drawFooter(ctx, W, H, 'curehht.org  ·  #MythBuster', theme.muted, 24 * s);
  maybeRibbon(ctx, W, H, theme, options, s);
};

// ---------------------------------------------------------------------------
// 13. FAMILY & GENETIC TESTING
// ---------------------------------------------------------------------------
const drawFamily = (ctx, data, theme, W, H, options) => {
  const s = W / 1080;
  const M = 100 * s;
  const { headline = 'HHT runs in families', body = '' } = data;

  paintBackground(ctx, W, H, theme);
  applyPattern(ctx, W, H, theme, options.pattern);

  drawEmoji(ctx, '🧬', M, H * 0.1, 96 * s);
  drawPill(ctx, M + 140 * s, H * 0.12, 'GENETIC · AUTOSOMAL DOMINANT', theme.secondary, theme.onSecondary, 18 * s);

  ctx.fillStyle = theme.text;
  ctx.font = `italic bold ${66 * s}px ${FONT_SERIF}`;
  const hLines = wrapText(ctx, headline, M, H * 0.26, 78 * s, W - M * 2);

  ctx.fillStyle = theme.textSoft;
  ctx.font = `400 ${34 * s}px ${FONT_SANS}`;
  wrapText(ctx, body, M, H * 0.26 + hLines * 78 * s + 30 * s, 50 * s, W - M * 2);

  // 50% inheritance visual: two figures, one highlighted.
  const gy = H * 0.74;
  const gap = 120 * s;
  const startX = W / 2 - gap / 2;
  for (let i = 0; i < 2; i++) {
    const cx = startX + i * gap;
    const highlighted = i === 0;
    ctx.fillStyle = highlighted ? theme.primary : hexToRgba(theme.text, 0.25);
    drawSoftCircle(ctx, cx, gy, 26 * s, ctx.fillStyle);
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(cx - 26 * s, gy + 30 * s, 52 * s, 60 * s, 20 * s);
    ctx.fill();
  }
  ctx.fillStyle = theme.text;
  ctx.font = `800 ${30 * s}px ${FONT_SANS}`;
  ctx.textAlign = 'center';
  ctx.fillText('50% inherit HHT', W / 2, gy + 120 * s);
  ctx.textAlign = 'left';

  drawFooter(ctx, W, H, 'curehht.org  ·  #GeneticTesting', theme.muted, 24 * s);
  maybeRibbon(ctx, W, H, theme, options, s);
};

export const DRAWERS = {
  awareness: drawAwareness,
  fact: drawFact,
  story: drawStory,
  boldstat: drawBoldStat,
  minimal: drawMinimal,
  wave: drawWave,
  ribbon: drawRibbonSpotlight,
  quote: drawQuote,
  didyouknow: drawDidYouKnow,
  worldday: drawWorldDay,
  support: drawSupport,
  mythbuster: drawMythBuster,
  family: drawFamily,
};

export const drawPoster = (ctx, type, data, theme, W, H, options) => {
  const fn = DRAWERS[type] || drawAwareness;
  fn(ctx, data || {}, theme, W, H, options || {});
};

export default DRAWERS;
