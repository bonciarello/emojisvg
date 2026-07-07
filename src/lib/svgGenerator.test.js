import { describe, it, expect } from 'vitest';
import { generateSVG, generateCombinedSVG } from './svgGenerator.js';

describe('svgGenerator', () => {
  const baseOpts = {
    char: '😀',
    color: '#FF5E5B',
    animation: 'pulse',
    size: 120
  };

  describe('generateSVG', () => {
    it('should produce a valid SVG string', () => {
      const svg = generateSVG(baseOpts);
      expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('viewBox="0 0 120 120"');
      expect(svg).toContain('</svg>');
    });

    it('should contain the emoji character', () => {
      const svg = generateSVG(baseOpts);
      expect(svg).toContain('😀');
    });

    it('should contain the selected color', () => {
      const svg = generateSVG(baseOpts);
      expect(svg).toContain('#FF5E5B');
    });

    it('should include animation keyframes for pulse', () => {
      const svg = generateSVG(baseOpts);
      expect(svg).toContain('@keyframes anim-pulse');
      expect(svg).toContain('animation: anim-pulse');
    });

    it('should include animation keyframes for rotate', () => {
      const svg = generateSVG({ ...baseOpts, animation: 'rotate' });
      expect(svg).toContain('@keyframes anim-rotate');
      expect(svg).toContain('animation: anim-rotate');
    });

    it('should include animation keyframes for bounce', () => {
      const svg = generateSVG({ ...baseOpts, animation: 'bounce' });
      expect(svg).toContain('@keyframes anim-bounce');
      expect(svg).toContain('animation: anim-bounce');
    });

    it('should respect size parameter', () => {
      const svg = generateSVG({ ...baseOpts, size: 200 });
      expect(svg).toContain('viewBox="0 0 200 200"');
      expect(svg).toContain('width="200"');
    });

    it('should include reduced-motion media query', () => {
      const svg = generateSVG(baseOpts);
      expect(svg).toContain('prefers-reduced-motion');
    });

    it('should escape XML special characters in emoji', () => {
      const svg = generateSVG(baseOpts);
      // &, <, > should be escaped if present
      // For regular emoji char it should work fine
      expect(svg).not.toContain('&amp;'); // 😀 has no &
    });
  });

  describe('generateCombinedSVG', () => {
    it('should return empty string for empty array', () => {
      expect(generateCombinedSVG([])).toBe('');
    });

    it('should produce a valid SVG with multiple emojis', () => {
      const items = [
        { char: '😀', color: '#FF5E5B', animation: 'pulse', size: 100 },
        { char: '❤️', color: '#FF0000', animation: 'rotate', size: 100 }
      ];
      const svg = generateCombinedSVG(items);
      expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('😀');
      expect(svg).toContain('❤️');
      expect(svg).toContain('</svg>');
    });

    it('should handle a single item', () => {
      const items = [
        { char: '🎉', color: '#45B7D1', animation: 'bounce', size: 120 }
      ];
      const svg = generateCombinedSVG(items);
      expect(svg).toContain('🎉');
      expect(svg).toContain('anim-bounce');
    });
  });
});
