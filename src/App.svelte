<script>
  import EmojiInput from './lib/components/EmojiInput.svelte';
  import SettingsPanel from './lib/components/SettingsPanel.svelte';
  import EmojiGrid from './lib/components/EmojiGrid.svelte';
  import DownloadBar from './lib/components/DownloadBar.svelte';
</script>

<svelte:head>
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Emojify Studio",
      "description": "Converti emoji in file SVG animati con pulse, rotazione o rimbalzo. Scegli colore e dimensione, riordina le emoji ed esporta.",
      "url": "https://cristianporco.it/app/convertitore-di-emoji-da-testo-a-svg-con-animazione-reattiva/",
      "applicationCategory": "DesignApplication",
      "operatingSystem": "Web",
      "browserRequirements": "JavaScript, SVG",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      }
    })}
  </script>
</svelte:head>

<header class="app-header">
  <div class="header-brand">
    <span class="brand-icon" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    </span>
    <div>
      <h1 class="brand-title">Emojify Studio</h1>
      <p class="brand-tagline">Converti emoji in SVG animati — pulse, rotazione o rimbalzo.</p>
    </div>
  </div>
</header>

<main class="app-main">
  <!-- Left sidebar: controls -->
  <aside class="sidebar" aria-label="Controlli">
    <section class="sidebar-section">
      <EmojiInput />
    </section>
    <section class="sidebar-section">
      <SettingsPanel />
    </section>
  </aside>

  <!-- Main content: grid + download -->
  <section class="content" aria-label="Anteprima e griglia emoji">
    <EmojiGrid />
    <DownloadBar />
  </section>
</main>

<footer class="app-footer">
  <p>Emojify Studio — strumento gratuito per creare SVG animati dalle tue emoji preferite.</p>
  <p class="footer-note">Nessun dato inviato a server. Tutto avviene nel tuo browser.</p>
</footer>

<style>
  .app-header {
    padding: var(--space-6) var(--space-6) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    max-width: 960px;
    margin: 0 auto;
  }

  .brand-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: var(--color-surface2);
    border-radius: var(--radius-md);
  }

  .brand-title {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
    color: var(--color-text);
  }

  .brand-tagline {
    font-size: var(--text-sm);
    color: var(--color-text2);
    margin: 2px 0 0;
  }

  /* ── Main layout ── */
  .app-main {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--space-6);
    max-width: 960px;
    margin: 0 auto;
    padding: var(--space-6);
    align-items: start;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    position: sticky;
    top: var(--space-4);
  }

  .sidebar-section {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
  }

  .content {
    min-width: 0;
  }

  /* ── Footer ── */
  .app-footer {
    text-align: center;
    padding: var(--space-8) var(--space-4);
    border-top: 1px solid var(--color-border);
    color: var(--color-text3);
    font-size: var(--text-sm);
    line-height: 1.6;
  }

  .app-footer p {
    margin: 0;
  }

  .footer-note {
    font-size: var(--text-xs);
    margin-top: 4px !important;
    opacity: 0.7;
  }

  /* ── Responsive ── */
  @media (max-width: 720px) {
    .app-main {
      grid-template-columns: 1fr;
      gap: var(--space-4);
      padding: var(--space-4);
    }

    .sidebar {
      position: static;
    }

    .brand-title {
      font-size: var(--text-xl);
    }

    .app-header {
      padding: var(--space-4);
    }
  }

  @media (max-width: 400px) {
    .app-main {
      padding: var(--space-3);
    }

    .sidebar-section {
      padding: var(--space-3);
    }
  }
</style>
