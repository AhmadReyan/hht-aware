import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

export const PosterCanvas = ({ type, data, onRendered }) => {
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    let active = true;
    setRendering(true);

    const renderPoster = async () => {
      // 1. Wait for Google Fonts to be fully loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear Canvas (1080 x 1080 px)
      ctx.clearRect(0, 0, 1080, 1080);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      if (type === 'awareness') {
        drawAwarenessDay(ctx, data);
      } else if (type === 'fact') {
        drawFactPoster(ctx, data);
      } else if (type === 'story') {
        drawStoryPoster(ctx, data);
      }

      // Convert to blob and trigger callback for download/share
      canvas.toBlob((blob) => {
        if (!active || !blob) return;
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
        onRendered(blob, url);
        setRendering(false);
      }, 'image/png');
    };

    // Debounce canvas drawing (150ms) to ensure smooth input typing
    const timer = setTimeout(() => {
      renderPoster();
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [type, data, onRendered]);

  // Canvas Drawing Functions

  const drawAwarenessDay = (ctx, data) => {
    const { headline = 'HHT is Real. HHT is Rare.', body = 'Hereditary Hemorrhagic Telangiectasia affects 1 in 5,000 people. Awareness saves lives.' } = data;

    // Linear Background: #8B1A0E -> #3D0905
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#8B1A0E');
    gradient.addColorStop(1, '#3D0905');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Draw background concentric circles for pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(540, 540, 200, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(540, 540, 350, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(540, 540, 500, 0, Math.PI * 2);
    ctx.stroke();

    // Floating Ribbon Emoji Top Right
    ctx.font = '64px sans-serif';
    ctx.fillText('🎗️', 900, 100);

    // Tag Pill: INTERNATIONAL HHT AWARENESS DAY
    drawPill(ctx, 100, 100, 'INTERNATIONAL HHT AWARENESS DAY', '#E74C3C', '#FFFFFF');

    // Headline (Italic Serif)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic bold 64px "DM Serif Display", Georgia, serif';
    wrapText(ctx, headline, 100, 240, 76, 880);

    // Supporting Body Text (Sans)
    ctx.fillStyle = '#E5E5EA';
    ctx.font = '400 32px "DM Sans", system-ui, sans-serif';
    wrapText(ctx, body, 100, 540, 48, 880);

    // Orange Pill at bottom: May 20 · #HHTAwareness
    drawPill(ctx, 100, 840, 'May 20  ·  #HHTAwareness', '#D35400', '#FFFFFF');

    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '700 24px "DM Sans", system-ui, sans-serif';
    ctx.fillText('CUREHHT.ORG', 100, 940);
  };

  const drawFactPoster = (ctx, data) => {
    const { stat = '1 in 5,000', body = 'people have HHT worldwide. Most cases remain undiagnosed due to low clinical awareness.' } = data;

    // Background: #1C1C1E
    ctx.fillStyle = '#1C1C1E';
    ctx.fillRect(0, 0, 1080, 1080);

    // Coral Accent Circle Top Right
    ctx.fillStyle = 'rgba(224, 57, 43, 0.08)';
    ctx.beginPath();
    ctx.arc(950, 150, 300, 0, Math.PI * 2);
    ctx.fill();

    // Tag: 📊 HHT FACT
    drawPill(ctx, 100, 100, '📊 HHT FACT', '#D35400', '#FFFFFF');

    // Massive Serif Stat Number
    ctx.fillStyle = '#F8B0A0';
    ctx.font = 'italic bold 135px "DM Serif Display", Georgia, serif';
    ctx.fillText(stat, 100, 200);

    // Full Description Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '400 38px "DM Sans", system-ui, sans-serif';
    wrapText(ctx, body, 100, 400, 58, 880);

    // Footer Hashtags
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '700 24px "DM Sans", system-ui, sans-serif';
    ctx.fillText('#HHT  ·  #HHTAwareness  ·  curehht.org', 100, 920);
  };

  const drawStoryPoster = (ctx, data) => {
    const { quote = 'Sharing my story makes an invisible vascular disease visible. We deserve clinical awareness.', name = 'Anonymous', role = 'Patient' } = data;

    // Background: Warm Parchment Cream
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#FEF9EF');
    gradient.addColorStop(1, '#FDEBD0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Massive Quotation Mark
    ctx.fillStyle = 'rgba(211, 84, 0, 0.06)';
    ctx.font = 'italic bold 550px "DM Serif Display", Georgia, serif';
    ctx.fillText('“', 50, 40);

    // Tag Pill: MY STORY (top-right area)
    drawPill(ctx, 840, 100, 'MY STORY', '#C0392B', '#FFFFFF');

    // Quote Text (Italic Serif)
    ctx.fillStyle = '#1C1C1E';
    ctx.font = 'italic 44px "DM Serif Display", Georgia, serif';
    wrapText(ctx, `"${quote}"`, 120, 220, 62, 840);

    // Generate Initials Avatar
    const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'H';
    ctx.fillStyle = '#C0392B';
    ctx.beginPath();
    ctx.arc(170, 750, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 34px "DM Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 170, 750);

    // Restore text align/baseline
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Author details
    ctx.fillStyle = '#2C2C2E';
    ctx.font = 'bold 36px "DM Sans", system-ui, sans-serif';
    ctx.fillText(name, 250, 715);

    ctx.fillStyle = '#8E8E93';
    ctx.font = '500 26px "DM Sans", system-ui, sans-serif';
    ctx.fillText(role, 250, 765);

    // Hashtag
    ctx.fillStyle = '#D35400';
    ctx.font = '700 24px "DM Sans", system-ui, sans-serif';
    ctx.fillText('#HHTAwareness  ·  curehht.org', 120, 880);
  };

  // Helper Canvas Drawing Utilities

  const drawPill = (ctx, x, y, text, bgColor, textColor) => {
    ctx.font = 'bold 20px "DM Sans", system-ui, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const paddingX = 22;
    const paddingY = 10;
    const pillW = textWidth + paddingX * 2;
    const pillH = 20 + paddingY * 2;
    const r = pillH / 2;

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, pillW, pillH, r) : customRoundRect(ctx, x, y, pillW, pillH, r);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.fillText(text, x + paddingX, y + paddingY);
  };

  const customRoundRect = (ctx, x, y, width, height, radius) => {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const wrapText = (ctx, text, x, y, lineHeight, maxWidth) => {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i].trim(), x, y + i * lineHeight);
    }
    return lines.length;
  };

  return (
    <div className="relative w-full aspect-square border border-app-border/10 rounded-custom overflow-hidden bg-app-dark shadow-poster flex items-center justify-center">
      {/* Hidden high-res canvas */}
      <canvas
        ref={canvasRef}
        width={1080}
        height={1080}
        style={{ display: 'none' }}
      />
      
      {/* Loading overlay */}
      {rendering && (
        <div className="absolute inset-0 z-10 flex flex-col gap-2 items-center justify-center bg-app-dark/80 text-white">
          <Loader2 className="animate-spin text-brand-red-mid" size={32} />
          <span className="text-xs font-semibold uppercase tracking-wider text-app-muted">Rendering Poster...</span>
        </div>
      )}

      {/* Rendered Preview Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Generated HHT Awareness Poster"
          className="w-full h-full object-contain aspect-square select-none cursor-pointer"
        />
      )}
    </div>
  );
};
export default PosterCanvas;
