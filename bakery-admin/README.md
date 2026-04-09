# Bakery Admin

React 19 admin panel for managing orders, menu, and users.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 8
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **Server state:** TanStack Query v5
- **Client state:** Zustand v5
- **Tables:** TanStack Table v8
- **Charts:** Recharts
- **Notifications:** react-hot-toast
- **Icons:** Lucide React

## Quick Start

```bash
npm install
npm run dev   # http://localhost:5174
```

Create a `.env` file if you need to override the API URL:

```env
VITE_API_BASE_URL=http://localhost:1313/api/v1
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint with ESLint |

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | `LoginPage` | JWT login (redirects to `/` if already authenticated) |
| `/` | `DashboardPage` | Summary stats + recent orders |
| `/menu` | `MenuPage` | Manage categories and products |
| `/orders` | `OrdersPage` | View and manage all orders |

All routes except `/login` are protected by `AuthGuard` (requires valid JWT).

## Features

- **Authentication** — JWT login with Zustand-persisted token; `AuthGuard` / `GuestGuard` route protection
- **Dashboard** — Live summary: orders today, pending, in-progress, unpriced custom cakes; recent orders table
- **Menu management** — Create, edit, and delete categories and products via slide-in drawers; product image upload; size variant / tier pricing
- **Order management** — Filterable order list; order detail drawer; status transitions; set price for custom cake requests
- **RBAC** — `SUPER_ADMIN` and `STAFF` roles enforced server-side

## Project Structure

```
src/
  App.tsx
  components/
    layout/
      DashboardLayout.tsx    # Sidebar + outlet wrapper
      Sidebar.tsx
    ui/
      Button.tsx
  modules/
    auth/
      guards/
        AuthGuard.tsx        # Redirects to /login if not authenticated
        GuestGuard.tsx       # Redirects to / if already authenticated
      pages/LoginPage.tsx
      store/auth.store.ts    # Zustand token store
    menu/
      pages/MenuPage.tsx
      components/
        CategoriesTab.tsx
        ProductsTab.tsx
        CategoryDrawer.tsx
        ProductDrawer.tsx
    orders/
      pages/OrdersPage.tsx
      components/OrderDetailDrawer.tsx
  pages/
    DashboardPage.tsx
```
