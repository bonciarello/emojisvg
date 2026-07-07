import { generateSVG, generateCombinedSVG } from './svgGenerator.js';

/**
 * Trigger a file download in the browser.
 * @param {Blob} blob
 * @param {string} filename
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Download a single SVG file.
 * @param {Object} item - { char, color, animation, size }
 */
export function downloadSingleSVG(item) {
  const svg = generateSVG(item);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const name = `emoji-${item.char}-${item.animation}.svg`;
  triggerDownload(blob, name);
}

/**
 * Download all emojis as individual SVGs in a ZIP archive.
 * @param {Array<{char:string, color:string, animation:string, size:number}>} items
 */
export async function downloadZip(items) {
  if (items.length === 0) return;
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  items.forEach((item, i) => {
    const svg = generateSVG(item);
    const name = `emoji-${i + 1}-${item.char}-${item.animation}.svg`;
    zip.file(name, svg);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, 'emojify-studio-svgs.zip');
}

/**
 * Download a single combined SVG with all emojis.
 * @param {Array<{char:string, color:string, animation:string, size:number}>} items
 */
export function downloadCombinedSVG(items) {
  if (items.length === 0) return;
  const svg = generateCombinedSVG(items);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  triggerDownload(blob, 'emojify-combined.svg');
}
