import { describe, it, expect, beforeEach } from 'vitest';
import { emojis, settings, addEmoji, removeEmoji, reorderEmojis, clearAll, emojiCount } from './stores.js';

describe('emojiStore', () => {
  beforeEach(() => {
    clearAll();
    settings.set({ color: '#FF5E5B', animation: 'pulse', size: 120 });
  });

  describe('addEmoji', () => {
    it('should add an emoji to the store', () => {
      addEmoji('😀');
      let items;
      emojis.subscribe(v => items = v)();
      expect(items.length).toBe(1);
      expect(items[0].char).toBe('😀');
    });

    it('should use current settings for new emoji', () => {
      settings.set({ color: '#0000FF', animation: 'rotate', size: 200 });
      addEmoji('🎉');
      let items;
      emojis.subscribe(v => items = v)();
      expect(items[0].color).toBe('#0000FF');
      expect(items[0].animation).toBe('rotate');
      expect(items[0].size).toBe(200);
    });

    it('should assign unique ids', () => {
      addEmoji('😀');
      addEmoji('😎');
      let items;
      emojis.subscribe(v => items = v)();
      expect(items[0].id).not.toBe(items[1].id);
    });
  });

  describe('removeEmoji', () => {
    it('should remove the correct emoji by id', () => {
      addEmoji('😀');
      addEmoji('😎');
      let items;
      emojis.subscribe(v => items = v)();
      const firstId = items[0].id;
      removeEmoji(firstId);
      emojis.subscribe(v => items = v)();
      expect(items.length).toBe(1);
      expect(items[0].char).toBe('😎');
    });
  });

  describe('reorderEmojis', () => {
    it('should move an emoji from one index to another', () => {
      addEmoji('😀');
      addEmoji('😎');
      addEmoji('🎉');
      reorderEmojis(0, 2);
      let items;
      emojis.subscribe(v => items = v)();
      expect(items[0].char).toBe('😎');
      expect(items[1].char).toBe('🎉');
      expect(items[2].char).toBe('😀');
    });
  });

  describe('clearAll', () => {
    it('should remove all emojis', () => {
      addEmoji('😀');
      addEmoji('😎');
      clearAll();
      let items;
      emojis.subscribe(v => items = v)();
      expect(items.length).toBe(0);
    });
  });

  describe('emojiCount', () => {
    it('should reflect the number of emojis', () => {
      let count;
      emojiCount.subscribe(v => count = v)();
      expect(count).toBe(0);

      addEmoji('😀');
      emojiCount.subscribe(v => count = v)();
      expect(count).toBe(1);
    });
  });
});
