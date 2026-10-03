const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=12';
const PRODUCTS_KEY = 'pocket-store-posts-v2';
const OFFLINE_POSTS = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  userId: (index % 3) + 1,
  title: `Publicacion offline ${index + 1}`,
  category: 'publicacion',
  thumbnail: 'icons/icon.svg'
}));

const productGrid = document.querySelector('#product-grid');
const productTemplate = document.querySelector('#product-template');
const productCount = document.querySelector('#product-count');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search-input');
const refreshButton = document.querySelector('#refresh-button');
const connectionStatus = document.querySelector('#connection-status');
const connectionLabel = document.querySelector('#connection-label');

function setConnectionStatus(isOnline) {
  connectionStatus.classList.toggle('online', isOnline);
  connectionLabel.textContent = isOnline ? 'En linea' : 'Modo offline';
}

function renderProducts(products) {
  productGrid.replaceChildren();
  products.forEach((product, index) => {
    const card = productTemplate.content.cloneNode(true);
    const image = card.querySelector('.product-image');
    image.src = product.thumbnail || 'icons/icon.svg';
    image.alt = product.title;
    card.querySelector('.product-category').textContent = product.category;
    card.querySelector('.product-title').textContent = product.title;
    card.querySelector('.product-brand').textContent = `Publicacion #${product.id}`;
    card.querySelector('.product-price').textContent = `Post ${product.id}`;
    card.querySelector('.product-rating').textContent = `Usuario ${product.userId}`;
    card.querySelector('.product-card').style.animationDelay = `${Math.min(index, 8) * 45}ms`;
    productGrid.append(card);
  });
  productGrid.setAttribute('aria-busy', 'false');
  productCount.textContent = `${products.length} productos`;
  emptyState.hidden = products.length > 0;
}

function filterProducts(products) {
  const query = searchInput.value.trim().toLowerCase();
  return products.filter((product) => `${product.title} ${product.category}`.toLowerCase().includes(query));
}

async function loadProducts(forceRefresh = false) {
  const storedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || 'null');
  const cachedProducts = Array.isArray(storedProducts) && storedProducts.every((product) => product.userId)
    ? storedProducts
    : null;
  if (cachedProducts && !forceRefresh) renderProducts(filterProducts(cachedProducts));

  try {
    const response = await fetch(API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo consultar el catalogo');
    const posts = await response.json();
    const products = posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      title: post.title,
      category: 'publicacion',
      thumbnail: 'icons/icon.svg'
    }));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    renderProducts(filterProducts(products));
    setConnectionStatus(true);
  } catch (error) {
    setConnectionStatus(false);
    const offlineProducts = cachedProducts || OFFLINE_POSTS;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(offlineProducts));
    renderProducts(filterProducts(offlineProducts));
  }
}

searchInput.addEventListener('input', () => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  renderProducts(filterProducts(products));
});
refreshButton.addEventListener('click', () => loadProducts(true));
window.addEventListener('online', () => { setConnectionStatus(true); loadProducts(true); });
window.addEventListener('offline', () => setConnectionStatus(false));

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(console.error);
setConnectionStatus(navigator.onLine);
loadProducts();