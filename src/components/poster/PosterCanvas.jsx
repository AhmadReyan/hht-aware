import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { drawPoster } from './posterDrawers';
import { getTheme } from './posterThemes';
import { getFormat } from './posterFormats';
import { spring } from '../../lib/motion';

export const PosterCanvas = ({ type, data, theme, format, options, onRendered }) => {
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [rendering, setRendering] = useState(false);

  const resolvedTheme = getTheme(theme);
  const resolvedFormat = getFormat(format);
  const W = resolvedFormat.width;
  const H = resolvedFormat.height;

  // Serialize option flags so the effect re-runs on any accent change without
  // needing the parent to memoize the object identity.
  const optionKey = JSON.stringify(options || {});

  useEffect(() => {
    let active = true;
    setRendering(true);

    const renderPoster = async () => {
      // Wait for the DM Serif / DM Sans web fonts before painting text.
      if (document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // Font loading API unavailable — proceed with fallbacks.
        }
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      drawPoster(ctx, type, data, resolvedTheme, W, H, options || {});

      canvas.toBlob((blob) => {
        if (!active || !blob) return;
        const url = URL.createObjectURL(blob);
        setImageSrc((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        if (onRendered) onRendered(blob, url);
        setRendering(false);
      }, 'image/png');
    };

    // Debounce so rapid typing doesn't thrash the canvas.
    const timer = setTimeout(renderPoster, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, data, theme, format, optionKey, onRendered]);

  const aspectRatio = `${W} / ${H}`;

  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      {/* Ambient aurora glow behind the hero canvas — purely decorative, reacts to nothing itself. */}
      <div
        aria-hidden
        className="absolute -inset-3 rounded-custom-xl bg-aurora opacity-80 blur-2xl pointer-events-none"
      />

      <motion.div
        animate={{ scale: rendering ? 0.985 : 1 }}
        transition={spring.soft}
        className="relative w-full rounded-custom-xl overflow-hidden bg-app-dark shadow-raised shadow-glow border border-app-glass flex items-center justify-center"
        style={{ aspectRatio }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ display: 'none' }}
        />

        {rendering && (
          <div className="absolute inset-0 z-10 flex flex-col gap-2 items-center justify-center bg-app-dark/80 text-white backdrop-blur-sm">
            <Loader2 className="animate-spin text-brand-red-mid" size={32} />
            <span className="text-xs font-semibold uppercase tracking-wider text-app-muted">Rendering Poster…</span>
          </div>
        )}

        {imageSrc && (
          <motion.img
            key={imageSrc}
            initial={{ scale: 0.96, opacity: 0.65 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={spring.snappy}
            src={imageSrc}
            alt="Generated HHT Awareness Poster"
            className="w-full h-full object-contain select-none"
          />
        )}
      </motion.div>
    </div>
  );
};
export default PosterCanvas;
