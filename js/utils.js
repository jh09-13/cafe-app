// ============================================
// 공통 유틸리티
// ============================================

// ---- 가격 포�팅 ----
function formatPrice(price) {
  return price.toLocaleString('ko-KR') + '원';
}

// ---- 카테고리 이름 ----
function getCategoryName(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? cat.name : id;
}

// ---- 카테고리 이모지 ----
function getCategoryEmoji(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? cat.emoji : '☕';
}

// ---- 카테고리 대표 이미지 ----
function getCategoryImage(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? cat.image : '';
}

// ---- 상태 라벨 ----
function getStatusLabel(value) {
  const status = Object.values(ORDER_STATUS).find(s => s.value === value);
  return status ? status.label : value;
}

// ---- 날짜 포�팅 ----
function formatDate(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

// ============================================
// 장바구니 (localStorage)
// ============================================

const CART_KEY = 'cafe_cart';

function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

async function addToCart(menuId, quantity = 1) {
  const cart = getCart();
  const menus = await getMenus();
  const item = menus.find(m => String(m.id) === String(menuId));
  if (!item) return;

  const existing = cart.find(c => String(c.menuId) === String(menuId));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      menuId: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      quantity
    });
  }
  saveCart(cart);
}

function removeFromCart(menuId) {
  let cart = getCart();
  cart = cart.filter(c => String(c.menuId) !== String(menuId));
  saveCart(cart);
}

function updateCartQuantity(menuId, quantity) {
  const cart = getCart();
  const item = cart.find(c => String(c.menuId) === String(menuId));
  if (item) {
    if (quantity <= 0) {
      removeFromCart(menuId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function clearCart() {
  saveCart([]);
}

// ============================================
// 메뉴 (Supabase, MENU_ITEMS를 초기 시드로 사용)
// ============================================

async function getMenus() {
  const { data, error } = await sb.from('menus').select('*').order('id');
  if (error) { console.error(error); return []; }
  return data;
}

async function getMenuById(id) {
  const { data, error } = await sb.from('menus').select('*').eq('id', id).maybeSingle();
  if (error) { console.error(error); return null; }
  return data;
}

async function addMenu(menu) {
  const { data, error } = await sb.from('menus').insert(menu).select().single();
  if (error) { console.error(error); return null; }
  return data;
}

async function updateMenu(id, changes) {
  const { data, error } = await sb.from('menus').update(changes).eq('id', id).select().maybeSingle();
  if (error) { console.error(error); return null; }
  return data;
}

async function removeMenu(id) {
  const { error } = await sb.from('menus').delete().eq('id', id);
  if (error) console.error(error);
}

async function resetMenus() {
  await sb.from('menus').delete().gte('id', 0);
  const seed = MENU_ITEMS.map(({ id, ...rest }) => rest);
  const { data, error } = await sb.from('menus').insert(seed).select();
  if (error) { console.error(error); return []; }
  return data;
}

// ============================================
// 주문 (Supabase, 익명 세션ID로 소유자 구분)
// ============================================

function mapOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    items: row.items,
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    pickupSecret: row.pickup_code_secret
  };
}

// ---- 픽업 확인용 다이내믹 코드 ----
// 주문별 비밀값 + 현재 시간 구간으로 계산되는 6자리 코드. 매 windowSeconds마다 바뀌므로
// 화면을 캡처해두고 나중에 제시해도 시간이 지나면 무효가 된다.
function getRotatingPickupCode(secret, windowSeconds = 5) {
  const timeWindow = Math.floor(Date.now() / 1000 / windowSeconds);
  const input = `${secret}:${timeWindow}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return String(hash % 1000000).padStart(6, '0');
}

async function getOrders() {
  const { data, error } = await sb.from('orders').select('*').order('created_at');
  if (error) { console.error(error); return []; }
  return data.map(mapOrder);
}

async function getMyOrders() {
  const { data, error } = await sb.from('orders').select('*').eq('session_id', getSessionId()).order('created_at');
  if (error) { console.error(error); return []; }
  return data.map(mapOrder);
}

async function createOrder(items, total) {
  const { data, error } = await sb.from('orders').insert({
    session_id: getSessionId(),
    items,
    total,
    status: ORDER_STATUS.PENDING.value
  }).select().single();
  if (error) { console.error(error); return null; }
  return mapOrder(data);
}

async function getOrderById(id) {
  const { data, error } = await sb.from('orders').select('*').eq('id', id).maybeSingle();
  if (error) { console.error(error); return null; }
  return mapOrder(data);
}

async function updateOrderStatus(id, status) {
  const changes = { status };
  if (status === ORDER_STATUS.COMPLETED.value) {
    changes.completed_at = new Date().toISOString();
  }
  const { data, error } = await sb.from('orders').update(changes).eq('id', id).select().maybeSingle();
  if (error) { console.error(error); return null; }
  return mapOrder(data);
}

// ============================================
// DOM 헬퍼
// ============================================

function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

function renderList(container, items, renderFn) {
  container.innerHTML = items.map(renderFn).join('');
}
