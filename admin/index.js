async function render() {
  const menus = await getMenus();
  const orders = await getOrders();
  const pending = orders.filter(o => o.status === ORDER_STATUS.PENDING.value).length;
  const revenue = orders
    .filter(o => o.status !== ORDER_STATUS.CANCELLED.value)
    .reduce((sum, o) => sum + o.total, 0);

  $('#stat-menus').textContent = menus.length;
  $('#stat-orders').textContent = orders.length;
  $('#stat-pending').textContent = pending;
  $('#stat-revenue').textContent = formatPrice(revenue);

  const recent = orders.slice().reverse().slice(0, 5);
  const body = $('#recent-orders-body');
  const emptyState = $('#empty-state');

  emptyState.hidden = recent.length > 0;

  body.innerHTML = recent.map(o => `
    <tr>
      <td>${formatDate(o.createdAt)}</td>
      <td>${o.items.map(i => i.name).join(', ')}</td>
      <td>${formatPrice(o.total)}</td>
      <td><span class="status-badge status-${o.status}">${getStatusLabel(o.status)}</span></td>
      <td class="col-actions"><a class="btn btn-ghost" href="orders/detail?id=${o.id}">상세</a></td>
    </tr>
  `).join('');
}

render();
