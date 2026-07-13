function updateCartBadge() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-count').textContent = count;
}

const PICKUP_ROTATE_SECONDS = 5;
const PICKUP_ACTIVE_STATUSES = [
  ORDER_STATUS.PENDING.value,
  ORDER_STATUS.CONFIRMED.value,
  ORDER_STATUS.PREPARING.value,
  ORDER_STATUS.READY.value
];

function renderBarcodeBars(container, code) {
  const bars = [];
  for (let i = 0; i < 32; i++) {
    const digit = code.charCodeAt(i % code.length);
    const width = 2 + ((digit * (i + 3)) % 6);
    const faint = (digit + i) % 3 === 0;
    bars.push(`<div class="barcode-bar${faint ? ' faint' : ''}" style="flex-basis:${width}px"></div>`);
  }
  container.innerHTML = bars.join('');
}

function startPickupCode(order) {
  const codeEl = $('#pickup-code-value');
  const barcodeEl = $('#pickup-barcode');
  const timerBar = $('#pickup-code-timer-bar');

  function tick() {
    const code = getRotatingPickupCode(order.pickupSecret, PICKUP_ROTATE_SECONDS);
    codeEl.textContent = code;
    renderBarcodeBars(barcodeEl, code);

    const elapsed = (Date.now() / 1000) % PICKUP_ROTATE_SECONDS;
    timerBar.style.width = `${(elapsed / PICKUP_ROTATE_SECONDS) * 100}%`;
  }

  tick();
  setInterval(tick, 200);
}

async function init() {
  const orderId = new URLSearchParams(location.search).get('id');
  const order = orderId ? await getOrderById(orderId) : null;

  updateCartBadge();

  if (!order) {
    $('#order-detail').hidden = true;
    $('#not-found').hidden = false;
    return;
  }

  const showPickupCode = PICKUP_ACTIVE_STATUSES.includes(order.status);

  $('#order-detail').innerHTML = `
    <div class="order-head">
      <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span>
      <span class="order-date">${formatDate(order.createdAt)}</span>
    </div>

    ${showPickupCode ? `
      <div class="pickup-code">
        <p class="pickup-code-label">🔒 매장 수령 확인 코드</p>
        <div class="pickup-code-value" id="pickup-code-value">000000</div>
        <div class="pickup-barcode" id="pickup-barcode"></div>
        <div class="pickup-code-timer"><div class="pickup-code-timer-bar" id="pickup-code-timer-bar"></div></div>
        <p class="pickup-code-hint">직원에게 이 화면을 보여주세요. 코드는 계속 바뀌어서 캡처해둔 화면은 곧 무효가 됩니다.</p>
      </div>
    ` : ''}

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

  if (showPickupCode) {
    startPickupCode(order);
  }
}

init();
