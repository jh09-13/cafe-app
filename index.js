function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-count').textContent = count;
}

function renderCategories() {
  renderList($('#category-grid'), CATEGORIES, (cat) => `
    <a class="category-card" style="background-image:url('${cat.image}')" href="menus/list?cat=${cat.id}">
      <span class="category-emoji">${cat.emoji}</span>
      <span>${cat.name}</span>
    </a>
  `);
}

function renderFeatured() {
  const items = getMenus().slice(0, 4);
  renderList($('#featured-grid'), items, (m) => `
    <a class="menu-card" href="menus/detail?id=${m.id}">
      <div class="menu-card-image" style="background-image:url('${getCategoryImage(m.category)}')">
        <span class="emoji-badge">${getCategoryEmoji(m.category)}</span>
      </div>
      <div class="menu-card-body">
        <h3>${m.name}</h3>
        <p class="menu-card-price">${formatPrice(m.price)}</p>
      </div>
    </a>
  `);
}

renderCategories();
renderFeatured();
updateCartBadge();
