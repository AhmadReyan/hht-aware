import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { spring } from '../../lib/motion';

/**
 * MiniChart — hand-rolled, dependency-free inline-SVG charts for the health
 * tracker (nosebleed-minutes bars, hemoglobin trend line, quick sparklines).
 *
 * All charts are responsive (SVG `viewBox` + `width: 100%`), animated with
 * framer-motion, theme-token colored, and accessible (`<title>`/`<desc>` +
 * role="img"). They render fully offline and never depend on real fonts.
 *
 * Design tokens: garnet #8E2D3B, teal #15756C, gold #D9A13B.
 */

const GARNET = '#8E2D3B';
const TEAL = '#15756C';
const GOLD = '#D9A13B';
const MUTED = '#7A5F63';
const LINE = '#E9DAD4';

const toNumbers = (data, values) => {
  const src = Array.isArray(values) ? values : Array.isArray(data) ? data : [];
  return src.map((d) => {
    if (typeof d === 'number') return d;
    if (d && typeof d === 'object') return Number(d.value ?? d.y ?? d.count ?? 0) || 0;
    return Number(d) || 0;
  });
};

const toLabels = (data) =>
  (Array.isArray(data) ? data : []).map((d) => {
    if (d && typeof d === 'object') return d.label ?? d.date ?? '';
    return '';
  });

/**
 * BarChart — vertical bars. Good for per-day nosebleed minutes/counts.
 * Props: { data?, values?, color?, height?, width?, maxValue?, title?, desc?,
 *          showLabels?, formatValue? }
 */
export const BarChart = ({
  data,
  values,
  color = GARNET,
  height = 120,
  width = 320,
  maxValue,
  title = 'Bar chart',
  desc = '',
  showLabels = false,
  className = ''
}) => {
  const uid = useId();
  const nums = toNumbers(data, values);
  const labels = toLabels(data);
  const n = nums.length;
  const max = Math.max(1, maxValue ?? Math.max(0, ...nums));
  const pad = 6;
  const labelH = showLabels ? 16 : 0;
  const chartH = height - labelH;
  const gap = n > 1 ? Math.min(10, (width - pad * 2) / n / 4) : 0;
  const barW = n > 0 ? (width - pad * 2 - gap * (n - 1)) / n : 0;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      preserveAspectRatio="none"
      role="img"
      aria-labelledby={`${uid}-t ${uid}-d`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <title id={`${uid}-t`}>{title}</title>
      <desc id={`${uid}-d`}>{desc || `${n} bars, max ${max}`}</desc>
      {nums.map((v, i) => {
        const h = Math.max(v > 0 ? 3 : 0, (v / max) * (chartH - 4));
        const x = pad + i * (barW + gap);
        const y = chartH - h;
        return (
          <g key={i}>
            <motion.rect
              x={x}
              width={barW}
              rx={Math.min(4, barW / 2)}
              initial={{ height: 0, y: chartH }}
              animate={{ height: h, y }}
              transition={{ ...spring.soft, delay: i * 0.03 }}
              fill={color}
              opacity={v > 0 ? 1 : 0.25}
            />
            {showLabels && (
              <text
                x={x + barW / 2}
                y={height - 4}
                textAnchor="middle"
                fontSize="9"
                fill={MUTED}
              >
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const buildPath = (nums, width, height, pad, max, min) => {
  const n = nums.length;
  const range = max - min || 1;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  return nums.map((v, i) => {
    const x = pad + (n > 1 ? (i / (n - 1)) * innerW : innerW / 2);
    const y = pad + innerH - ((v - min) / range) * innerH;
    return { x, y };
  });
};

/**
 * LineChart — smooth trend line with dots + soft area fill. Good for the
 * hemoglobin trend over time.
 * Props: { data?, values?, color?, height?, width?, min?, max?, title?, desc?,
 *          showDots?, showArea? }
 */
export const LineChart = ({
  data,
  values,
  color = TEAL,
  height = 120,
  width = 320,
  min: minProp,
  max: maxProp,
  title = 'Line chart',
  desc = '',
  showDots = true,
  showArea = true,
  className = ''
}) => {
  const uid = useId();
  const nums = toNumbers(data, values);
  const n = nums.length;
  const pad = 10;

  if (n === 0) {
    return (
      <svg className={className} viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={title}>
        <title>{title}</title>
        <line x1={pad} y1={height / 2} x2={width - pad} y2={height / 2} stroke={LINE} strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    );
  }

  const dataMax = Math.max(...nums);
  const dataMin = Math.min(...nums);
  const max = maxProp ?? (dataMax === dataMin ? dataMax + 1 : dataMax);
  const min = minProp ?? (dataMax === dataMin ? dataMin - 1 : dataMin);
  const pts = buildPath(nums, width, height, pad, max, min);
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath =
    `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${height - pad} L ${pts[0].x.toFixed(1)} ${height - pad} Z`;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-labelledby={`${uid}-t ${uid}-d`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <title id={`${uid}-t`}>{title}</title>
      <desc id={`${uid}-d`}>{desc || `Trend of ${n} points`}</desc>
      <defs>
        <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showArea && n > 1 && (
        <motion.path
          d={areaPath}
          fill={`url(#${uid}-fill)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      {showDots &&
        pts.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#FFFFFF"
            stroke={color}
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...spring.snappy, delay: 0.3 + i * 0.04 }}
          />
        ))}
    </svg>
  );
};

/**
 * Sparkline — tiny inline trend line, no axes/dots. For compact summaries.
 * Props: { data?, values?, color?, height?, width?, strokeWidth?, title? }
 */
export const Sparkline = ({
  data,
  values,
  color = GOLD,
  height = 32,
  width = 100,
  strokeWidth = 2,
  title = 'Sparkline',
  className = ''
}) => {
  const uid = useId();
  const nums = toNumbers(data, values);
  const n = nums.length;
  const pad = strokeWidth + 1;

  if (n < 2) {
    return (
      <svg className={className} viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label={title}>
        <title>{title}</title>
        <line x1={pad} y1={height / 2} x2={width - pad} y2={height / 2} stroke={LINE} strokeWidth={strokeWidth} />
      </svg>
    );
  }

  const max = Math.max(...nums);
  const min = Math.min(...nums);
  const pts = buildPath(nums, width, height, pad, max === min ? max + 1 : max, max === min ? min - 1 : min);
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      preserveAspectRatio="none"
      role="img"
      aria-labelledby={`${uid}-t`}
      style={{ display: 'block' }}
    >
      <title id={`${uid}-t`}>{title}</title>
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </svg>
  );
};

export default { BarChart, LineChart, Sparkline };
