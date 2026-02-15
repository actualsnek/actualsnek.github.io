// ═══════════════════════════════════════════════════════
//  Greek Mythology Reading Guide — app.js
//  Renders book cards from books-data.js into the page
// ═══════════════════════════════════════════════════════

// ── Edition type → badge class + label ────────────────
function badgeInfo(type) {
  if (type.includes('Loeb'))    return { cls: 'badge-loeb',    label: 'Loeb' };
  if (type.includes('Alt'))     return { cls: 'badge-alt',     label: 'Alt' };
  if (type.includes('Chicago')) return { cls: 'badge-chicago', label: 'Chicago' };
  return { cls: 'badge-english', label: 'Eng' };
}

// ── Volume summary text ───────────────────────────────
function volSummary(ed) {
  const parts = [];
  ['vol1Pages','vol2Pages','vol3Pages','vol4Pages','vol5Pages','vol6Pages']
    .forEach((k, i) => { if (ed[k]) parts.push(`Vol.${i+1}: ${ed[k]}pp`); });
  return parts.length ? parts.join(' · ') : null;
}

function isbnDisplay(ed) {
  if (ed.isbn)  return ed.isbn;
  if (ed.isbn1) return `Vol.1: ${ed.isbn1}`;
  return '';
}

// ── Build a single book card ───────────────────────────
function buildCard(ed, coverIsbn) {
  const badge = badgeInfo(ed.type);
  const vols  = volSummary(ed);
  const imgSrc = coverUrl(coverIsbn);
  const amazonUrl  = amazonIn(ed.isbn10);
  const abebooksUrl = abebooks(ed.isbn || ed.isbn1 || '');

  const premiumBtn = ed.premium
    ? `<a class="buy-link buy-premium" href="${ed.premiumUrl}" target="_blank" rel="noopener">💎 ${ed.premium.replace('The Folio Society','Folio Society')}</a>`
    : '';

  const grBtn = ed.goodreads
    ? `<a class="buy-link buy-goodreads" href="${ed.goodreads}" target="_blank" rel="noopener">★ Goodreads</a>`
    : '';

  const yearPages = vols
    ? `${ed.year} · ${vols}`
    : `${ed.year}${ed.pages ? ' · ' + ed.pages + ' pp' : ''}`;

  const seriesLine = ed.series
    ? `<div class="book-publisher" style="font-size:11.5px;color:var(--gold-dk);font-style:italic;">${ed.series}</div>`
    : '';

  return `
    <div class="book-card">
      <div class="book-cover">
        <img src="${imgSrc}"
             alt="Cover"
             loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
        <div class="book-cover-placeholder" style="display:none;">📖</div>
        <span class="edition-badge ${badge.cls}">${badge.label}</span>
      </div>
      <div class="book-body">
        <div class="book-edition-label">${ed.type}</div>
        <div class="book-translator">${ed.translator}</div>
        <div class="book-publisher">${ed.publisher}</div>
        ${seriesLine}
        <div class="book-year-pages">${yearPages}</div>
        <div class="book-notes">${ed.notes}</div>
        <div class="book-links">
          <a class="buy-link buy-amazon" href="${amazonUrl}" target="_blank" rel="noopener">🛒 Amazon.in</a>
          <a class="buy-link buy-abebooks" href="${abebooksUrl}" target="_blank" rel="noopener">📚 AbeBooks</a>
          ${premiumBtn}
          ${grBtn}
        </div>
      </div>
    </div>`;
}

// ── Build a work group (one work, multiple editions) ───
function buildWorkGroup(work) {
  const editionsHtml = work.editions.map(ed => {
    const coverIsbn = ed.isbn || ed.isbn1 || '';
    return buildCard(ed, coverIsbn);
  }).join('');

  return `
    <div class="work-group">
      <div class="work-group-title">
        ${work.workTitle}
        <span class="work-group-date">${work.date}</span>
      </div>
      <div class="work-group-editions">
        ${editionsHtml}
      </div>
    </div>`;
}

// ── Render Epic Origins ────────────────────────────────
function renderEpicOrigins() {
  const container = document.getElementById('books-epic');
  if (!container) return;
  container.innerHTML = epicOrigins.map(buildWorkGroup).join('');
}

// ── Render Tragedy ─────────────────────────────────────
function renderTragedy() {
  const aEl = document.getElementById('books-aeschylus');
  const sEl = document.getElementById('books-sophocles');
  const eEl = document.getElementById('books-euripides');
  if (aEl) aEl.innerHTML = aeschylus.map(buildWorkGroup).join('');
  if (sEl) sEl.innerHTML = sophocles.map(buildWorkGroup).join('');
  if (eEl) eEl.innerHTML = euripides.map(buildWorkGroup).join('');
}

// ── Init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderEpicOrigins();
  renderTragedy();
});
