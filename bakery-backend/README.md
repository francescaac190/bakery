# Bakery Backend MVP

Node.js + Express + Prisma backend for bakery ordering.

## Features

- Menu endpoints (categories and products)
- Order creation with:
  - Catalog items
  - Optional custom cake request
  - Pickup or delivery
- Admin endpoints (no auth for this MVP):
  - List orders
  - Update order status

## Tech

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Zod

## Quick Start

1. Install dependencies:
   - `npm install`
2. Configure `.env`:
   - `DATABASE_URL="postgresql://postgres:9120@localhost:5432/bakery_db"`
   - `PORT=1313`
   - `API_PREFIX=/api/v1`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Seed menu:
   - `npm run seed`
6. Start dev server:
   - `npm run dev`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:studio`
- `npm run seed`

## API

Base prefix: `/api/v1`

### Public

- `GET /api/v1/menu/categories`
- `GET /api/v1/menu/products?categoryId=&search=`
- `POST /api/v1/orders`
- `GET /api/v1/orders/:id`

### Admin (internal, no auth yet)

- `GET /api/v1/admin/orders?status=&from=&to=&page=&pageSize=`
- `PATCH /api/v1/admin/orders/:id/status`

Body:

```json
{ "status": "CONFIRMED" }
```

Allowed transitions:

- `PENDING -> CONFIRMED|CANCELLED`
- `CONFIRMED -> IN_PROGRESS|CANCELLED`
- `IN_PROGRESS -> READY|CANCELLED`
- `READY -> COMPLETED|CANCELLED`

## Order Creation Example

`POST /api/v1/orders`

```json
{
  "customerName": "Ana Perez",
  "customerPhone": "+59170000000",
  "fulfillmentType": "DELIVERY",
  "deliveryAddress": "Av. Siempre Viva 123",
  "items": [
    { "productId": "prod_abc", "quantity": 1 },
    { "productId": "prod_xyz", "quantity": 12, "notes": "Assorted" }
  ],
  "customCake": {
    "eventDate": "2026-03-20T15:00:00.000Z",
    "servings": 20,
    "flavor": "Chocolate",
    "messageOnCake": "Feliz Cumpleanos"
  }
}
```

## Project Structure

```txt
src/
  app.ts
  server.ts
  config/
  db/
  modules/
    menu/
    orders/
    adminOrders/
  routes/
  shared/
  scripts/
```
