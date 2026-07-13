let currentCat = new URLSearchParams(location.search).get('cat') || 'all';

function renderTabs() {
  const tabsEl = $('#cat-filter-tabs');
  const tabs = [{ id: 'all', name: '전체' }, ...CATEGORIES];
  renderList(tabsEl, tabs, (cat) => `
    <button class="tab ${cat.id === currentCat ? 'active' : ''}" data-cat="${cat.id}">${cat.name}</button>
  `);
}

async function renderGrid() {
  const all = await getMenus();
  const menus = all.filter(m => currentCat === 'all' || m.category === currentCat);
  const grid = $('#menu-grid');
  const emptyState = $('#empty-state');

  renderList(grid, menus, (m) => `
    <div class="menu-card">
      <a class="menu-card-link" href="detail?id=${m.id}">
        <div class="menu-card-image" style="background-image:url('${getCategoryImage(m.category)}')">
          <span class="emoji-badge">${getCategoryEmoji(m.category)}</span>
        </div>
        <div class="menu-card-body">
          <h3>${m.name}</h3>
          <p class="menu-card-desc">${m.description || ''}</p>
          <p class="menu-card-price">${formatPrice(m.price)}</p>
        </div>
      </a>
      <button class="btn btn-primary btn-add" data-add="${m.id}">담기</button>
    </div>
  `);

  emptyState.hidden = menus.length > 0;
}

function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-count').textContent = count;
}

async function render() {
  renderTabs();
  await renderGrid();
  updateCartBadge();
}

$('#cat-filter-tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cat]');
  if (!btn) return;
  currentCat = btn.dataset.cat;
  render();
});

$('#menu-grid').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  await addToCart(btn.dataset.add);
  updateCartBadge();
});

render();
