// Output sizes for the Poster Studio. Width is always 1080 so text-wrap widths
// stay consistent; only the height (and therefore vertical rhythm) changes.
// Draw functions position everything relative to W/H, never hard-coded pixels.

export const FORMATS = [
  {
    id: 'square',
    label: 'Square',
    sub: '1080 × 1080',
    hint: 'Instagram post',
    width: 1080,
    height: 1080,
    icon: 'square',
  },
  {
    id: 'portrait',
    label: 'Portrait',
    sub: '1080 × 1350',
    hint: 'Feed portrait',
    width: 1080,
    height: 1350,
    icon: 'rectangle',
  },
  {
    id: 'story',
    label: 'Story',
    sub: '1080 × 1920',
    hint: 'Reels / Stories',
    width: 1080,
    height: 1920,
    icon: 'phone',
  },
];

export const getFormat = (id) => FORMATS.find((f) => f.id === id) || FORMATS[0];

export default FORMATS;
