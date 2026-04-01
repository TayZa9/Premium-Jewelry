---
name: jewelary-backend
description: Specialized guide for the Jewelary Express API and Prisma data layer. Use when changing `backend/src` or `backend/prisma`, working on auth, JWT middleware, product/category endpoints, payment-intent creation, Stripe configuration, database models, or any task that must reconcile the backend contract with the partially mocked frontend.
---

# Jewelary Backend

Use this skill for all API, Prisma, auth, and Stripe work in `backend/`.

## Read In This Order

Read `references/api-map.md` first.

Read `references/contracts.md` when a task involves frontend integration, auth behavior, or payment-intent debugging.

## Backend Operating Rules

Treat `backend/src` and `backend/prisma/schema.prisma` as the editable source. Avoid editing `backend/dist`.

Assume PostgreSQL via Prisma unless the user explicitly asks to change providers.

Protect auth-sensitive routes with middleware rather than trusting the frontend.

## Current Architecture

The API is intentionally thin:
- route files define endpoints
- controller files hold behavior
- `prismaClient.ts` exposes a shared Prisma client
- JWT helpers live in `utils/jwt.ts`

This makes it easy to add features, but also means validation, structured error handling, and service-layer separation are still minimal.

## Critical Flows

Auth:
- register checks for existing email
- bcrypt hashes passwords
- login compares hashes
- both return signed JWTs with `id` and `role`

Catalog:
- products and categories are fetched directly from Prisma
- featured products are limited to four items
- product/category slug lookup is already supported

Payments:
- `/api/payments/create-intent` is protected
- the controller trusts posted cart items for price calculation
- Stripe secret falls back to a placeholder if env is missing

## Common Pitfalls

The payment controller currently calculates totals from frontend-posted prices. In production work, re-fetch trusted product pricing from the database before charging.

`JWT_SECRET` and `STRIPE_SECRET_KEY` both have insecure fallback strings for local convenience. Keep that distinction clear when debugging versus hardening.

The frontend checkout depends on this route being protected, but the frontend dashboard does not model true auth rigor. Do not use dashboard behavior as proof that auth is correct.

There are no real tests in `backend/package.json`. When changing behavior, compensate with targeted manual verification and clear reasoning.

## Extension Strategy

When adding new backend features, follow the existing route/controller structure unless the user asks for a broader refactor.

When adding fields to `Product` or `Category`, update Prisma first, then controller includes/selects, then the frontend consumers.

When fixing integration bugs, trace the exact request shape the frontend sends before changing backend assumptions.
