# Shoply — Simple React + Node E-commerce

Full-stack demo store with login/register, product browsing, cart, billing/checkout, orders, and a **wishlist** feature (plus coupon codes at checkout).

## Stack

- **Frontend:** React (Vite) + React Router
- **Backend:** Node.js + Express + JWT auth
- **Data:** In-memory store (resets when the API restarts)
- **CI:** GitHub Actions (`.github/workflows/ci.yaml`)
- **Containers:** Docker Compose (`docker-compose.yml`)

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
.github/workflows/ci.yaml   CI pipeline (build + Docker health check)
backend/                    Express API
  routes/                   auth, products, cart, wishlist, orders
  data/                     sample products
  store.js                  in-memory DB helpers
frontend/                   React app
  src/pages/                all UI screens
  src/context/              auth + cart/wishlist state
docker-compose.yml          backend + frontend containers
```

## CI / CD

GitHub Actions runs on every **push** and **pull request** to `main` (see `.github/workflows/ci.yaml`):

| Job | What it does |
| --- | --- |
| `frontend-build` | `npm ci` + `npm run build` in `frontend/` (Node 20) |
| `backend-build` | `npm ci` in `backend/` (Node 20) |
| `docker-build` | After both succeed: `docker compose build`, start with health checks, hit `/api/health`, then tear down |

## Docker

From the project root:

```bash
docker compose up --build
```

Frontend is served at [http://localhost:3001](http://localhost:3001). Backend health: `GET /api/health` on port 5000 inside the compose network.

## API overview

- `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me`
- `GET /api/products` · `GET /api/products/:id`
- `GET/POST/PUT/DELETE /api/cart/...` (auth)
- `GET/POST /api/wishlist/...` (auth)
- `POST /api/orders/preview` · `POST /api/orders` · `GET /api/orders` (auth)
