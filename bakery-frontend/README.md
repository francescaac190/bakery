# Bakery Frontend (Customer Storefront)

React 19 customer-facing storefront for browsing the menu, placing orders, and tracking them.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 8
- **Styling:** Tailwind CSS 3 + MUI (Material UI)
- **Routing:** React Router v7
- **Maps:** Leaflet + react-leaflet
- **State:** React Context (cart)

## Quick Start

```bash
npm install
npm run dev   # http://localhost:5173
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

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `ProductsPage` | Browse menu by category |
| `/products/:id` | `ProductDetailPage` | Product detail with size variants |
| `/personaliza` | `PersonalizaPage` | Custom cake request form |
| `/pedido` | `PedidoPage` | Cart review + checkout (pickup or delivery) |
| `/seguimiento/:id` | `TrackingPage` | Live order tracking |

## Features

- **Menu browsing** — Products grouped by category with search
- **Size variants** — Products with tier pricing (e.g. small / medium / large)
- **Custom cake** — Form to request a personalized cake (flavor, filling, frosting, servings, event date, message)
- **Cart** — Persistent cart via React Context; supports catalog items + custom cake in one order
- **Checkout** — Pickup or delivery selection; delivery address via Leaflet map picker
- **Order tracking** — Polls every 30 seconds; shows status progress bar, order summary, and status history log

## Project Structure

```
src/
  App.tsx
  features/
    products/
      context/CartContext.tsx     # Cart state and persistence
      pages/
        ProductsPage.tsx          # Menu listing
        ProductDetailPage.tsx     # Product detail + add to cart
        PersonalizaPage.tsx       # Custom cake form
      ui/
        ProductsList.tsx
        Cart.tsx
        InfoCard.tsx
    pedidos/
      pages/
        PedidoPage.tsx            # Checkout
        TrackingPage.tsx          # Order tracking
      ui/
        LocationPicker.tsx        # Leaflet map for delivery address
  components/
    ui/                           # Shared UI primitives
```
