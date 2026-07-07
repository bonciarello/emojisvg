<script>
  import { generateSVG } from '../svgGenerator.js';
  import { downloadSingleSVG } from '../downloadUtils.js';

  /** @type {{ id: string, char: string, color: string, animation: string, size: number }} */
  export let item;
  export let index;

  export let onRemove;
  export let onMoveUp;
  export let onMoveDown;

  let dragging = false;

  $: svgMarkup = generateSVG({
    char: item.char,
    color: item.color,
    animation: item.animation,
    size: item.size
  });

  function handleDragStart(e) {
    dragging = true;
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    // Make drag image semi-transparent via the browser default
  }

  function handleDragEnd() {
    dragging = false;
  }
</script>

<div
  class="emoji-card"
  class:dragging
  draggable="true"
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  role="listitem"
  aria-label={`Emoji ${item.char} con animazione ${item.animation}`}
>
  <!-- Preview -->
  <div class="card-preview">
    {@html svgMarkup}
  </div>

  <!-- Meta -->
  <div class="card-meta">
    <span class="card-char">{item.char}</span>
    <span class="card-anim">{item.animation}</span>
  </div>

  <!-- Actions -->
  <div class="card-actions">
    {#if onMoveUp}
      <button
        class="card-btn"
        on:click={() => onMoveUp(index)}
        aria-label="Sposta su"
        title="Sposta su"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    {/if}
    {#if onMoveDown}
      <button
        class="card-btn"
        on:click={() => onMoveDown(index)}
        aria-label="Sposta giù"
        title="Sposta giù"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
    {/if}
    <button
      class="card-btn card-btn-dl"
      on:click={() => downloadSingleSVG(item)}
      aria-label={`Scarica SVG di ${item.char}`}
      title="Scarica questo SVG"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    </button>
    <button
      class="card-btn card-btn-del"
      on:click={() => onRemove(item.id)}
      aria-label={`Rimuovi ${item.char}`}
      title="Rimuovi"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
</div>

<style>
  .emoji-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--color-surface);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-lg);
    cursor: grab;
    transition: border-color 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
    user-select: none;
    position: relative;
  }

  .emoji-card:hover {
    border-color: var(--color-accent1);
    box-shadow: var(--shadow-float);
  }

  .emoji-card:active {
    cursor: grabbing;
  }

  .emoji-card.dragging {
    opacity: 0.5;
    border-style: dashed;
  }

  .card-preview {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
  }

  .card-preview :global(svg) {
    max-width: 120px;
    max-height: 120px;
    width: 100%;
    height: auto;
  }

  .card-meta {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }

  .card-char {
    font-size: var(--text-lg);
  }

  .card-anim {
    font-size: var(--text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-accent1);
    background: var(--color-surface2);
    padding: 2px 8px;
    border-radius: 99px;
  }

  .card-actions {
    display: flex;
    gap: 4px;
    opacity: 0.6;
    transition: opacity 150ms ease;
  }

  .emoji-card:hover .card-actions {
    opacity: 1;
  }

  .card-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-surface2);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--color-text2);
    transition: background 150ms ease, color 150ms ease;
    padding: 0;
  }

  .card-btn:hover {
    background: var(--color-border);
    color: var(--color-text);
  }

  .card-btn-dl:hover {
    background: var(--color-accent2);
    color: #fff;
  }

  .card-btn-del:hover {
    background: var(--color-error);
    color: #fff;
  }

  @media (max-width: 500px) {
    .card-actions {
      opacity: 1;
    }
  }
</style>
