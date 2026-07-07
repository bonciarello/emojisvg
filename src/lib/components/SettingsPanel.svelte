<script>
  import { settings, applySettingsToAll, emojis } from '../stores.js';

  const PRESET_COLORS = [
    '#FF5E5B', '#FF8C42', '#FFB347', '#F9DC5C',
    '#7BC67E', '#96CEB4', '#45B7D1', '#6C8CFF',
    '#B07AFF', '#E879A8', '#FF6B8A', '#A0A0A0'
  ];

  const ANIMATIONS = [
    {
      id: 'pulse',
      label: 'Pulse',
      desc: 'Espansione e contrazione ritmica',
      icon: 'pulse'
    },
    {
      id: 'rotate',
      label: 'Rotazione',
      desc: 'Rotazione continua a 360°',
      icon: 'rotate'
    },
    {
      id: 'bounce',
      label: 'Rimbalzo',
      desc: 'Saltello elastico su e giù',
      icon: 'bounce'
    }
  ];

  let currentColor;
  let currentAnimation;
  let currentSize;

  settings.subscribe(s => {
    currentColor = s.color;
    currentAnimation = s.animation;
    currentSize = s.size;
  });

  function handleColorChange(e) {
    const newColor = e.target.value;
    settings.set({ color: newColor, animation: currentAnimation, size: currentSize });
    applySettingsToAll({ color: newColor, animation: currentAnimation, size: currentSize });
  }

  function setColor(color) {
    settings.set({ color, animation: currentAnimation, size: currentSize });
    applySettingsToAll({ color, animation: currentAnimation, size: currentSize });
  }

  function setAnimation(anim) {
    settings.set({ color: currentColor, animation: anim, size: currentSize });
    applySettingsToAll({ color: currentColor, animation: anim, size: currentSize });
  }

  function handleSizeChange(e) {
    const size = Math.max(40, Math.min(400, parseInt(e.target.value) || 120));
    settings.set({ color: currentColor, animation: currentAnimation, size });
    applySettingsToAll({ color: currentColor, animation: currentAnimation, size });
  }
</script>

<div class="settings">
  <!-- Color -->
  <fieldset class="setting-group">
    <legend class="setting-label">Colore</legend>
    <div class="color-row">
      <div class="color-input-wrap">
        <input
          type="color"
          id="color-picker"
          value={currentColor}
          on:input={handleColorChange}
          aria-label="Selettore colore personalizzato"
        />
        <label for="color-picker" class="color-value">{currentColor}</label>
      </div>
      <div class="presets">
        {#each PRESET_COLORS as c}
          <button
            class="preset-swatch"
            style="background: {c}"
            class:active={currentColor === c}
            on:click={() => setColor(c)}
            aria-label={`Colore ${c}`}
            title={c}
          ></button>
        {/each}
      </div>
    </div>
  </fieldset>

  <!-- Animation -->
  <fieldset class="setting-group">
    <legend class="setting-label">Animazione</legend>
    <div class="anim-row" role="radiogroup" aria-label="Tipo di animazione">
      {#each ANIMATIONS as anim}
        <button
          class="anim-btn"
          class:active={currentAnimation === anim.id}
          on:click={() => setAnimation(anim.id)}
          role="radio"
          aria-checked={currentAnimation === anim.id}
          title={anim.desc}
        >
          <span class="anim-icon">
            {#if anim.id === 'pulse'}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="4" />
                <circle cx="12" cy="12" r="10" opacity="0.35" stroke-dasharray="2 3" />
              </svg>
            {:else if anim.id === 'rotate'}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 12a9 9 0 1 1-3-6.5" />
                <polyline points="17 4 21 4 21 8" />
              </svg>
            {:else}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="4" x2="12" y2="9" />
                <polyline points="9 7 12 4 15 7" />
                <line x1="12" y1="20" x2="12" y2="15" />
                <polyline points="9 17 12 20 15 17" />
                <rect x="4" y="9" width="16" height="6" rx="1" opacity="0.3" />
              </svg>
            {/if}
          </span>
          <span class="anim-label">{anim.label}</span>
        </button>
      {/each}
    </div>
  </fieldset>

  <!-- Size -->
  <fieldset class="setting-group">
    <legend class="setting-label" for="size-input">Dimensione (px)</legend>
    <div class="size-row">
      <input
        id="size-input"
        type="range"
        min="40"
        max="400"
        value={currentSize}
        on:input={handleSizeChange}
        aria-label="Dimensione SVG in pixel"
      />
      <span class="size-value">{currentSize}px</span>
    </div>
  </fieldset>
</div>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .setting-group {
    border: none;
    padding: 0;
    margin: 0;
  }

  .setting-label {
    display: block;
    font-family: var(--font-display);
    font-weight: 500;
    font-size: var(--text-sm);
    color: var(--color-text2);
    margin-bottom: var(--space-2);
  }

  /* ── Color ── */
  .color-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
  }

  .color-input-wrap {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .color-input-wrap input[type="color"] {
    width: 44px;
    height: 44px;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 2px;
    cursor: pointer;
    background: transparent;
  }

  .color-value {
    font-family: 'SF Mono', 'JetBrains Mono', monospace;
    font-size: var(--text-xs);
    color: var(--color-text2);
    font-weight: 600;
  }

  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .preset-swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2.5px solid transparent;
    cursor: pointer;
    transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
    padding: 0;
  }

  .preset-swatch:hover {
    transform: scale(1.2);
  }

  .preset-swatch.active {
    border-color: var(--color-text);
    box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-text);
    transform: scale(1.15);
  }

  /* ── Animation buttons ── */
  .anim-row {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .anim-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 80px;
    min-height: 64px;
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface2);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, transform 100ms ease;
    font-family: var(--font-body);
    color: var(--color-text2);
    flex: 1;
  }

  .anim-btn:hover {
    background: var(--color-surface);
    border-color: var(--color-accent1);
    color: var(--color-text);
  }

  .anim-btn.active {
    background: var(--color-surface);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .anim-btn:active {
    transform: scale(0.97);
  }

  .anim-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .anim-label {
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  /* ── Size ── */
  .size-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .size-row input[type="range"] {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: var(--color-surface2);
    border-radius: 3px;
    outline: none;
    cursor: pointer;
  }

  .size-row input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-primary);
    border: 2px solid var(--color-surface);
    cursor: pointer;
    box-shadow: var(--shadow-card);
  }

  .size-value {
    font-family: 'SF Mono', 'JetBrains Mono', monospace;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
    min-width: 48px;
    text-align: right;
  }
</style>
