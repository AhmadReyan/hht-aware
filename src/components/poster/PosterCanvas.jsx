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
      {/* Soft warm halo behind the hero canvas — purely decorative. */}
      <div
        aria-hidden
        className="absolute -inset-2 rounded-custom-lg bg-rose opacity-60 blur-2xl pointer-events-none"
      />

      <motion.div
        animate={{ scale: rendering ? 0.985 : 1 }}
        transition={spring.soft}
        className="relative w-full rounded-custom-lg overflow-hidden bg-app-surface2 shadow-raised border border-line flex items-center justify-center"
        style={{ aspectRatio }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ display: 'none' }}
        />

        {rendering && (
          <div className="absolute inset-0 z-10 flex flex-col gap-2 items-center justify-center bg-app-surface2/80 text-app-ink backdrop-blur-sm">
            <Loader2 className="animate-spin text-garnet" size={30} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">Rendering poster…</span>
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
