// ============================================
// 공통 유틸리티
// ============================================

// ---- 가격 포�팅 ----
function formatPrice(price) {
  return price.toLocaleString('ko-KR') + '원';
}

// ---- 데이터 ID 생성 ----
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
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

function addToCart(menuId, quantity = 1) {
  const cart = getCart();
  const item = getMenus().find(m => String(m.id) === String(menuId));
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
// 메뉴 저장 (localStorage, MENU_ITEMS를 초기값으로 시드)
// ============================================

const MENUS_KEY = 'cafe_menus';

function getMenus() {
  const data = localStorage.getItem(MENUS_KEY);
  if (data) return JSON.parse(data);
  saveMenus(MENU_ITEMS);
  return [...MENU_ITEMS];
}

function saveMenus(menus) {
  localStorage.setItem(MENUS_KEY, JSON.stringify(menus));
}

function getMenuById(id) {
  return getMenus().find(m => String(m.id) === String(id));
}

function addMenu(menu) {
  const menus = getMenus();
  const newMenu = { id: generateId(), ...menu };
  menus.push(newMenu);
  saveMenus(menus);
  return newMenu;
}

function updateMenu(id, changes) {
  const menus = getMenus();
  const menu = menus.find(m => String(m.id) === String(id));
  if (menu) {
    Object.assign(menu, changes);
    saveMenus(menus);
  }
  return menu;
}

function removeMenu(id) {
  const menus = getMenus().filter(m => String(m.id) !== String(id));
  saveMenus(menus);
}

function resetMenus() {
  saveMenus(MENU_ITEMS);
  return [...MENU_ITEMS];
}

// ============================================
// 주문 저장 (localStorage)
// ============================================

const ORDERS_KEY = 'cafe_orders';

function getOrders() {
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function createOrder(items, total) {
  const orders = getOrders();
  const order = {
    id: generateId(),
    items,
    total,
    status: ORDER_STATUS.PENDING.value,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  orders.push(order);
  saveOrders(orders);
  return order;
}

function getOrderById(id) {
  const orders = getOrders();
  return orders.find(o => o.id === id);
}

function updateOrderStatus(id, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    if (status === ORDER_STATUS.COMPLETED.value) {
      order.completedAt = new Date().toISOString();
    }
    saveOrders(orders);
  }
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
