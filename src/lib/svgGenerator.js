/**
 * Generate an animated SVG string for a single emoji.
 *
 * @param {Object} opts
 * @param {string} opts.char - Emoji character
 * @param {string} opts.color - Hex color (e.g. '#FF5E5B')
 * @param {'pulse'|'rotate'|'bounce'} opts.animation - Animation type
 * @param {number} opts.size - SVG viewport size in px
 * @returns {string} SVG markup
 */

const KEYFRAMES = {
  pulse: `
    @keyframes anim-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.25); }
    }`,
  rotate: `
    @keyframes anim-rotate {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }`,
  bounce: `
    @keyframes anim-bounce {
      0%, 100% { transform: translateY(0); }
      30%      { transform: translateY(-18%); }
      50%      { transform: translateY(0); }
      70%      { transform: translateY(-8%); }
      85%      { transform: translateY(0); }
    }`
};

const ANIM_NAMES = {
  pulse:  'anim-pulse',
  rotate: 'anim-rotate',
  bounce: 'anim-bounce'
};

const DURATIONS = {
  pulse:  '1.4s',
  rotate: '2.5s',
  bounce: '1.2s'
};

const EASING = {
  pulse:  'ease-in-out',
  rotate: 'linear',
  bounce: 'ease'
};

export function generateSVG({ char, color, animation, size }) {
  const kf = KEYFRAMES[animation] || KEYFRAMES.pulse;
  const name = ANIM_NAMES[animation] || 'anim-pulse';
  const dur = DURATIONS[animation] || '1.4s';
  const eas = EASING[animation] || 'ease-in-out';

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const fontSize = size * 0.52;
  const textY = cy + fontSize * 0.32;

  const escapedChar = char
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <filter id="glow-${name}">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${(size * 0.03).toFixed(1)}" />
    </filter>
  </defs>
  <style>
    @media (prefers-reduced-motion: no-preference) {
      ${kf}
      .anim {
        animation: ${name} ${dur} ${eas} infinite;
        transform-origin: ${cx}px ${cy}px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .anim { animation: none; }
    }
  </style>
  <!-- background glow circle -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.12" class="anim" />
  <!-- subtle ring -->
  <circle cx="${cx}" cy="${cy}" r="${r + size * 0.04}" fill="none" stroke="${color}" stroke-width="${(size * 0.025).toFixed(1)}" opacity="0.25" class="anim" />
  <!-- emoji text -->
  <text x="${cx}" y="${textY}" text-anchor="middle" font-size="${fontSize}" font-family="system-ui, sans-serif" class="anim" filter="url(#glow-${name})">${escapedChar}</text>
</svg>`;
}

/**
 * Generate a single combined SVG containing all emojis in a row.
 * @param {Array<{char:string, color:string, animation:string, size:number}>} items
 * @returns {string} SVG markup
 */
export function generateCombinedSVG(items) {
  if (items.length === 0) return '';

  const gap = 16;
  const itemSize = items[0]?.size || 120;
  const totalW = items.length * itemSize + (items.length - 1) * gap;
  const totalH = itemSize;

  let defs = '';
  let styles = '';
  let elements = '';

  items.forEach((item, i) => {
    const x = i * (itemSize + gap);
    const kf = KEYFRAMES[item.animation] || KEYFRAMES.pulse;
    const name = ANIM_NAMES[item.animation] + '-' + i;
    const dur = DURATIONS[item.animation] || '1.4s';
    const eas = EASING[item.animation] || 'ease-in-out';
    const cx = x + itemSize / 2;
    const cy = itemSize / 2;
    const r = itemSize * 0.38;
    const fontSize = itemSize * 0.52;
    const textY = cy + fontSize * 0.32;

    const uniqueKf = kf.replace(/anim-/g, 'anim-' + i + '-');
    styles += `
      @keyframes anim-${i}-${ANIM_NAMES[item.animation]} {
        ${uniqueKf.split('{')[1]?.split('}')[0] || ''}
      }
      .anim-${i} {
        animation: anim-${i}-${name} ${dur} ${eas} infinite;
        transform-origin: ${cx}px ${cy}px;
      }`;

    defs += `
    <filter id="glow-${i}">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${(itemSize * 0.03).toFixed(1)}" />
    </filter>`;

    const escapedChar = item.char
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    elements += `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${item.color}" opacity="0.12" class="anim-${i}" />
  <circle cx="${cx}" cy="${cy}" r="${r + itemSize * 0.04}" fill="none" stroke="${item.color}" stroke-width="${(itemSize * 0.025).toFixed(1)}" opacity="0.25" class="anim-${i}" />
  <text x="${cx}" y="${textY}" text-anchor="middle" font-size="${fontSize}" font-family="system-ui, sans-serif" class="anim-${i}" filter="url(#glow-${i})">${escapedChar}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <defs>${defs}
  </defs>
  <style>
    @media (prefers-reduced-motion: no-preference) {${styles}
    }
    @media (prefers-reduced-motion: reduce) {
      .anim-${items.map((_, i) => i).join(', .anim-')} { animation: none; }
    }
  </style>${elements}
</svg>`;
}
