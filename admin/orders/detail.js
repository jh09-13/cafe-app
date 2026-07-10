const orderId = new URLSearchParams(location.search).get('id');

function renderDetail() {
  const order = getOrderById(orderId);

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

    <div class="status-actions">
      <label for="f-status">상태 변경</label>
      <select id="f-status">
        ${Object.values(ORDER_STATUS).map(s => `<option value="${s.value}" ${s.value === order.status ? 'selected' : ''}>${s.label}</option>`).join('')}
      </select>
      <button id="btn-update-status" class="btn btn-primary">변경</button>
    </div>
  `;

  $('#btn-update-status').addEventListener('click', () => {
    updateOrderStatus(orderId, $('#f-status').value);
    renderDetail();
  });
}

if (!orderId || !getOrderById(orderId)) {
  $('#order-detail').hidden = true;
  $('#not-found').hidden = false;
} else {
  renderDetail();
}
