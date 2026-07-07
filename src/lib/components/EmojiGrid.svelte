<script>
  import { emojis, reorderEmojis, removeEmoji } from '../stores.js';
  import EmojiCard from './EmojiCard.svelte';

  let dragOverIndex = -1;
  let gridRef;

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Determine which position we're hovering over
    if (!gridRef) return;
    const cards = gridRef.querySelectorAll('.grid-cell');
    const y = e.clientY;

    let closestIdx = -1;
    let closestDist = Infinity;

    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const dist = Math.abs(y - midY);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    dragOverIndex = closestIdx;
  }

  function handleDragLeave(e) {
    // Only reset if we actually left the grid
    if (gridRef && !gridRef.contains(e.relatedTarget)) {
      dragOverIndex = -1;
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
    const toIdx = dragOverIndex;

    if (!isNaN(fromIdx) && !isNaN(toIdx) && fromIdx !== toIdx) {
      reorderEmojis(fromIdx, toIdx);
    }

    dragOverIndex = -1;
  }

  function remove(id) {
    removeEmoji(id);
  }

  function moveUp(idx) {
    if (idx > 0) {
      reorderEmojis(idx, idx - 1);
    }
  }

  function moveDown(idx) {
    // We need to know total count — subscribe briefly
    let total = 0;
    emojis.subscribe(v => total = v.length)();
    if (idx < total - 1) {
      reorderEmojis(idx, idx + 1);
    }
  }
</script>

{#if $emojis.length === 0}
  <div class="empty-state">
    <div class="empty-illustration">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    </div>
    <p class="empty-text">Nessuna emoji ancora.<br />Digitane una o sceglila dal selettore per iniziare.</p>
  </div>
{:else}
  <div
    class="grid"
    bind:this={gridRef}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    role="list"
    aria-label="Griglia emoji"
  >
    {#each $emojis as item, idx (item.id)}
      <div
        class="grid-cell"
        class:drop-before={dragOverIndex === idx}
      >
        <EmojiCard
          {item}
          index={idx}
          onRemove={remove}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
        />
      </div>
    {/each}
  </div>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-3);
    padding: var(--space-2);
    min-height: 120px;
    border-radius: var(--radius-lg);
    transition: background 150ms ease;
  }

  .grid-cell {
    transition: transform 150ms ease;
  }

  .grid-cell.drop-before {
    position: relative;
  }

  .grid-cell.drop-before::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--color-primary);
    border-radius: 2px;
    z-index: 10;
  }

  /* ── Empty state ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-10) var(--space-4);
    text-align: center;
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface2);
  }

  .empty-illustration {
    margin-bottom: var(--space-4);
    opacity: 0.5;
  }

  .empty-text {
    color: var(--color-text3);
    font-size: var(--text-base);
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 400px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
</style>
