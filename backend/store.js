const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const products = require("./data/products");

/** In-memory store — resets when the server restarts */
const db = {
  users: [],
  carts: {}, // userId -> [{ productId, quantity }]
  wishlists: {}, // userId -> [productId]
  orders: [],
};

async function seedDemoUser() {
  if (db.users.length) return;
  const passwordHash = await bcrypt.hash("demo1234", 10);
  db.users.push({
    id: "u-demo",
    name: "Demo Shopper",
    email: "demo@shoply.com",
    passwordHash,
    createdAt: new Date().toISOString(),
  });
  db.carts["u-demo"] = [];
  db.wishlists["u-demo"] = ["p1", "p5"];
}

function findUserByEmail(email) {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  return db.users.find((u) => u.id === id);
}

function createUser({ name, email, passwordHash }) {
  const user = {
    id: uuidv4(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  db.carts[user.id] = [];
  db.wishlists[user.id] = [];
  return user;
}

function getProducts({ q, category } = {}) {
  let list = [...products];
  if (category && category !== "All") {
    list = list.filter((p) => p.category === category);
  }
  if (q) {
    const term = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }
  return list;
}

function getProduct(id) {
  return products.find((p) => p.id === id);
}

function getCategories() {
  return [...new Set(products.map((p) => p.category))];
}

function getCart(userId) {
  const items = db.carts[userId] || [];
  return items
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
        lineTotal: +(product.price * item.quantity).toFixed(2),
      };
    })
    .filter(Boolean);
}

function setCartItem(userId, productId, quantity) {
  if (!db.carts[userId]) db.carts[userId] = [];
  const cart = db.carts[userId];
  const product = getProduct(productId);
  if (!product) return { error: "Product not found", status: 404 };

  const existing = cart.find((i) => i.productId === productId);
  if (quantity <= 0) {
    db.carts[userId] = cart.filter((i) => i.productId !== productId);
  } else {
    if (quantity > product.stock) {
      return { error: `Only ${product.stock} in stock`, status: 400 };
    }
    if (existing) existing.quantity = quantity;
    else cart.push({ productId, quantity });
  }
  return { cart: getCart(userId) };
}

function clearCart(userId) {
  db.carts[userId] = [];
}

function getWishlist(userId) {
  const ids = db.wishlists[userId] || [];
  return ids.map(getProduct).filter(Boolean);
}

function toggleWishlist(userId, productId) {
  if (!db.wishlists[userId]) db.wishlists[userId] = [];
  const product = getProduct(productId);
  if (!product) return { error: "Product not found", status: 404 };

  const list = db.wishlists[userId];
  const idx = list.indexOf(productId);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(productId);
  return { wishlist: getWishlist(userId) };
}

const COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FLAT20: { type: "fixed", value: 20, label: "$20 off" },
  WELCOME: { type: "percent", value: 15, label: "15% welcome discount" },
};

function applyCoupon(subtotal, code) {
  if (!code) return { discount: 0, coupon: null };
  const coupon = COUPONS[code.toUpperCase()];
  if (!coupon) return { error: "Invalid coupon code", status: 400 };
  let discount =
    coupon.type === "percent"
      ? (subtotal * coupon.value) / 100
      : coupon.value;
  discount = Math.min(discount, subtotal);
  return {
    discount: +discount.toFixed(2),
    coupon: { code: code.toUpperCase(), ...coupon },
  };
}

function createOrder(userId, { shipping, payment, couponCode }) {
  const cart = getCart(userId);
  if (!cart.length) return { error: "Cart is empty", status: 400 };

  const subtotal = +cart.reduce((s, i) => s + i.lineTotal, 0).toFixed(2);
  const couponResult = applyCoupon(subtotal, couponCode);
  if (couponResult.error) return couponResult;

  const shippingFee = subtotal >= 100 ? 0 : 8.99;
  const tax = +((subtotal - couponResult.discount) * 0.08).toFixed(2);
  const total = +(
    subtotal -
    couponResult.discount +
    shippingFee +
    tax
  ).toFixed(2);

  const order = {
    id: `ord-${uuidv4().slice(0, 8)}`,
    userId,
    items: cart,
    shipping,
    payment: {
      method: payment.method,
      last4: payment.cardNumber ? String(payment.cardNumber).slice(-4) : null,
    },
    coupon: couponResult.coupon,
    pricing: {
      subtotal,
      discount: couponResult.discount,
      shipping: shippingFee,
      tax,
      total,
    },
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(order);
  clearCart(userId);
  return { order };
}

function getOrdersForUser(userId) {
  return db.orders.filter((o) => o.userId === userId);
}

function getOrder(userId, orderId) {
  return db.orders.find((o) => o.id === orderId && o.userId === userId);
}

module.exports = {
  seedDemoUser,
  findUserByEmail,
  findUserById,
  createUser,
  getProducts,
  getProduct,
  getCategories,
  getCart,
  setCartItem,
  getWishlist,
  toggleWishlist,
  applyCoupon,
  createOrder,
  getOrdersForUser,
  getOrder,
  COUPONS,
};
