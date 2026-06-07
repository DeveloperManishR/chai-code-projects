# Atelier — a small, considered storefront

A demo shop built with Next.js (App Router) and the public
[dummyjson.com](https://dummyjson.com) products endpoint. It is purely
front-end: there is no checkout, no auth, and the cart lives in
`localStorage`.

## Features

- Server-rendered catalogue with category filtering, search, and sort.
- Product detail pages with a gallery, related pieces, and an add-to-cart
  panel.
- Client-side cart (drawer + dedicated `/cart` page) persisted to
  `localStorage`.
- Category index (`/categories`) and category detail pages
  (`/categories/[id]`), where the `id` is the API category slug
  (e.g. `mens-watches`).
- Responsive layout, dark editorial styling, and skeleton / empty states
  for every async route.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, React Server Components)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- TypeScript, ESLint

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start the dev server with hot reload.    |
| `npm run build`  | Build for production.                    |
| `npm run start`  | Run the production build.                |
| `npm run lint`   | Lint the project with ESLint.            |

## Project structure

```
app/                # App Router routes
  page.tsx          # Home (hero, featured, collections, manifesto)
  products/         # /products and /products/[id]
  categories/       # /categories and /categories/[id]
  cart/             # /cart
  about/            # /about
components/         # Reusable UI (product card, browser, cart, ...)
lib/
  api.ts            # Data layer (freeapi.app client + normalizers)
  types.ts          # Shared types
  utils.ts          # formatters and helpers
  cart-store.ts     # localStorage-backed cart store
public/             # Static assets
```

## Data source

All products are fetched from
[`https://dummyjson.com/products`](https://dummyjson.com/docs/products).
The data layer lives in `lib/api.ts` and exposes:

| Function | Endpoint |
| --- | --- |
| `getProducts(page, limit)` | `GET /products?skip=&limit=&sortBy=id&order=asc` |
| `getProductById(id)` | `GET /products/{id}` |
| `getCategories()` | `GET /products/category-list` |
| `getProductsByCategory(slug, page, limit)` | `GET /products/category/{slug}?skip=&limit=` |

The dummyjson response (`{ products, total, skip, limit }` for lists,
bare objects for single-product and category-list) is normalized in
`lib/api.ts` into the internal `Product` / `Category` shapes the UI
consumes. Pagination is computed from `total` to keep the existing
`ProductsPage` contract stable.

Images are served from `cdn.dummyjson.com`; `next.config.ts` allow-lists
remote image hosts for `next/image`.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy

The easiest way to deploy is the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js).
See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for details.
