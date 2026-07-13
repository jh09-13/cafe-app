let currentStatus = 'all';

function renderTabs() {
  const tabs = [{ value: 'all', label: '전체' }, ...Object.values(ORDER_STATUS)];
  renderList($('#status-filter-tabs'), tabs, (s) => `
    <button class="tab ${s.value === currentStatus ? 'active' : ''}" data-status="${s.value}">${s.label}</button>
  `);
}

function renderTable() {
  const orders = getOrders().slice().reverse()
    .filter(o => currentStatus === 'all' || o.status === currentStatus);
  const body = $('#order-table-body');
  const emptyState = $('#empty-state');

  body.innerHTML = orders.map(o => `
    <tr>
      <td>${formatDate(o.createdAt)}</td>
      <td>${o.items.map(i => i.name).join(', ')}</td>
      <td>${formatPrice(o.total)}</td>
      <td><span class="status-badge status-${o.status}">${getStatusLabel(o.status)}</span></td>
      <td class="col-actions"><a class="btn btn-ghost" href="detail?id=${o.id}">상세</a></td>
    </tr>
  `).join('');

  emptyState.hidden = orders.length > 0;
}

function render() {
  renderTabs();
  renderTable();
}

$('#status-filter-tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-status]');
  if (!btn) return;
  currentStatus = btn.dataset.status;
  render();
});

render();
