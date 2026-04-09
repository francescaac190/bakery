# Bakery Ordering System

Full-stack online bakery platform. Customers browse the menu, build a cart, and place orders — including custom cake requests. A separate admin panel handles order management, menu editing, and staff authentication.

## Monorepo Structure

```
bakery/
├── bakery-backend/    # Express 5 REST API + Prisma + PostgreSQL
├── bakery-frontend/   # Customer storefront (React 19 + Vite)
└── bakery-admin/      # Admin panel (React 19 + Vite + React Query)
```

## Tech Stack

| App | Key Technologies |
|-----|-----------------|
| Backend | Node.js, TypeScript, Express 5, Prisma 7, PostgreSQL, Zod, JWT, Multer |
| Customer Frontend | React 19, Vite, Tailwind CSS 3, MUI, React Router v7, Leaflet |
| Admin Frontend | React 19, Vite, Tailwind CSS 4, React Router v7, TanStack Query v5, Zustand v5, Recharts |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Backend

```bash
cd bakery-backend
npm install
```

Create `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/bakery_db"
PORT=1313
API_PREFIX=/api/v1
JWT_SECRET=your_secret
```

```bash
npm run prisma:migrate   # run migrations
npm run seed             # seed menu data
npm run dev              # http://localhost:1313
```

### Customer Frontend

```bash
cd bakery-frontend
npm install
npm run dev              # http://localhost:5173
```

### Admin Frontend

```bash
cd bakery-admin
npm install
npm run dev              # http://localhost:5174
```

Both frontends default to `http://localhost:1313/api/v1`. Override with `VITE_API_BASE_URL` in a local `.env`.

## Features

### Customer Storefront

- Browse menu by category, search products
- Product detail with size tier variants
- Custom cake request (flavor, filling, frosting, servings, event date, message)
- Cart with catalog items + optional custom cake in one order
- Checkout with pickup or delivery (map-based address picker)
- Order tracking page — polls every 30s, shows status progress and history

### Admin Panel

- JWT login with role-based access (`SUPER_ADMIN`, `STAFF`)
- Dashboard with live stats: orders today, pending, in-progress, unpriced custom cakes
- Menu management — create/edit/delete categories and products with image upload and size variants
- Order management — filter by status/date, advance order through status workflow, set price on custom cake requests

## Order Status Workflow

```
PENDING → CONFIRMED → IN_PROGRESS → READY → COMPLETED
                                           ↘
                 (cancellable at any stage) → CANCELLED
```

## API Overview

Base URL: `http://localhost:1313/api/v1`

**Public**
- `GET /menu/categories` — categories list
- `GET /menu/products` — products (`?categoryId=&search=`)
- `POST /orders` — create order
- `GET /orders/:id` — order tracking data

**Admin (JWT required)**
- `POST /auth/login` — get token
- `GET /admin/dashboard/summary` — dashboard stats
- `GET/PATCH /admin/orders` — list and update orders
- `GET/POST/PATCH/DELETE /admin/menu/categories` — manage categories
- `GET/POST/PATCH/DELETE /admin/menu/products` — manage products
- `POST /admin/upload` — upload image
- `GET/POST /admin/users` — manage admin users

See each app's `README.md` for the full API reference and script list.

## Deployment

Configured for [Render.com](https://render.com) via `render.yaml`. Set the following in the Render dashboard:

| Service | Env var | Value |
|---------|---------|-------|
| `bakery-backend` | `DATABASE_URL` | Render Postgres internal URL |
| `bakery-backend` | `JWT_SECRET` | Secret string |
| `bakery-backend` | `ALLOWED_ORIGIN` | Frontend URL |
| `bakery-frontend` | `VITE_API_BASE_URL` | Backend service URL |

## Conventions

- Prices stored in **cents** (currency: BOB — Bolivian Boliviano)
- Products use soft deletes (`isActive` flag)
- Static uploads served from `./uploads/` in the backend
