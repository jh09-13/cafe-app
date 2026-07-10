function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-count').textContent = count;
}

const orderId = new URLSearchParams(location.search).get('id');
const order = orderId ? getOrderById(orderId) : null;

updateCartBadge();

if (!order) {
  $('#order-detail').hidden = true;
  $('#not-found').hidden = false;
} else {
  $('#order-detail').innerHTML = `
    <div class="order-head">
      <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span>
      <span class="order-date">${formatDate(order.createdAt)}</span>
    </div>

    <ul class="order-items">
      ${order.items.map(i => `
        <li>
          <span>${i.name} x ${i.quantity}</span>
          <span>${formatPrice(i.price * i.quantity)}</span>
        </li>
      `).join('')}
    </ul>

    <div class="order-total-row">
      <span>총 결제금액</span>
      <span>${formatPrice(order.total)}</span>
    </div>
  `;
}
