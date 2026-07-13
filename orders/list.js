function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-count').textContent = count;
}

function render() {
  const orders = getOrders().slice().reverse();
  const listEl = $('#orders-list');
  const emptyState = $('#empty-state');

  emptyState.hidden = orders.length > 0;

  renderList(listEl, orders, (o) => `
    <a class="order-card" href="detail?id=${o.id}">
      <div class="order-card-head">
        <span class="order-date">${formatDate(o.createdAt)}</span>
        <span class="status-badge status-${o.status}">${getStatusLabel(o.status)}</span>
      </div>
      <p class="order-summary">${o.items.map(i => i.name).join(', ')}</p>
      <p class="order-total">${formatPrice(o.total)}</p>
    </a>
  `);

  updateCartBadge();
}

render();
