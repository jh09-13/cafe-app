function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-count').textContent = count;
}

function render() {
  const orders = getOrders();

  $('#stat-orders').textContent = orders.length;
  $('#stat-spent').textContent = formatPrice(orders.reduce((sum, o) => sum + o.total, 0));

  const recent = orders.slice().reverse().slice(0, 3);
  const recentEl = $('#recent-orders');
  const emptyState = $('#empty-state');

  emptyState.hidden = recent.length > 0;

  renderList(recentEl, recent, (o) => `
    <a class="order-card" href="../orders/detail.html?id=${o.id}">
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
