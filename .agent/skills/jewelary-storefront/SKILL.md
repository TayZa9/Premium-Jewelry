---
name: jewelary-storefront
description: Specialized guide for the Jewelary Next.js storefront. Use when changing `frontend/src`, polishing luxury UI, updating App Router pages, modifying cart UX, wiring frontend catalog data, adjusting checkout UI, or working around the repo's current mix of mocked catalog content and live payment flow.
---

# Jewelary Storefront

Use this skill for all customer-facing work in `frontend/`.

## Read In This Order

Read `references/storefront-map.md` first.

Read `references/design-rules.md` before large visual changes or homepage/product-page redesigns.

## Frontend Operating Rules

Treat `frontend/src` and `frontend/public` as the editable source. Do not patch `frontend/.next`.

Honor `frontend/AGENTS.md`: when a task depends on less-familiar Next.js behavior, read the relevant docs in `frontend/node_modules/next/dist/docs/` before coding.

Preserve the luxury brand direction: restrained palette, elegant typography, crisp spacing, polished motion, and high-end merchandising tone.

## Data Reality

The storefront is not fully wired to the backend yet.

Current mock surfaces:
- `FeaturedProducts.tsx`
- `ProductGrid.tsx`
- `app/products/[slug]/page.tsx`

Current live-ish surface:
- `app/checkout/page.tsx` posts to the backend payment route

Before “fixing data,” determine whether the page is intentionally mocked, partially mocked, or backend-driven.

## Change Strategy

For layout or styling changes, update the page/component tree directly and verify responsive behavior.

For cart behavior, trace:
- `CartContext.tsx`
- `Header.tsx`
- `CartSlideOver.tsx`
- `ProductInfo.tsx`
- `app/checkout/page.tsx`

For product-page work, keep the gallery/info composition intact unless the user asks for a structural redesign.

For live data adoption, replace one mock seam at a time so the page remains functional while APIs are wired in.

## Common Pitfalls

`ProductInfo.tsx` adds a placeholder product ID and hard-coded fallback image to the cart. Keep that in mind when debugging cart payload issues.

`checkout/page.tsx` expects `localStorage['token']` for authenticated payment-intent creation.

`dashboard/page.tsx` is demo-friendly and not a reliable auth reference for protecting real flows.

The theme currently flips to dark mode through `prefers-color-scheme` in `globals.css`, even though the repo docs emphasize a luxury black/gold/white presentation rather than a generic dark mode.
