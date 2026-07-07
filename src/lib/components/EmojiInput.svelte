<script>
  import { addEmoji } from '../stores.js';

  let inputValue = '';
  let showPicker = false;
  let pickerRef;

  const EMOJI_CATEGORIES = [
    {
      label: 'Facce & Persone',
      emojis: ['😀','😃','😄','😁','😅','😂','🤣','😊','😇','🙂','😉','😍','🥰','😘','😎','🤩','🥳','😏','😒','😔','😢','😭','😤','😡','🤬','🥺','😴','🤔','🤗']
    },
    {
      label: 'Gesti & Mani',
      emojis: ['👍','👎','👏','🙌','🤝','✌️','🤞','👌','👆','👇','👈','👉','💪','🤲','🙏','✍️','🤳','🫶','🫰','🫱']
    },
    {
      label: 'Cuori & Simboli',
      emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💕','💖','💗','💝','🔥','⭐','✨','💫','🎉','🎊','💡','💎','🔔','🎵','🎶','🌈','☀️','🌙']
    },
    {
      label: 'Animali',
      emojis: ['🐶','🐱','🐼','🐨','🐸','🐵','🦊','🐰','🐹','🐭','🐻','🐷','🐮','🦁','🐯','🐔','🐧','🐦','🦄','🐙','🦋','🐞','🐝','🦀']
    },
    {
      label: 'Cibo & Bevande',
      emojis: ['🍎','🍕','🍔','🍟','🍩','🍪','🎂','🍰','🍫','🍭','🍿','☕','🍺','🍷','🍕','🌮','🍣','🍦','🧁','🥑','🍇','🍓','🍋','🥐']
    }
  ];

  function handleSubmit() {
    const char = inputValue.trim();
    if (!char) return;
    // Take the first emoji character(s) from input
    // Match emoji sequences (including modifiers, ZWJ, etc.)
    const emojiMatch = char.match(/\p{Emoji_Presentation}|\p{Emoji}\uFE0F|[\p{Emoji}\u200D]+/u);
    if (emojiMatch) {
      addEmoji(emojiMatch[0]);
      inputValue = '';
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  function pickEmoji(emoji) {
    addEmoji(emoji);
    showPicker = false;
  }

  function togglePicker() {
    showPicker = !showPicker;
  }

  function closePicker(e) {
    if (pickerRef && !pickerRef.contains(e.target)) {
      showPicker = false;
    }
  }
</script>

<svelte:window on:click={closePicker} />

<div class="emoji-input" bind:this={pickerRef}>
  <label for="emoji-text" class="label">Aggiungi un'emoji</label>
  <div class="input-row">
    <input
      id="emoji-text"
      type="text"
      placeholder="Digita o incolla un'emoji qui…"
      bind:value={inputValue}
      on:keydown={handleKeydown}
      maxlength="10"
      autocomplete="off"
    />
    <button class="btn btn-primary" on:click={handleSubmit} aria-label="Aggiungi emoji">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <span>Aggiungi</span>
    </button>
    <button class="btn btn-ghost" on:click={togglePicker} aria-label="Sfoglia emoji" aria-expanded={showPicker}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
    </button>
  </div>

  {#if showPicker}
    <div class="picker-dropdown" role="listbox" aria-label="Selettore emoji">
      {#each EMOJI_CATEGORIES as cat}
        <div class="picker-cat">
          <span class="picker-cat-label">{cat.label}</span>
          <div class="picker-grid">
            {#each cat.emojis as emoji}
              <button
                class="picker-emoji"
                on:click={() => pickEmoji(emoji)}
                aria-label={`Aggiungi emoji ${emoji}`}
                role="option"
                aria-selected="false"
              >{emoji}</button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .emoji-input {
    position: relative;
  }

  .label {
    display: block;
    font-family: var(--font-display);
    font-weight: 500;
    font-size: var(--text-sm);
    color: var(--color-text2);
    margin-bottom: var(--space-2);
  }

  .input-row {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }

  input {
    flex: 1;
    min-width: 0;
    height: 44px;
    padding: 0 var(--space-4);
    background: var(--color-surface);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    font-family: system-ui, sans-serif;
    font-size: 1.3rem;
    text-align: center;
    color: var(--color-text);
    transition: border-color 150ms ease;
    letter-spacing: 2px;
  }

  input:focus {
    border-color: var(--color-accent1);
    box-shadow: var(--shadow-glow);
    outline: none;
  }

  input::placeholder {
    font-size: var(--text-sm);
    letter-spacing: 0;
    color: var(--color-text3);
    font-family: var(--font-body);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    height: 44px;
    padding: 0 var(--space-4);
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background 150ms ease, transform 100ms ease;
    min-width: 44px;
  }

  .btn:active {
    transform: scale(0.97);
  }

  .btn-primary {
    background: var(--color-primary);
    color: #fff;
  }

  .btn-primary:hover {
    background: #e8504d;
  }

  .btn-ghost {
    background: var(--color-surface2);
    color: var(--color-text2);
    padding: 0;
    width: 44px;
    justify-content: center;
  }

  .btn-ghost:hover {
    background: var(--color-border);
    color: var(--color-text);
  }

  /* ── Picker dropdown ── */
  .picker-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: var(--space-2);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-float);
    padding: var(--space-4);
    z-index: 100;
    max-height: 50vh;
    overflow-y: auto;
  }

  .picker-cat + .picker-cat {
    margin-top: var(--space-4);
  }

  .picker-cat-label {
    display: block;
    font-size: var(--text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text3);
    margin-bottom: var(--space-2);
  }

  .picker-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 4px;
  }

  .picker-emoji {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease;
    padding: 0;
  }

  .picker-emoji:hover,
  .picker-emoji:focus-visible {
    background: var(--color-surface2);
    border-color: var(--color-accent1);
    outline: none;
  }
</style>
