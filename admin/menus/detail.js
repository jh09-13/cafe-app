const menuId = new URLSearchParams(location.search).get('id');
const menu = menuId ? getMenuById(menuId) : null;

if (!menu) {
  $('#menu-detail').hidden = true;
  $('#not-found').hidden = false;
} else {
  $('#menu-detail').innerHTML = `
    <h2>${menu.name}</h2>
    <div class="detail-row"><span class="label">카테고리</span><span>${getCategoryName(menu.category)}</span></div>
    <div class="detail-row"><span class="label">가격</span><span>${formatPrice(menu.price)}</span></div>
    <div class="detail-row"><span class="label">설명</span><span>${menu.description || '-'}</span></div>
    <div class="detail-actions">
      <a class="btn btn-primary" href="edit?id=${menu.id}">수정</a>
      <button id="btn-delete" class="btn btn-danger">삭제</button>
    </div>
  `;

  $('#btn-delete').addEventListener('click', () => {
    if (confirm('이 메뉴를 삭제할까요?')) {
      removeMenu(menu.id);
      location.href = 'list.html';
    }
  });
}
