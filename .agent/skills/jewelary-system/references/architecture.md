# Jewelary Architecture

## Top Level

The repository is a lightweight monorepo:
- `package.json` runs both apps with `concurrently`
- `frontend/` contains the customer-facing Next.js app
- `backend/` contains the Express + Prisma API

Root scripts:
- `npm run dev` starts both apps
- `npm run dev:frontend` starts Next.js
- `npm run dev:backend` starts Express with `nodemon`
- `npm run build:all` builds both apps

## Frontend Shape

Important app routes:
- `frontend/src/app/page.tsx` home page
- `frontend/src/app/products/page.tsx` collection grid
- `frontend/src/app/products/[slug]/page.tsx` product detail
- `frontend/src/app/checkout/page.tsx` Stripe Elements checkout
- `frontend/src/app/dashboard/page.tsx` account shell with mock auth behavior

Important shared UI:
- `frontend/src/components/layout/Header.tsx`
- `frontend/src/components/layout/Footer.tsx`
- `frontend/src/components/cart/CartSlideOver.tsx`
- `frontend/src/components/home/HeroSection.tsx`
- `frontend/src/components/home/FeaturedProducts.tsx`
- `frontend/src/components/product/*`

State:
- `frontend/src/context/CartContext.tsx` stores the cart in `localStorage` under `aura-cart`

Frontend data reality:
- home featured products use `MOCK_FEATURED`
- product listing uses `MOCK_PRODUCTS`
- product detail uses a local async `getProduct()` switch on slug
- checkout is partially live because it calls the backend payment route

## Backend Shape

Entry point:
- `backend/src/index.ts`

Routes:
- `/api/auth` from `backend/src/routes/authRoutes.ts`
- `/api/categories` from `backend/src/routes/categoryRoutes.ts`
- `/api/products` from `backend/src/routes/productRoutes.ts`
- `/api/payments` from `backend/src/routes/paymentRoutes.ts`
- `/api/health` health probe

Controllers:
- `authController.ts` handles register/login and JWT issuance
- `categoryController.ts` returns categories and category-by-slug with products
- `productController.ts` returns all products, featured products, and product-by-slug
- `paymentController.ts` creates Stripe payment intents from posted cart items

Auth:
- `backend/src/middleware/authMiddleware.ts` reads bearer tokens and enforces admin roles
- JWT helpers are in `backend/src/utils/jwt.ts`

Database:
- Prisma schema lives in `backend/prisma/schema.prisma`
- models: `User`, `Category`, `Product`
- `Product` stores `images` as `String[]`

## Known Seams And Gotchas

The frontend assumes `http://localhost:5000` directly in checkout rather than using a shared env-driven API base URL.

The checkout route can show a loading placeholder forever when no auth token or valid Stripe secret exists, because payment-intent creation is protected.

The dashboard is not a real protected experience yet. It treats missing tokens as acceptable demo state.

Checked-in build output exists in `backend/dist` and `frontend/.next`. Those files are not the canonical implementation.
