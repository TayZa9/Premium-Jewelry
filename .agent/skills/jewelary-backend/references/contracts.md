# Contracts And Integration Notes

## Auth Contract

The backend issues JWTs containing:
- `id`
- `role`

The frontend currently stores the token in `localStorage['token']`.

Protected routes expect:
- `Authorization: Bearer <token>`

## Payment Contract

Frontend `checkout/page.tsx` posts:
- `items`

Each cart item may contain:
- `id`
- `sku`
- `name`
- `price`
- `image`
- `quantity`

The backend parses `price` whether it is already numeric or a currency-formatted string.

Successful response shape:
- `{ clientSecret }`

## Reliability Notes

If checkout fails with 401, the likely cause is missing or invalid bearer token rather than Stripe itself.

If checkout fails with a 500 and Stripe error text, inspect `STRIPE_SECRET_KEY` first.

If catalog pages do not reflect backend changes, confirm whether the frontend page is still using mock arrays or hard-coded slug handlers.
