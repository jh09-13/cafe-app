function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-count').textContent = count;
}

function render() {
  const cart = getCart();
  const listEl = $('#cart-list');
  const summary = $('#summary');
  const emptyState = $('#empty-state');

  updateCartBadge();

  if (cart.length === 0) {
    listEl.innerHTML = '';
    summary.hidden = true;
    emptyState.hidden = false;
    return;
  }

  summary.hidden = false;
  emptyState.hidden = true;

  renderList(listEl, cart, (item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
      </div>
      <div class="qty-control">
        <button type="button" class="qty-btn" data-minus="${item.menuId}">−</button>
        <span>${item.quantity}</span>
        <button type="button" class="qty-btn" data-plus="${item.menuId}">+</button>
      </div>
      <p class="cart-item-subtotal">${formatPrice(item.price * item.quantity)}</p>
      <button class="btn-remove" data-remove="${item.menuId}" aria-label="삭제">✕</button>
    </div>
  `);

  $('#total-price').textContent = formatPrice(getCartTotal());
}

$('#cart-list').addEventListener('click', (e) => {
  const minusBtn = e.target.closest('[data-minus]');
  const plusBtn = e.target.closest('[data-plus]');
  const removeBtn = e.target.closest('[data-remove]');

  if (minusBtn) {
    const item = getCart().find(c => String(c.menuId) === minusBtn.dataset.minus);
    if (item) updateCartQuantity(item.menuId, item.quantity - 1);
  } else if (plusBtn) {
    const item = getCart().find(c => String(c.menuId) === plusBtn.dataset.plus);
    if (item) updateCartQuantity(item.menuId, item.quantity + 1);
  } else if (removeBtn) {
    removeFromCart(removeBtn.dataset.remove);
  } else {
    return;
  }

  render();
});

$('#btn-checkout').addEventListener('click', () => {
  const cart = getCart();
  if (cart.length === 0) return;

  const order = createOrder(cart, getCartTotal());
  clearCart();
  location.href = `../orders/detail.html?id=${order.id}`;
});

render();
