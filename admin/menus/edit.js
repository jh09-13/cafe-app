const menuId = new URLSearchParams(location.search).get('id');
const menu = menuId ? getMenuById(menuId) : null;

renderList($('#f-category'), CATEGORIES, (cat) => `<option value="${cat.id}">${cat.name}</option>`);

if (!menu) {
  $('#not-found').hidden = false;
} else {
  $('#menu-form').hidden = false;
  $('#f-name').value = menu.name;
  $('#f-category').value = menu.category;
  $('#f-price').value = menu.price;
  $('#f-description').value = menu.description || '';

  $('#menu-form').addEventListener('submit', (e) => {
    e.preventDefault();

    updateMenu(menu.id, {
      name: $('#f-name').value.trim(),
      category: $('#f-category').value,
      price: Number($('#f-price').value),
      description: $('#f-description').value.trim()
    });

    location.href = `detail.html?id=${menu.id}`;
  });
}
