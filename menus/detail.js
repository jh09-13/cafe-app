function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-count').textContent = count;
}

async function init() {
  const menuId = new URLSearchParams(location.search).get('id');
  const menu = menuId ? await getMenuById(menuId) : null;

  updateCartBadge();

  if (!menu) {
    $('#menu-detail').hidden = true;
    $('#not-found').hidden = false;
    return;
  }

  $('#menu-detail').innerHTML = `
    <div class="detail-image" style="background-image:url('${getCategoryImage(menu.category)}')">
      <span class="emoji-badge">${getCategoryEmoji(menu.category)}</span>
    </div>
    <div class="detail-info">
      <span class="detail-category">${getCategoryName(menu.category)}</span>
      <h2>${menu.name}</h2>
      <p class="detail-desc">${menu.description || ''}</p>
      <p class="detail-price">${formatPrice(menu.price)}</p>

      <div class="qty-control">
        <button type="button" id="qty-minus" class="qty-btn">−</button>
        <span id="qty-value">1</span>
        <button type="button" id="qty-plus" class="qty-btn">+</button>
      </div>

      <button id="btn-add" class="btn btn-primary btn-add-cart">장바구니 담기</button>
    </div>
  `;

  let qty = 1;
  const qtyValue = $('#qty-value');

  $('#qty-minus').addEventListener('click', () => {
    if (qty > 1) qty--;
    qtyValue.textContent = qty;
  });

  $('#qty-plus').addEventListener('click', () => {
    qty++;
    qtyValue.textContent = qty;
  });

  $('#btn-add').addEventListener('click', async () => {
    await addToCart(menu.id, qty);
    updateCartBadge();
    alert(`${menu.name} ${qty}개를 장바구니에 담았습니다.`);
  });
}

init();
