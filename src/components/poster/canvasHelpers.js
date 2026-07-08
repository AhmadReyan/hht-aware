// Shared canvas drawing utilities for the Poster Studio.
// Every helper is resolution-independent — callers pass already-scaled
// values (derived from the active W/H of the poster) so templates can be
// rendered at Square (1080x1080), Portrait (1080x1350) or Story (1080x1920).

export const FONT_SERIF = '"DM Serif Display", Georgia, serif';
export const FONT_SANS = '"DM Sans", system-ui, sans-serif';

// roundRect with a manual fallback for older WebViews that lack the native API.
export const roundRectPath = (ctx, x, y, width, height, radius) => {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export const hexToRgba = (hex, alpha = 1) => {
  let c = String(hex).replace('#', '');
  if (c.length === 3) c = c.split('').map((ch) => ch + ch).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Draws left-aligned wrapped text and returns the number of lines used
// (handy for vertically stacking whatever comes after it).
export const wrapText = (ctx, text, x, y, lineHeight, maxWidth) => {
  const words = String(text ?? '').split(' ');
  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = `${line}${words[n]} `;
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = `${words[n]} `;
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
  return lines.length;
};

// Same wrapping logic as wrapText but centered horizontally around cx.
export const wrapTextCentered = (ctx, text, cx, y, lineHeight, maxWidth) => {
  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'center';
  const lines = wrapText(ctx, text, cx, y, lineHeight, maxWidth);
  ctx.textAlign = prevAlign;
  return lines;
};

// Predicts how many lines wrapText would use, without drawing anything —
// used to vertically balance layouts before committing to a Y position.
export const countWrappedLines = (ctx, text, maxWidth) => {
  const words = String(text ?? '').split(' ');
  let line = '';
  let count = 0;
  for (let n = 0; n < words.length; n++) {
    const testLine = `${line}${words[n]} `;
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      count += 1;
      line = `${words[n]} `;
    } else {
      line = testLine;
    }
  }
  return count + 1;
};

// Rounded pill/tag with auto-sized width based on measured text.
export const drawPill = (ctx, x, y, text, bgColor, textColor, fontPx = 20) => {
  ctx.font = `bold ${fontPx}px ${FONT_SANS}`;
  const textWidth = ctx.measureText(text).width;
  const paddingX = fontPx * 1.05;
  const paddingY = fontPx * 0.5;
  const pillW = textWidth + paddingX * 2;
  const pillH = fontPx + paddingY * 2;
  const r = pillH / 2;

  ctx.fillStyle = bgColor;
  ctx.beginPath();
  roundRectPath(ctx, x, y, pillW, pillH, r);
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.fillText(text, x + paddingX, y + paddingY);
  return { width: pillW, height: pillH };
};

export const drawSoftCircle = (ctx, cx, cy, r, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
};

export const drawConcentricRings = (ctx, cx, cy, radii, color, lineWidth = 1.5) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  radii.forEach((r) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });
};

export const drawDotGrid = (ctx, W, H, color, spacing = 60, dotRadius = 2) => {
  ctx.fillStyle = color;
  for (let yy = spacing / 2; yy < H; yy += spacing) {
    for (let xx = spacing / 2; xx < W; xx += spacing) {
      ctx.beginPath();
      ctx.arc(xx, yy, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export const drawDiagonalLines = (ctx, W, H, color, spacing = 46) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  const diag = W + H;
  for (let i = -H; i < diag; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }
};

// Applies the theme's signature background texture (rings / dots / lines)
// only when the user has the "pattern" accent toggle switched on.
export const applyPattern = (ctx, W, H, theme, enabled) => {
  if (!enabled) return;
  const style = theme.pattern || 'rings';
  const color = theme.lineSoft;
  if (style === 'dots') {
    drawDotGrid(ctx, W, H, color, W * 0.055, W * 0.0022 + 1);
  } else if (style === 'lines') {
    drawDiagonalLines(ctx, W, H, color, W * 0.043);
  } else {
    drawConcentricRings(ctx, W / 2, H * 0.42, [W * 0.185, W * 0.324, W * 0.463], color, 1.5);
  }
};

// Vector HHT ribbon (drawn with paths, not an emoji glyph — always renders
// consistently regardless of platform emoji font support).
export const drawRibbonShape = (ctx, cx, cy, size, color) => {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(-size * 0.16, -size * 0.02);
  ctx.lineTo(-size * 0.44, size * 0.64);
  ctx.lineTo(-size * 0.06, size * 0.5);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(size * 0.16, -size * 0.02);
  ctx.lineTo(size * 0.44, size * 0.64);
  ctx.lineTo(size * 0.06, size * 0.5);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, -size * 0.32, size * 0.36, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(0, -size * 0.32, size * 0.17, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
};

export const drawAccentShape = (ctx, shape, cx, cy, size, color) => {
  switch (shape) {
    case 'ribbon':
      drawRibbonShape(ctx, cx, cy, size, color);
      break;
    case 'triangle':
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - size * 0.55);
      ctx.lineTo(cx + size * 0.5, cy + size * 0.35);
      ctx.lineTo(cx - size * 0.5, cy + size * 0.35);
      ctx.closePath();
      ctx.fill();
      break;
    case 'diamond':
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - size * 0.5);
      ctx.lineTo(cx + size * 0.5, cy);
      ctx.lineTo(cx, cy + size * 0.5);
      ctx.lineTo(cx - size * 0.5, cy);
      ctx.closePath();
      ctx.fill();
      break;
    default:
      drawSoftCircle(ctx, cx, cy, size * 0.5, color);
  }
};

// Smooth filled wave band anchored to the bottom edge of the canvas.
export const drawWaveBand = (ctx, W, H, baseY, amplitude, color, phase = 0) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, baseY);
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const y = baseY + Math.sin(phase + (i / steps) * Math.PI * 2.4) * amplitude;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
};

export const drawFooter = (ctx, W, H, text, color, fontPx = 24) => {
  ctx.fillStyle = color;
  ctx.font = `700 ${fontPx}px ${FONT_SANS}`;
  ctx.fillText(text, W * 0.0926, H - H * 0.045 - fontPx);
};

export const drawEmoji = (ctx, emoji, x, y, sizePx) => {
  ctx.font = `${sizePx}px sans-serif`;
  ctx.fillText(emoji, x, y);
};
