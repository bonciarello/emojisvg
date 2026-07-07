<script>
  import { emojis, emojiCount, clearAll } from '../stores.js';
  import { downloadZip, downloadCombinedSVG } from '../downloadUtils.js';

  let zipLoading = false;
  let error = '';

  async function handleDownloadZip() {
    if ($emojis.length === 0) {
      error = 'Aggiungi almeno un\'emoji prima di scaricare.';
      return;
    }
    error = '';
    zipLoading = true;
    try {
      await downloadZip($emojis);
    } catch (e) {
      error = 'Errore durante la creazione dello ZIP. Riprova.';
      console.error(e);
    } finally {
      zipLoading = false;
    }
  }

  function handleDownloadCombined() {
    if ($emojis.length === 0) {
      error = 'Aggiungi almeno un\'emoji prima di scaricare.';
      return;
    }
    error = '';
    downloadCombinedSVG($emojis);
  }

  function handleClear() {
    clearAll();
    error = '';
  }
</script>

<div class="download-bar">
  <div class="bar-info">
    <span class="bar-count">
      {$emojiCount} {$emojiCount === 1 ? 'emoji' : 'emoji'} nella griglia
    </span>
  </div>

  <div class="bar-actions">
    <button
      class="btn btn-outline"
      on:click={handleDownloadCombined}
      disabled={$emojiCount === 0}
      aria-label="Scarica un unico SVG con tutte le emoji"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      SVG unico
    </button>

    <button
      class="btn btn-primary"
      on:click={handleDownloadZip}
      disabled={zipLoading || $emojiCount === 0}
      aria-label="Scarica tutti gli SVG in un archivio ZIP"
    >
      {#if zipLoading}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round" /></svg>
        Creazione ZIP…
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Scarica ZIP
      {/if}
    </button>

    {#if $emojiCount > 0}
      <button
        class="btn btn-ghost-danger"
        on:click={handleClear}
        aria-label="Rimuovi tutte le emoji"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        Svuota
      </button>
    {/if}
  </div>

  {#if error}
    <p class="bar-error" role="alert">{error}</p>
  {/if}
</div>

<style>
  .download-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    margin-top: var(--space-4);
  }

  .bar-info {
    flex: 1;
    min-width: 120px;
  }

  .bar-count {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text2);
  }

  .bar-actions {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    height: 44px;
    padding: 0 var(--space-5);
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background 150ms ease, transform 100ms ease, opacity 150ms ease;
  }

  .btn:active:not(:disabled) {
    transform: scale(0.97);
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--color-primary);
    color: #fff;
  }

  .btn-primary:hover:not(:disabled) {
    background: #e8504d;
  }

  .btn-outline {
    background: transparent;
    color: var(--color-text);
    border: 1.5px solid var(--color-border);
  }

  .btn-outline:hover:not(:disabled) {
    background: var(--color-surface2);
    border-color: var(--color-accent1);
  }

  .btn-ghost-danger {
    background: transparent;
    color: var(--color-text3);
    padding: 0 var(--space-3);
  }

  .btn-ghost-danger:hover {
    color: var(--color-error);
    background: var(--color-surface2);
  }

  .bar-error {
    width: 100%;
    margin: 0;
    padding: var(--space-2) var(--space-3);
    background: #FEF2F2;
    color: var(--color-error);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-weight: 600;
  }

  @media (prefers-color-scheme: dark) {
    .bar-error {
      background: rgba(224,85,96,0.12);
    }
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
