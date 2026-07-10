renderList($('#f-category'), CATEGORIES, (cat) => `<option value="${cat.id}">${cat.name}</option>`);

$('#menu-form').addEventListener('submit', (e) => {
  e.preventDefault();

  addMenu({
    name: $('#f-name').value.trim(),
    category: $('#f-category').value,
    price: Number($('#f-price').value),
    description: $('#f-description').value.trim(),
    image: ''
  });

  location.href = 'list.html';
});
