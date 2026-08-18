/**
 * Waru Souvenirs — main.js
 * Carga productos desde data/products.json y maneja el filtrado por categoría.
 */

// ── Configuración por defecto (se sobreescribe con data/products.json) ──────
const CONFIG = {
  whatsapp:  '51999999999',
  instagram: 'https://instagram.com/warusouvenirs',
  facebook:  'https://facebook.com/warusouvenirs',
  tiktok:    'https://tiktok.com/@warusouvenirs',
};

// Emoji / icono por categoría (para placeholder cuando no hay imagen)
const CAT_ICONS = {
  polos:    '👕',
  casacas:  '🧥',
  bolsos:   '👜',
  llaveros: '🗝️',
};

const CAT_LABELS = {
  polos:    'Polos',
  casacas:  'Casacas',
  bolsos:   'Bolsos',
  llaveros: 'Llaveros',
};

let allProducts = [];

// ── Helpers ──────────────────────────────────────────────────────────────────

function waLink(productName) {
  const msg = productName
    ? `Hola, me gustaría consultar sobre el producto: *${productName}*`
    : 'Hola, me gustaría consultar sobre el stock y precios de sus productos.';
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

// ── Social links ──────────────────────────────────────────────────────────────

function applySocialLinks() {
  const set = (id, url) => {
    const el = document.getElementById(id);
    if (el) el.href = url;
  };
  set('link-instagram',    CONFIG.instagram);
  set('link-facebook',     CONFIG.facebook);
  set('link-tiktok',       CONFIG.tiktok);
  set('footer-instagram',  CONFIG.instagram);
  set('footer-facebook',   CONFIG.facebook);
  set('footer-tiktok',     CONFIG.tiktok);
  set('whatsapp-fab',      waLink(''));
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderProducts(products) {
  const grid  = document.getElementById('products-grid');
  const empty = document.getElementById('empty-state');
  const meta  = document.getElementById('products-meta');

  grid.innerHTML = '';

  if (products.length === 0) {
    empty.classList.remove('hidden');
    if (meta) meta.textContent = '';
    return;
  }

  empty.classList.add('hidden');

  if (meta) {
    meta.textContent = `${products.length} producto${products.length !== 1 ? 's' : ''}`;
  }

  products.forEach(p => {
    const icon  = CAT_ICONS[p.category] || '📦';
    const label = CAT_LABELS[p.category] || p.category;
    const link  = waLink(p.name);

    const card = document.createElement('article');
    card.className = 'product-card';

    const imageHtml = p.image
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy" width="400" height="320">`
      : `<div class="card-placeholder ph-${p.category}" role="img" aria-label="Imagen de ${p.name}">
           <span aria-hidden="true">${icon}</span>
         </div>`;

    card.innerHTML = `
      <div class="card-image">
        ${imageHtml}
        <span class="card-badge">${label}</span>
      </div>
      <div class="card-body">
        <h2 class="card-name">${p.name}</h2>
        <p class="card-desc">${p.description}</p>
      </div>
      <div class="card-footer">
        <a href="${link}"
           class="btn-wa"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="Consultar ${p.name} por WhatsApp">
          <i class="fab fa-whatsapp" aria-hidden="true"></i>
          Consultar
        </a>
      </div>`;

    grid.appendChild(card);
  });
}

// ── Filter ────────────────────────────────────────────────────────────────────

function filterAndRender(category) {
  const filtered = (category === 'all')
    ? allProducts
    : allProducts.filter(p => p.category === category);
  renderProducts(filtered);
}

// ── Category buttons ──────────────────────────────────────────────────────────

function initCategoryButtons() {
  const buttons = document.querySelectorAll('.cat-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterAndRender(btn.dataset.category);
    });
  });
}

// ── Load data ─────────────────────────────────────────────────────────────────

function loadProducts() {
  const grid  = document.getElementById('products-grid');
  const empty = document.getElementById('empty-state');

  try {
    const data = window.WARU_DATA;
    if (!data) throw new Error("No se encontró window.WARU_DATA. Verifica que products.js esté enlazado correctamente.");

    // Merge social config from JSON
    if (data.social) {
      Object.assign(CONFIG, data.social);
      applySocialLinks();
    }

    allProducts = Array.isArray(data.products) ? data.products : [];
    renderProducts(allProducts);

  } catch (err) {
    console.error('Error cargando productos:', err);
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
        <p>No se pudieron cargar los productos. Por favor, inténtalo de nuevo.</p>
      </div>`;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  applySocialLinks();
  initCategoryButtons();
  loadProducts();
});
