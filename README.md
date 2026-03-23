# Bakery Ordering System

A full-stack MVP for an online bakery ordering platform. Customers can browse the menu, add products to their cart, and place orders — including custom cake requests. Admins can view and manage orders through a dedicated API.

---

## Project Structure

```
bakery/
├── bakery-backend/    # Node.js/Express REST API
└── bakery-frontend/   # React SPA
```

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Language | TypeScript |

---

## Features

- **Menu browsing** — list products by category or search by name
- **Cart & ordering** — place orders with one or more catalog items
- **Custom cake requests** — specify flavor, filling, servings, event date, design notes, and allergies
- **Order tracking** — retrieve an order by ID and check its status
- **Admin order management** — list, filter, paginate, and update order statuses
- **Status workflow** — enforced transitions: `PENDING → CONFIRMED → IN_PROGRESS → READY → COMPLETED` (cancellable at any stage)
- **Pickup or delivery** — delivery requires an address

---

## Database Schema

```
Category     — product categories with images
Product      — menu items (price in BOB cents), images, descriptions
Order        — customer orders with status and fulfillment type
OrderItem    — line items with price snapshot at time of order
CustomCakeRequest — optional custom cake details linked to an order
```

---

## API Reference

Base URL: `http://localhost:1313/api/v1`

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/menu/categories` | All categories with their active products |
| `GET` | `/menu/products` | Products (optional `?categoryId=&search=`) |
| `POST` | `/orders` | Create a new order |
| `GET` | `/orders/:id` | Get order by ID |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/orders` | List orders (`?status=&from=&to=&page=&pageSize=`) |
| `PATCH` | `/admin/orders/:id/status` | Update order status |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API status |
| `GET` | `/health` | Health check |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Backend

```bash
cd bakery-backend
npm install

# Copy and fill in environment variables
cp .env.example .env  # set DATABASE_URL and PORT

# Run migrations and seed the database
npm run prisma:migrate
npm run seed

# Start dev server (port 1313)
npm run dev
```

### Frontend

```bash
cd bakery-frontend
npm install

# Start Vite dev server
npm run dev
```

---

## Available Scripts

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled server |
| `npm run typecheck` | Type-check without emitting |
| `npm run test` | Run tests |
| `npm run seed` | Seed the database |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run prisma:generate` | Regenerate Prisma client |

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Order Creation Payload

```json
{
  "customerName": "Ana García",
  "customerPhone": "+591 70000000",
  "fulfillmentType": "PICKUP",
  "deliveryAddress": null,
  "notes": "Sin azúcar en la decoración",
  "items": [
    { "productId": "uuid-here", "quantity": 2 }
  ],
  "customCake": {
    "flavor": "Red Velvet",
    "filling": "Queso crema",
    "servings": 20,
    "eventDate": "2026-04-10",
    "designNotes": "Decoración floral en rosa",
    "allergies": "Nueces"
  }
}
```

> At least one `items` entry **or** a `customCake` object is required. `deliveryAddress` is required when `fulfillmentType` is `"DELIVERY"`.

---

## Notes

- Prices are stored and returned in **cents** (currency: BOB — Bolivian Boliviano)
- Authentication on admin endpoints is not yet implemented (planned)
- The frontend currently renders the products/menu page as the main view
