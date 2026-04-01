# Jewelary Runbook

## Local Services

Frontend:
- directory: `frontend/`
- default URL: `http://localhost:3000`

Backend:
- directory: `backend/`
- default URL: `http://localhost:5000`
- health check: `http://localhost:5000/api/health`

## Commands

From repo root:
- `npm run dev`
- `npm run dev:frontend`
- `npm run dev:backend`

From app directories:
- `npm run dev`
- `npm run build`

## Environment Expectations

Backend `.env` should provide:
- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- optionally `PORT`

Frontend env should provide:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Verification Checklist

For catalog UI changes:
1. Verify `/` and `/products`
2. Open a product detail page
3. Add an item to cart
4. Confirm the slide-over renders correctly on mobile and desktop

For payment/auth changes:
1. Confirm backend health route responds
2. Register or log in to obtain a JWT
3. Store the token where the frontend expects it: `localStorage['token']`
4. Add cart items
5. Visit `/checkout`
6. Confirm `/api/payments/create-intent` returns a `clientSecret`

## Frontend-Specific Caution

`frontend/AGENTS.md` states this is not the Next.js most agents remember. Before using unfamiliar Next.js APIs or conventions, consult the relevant guide under `frontend/node_modules/next/dist/docs/`.
