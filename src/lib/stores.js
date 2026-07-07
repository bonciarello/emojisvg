import { writable, derived } from 'svelte/store';

/**
 * @typedef {Object} EmojiItem
 * @property {string} id - Unique ID
 * @property {string} char - Emoji character
 * @property {string} color - Hex color
 * @property {'pulse'|'rotate'|'bounce'} animation - Animation type
 * @property {number} size - SVG size in px
 */

/** @type {import('svelte/store').Writable<EmojiItem[]>} */
export const emojis = writable([]);

/** Current global settings applied to new emojis */
export const settings = writable({
  color: '#FF5E5B',
  animation: 'pulse',
  size: 120
});

let nextId = 0;

/** Add an emoji with current settings */
export function addEmoji(char) {
  const id = `emoji-${++nextId}-${Date.now()}`;
  emojis.update(items => {
    let s;
    settings.subscribe(v => s = v)();
    return [...items, { id, char, color: s.color, animation: s.animation, size: s.size }];
  });
}

/** Remove an emoji by id */
export function removeEmoji(id) {
  emojis.update(items => items.filter(i => i.id !== id));
}

/** Update all emojis with new global settings */
export function applySettingsToAll(newSettings) {
  emojis.update(items => items.map(i => ({
    ...i,
    color: newSettings.color,
    animation: newSettings.animation,
    size: newSettings.size
  })));
}

/** Update a single emoji's properties */
export function updateEmoji(id, patch) {
  emojis.update(items => items.map(i => i.id === id ? { ...i, ...patch } : i));
}

/** Reorder emojis: move from index `from` to index `to` */
export function reorderEmojis(from, to) {
  emojis.update(items => {
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
  });
}

/** Clear all emojis */
export function clearAll() {
  emojis.update(() => []);
}

/** Derived: count of emojis */
export const emojiCount = derived(emojis, $emojis => $emojis.length);
