let currentCat = 'all';

function renderTabs() {
  const tabsEl = $('#cat-filter-tabs');
  const tabs = [{ id: 'all', name: '전체' }, ...CATEGORIES];
  renderList(tabsEl, tabs, (cat) => `
    <button class="tab ${cat.id === currentCat ? 'active' : ''}" data-cat="${cat.id}">${cat.name}</button>
  `);
}

function renderTable() {
  const menus = getMenus().filter(m => currentCat === 'all' || m.category === currentCat);
  const body = $('#menu-table-body');
  const emptyState = $('#empty-state');

  body.innerHTML = menus.map(m => `
    <tr>
      <td>${m.name}</td>
      <td>${getCategoryName(m.category)}</td>
      <td>${formatPrice(m.price)}</td>
      <td>${m.description || ''}</td>
      <td class="col-actions">
        <div class="row-actions">
          <a class="btn btn-ghost" href="detail?id=${m.id}">상세</a>
          <a class="btn btn-ghost" href="edit?id=${m.id}">수정</a>
          <button class="btn btn-danger" data-delete="${m.id}">삭제</button>
        </div>
      </td>
    </tr>
  `).join('');

  emptyState.hidden = menus.length > 0;
}

function render() {
  renderTabs();
  renderTable();
}

$('#cat-filter-tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cat]');
  if (!btn) return;
  currentCat = btn.dataset.cat;
  render();
});

$('#menu-table-body').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-delete]');
  if (!btn) return;
  if (confirm('이 메뉴를 삭제할까요?')) {
    removeMenu(btn.dataset.delete);
    renderTable();
  }
});

$('#btn-reset').addEventListener('click', () => {
  if (confirm('모든 메뉴를 기본값으로 초기화할까요? 추가/수정한 내용이 사라집니다.')) {
    resetMenus();
    currentCat = 'all';
    render();
  }
});

render();
