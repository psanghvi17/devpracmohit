const API = "/api";

function getToken() {
  return localStorage.getItem("shoply_token");
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),

  products: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? `?${q}` : ""}`);
  },
  categories: () => request("/products/categories"),
  product: (id) => request(`/products/${id}`),

  getCart: () => request("/cart"),
  addToCart: (productId, quantity = 1) =>
    request("/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (productId, quantity) =>
    request(`/cart/items/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),
  removeFromCart: (productId) =>
    request(`/cart/items/${productId}`, { method: "DELETE" }),

  getWishlist: () => request("/wishlist"),
  toggleWishlist: (productId) =>
    request(`/wishlist/${productId}`, { method: "POST" }),

  previewOrder: (couponCode) =>
    request("/orders/preview", {
      method: "POST",
      body: JSON.stringify({ couponCode }),
    }),
  placeOrder: (body) =>
    request("/orders", { method: "POST", body: JSON.stringify(body) }),
  getOrders: () => request("/orders"),
  getOrder: (id) => request(`/orders/${id}`),
};
