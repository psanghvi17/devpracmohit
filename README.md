# Shoply — Simple React + Node E-commerce

Full-stack demo store with login/register, product browsing, cart, billing/checkout, orders, and a **wishlist** feature (plus coupon codes at checkout).

## Stack

- **Frontend:** React (Vite) + React Router
- **Backend:** Node.js + Express + JWT auth
- **Data:** In-memory store (resets when the API restarts)

## Features

| Page / Feature | Description |
| --- | --- |
| Login / Register | JWT-based auth |
| Product list | Search + category filters |
| Product detail | Qty select, add to cart, wishlist |
| Cart | Update quantities, remove items |
| Billing | Shipping, card or COD, coupon codes |
| Orders | Order history + order detail |
| Wishlist | Save products for later |
| Coupons | `SAVE10`, `FLAT20`, `WELCOME` |

Free shipping when subtotal is $100+.

## Quick start

Open two terminals from the project root.

**1. Backend (port 5000)**

```bash
cd backend
npm install
npm run dev
```

**2. Frontend (port 5173)**

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Demo account

- Email: `demo@shoply.com`
- Password: `demo1234`

## Project structure

```
backend/          Express API
  routes/         auth, products, cart, wishlist, orders
  data/           sample products
  store.js        in-memory DB helpers
frontend/         React app
  src/pages/      all UI screens
  src/context/    auth + cart/wishlist state
```

## API overview

- `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me`
- `GET /api/products` · `GET /api/products/:id`
- `GET/POST/PUT/DELETE /api/cart/...` (auth)
- `GET/POST /api/wishlist/...` (auth)
- `POST /api/orders/preview` · `POST /api/orders` · `GET /api/orders` (auth)
