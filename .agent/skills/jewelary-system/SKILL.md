---
name: jewelary-system
description: Project-specific operating guide for the Jewelary luxury jewelry monorepo. Use when work spans both apps, requires repo orientation, needs local run/setup guidance, or depends on understanding how the Next.js storefront, Express API, Prisma schema, auth, cart state, and Stripe checkout fit together.
---

# Jewelary System

Use this skill to orient quickly before making changes across the repo.

## Start Here

Read `references/architecture.md` first.

Read `references/runbook.md` when the task involves local setup, environment variables, or verifying app behavior in the browser.

## Repo Boundaries

Treat these directories as source of truth:
- `frontend/src`
- `frontend/public`
- `backend/src`
- `backend/prisma`

Avoid editing generated or vendor-managed output unless the user explicitly asks:
- `frontend/.next`
- `frontend/node_modules`
- `frontend/.git`
- `backend/dist`
- `backend/node_modules`

The workspace root is a monorepo wrapper with `package.json`, `SKILLS.md`, and `GEMINI.md`. The root itself is not a Git repository.

## Decision Guide

Change `frontend/src` when the task is about page layout, luxury visual polish, cart UX, client-side state, or mock catalog rendering.

Change `backend/src` and `backend/prisma` when the task is about persistent catalog data, auth, protected routes, payment intent creation, or database-backed product/category flows.

Touch both apps when the request crosses the mock/live seam. This repo currently has backend product/category/auth/payment endpoints, but several storefront experiences still use mock data or mock auth assumptions.

## Important Project Truths

The storefront uses Next.js App Router with React 19, Tailwind v4, `next/font`, and Framer Motion.

The backend uses Express 5, Prisma 5, PostgreSQL, JWT auth, bcrypt, and Stripe.

The premium brand direction is consistent across repo docs: black, gold, white, elegant serif headings, restrained sans-serif body type, and polished interactions.

The biggest integration seam is checkout:
- cart state lives in `frontend/src/context/CartContext.tsx`
- checkout posts cart items to `http://localhost:5000/api/payments/create-intent`
- that backend route is protected by JWT middleware
- the dashboard currently accepts missing auth as a demo fallback, but the payment route does not

## Working Style For This Repo

Prefer tracing real data flow before refactoring. In this project, a visually complete page may still depend on mocked data or placeholder env values.

Preserve the luxury brand feel when changing UI, but do not assume every nice-looking component is wired to backend data yet.

When a task mentions “fix the app” without narrowing scope, inspect whether the failure is in:
- frontend mock data
- frontend runtime/env wiring
- backend route behavior
- missing auth token or Stripe keys

## Common Task Patterns

For storefront-only polish or page work, switch to `$jewelary-storefront`.

For API, Prisma, auth, or Stripe work, switch to `$jewelary-backend`.
