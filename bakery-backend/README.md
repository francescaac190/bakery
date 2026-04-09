# Bakery Backend

Express 5 + TypeScript + Prisma 7 REST API for a bakery ordering system.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **ORM:** Prisma 7 + PostgreSQL (via `pg` adapter)
- **Validation:** Zod 4
- **Auth:** JWT (`jsonwebtoken`) + bcrypt
- **File uploads:** Multer
- **Deploy:** Render.com (`render.yaml`)

## Quick Start

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/bakery_db"
PORT=1313
API_PREFIX=/api/v1
JWT_SECRET=your_secret
```

```bash
npm run prisma:generate   # generate Prisma client
npm run prisma:migrate    # run migrations
npm run seed              # seed menu data
npm run dev               # start dev server (tsx watch)
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Generate Prisma client + compile TypeScript |
| `npm run start` | Deploy migrations + start compiled server |
| `npm run typecheck` | Type-check without emitting |
| `npm run seed` | Seed initial menu data |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:studio` | Open Prisma Studio |

## Project Structure

```
src/
  app.ts              # Express app setup
  server.ts           # HTTP server entry point
  config/             # Environment config
  db/                 # Prisma client instance
  modules/
    auth/             # JWT login
    menu/             # Public menu + admin menu management
    orders/           # Public order creation + tracking
    adminOrders/      # Admin order management + status transitions
    adminUsers/       # Admin user management (RBAC)
    dashboard/        # Admin dashboard summary
    upload/           # File upload (Multer)
  routes/             # Root router
  shared/             # Middleware, error handling, auth guards
  scripts/            # Seed script
```

## API Reference

Base prefix: `/api/v1`

### Public

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/login` | Admin login, returns JWT |
| `GET` | `/menu/categories` | List product categories |
| `GET` | `/menu/products` | List products (`?categoryId=&search=`) |
| `GET` | `/menu/products/:id` | Get product detail |
| `POST` | `/orders` | Create a new order |
| `GET` | `/orders/:id` | Get order tracking data |

### Admin (JWT required)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/dashboard/summary` | Dashboard stats |
| `GET` | `/admin/orders` | List orders (`?status=&from=&to=&page=&pageSize=`) |
| `GET` | `/admin/orders/:id` | Get order detail |
| `PATCH` | `/admin/orders/:id/status` | Update order status |
| `PATCH` | `/admin/orders/:id/cake-price` | Set custom cake price |
| `GET` | `/admin/menu/categories` | List categories (admin) |
| `POST` | `/admin/menu/categories` | Create category |
| `PATCH` | `/admin/menu/categories/:id` | Update category |
| `DELETE` | `/admin/menu/categories/:id` | Delete category |
| `GET` | `/admin/menu/products` | List products (admin) |
| `POST` | `/admin/menu/products` | Create product |
| `PATCH` | `/admin/menu/products/:id` | Update product |
| `DELETE` | `/admin/menu/products/:id` | Delete product (soft delete) |
| `POST` | `/admin/upload` | Upload image |
| `GET` | `/admin/users` | List admin users |
| `POST` | `/admin/users` | Create admin user |

### Order Status Transitions

```
PENDING → CONFIRMED | CANCELLED
CONFIRMED → IN_PROGRESS | CANCELLED
IN_PROGRESS → READY | CANCELLED
READY → COMPLETED | CANCELLED
```

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

## Key Conventions

- Prices stored in cents (currency: BOB — Bolivian Boliviano)
- Products use soft deletes (`isActive` flag)
- Admin roles: `SUPER_ADMIN`, `STAFF`
- Static file uploads served from `./uploads/`
